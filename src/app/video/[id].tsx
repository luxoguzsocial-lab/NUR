import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { VideoSurface } from '@/components/media/video-surface';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { DemoBadge, EmptyState, SectionHeader } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getLesson } from '@/data/programs';
import { getVideo, VIDEO_CATEGORIES } from '@/data/videos';
import { chooseDialog } from '@/lib/dialogs';
import { shareText } from '@/lib/share';
import { useTheme } from '@/hooks/use-theme';
import { useMediaStore } from '@/store/media';
import { useSavedStore } from '@/store/saved';

export default function VideoDetailScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = getVideo(id ?? '');
  const media = useMediaStore();
  const saved = useSavedStore();
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  if (!video) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t('video.title') }} />
        <EmptyState message={t('common.empty')} />
      </Screen>
    );
  }

  const following = media.followedCreators.includes(video.creator.id);
  const isSaved = saved.isSaved('video', video.id);
  const reported = !!media.reported[video.id];
  const category = VIDEO_CATEGORIES.find((c) => c.id === video.category);

  const report = () => {
    chooseDialog(t('video.reportMisinfo'), t('video.reportReason'), [
      { text: t('video.reasonWrongInfo'), onPress: () => media.reportVideo(video.id, 'wrongInfo') },
      { text: t('video.reasonBadSource'), onPress: () => media.reportVideo(video.id, 'badSource') },
    ], t('common.cancel'));
  };

  const sourceGroups = [
    { title: t('video.ayahSources'), items: video.sources.filter((s) => s.kind === 'ayah') },
    { title: t('video.hadithSources'), items: video.sources.filter((s) => s.kind === 'hadith') },
    { title: t('video.bookSources'), items: video.sources.filter((s) => s.kind === 'book') },
  ].filter((g) => g.items.length > 0);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('video.title') }} />
      {/* Önizleme */}
      {video.media ? (
        <View
          style={{
            height: 320,
            borderRadius: Radius.lg,
            overflow: 'hidden',
            backgroundColor: `hsl(${video.thumbnailHue}, 45%, 25%)`,
          }}
        >
          <VideoSurface source={video.media} playing={previewPlaying} muted playbackRate={1} onToggle={() => setPreviewPlaying((p) => !p)} />
        </View>
      ) : (
        <Pressable onPress={() => router.push('/(tabs)/ilham')}>
          <View
            style={{
              height: 180,
              borderRadius: Radius.lg,
              backgroundColor: `hsl(${video.thumbnailHue}, 45%, 25%)`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="play-circle" size={56} color="rgba(255,255,255,0.9)" />
          </View>
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md }}>
        <DemoBadge />
        <View
          style={{
            backgroundColor: theme.primarySoft,
            borderRadius: Radius.full,
            paddingHorizontal: Spacing.sm,
            paddingVertical: 2,
          }}
        >
          <ThemedText variant="caption" color={theme.primary}>
            {t('video.moderationApproved')}
          </ThemedText>
        </View>
        {video.kidFriendly ? (
          <ThemedText variant="caption" color={theme.success}>
            {t('discover.kidFriendly')}
          </ThemedText>
        ) : null}
      </View>

      <ThemedText variant="title" style={{ marginTop: Spacing.sm }}>
        {video.title}
      </ThemedText>
      <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
        {video.description}
      </ThemedText>
      <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
        {category?.labelTr} · {Math.round(video.durationSec / 60)} {t('common.minuteShort')} ·{' '}
        {t('video.subtitles')} ✓
      </ThemedText>
      <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
        {t('video.demoVideoNote')}
      </ThemedText>

      {/* Konuşmacı */}
      <SectionHeader title={t('video.speaker')} />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person-outline" size={22} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
              <ThemedText variant="heading">{video.creator.name}</ThemedText>
              {video.creator.verified ? (
                <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              ) : null}
            </View>
            <ThemedText variant="caption">{video.creator.title}</ThemedText>
            {video.creator.verified ? (
              <ThemedText variant="caption" color={theme.success}>
                {t('discover.verifiedCreator')}
              </ThemedText>
            ) : (
              <ThemedText variant="caption" color={theme.accent}>
                {t('common.pendingVerification')}
              </ThemedText>
            )}
          </View>
          <Button
            title={following ? t('video.following') : t('video.follow')}
            variant={following ? 'secondary' : 'primary'}
            onPress={() => media.toggleFollow(video.creator.id)}
          />
        </View>
      </Card>

      {/* Kaynaklar */}
      <SectionHeader title={t('video.sourcesUsed')} />
      {sourceGroups.map((group) => (
        <View key={group.title} style={{ marginBottom: Spacing.sm }}>
          <ThemedText variant="label" style={{ marginBottom: Spacing.xs }}>
            {group.title}
          </ThemedText>
          {group.items.map((src, i) => {
            const key = video.sources.indexOf(src);
            const expanded = expandedSource === key;
            return (
              <Card key={i} style={{ marginBottom: Spacing.xs }} onPress={() => setExpandedSource(expanded ? null : key)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  <Ionicons
                    name={src.kind === 'ayah' ? 'book-outline' : src.kind === 'hadith' ? 'library-outline' : 'bookmarks-outline'}
                    size={16}
                    color={theme.accent}
                  />
                  <ThemedText style={{ flex: 1 }}>{src.reference}</ThemedText>
                  {src.verified ? (
                    <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                  ) : (
                    <Ionicons name="time-outline" size={14} color={theme.accent} />
                  )}
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={theme.textSecondary} />
                </View>
                {expanded ? (
                  <ThemedText variant="secondary" style={{ marginTop: Spacing.sm, fontStyle: 'italic' }}>
                    “{src.text}”
                  </ThemedText>
                ) : null}
              </Card>
            );
          })}
        </View>
      ))}

      {/* İlgili dersler */}
      {video.relatedLessonIds.length > 0 ? (
        <>
          <SectionHeader title={t('video.relatedLessons')} />
          {video.relatedLessonIds.map((lessonId) => {
            const lesson = getLesson(lessonId);
            if (!lesson) return null;
            return (
              <Card key={lessonId} style={{ marginBottom: Spacing.xs }} onPress={() => router.push(`/lesson/${lessonId}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <Ionicons name="school-outline" size={20} color={theme.primary} />
                  <ThemedText style={{ flex: 1 }}>{lesson.title}</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </View>
              </Card>
            );
          })}
        </>
      ) : null}

      {/* Benzer videolar */}
      {video.relatedVideoIds.length > 0 ? (
        <>
          <SectionHeader title={t('video.similarVideos')} />
          {video.relatedVideoIds.map((vid) => {
            const v = getVideo(vid);
            if (!v) return null;
            return (
              <Card key={vid} style={{ marginBottom: Spacing.xs }} onPress={() => router.push(`/video/${vid}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <View
                    style={{
                      width: 52,
                      height: 36,
                      borderRadius: Radius.sm,
                      backgroundColor: `hsl(${v.thumbnailHue}, 45%, 30%)`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="play" size={14} color="#FFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText numberOfLines={1}>{v.title}</ThemedText>
                    <ThemedText variant="caption">{v.creator.name}</ThemedText>
                  </View>
                </View>
              </Card>
            );
          })}
        </>
      ) : null}

      {/* Eylemler */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
        <Button
          title={isSaved ? t('common.saved') : t('common.save')}
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() =>
            saved.toggle({
              type: 'video',
              refId: video.id,
              title: video.title,
              preview: video.description,
              offline: false,
            })
          }
        />
        <Button
          title={t('common.share')}
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => void shareText(`${video.title} — NUR (demo)`)}
        />
      </View>
      {reported ? (
        <ThemedText variant="caption" color={theme.success} style={{ marginTop: Spacing.sm }}>
          ✓ {t('video.reported')}
        </ThemedText>
      ) : (
        <Button
          title={t('video.reportMisinfo')}
          variant="ghost"
          onPress={report}
          style={{ marginTop: Spacing.sm }}
        />
      )}
    </Screen>
  );
}
