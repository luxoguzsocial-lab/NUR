import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VideoSurface } from '@/components/media/video-surface';
import { ThemedText } from '@/components/themed-text';
import { DemoBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getDailyInspiration } from '@/data/inspiration';
import { VIDEO_CATEGORIES, VIDEOS, type VideoCategory, type VideoItem } from '@/data/videos';
import { chooseDialog, infoDialog } from '@/lib/dialogs';
import { shareText } from '@/lib/share';
import { useTheme } from '@/hooks/use-theme';
import { todayISO } from '@/lib/format';
import { useMediaStore } from '@/store/media';
import { useSavedStore } from '@/store/saved';
import { useSettingsStore } from '@/store/settings';

/** Her 5 videoda bir düşünme molası kartı (bağımlılık hedeflemeyen tasarım). */
const REFLECTION_INTERVAL = 5;
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };

type FeedItem = { kind: 'video'; video: VideoItem } | { kind: 'reflection'; id: string };

function ActionButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ alignItems: 'center', gap: 2 }}>
      <Ionicons name={icon} size={26} color={active ? '#FFD86B' : '#FFFFFF'} />
      <ThemedText variant="caption" color="#FFFFFF" style={{ fontSize: 10 }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function VideoPage({
  video,
  height,
  active,
  muted,
  onToggleMute,
}: {
  video: VideoItem;
  height: number;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const media = useMediaStore();
  const saved = useSavedStore();
  const [playing, setPlaying] = useState(settings.videoAutoplay);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [aminSaid, setAminSaid] = useState(false);

  const following = media.followedCreators.includes(video.creator.id);
  const isSaved = saved.isSaved('video', video.id);

  useEffect(() => {
    if (!active || !playing) return;
    media.markWatched(video.id);
    const stepMs = 3500 / settings.playbackSpeed;
    const id = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % video.subtitles.length);
      media.addWatchSeconds(todayISO(), Math.round(stepMs / 1000));
    }, stepMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playing, settings.playbackSpeed, video.id]);

  const sayAmin = () => {
    setAminSaid(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setAminSaid(false), 1600);
  };

  const report = () => {
    chooseDialog(t('video.reportMisinfo'), t('video.reportReason'), [
      { text: t('video.reasonWrongInfo'), onPress: () => media.reportVideo(video.id, 'wrongInfo') },
      { text: t('video.reasonBadSource'), onPress: () => media.reportVideo(video.id, 'badSource') },
      { text: t('video.reasonOther'), onPress: () => media.reportVideo(video.id, 'other') },
    ], t('common.cancel'));
  };

  const hue = video.thumbnailHue;
  return (
    <Pressable style={{ height }} onPress={() => setPlaying((p) => !p)}>
      <View style={{ flex: 1, backgroundColor: `hsl(${hue}, 45%, 22%)` }}>
        {video.media ? (
          <VideoSurface
            source={video.media}
            playing={active && playing}
            muted={muted}
            playbackRate={settings.playbackSpeed}
            onToggle={() => setPlaying((p) => !p)}
          />
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                backgroundColor: `hsl(${(hue + 30) % 360}, 50%, 30%)`,
                opacity: 0.5,
              }}
            />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {!playing ? (
                <>
                  <Ionicons name="play-circle" size={72} color="rgba(255,255,255,0.9)" />
                  {!settings.videoAutoplay ? (
                    <ThemedText variant="caption" color="#FFFFFF" style={{ marginTop: Spacing.sm }}>
                      {t('video.autoplayOff')}
                    </ThemedText>
                  ) : null}
                </>
              ) : (
                <Ionicons name="musical-notes-outline" size={36} color="rgba(255,255,255,0.5)" />
              )}
            </View>
          </>
        )}

        {/* Altyazı — gerçek videolarda gömülüdür */}
        {!video.media ? (
          <View style={{ position: 'absolute', bottom: 190 + insets.bottom, left: Spacing.md, right: 80 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Radius.md, padding: Spacing.sm }}>
              <ThemedText color="#FFFFFF">{video.subtitles[subtitleIndex]}</ThemedText>
            </View>
          </View>
        ) : null}

        {/* Âmin geri bildirimi */}
        {aminSaid ? (
          <View
            style={{
              position: 'absolute',
              top: '40%',
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.sm,
              }}
            >
              <ThemedText color="#FFD86B" style={{ fontSize: 24, fontWeight: '700' }}>
                {t('video.aminDone')}
              </ThemedText>
            </View>
          </View>
        ) : null}

        {/* Alt bilgi */}
        <View style={{ position: 'absolute', bottom: 90 + insets.bottom, left: Spacing.md, right: 80 }}>
          <DemoBadge />
          <ThemedText variant="heading" color="#FFFFFF" style={{ marginTop: Spacing.xs }}>
            {video.title}
          </ThemedText>
          <ThemedText variant="caption" color="rgba(255,255,255,0.8)">
            {video.creator.name}
            {video.creator.verified ? ' ✓' : ''} · {Math.round(video.durationSec / 60)} {t('common.minuteShort')}
            {video.kidFriendly ? ` · ${t('discover.kidFriendly')}` : ''}
          </ThemedText>
        </View>

        {/* Sağ eylem sütunu */}
        <View
          style={{
            position: 'absolute',
            right: Spacing.sm,
            bottom: 96 + insets.bottom,
            gap: Spacing.md,
            alignItems: 'center',
          }}
        >
          {video.media ? (
            <ActionButton
              icon={muted ? 'volume-mute' : 'volume-high'}
              label={t('video.sound')}
              onPress={onToggleMute}
            />
          ) : null}
          <ActionButton icon="sparkles-outline" label={t('video.amin')} onPress={sayAmin} />
          <ActionButton
            icon={isSaved ? 'heart' : 'heart-outline'}
            label={t('common.save')}
            active={isSaved}
            onPress={() =>
              saved.toggle({
                type: 'video',
                refId: video.id,
                title: video.title,
                preview: video.description,
                offline: !!video.media,
              })
            }
          />
          <ActionButton
            icon="share-outline"
            label={t('common.share')}
            onPress={() => void shareText(`${video.title} — NUR (demo)`)}
          />
          <ActionButton
            icon={following ? 'person' : 'person-add-outline'}
            label={following ? t('video.following') : t('video.follow')}
            active={following}
            onPress={() => media.toggleFollow(video.creator.id)}
          />
          <ActionButton
            icon="eye-off-outline"
            label={t('video.notInterested')}
            onPress={() => {
              media.markNotInterested(video.id);
              infoDialog('', t('video.notInterestedDone'));
            }}
          />
          <ActionButton icon="flag-outline" label={t('common.reportError')} onPress={report} />
          <ActionButton
            icon="information-circle-outline"
            label={t('video.title')}
            onPress={() => router.push(`/video/${video.id}`)}
          />
        </View>
      </View>
    </Pressable>
  );
}

function ReflectionPage({ height }: { height: number }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const reflection = getDailyInspiration(new Date()).reflection;
  return (
    <View
      style={{
        height,
        backgroundColor: theme.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        gap: Spacing.md,
      }}
    >
      <Ionicons name="leaf-outline" size={48} color={theme.primary} />
      <ThemedText variant="title" style={{ textAlign: 'center' }}>
        {t('video.reflectionTitle')}
      </ThemedText>
      <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
        {reflection.text}
      </ThemedText>
      <ThemedText variant="caption" style={{ textAlign: 'center', marginTop: Spacing.lg }}>
        {t('video.feedInfo')}
      </ThemedText>
    </View>
  );
}

export default function IlhamScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const media = useMediaStore();
  const settings = useSettingsStore();
  // Ekran odaktan çıkınca (başka sekme/ekran) oynatma durmalı; aksi hâlde ses arkada devam eder.
  const focused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [breakDismissed, setBreakDismissed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [category, setCategory] = useState<VideoCategory | null>(null);
  const listRef = useRef<FlatList<FeedItem>>(null);

  // Kategori seçimi: listeyi başa sar (yoksa eski kaydırma ofseti
  // yeni, daha kısa listede boş ekran gösterir).
  const selectCategory = (id: VideoCategory | null) => {
    setCategory(id);
    setActiveIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  // Kronolojik, kişiselleştirmesiz akış; kategori filtreli, 'ilgilenmiyorum' hariç
  const items = useMemo<FeedItem[]>(() => {
    const visible = VIDEOS.filter(
      (v) => !media.notInterested.includes(v.id) && (!category || v.category === category),
    );
    const result: FeedItem[] = [];
    visible.forEach((video, i) => {
      result.push({ kind: 'video', video });
      if ((i + 1) % REFLECTION_INTERVAL === 0) result.push({ kind: 'reflection', id: `r-${i}` });
    });
    return result;
  }, [media.notInterested, category]);

  const watchedMinutes = Math.round((media.watchSecondsByDay[todayISO()] ?? 0) / 60);
  const showBreak = !breakDismissed && watchedMinutes >= settings.dailyWatchReminderMinutes;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (first && typeof first.index === 'number') setActiveIndex(first.index);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => (item.kind === 'video' ? item.video.id : item.id)}
        renderItem={({ item, index }) =>
          item.kind === 'video' ? (
            <VideoPage
              video={item.video}
              height={height}
              active={focused && index === activeIndex && !showBreak}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          ) : (
            <ReflectionPage height={height} />
          )
        }
        pagingEnabled
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              height,
              alignItems: 'center',
              justifyContent: 'center',
              padding: Spacing.xl,
              gap: Spacing.md,
            }}
          >
            <Ionicons name="videocam-off-outline" size={44} color="rgba(255,255,255,0.6)" />
            <ThemedText color="#FFFFFF" style={{ textAlign: 'center' }}>
              {t('video.feedEmpty')}
            </ThemedText>
          </View>
        }
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
      />

      {/* Üst kategori çipleri */}
      <View style={{ position: 'absolute', top: insets.top + Spacing.sm, left: 0, right: 0 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}
        >
          {[null, ...VIDEO_CATEGORIES.map((c) => c.id)].map((id) => {
            const selected = category === id;
            const label = id === null ? t('video.categoryAll') : VIDEO_CATEGORIES.find((c) => c.id === id)!.labelTr;
            return (
              <Pressable
                key={id ?? 'all'}
                onPress={() => selectCategory(id as VideoCategory | null)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={{
                  backgroundColor: selected ? '#FFD86B' : 'rgba(0,0,0,0.5)',
                  borderRadius: Radius.full,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  borderWidth: 1,
                  borderColor: selected ? '#FFD86B' : 'rgba(255,255,255,0.25)',
                }}
              >
                <ThemedText variant="label" color={selected ? '#1C1B18' : '#FFFFFF'}>
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Günlük izleme molası */}
      {showBreak ? (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: theme.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            padding: Spacing.xl,
          }}
        >
          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: Radius.xl,
              padding: Spacing.xl,
              alignItems: 'center',
              gap: Spacing.md,
              maxWidth: 340,
            }}
          >
            <Ionicons name="cafe-outline" size={40} color={theme.primary} />
            <ThemedText variant="heading" style={{ textAlign: 'center' }}>
              {t('video.watchBreakTitle')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {t('video.watchBreakBody', { minutes: watchedMinutes })}
            </ThemedText>
            <Pressable onPress={() => setBreakDismissed(true)} accessibilityRole="button">
              <ThemedText color={theme.primary}>{t('video.reflectionContinue')}</ThemedText>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
