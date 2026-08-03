import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyState, SectionHeader, type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { searchDuas } from '@/data/duas';
import { LESSONS } from '@/data/programs';
import { SURAHS } from '@/data/quran';
import { VIDEO_CATEGORIES, VIDEOS, type AgeGroup, type VideoItem } from '@/data/videos';
import { useTheme } from '@/hooks/use-theme';
import { useMediaStore } from '@/store/media';

type ResultType = 'video' | 'quran' | 'dua' | 'lesson';

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  route: string;
  verified: boolean;
  icon: IconName;
}

type DurationFilter = 'any' | 'short' | 'medium' | 'long';

const norm = (s: string) => s.toLocaleLowerCase('tr');

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResultType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<AgeGroup | null>(null);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('any');
  const followedCreators = useMediaStore((s) => s.followedCreators);
  const followedVideos = useMemo(
    () => VIDEOS.filter((v) => followedCreators.includes(v.creator.id)),
    [followedCreators],
  );

  const results = useMemo<SearchResult[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    const out: SearchResult[] = [];

    if (!typeFilter || typeFilter === 'video') {
      for (const v of VIDEOS) {
        if (categoryFilter && v.category !== categoryFilter) continue;
        if (ageFilter && v.ageGroup !== ageFilter) continue;
        if (durationFilter === 'short' && v.durationSec >= 60) continue;
        if (durationFilter === 'medium' && (v.durationSec < 60 || v.durationSec > 180)) continue;
        if (durationFilter === 'long' && v.durationSec <= 180) continue;
        const haystack = norm(`${v.title} ${v.description} ${v.creator.name} ${v.category}`);
        if (haystack.includes(q)) {
          out.push({
            type: 'video',
            id: v.id,
            title: v.title,
            subtitle: `${v.creator.name} · ${Math.round(v.durationSec / 60)} ${t('common.minuteShort')}`,
            route: `/video/${v.id}`,
            verified: v.creator.verified,
            icon: 'play-circle-outline',
          });
        }
      }
    }

    if (!typeFilter || typeFilter === 'quran') {
      for (const s of SURAHS) {
        if (norm(`${s.turkishName} ${s.arabicName}`).includes(q)) {
          out.push({
            type: 'quran',
            id: String(s.number),
            title: `${s.number}. ${s.turkishName}`,
            subtitle: `${s.ayahCount} ayet · ${s.revelationPlace === 'mecca' ? 'Mekkî' : 'Medenî'}`,
            route: `/quran/surah/${s.number}`,
            verified: true,
            icon: 'book-outline',
          });
        }
      }
    }

    if (!typeFilter || typeFilter === 'dua') {
      for (const d of searchDuas(query)) {
        out.push({
          type: 'dua',
          id: d.id,
          title: d.titleTr,
          subtitle: d.source,
          route: `/duas/${d.category}`,
          verified: d.verified,
          icon: 'heart-outline',
        });
      }
    }

    if (!typeFilter || typeFilter === 'lesson') {
      for (const l of LESSONS) {
        const haystack = norm(`${l.title} ${l.keyPoints.join(' ')} ${l.body.join(' ')}`);
        if (haystack.includes(q)) {
          out.push({
            type: 'lesson',
            id: l.id,
            title: l.title,
            subtitle: l.sources.map((s) => s.reference).join(' · '),
            route: `/lesson/${l.id}`,
            verified: true,
            icon: 'school-outline',
          });
        }
      }
    }
    return out.slice(0, 40);
  }, [query, typeFilter, categoryFilter, ageFilter, durationFilter, t]);

  const typeChips: { id: ResultType | null; label: string }[] = [
    { id: null, label: t('discover.typeAll') },
    { id: 'video', label: t('discover.typeVideo') },
    { id: 'quran', label: t('discover.typeQuran') },
    { id: 'dua', label: t('discover.typeDua') },
    { id: 'lesson', label: t('discover.typeLesson') },
  ];

  return (
    <Screen>
      {/* Arama */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          backgroundColor: theme.surface,
          borderRadius: Radius.lg,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: Spacing.md,
          marginTop: Spacing.md,
        }}
      >
        <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('discover.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={{ flex: 1, paddingVertical: Spacing.sm + 2, color: theme.text }}
        />
        {query ? (
          <Ionicons name="close-circle" size={18} color={theme.textSecondary} onPress={() => setQuery('')} />
        ) : null}
      </View>

      {/* Tür filtreleri */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm }}>
        {typeChips.map((c) => (
          <Chip
            key={String(c.id)}
            label={c.label}
            selected={typeFilter === c.id}
            onPress={() => setTypeFilter(c.id)}
          />
        ))}
      </View>

      {/* Video alt filtreleri */}
      {(!typeFilter || typeFilter === 'video') && query ? (
        <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
            {VIDEO_CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                label={c.labelTr}
                selected={categoryFilter === c.id}
                onPress={() => setCategoryFilter(categoryFilter === c.id ? null : c.id)}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, alignItems: 'center' }}>
            <ThemedText variant="caption">{t('discover.ageGroup')}:</ThemedText>
            {(
              [
                [null, t('discover.ageAll')],
                ['genel', t('discover.ageGeneral')],
                ['genc', t('discover.ageYouth')],
                ['cocuk', t('discover.ageKids')],
              ] as [AgeGroup | null, string][]
            ).map(([id, label]) => (
              <Chip key={String(id)} label={label} selected={ageFilter === id} onPress={() => setAgeFilter(id)} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, alignItems: 'center' }}>
            <ThemedText variant="caption">{t('discover.duration')}:</ThemedText>
            {(
              [
                ['any', t('discover.durationAny')],
                ['short', t('discover.durationShort')],
                ['medium', t('discover.durationMedium')],
                ['long', t('discover.durationLong')],
              ] as [DurationFilter, string][]
            ).map(([id, label]) => (
              <Chip key={id} label={label} selected={durationFilter === id} onPress={() => setDurationFilter(id)} />
            ))}
          </View>
        </View>
      ) : null}

      {query ? (
        /* Arama sonuçları */
        <View style={{ marginTop: Spacing.md }}>
          <ThemedText variant="secondary" style={{ marginBottom: Spacing.sm }}>
            {t('discover.resultsFor', { query })}
          </ThemedText>
          {results.length === 0 ? (
            <EmptyState icon="search-outline" message={t('discover.noResults')} />
          ) : (
            results.map((r) => (
              <Card
                key={`${r.type}-${r.id}`}
                style={{ marginBottom: Spacing.xs }}
                onPress={() => router.push(r.route as never)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <Ionicons name={r.icon} size={22} color={theme.primary} />
                  <View style={{ flex: 1 }}>
                    <ThemedText numberOfLines={1}>{r.title}</ThemedText>
                    <ThemedText variant="caption" numberOfLines={1}>
                      {r.subtitle}
                    </ThemedText>
                  </View>
                  {r.verified ? (
                    <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                  ) : (
                    <Ionicons name="time-outline" size={16} color={theme.accent} />
                  )}
                </View>
              </Card>
            ))
          )}
          <ThemedText variant="caption" style={{ marginTop: Spacing.sm }}>
            {t('discover.semanticNote')}
          </ThemedText>
        </View>
      ) : (
        /* Boş durum: raflar */
        <>
          <Card tone="primary" style={{ marginTop: Spacing.lg }} onPress={() => router.push('/(tabs)/ilham')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="play-circle" size={36} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t('discover.videoFeed')}</ThemedText>
                <ThemedText variant="caption">{t('discover.videoFeedSubtitle')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </Card>
          <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/programs')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="school-outline" size={30} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t('discover.learningPrograms')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </Card>

          {/* Takip edilen üreticiler */}
          {followedVideos.length > 0 ? (
            <>
              <SectionHeader title={t('discover.followingRail')} />
              <VideoRail videos={followedVideos} />
            </>
          ) : null}

          {/* Kategori rafları */}
          {VIDEO_CATEGORIES.map((category) => {
            const inCategory = VIDEOS.filter((v) => v.category === category.id);
            if (inCategory.length === 0) return null;
            return (
              <View key={category.id}>
                <SectionHeader title={category.labelTr} />
                <VideoRail videos={inCategory} />
              </View>
            );
          })}
        </>
      )}
    </Screen>
  );
}

/** Yatay video rafı — gerçek videosu olan kartlar rozetle işaretlenir. */
function VideoRail({ videos }: { videos: VideoItem[] }) {
  const { t } = useTranslation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
      {videos.map((v) => (
        <Pressable
          key={v.id}
          onPress={() => router.push(`/video/${v.id}`)}
          accessibilityRole="button"
          style={({ pressed }) => ({ width: 140, opacity: pressed ? 0.85 : 1 })}
        >
          <View
            style={{
              height: 190,
              borderRadius: Radius.lg,
              backgroundColor: `hsl(${v.thumbnailHue}, 45%, 26%)`,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                backgroundColor: `hsl(${(v.thumbnailHue + 30) % 360}, 50%, 34%)`,
                opacity: 0.5,
              }}
            />
            <Ionicons name="play-circle" size={38} color="rgba(255,255,255,0.9)" />
            <View
              style={{
                position: 'absolute',
                bottom: Spacing.xs,
                left: Spacing.xs,
                right: Spacing.xs,
                flexDirection: 'row',
                gap: 4,
                flexWrap: 'wrap',
              }}
            >
              {v.media ? (
                <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 1 }}>
                  <ThemedText variant="caption" color="#FFD86B" style={{ fontSize: 10 }}>
                    ▶ {t('discover.hasVideo')}
                  </ThemedText>
                </View>
              ) : null}
              <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 1 }}>
                <ThemedText variant="caption" color="#FFF" style={{ fontSize: 10 }}>
                  {Math.round(v.durationSec / 60)} {t('common.minuteShort')}
                </ThemedText>
              </View>
            </View>
          </View>
          <ThemedText variant="secondary" numberOfLines={2} style={{ marginTop: Spacing.xs }}>
            {v.title}
          </ThemedText>
          <ThemedText variant="caption" numberOfLines={1}>
            {v.creator.name}
            {v.creator.verified ? ' ✓' : ''}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}
