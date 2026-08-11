import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LATEST_KHUTBAH } from '@/data/khutbah';
import { formatDateLong } from '@/lib/format';
import { shareText } from '@/lib/share';
import { useSettingsStore } from '@/store/settings';

/** Diyanet'in haftalık Cuma hutbesi — tam metin, ayet meali ve kaynaklarla. */
export default function KhutbahScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  const k = LATEST_KHUTBAH;
  const dateLabel = formatDateLong(new Date(`${k.dateISO}T12:00:00`), language);

  const share = () =>
    void shareText(
      `${k.title} — ${t('khutbah.title')} (${dateLabel})\n\n"${k.ayah.meal}" (${k.ayah.reference})\n\n${k.sourceUrl}`,
    );

  return (
    <Screen>
      <Stack.Screen options={{ title: t('khutbah.title') }} />

      {/* Başlık + tarih */}
      <View style={{ alignItems: 'center', marginTop: Spacing.md, gap: 4 }}>
        <ThemedText variant="caption" color={theme.primary} style={{ letterSpacing: 2, textTransform: 'uppercase' }}>
          {t('khutbah.title')} · {dateLabel}
        </ThemedText>
        <ThemedText variant="title" style={{ textAlign: 'center' }}>
          {k.title}
        </ThemedText>
        <ThemedText variant="caption" style={{ textAlign: 'center' }}>
          {k.source}
        </ThemedText>
      </View>

      {/* Ayet: Arapça + Türkçe meal */}
      <View
        style={{
          borderRadius: Radius.xl,
          backgroundColor: theme.accentSoft,
          padding: Spacing.lg,
          marginTop: Spacing.lg,
          gap: Spacing.sm,
        }}
      >
        <ThemedText
          style={{
            fontSize: FontSize.arabicDefault,
            lineHeight: FontSize.arabicDefault * 1.9,
            textAlign: 'center',
            writingDirection: 'rtl',
            color: theme.text,
          }}
        >
          {k.ayah.arabic}
        </ThemedText>
        <ThemedText variant="secondary" style={{ textAlign: 'center', fontStyle: 'italic' }}>
          “{k.ayah.meal}”
        </ThemedText>
        <ThemedText variant="caption" color={theme.accent} style={{ textAlign: 'center' }}>
          {k.ayah.reference}
        </ThemedText>
      </View>

      {/* Hutbe metni */}
      <Card style={{ marginTop: Spacing.md, gap: Spacing.md }}>
        {k.sections.map((section) => (
          <View key={section.heading ?? section.text.slice(0, 24)} style={{ gap: 4 }}>
            {section.heading ? (
              <ThemedText variant="label" color={theme.primary}>
                {section.heading}
              </ThemedText>
            ) : null}
            <ThemedText style={{ lineHeight: 24 }}>{section.text}</ThemedText>
          </View>
        ))}
      </Card>

      {/* Kaynaklar */}
      <Card style={{ marginTop: Spacing.md }}>
        <ThemedText variant="label" style={{ marginBottom: Spacing.xs }}>
          {t('khutbah.sources')}
        </ThemedText>
        {k.footnotes.map((note) => (
          <ThemedText key={note} variant="caption" style={{ paddingVertical: 1 }}>
            {note}
          </ThemedText>
        ))}
      </Card>

      {/* Paylaş + resmî kaynak */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
        <Card style={{ flex: 1 }} onPress={share}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs }}>
            <Ionicons name="share-social-outline" size={17} color={theme.primary} />
            <ThemedText variant="label" color={theme.primary}>
              {t('common.share')}
            </ThemedText>
          </View>
        </Card>
        <Card style={{ flex: 1 }} onPress={() => void Linking.openURL(k.sourceUrl)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs }}>
            <Ionicons name="open-outline" size={17} color={theme.primary} />
            <ThemedText variant="label" color={theme.primary}>
              {t('khutbah.openSource')}
            </ThemedText>
          </View>
        </Card>
      </View>

      <ThemedText variant="caption" style={{ textAlign: 'center', marginTop: Spacing.sm }}>
        {t('khutbah.weeklyNote')}
      </ThemedText>
    </Screen>
  );
}
