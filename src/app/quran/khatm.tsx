import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, ProgressBar, SectionHeader } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { TOTAL_QURAN_PAGES } from '@/data/quran';
import { confirmDialog } from '@/lib/dialogs';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, todayISO } from '@/lib/format';
import { useProgressStore, type KhatmPlan } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';

const DAY_MS = 24 * 60 * 60 * 1000;
const PRESET_DAYS = [30, 60, 90] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** "GG.AA.YYYY" veya "YYYY-AA-GG" biçiminde tarih dizesini çözümler. */
function parseCustomDate(input: string): Date | null {
  const trimmed = input.trim();
  let y = 0;
  let m = 0;
  let d = 0;
  const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  const dashed = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (dotted) {
    d = Number(dotted[1]);
    m = Number(dotted[2]);
    y = Number(dotted[3]);
  } else if (dashed) {
    y = Number(dashed[1]);
    m = Number(dashed[2]);
    d = Number(dashed[3]);
  } else {
    return null;
  }
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

interface PlanStats {
  basePages: number;
  completedCount: number;
  completedPages: number;
  remainingPages: number;
  /** Bugünün 0 tabanlı gün indeksi (plan bittiyse totalDays-1'e kırpılır) */
  todayIndex: number;
  /** Plan süresi doldu mu */
  ended: boolean;
  /** Bugün dahil kalan gün */
  remainingDays: number;
  todayPages: number;
  missedDays: number;
  percent: number;
  finished: boolean;
}

function computeStats(plan: KhatmPlan): PlanStats {
  const basePages = Math.ceil(TOTAL_QURAN_PAGES / plan.totalDays);
  const completedCount = plan.completedDays.length;
  const completedPages = Math.min(TOTAL_QURAN_PAGES, completedCount * basePages);
  const remainingPages = TOTAL_QURAN_PAGES - completedPages;
  const rawIndex = Math.floor(
    (startOfDay(new Date()).getTime() - startOfDay(parseISODate(plan.startDateISO)).getTime()) / DAY_MS,
  );
  const ended = rawIndex >= plan.totalDays;
  const todayIndex = Math.min(Math.max(rawIndex, 0), plan.totalDays - 1);
  const remainingDays = Math.max(1, plan.totalDays - todayIndex);
  const todayPages = Math.min(TOTAL_QURAN_PAGES, Math.ceil(remainingPages / remainingDays));
  const missedDays = Array.from({ length: todayIndex }, (_, i) => i).filter(
    (i) => !plan.completedDays.includes(i),
  ).length;
  const percent = Math.min(100, Math.round((completedPages / TOTAL_QURAN_PAGES) * 100));
  return {
    basePages,
    completedCount,
    completedPages,
    remainingPages,
    todayIndex,
    ended,
    remainingDays,
    todayPages,
    missedDays,
    percent,
    finished: percent >= 100,
  };
}

/** Gün karelerinden oluşan ilerleme ızgarası. */
function DayGrid({ plan, stats }: { plan: KhatmPlan; stats: PlanStats }) {
  const theme = useTheme();
  const toggleKhatmDay = useProgressStore((s) => s.toggleKhatmDay);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
      {Array.from({ length: plan.totalDays }, (_, index) => {
        const done = plan.completedDays.includes(index);
        const isToday = index === stats.todayIndex && !stats.ended;
        const isPast = index < stats.todayIndex || stats.ended;
        const canToggle = isPast || isToday;
        return (
          <Pressable
            key={index}
            disabled={!canToggle}
            onPress={() => {
              void Haptics.selectionAsync();
              toggleKhatmDay(plan.id, index);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${index + 1}. gün`}
            accessibilityState={{ selected: done }}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: done ? theme.primary : isPast ? theme.accentSoft : theme.surfaceAlt,
              borderWidth: isToday ? 2 : 0,
              borderColor: theme.accent,
              opacity: canToggle ? 1 : 0.5,
            }}
          />
        );
      })}
    </View>
  );
}

function ActivePlanCard({ plan }: { plan: KhatmPlan }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  const toggleKhatmDay = useProgressStore((s) => s.toggleKhatmDay);
  const removeKhatmPlan = useProgressStore((s) => s.removeKhatmPlan);

  const stats = computeStats(plan);
  const startDate = parseISODate(plan.startDateISO);
  const endDate = new Date(startDate.getTime() + (plan.totalDays - 1) * DAY_MS);
  const todayDone = plan.completedDays.includes(stats.todayIndex);

  const confirmRemove = () => {
    confirmDialog(t('common.confirmDeleteTitle'), t('khatm.removeConfirm'), t('common.delete'), () => removeKhatmPlan(plan.id), t('common.cancel'));
  };

  return (
    <Card style={{ gap: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="heading">{plan.name}</ThemedText>
          <ThemedText variant="caption">
            {t('khatm.startedOn', { date: formatDateShort(startDate, language) })} ·{' '}
            {t('khatm.endsOn', { date: formatDateShort(endDate, language) })}
          </ThemedText>
        </View>
        <Pressable
          onPress={confirmRemove}
          accessibilityRole="button"
          accessibilityLabel={t('khatm.removePlan')}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
        </Pressable>
      </View>

      <View style={{ gap: Spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText variant="secondary">
            {t('khatm.completedDays', { done: stats.completedCount, total: plan.totalDays })}
          </ThemedText>
          <ThemedText variant="label" color={theme.primary}>
            {t('khatm.progressPercent', { percent: stats.percent })}
          </ThemedText>
        </View>
        <ProgressBar ratio={stats.percent / 100} />
        <ThemedText variant="caption">
          {t('khatm.pagesRemaining', { pages: stats.remainingPages })} ·{' '}
          {t('khatm.daysRemaining', { days: stats.remainingDays })}
        </ThemedText>
      </View>

      {stats.finished ? (
        <Card tone="primary">
          <ThemedText variant="label" color={theme.primary}>
            {t('khatm.finished')}
          </ThemedText>
        </Card>
      ) : stats.ended ? (
        <Card tone="accent">
          <ThemedText variant="secondary">{t('khatm.planEnded')}</ThemedText>
        </Card>
      ) : (
        <View style={{ gap: Spacing.sm }}>
          <ThemedText variant="label">{t('khatm.todayTask')}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="book-outline" size={18} color={theme.primary} />
            <ThemedText>{t('khatm.todayPages', { pages: stats.todayPages })}</ThemedText>
          </View>
          {stats.missedDays > 0 ? (
            <Card tone="accent">
              <ThemedText variant="caption">
                {t('khatm.recalcNote', {
                  missed: stats.missedDays,
                  pages: stats.remainingPages,
                  days: stats.remainingDays,
                })}
              </ThemedText>
            </Card>
          ) : null}
          <Button
            title={todayDone ? t('khatm.undoToday') : t('khatm.markToday')}
            variant={todayDone ? 'secondary' : 'primary'}
            onPress={() => {
              void Haptics.selectionAsync();
              toggleKhatmDay(plan.id, stats.todayIndex);
            }}
          />
          {todayDone ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
              <Ionicons name="checkmark-circle" size={14} color={theme.success} />
              <ThemedText variant="caption" color={theme.success}>
                {t('khatm.todayDone')}
              </ThemedText>
            </View>
          ) : null}
        </View>
      )}

      <View style={{ gap: Spacing.xs }}>
        <ThemedText variant="caption">{t('khatm.daysGridHint')}</ThemedText>
        <DayGrid plan={plan} stats={stats} />
      </View>
    </Card>
  );
}

function OtherPlanRow({ plan }: { plan: KhatmPlan }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  const removeKhatmPlan = useProgressStore((s) => s.removeKhatmPlan);
  const stats = computeStats(plan);
  return (
    <Card style={{ gap: Spacing.xs, marginBottom: Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText variant="label">{plan.name}</ThemedText>
        <Pressable
          onPress={() =>
            confirmDialog(t('common.confirmDeleteTitle'), t('khatm.removeConfirm'), t('common.delete'), () => removeKhatmPlan(plan.id), t('common.cancel'))
          }
          accessibilityRole="button"
          accessibilityLabel={t('khatm.removePlan')}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={16} color={theme.danger} />
        </Pressable>
      </View>
      <ThemedText variant="caption">
        {t('khatm.startedOn', { date: formatDateShort(parseISODate(plan.startDateISO), language) })} ·{' '}
        {t('khatm.completedDays', { done: stats.completedCount, total: plan.totalDays })}
      </ThemedText>
      <ProgressBar ratio={stats.percent / 100} />
    </Card>
  );
}

export default function KhatmScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const khatmPlans = useProgressStore((s) => s.khatmPlans);
  const addKhatmPlan = useProgressStore((s) => s.addKhatmPlan);

  const [formVisible, setFormVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | 'custom'>(30);
  const [customDate, setCustomDate] = useState('');
  const [customError, setCustomError] = useState(false);
  const [name, setName] = useState('');

  const activePlan = khatmPlans.find((p) => p.active);
  const otherPlans = khatmPlans.filter((p) => !p.active);

  const resolveDays = (): number | null => {
    if (selectedDays !== 'custom') return selectedDays;
    const end = parseCustomDate(customDate);
    if (!end) return null;
    const diff = Math.floor((startOfDay(end).getTime() - startOfDay(new Date()).getTime()) / DAY_MS);
    return diff > 0 ? diff + 1 : null;
  };

  const previewDays = resolveDays();

  const createPlan = () => {
    const days = resolveDays();
    if (!days) {
      setCustomError(true);
      return;
    }
    setCustomError(false);
    addKhatmPlan({
      name: name.trim() || t('khatm.defaultPlanName'),
      totalDays: days,
      startDateISO: todayISO(),
    });
    setFormVisible(false);
    setName('');
    setCustomDate('');
    setSelectedDays(30);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('khatm.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('khatm.intro')}
      </ThemedText>

      {activePlan ? (
        <View style={{ marginTop: Spacing.md }}>
          <SectionHeader title={t('khatm.activePlan')} />
          <ActivePlanCard plan={activePlan} />
        </View>
      ) : (
        <Card style={{ marginTop: Spacing.md, alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg }}>
          <Ionicons name="calendar-outline" size={32} color={theme.primary} />
          <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
            {t('khatm.empty')}
          </ThemedText>
        </Card>
      )}

      {otherPlans.length > 0 ? (
        <View>
          <SectionHeader title={t('khatm.otherPlans')} />
          {otherPlans.map((plan) => (
            <OtherPlanRow key={plan.id} plan={plan} />
          ))}
        </View>
      ) : null}

      {/* Yeni plan */}
      <SectionHeader title={t('khatm.newPlan')} />
      {!formVisible ? (
        <Button title={t('khatm.start')} onPress={() => setFormVisible(true)} />
      ) : (
        <Card style={{ gap: Spacing.md }}>
          <View style={{ gap: Spacing.xs }}>
            <ThemedText variant="label">{t('khatm.planName')}</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('khatm.defaultPlanName')}
              placeholderTextColor={theme.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: Radius.md,
                padding: Spacing.sm,
                color: theme.text,
                fontSize: FontSize.md,
              }}
            />
          </View>

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="label">{t('khatm.presets')}</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {PRESET_DAYS.map((days) => (
                <Chip
                  key={days}
                  label={t('khatm.presetDays', { days })}
                  selected={selectedDays === days}
                  onPress={() => setSelectedDays(days)}
                />
              ))}
              <Chip
                label={t('khatm.customDate')}
                selected={selectedDays === 'custom'}
                onPress={() => setSelectedDays('custom')}
              />
            </View>
          </View>

          {selectedDays === 'custom' ? (
            <View style={{ gap: Spacing.xs }}>
              <ThemedText variant="label">{t('khatm.customDateLabel')}</ThemedText>
              <TextInput
                value={customDate}
                onChangeText={(value) => {
                  setCustomDate(value);
                  setCustomError(false);
                }}
                placeholder="15.09.2026"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numbers-and-punctuation"
                style={{
                  borderWidth: 1,
                  borderColor: customError ? theme.danger : theme.border,
                  borderRadius: Radius.md,
                  padding: Spacing.sm,
                  color: theme.text,
                  fontSize: FontSize.md,
                }}
              />
              {customError ? (
                <ThemedText variant="caption" color={theme.danger}>
                  {t('khatm.customDateInvalid')}
                </ThemedText>
              ) : null}
            </View>
          ) : null}

          {previewDays ? (
            <ThemedText variant="secondary">
              {t('khatm.presetDays', { days: previewDays })} ·{' '}
              {t('khatm.perDay', { pages: Math.ceil(TOTAL_QURAN_PAGES / previewDays) })}
            </ThemedText>
          ) : null}

          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Button
              title={t('common.cancel')}
              variant="secondary"
              onPress={() => setFormVisible(false)}
              style={{ flex: 1 }}
            />
            <Button title={t('khatm.create')} onPress={createPlan} style={{ flex: 1 }} />
          </View>
        </Card>
      )}
    </Screen>
  );
}
