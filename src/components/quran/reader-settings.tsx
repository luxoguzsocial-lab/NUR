import { Modal, Pressable, ScrollView, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui-bits';
import { Stepper } from '@/components/quran/stepper';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { RECITERS, normalizeReciterId } from '@/lib/recitation';
import { useSettingsStore } from '@/store/settings';

interface Props {
  visible: boolean;
  onClose: () => void;
}

/** Okuma ekranı hızlı ayarları: yazı boyutu, satır aralığı, görünüm ve kâri seçimi. */
export function ReaderSettingsModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const quran = useSettingsStore((s) => s.quran);
  const setQuranPref = useSettingsStore((s) => s.setQuranPref);

  const switchColors = { true: theme.primary, false: theme.border };

  const row = (label: string, value: boolean, onChange: (v: boolean) => void) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
      <Switch value={value} onValueChange={onChange} trackColor={switchColors} thumbColor={theme.surface} />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: theme.overlay }}
        onPress={onClose}
        accessibilityLabel={t('common.close')}
      />
      <View
        style={{
          backgroundColor: theme.surface,
          borderTopLeftRadius: Radius.xl,
          borderTopRightRadius: Radius.xl,
          maxHeight: '75%',
        }}
      >
        <ScrollView contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText variant="heading">{t('quran.reader.displaySettings')}</ThemedText>
            <Pressable onPress={onClose} accessibilityRole="button">
              <ThemedText variant="secondary" color={theme.primary}>
                {t('common.done')}
              </ThemedText>
            </Pressable>
          </View>

          <Stepper
            label={t('quran.reader.fontSize')}
            valueLabel={String(quran.fontSize)}
            onDecrement={() => setQuranPref('fontSize', Math.max(FontSize.arabicMin, quran.fontSize - 2))}
            onIncrement={() => setQuranPref('fontSize', Math.min(FontSize.arabicMax, quran.fontSize + 2))}
            decrementDisabled={quran.fontSize <= FontSize.arabicMin}
            incrementDisabled={quran.fontSize >= FontSize.arabicMax}
          />
          <Stepper
            label={t('quran.reader.lineHeight')}
            valueLabel={quran.lineHeightMultiplier.toFixed(1)}
            onDecrement={() =>
              setQuranPref(
                'lineHeightMultiplier',
                Math.max(1.4, Math.round((quran.lineHeightMultiplier - 0.2) * 10) / 10),
              )
            }
            onIncrement={() =>
              setQuranPref(
                'lineHeightMultiplier',
                Math.min(2.6, Math.round((quran.lineHeightMultiplier + 0.2) * 10) / 10),
              )
            }
            decrementDisabled={quran.lineHeightMultiplier <= 1.4}
            incrementDisabled={quran.lineHeightMultiplier >= 2.6}
          />

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="label">{t('quran.reader.arabicFont')}</ThemedText>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Chip
                label={t('quran.reader.fontSystem')}
                selected={quran.arabicFont === 'system'}
                onPress={() => setQuranPref('arabicFont', 'system')}
              />
              <Chip
                label={t('quran.reader.fontSerif')}
                selected={quran.arabicFont === 'serif'}
                onPress={() => setQuranPref('arabicFont', 'serif')}
              />
            </View>
          </View>

          {row(t('quran.reader.showTranslation'), quran.showTranslation, (v) =>
            setQuranPref('showTranslation', v),
          )}
          {row(t('quran.reader.showTransliteration'), quran.showTransliteration, (v) =>
            setQuranPref('showTransliteration', v),
          )}
          {row(t('quran.reader.showTajweed'), quran.showTajweed, (v) => setQuranPref('showTajweed', v))}
          {row(t('quran.reader.accessibleMarks'), quran.tajweedAccessibleMarks, (v) =>
            setQuranPref('tajweedAccessibleMarks', v),
          )}

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="label">{t('quran.reader.reciter')}</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {RECITERS.map((reciter) => (
                <Chip
                  key={reciter.id}
                  label={reciter.name}
                  selected={normalizeReciterId(quran.reciter) === reciter.id}
                  onPress={() => setQuranPref('reciter', reciter.id)}
                />
              ))}
            </View>
            <ThemedText variant="caption">{t('quran.reader.audioNote')}</ThemedText>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
