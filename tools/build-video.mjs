/**
 * Video üretim hattı:
 *   1. Edge TTS (tr-TR-AhmetNeural) ile seslendirme üretir (tools/narration/<id>.mp3)
 *   2. Ham görsel klibi (tools/raw/<id>.mp4) seslendirme süresine kadar döngüler
 *   3. Altyazıları videonun ORTA bölgesine (y = %52) gömer — satır zamanlaması
 *      seslendirme süresine eşit bölünür
 *   4. Sesi miksler, 576x1024 H.264 olarak assets/videos/<id>.mp4 yazar
 *
 * Kullanım:
 *   node tools/build-video.mjs v1 v2 ...   — belirtilen id'ler
 *   node tools/build-video.mjs --all       — tools/raw/ altında klibi olan bütün id'ler
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VIDEO_TEXTS } from './video-texts.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = join(ROOT, 'tools', 'raw');
const NARR_DIR = join(ROOT, 'tools', 'narration');
const TMP_DIR = join(ROOT, 'tools', 'tmp');
const OUT_DIR = join(ROOT, 'assets', 'videos');
const FFMPEG = (await import('ffmpeg-static')).default;
// Yaşlı-bilge ton (kullanıcı seçimi): Giuseppe — sıcak, olgun bariton
const VOICE = 'it-IT-GiuseppeMultilingualNeural';
const PROSODY = { rate: '-15%', pitch: '-12%' };
const FONT = 'C\\:/Windows/Fonts/arialbd.ttf';

for (const d of [RAW_DIR, NARR_DIR, TMP_DIR, OUT_DIR]) mkdirSync(d, { recursive: true });

async function synthesize(id, text) {
  const outPath = join(NARR_DIR, `${id}.mp3`);
  if (existsSync(outPath)) return outPath;
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(text, PROSODY);
  const chunks = [];
  await new Promise((resolve, reject) => {
    audioStream.on('data', (c) => chunks.push(c));
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
  });
  tts.close();
  writeFileSync(outPath, Buffer.concat(chunks));
  return outPath;
}

function probeDurationSec(file) {
  const res = spawnSync(FFMPEG, ['-i', file, '-f', 'null', '-'], { encoding: 'utf8' });
  const match = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(res.stderr);
  if (!match) throw new Error(`Süre okunamadı: ${file}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

/** Satırı ~26 karakterde sararak drawtext için çok satırlı metin dosyası yazar. */
function wrapText(line, width = 26) {
  const words = line.split(' ');
  const rows = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > width && current) {
      rows.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }
  if (current.trim()) rows.push(current.trim());
  return rows.join('\n');
}

async function build(id) {
  const texts = VIDEO_TEXTS[id];
  if (!texts) throw new Error(`Bilinmeyen video id: ${id}`);
  const rawPath = join(RAW_DIR, `${id}.mp4`);
  if (!existsSync(rawPath)) {
    console.log(`⏭  ${id}: ham klip yok (${rawPath}) — atlandı`);
    return false;
  }

  console.log(`🎙  ${id}: seslendirme üretiliyor...`);
  const narrationPath = await synthesize(id, texts.speech);
  const audioDur = probeDurationSec(narrationPath);
  const totalDur = audioDur + 0.8;

  // Satır başına eşit süre; altyazı metin dosyaları (Türkçe karakter kaçış derdi yok)
  const perLine = audioDur / texts.lines.length;
  const drawtexts = texts.lines.map((line, i) => {
    const textFile = join(TMP_DIR, `${id}-sub-${i}.txt`);
    writeFileSync(textFile, wrapText(line), 'utf8');
    const start = (i * perLine).toFixed(2);
    const end = (i === texts.lines.length - 1 ? totalDur : (i + 1) * perLine).toFixed(2);
    const tf = textFile.replaceAll('\\', '/').replace(':', '\\:');
    // Altyazı videonun orta-görünür bölgesinde: y = yüksekliğin %52'si
    return (
      `drawtext=fontfile='${FONT}':textfile='${tf}':fontsize=30:fontcolor=white:` +
      `borderw=2:bordercolor=black@0.85:box=1:boxcolor=black@0.42:boxborderw=16:` +
      `x=(w-text_w)/2:y=h*0.52:line_spacing=8:enable='between(t,${start},${end})'`
    );
  });

  const filter =
    `[0:v]scale=576:1024:force_original_aspect_ratio=increase,crop=576:1024,fps=30,` +
    drawtexts.join(',') +
    `[v]`;

  const outPath = join(OUT_DIR, `${id}.mp4`);
  console.log(`🎬  ${id}: ffmpeg birleştiriyor (ses ${audioDur.toFixed(1)} sn)...`);
  execFileSync(
    FFMPEG,
    [
      '-y',
      '-stream_loop', '-1', '-i', rawPath,
      '-i', narrationPath,
      '-filter_complex', filter,
      '-map', '[v]', '-map', '1:a',
      '-t', String(totalDur),
      '-c:v', 'libx264', '-crf', '27', '-preset', 'medium', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '96k',
      '-movflags', '+faststart',
      outPath,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const sizeMb = (await import('node:fs')).statSync(outPath).size / 1024 / 1024;
  console.log(`✅  ${id}: ${outPath} (${sizeMb.toFixed(1)} MB, ${totalDur.toFixed(1)} sn)`);
  return true;
}

const args = process.argv.slice(2);
const ids = args.includes('--all')
  ? readdirSync(RAW_DIR).filter((f) => f.endsWith('.mp4')).map((f) => f.replace('.mp4', ''))
  : args;
if (ids.length === 0) {
  console.log('Kullanım: node tools/build-video.mjs <id...> | --all');
  process.exit(1);
}
let built = 0;
for (const id of ids) {
  if (await build(id)) built++;
}
console.log(`\nBitti: ${built}/${ids.length} video üretildi.`);
