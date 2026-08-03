import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, SectionHeader, SourceBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getLesson, getProgramLessons } from '@/data/programs';
import { getVideo } from '@/data/videos';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/progress';
import { useSavedStore } from '@/store/saved';

function Quiz({ lessonId }: { lessonId: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const lesson = getLesson(lessonId)!;
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(answers).length;
  const score = lesson.quiz.reduce(
    (sum, q, i) => sum + (answers[i] === q.answerIndex ? 1 : 0),
    0,
  );

  return (
    <View style={{ gap: Spacing.md }}>
      {lesson.quiz.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <Card key={qi}>
            <ThemedText variant="label">{qi + 1}. {q.question}</ThemedText>
            <View style={{ gap: Spacing.xs, marginTop: Spacing.sm }}>
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isCorrect = q.answerIndex === oi;
                const revealed = chosen !== undefined;
                const bg = revealed && isCorrect
                  ? theme.primarySoft
                  : revealed && isChosen && !isCorrect
                    ? theme.accentSoft
                    : theme.surfaceAlt;
                return (
                  <Pressable
                    key={oi}
                    disabled={revealed}
                    accessibilityRole="button"
                    onPress={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    style={{ backgroundColor: bg, borderRadius: Radius.md, padding: Spacing.sm }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                      <ThemedText style={{ flex: 1 }}>{opt}</ThemedText>
                      {revealed && isCorrect ? (
                        <Ionicons name="checkmark-circle" size={18} color={theme.success} />
                      ) : null}
                      {revealed && isChosen && !isCorrect ? (
                        <Ionicons name="close-circle" size={18} color={theme.danger} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {chosen !== undefined ? (
              <ThemedText
                variant="caption"
                color={chosen === q.answerIndex ? theme.success : theme.danger}
                style={{ marginTop: Spacing.xs }}
              >
                {chosen === q.answerIndex ? t('lesson.quizCorrect') : t('lesson.quizWrong')}
              </ThemedText>
            ) : null}
          </Card>
        );
      })}
      {answeredCount === lesson.quiz.length ? (
        <ThemedText variant="heading" color={theme.primary}>
          {t('lesson.quizScore', { score, total: lesson.quiz.length })}
        </ThemedText>
      ) : null}
    </View>
  );
}

export default function LessonScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id ?? '');
  const progress = useProgressStore();
  const saved = useSavedStore();

  const [note, setNote] = useState(lesson ? (progress.lessonNotes[lesson.id] ?? '') : '');

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('lesson.title') }} />
        <EmptyState message={t('common.empty')} />
      </Screen>
    );
  }

  const siblings = getProgramLessons(lesson.programId);
  const index = siblings.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index < siblings.length - 1 ? siblings[index + 1] : undefined;
  const isDone = !!progress.completedLessons[lesson.id];
  const isSaved = saved.isSaved('lesson', lesson.id);
  const relatedVideo = lesson.relatedVideoIds[0] ? getVideo(lesson.relatedVideoIds[0]) : undefined;

  return (
    <Screen>
      <Stack.Screen options={{ title: lesson.title }} />

      {/* İlgili video kartı */}
      {relatedVideo ? (
        <Pressable onPress={() => router.push(`/video/${relatedVideo.id}`)}>
          <View
            style={{
              height: 140,
              borderRadius: Radius.lg,
              backgroundColor: `hsl(${relatedVideo.thumbnailHue}, 45%, 25%)`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Spacing.md,
            }}
          >
            <Ionicons name="play-circle" size={44} color="rgba(255,255,255,0.9)" />
            <ThemedText variant="caption" color="#FFF" style={{ marginTop: Spacing.xs }}>
              {relatedVideo.title}
            </ThemedText>
          </View>
        </Pressable>
      ) : null}

      {/* Yazılı anlatım */}
      {lesson.body.map((para, i) => (
        <ThemedText key={i} style={{ marginBottom: Spacing.md, lineHeight: 24 }}>
          {para}
        </ThemedText>
      ))}

      {/* Önemli bilgiler */}
      <Card tone="primary">
        <ThemedText variant="label" style={{ marginBottom: Spacing.xs }}>
          {t('lesson.keyPoints')}
        </ThemedText>
        {lesson.keyPoints.map((point, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs }}>
            <ThemedText color={theme.primary}>•</ThemedText>
            <ThemedText variant="secondary" style={{ flex: 1 }}>
              {point}
            </ThemedText>
          </View>
        ))}
      </Card>

      {/* Kaynaklar */}
      <View style={{ marginTop: Spacing.md, gap: Spacing.xs }}>
        {lesson.sources.map((src, i) => (
          <SourceBadge key={i} source={src.reference} verified />
        ))}
      </View>

      {/* Test */}
      {lesson.quiz.length > 0 ? (
        <>
          <SectionHeader title={t('lesson.quiz')} />
          <Quiz lessonId={lesson.id} />
        </>
      ) : null}

      {/* Kişisel not */}
      <SectionHeader title={t('lesson.personalNote')} />
      <TextInput
        value={note}
        onChangeText={setNote}
        onEndEditing={() => progress.setLessonNote(lesson.id, note)}
        placeholder={t('lesson.notePlaceholder')}
        placeholderTextColor={theme.textSecondary}
        multiline
        style={{
          backgroundColor: theme.surface,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: theme.border,
          padding: Spacing.md,
          minHeight: 80,
          color: theme.text,
          textAlignVertical: 'top',
        }}
      />

      {/* Tamamla + kaydet */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
        <Button
          title={isDone ? t('lesson.markedComplete') : t('lesson.markComplete')}
          variant={isDone ? 'secondary' : 'primary'}
          style={{ flex: 2 }}
          onPress={() => {
            progress.setLessonNote(lesson.id, note);
            progress.setLessonCompleted(lesson.id, !isDone);
          }}
        />
        <Button
          title={isSaved ? t('common.saved') : t('common.save')}
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() =>
            saved.toggle({
              type: 'lesson',
              refId: lesson.id,
              title: lesson.title,
              preview: lesson.keyPoints[0],
              offline: true,
            })
          }
        />
      </View>

      {/* Asistan soruları */}
      {lesson.relatedAiQuestions.length > 0 ? (
        <>
          <SectionHeader title={t('lesson.relatedAiQuestions')} />
          {lesson.relatedAiQuestions.map((q) => (
            <Card key={q} style={{ marginBottom: Spacing.xs }} onPress={() => router.push('/assistant')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.primary} />
                <ThemedText variant="secondary" style={{ flex: 1 }}>
                  {q}
                </ThemedText>
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {/* Önceki / sonraki */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
        {prev ? (
          <Button
            title={`← ${t('lesson.previousLesson')}`}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => router.replace(`/lesson/${prev.id}`)}
          />
        ) : null}
        {next ? (
          <Button
            title={`${t('lesson.nextLesson')} →`}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => router.replace(`/lesson/${next.id}`)}
          />
        ) : null}
      </View>
    </Screen>
  );
}
