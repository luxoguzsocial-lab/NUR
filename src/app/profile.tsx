import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar, SectionHeader } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getSurahMeta } from '@/data/quran';
import { useTheme } from '@/hooks/use-theme';
import { useMediaStore } from '@/store/media';
import { useSettingsStore } from '@/store/settings';
import { useProgressStore } from '@/store/progress';
import { useSavedStore } from '@/store/saved';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const progress = useProgressStore();
  const saved = useSavedStore();
  const media = useMediaStore();

  const lastReadSurah = progress.lastRead ? getSurahMeta(progress.lastRead.surah) : null;
  const activeKhatm = progress.khatmPlans.find((p) => p.active);
  const memorizedCount = Object.values(progress.memorization).reduce(
    (sum, m) => sum + m.memorizedAyahs.length,
    0,
  );
  const completedLessonCount = Object.values(progress.completedLessons).filter(Boolean).length;
  const watchedCount = Object.keys(media.watchHistory).length;

  return (
    <Screen>
      {/* Misafir kartı */}
      <Card tone="primary">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person-outline" size={30} color={theme.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">
              {settings.userName ? settings.userName : t('profile.guest')}
            </ThemedText>
            <ThemedText variant="caption">{t('profile.guestInfo')}</ThemedText>
          </View>
        </View>
      </Card>

      {/* İsim düzenleme */}
      <Card style={{ marginTop: Spacing.sm }}>
        <ThemedText variant="label">{t('profile.nameLabel')}</ThemedText>
        <TextInput
          value={settings.userName}
          onChangeText={(v) => settings.set('userName', v)}
          placeholder={t('profile.namePlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={{
            marginTop: Spacing.xs,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: Radius.md,
            padding: Spacing.sm,
            color: theme.text,
          }}
        />
        <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
          {t('profile.nameHint')}
        </ThemedText>
      </Card>

      {/* İsim düzenleme */}
      <Card style={{ marginTop: Spacing.sm }}>
        <ThemedText variant="label">{t('profile.nameLabel')}</ThemedText>
        <TextInput
          value={settings.userName}
          onChangeText={(v) => settings.set('userName', v)}
          placeholder={t('profile.namePlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={{
            marginTop: Spacing.xs,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: Radius.md,
            padding: Spacing.sm,
            color: theme.text,
          }}
        />
        <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
          {t('profile.nameHint')}
        </ThemedText>
      </Card>

      {/* İlerleme özetleri */}
      <SectionHeader title={t('profile.learningProgress')} />
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        <Card style={{ flex: 1 }}>
          <ThemedText variant="caption">{t('profile.lastRead')}</ThemedText>
          <ThemedText variant="heading">
            {lastReadSurah ? lastReadSurah.turkishName : '—'}
          </ThemedText>
        </Card>
        <Card style={{ flex: 1 }}>
          <ThemedText variant="caption">{t('home.memorizationProgress')}</ThemedText>
          <ThemedText variant="heading">{memorizedCount}</ThemedText>
        </Card>
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
        <Card style={{ flex: 1 }}>
          <ThemedText variant="caption">{t('profile.completedLessons')}</ThemedText>
          <ThemedText variant="heading">{completedLessonCount}</ThemedText>
        </Card>
        <Card style={{ flex: 1 }}>
          <ThemedText variant="caption">{t('profile.watchedVideos')}</ThemedText>
          <ThemedText variant="heading">{watchedCount}</ThemedText>
        </Card>
      </View>

      {activeKhatm ? (
        <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/quran/khatm')}>
          <ThemedText variant="caption">{t('home.khatmProgress')}</ThemedText>
          <ProgressBar
            ratio={activeKhatm.completedDays.length / activeKhatm.totalDays}
            style={{ marginVertical: Spacing.xs }}
          />
          <ThemedText variant="secondary">
            %{Math.round((activeKhatm.completedDays.length / activeKhatm.totalDays) * 100)} ·{' '}
            {activeKhatm.name}
          </ThemedText>
        </Card>
      ) : null}

      {/* Kısayollar */}
      <SectionHeader title={t('menu.sectionPersonal')} />
      <Card onPress={() => router.push('/saved')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <Ionicons name="bookmark-outline" size={22} color={theme.primary} />
          <ThemedText style={{ flex: 1 }}>{t('menu.saved')}</ThemedText>
          <ThemedText variant="secondary">{saved.items.length}</ThemedText>
        </View>
      </Card>
      <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/tracker')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <Ionicons name="checkmark-done-outline" size={22} color={theme.primary} />
          <ThemedText style={{ flex: 1 }}>{t('menu.tracker')}</ThemedText>
        </View>
      </Card>
      <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/settings')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
          <ThemedText style={{ flex: 1 }}>{t('profile.privacy')}</ThemedText>
        </View>
      </Card>

      {/* Eşitleme bilgisi */}
      <SectionHeader title={t('profile.syncTitle')} />
      <Card>
        <ThemedText variant="secondary">{t('profile.syncInfo')}</ThemedText>
      </Card>
    </Screen>
  );
}
