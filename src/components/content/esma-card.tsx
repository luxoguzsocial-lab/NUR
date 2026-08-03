import { Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { IconButton } from '@/components/content/icon-button';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { ESMA_SOURCE, type EsmaName } from '@/data/esma';
import { useTheme } from '@/hooks/use-theme';
import { useSavedStore } from '@/store/saved';

interface Props {
  esma: EsmaName;
}

/** Tek Esmaül Hüsna kartı: sıra, Arapça, okunuş, anlam, açıklama, kaynak, favori. */
export function EsmaCard({ esma }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const refId = String(esma.order);
  const toggle = useSavedStore((s) => s.toggle);
  const saved = useSavedStore((s) => s.items.some((i) => i.id === `esma:${refId}`));

  const onToggleFavorite = () => {
    toggle({
      type: 'esma',
      refId,
      title: `${esma.transliteration} — ${esma.meaningTr}`,
      preview: esma.description.slice(0, 80),
      offline: true,
    });
  };

  const onShare = () => {
    const message = [
      `${esma.order}. ${esma.transliteration}`,
      esma.arabic,
      esma.meaningTr,
      esma.description,
      `${t('common.source')}: ${ESMA_SOURCE}`,
    ].join('\n');
    Share.share({ message }).catch(() => undefined);
  };

  return (
    <Card style={{ gap: Spacing.sm, marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: Radius.full,
            backgroundColor: theme.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText variant="caption" color={theme.primary} style={{ fontWeight: '700' }}>
            {esma.order}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText variant="heading">{esma.transliteration}</ThemedText>
          <ThemedText variant="secondary">{esma.meaningTr}</ThemedText>
        </View>
        <ThemedText variant="arabic" style={{ fontSize: FontSize.arabicDefault }}>
          {esma.arabic}
        </ThemedText>
      </View>
      <ThemedText>{esma.description}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <View style={{ flex: 1 }}>
          <SourceBadge source={ESMA_SOURCE} verified />
        </View>
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={onToggleFavorite}
          label={saved ? t('common.remove') : t('common.save')}
          active={saved}
        />
        <IconButton icon="share-social-outline" onPress={onShare} label={t('common.share')} />
      </View>
    </Card>
  );
}
