import { useColorScheme } from 'react-native';

import { Colors, type ThemePalette } from '@/constants/theme';
import { useSettingsStore } from '@/store/settings';

export function useThemeMode(): 'light' | 'dark' {
  const system = useColorScheme();
  const pref = useSettingsStore((s) => s.theme);
  if (pref === 'system') return system === 'dark' ? 'dark' : 'light';
  return pref;
}

export function useTheme(): ThemePalette {
  return Colors[useThemeMode()];
}
