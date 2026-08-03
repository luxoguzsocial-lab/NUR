import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, Pressable, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, SectionHeader, SourceBadge } from '@/components/ui-bits';
import { Stepper } from '@/components/quran/stepper';
import { Radius, Spacing } from '@/constants/theme';
import { getSurahMeta } from '@/data/quran';
import { AVAILABLE_SURAH_NUMBERS, getSurahText } from '@/data/quran-text';
import { TAJWEED_SOURCE, TAJWEED_VERIFIED } from '@/data/tajweed-guide';
import { useTheme } from '@/hooks/use-theme';
import { pickTajweedHints } from '@/lib/coach-hints';
import { infoDialog } from '@/lib/dialogs';
import { formatDateShort } from '@/lib/format';
import { useAyahRecitation } from '@/lib/recitation';
import { turkishTransliteration } from '@/lib/transliterate';
import { useCoachStore, coachKey, type CoachLevel } from '@/store/coach';
import { useSettingsStore } from '@/store/settings';

type Step = 1 | 2 | 3 | 4;

const STEP_KEYS = ['stepListen', 'stepRead', 'stepCompare', 'stepRate'] as const;

export default function CoachScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const prefs = useSettingsStore((s) => s.quran);
  const language = useSettingsStore((s) => s.language);

  const levels = useCoachStore((s) => s.levels);
  const lastPosition = useCoachStore((s) => s.lastPosition);
  const sessions = useCoachStore((s) => s.sessions);
  const rateAyah = useCoachStore((s) => s.rateAyah);
  const setLastPosition = useCoachStore((s) => s.setLastPosition);
  const logSession = useCoachStore((s) => s.logSession);

  // Oturum durumu
  const [active, setActive] = useState(false);
  const [surah, setSurah] = useState(lastPosition?.surah ?? 1);
  const [startAyahNo, setStartAyahNo] = useState(lastPosition?.ayah ?? 1);
  const [ayahIndex, setAyahIndex] = useState(0);
  const [step, setStep] = useState<Step>(1);
  const [repeatRound, setRepeatRound] = useState(false);
  const [studied, setStudied] = useState<Set<string>>(new Set());
  const [struggled, setStruggled] = useState<Set<string>>(new Set());

  const surahText = getSurahText(surah);
  const meta = getSurahMeta(surah);
  const ayahs = useMemo(() => surahText?.ayahs ?? [], [surahText]);
  const ayah = active ? ayahs[ayahIndex] : undefined;

  // Kâri sesi + yavaş mod
  const recitation = useAyahRecitation(prefs.reciter);
  const slow = recitation.rate < 1;

  // Kendi sesi
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [micDenied, setMicDenied] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const playbackPlayer = useAudioPlayer(null);
  const playbackStatus = useAudioPlayerStatus(playbackPlayer);

  const startRecording = async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setMicDenied(true);
      return;
    }
    setMicDenied(false);
    recitation.pause();
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setRecordingUri(recorder.uri);
    setStep(3);
  };

  const playMine = () => {
    if (!recordingUri) return;
    recitation.pause();
    playbackPlayer.replace({ uri: recordingUri });
    playbackPlayer.play();
  };

  const playReciter = () => {
    if (!ayah) return;
    playbackPlayer.pause();
    void recitation.play(surah, ayah.number);
  };

  // Okunuş: elle yazılmışsa o, değilse kural tabanlı yaklaşık üretim
  const transliteration = ayah
    ? ayah.transliteration || turkishTransliteration(ayah.arabic)
    : '';
  const isAutoTransliteration = !!ayah && !ayah.transliteration;
  const hints = ayah ? pickTajweedHints(ayah.arabic) : [];

  const startSession = (fromAyahNo: number) => {
    const idx = Math.max(0, ayahs.findIndex((a) => a.number === fromAyahNo));
    setAyahIndex(idx === -1 ? 0 : idx);
    setStep(1);
    setRepeatRound(false);
    setStudied(new Set());
    setStruggled(new Set());
    setRecordingUri(null);
    setActive(true);
  };

  const finishSession = (endedSurah: boolean) => {
    recitation.pause();
    playbackPlayer.pause();
    const current = ayahs[ayahIndex];
    if (!endedSurah && current) {
      setLastPosition({ surah, ayah: current.number });
    } else {
      setLastPosition(null);
    }
    if (studied.size > 0) {
      logSession({
        dateISO: new Date().toISOString(),
        studied: studied.size,
        struggled: struggled.size,
        surah,
      });
    }
    setActive(false);
    setRecordingUri(null);
    const message = [
      t('coach.summaryStudied', { count: studied.size }),
      struggled.size > 0 ? t('coach.summaryStruggled', { count: struggled.size }) : '',
      endedSurah ? t('coach.surahDone') : '',
    ]
      .filter(Boolean)
      .join('\n');
    if (studied.size > 0 || endedSurah) infoDialog(t('coach.summaryTitle'), message);
  };

  const rate = (level: CoachLevel) => {
    if (!ayah) return;
    void Haptics.selectionAsync();
    rateAyah(surah, ayah.number, level);
    setStudied((s) => new Set(s).add(coachKey(surah, ayah.number)));
    if (level === 1) {
      setStruggled((s) => new Set(s).add(coachKey(surah, ayah.number)));
      setRepeatRound(true);
      setStep(1);
      setRecordingUri(null);
      return;
    }
    setRepeatRound(false);
    setRecordingUri(null);
    if (ayahIndex < ayahs.length - 1) {
      setAyahIndex((i) => i + 1);
      setStep(1);
    } else {
      finishSession(true);
    }
  };

  // ---- İlerleme özetleri (kurulum görünümü) ----
  const totalStudied = Object.keys(levels).length;
  const totalFluent = Object.values(levels).filter((l) => l === 3).length;
  const struggledEntries = Object.entries(levels)
    .filter(([, l]) => l === 1)
    .map(([key]) => {
      const [s, a] = key.split(':').map(Number);
      return { surah: s, ayah: a };
    })
    .sort((a, b) => a.surah - b.surah || a.ayah - b.ayah)
    .slice(0, 10);

  // ---------------- Kurulum görünümü ----------------
  if (!active || !ayah) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('coach.title') }} />
        <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
          {t('coach.intro')}
        </ThemedText>

        {lastPosition ? (
          <Card tone="primary" style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="play-circle-outline" size={20} color={theme.primary} />
              <ThemedText variant="label" style={{ flex: 1 }}>
                {t('coach.continueSession')}
              </ThemedText>
            </View>
            <ThemedText variant="secondary">
              {t('coach.continueAt', {
                surah: getSurahMeta(lastPosition.surah)?.turkishName ?? lastPosition.surah,
                ayah: lastPosition.ayah,
              })}
            </ThemedText>
            <Button
              title={t('coach.continueSession')}
              onPress={() => {
                setSurah(lastPosition.surah);
                setStartAyahNo(lastPosition.ayah);
                // ayahs henüz eski sureyi gösteriyor olabilir; doğrudan hesapla
                const text = getSurahText(lastPosition.surah);
                const idx = Math.max(
                  0,
                  (text?.ayahs ?? []).findIndex((a) => a.number === lastPosition.ayah),
                );
                setAyahIndex(idx);
                setStep(1);
                setRepeatRound(false);
                setStudied(new Set());
                setStruggled(new Set());
                setRecordingUri(null);
                setActive(true);
              }}
            />
          </Card>
        ) : null}

        <SectionHeader title={t('coach.selectSurah')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {AVAILABLE_SURAH_NUMBERS.map((n) => {
            const m = getSurahMeta(n);
            return (
              <Chip
                key={n}
                label={m?.turkishName ?? String(n)}
                selected={surah === n}
                onPress={() => {
                  setSurah(n);
                  setStartAyahNo(1);
                }}
              />
            );
          })}
        </View>

        <SectionHeader title={t('coach.startAyah')} />
        <Card style={{ gap: Spacing.md }}>
          <Stepper
            label={t('coach.startAyah')}
            valueLabel={String(startAyahNo)}
            onDecrement={() => setStartAyahNo((v) => Math.max(1, v - 1))}
            onIncrement={() => setStartAyahNo((v) => Math.min(ayahs.length, v + 1))}
            decrementDisabled={startAyahNo <= 1}
            incrementDisabled={startAyahNo >= ayahs.length}
          />
          <Button title={t('coach.startSession')} onPress={() => startSession(startAyahNo)} />
        </Card>

        <SectionHeader title={t('coach.progressTitle')} />
        <Card style={{ flexDirection: 'row', gap: Spacing.lg }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 32, fontWeight: '300', color: theme.primary }}>
              {totalStudied}
            </ThemedText>
            <ThemedText variant="caption">{t('coach.progressStudied')}</ThemedText>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 32, fontWeight: '300', color: theme.success }}>
              {totalFluent}
            </ThemedText>
            <ThemedText variant="caption">{t('coach.progressFluent')}</ThemedText>
          </View>
        </Card>

        <SectionHeader title={t('coach.struggledTitle')} />
        {struggledEntries.length === 0 ? (
          <Card>
            <ThemedText variant="secondary">{t('coach.struggledEmpty')}</ThemedText>
          </Card>
        ) : (
          struggledEntries.map((e) => (
            <Card
              key={`${e.surah}:${e.ayah}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                marginBottom: Spacing.sm,
              }}
            >
              <ThemedText style={{ flex: 1 }}>
                {getSurahMeta(e.surah)?.turkishName ?? e.surah} · {e.ayah}. {t('quran.ayah')}
              </ThemedText>
              <Button
                title={t('coach.practiceThis')}
                variant="secondary"
                onPress={() => {
                  setSurah(e.surah);
                  setStartAyahNo(e.ayah);
                  const text = getSurahText(e.surah);
                  const idx = Math.max(
                    0,
                    (text?.ayahs ?? []).findIndex((a) => a.number === e.ayah),
                  );
                  setAyahIndex(idx);
                  setStep(1);
                  setRepeatRound(false);
                  setStudied(new Set());
                  setStruggled(new Set());
                  setRecordingUri(null);
                  setActive(true);
                }}
              />
            </Card>
          ))
        )}

        {sessions.length > 0 ? (
          <>
            <SectionHeader title={t('coach.recentSessions')} />
            <Card style={{ gap: Spacing.xs }}>
              {sessions.slice(0, 5).map((s, i) => (
                <ThemedText key={i} variant="secondary">
                  {t('coach.sessionLine', {
                    date: formatDateShort(new Date(s.dateISO), language),
                    surah: getSurahMeta(s.surah)?.turkishName ?? s.surah,
                    studied: s.studied,
                  })}
                </ThemedText>
              ))}
            </Card>
          </>
        ) : null}

        <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
          {t('coach.micNote')}
        </ThemedText>
      </Screen>
    );
  }

  // ---------------- Çalışma görünümü ----------------
  return (
    <Screen>
      <Stack.Screen options={{ title: t('coach.title') }} />

      {/* Üst bilgi */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Spacing.sm,
          gap: Spacing.sm,
        }}
      >
        <ThemedText variant="heading" style={{ flex: 1 }}>
          {t('coach.ayahOf', {
            surah: meta?.turkishName ?? surah,
            current: ayah.number,
            total: ayahs.length,
          })}
        </ThemedText>
        <Button title={t('coach.endSession')} variant="ghost" onPress={() => finishSession(false)} />
      </View>

      {/* Adım göstergesi */}
      <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm }}>
        {STEP_KEYS.map((key, i) => {
          const n = (i + 1) as Step;
          const isCurrent = step === n;
          const isPast = step > n;
          return (
            <Pressable
              key={key}
              onPress={() => setStep(n)}
              accessibilityRole="button"
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: Spacing.xs,
                borderRadius: Radius.md,
                backgroundColor: isCurrent ? theme.primary : isPast ? theme.primarySoft : theme.surfaceAlt,
              }}
            >
              <ThemedText
                variant="caption"
                color={isCurrent ? theme.onPrimary : isPast ? theme.primary : theme.textSecondary}
              >
                {i + 1}. {t(`coach.${key}`)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {repeatRound ? (
        <Card tone="accent" style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="secondary">{t('coach.repeatNote')}</ThemedText>
        </Card>
      ) : null}

      {/* Ayet kartı */}
      <Card style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
        <ThemedText
          variant="arabic"
          style={{
            fontSize: prefs.fontSize,
            lineHeight: Math.round(prefs.fontSize * prefs.lineHeightMultiplier),
          }}
        >
          {ayah.arabic}
        </ThemedText>
        <View
          style={{
            backgroundColor: theme.primarySoft,
            borderRadius: Radius.md,
            padding: Spacing.md,
            gap: 2,
          }}
        >
          <ThemedText variant="caption" color={theme.primary}>
            {t('coach.transliterationLabel')}
            {isAutoTransliteration ? ' · ~' : ''}
          </ThemedText>
          <ThemedText style={{ fontStyle: 'italic' }}>{transliteration}</ThemedText>
        </View>
        <View style={{ gap: 2 }}>
          <ThemedText variant="caption">{t('coach.meaningLabel')}</ThemedText>
          <ThemedText variant="secondary">{ayah.translation}</ThemedText>
        </View>
      </Card>

      {/* Tecvit ipucu */}
      {hints.length > 0 ? (
        <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="color-palette-outline" size={16} color={theme.accent} />
            <ThemedText variant="label">{t('coach.tajweedHintTitle')}</ThemedText>
          </View>
          {hints.map((h) => (
            <View key={h.rule} style={{ gap: 2 }}>
              <ThemedText variant="secondary" style={{ fontWeight: '600' }}>
                {h.name}
              </ThemedText>
              <ThemedText variant="caption">{h.description}</ThemedText>
            </View>
          ))}
          <ThemedText variant="caption">{t('coach.tajweedHintNote')}</ThemedText>
          <SourceBadge source={TAJWEED_SOURCE} verified={TAJWEED_VERIFIED} />
        </Card>
      ) : null}

      {/* Adım içeriği */}
      {step === 1 ? (
        <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
          <ThemedText variant="secondary">{t('coach.listenHint')}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText style={{ flex: 1 }}>{t('coach.slowMode')}</ThemedText>
            <Switch
              value={slow}
              onValueChange={(v) => recitation.setRate(v ? 0.75 : 1)}
              trackColor={{ true: theme.primary, false: theme.border }}
              thumbColor={theme.surface}
            />
          </View>
          <Button
            title={
              recitation.isPlayingAyah(surah, ayah.number)
                ? t('coach.listenAgain')
                : t('coach.listenButton')
            }
            onPress={playReciter}
          />
          <Button title={t('coach.stepRead')} variant="secondary" onPress={() => setStep(2)} />
        </Card>
      ) : null}

      {step === 2 ? (
        micDenied ? (
          <Card tone="accent" style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="mic-off-outline" size={20} color={theme.accent} />
              <ThemedText variant="label">{t('memorize.micDeniedTitle')}</ThemedText>
            </View>
            <ThemedText variant="secondary">{t('memorize.micDeniedBody')}</ThemedText>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Button
                title={t('common.openSettings')}
                variant="secondary"
                onPress={() => void Linking.openSettings()}
                style={{ flex: 1 }}
              />
              <Button
                title={t('coach.skipRecording')}
                variant="ghost"
                onPress={() => setStep(4)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : (
          <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
            <ThemedText variant="secondary">{t('coach.readHint')}</ThemedText>
            {Platform.OS === 'web' ? (
              <ThemedText variant="caption">{t('coach.webRecordingNote')}</ThemedText>
            ) : null}
            {recorderState.isRecording ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Ionicons name="radio-button-on" size={16} color={theme.danger} />
                <ThemedText variant="secondary">
                  {t('coach.recordingSeconds', {
                    seconds: Math.round(recorderState.durationMillis / 1000),
                  })}
                </ThemedText>
              </View>
            ) : null}
            <Button
              title={recorderState.isRecording ? t('coach.recordStop') : t('coach.recordStart')}
              variant={recorderState.isRecording ? 'danger' : 'primary'}
              onPress={() => {
                if (recorderState.isRecording) void stopRecording();
                else void startRecording();
              }}
            />
            <Button title={t('coach.skipRecording')} variant="ghost" onPress={() => setStep(4)} />
          </Card>
        )
      ) : null}

      {step === 3 ? (
        <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
          <ThemedText variant="secondary">{t('coach.compareHint')}</ThemedText>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Button
              title={
                playbackStatus.playing ? t('memorize.stopPlayback') : t('coach.playMine')
              }
              variant="secondary"
              onPress={() => {
                if (playbackStatus.playing) playbackPlayer.pause();
                else playMine();
              }}
              style={{ flex: 1 }}
              disabled={!recordingUri}
            />
            <Button
              title={t('coach.playReciter')}
              variant="secondary"
              onPress={playReciter}
              style={{ flex: 1 }}
            />
          </View>
          <Button title={t('coach.recordAgain')} variant="ghost" onPress={() => setStep(2)} />
          <Button title={t('coach.stepRate')} onPress={() => setStep(4)} />
        </Card>
      ) : null}

      {step === 4 ? (
        <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
          <ThemedText variant="secondary">{t('coach.rateHint')}</ThemedText>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {(
              [
                { level: 1 as CoachLevel, label: t('coach.rateHard'), icon: 'refresh-outline' as const },
                { level: 2 as CoachLevel, label: t('coach.rateOk'), icon: 'thumbs-up-outline' as const },
                { level: 3 as CoachLevel, label: t('coach.rateFluent'), icon: 'sparkles-outline' as const },
              ]
            ).map((o) => (
              <Pressable
                key={o.level}
                onPress={() => rate(o.level)}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: 'center',
                  gap: Spacing.xs,
                  paddingVertical: Spacing.md,
                  borderRadius: Radius.lg,
                  borderWidth: 1,
                  borderColor: theme.border,
                  backgroundColor: pressed ? theme.primarySoft : theme.surfaceAlt,
                })}
              >
                <Ionicons name={o.icon} size={20} color={theme.primary} />
                <ThemedText variant="caption" style={{ textAlign: 'center' }}>
                  {o.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
        {t('coach.micNote')}
      </ThemedText>
    </Screen>
  );
}
