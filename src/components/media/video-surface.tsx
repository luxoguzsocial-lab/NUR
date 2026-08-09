import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView, type VideoSource } from 'expo-video';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

/**
 * Gerçek video dosyası olan içerikler için oynatma yüzeyi.
 * Kaynağı olmayan videolar feed'deki gradyan demo yüzeyini kullanmaya devam eder.
 */
export function VideoSurface({
  source,
  playing,
  loop = true,
  muted = false,
  playbackRate = 1,
  contentFit = 'contain',
  onToggle,
}: {
  source: VideoSource;
  playing: boolean;
  loop?: boolean;
  muted?: boolean;
  playbackRate?: number;
  /** Altyazılar videoya gömülü olduğundan varsayılan 'contain'; kırpma içerik kaybettirir. */
  contentFit?: 'contain' | 'cover';
  onToggle?: () => void;
}) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
  });

  // expo-video player nesnesi tasarımı gereği yerinde güncellenir (belgelenen API).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    player.playbackRate = playbackRate;
    if (playing) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, playing, playbackRate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    player.muted = muted;
  }, [player, muted]);

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onToggle} disabled={!onToggle}>
      <VideoView
        player={player}
        // Web'de stil doğrudan <video> elementine uygulanır; width/height verilmezse
        // element kendi doğal boyutunda kalıp ekrandan taşar.
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        contentFit={contentFit}
        nativeControls={false}
      />
      {!playing ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
          ]}
        >
          <Ionicons name="play-circle" size={72} color="rgba(255,255,255,0.9)" />
        </View>
      ) : null}
    </Pressable>
  );
}
