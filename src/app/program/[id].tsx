import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, ProgressBar } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { getProgram, getProgramLessons } from '@/data/programs';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/progress';

export default function ProgramDetailScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = getProgram(id ?? '');
  const completedLessons = useProgressStore((s) => s.completedLessons);

  if (!program) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('programs.title') }} />
        <EmptyState message={t('common.empty')} />
      </Screen>
    );
  }

  const lessons = getProgramLessons(program.id);
  const done = lessons.filter((l) => completedLessons[l.id]).length;
  const nextLesson = lessons.find((l) => !completedLessons[l.id]);

  return (
    <Screen>
      <Stack.Screen options={{ title: program.title }} />
      <Card tone="primary">
        <ThemedText variant="title">{program.title}</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
          {program.description}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md }}>
          <ProgressBar ratio={lessons.length ? done / lessons.length : 0} style={{ flex: 1 }} />
          <ThemedText variant="caption">
            {t('programs.lessons', { count: lessons.length })} · {done}/{lessons.length}
          </ThemedText>
        </View>
        {nextLesson ? (
          <Button
            title={done === 0 ? t('programs.startProgram') : t('programs.continueLesson')}
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
            style={{ marginTop: Spacing.md }}
          />
        ) : (
          <ThemedText variant="secondary" color={theme.success} style={{ marginTop: Spacing.md }}>
            ✓ {t('programs.completed')}
          </ThemedText>
        )}
      </Card>

      <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
        {lessons.map((lesson) => {
          const isDone = !!completedLessons[lesson.id];
          return (
            <Card key={lesson.id} onPress={() => router.push(`/lesson/${lesson.id}`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <Ionicons
                  name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={isDone ? theme.success : theme.textSecondary}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText>{lesson.order}. {lesson.title}</ThemedText>
                  <ThemedText variant="caption">
                    {lesson.quiz.length > 0 ? `${t('lesson.quiz')} ✓` : ''}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
