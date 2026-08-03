import { Platform } from 'react-native';

export interface ThemePalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  border: string;
  danger: string;
  success: string;
  overlay: string;
}

export const Colors: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#F7F6F2',
    surface: '#FFFFFF',
    surfaceAlt: '#EFEDE6',
    text: '#1C1B18',
    textSecondary: '#6B6A64',
    primary: '#0E7365',
    onPrimary: '#FFFFFF',
    primarySoft: '#DCEEEA',
    accent: '#B08A2E',
    accentSoft: '#F3EAD3',
    border: '#E3E1DA',
    danger: '#B3402E',
    success: '#2E7D4F',
    overlay: 'rgba(0,0,0,0.4)',
  },
  dark: {
    background: '#12140F',
    surface: '#1C1F18',
    surfaceAlt: '#252921',
    text: '#F0EFE9',
    textSecondary: '#A3A297',
    primary: '#3BA694',
    onPrimary: '#0B1F1B',
    primarySoft: '#1E332E',
    accent: '#D4AF5A',
    accentSoft: '#33301F',
    border: '#31352B',
    danger: '#D9705F',
    success: '#5FB57F',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

export type ThemeColor = keyof ThemePalette;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  arabicMin: 20,
  arabicDefault: 26,
  arabicMax: 40,
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', mono: 'monospace' },
});
