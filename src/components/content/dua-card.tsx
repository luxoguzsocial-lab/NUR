import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { IconButton } from '@/components/content/icon-button';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import type { Dua } from '@/data/duas';
import { shareText } from '@/lib/share';
import { useSavedStore } from '@/store/saved';

interface Props {
  dua: Dua;
}

/** Tam dua kartı: başlık, Arapça, okunuş, anlam, kaynak, favori ve paylaş. */
export function DuaCard({ dua }: Props) {
  const { t } = useTranslation();
  const toggle = useSavedStore((s) => s.toggle);
  const saved = useSavedStore((s) => s.items.some((i) => i.id === `dua:${dua.id}`));

  const onToggleFavorite = () => {
    toggle({
      type: 'dua',
      refId: dua.id,
      title: dua.titleTr,
      preview: dua.meaningTr.slice(0, 80),
      offline: true,
    });
  };

  const onShare = () => {
    const message = [
      dua.titleTr,
      '',
      dua.arabic,
      '',
      `${t('duas.transliterationLabel')}: ${dua.transliteration}`,
      '',
      `${t('duas.meaningLabel')}: ${dua.meaningTr}`,
      '',
      `${t('common.source')}: ${dua.source}`,
    ].join('\n');
    void shareText(message);
  };

  return (
    <Card style={{ gap: Spacing.sm, marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <ThemedText variant="heading" style={{ flex: 1 }}>
          {dua.titleTr}
        </ThemedText>
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={onToggleFavorite}
          label={saved ? t('common.remove') : t('common.save')}
          active={saved}
        />
        <IconButton icon="share-social-outline" onPress={onShare} label={t('common.share')} />
      </View>
      <ThemedText variant="arabic">{dua.arabic}</ThemedText>
      <ThemedText variant="secondary" style={{ fontStyle: 'italic' }}>
        {dua.transliteration}
      </ThemedText>
      <ThemedText>{dua.meaningTr}</ThemedText>
      <SourceBadge source={dua.source} verified={dua.verified} />
    </Card>
  );
}
