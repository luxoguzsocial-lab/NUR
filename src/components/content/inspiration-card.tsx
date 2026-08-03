import { Ionicons } from '@expo/vector-icons';
import { Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { IconButton } from '@/components/content/icon-button';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge, type IconName } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSavedStore } from '@/store/saved';

interface Props {
  icon: IconName;
  /** Kart başlığı, ör. "Günün ayeti" */
  title: string;
  /** Arapça metin (varsa) */
  arabic?: string;
  /** Okunuş / yazar gibi ikincil satır (varsa) */
  subtitle?: string;
  /** Ana metin */
  text: string;
  source: string;
  /** SourceBadge doğrulama durumu; undefined ise rozet gösterilmez */
  verified?: boolean;
  /** saved store için benzersiz refId, ör. "ayah-215" */
  refId: string;
}

/** Günlük ilham kartı — kaynak rozeti, kaydetme (type: 'inspiration') ve paylaşma ile. */
export function InspirationCard({
  icon,
  title,
  arabic,
  subtitle,
  text,
  source,
  verified,
  refId,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const toggle = useSavedStore((s) => s.toggle);
  const saved = useSavedStore((s) => s.items.some((i) => i.id === `inspiration:${refId}`));

  const onToggleSave = () => {
    toggle({
      type: 'inspiration',
      refId,
      title,
      preview: text.slice(0, 80),
      offline: true,
    });
  };

  const onShare = () => {
    const message = [title, arabic, subtitle, text, `${t('common.source')}: ${source}`]
      .filter((part): part is string => !!part)
      .join('\n\n');
    Share.share({ message }).catch(() => undefined);
  };

  return (
    <Card style={{ gap: Spacing.sm, marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Ionicons name={icon} size={18} color={theme.primary} />
        <ThemedText variant="label" color={theme.primary} style={{ flex: 1 }}>
          {title}
        </ThemedText>
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={onToggleSave}
          label={saved ? t('common.remove') : t('common.save')}
          active={saved}
        />
        <IconButton icon="share-social-outline" onPress={onShare} label={t('common.share')} />
      </View>
      {arabic ? <ThemedText variant="arabic">{arabic}</ThemedText> : null}
      {subtitle ? (
        <ThemedText variant="secondary" style={{ fontStyle: 'italic' }}>
          {subtitle}
        </ThemedText>
      ) : null}
      <ThemedText>{text}</ThemedText>
      <SourceBadge source={source} verified={verified} />
    </Card>
  );
}
