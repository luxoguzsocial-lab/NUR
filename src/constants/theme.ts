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

/**
 * Tema (kullanıcı seçimi):
 * dark = "gece" (Akşam→Güneş; İmsak/Akşam/Yatsı pencereleri) — lacivert #0F172A + altın #D4AF37.
 * light = gündüz — klasik yeşil/turkuaz tema (krem zemin, #0E7365 yeşil).
 * Otomatik geçiş use-theme.ts'te vakit hesabıyla yapılır.
 */
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
    background: '#0F172A',
    surface: '#182238',
    surfaceAlt: '#1F2B45',
    text: '#E2E8F0',
    textSecondary: '#94A3B8',
    primary: '#D4AF37',
    onPrimary: '#0F172A',
    primarySoft: '#31301E',
    accent: '#E3C565',
    accentSoft: '#2C2717',
    border: '#293650',
    danger: '#E06C5C',
    success: '#4CAF82',
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
