import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'primary' | 'accent';
  accessibilityLabel?: string;
}

export function Card({ children, onPress, style, tone = 'surface', accessibilityLabel }: Props) {
  const theme = useTheme();
  const backgroundColor =
    tone === 'primary' ? theme.primarySoft : tone === 'accent' ? theme.accentSoft : theme.surface;
  const base: ViewStyle = {
    backgroundColor,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: theme.border,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}
    >
      {children}
    </Pressable>
  );
}
