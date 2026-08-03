import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  label: string;
  valueLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
}

/** Etiket + [-] değer [+] satırı (yazı boyutu, tekrar sayısı vb. için). */
export function Stepper({
  label,
  valueLabel,
  onDecrement,
  onIncrement,
  decrementDisabled,
  incrementDisabled,
}: Props) {
  const theme = useTheme();
  const buttonStyle = (disabled?: boolean) => ({
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: theme.surfaceAlt,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    opacity: disabled ? 0.4 : 1,
  });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Pressable
          onPress={onDecrement}
          disabled={decrementDisabled}
          accessibilityRole="button"
          accessibilityLabel={`${label} -`}
          style={buttonStyle(decrementDisabled)}
        >
          <Ionicons name="remove" size={18} color={theme.text} />
        </Pressable>
        <ThemedText variant="label" style={{ minWidth: 44, textAlign: 'center' }}>
          {valueLabel}
        </ThemedText>
        <Pressable
          onPress={onIncrement}
          disabled={incrementDisabled}
          accessibilityRole="button"
          accessibilityLabel={`${label} +`}
          style={buttonStyle(incrementDisabled)}
        >
          <Ionicons name="add" size={18} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}
