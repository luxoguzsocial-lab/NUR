import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { ELIFBA, ELIFBA_SOURCE } from '@/data/elifba';
import { speakArabic, stopSpeech } from '@/lib/arabic-speech';
import { useTheme } from '@/hooks/use-theme';
import { useKidsStore } from '@/store/kids';

export default function ElifbaScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const learned = useKidsStore((s) => s.learnedLetters);
  const toggleLetter = useKidsStore((s) => s.toggleLetter);

  const [index, setIndex] = useState(0);
  const letter = ELIFBA[index];
  const isLearned = learned.includes(letter.char);
  const allDone = learned.length >= ELIFBA.length;

  // Harf ve örnek kelime Arapça aslından, Arap telaffuzuyla okunur
  const speak = () => speakArabic(`${letter.char}. ${letter.example.arabic}`, 0.7);

  const goTo = (i: number) => {
    stopSpeech();
    setIndex(Math.min(ELIFBA.length - 1, Math.max(0, i)));
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('kids.sectionElifba') }} />

      <ProgressBar ratio={learned.length / ELIFBA.length} style={{ marginTop: Spacing.sm }} />
      <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
        {t('kids.progressLine', { done: learned.length, total: ELIFBA.length })}
      </ThemedText>
      {allDone ? (
        <Card tone="primary" style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="label" color={theme.primary}>
            {t('kids.allDone')}
          </ThemedText>
        </Card>
      ) : null}

      {/* Büyük harf kartı */}
      <Card style={{ marginTop: Spacing.md, alignItems: 'center', gap: Spacing.sm }}>
        <ThemedText variant="caption">
          {t('kids.letterOf', { current: index + 1, total: ELIFBA.length })}
        </ThemedText>
        <ThemedText variant="arabic" style={{ fontSize: 110, lineHeight: 150 }}>
          {letter.char}
        </ThemedText>
        <ThemedText variant="heading" style={{ fontSize: 28 }}>
          {letter.name}
        </ThemedText>

        <View
          style={{
            backgroundColor: theme.primarySoft,
            borderRadius: Radius.md,
            padding: Spacing.md,
            alignSelf: 'stretch',
            gap: 2,
          }}
        >
          <ThemedText variant="caption" color={theme.primary}>
            {t('kids.soundTipLabel')}
          </ThemedText>
          <ThemedText variant="secondary">{letter.soundTip}</ThemedText>
        </View>

        <View
          style={{
            backgroundColor: theme.surfaceAlt,
            borderRadius: Radius.md,
            padding: Spacing.md,
            alignSelf: 'stretch',
            gap: 2,
          }}
        >
          <ThemedText variant="caption">{t('kids.exampleLabel')}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <ThemedText variant="arabic" style={{ fontSize: 30, lineHeight: 44 }}>
              {letter.example.arabic}
            </ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontStyle: 'italic' }}>{letter.example.transliteration}</ThemedText>
              <ThemedText variant="caption">{letter.example.meaning}</ThemedText>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch' }}>
          <Button
            title={t('kids.listen')}
            variant="secondary"
            onPress={speak}
            style={{ flex: 1 }}
          />
          <Button
            title={isLearned ? t('kids.learnedUndo') : t('kids.learned')}
            variant={isLearned ? 'secondary' : 'primary'}
            onPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              toggleLetter(letter.char);
            }}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: Spacing.sm, alignSelf: 'stretch' }}>
          <Button
            title={t('kids.previous')}
            variant="ghost"
            onPress={() => goTo(index - 1)}
            disabled={index === 0}
            style={{ flex: 1 }}
          />
          <Button
            title={t('kids.next')}
            variant="ghost"
            onPress={() => goTo(index + 1)}
            disabled={index === ELIFBA.length - 1}
            style={{ flex: 1 }}
          />
        </View>
      </Card>

      {/* Harf ızgarası */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.sm,
          marginTop: Spacing.md,
          justifyContent: 'center',
        }}
      >
        {ELIFBA.map((l, i) => {
          const done = learned.includes(l.char);
          const current = i === index;
          return (
            <Pressable
              key={l.char}
              onPress={() => goTo(i)}
              accessibilityRole="button"
              style={{
                width: 52,
                height: 52,
                borderRadius: Radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: current
                  ? theme.primary
                  : done
                    ? theme.primarySoft
                    : theme.surfaceAlt,
                borderWidth: 1,
                borderColor: current ? theme.primary : theme.border,
              }}
            >
              <ThemedText
                variant="arabic"
                style={{ fontSize: 24, lineHeight: 34 }}
                color={current ? theme.onPrimary : done ? theme.primary : theme.text}
              >
                {l.char}
              </ThemedText>
              {done && !current ? (
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color={theme.success}
                  style={{ position: 'absolute', top: 2, right: 2 }}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
        {t('kids.elifbaSourceNote')} ({ELIFBA_SOURCE})
      </ThemedText>
    </Screen>
  );
}
