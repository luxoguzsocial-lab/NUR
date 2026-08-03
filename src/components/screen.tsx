import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  children: ReactNode;
  /** false: ScrollView yerine düz View (ör. FlatList içeren ekranlar) */
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Tab bar altında kalmaması için ekstra alt boşluk */
  bottomInset?: boolean;
}

export function Screen({ children, scroll = true, padded = true, style, bottomInset = true }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const padding = padded ? Spacing.md : 0;
  if (!scroll) {
    return (
      <View style={[{ flex: 1, backgroundColor: theme.background, padding }, style]}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        { padding, paddingBottom: bottomInset ? insets.bottom + Spacing.xxl + Spacing.lg : padding },
        style,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
