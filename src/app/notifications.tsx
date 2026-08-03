import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort } from '@/lib/format';
import { useNotificationStore, type NotificationCategory } from '@/store/notifications';
import { useSettingsStore, type NotificationPrefs } from '@/store/settings';

const CATEGORY_PREF: Record<NotificationCategory, keyof NotificationPrefs | null> = {
  prayer: 'prayersEnabled',
  quranGoal: 'quranGoal',
  khatm: 'khatm',
  memorization: 'memorization',
  learning: 'learning',
  religiousDay: 'religiousDays',
  ramadan: 'ramadan',
  newContent: 'newContent',
};

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const store = useNotificationStore();
  const language = useSettingsStore((s) => s.language);

  return (
    <Screen>
      {store.items.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Button
            title={t('notifications.markAllRead')}
            variant="secondary"
            onPress={() => store.markAllRead()}
            style={{ flex: 1 }}
          />
          <Button
            title={t('notifications.clearAll')}
            variant="ghost"
            onPress={() => store.clearAll()}
            style={{ flex: 1 }}
          />
        </View>
      ) : null}

      {store.items.length === 0 ? (
        <EmptyState icon="notifications-outline" message={t('notifications.emptyState')} />
      ) : (
        <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
          {store.items.map((n) => (
            <Pressable key={n.id} onPress={() => store.markRead(n.id)}>
              <Card tone={n.read ? 'surface' : 'primary'}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  {!n.read ? (
                    <View
                      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary }}
                    />
                  ) : (
                    <Ionicons name="checkmark" size={14} color={theme.textSecondary} />
                  )}
                  <View style={{ flex: 1 }}>
                    <ThemedText variant={n.read ? 'secondary' : 'label'}>{n.title}</ThemedText>
                    <ThemedText variant="caption">{n.body}</ThemedText>
                    <ThemedText variant="caption" color={theme.textSecondary}>
                      {t(`notifications.categories.${n.category}`)} ·{' '}
                      {formatDateShort(new Date(n.createdAt), language)}
                    </ThemedText>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}

      <NotificationTypePrefs />
    </Screen>
  );
}

/** Her bildirim türünü ayrı açıp kapatma (spec #26). */
function NotificationTypePrefs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const categories = Object.keys(CATEGORY_PREF) as NotificationCategory[];
  return (
    <View style={{ marginTop: Spacing.xl }}>
      <ThemedText variant="heading" style={{ marginBottom: Spacing.sm }}>
        {t('settings.prayerNotifications')}
      </ThemedText>
      <Card>
        {categories.map((cat, i) => {
          const prefKey = CATEGORY_PREF[cat];
          if (!prefKey) return null;
          const value = settings.notifications[prefKey];
          if (typeof value !== 'boolean') return null;
          return (
            <Pressable
              key={cat}
              onPress={() => settings.setNotification(prefKey, !value as never)}
              accessibilityRole="switch"
              accessibilityState={{ checked: value }}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: Spacing.sm,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: theme.border,
              }}
            >
              <ThemedText>{t(`notifications.categories.${cat}`)}</ThemedText>
              <Ionicons
                name={value ? 'notifications' : 'notifications-off-outline'}
                size={20}
                color={value ? theme.primary : theme.textSecondary}
              />
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}
