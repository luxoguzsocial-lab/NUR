import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

/** Temaya uyumlu arama kutusu. */
export function SearchInput({ value, onChangeText, placeholder }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
      }}
    >
      <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        autoCorrect={false}
        accessibilityLabel={t('common.search')}
        style={{
          flex: 1,
          paddingVertical: Spacing.sm + 2,
          fontSize: FontSize.md,
          color: theme.text,
        }}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
