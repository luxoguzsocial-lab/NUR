import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, ProgressBar, SectionHeader, SourceBadge } from '@/components/ui-bits';
import { Stepper } from '@/components/quran/stepper';
import { Radius, Spacing } from '@/constants/theme';
import { getSurahMeta } from '@/data/quran';
import {
  AVAILABLE_SURAH_NUMBERS,
  QURAN_TEXT_SOURCE,
  getSurahText,
} from '@/data/quran-text';
import { infoDialog } from '@/lib/dialogs';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort } from '@/lib/format';
import { useAyahRecitation } from '@/lib/recitation';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';

const REPEAT_OPTIONS = [3, 5, 10] as const;
const REVIEW_DUE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Son tekrar 7 günden eskiyse (veya hiç yoksa) tekrar zamanı gelmiştir. */
function isReviewDue(lastReviewISO?: string): boolean {
  if (!lastReviewISO) return true;
  return Date.now() - new Date(lastReviewISO).getTime() > REVIEW_DUE_DAYS * DAY_MS;
}

interface StudySession {
  /** Ayet dizisi içindeki indeks */
  index: number;
  /** Kaçıncı tekrar (1 tabanlı) */
  rep: number;
}

export default function MemorizeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  const prefs = useSettingsStore((s) => s.quran);
  const dailyGoal = useSettingsStore((s) => s.dailyMemorizationGoalAyahs);
  const setSetting = useSettingsStore((s) => s.set);
  const language = useSettingsStore((s) => s.language);

  const memorization = useProgressStore((s) => s.memorization);
  const toggleMemorizedAyah = useProgressStore((s) => s.toggleMemorizedAyah);
  const markReviewed = useProgressStore((s) => s.markReviewed);

  const [selectedSurah, setSelectedSurah] = useState(AVAILABLE_SURAH_NUMBERS[0] ?? 1);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(() => Math.max(0, (getSurahText(AVAILABLE_SURAH_NUMBERS[0] ?? 1)?.ayahs.length ?? 1) - 1));
  const [repeatCount, setRepeatCount] = useState<number>(3);
  const [pauseSeconds, setPauseSeconds] = useState(3);
  const [hideArabic, setHideArabic] = useState(false);
  const [hideTranslation, setHideTranslation] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [sessionMarked, setSessionMarked] = useState(0);

  const surahText = getSurahText(selectedSurah);
  const meta = getSurahMeta(selectedSurah);
  const ayahs = useMemo(() => surahText?.ayahs ?? [], [surahText]);

  // Sesli tekrar
  const recitation = useAyahRecitation(prefs.reciter);
  const [session, setSession] = useState<StudySession | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledFinishRef = useRef(false);

  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSession(null);
    setWaiting(false);
    recitation.pause();
  }, [recitation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const selectSurah = (surah: number) => {
    stopSession();
    setAudioFinished(false);
    setSelectedSurah(surah);
    const text = getSurahText(surah);
    setFromIdx(0);
    setToIdx(Math.max(0, (text?.ayahs.length ?? 1) - 1));
    setRevealed(new Set());
  };

  const startSession = async () => {
    setAudioFinished(false);
    const first = ayahs[fromIdx];
    if (!first) return;
    setSession({ index: fromIdx, rep: 1 });
    handledFinishRef.current = false;
    const ok = await recitation.play(selectedSurah, first.number);
    if (!ok) setSession(null);
  };

  // Tekrar döngüsü: ayet bitti -> bekle -> tekrar / sonraki ayet.
  useEffect(() => {
    if (!session) return;
    if (recitation.status.playing) {
      handledFinishRef.current = false;
      return;
    }
    if (!recitation.status.didJustFinish || handledFinishRef.current) return;
    handledFinishRef.current = true;
    setWaiting(true);
    timerRef.current = setTimeout(() => {
      setWaiting(false);
      if (session.rep < repeatCount) {
        setSession({ index: session.index, rep: session.rep + 1 });
        void recitation.replay();
      } else if (session.index < toIdx) {
        const nextIndex = session.index + 1;
        const nextAyah = ayahs[nextIndex];
        setSession({ index: nextIndex, rep: 1 });
        if (nextAyah) {
          void recitation.play(selectedSurah, nextAyah.number).then((ok) => {
            if (!ok) stopSession();
          });
        }
      } else {
        setSession(null);
        setAudioFinished(true);
      }
    }, pauseSeconds * 1000);
  }, [
    recitation,
    recitation.status.didJustFinish,
    recitation.status.playing,
    session,
    repeatCount,
    pauseSeconds,
    toIdx,
    ayahs,
    selectedSurah,
    stopSession,
  ]);

  // Ağ hatasında nazik uyarı.
  useEffect(() => {
    if (recitation.networkError) {
      infoDialog(t('common.networkError'), t('quran.reader.audioError'), () => {
        recitation.clearNetworkError();
        stopSession();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recitation.networkError]);

  // Kendi sesini kaydetme
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
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setRecordingUri(recorder.uri);
  };

  const playRecording = () => {
    if (!recordingUri) return;
    playbackPlayer.replace({ uri: recordingUri });
    playbackPlayer.play();
  };

  // Özet ve tekrar programı
  const totalMemorized = Object.values(memorization).reduce(
    (sum, item) => sum + item.memorizedAyahs.length,
    0,
  );
  const surahMemorized = memorization[selectedSurah]?.memorizedAyahs ?? [];
  const reviewEntries = Object.values(memorization).filter((m) => m.memorizedAyahs.length > 0);

  const currentAyah = session ? ayahs[session.index] : undefined;
  const rangeAyahs = ayahs.slice(fromIdx, toIdx + 1);

  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('memorize.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('memorize.intro')}
      </ThemedText>

      {/* Sure seçimi */}
      <SectionHeader title={t('memorize.selectSurah')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {AVAILABLE_SURAH_NUMBERS.map((surah) => {
          const m = getSurahMeta(surah);
          return (
            <Chip
              key={surah}
              label={m?.turkishName ?? String(surah)}
              selected={selectedSurah === surah}
              onPress={() => selectSurah(surah)}
            />
          );
        })}
      </View>
      {surahText && !surahText.complete ? (
        <ThemedText variant="caption" style={{ marginTop: Spacing.sm }}>
          {t('memorize.partialSurahNote')}
        </ThemedText>
      ) : null}

      {/* Ayet aralığı */}
      <SectionHeader title={t('memorize.selectRange')} />
      <Card style={{ gap: Spacing.md }}>
        <Stepper
          label={t('memorize.rangeFrom')}
          valueLabel={String(ayahs[fromIdx]?.number ?? '-')}
          onDecrement={() => setFromIdx((v) => Math.max(0, v - 1))}
          onIncrement={() => setFromIdx((v) => Math.min(toIdx, v + 1))}
          decrementDisabled={fromIdx <= 0}
          incrementDisabled={fromIdx >= toIdx}
        />
        <Stepper
          label={t('memorize.rangeTo')}
          valueLabel={String(ayahs[toIdx]?.number ?? '-')}
          onDecrement={() => setToIdx((v) => Math.max(fromIdx, v - 1))}
          onIncrement={() => setToIdx((v) => Math.min(ayahs.length - 1, v + 1))}
          decrementDisabled={toIdx <= fromIdx}
          incrementDisabled={toIdx >= ayahs.length - 1}
        />
        <ThemedText variant="caption">
          {t('memorize.rangeSummary', {
            from: ayahs[fromIdx]?.number ?? 0,
            to: ayahs[toIdx]?.number ?? 0,
            count: rangeAyahs.length,
          })}
        </ThemedText>
      </Card>

      {/* Tekrar ayarları */}
      <Card style={{ gap: Spacing.md, marginTop: Spacing.sm }}>
        <View style={{ gap: Spacing.sm }}>
          <ThemedText variant="label">{t('memorize.repeatCount')}</ThemedText>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {REPEAT_OPTIONS.map((count) => (
              <Chip
                key={count}
                label={String(count)}
                selected={repeatCount === count}
                onPress={() => setRepeatCount(count)}
              />
            ))}
          </View>
        </View>
        <Stepper
          label={t('memorize.pauseSeconds')}
          valueLabel={t('memorize.secondsShort', { count: pauseSeconds })}
          onDecrement={() => setPauseSeconds((v) => Math.max(0, v - 1))}
          onIncrement={() => setPauseSeconds((v) => Math.min(10, v + 1))}
          decrementDisabled={pauseSeconds <= 0}
          incrementDisabled={pauseSeconds >= 10}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText style={{ flex: 1 }}>{t('memorize.hideArabic')}</ThemedText>
          <Switch
            value={hideArabic}
            onValueChange={(v) => {
              setHideArabic(v);
              setRevealed(new Set());
            }}
            trackColor={{ true: theme.primary, false: theme.border }}
            thumbColor={theme.surface}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText style={{ flex: 1 }}>{t('memorize.hideTranslation')}</ThemedText>
          <Switch
            value={hideTranslation}
            onValueChange={(v) => {
              setHideTranslation(v);
              setRevealed(new Set());
            }}
            trackColor={{ true: theme.primary, false: theme.border }}
            thumbColor={theme.surface}
          />
        </View>
      </Card>

      {/* Sesli tekrar */}
      <SectionHeader title={t('memorize.audioSection')} />
      <Card style={{ gap: Spacing.sm }}>
        {session && currentAyah ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="musical-notes-outline" size={16} color={theme.primary} />
            <ThemedText variant="secondary" style={{ flex: 1 }}>
              {waiting
                ? t('memorize.waitingNext')
                : t('memorize.nowPlaying', {
                    ayah: currentAyah.number,
                    current: session.rep,
                    total: repeatCount,
                  })}
            </ThemedText>
          </View>
        ) : null}
        {audioFinished ? (
          <ThemedText variant="caption" color={theme.success}>
            {t('memorize.audioFinished')}
          </ThemedText>
        ) : null}
        <Button
          title={session ? t('memorize.stopAudio') : t('memorize.startAudio')}
          variant={session ? 'danger' : 'primary'}
          onPress={() => {
            if (session) stopSession();
            else void startSession();
          }}
        />
        <ThemedText variant="caption">{t('quran.reader.audioNote')}</ThemedText>
      </Card>

      {/* Çalışma kartları */}
      <SectionHeader title={t('memorize.markMemorized')} />
      {rangeAyahs.map((ayah) => {
        const key = `${selectedSurah}:${ayah.number}`;
        const memorized = surahMemorized.includes(ayah.number);
        const isRevealed = revealed.has(key);
        const showArabic = !hideArabic || isRevealed;
        const showTranslation = !hideTranslation || isRevealed;
        return (
          <Card key={key} style={{ gap: Spacing.sm, marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View
                style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: Radius.full,
                  backgroundColor: theme.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: Spacing.xs,
                }}
              >
                <ThemedText variant="caption" color={theme.primary}>
                  {ayah.number}
                </ThemedText>
              </View>
              {memorized ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                  <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                  <ThemedText variant="caption" color={theme.success}>
                    {t('memorize.memorizedBadge')}
                  </ThemedText>
                </View>
              ) : null}
            </View>

            {showArabic ? (
              <ThemedText
                variant="arabic"
                style={{
                  fontSize: prefs.fontSize,
                  lineHeight: Math.round(prefs.fontSize * prefs.lineHeightMultiplier),
                }}
              >
                {ayah.arabic}
              </ThemedText>
            ) : (
              <Pressable
                onPress={() => toggleReveal(key)}
                accessibilityRole="button"
                style={{
                  backgroundColor: theme.surfaceAlt,
                  borderRadius: Radius.md,
                  padding: Spacing.md,
                  alignItems: 'center',
                }}
              >
                <ThemedText variant="caption">{t('memorize.showHidden')}</ThemedText>
              </Pressable>
            )}
            {ayah.transliteration ? (
              <ThemedText variant="secondary" style={{ fontStyle: 'italic' }}>
                {ayah.transliteration}
              </ThemedText>
            ) : null}
            {showTranslation ? (
              <ThemedText variant="secondary">{ayah.translation}</ThemedText>
            ) : (
              <Pressable
                onPress={() => toggleReveal(key)}
                accessibilityRole="button"
                style={{
                  backgroundColor: theme.surfaceAlt,
                  borderRadius: Radius.md,
                  padding: Spacing.sm,
                  alignItems: 'center',
                }}
              >
                <ThemedText variant="caption">{t('memorize.showHidden')}</ThemedText>
              </Pressable>
            )}

            <Button
              title={memorized ? t('memorize.memorizedBadge') : t('memorize.markMemorized')}
              variant={memorized ? 'secondary' : 'primary'}
              onPress={() => {
                void Haptics.selectionAsync();
                if (!memorized) setSessionMarked((v) => v + 1);
                else setSessionMarked((v) => Math.max(0, v - 1));
                toggleMemorizedAyah(selectedSurah, ayah.number);
              }}
            />
          </Card>
        );
      })}

      {/* Kendi sesinle çalış */}
      <SectionHeader title={t('memorize.recordingTitle')} />
      {micDenied ? (
        <Card tone="accent" style={{ gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="mic-off-outline" size={20} color={theme.accent} />
            <ThemedText variant="label">{t('memorize.micDeniedTitle')}</ThemedText>
          </View>
          <ThemedText variant="secondary">{t('memorize.micDeniedBody')}</ThemedText>
          <Button
            title={t('common.openSettings')}
            variant="secondary"
            onPress={() => void Linking.openSettings()}
          />
        </Card>
      ) : (
        <Card style={{ gap: Spacing.sm }}>
          <ThemedText variant="caption">{t('memorize.recordingHint')}</ThemedText>
          {recorderState.isRecording ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="radio-button-on" size={16} color={theme.danger} />
              <ThemedText variant="secondary">
                {t('memorize.recordingInProgress', {
                  seconds: Math.round(recorderState.durationMillis / 1000),
                })}
              </ThemedText>
            </View>
          ) : null}
          <Button
            title={recorderState.isRecording ? t('memorize.recordStop') : t('memorize.recordStart')}
            variant={recorderState.isRecording ? 'danger' : 'primary'}
            onPress={() => {
              if (recorderState.isRecording) void stopRecording();
              else void startRecording();
            }}
          />
          {recordingUri ? (
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Button
                title={
                  playbackStatus.playing ? t('memorize.stopPlayback') : t('memorize.playRecording')
                }
                variant="secondary"
                onPress={() => {
                  if (playbackStatus.playing) playbackPlayer.pause();
                  else playRecording();
                }}
                style={{ flex: 1 }}
              />
              <Button
                title={t('memorize.deleteRecording')}
                variant="ghost"
                onPress={() => {
                  playbackPlayer.pause();
                  setRecordingUri(null);
                }}
                style={{ flex: 1 }}
              />
            </View>
          ) : null}
        </Card>
      )}

      {/* Günlük hedef */}
      <SectionHeader title={t('memorize.dailyGoalTitle')} />
      <Card style={{ gap: Spacing.md }}>
        <Stepper
          label={t('memorize.dailyGoalValue', { count: dailyGoal })}
          valueLabel={String(dailyGoal)}
          onDecrement={() => setSetting('dailyMemorizationGoalAyahs', Math.max(1, dailyGoal - 1))}
          onIncrement={() => setSetting('dailyMemorizationGoalAyahs', Math.min(20, dailyGoal + 1))}
          decrementDisabled={dailyGoal <= 1}
          incrementDisabled={dailyGoal >= 20}
        />
        <ProgressBar ratio={dailyGoal > 0 ? sessionMarked / dailyGoal : 0} />
        <ThemedText variant="caption">{t('memorize.sessionMarked', { count: sessionMarked })}</ThemedText>
      </Card>

      {/* Tekrar programı */}
      <SectionHeader title={t('memorize.reviewTitle')} />
      <Button
        title={t('memorize.srsStart')}
        onPress={() => router.push('/quran/review')}
        style={{ marginBottom: Spacing.sm }}
      />
      <Button
        title={t('memorize.srsStart')}
        onPress={() => router.push('/quran/review')}
        style={{ marginBottom: Spacing.sm }}
      />
      <ThemedText variant="caption">{t('memorize.reviewHint')}</ThemedText>
      {reviewEntries.length === 0 ? (
        <Card style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="secondary">{t('memorize.reviewEmpty')}</ThemedText>
        </Card>
      ) : (
        reviewEntries.map((entry) => {
          const entryMeta = getSurahMeta(entry.surah);
          const due = isReviewDue(entry.lastReviewISO);
          return (
            <Card key={entry.surah} style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <ThemedText variant="label">
                  {entryMeta?.turkishName ?? entry.surah} ·{' '}
                  {t('memorize.surahProgress', {
                    done: entry.memorizedAyahs.length,
                    total:
                      getSurahText(entry.surah)?.complete === false
                        ? getSurahText(entry.surah)?.ayahs.length
                        : entryMeta?.ayahCount ?? entry.memorizedAyahs.length,
                  })}
                </ThemedText>
                <View
                  style={{
                    backgroundColor: due ? theme.accentSoft : theme.primarySoft,
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                  }}
                >
                  <ThemedText variant="caption" color={due ? theme.accent : theme.primary}>
                    {due ? t('memorize.reviewDue') : t('memorize.reviewFresh')}
                  </ThemedText>
                </View>
              </View>
              <ThemedText variant="caption">
                {entry.lastReviewISO
                  ? t('memorize.lastReview', {
                      date: formatDateShort(new Date(entry.lastReviewISO), language),
                    })
                  : t('memorize.neverReviewed')}
              </ThemedText>
              {due ? (
                <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                  <Button
                    title={t('memorize.markReviewed')}
                    variant="secondary"
                    onPress={() => {
                      void Haptics.selectionAsync();
                      markReviewed(entry.surah);
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              ) : null}
            </Card>
          );
        })
      )}

      {/* Özet */}
      <SectionHeader title={t('memorize.summaryTitle')} />
      <Card style={{ gap: Spacing.sm }}>
        <ThemedText>{t('memorize.totalMemorized', { count: totalMemorized })}</ThemedText>
        {meta ? (
          <ThemedText variant="secondary">
            {meta.turkishName}:{' '}
            {t('memorize.surahProgress', {
              done: surahMemorized.length,
              total: surahText && !surahText.complete ? ayahs.length : meta.ayahCount,
            })}
          </ThemedText>
        ) : null}
        <SourceBadge source={QURAN_TEXT_SOURCE} />
      </Card>
    </Screen>
  );
}
