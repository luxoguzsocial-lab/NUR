import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTrackerStore, type TrackedPrayer } from '@/store/tracker';

const TRACKED: TrackedPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function QadaScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const qada = useTrackerStore((s) => s.qada);
  const qadaFasting = useTrackerStore((s) => s.qadaFasting);
  const setQada = useTrackerStore((s) => s.setQada);
  const decrementQada = useTrackerStore((s) => s.decrementQada);
  const setQadaFasting = useTrackerStore((s) => s.setQadaFasting);
  const decrementQadaFasting = useTrackerStore((s) => s.decrementQadaFasting);

  const [editMode, setEditMode] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const totalPrayers = TRACKED.reduce((sum, p) => sum + (qada[p] ?? 0), 0);
  const hasDebt = totalPrayers > 0 || qadaFasting > 0;

  const commitDrafts = () => {
    for (const p of TRACKED) {
      const raw = drafts[p];
      if (raw !== undefined) {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n)) setQada(p, n);
      }
    }
    if (drafts.fasting !== undefined) {
      const n = parseInt(drafts.fasting, 10);
      if (Number.isFinite(n)) setQadaFasting(n);
    }
    setDrafts({});
    setEditMode(false);
  };

  const markOne = (p: TrackedPrayer) => {
    if ((qada[p] ?? 0) <= 0) return;
    decrementQada(p);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('qada.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('qada.intro')}
      </ThemedText>

      {/* Toplam özet */}
      <Card tone="primary" style={{ marginTop: Spacing.md, alignItems: 'center' }}>
        <ThemedText variant="caption">{t('qada.totalRemaining')}</ThemedText>
        <ThemedText style={{ fontSize: 56, fontWeight: '300', color: theme.primary }}>
          {totalPrayers}
        </ThemedText>
        {qadaFasting > 0 ? (
          <ThemedText variant="caption">
            + {qadaFasting} {t('qada.daysUnit')} {t('qada.fasting').toLocaleLowerCase('tr')}
          </ThemedText>
        ) : null}
        {!hasDebt ? (
          <ThemedText variant="secondary" style={{ textAlign: 'center', marginTop: Spacing.xs }}>
            {t('qada.allDone')}
          </ThemedText>
        ) : null}
      </Card>

      {/* Vakit satırları */}
      <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
        {TRACKED.map((p) => {
          const count = qada[p] ?? 0;
          return (
            <View
              key={p}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                backgroundColor: theme.surface,
                borderRadius: Radius.xl,
                borderWidth: 1,
                borderColor: theme.border,
                padding: Spacing.md,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: count > 0 ? theme.accentSoft : theme.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThemedText variant="label" color={count > 0 ? theme.accent : theme.primary}>
                  {count}
                </ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t(`prayers.${p}`)}</ThemedText>
                <ThemedText variant="caption">
                  {count} {t('qada.remaining')}
                </ThemedText>
              </View>
              {editMode ? (
                <TextInput
                  defaultValue={String(count)}
                  onChangeText={(v) => setDrafts((d) => ({ ...d, [p]: v }))}
                  keyboardType="number-pad"
                  style={{
                    width: 72,
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: Radius.md,
                    padding: Spacing.sm,
                    color: theme.text,
                    textAlign: 'center',
                  }}
                />
              ) : (
                <Pressable
                  onPress={() => markOne(p)}
                  disabled={count <= 0}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    backgroundColor: count > 0 ? theme.primary : theme.surfaceAlt,
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    opacity: pressed ? 0.8 : count > 0 ? 1 : 0.5,
                  })}
                >
                  <ThemedText variant="label" color={count > 0 ? theme.onPrimary : theme.textSecondary}>
                    {t('qada.markOne')}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          );
        })}

        {/* Kaza orucu */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
            backgroundColor: theme.surface,
            borderRadius: Radius.xl,
            borderWidth: 1,
            borderColor: theme.border,
            padding: Spacing.md,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: qadaFasting > 0 ? theme.accentSoft : theme.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="moon-outline" size={20} color={qadaFasting > 0 ? theme.accent : theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{t('qada.fasting')}</ThemedText>
            <ThemedText variant="caption">
              {qadaFasting} {t('qada.daysUnit')} {t('qada.remaining')}
            </ThemedText>
          </View>
          {editMode ? (
            <TextInput
              defaultValue={String(qadaFasting)}
              onChangeText={(v) => setDrafts((d) => ({ ...d, fasting: v }))}
              keyboardType="number-pad"
              style={{
                width: 72,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: Radius.md,
                padding: Spacing.sm,
                color: theme.text,
                textAlign: 'center',
              }}
            />
          ) : (
            <Pressable
              onPress={() => {
                if (qadaFasting > 0) {
                  decrementQadaFasting();
                  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              disabled={qadaFasting <= 0}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: qadaFasting > 0 ? theme.primary : theme.surfaceAlt,
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                opacity: pressed ? 0.8 : qadaFasting > 0 ? 1 : 0.5,
              })}
            >
              <ThemedText
                variant="label"
                color={qadaFasting > 0 ? theme.onPrimary : theme.textSecondary}
              >
                {t('qada.fastingMarkOne')}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <Button
        title={editMode ? t('common.save') : t('qada.editCounts')}
        variant={editMode ? 'primary' : 'secondary'}
        onPress={() => (editMode ? commitDrafts() : setEditMode(true))}
        style={{ marginTop: Spacing.md }}
      />
      <ThemedText variant="caption" style={{ marginTop: Spacing.sm }}>
        {t('qada.helper')}
      </ThemedText>
    </Screen>
  );
}
