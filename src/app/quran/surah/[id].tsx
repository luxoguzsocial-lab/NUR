import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
  type ViewToken,
} from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, SourceBadge } from '@/components/ui-bits';
import { AyahCard } from '@/components/quran/ayah-card';
import { ReaderSettingsModal } from '@/components/quran/reader-settings';
import { TajweedLegend } from '@/components/quran/tajweed-legend';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { getSurahMeta, type Ayah } from '@/data/quran';
import {
  BESMELE_ARABIC,
  BESMELE_TRANSLITERATION,
  QURAN_TEXT_SOURCE,
  QURAN_TRANSLATION_SOURCE,
  getSurahText,
} from '@/data/quran-text';
import { hasLesson } from '@/data/surah-lessons';
import { infoDialog } from '@/lib/dialogs';
import { shareText } from '@/lib/share';
import { useTheme } from '@/hooks/use-theme';
import { todayISO } from '@/lib/format';
import { useAyahRecitation } from '@/lib/recitation';
import { useProgressStore } from '@/store/progress';
import { useSavedStore } from '@/store/saved';
import { useSettingsStore } from '@/store/settings';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };

export default function SurahReaderScreen() {
  const params = useLocalSearchParams<{ id: string; ayah?: string }>();
  const surahNumber = Number(params.id);
  const initialAyah = params.ayah ? Number(params.ayah) : undefined;

  const { t } = useTranslation();
  const theme = useTheme();
  const prefs = useSettingsStore((s) => s.quran);

  const meta = getSurahMeta(surahNumber);
  const text = getSurahText(surahNumber);

  const bookmarks = useProgressStore((s) => s.bookmarks);
  const notes = useProgressStore((s) => s.notes);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const upsertNote = useProgressStore((s) => s.upsertNote);
  const setLastRead = useProgressStore((s) => s.setLastRead);
  const isSurahRead = useProgressStore((s) => s.readSurahs.includes(surahNumber));
  const toggleSurahRead = useProgressStore((s) => s.toggleSurahRead);
  const savedItems = useSavedStore((s) => s.items);
  const toggleSaved = useSavedStore((s) => s.toggle);

  const recitation = useAyahRecitation(prefs.reciter);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);
  const [noteAyah, setNoteAyah] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const listRef = useRef<FlatList<Ayah>>(null);
  const lastViewedRef = useRef<number | null>(null);

  // Ekranda geçen süre -> günlük Kur'an dakikaları (ekrandan çıkarken).
  const startTimeRef = useRef(0);
  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      const minutes = Math.round((Date.now() - startTimeRef.current) / 60000);
      if (minutes > 0) {
        useProgressStore.getState().addQuranMinutes(todayISO(), minutes);
      }
    };
  }, []);

  // Ekran açılınca son okunan yeri güncelle.
  useEffect(() => {
    if (!text || !meta) return;
    const first = initialAyah ?? text.ayahs[0]?.number;
    if (first !== undefined) {
      setLastRead({ surah: surahNumber, ayah: first });
      lastViewedRef.current = first;
    }
    // Yalnızca ekran açılışında çalışsın.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber]);

  // Belirli ayete kaydır (yer imi / cüz girişi).
  useEffect(() => {
    if (!text || initialAyah === undefined) return;
    const index = text.ayahs.findIndex((a) => a.number === initialAyah);
    if (index <= 0) return;
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index, viewPosition: 0.1, animated: false });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber]);

  // Ağ hatasında nazik uyarı.
  useEffect(() => {
    if (recitation.networkError) {
      infoDialog(t('common.networkError'), t('quran.reader.audioError'));
      recitation.clearNetworkError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recitation.networkError]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const last = viewableItems[viewableItems.length - 1];
      const item = last?.item as Ayah | undefined;
      if (item && lastViewedRef.current !== item.number) {
        lastViewedRef.current = item.number;
        useProgressStore.getState().setLastRead({ surah: surahNumber, ayah: item.number });
      }
    },
    [surahNumber],
  );

  const noteByAyah = useMemo(() => {
    const map = new Map<number, string>();
    for (const note of notes) {
      if (note.surah === surahNumber) map.set(note.ayah, note.text);
    }
    return map;
  }, [notes, surahNumber]);

  const bookmarkedSet = useMemo(() => {
    const set = new Set<number>();
    for (const b of bookmarks) if (b.surah === surahNumber) set.add(b.ayah);
    return set;
  }, [bookmarks, surahNumber]);

  const savedSet = useMemo(() => {
    const set = new Set<string>();
    for (const item of savedItems) if (item.type === 'ayah') set.add(item.refId);
    return set;
  }, [savedItems]);

  const shareAyah = useCallback(
    async (ayah: Ayah) => {
      if (!meta) return;
      const message = `${ayah.arabic}\n\n${ayah.translation}\n\n(${meta.turkishName} ${surahNumber}:${ayah.number}) · ${t('quran.reader.ayahShareSuffix')}`;
      try {
        await shareText(message);
      } catch {
        // Kullanıcı paylaşımı iptal etti — sessiz geç.
      }
    },
    [meta, surahNumber, t],
  );

  if (!meta) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('quran.title') }} />
        <EmptyState message={t('common.empty')} />
      </Screen>
    );
  }

  // Demo pakette olmayan sure — tasarlanmış bilgi ekranı (hata değil).
  if (!text) {
    return (
      <Screen>
        <Stack.Screen options={{ title: meta.turkishName }} />
        <Card style={{ alignItems: 'center', gap: Spacing.md, marginTop: Spacing.lg, padding: Spacing.xl }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: Radius.full,
              backgroundColor: theme.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="book-outline" size={30} color={theme.primary} />
          </View>
          <ThemedText variant="arabic" style={{ textAlign: 'center' }}>
            {meta.arabicName}
          </ThemedText>
          <ThemedText variant="heading" style={{ textAlign: 'center' }}>
            {t('quran.reader.notInPackageTitle')}
          </ThemedText>
          <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
            {t('quran.reader.notInPackageBody')}
          </ThemedText>
          <ThemedText variant="caption" style={{ textAlign: 'center' }}>
            {t('quran.reader.notInPackageSourceNote')}
          </ThemedText>
          <ThemedText variant="caption">
            {t('quran.ayahCount', { count: meta.ayahCount })} · {t(`quran.place.${meta.revelationPlace}`)} ·{' '}
            {t('quran.juzShort', { juz: meta.juz })}
          </ThemedText>
          <Button
            title={t('quran.reader.goToAvailable')}
            onPress={() => router.back()}
            style={{ alignSelf: 'stretch' }}
          />
          {hasLesson(surahNumber) ? (
            <Button
              title={t('quran.reader.openLesson')}
              variant="secondary"
              onPress={() => router.push(`/quran/lesson/${surahNumber}`)}
              style={{ alignSelf: 'stretch' }}
            />
          ) : null}
        </Card>
      </Screen>
    );
  }

  const partialAyahList = text.complete ? '' : text.ayahs.map((a) => a.number).join(', ');

  const header = (
    <View style={{ gap: Spacing.sm, marginBottom: Spacing.sm }}>
      {/* Sure başlığı + hızlı ayarlar */}
      <Card style={{ gap: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{meta.turkishName}</ThemedText>
            <ThemedText variant="caption">
              {t('quran.ayahCount', { count: meta.ayahCount })} ·{' '}
              {t(`quran.place.${meta.revelationPlace}`)} · {t('quran.juzShort', { juz: meta.juz })}
            </ThemedText>
          </View>
          <ThemedText variant="arabic" style={{ fontSize: FontSize.xl }}>
            {meta.arabicName}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
          <Pressable
            onPress={() => setSettingsVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t('quran.reader.displaySettings')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.xs,
              backgroundColor: pressed ? theme.surfaceAlt : theme.primarySoft,
              borderRadius: Radius.full,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs + 2,
            })}
          >
            <Ionicons name="text-outline" size={14} color={theme.primary} />
            <ThemedText variant="caption" color={theme.primary}>
              {t('quran.reader.displaySettings')}
            </ThemedText>
          </Pressable>
          {prefs.showTajweed ? (
            <Pressable
              onPress={() => setLegendVisible((v) => !v)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.xs,
                backgroundColor: pressed ? theme.surfaceAlt : theme.accentSoft,
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.xs + 2,
              })}
            >
              <Ionicons name="color-palette-outline" size={14} color={theme.accent} />
              <ThemedText variant="caption" color={theme.accent}>
                {t('quran.reader.tajweedGuide')}
              </ThemedText>
            </Pressable>
          ) : null}
          {hasLesson(surahNumber) ? (
            <Pressable
              onPress={() => router.push(`/quran/lesson/${surahNumber}`)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.xs,
                backgroundColor: pressed ? theme.surfaceAlt : theme.accentSoft,
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.xs + 2,
              })}
            >
              <Ionicons name="school-outline" size={14} color={theme.accent} />
              <ThemedText variant="caption" color={theme.accent}>
                {t('quran.reader.openLesson')}
              </ThemedText>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              toggleSurahRead(surahNumber);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSurahRead }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.xs,
              backgroundColor: pressed
                ? theme.surfaceAlt
                : isSurahRead
                  ? theme.primarySoft
                  : theme.surfaceAlt,
              borderRadius: Radius.full,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs + 2,
              borderWidth: 1,
              borderColor: isSurahRead ? theme.success : theme.border,
            })}
          >
            <Ionicons
              name={isSurahRead ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={14}
              color={isSurahRead ? theme.success : theme.textSecondary}
            />
            <ThemedText
              variant="caption"
              color={isSurahRead ? theme.success : theme.textSecondary}
              style={isSurahRead ? { fontWeight: '700' } : undefined}
            >
              {isSurahRead ? t('quran.readBadge') : t('quran.markRead')}
            </ThemedText>
          </Pressable>
        </View>
        <SourceBadge source={`${t('quran.reader.textSourceLabel')}: ${QURAN_TEXT_SOURCE}`} />
        <SourceBadge source={`${t('quran.reader.translationSourceLabel')}: ${QURAN_TRANSLATION_SOURCE}`} />
      </Card>

      {prefs.showTajweed && legendVisible ? (
        <TajweedLegend accessibleMarks={prefs.tajweedAccessibleMarks} />
      ) : null}

      {!text.complete ? (
        <Card tone="accent">
          <ThemedText variant="secondary">
            {t('quran.reader.partialNote', { ayahs: partialAyahList })}
          </ThemedText>
        </Card>
      ) : null}

      {/* Besmele — Tevbe (9) hariç; Fâtiha'da ilk ayet zaten besmeledir. */}
      {surahNumber !== 9 && surahNumber !== 1 ? (
        <Card style={{ alignItems: 'center', gap: Spacing.xs }}>
          <ThemedText
            variant="arabic"
            style={{ fontSize: prefs.fontSize, textAlign: 'center' }}
            accessibilityLabel={t('quran.reader.besmeleTitle')}
          >
            {BESMELE_ARABIC}
          </ThemedText>
          {prefs.showTransliteration ? (
            <ThemedText variant="caption">{BESMELE_TRANSLITERATION}</ThemedText>
          ) : null}
        </Card>
      ) : null}
    </View>
  );

  return (
    <Screen scroll={false} padded={false}>
      <Stack.Screen options={{ title: meta.turkishName }} />
      <FlatList
        ref={listRef}
        data={text.ayahs}
        keyExtractor={(item) => String(item.number)}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, viewPosition: 0.1, animated: false });
          }, 250);
        }}
        renderItem={({ item }) => {
          const refId = `${surahNumber}:${item.number}`;
          const playing = recitation.isPlayingAyah(surahNumber, item.number);
          const current =
            recitation.current?.surah === surahNumber && recitation.current?.ayah === item.number;
          return (
            <AyahCard
              ayah={item}
              prefs={prefs}
              isPlaying={playing}
              isPending={recitation.isPendingAyah(surahNumber, item.number)}
              isCurrent={current}
              bookmarked={bookmarkedSet.has(item.number)}
              saved={savedSet.has(refId)}
              noteText={noteByAyah.get(item.number)}
              onPlayPause={() => {
                if (playing) {
                  recitation.pause();
                } else if (current) {
                  void recitation.replay();
                } else {
                  void recitation.play(surahNumber, item.number);
                }
              }}
              onReplay={() => void recitation.replay()}
              onToggleBookmark={() => {
                void Haptics.selectionAsync();
                toggleBookmark({ surah: surahNumber, ayah: item.number });
              }}
              onToggleSave={() => {
                void Haptics.selectionAsync();
                toggleSaved({
                  type: 'ayah',
                  refId,
                  title: `${meta.turkishName} · ${item.number}. ${t('quran.ayah')}`,
                  preview: item.translation.slice(0, 100),
                  offline: true,
                });
              }}
              onEditNote={() => {
                setNoteAyah(item.number);
                setNoteDraft(noteByAyah.get(item.number) ?? '');
              }}
              onShare={() => void shareAyah(item)}
            />
          );
        }}
      />

      <ReaderSettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      {/* Not ekleme/düzenleme */}
      <Modal
        visible={noteAyah !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteAyah(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.overlay,
            justifyContent: 'center',
            padding: Spacing.lg,
          }}
        >
          <Card style={{ gap: Spacing.md }}>
            <ThemedText variant="heading">
              {t('quran.reader.noteTitle', { surah: meta.turkishName, ayah: noteAyah ?? '' })}
            </ThemedText>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder={t('quran.reader.notePlaceholder')}
              placeholderTextColor={theme.textSecondary}
              multiline
              autoFocus
              style={{
                minHeight: 90,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: Radius.md,
                padding: Spacing.sm,
                color: theme.text,
                fontSize: FontSize.md,
                textAlignVertical: 'top',
              }}
            />
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Button
                title={t('common.cancel')}
                variant="secondary"
                onPress={() => setNoteAyah(null)}
                style={{ flex: 1 }}
              />
              <Button
                title={t('common.save')}
                onPress={() => {
                  if (noteAyah !== null) {
                    upsertNote({ surah: surahNumber, ayah: noteAyah }, noteDraft);
                  }
                  setNoteAyah(null);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}
