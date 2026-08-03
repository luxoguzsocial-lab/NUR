import { Text, type TextProps } from 'react-native';

import { FontSize } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'body' | 'secondary' | 'title' | 'heading' | 'caption' | 'arabic' | 'label';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
}

export function ThemedText({ variant = 'body', color, style, ...rest }: Props) {
  const theme = useTheme();
  const base = (() => {
    switch (variant) {
      case 'title':
        return { fontSize: FontSize.xxl, fontWeight: '700' as const, color: theme.text };
      case 'heading':
        return { fontSize: FontSize.lg, fontWeight: '600' as const, color: theme.text };
      case 'secondary':
        return { fontSize: FontSize.sm, color: theme.textSecondary };
      case 'caption':
        return { fontSize: FontSize.xs, color: theme.textSecondary };
      case 'label':
        return { fontSize: FontSize.sm, fontWeight: '600' as const, color: theme.text };
      case 'arabic':
        return {
          fontSize: FontSize.arabicDefault,
          color: theme.text,
          writingDirection: 'rtl' as const,
          textAlign: 'right' as const,
        };
      default:
        return { fontSize: FontSize.md, color: theme.text };
    }
  })();
  return <Text {...rest} style={[base, color ? { color } : null, style]} />;
}
