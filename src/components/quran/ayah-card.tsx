import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { TajweedText } from '@/components/quran/tajweed-text';
import { Radius, Spacing } from '@/constants/theme';
import type { Ayah } from '@/data/quran';
import { useTheme } from '@/hooks/use-theme';
import type { QuranPrefs } from '@/store/settings';

interface Props {
  ayah: Ayah;
  prefs: QuranPrefs;
  isPlaying: boolean;
  isPending: boolean;
  /** Bu ayet oynatıcıda yüklü mü (tekrar oynat butonu için) */
  isCurrent: boolean;
  bookmarked: boolean;
  saved: boolean;
  noteText?: string;
  onPlayPause: () => void;
  onReplay: () => void;
  onToggleBookmark: () => void;
  onToggleSave: () => void;
  onEditNote: () => void;
  onShare: () => void;
}

/** Okuma ekranındaki tek ayet kartı: Arapça + transkripsiyon + meal + eylemler. */
export function AyahCard({
  ayah,
  prefs,
  isPlaying,
  isPending,
  isCurrent,
  bookmarked,
  saved,
  noteText,
  onPlayPause,
  onReplay,
  onToggleBookmark,
  onToggleSave,
  onEditNote,
  onShare,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const iconButton = (
    icon: React.ComponentProps<typeof Ionicons>['name'],
    label: string,
    onPress: () => void,
    active?: boolean,
  ) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 34,
        height: 34,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.primarySoft : 'transparent',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={18} color={active ? theme.primary : theme.textSecondary} />
    </Pressable>
  );

  return (
    <Card style={{ gap: Spacing.sm, marginBottom: Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{
            minWidth: 30,
            height: 30,
            borderRadius: Radius.full,
            backgroundColor: theme.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: Spacing.xs,
          }}
        >
          <ThemedText variant="caption" color={theme.primary}>
            {ayah.number}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isPending ? (
            <View style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            iconButton(
              isPlaying ? 'pause' : 'play',
              isPlaying ? t('quran.reader.pauseAudio') : t('quran.reader.listen'),
              onPlayPause,
              isPlaying,
            )
          )}
          {isCurrent ? iconButton('refresh', t('quran.reader.replay'), onReplay) : null}
          {iconButton(
            bookmarked ? 'bookmark' : 'bookmark-outline',
            t('quran.reader.bookmark'),
            onToggleBookmark,
            bookmarked,
          )}
          {iconButton(
            saved ? 'heart' : 'heart-outline',
            t('quran.reader.saveAyah'),
            onToggleSave,
            saved,
          )}
          {iconButton(
            noteText ? 'document-text' : 'create-outline',
            noteText ? t('quran.reader.editNote') : t('quran.reader.addNote'),
            onEditNote,
            !!noteText,
          )}
          {iconButton('share-social-outline', t('quran.reader.shareAyah'), onShare)}
        </View>
      </View>

      <TajweedText
        ayah={ayah}
        fontSize={prefs.fontSize}
        lineHeightMultiplier={prefs.lineHeightMultiplier}
        tajweedEnabled={prefs.showTajweed}
        accessibleMarks={prefs.tajweedAccessibleMarks}
        arabicFont={prefs.arabicFont}
      />

      {prefs.showTransliteration && ayah.transliteration ? (
        <ThemedText variant="secondary" style={{ fontStyle: 'italic' }}>
          {ayah.transliteration}
        </ThemedText>
      ) : null}

      {prefs.showTranslation ? <ThemedText>{ayah.translation}</ThemedText> : null}

      {noteText ? (
        <View
          style={{
            backgroundColor: theme.surfaceAlt,
            borderRadius: Radius.md,
            padding: Spacing.sm,
            flexDirection: 'row',
            gap: Spacing.sm,
            alignItems: 'flex-start',
          }}
        >
          <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="caption">{t('quran.reader.myNote')}</ThemedText>
            <ThemedText variant="secondary">{noteText}</ThemedText>
          </View>
        </View>
      ) : null}
    </Card>
  );
}
