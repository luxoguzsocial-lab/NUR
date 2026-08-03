import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, SectionHeader, SourceBadge } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { getSurahMeta } from '@/data/quran';
import { isSurahAvailable } from '@/data/quran-text';
import { getLessonBySurah } from '@/data/surah-lessons';
import { useTheme } from '@/hooks/use-theme';
import { useProgressStore } from '@/store/progress';

export default function SurahLessonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const surahNumber = Number(params.id);

  const { t } = useTranslation();
  const theme = useTheme();

  const lesson = getLessonBySurah(surahNumber);
  const meta = getSurahMeta(surahNumber);

  const completedLessons = useProgressStore((s) => s.completedLessons);
  const setLessonCompleted = useProgressStore((s) => s.setLessonCompleted);

  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!lesson || !meta) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('surahLessons.title') }} />
        <EmptyState icon="school-outline" message={t('surahLessons.notFound')} />
      </Screen>
    );
  }

  const completed = !!completedLessons[lesson.id];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === lesson.quiz.length;
  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.correctIndex).length;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('surahLessons.lessonOf', { surah: meta.turkishName }) }} />

      {/* Başlık */}
      <Card style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{meta.turkishName}</ThemedText>
            <ThemedText variant="caption">
              {t('surahLessons.revelation')}: {t(`quran.place.${meta.revelationPlace}`)} ·{' '}
              {t('surahLessons.ayahCountLabel')}: {meta.ayahCount}
            </ThemedText>
          </View>
          <ThemedText variant="arabic" style={{ fontSize: FontSize.xl }}>
            {meta.arabicName}
          </ThemedText>
        </View>
        {completed ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <Ionicons name="checkmark-circle" size={14} color={theme.success} />
            <ThemedText variant="caption" color={theme.success}>
              {t('surahLessons.completedBadge')}
            </ThemedText>
          </View>
        ) : null}
        {isSurahAvailable(surahNumber) ? (
          <Button
            title={t('surahLessons.readSurah')}
            variant="secondary"
            onPress={() => router.push(`/quran/surah/${surahNumber}`)}
          />
        ) : null}
      </Card>

      {/* Adı ve anlamı */}
      <SectionHeader title={t('surahLessons.meaning')} />
      <Card>
        <ThemedText>{lesson.nameMeaning}</ThemedText>
      </Card>

      {/* Ana konular */}
      <SectionHeader title={t('surahLessons.mainTopics')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {lesson.mainTopics.map((topic) => (
          <View
            key={topic}
            style={{
              backgroundColor: theme.primarySoft,
              borderRadius: Radius.full,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
            }}
          >
            <ThemedText variant="caption" color={theme.primary}>
              {topic}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Özet */}
      <SectionHeader title={t('surahLessons.summary')} />
      <Card style={{ gap: Spacing.sm }}>
        <ThemedText>{lesson.summary}</ThemedText>
        <SourceBadge source={lesson.tafsirSources} verified={lesson.verified} />
      </Card>

      {/* Günlük hayata çıkarımlar */}
      <SectionHeader title={t('surahLessons.takeaways')} />
      <Card style={{ gap: Spacing.sm }}>
        {lesson.takeaways.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
            <Ionicons name="leaf-outline" size={14} color={theme.primary} style={{ marginTop: 3 }} />
            <ThemedText style={{ flex: 1 }}>{item}</ThemedText>
          </View>
        ))}
      </Card>

      {/* Tefsir kaynakları */}
      <SectionHeader title={t('surahLessons.tafsirSources')} />
      <Card style={{ gap: Spacing.sm }}>
        <ThemedText variant="secondary">{lesson.tafsirSources}</ThemedText>
        <ThemedText variant="caption">{t('surahLessons.verificationInfo')}</ThemedText>
      </Card>

      {/* Ders sonu testi */}
      <SectionHeader title={t('surahLessons.quizTitle')} />
      {lesson.quiz.map((question, qIndex) => {
        const selected = answers[qIndex];
        const answered = selected !== undefined;
        return (
          <Card key={qIndex} style={{ gap: Spacing.sm, marginBottom: Spacing.sm }}>
            <ThemedText variant="caption">
              {t('surahLessons.quizQuestion', { index: qIndex + 1, total: lesson.quiz.length })}
            </ThemedText>
            <ThemedText variant="label">{question.question}</ThemedText>
            {question.options.map((option, oIndex) => {
              const isSelected = selected === oIndex;
              const isCorrect = oIndex === question.correctIndex;
              const showState = answered && (isSelected || isCorrect);
              const borderColor = showState
                ? isCorrect
                  ? theme.success
                  : theme.danger
                : theme.border;
              return (
                <Pressable
                  key={oIndex}
                  disabled={answered}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled: answered }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                    borderWidth: 1,
                    borderColor,
                    borderRadius: Radius.md,
                    padding: Spacing.sm + 2,
                    backgroundColor: pressed
                      ? theme.surfaceAlt
                      : showState && isCorrect
                        ? theme.primarySoft
                        : 'transparent',
                    opacity: answered && !showState ? 0.6 : 1,
                  })}
                >
                  {showState ? (
                    <Ionicons
                      name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={isCorrect ? theme.success : theme.danger}
                    />
                  ) : (
                    <Ionicons name="ellipse-outline" size={16} color={theme.textSecondary} />
                  )}
                  <ThemedText style={{ flex: 1 }}>{option}</ThemedText>
                </Pressable>
              );
            })}
            {answered ? (
              <ThemedText
                variant="caption"
                color={selected === question.correctIndex ? theme.success : theme.danger}
              >
                {selected === question.correctIndex
                  ? t('surahLessons.quizCorrect')
                  : t('surahLessons.quizWrong', {
                      answer: question.options[question.correctIndex],
                    })}
              </ThemedText>
            ) : null}
          </Card>
        );
      })}

      {allAnswered ? (
        <Card tone="primary" style={{ gap: Spacing.sm }}>
          <ThemedText variant="label" color={theme.primary}>
            {t('surahLessons.quizScore', { correct: correctCount, total: lesson.quiz.length })}
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Button
              title={t('surahLessons.quizReset')}
              variant="secondary"
              onPress={() => setAnswers({})}
              style={{ flex: 1 }}
            />
            {!completed ? (
              <Button
                title={t('surahLessons.markCompleted')}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setLessonCompleted(lesson.id, true);
                }}
                style={{ flex: 1 }}
              />
            ) : null}
          </View>
        </Card>
      ) : null}

      {/* İlgili AI soruları */}
      <SectionHeader title={t('surahLessons.aiQuestionsTitle')} />
      <ThemedText variant="caption" style={{ marginBottom: Spacing.sm }}>
        {t('surahLessons.aiQuestionsHint')}
      </ThemedText>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {lesson.aiQuestions.map((question, index) => (
          <Pressable
            key={index}
            onPress={() => router.push('/assistant')}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              padding: Spacing.md,
              backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: theme.border,
            })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.primary} />
            <ThemedText style={{ flex: 1 }}>{question}</ThemedText>
            <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}
