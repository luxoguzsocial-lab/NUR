import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const theme = useTheme();
  const bg =
    variant === 'primary'
      ? theme.primary
      : variant === 'danger'
        ? theme.danger
        : variant === 'secondary'
          ? theme.surfaceAlt
          : 'transparent';
  const fg =
    variant === 'primary' || variant === 'danger'
      ? theme.onPrimary
      : variant === 'ghost'
        ? theme.primary
        : theme.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: Radius.md,
          paddingVertical: Spacing.sm + 4,
          paddingHorizontal: Spacing.md,
          alignItems: 'center',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <ThemedText variant="label" color={fg}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}
