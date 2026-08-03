import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
      }}
    >
      <ThemedText variant="heading">{title}</ThemedText>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} accessibilityRole="button">
          <ThemedText variant="secondary" color={theme.primary}>
            {t('common.seeAll')}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon = 'leaf-outline', message }: { icon?: IconName; message: string }) {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm }}>
      <Ionicons name={icon} size={40} color={theme.textSecondary} />
      <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
        {message}
      </ThemedText>
    </View>
  );
}

export function ProgressBar({ ratio, style }: { ratio: number; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, ratio));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[
        { height: 8, borderRadius: Radius.full, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: Radius.full,
          backgroundColor: theme.primary,
        }}
      />
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={{
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radius.full,
        backgroundColor: selected ? theme.primary : theme.surfaceAlt,
        borderWidth: 1,
        borderColor: selected ? theme.primary : theme.border,
      }}
    >
      <ThemedText variant="secondary" color={selected ? theme.onPrimary : theme.text}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

/** Kaynak + doğrulama durumu etiketi — dinî içerik kartlarının altında kullanılır. */
export function SourceBadge({ source, verified }: { source: string; verified?: boolean }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap' }}>
      <Ionicons name="book-outline" size={12} color={theme.textSecondary} />
      <ThemedText variant="caption">
        {t('common.source')}: {source}
      </ThemedText>
      {verified !== undefined ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            backgroundColor: verified ? theme.primarySoft : theme.accentSoft,
            borderRadius: Radius.full,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 1,
          }}
        >
          <Ionicons
            name={verified ? 'checkmark-circle' : 'time-outline'}
            size={11}
            color={verified ? theme.primary : theme.accent}
          />
          <ThemedText variant="caption" color={verified ? theme.primary : theme.accent}>
            {verified ? t('common.verified') : t('common.pendingVerification')}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

export function DemoBadge() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: theme.accentSoft,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
      }}
    >
      <ThemedText variant="caption" color={theme.accent}>
        {t('common.demoBadge')}
      </ThemedText>
    </View>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        paddingHorizontal: Spacing.md,
        backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
      })}
    >
      {icon ? (
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
          <Ionicons name={icon} size={18} color={theme.primary} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <ThemedText>{title}</ThemedText>
        {subtitle ? <ThemedText variant="caption">{subtitle}</ThemedText> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} /> : null)}
    </Pressable>
  );
}
