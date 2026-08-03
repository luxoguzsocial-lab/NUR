import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EsmaCard } from '@/components/content/esma-card';
import { SearchInput } from '@/components/content/search-input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, ProgressBar, SourceBadge } from '@/components/ui-bits';
import { FontSize, Spacing } from '@/constants/theme';
import { normalizeTr } from '@/data/duas';
import { ESMA_NAMES, ESMA_SOURCE, type EsmaName } from '@/data/esma';
import { getDailyInspiration } from '@/data/inspiration';
import { useTheme } from '@/hooks/use-theme';

function shuffleNames(names: readonly EsmaName[]): EsmaName[] {
  const deck = [...names];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
  }
  return deck;
}

/** Ezber modu: kart destesi — önce Arapça, dokununca anlam, biliyorum/bilmiyorum ile ilerleme. */
function MemorizeDeck({ onExit }: { onExit: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [deck, setDeck] = useState<EsmaName[]>(() => shuffleNames(ESMA_NAMES));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const finished = index >= deck.length;
  const current = deck[index];

  const answer = (didKnow: boolean) => {
    if (didKnow) setKnown((n) => n + 1);
    else setUnknown((n) => n + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setDeck(shuffleNames(ESMA_NAMES));
    setIndex(0);
    setRevealed(false);
    setKnown(0);
    setUnknown(0);
  };

  if (finished || !current) {
    return (
      <View style={{ gap: Spacing.md, marginTop: Spacing.lg }}>
        <Card tone="primary" style={{ alignItems: 'center', gap: Spacing.sm }}>
          <Ionicons name="ribbon-outline" size={36} color={theme.primary} />
          <ThemedText variant="heading">{t('esma.sessionDone')}</ThemedText>
          <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
            {t('esma.score', { known, unknown })}
          </ThemedText>
        </Card>
        <Button title={t('esma.restart')} onPress={restart} />
        <Button title={t('esma.backToList')} variant="ghost" onPress={onExit} />
      </View>
    );
  }

  return (
    <View style={{ gap: Spacing.md, marginTop: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <ThemedText variant="secondary">
          {t('esma.progress', { current: index + 1, total: deck.length })}
        </ThemedText>
        <ProgressBar ratio={index / deck.length} style={{ flex: 1 }} />
      </View>

      <Pressable
        onPress={() => setRevealed(true)}
        accessibilityRole="button"
        accessibilityLabel={t('esma.memorizeHint')}
      >
        <Card style={{ alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl }}>
          <ThemedText
            variant="arabic"
            style={{ fontSize: FontSize.arabicMax, textAlign: 'center' }}
          >
            {current.arabic}
          </ThemedText>
          {revealed ? (
            <View style={{ alignItems: 'center', gap: Spacing.sm }}>
              <ThemedText variant="heading">{current.transliteration}</ThemedText>
              <ThemedText variant="label" color={theme.primary}>
                {current.meaningTr}
              </ThemedText>
              <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
                {current.description}
              </ThemedText>
            </View>
          ) : (
            <ThemedText variant="secondary">{t('esma.memorizeHint')}</ThemedText>
          )}
        </Card>
      </Pressable>

      {revealed ? (
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Button
            title={t('esma.dontKnow')}
            variant="secondary"
            onPress={() => answer(false)}
            style={{ flex: 1 }}
          />
          <Button title={t('esma.know')} onPress={() => answer(true)} style={{ flex: 1 }} />
        </View>
      ) : null}

      <Button title={t('esma.backToList')} variant="ghost" onPress={onExit} />
    </View>
  );
}

export default function EsmaScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [mode, setMode] = useState<'list' | 'memorize'>('list');
  const [query, setQuery] = useState('');

  const todaysEsma = useMemo(() => getDailyInspiration(new Date()).esma, []);

  const filtered = useMemo(() => {
    const q = normalizeTr(query.trim());
    if (!q) return ESMA_NAMES;
    return ESMA_NAMES.filter(
      (n) =>
        normalizeTr(n.transliteration).includes(q) ||
        normalizeTr(n.meaningTr).includes(q) ||
        normalizeTr(n.description).includes(q),
    );
  }, [query]);

  if (mode === 'memorize') {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('esma.title') }} />
        <MemorizeDeck onExit={() => setMode('list')} />
      </Screen>
    );
  }

  const header = (
    <View style={{ gap: Spacing.md, marginBottom: Spacing.md }}>
      <Card tone="primary" style={{ gap: Spacing.sm }}>
        <ThemedText variant="label" color={theme.primary}>
          {t('esma.todaysName')}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{todaysEsma.transliteration}</ThemedText>
            <ThemedText variant="secondary">{todaysEsma.meaningTr}</ThemedText>
          </View>
          <ThemedText variant="arabic">{todaysEsma.arabic}</ThemedText>
        </View>
        <ThemedText>{todaysEsma.description}</ThemedText>
        <SourceBadge source={ESMA_SOURCE} verified />
      </Card>

      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('esma.searchPlaceholder')}
      />
      <Button
        title={t('esma.memorizeMode')}
        variant="secondary"
        onPress={() => setMode('memorize')}
      />
      <ThemedText variant="secondary">{t('esma.subtitle')}</ThemedText>
    </View>
  );

  return (
    <Screen scroll={false} padded={false}>
      <Stack.Screen options={{ title: t('esma.title') }} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.order)}
        renderItem={({ item }) => <EsmaCard esma={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState icon="search-outline" message={t('esma.noResults')} />}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl }}
        initialNumToRender={8}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}
