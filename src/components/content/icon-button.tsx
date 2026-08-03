import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import type { IconName } from '@/components/ui-bits';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  icon: IconName;
  onPress: () => void;
  /** Erişilebilirlik etiketi */
  label: string;
  active?: boolean;
}

/** Kart köşelerinde kullanılan küçük yuvarlak ikon butonu (favori, paylaş...). */
export function IconButton({ icon, onPress, label, active }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={active === undefined ? undefined : { selected: active }}
      hitSlop={8}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.primarySoft : theme.surfaceAlt,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name={icon} size={18} color={active ? theme.primary : theme.textSecondary} />
    </Pressable>
  );
}
