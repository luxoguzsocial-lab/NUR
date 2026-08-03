import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { KIDS_SURAHS } from '@/data/elifba';
import { getSurahMeta } from '@/data/quran';
import { getSurahText } from '@/data/quran-text';
import { infoDialog } from '@/lib/dialogs';
import { useTheme } from '@/hooks/use-theme';
import { useAyahRecitation } from '@/lib/recitation';
import { turkishTransliteration } from '@/lib/transliterate';
import { useKidsStore } from '@/store/kids';
import { useSettingsStore } from '@/store/settings';

export default function KidsSurahsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const prefs = useSettingsStore((s) => s.quran);
  const learnedSurahs = useKidsStore((s) => s.learnedSurahs);
  const toggleSurah = useKidsStore((s) => s.toggleSurah);

  const [surah, setSurah] = useState(KIDS_SURAHS[1]); // İhlâs ile başla
  const [ayahIndex, setAyahIndex] = useState(0);

  const surahText = getSurahText(surah);
  const ayahs = useMemo(() => surahText?.ayahs ?? [], [surahText]);
  const ayah = ayahs[ayahIndex];
  const meta = getSurahMeta(surah);
  const memorized = learnedSurahs.includes(surah);

  const recitation = useAyahRecitation(prefs.reciter);

  const selectSurah = (n: number) => {
    recitation.pause();
    setSurah(n);
    setAyahIndex(0);
  };

  const playCurrent = () => {
    if (!ayah) return;
    void recitation.play(surah, ayah.number).then((ok) => {
      if (!ok) infoDialog(t('common.networkError'), t('quran.reader.audioError'));
    });
  };

  const transliteration = ayah
    ? ayah.transliteration || turkishTransliteration(ayah.arabic)
    : '';

  return (
    <Screen>
      <Stack.Screen options={{ title: t('kids.sectionSurahs') }} />

      {/* Sure seçimi */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm }}>
        {KIDS_SURAHS.map((n) => {
          const m = getSurahMeta(n);
          const done = learnedSurahs.includes(n);
          return (
            <View key={n} style={{ position: 'relative' }}>
              <Chip
                label={m?.turkishName ?? String(n)}
                selected={surah === n}
                onPress={() => selectSurah(n)}
              />
              {done ? (
                <Ionicons
                  name="star"
                  size={13}
                  color={theme.accent}
                  style={{ position: 'absolute', top: -4, right: -4 }}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {ayah ? (
        <Card style={{ marginTop: Spacing.md, alignItems: 'center', gap: Spacing.sm }}>
          <ThemedText variant="caption">
            {meta?.turkishName} · {t('kids.surahAyahOf', { current: ayahIndex + 1, total: ayahs.length })}
          </ThemedText>

          <ThemedText
            variant="arabic"
            style={{
              fontSize: Math.max(30, prefs.fontSize + 6),
              lineHeight: Math.round(Math.max(30, prefs.fontSize + 6) * 1.9),
              textAlign: 'center',
            }}
          >
            {ayah.arabic}
          </ThemedText>

          <View
            style={{
              backgroundColor: theme.primarySoft,
              borderRadius: Radius.md,
              padding: Spacing.md,
              alignSelf: 'stretch',
            }}
          >
            <ThemedText style={{ fontStyle: 'italic', textAlign: 'center' }}>
              {transliteration}
            </ThemedText>
          </View>

          <View style={{ alignSelf: 'stretch', gap: 2 }}>
            <ThemedText variant="caption" style={{ textAlign: 'center' }}>
              {t('kids.surahMeaning')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {ayah.translation}
            </ThemedText>
          </View>

          <View style={{ flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch' }}>
            <Button
              title={
                recitation.isPlayingAyah(surah, ayah.number)
                  ? t('coach.listenAgain')
                  : t('kids.listen')
              }
              onPress={playCurrent}
              style={{ flex: 1 }}
            />
          </View>

          {/* Ayet gezinme */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch' }}>
            <Button
              title={t('kids.previous')}
              variant="ghost"
              onPress={() => {
                recitation.pause();
                setAyahIndex((i) => Math.max(0, i - 1));
              }}
              disabled={ayahIndex === 0}
              style={{ flex: 1 }}
            />
            <Button
              title={t('kids.next')}
              variant="ghost"
              onPress={() => {
                recitation.pause();
                setAyahIndex((i) => Math.min(ayahs.length - 1, i + 1));
              }}
              disabled={ayahIndex === ayahs.length - 1}
              style={{ flex: 1 }}
            />
          </View>

          {/* Ayet noktaları */}
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {ayahs.map((a, i) => (
              <Pressable
                key={a.number}
                onPress={() => {
                  recitation.pause();
                  setAyahIndex(i);
                }}
                accessibilityRole="button"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: i === ayahIndex ? theme.primary : theme.surfaceAlt,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              />
            ))}
          </View>

          <Button
            title={memorized ? `${t('kids.surahMemorized')} ✓` : t('kids.surahMemorized')}
            variant={memorized ? 'secondary' : 'primary'}
            onPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              toggleSurah(surah);
            }}
            style={{ alignSelf: 'stretch' }}
          />
        </Card>
      ) : null}

      <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
        {t('quran.reader.audioNote')}
      </ThemedText>
    </Screen>
  );
}
