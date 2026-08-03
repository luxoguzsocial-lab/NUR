import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar, SectionHeader } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { getProgramLessons, PROGRAMS } from '@/data/programs';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/progress';

export default function ProgramsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const withProgress = PROGRAMS.map((program) => {
    const lessons = getProgramLessons(program.id);
    const done = lessons.filter((l) => completedLessons[l.id]).length;
    return { program, lessons, done, ratio: lessons.length ? done / lessons.length : 0 };
  });
  const completedPrograms = withProgress.filter((p) => p.ratio === 1 && p.lessons.length > 0);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('programs.title') }} />
      {withProgress.map(({ program, lessons, done, ratio }) => (
        <Card
          key={program.id}
          style={{ marginBottom: Spacing.sm }}
          onPress={() => router.push(`/program/${program.id}`)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: ratio === 1 ? theme.primary : theme.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={ratio === 1 ? 'checkmark' : (program.icon as keyof typeof Ionicons.glyphMap)}
                size={20}
                color={ratio === 1 ? theme.onPrimary : theme.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">{program.title}</ThemedText>
              <ThemedText variant="caption">{program.description}</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs }}>
                <ProgressBar ratio={ratio} style={{ flex: 1 }} />
                <ThemedText variant="caption">
                  {done}/{lessons.length}
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </View>
        </Card>
      ))}

      {completedPrograms.length > 0 ? (
        <>
          <SectionHeader title={t('programs.completedPrograms')} />
          {completedPrograms.map(({ program }) => (
            <ThemedText key={program.id} variant="secondary">
              ✓ {program.title}
            </ThemedText>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
