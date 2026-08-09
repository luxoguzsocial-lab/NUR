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
 * Lacivert + altın tema (kullanıcı tasarımı).
 * dark = "gece" (İmsak/Akşam/Yatsı pencereleri: akşamdan gün doğumuna) — #0F172A zemin, #D4AF37 altın.
 * light = aynı tasarımın gündüz hâli — açık zemin, lacivert metin, koyu altın vurgu.
 * Otomatik geçiş use-theme.ts'te vakit hesabıyla yapılır.
 */
export const Colors: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#F6F7FA',
    surface: '#FFFFFF',
    surfaceAlt: '#EDF0F5',
    text: '#0F172A',
    textSecondary: '#64748B',
    primary: '#A8821F',
    onPrimary: '#FFFFFF',
    primarySoft: '#F5EBCE',
    accent: '#B7912A',
    accentSoft: '#F5EBCE',
    border: '#E2E8F0',
    danger: '#B3402E',
    success: '#2E7D4F',
    overlay: 'rgba(15,23,42,0.4)',
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
