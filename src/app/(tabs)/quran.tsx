import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, TextInput, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyState, ProgressBar, SectionHeader } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { JUZ_LIST, SURAHS, getSurahMeta, type JuzInfo, type SurahMeta } from '@/data/quran';
import { isSurahAvailable } from '@/data/quran-text';
import { hasLesson } from '@/data/surah-lessons';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, todayISO } from '@/lib/format';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';

function SurahRow({ meta }: { meta: SurahMeta }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const available = isSurahAvailable(meta.number);
  // Not: Ders kısayolu, satır butonunun İÇİNE konursa web'de geçersiz iç içe
  // <button> üretir; bu yüzden iki kardeş Pressable olarak yerleştirildi.
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: Spacing.xs,
      }}
    >
      <Pressable
        onPress={() => router.push(`/quran/surah/${meta.number}`)}
        accessibilityRole="button"
        accessibilityLabel={meta.turkishName}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: Radius.md,
            backgroundColor: theme.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText variant="caption" color={theme.primary}>
            {meta.number}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <ThemedText variant="label">{meta.turkishName}</ThemedText>
            {available ? <Ionicons name="reader-outline" size={13} color={theme.accent} /> : null}
          </View>
          <ThemedText variant="caption">
            {t('quran.ayahCount', { count: meta.ayahCount })} · {t(`quran.place.${meta.revelationPlace}`)} ·{' '}
            {t('quran.juzShort', { juz: meta.juz })}
          </ThemedText>
        </View>
        <ThemedText variant="arabic" style={{ fontSize: FontSize.lg }}>
          {meta.arabicName}
        </ThemedText>
      </Pressable>
      {hasLesson(meta.number) ? (
        <Pressable
          onPress={() => router.push(`/quran/lesson/${meta.number}`)}
          accessibilityRole="button"
          accessibilityLabel={t('quran.lessonAvailable')}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            borderRadius: Radius.md,
            backgroundColor: theme.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="school-outline" size={16} color={theme.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

function JuzRow({ info }: { info: JuzInfo }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const surahMeta = getSurahMeta(info.surah);
  return (
    <Pressable
      onPress={() => router.push(`/quran/surah/${info.surah}?ayah=${info.ayah}`)}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: Spacing.xs,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: Radius.md,
          backgroundColor: theme.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText variant="caption" color={theme.accent}>
          {info.juz}
        </ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText variant="label">{t('quran.juzItem', { juz: info.juz })}</ThemedText>
        <ThemedText variant="caption">
          {t('quran.juzStart', { surah: surahMeta?.turkishName ?? info.surah, ayah: info.ayah })}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

export default function QuranTabScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tab, setTab] = useState<'surahs' | 'juz'>('surahs');
  const [query, setQuery] = useState('');

  const progress = useProgressStore();
  const dailyGoal = useSettingsStore((s) => s.dailyQuranGoalMinutes);
  const language = useSettingsStore((s) => s.language);

  const readToday = progress.quranMinutesByDay[todayISO()] ?? 0;
  const activeKhatm = progress.khatmPlans.find((p) => p.active);
  const khatmPercent = activeKhatm
    ? Math.min(100, Math.round((activeKhatm.completedDays.length / activeKhatm.totalDays) * 100))
    : 0;
  const memorizedCount = Object.values(progress.memorization).reduce(
    (sum, m) => sum + m.memorizedAyahs.length,
    0,
  );
  const lastReadMeta = progress.lastRead ? getSurahMeta(progress.lastRead.surah) : undefined;

  const trimmed = query.trim();
  const searching = trimmed.length > 0;
  const filteredSurahs = useMemo(() => {
    if (!searching) return SURAHS;
    const q = trimmed.toLocaleLowerCase('tr');
    return SURAHS.filter(
      (s) =>
        s.turkishName.toLocaleLowerCase('tr').includes(q) ||
        s.arabicName.includes(trimmed) ||
        String(s.number) === trimmed,
    );
  }, [searching, trimmed]);

  const showSurahList = searching || tab === 'surahs';

  const header = (
    <View>
      <View style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>
        <ThemedText variant="title">{t('quran.title')}</ThemedText>
      </View>

      {/* Arama */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: Radius.lg,
          paddingHorizontal: Spacing.md,
          marginBottom: Spacing.md,
        }}
      >
        <Ionicons name="search" size={16} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('quran.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={{ flex: 1, paddingVertical: Spacing.sm + 2, color: theme.text, fontSize: FontSize.md }}
          accessibilityLabel={t('common.search')}
        />
        {searching ? (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button" hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {!searching ? (
        <View>
          {/* Son okunan yer */}
          <Card
            tone="primary"
            onPress={() =>
              progress.lastRead
                ? router.push(`/quran/surah/${progress.lastRead.surah}?ayah=${progress.lastRead.ayah}`)
                : router.push('/quran/surah/1')
            }
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="book" size={28} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={theme.primary}>
                  {progress.lastRead ? t('quran.continueReading') : t('quran.startReading')}
                </ThemedText>
                <ThemedText variant="secondary">
                  {progress.lastRead && lastReadMeta
                    ? t('quran.lastReadAt', {
                        surah: lastReadMeta.turkishName,
                        ayah: progress.lastRead.ayah,
                      })
                    : t('quran.startReadingHint')}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.primary} />
            </View>
          </Card>

          {/* Günlük hedef */}
          <Card style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText variant="label">{t('quran.dailyGoal')}</ThemedText>
              <ThemedText variant="secondary">
                {t('quran.goalMinutes', { read: readToday, goal: dailyGoal })}
              </ThemedText>
            </View>
            <ProgressBar ratio={dailyGoal > 0 ? readToday / dailyGoal : 0} />
            {readToday >= dailyGoal && dailyGoal > 0 ? (
              <ThemedText variant="caption" color={theme.success}>
                {t('quran.goalDone')}
              </ThemedText>
            ) : null}
          </Card>

          {/* Hatim + Ezber girişleri */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
            <Card style={{ flex: 1 }} onPress={() => router.push('/quran/khatm')}>
              <Ionicons name="calendar-outline" size={20} color={theme.primary} />
              <ThemedText variant="label" style={{ marginTop: Spacing.xs }}>
                {t('quran.khatmEntry')}
              </ThemedText>
              <ThemedText variant="caption">
                {activeKhatm ? t('quran.khatmActive', { percent: khatmPercent }) : t('quran.khatmNone')}
              </ThemedText>
              {activeKhatm ? (
                <ProgressBar ratio={khatmPercent / 100} style={{ marginTop: Spacing.sm }} />
              ) : null}
            </Card>
            <Card style={{ flex: 1 }} onPress={() => router.push('/quran/memorize')}>
              <Ionicons name="sparkles-outline" size={20} color={theme.accent} />
              <ThemedText variant="label" style={{ marginTop: Spacing.xs }}>
                {t('quran.memorizeEntry')}
              </ThemedText>
              <ThemedText variant="caption">
                {memorizedCount > 0
                  ? t('quran.memorizeSummary', { count: memorizedCount })
                  : t('quran.memorizeNone')}
              </ThemedText>
            </Card>
          </View>

          {/* Yer imleri */}
          <SectionHeader title={t('quran.bookmarks')} />
          {progress.bookmarks.length === 0 ? (
            <ThemedText variant="caption">{t('quran.bookmarksEmpty')}</ThemedText>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {progress.bookmarks.slice(0, 4).map((bookmark) => {
                const meta = getSurahMeta(bookmark.surah);
                return (
                  <Pressable
                    key={bookmark.id}
                    onPress={() =>
                      router.push(`/quran/surah/${bookmark.surah}?ayah=${bookmark.ayah}`)
                    }
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.sm,
                      padding: Spacing.md,
                      backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
                    })}
                  >
                    <Ionicons name="bookmark" size={14} color={theme.primary} />
                    <ThemedText style={{ flex: 1 }}>
                      {meta?.turkishName ?? bookmark.surah} · {bookmark.ayah}. {t('quran.ayah')}
                    </ThemedText>
                    <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
                  </Pressable>
                );
              })}
            </Card>
          )}

          {/* Notlar */}
          <SectionHeader title={t('quran.notes')} />
          {progress.notes.length === 0 ? (
            <ThemedText variant="caption">{t('quran.notesEmpty')}</ThemedText>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {progress.notes.slice(0, 3).map((note) => {
                const meta = getSurahMeta(note.surah);
                return (
                  <Pressable
                    key={note.id}
                    onPress={() => router.push(`/quran/surah/${note.surah}?ayah=${note.ayah}`)}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      padding: Spacing.md,
                      gap: 2,
                      backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
                    })}
                  >
                    <ThemedText variant="caption" color={theme.primary}>
                      {meta?.turkishName ?? note.surah} · {note.ayah}. {t('quran.ayah')}
                    </ThemedText>
                    <ThemedText variant="secondary" numberOfLines={2}>
                      {note.text}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </Card>
          )}

          {/* Okuma geçmişi */}
          <SectionHeader title={t('quran.readingHistory')} />
          {progress.readingHistory.length === 0 ? (
            <ThemedText variant="caption">{t('quran.historyEmpty')}</ThemedText>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {progress.readingHistory.slice(0, 4).map((entry) => {
                const meta = getSurahMeta(entry.surah);
                return (
                  <Pressable
                    key={`${entry.surah}:${entry.ayah}:${entry.dateISO}`}
                    onPress={() => router.push(`/quran/surah/${entry.surah}?ayah=${entry.ayah}`)}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.sm,
                      padding: Spacing.md,
                      backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
                    })}
                  >
                    <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                    <ThemedText style={{ flex: 1 }}>
                      {meta?.turkishName ?? entry.surah} · {entry.ayah}. {t('quran.ayah')}
                    </ThemedText>
                    <ThemedText variant="caption">
                      {formatDateShort(new Date(entry.dateISO), language)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </Card>
          )}

          {/* Çevrimdışı bilgi satırı */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              marginTop: Spacing.md,
              marginBottom: Spacing.xs,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={14} color={theme.textSecondary} />
            <ThemedText variant="caption" style={{ flex: 1 }}>
              {t('quran.offlineInfo')}
            </ThemedText>
          </View>

          {/* Sekmeler */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
            <Chip
              label={t('quran.tabs.surahs')}
              selected={tab === 'surahs'}
              onPress={() => setTab('surahs')}
            />
            <Chip label={t('quran.tabs.juz')} selected={tab === 'juz'} onPress={() => setTab('juz')} />
          </View>
        </View>
      ) : null}
    </View>
  );

  if (showSurahList) {
    return (
      <Screen scroll={false} padded={false}>
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => String(item.number)}
          renderItem={({ item }) => <SurahRow meta={item} />}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState icon="search-outline" message={t('quran.noResults')} />}
          contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl + Spacing.xl }}
          keyboardShouldPersistTaps="handled"
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={JUZ_LIST}
        keyExtractor={(item) => String(item.juz)}
        renderItem={({ item }) => <JuzRow info={item} />}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl + Spacing.xl }}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}
