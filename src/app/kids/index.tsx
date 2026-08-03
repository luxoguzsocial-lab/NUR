import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { ELIFBA, HARAKAT, KIDS_SURAHS } from '@/data/elifba';
import { useTheme } from '@/hooks/use-theme';
import { useKidsStore } from '@/store/kids';

interface SectionDef {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
  done: number;
  total: number;
}

export default function KidsHomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const learnedLetters = useKidsStore((s) => s.learnedLetters);
  const learnedHarakat = useKidsStore((s) => s.learnedHarakat);
  const learnedSurahs = useKidsStore((s) => s.learnedSurahs);

  const sections: SectionDef[] = [
    {
      key: 'Elifba',
      icon: 'text-outline',
      color: '#2A9D8F',
      route: '/kids/elifba',
      done: learnedLetters.length,
      total: ELIFBA.length,
    },
    {
      key: 'Harakat',
      icon: 'color-wand-outline',
      color: '#E76F51',
      route: '/kids/harakat',
      done: learnedHarakat.length,
      total: HARAKAT.length,
    },
    {
      key: 'Surahs',
      icon: 'musical-notes-outline',
      color: '#7B3FA0',
      route: '/kids/surahs',
      done: learnedSurahs.length,
      total: KIDS_SURAHS.length,
    },
    {
      key: 'Duas',
      icon: 'heart-outline',
      color: '#C06514',
      route: '/kids/duas',
      done: 0,
      total: 0,
    },
  ];

  return (
    <Screen>
      <Stack.Screen options={{ title: t('kids.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('kids.intro')}
      </ThemedText>

      <View style={{ marginTop: Spacing.md, gap: Spacing.md }}>
        {sections.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => router.push(s.route as never)}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              backgroundColor: theme.surface,
              borderRadius: Radius.xl,
              borderWidth: 2,
              borderColor: `${s.color}55`,
              padding: Spacing.lg,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${s.color}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={s.icon} size={30} color={s.color} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText variant="heading">{t(`kids.section${s.key}`)}</ThemedText>
              <ThemedText variant="secondary">{t(`kids.section${s.key}Sub`)}</ThemedText>
              {s.total > 0 ? (
                <>
                  <ProgressBar ratio={s.done / s.total} style={{ marginTop: 4 }} />
                  <ThemedText variant="caption">
                    {t('kids.progressLine', { done: s.done, total: s.total })}
                  </ThemedText>
                </>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
