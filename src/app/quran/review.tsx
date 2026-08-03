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
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { getSurahMeta } from '@/data/quran';
import { getAyahText } from '@/data/quran-text';
import { useTheme } from '@/hooks/use-theme';
import { todayISO } from '@/lib/format';
import { SRS_INTERVALS_DAYS, useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';

interface ReviewItem {
  surah: number;
  ayah: number;
}

export default function ReviewScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const prefs = useSettingsStore((s) => s.quran);
  const memorization = useProgressStore((s) => s.memorization);
  const srs = useProgressStore((s) => s.srs);
  const reviewAyah = useProgressStore((s) => s.reviewAyah);

  // Tekrarı gelen ayetler: SRS kaydı olmayan (yeni ezber) veya vadesi geçen
  const initialQueue = useMemo<ReviewItem[]>(() => {
    const today = todayISO();
    const due: ReviewItem[] = [];
    for (const item of Object.values(memorization)) {
      for (const ayah of item.memorizedAyahs) {
        const entry = srs[`${item.surah}:${ayah}`];
        if (!entry || entry.dueISO <= today) due.push({ surah: item.surah, ayah });
      }
    }
    return due.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
    // Oturum başında bir kez hesaplanır; oturum içi güncellemeler kuyruk state'inde.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);

  const current = initialQueue[index];
  const finished = !current;

  const answer = (success: boolean) => {
    if (!current) return;
    reviewAyah(current.surah, current.ayah, success);
    if (success) setRememberedCount((c) => c + 1);
    void Haptics.impactAsync(
      success ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    );
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  if (initialQueue.length === 0) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('memorize.srsTitle') }} />
        <Card style={{ marginTop: Spacing.lg, alignItems: 'center', gap: Spacing.md, padding: Spacing.xl }}>
          <Ionicons name="sparkles" size={40} color={theme.primary} />
          <ThemedText variant="heading" style={{ textAlign: 'center' }}>
            {t('memorize.srsNone')}
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  if (finished) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('memorize.srsTitle') }} />
        <Card style={{ marginTop: Spacing.lg, alignItems: 'center', gap: Spacing.md, padding: Spacing.xl }}>
          <Ionicons name="checkmark-circle" size={48} color={theme.success} />
          <ThemedText variant="heading" style={{ textAlign: 'center' }}>
            {t('memorize.srsSessionDone')}
          </ThemedText>
          <ThemedText variant="secondary">
            {rememberedCount}/{initialQueue.length} · {t('memorize.srsRemembered')}
          </ThemedText>
        </Card>
      </Screen>
    );
  }

  const meta = getSurahMeta(current.surah);
  const text = getAyahText(current.surah, current.ayah);
  const entry = srs[`${current.surah}:${current.ayah}`];
  const stage = entry ? entry.stage + 1 : 0;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('memorize.srsTitle') }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm }}>
        <ThemedText variant="secondary">
          {index + 1} / {initialQueue.length}
        </ThemedText>
        <ThemedText variant="caption">
          {t('memorize.srsStage', {
            stage: Math.min(stage + 1, SRS_INTERVALS_DAYS.length),
            days: SRS_INTERVALS_DAYS[Math.min(stage, SRS_INTERVALS_DAYS.length - 1)],
          })}
        </ThemedText>
      </View>

      {/* Soru kartı */}
      <Pressable onPress={() => setRevealed(true)} accessibilityRole="button" disabled={revealed}>
        <Card
          style={{
            marginTop: Spacing.md,
            minHeight: 260,
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.md,
            padding: Spacing.lg,
          }}
        >
          <ThemedText variant="heading">
            {meta?.turkishName} · {current.ayah}. ayet
          </ThemedText>
          {revealed ? (
            <>
              <ThemedText
                variant="arabic"
                style={{
                  fontSize: prefs.fontSize,
                  lineHeight: prefs.fontSize * prefs.lineHeightMultiplier,
                  textAlign: 'center',
                }}
              >
                {text?.arabic}
              </ThemedText>
              <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
                {text?.translation}
              </ThemedText>
            </>
          ) : (
            <>
              <View
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  backgroundColor: theme.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThemedText style={{ fontSize: FontSize.xxl, color: theme.primary }}>؟</ThemedText>
              </View>
              <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
                {t('memorize.srsPrompt')}
              </ThemedText>
            </>
          )}
        </Card>
      </Pressable>

      {/* Cevap butonları */}
      {revealed ? (
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
          <Button
            title={t('memorize.srsForgot')}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => answer(false)}
          />
          <Button
            title={t('memorize.srsRemembered')}
            style={{ flex: 1 }}
            onPress={() => answer(true)}
          />
        </View>
      ) : (
        <View
          style={{
            marginTop: Spacing.md,
            alignItems: 'center',
            backgroundColor: theme.surfaceAlt,
            borderRadius: Radius.md,
            padding: Spacing.sm,
          }}
        >
          <ThemedText variant="caption">👆 {t('memorize.srsPrompt')}</ThemedText>
        </View>
      )}
    </Screen>
  );
}
