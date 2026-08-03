import { Text } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import type { Ayah } from '@/data/quran';
import { getTajweedRuleInfo } from '@/data/tajweed-guide';
import { useTheme, useThemeMode } from '@/hooks/use-theme';

interface Props {
  ayah: Ayah;
  fontSize: number;
  lineHeightMultiplier: number;
  /** Ayarlardan: tecvit renkleri açık mı */
  tajweedEnabled: boolean;
  /** Renk körlüğü modu: renk yerine alt çizgi + kural kısaltması */
  accessibleMarks: boolean;
  arabicFont: 'system' | 'serif';
}

/**
 * Arapça ayet metni. Tecvit görünümü açıksa ve ayet için anotasyon varsa
 * segmentleri kural rengiyle (veya erişilebilir modda alt çizgi + kural
 * kısaltması rozetiyle) gösterir.
 */
export function TajweedText({
  ayah,
  fontSize,
  lineHeightMultiplier,
  tajweedEnabled,
  accessibleMarks,
  arabicFont,
}: Props) {
  const theme = useTheme();
  const mode = useThemeMode();
  const baseStyle = {
    fontSize,
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    fontFamily: arabicFont === 'serif' ? Fonts?.serif : undefined,
  };

  if (!tajweedEnabled || !ayah.tajweed || ayah.tajweed.length === 0) {
    return (
      <ThemedText variant="arabic" style={baseStyle}>
        {ayah.arabic}
      </ThemedText>
    );
  }

  return (
    <ThemedText variant="arabic" style={baseStyle}>
      {ayah.tajweed.map((segment, index) => {
        if (!segment.rule) {
          return <Text key={index}>{segment.text}</Text>;
        }
        const info = getTajweedRuleInfo(segment.rule);
        if (accessibleMarks) {
          return (
            <Text key={index}>
              <Text style={{ textDecorationLine: 'underline', color: theme.text }}>
                {segment.text}
              </Text>
              <Text style={{ fontSize: Math.max(10, Math.round(fontSize * 0.4)), color: theme.textSecondary }}>
                {` ‹${info.shortCode}› `}
              </Text>
            </Text>
          );
        }
        return (
          <Text key={index} style={{ color: info.color[mode] }}>
            {segment.text}
          </Text>
        );
      })}
    </ThemedText>
  );
}
