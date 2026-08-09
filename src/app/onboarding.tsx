import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { type IconName } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { TURKISH_CITIES, type City } from '@/data/cities';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { applyLanguage } from '@/i18n';
import { requestNotificationPermission } from '@/lib/notifications';
import {
  useSettingsStore,
  type CalcMethodId,
  type Language,
  type MadhabId,
} from '@/store/settings';

type Step =
  | 'welcome'
  | 'intro'
  | 'language'
  | 'location'
  | 'method'
  | 'notifications'
  | 'privacy'
  | 'account';

const STEPS: Step[] = [
  'welcome',
  'intro',
  'language',
  'location',
  'method',
  'notifications',
  'privacy',
  'account',
];

const METHODS: CalcMethodId[] = ['diyanet', 'mwl', 'ummalqura', 'isna', 'egyptian', 'karachi'];

const LANGUAGE_NATIVE: Record<Language, { name: string; sub: string }> = {
  tr: { name: 'Türkçe', sub: 'Varsayılan dil' },
  en: { name: 'English', sub: 'Full support' },
  ar: { name: 'العربية', sub: 'دعم كامل مع RTL' },
};

/** Arka plandaki dekoratif saydam daireler (hero estetiği). */
function DecorCircles({ color }: { color: string }) {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: color,
          opacity: 0.07,
          top: -80,
          right: -70,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: color,
          opacity: 0.05,
          bottom: 60,
          left: -60,
        }}
      />
    </>
  );
}

/** İkon baloncuklu, seçilebilir büyük kart. */
function OptionCard({
  icon,
  title,
  subtitle,
  selected,
  badge,
  onPress,
  rtl,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  selected?: boolean;
  badge?: string;
  onPress: () => void;
  rtl?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: selected ? theme.primarySoft : theme.surface,
        borderRadius: Radius.xl,
        borderWidth: 1.5,
        borderColor: selected ? theme.primary : theme.border,
        padding: Spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: selected ? theme.primary : theme.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={22} color={selected ? theme.onPrimary : theme.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <ThemedText variant="heading" style={rtl ? { writingDirection: 'rtl' } : null}>
            {title}
          </ThemedText>
          {badge ? (
            <View
              style={{
                backgroundColor: theme.accent,
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 1,
              }}
            >
              <ThemedText variant="caption" color="#FFF">
                {badge}
              </ThemedText>
            </View>
          ) : null}
        </View>
        {subtitle ? <ThemedText variant="caption">{subtitle}</ThemedText> : null}
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? <Ionicons name="checkmark" size={14} color={theme.onPrimary} /> : null}
      </View>
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const mode = useThemeMode();
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const [step, setStep] = useState<Step>('welcome');
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cityQuery, setCityQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const heroBg = mode === 'dark' ? '#1B2440' : '#0F172A';

  const next = () => {
    const n = STEPS[stepIndex + 1];
    if (n) setStep(n);
  };
  const back = () => {
    const p = STEPS[stepIndex - 1];
    if (p) setStep(p);
  };

  const finish = () => {
    settings.set('onboardingCompleted', true);
    router.replace('/(tabs)');
  };

  const locateMe = async () => {
    setLocating(true);
    setLocationError(false);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        setLocationError(true);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }).catch(() => []);
      const place = geocoded[0];
      settings.set('location', {
        mode: 'auto',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        cityName: place?.region ?? place?.city ?? t('prayerTimes.autoLocation'),
        districtName: place?.subregion ?? undefined,
      });
      next();
    } catch {
      setLocationError(true);
    } finally {
      setLocating(false);
    }
  };

  const pickCity = (city: City, districtName?: string) => {
    settings.set('location', {
      mode: 'manual',
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: city.name,
      districtName,
    });
    setCityPickerOpen(false);
    setSelectedCity(null);
    setCityQuery('');
    next();
  };

  const filteredCities = useMemo(() => {
    const q = cityQuery.trim().toLocaleLowerCase('tr');
    if (!q) return TURKISH_CITIES;
    return TURKISH_CITIES.filter((c) => c.name.toLocaleLowerCase('tr').includes(q));
  }, [cityQuery]);

  // ——— Karşılama: tam ekran mint hero ———
  if (step === 'welcome') {
    return (
      <View style={{ flex: 1, backgroundColor: heroBg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: 'rgba(255,255,255,0.08)',
            top: -90,
            right: -80,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: 'rgba(0,0,0,0.07)',
            bottom: 120,
            left: -70,
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: Spacing.xl,
            gap: Spacing.md,
          }}
        >
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.35)',
            }}
          >
            <Ionicons name="moon" size={54} color="#FFFFFF" />
          </View>
          <ThemedText
            color="#FFFFFF"
            style={{ fontSize: 40, fontWeight: '800', letterSpacing: 4, marginTop: Spacing.md }}
          >
            {t('common.appName')}
          </ThemedText>
          <ThemedText color="rgba(255,255,255,0.9)" style={{ textAlign: 'center', fontSize: FontSize.lg }}>
            {t('onboarding.welcomeTitle')}
          </ThemedText>
          <ThemedText color="rgba(255,255,255,0.75)" style={{ textAlign: 'center' }}>
            {t('onboarding.welcomeSubtitle')}
          </ThemedText>
        </View>
        <View style={{ padding: Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }}>
          <Pressable
            onPress={next}
            accessibilityRole="button"
            style={({ pressed }) => ({
              backgroundColor: '#FFFFFF',
              borderRadius: Radius.full,
              paddingVertical: Spacing.md,
              alignItems: 'center',
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <ThemedText variant="label" color={heroBg} style={{ fontSize: FontSize.md }}>
              {t('common.continue')}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const intros: { icon: IconName; title: string; body: string }[] = [
    { icon: 'shield-checkmark', title: t('onboarding.intro1Title'), body: t('onboarding.intro1Body') },
    { icon: 'person', title: t('onboarding.intro2Title'), body: t('onboarding.intro2Body') },
    { icon: 'leaf', title: t('onboarding.intro3Title'), body: t('onboarding.intro3Body') },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: insets.top + Spacing.md,
        paddingBottom: insets.bottom + Spacing.md,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <DecorCircles color={theme.primary} />

      {/* Üst bar: geri + ilerleme çubuğu */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          paddingHorizontal: Spacing.md,
        }}
      >
        <Pressable
          onPress={back}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={18} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.surfaceAlt }}>
          <View
            style={{
              width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
              height: '100%',
              borderRadius: 3,
              backgroundColor: theme.primary,
            }}
          />
        </View>
        <ThemedText variant="caption">
          {t('onboarding.stepOf', { current: stepIndex + 1, total: STEPS.length })}
        </ThemedText>
      </View>

      <View style={{ flex: 1, paddingHorizontal: Spacing.md }}>
        {step === 'intro' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.md }}>
            {intros.map((item) => (
              <View
                key={item.title}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.md,
                  backgroundColor: theme.surface,
                  borderRadius: Radius.xl,
                  borderWidth: 1,
                  borderColor: theme.border,
                  padding: Spacing.md,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: theme.primarySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={item.icon} size={24} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="heading">{item.title}</ThemedText>
                  <ThemedText variant="secondary">{item.body}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}

        {step === 'language' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.sm }}>
            <ThemedText variant="title">{t('onboarding.languageTitle')}</ThemedText>
            <ThemedText variant="secondary" style={{ marginBottom: Spacing.md }}>
              {t('onboarding.languageSubtitle')}
            </ThemedText>
            {(['tr', 'en', 'ar'] as Language[]).map((lang) => (
              <OptionCard
                key={lang}
                icon="language"
                title={LANGUAGE_NATIVE[lang].name}
                subtitle={LANGUAGE_NATIVE[lang].sub}
                selected={settings.language === lang}
                rtl={lang === 'ar'}
                onPress={() => {
                  settings.set('language', lang);
                  applyLanguage(lang);
                }}
              />
            ))}
            {settings.language === 'ar' ? (
              <ThemedText variant="caption">{t('settings.rtlNote')}</ThemedText>
            ) : null}
          </View>
        )}

        {step === 'location' && !cityPickerOpen && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.md }}>
            <View
              style={{
                alignSelf: 'center',
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: theme.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: Spacing.sm,
              }}
            >
              <Ionicons name="location" size={38} color={theme.primary} />
            </View>
            <ThemedText variant="title" style={{ textAlign: 'center' }}>
              {t('onboarding.locationTitle')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {t('onboarding.locationSubtitle')}
            </ThemedText>
            {locationError ? (
              <View
                style={{
                  backgroundColor: theme.accentSoft,
                  borderRadius: Radius.md,
                  padding: Spacing.md,
                }}
              >
                <ThemedText variant="secondary">{t('onboarding.locationDeniedInfo')}</ThemedText>
              </View>
            ) : null}
            <OptionCard
              icon="navigate"
              title={t('onboarding.useMyLocation')}
              subtitle={t('prayerTimes.autoLocation')}
              onPress={() => void locateMe()}
            />
            <OptionCard
              icon="map"
              title={t('onboarding.selectManually')}
              onPress={() => setCityPickerOpen(true)}
            />
            {locating ? <ThemedText variant="caption" style={{ textAlign: 'center' }}>{t('common.loading')}</ThemedText> : null}
          </View>
        )}

        {step === 'location' && cityPickerOpen && (
          <View style={{ flex: 1, paddingTop: Spacing.md }}>
            <ThemedText variant="heading" style={{ marginBottom: Spacing.sm }}>
              {selectedCity ? t('onboarding.selectDistrict') : t('onboarding.selectCity')}
            </ThemedText>
            {!selectedCity ? (
              <>
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
                    marginBottom: Spacing.sm,
                  }}
                >
                  <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
                  <TextInput
                    value={cityQuery}
                    onChangeText={setCityQuery}
                    placeholder={t('common.search')}
                    placeholderTextColor={theme.textSecondary}
                    style={{ flex: 1, paddingVertical: Spacing.sm + 2, color: theme.text }}
                  />
                </View>
                <FlatList
                  data={filteredCities}
                  keyExtractor={(c) => String(c.plate)}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => (item.districts.length > 0 ? setSelectedCity(item) : pickCity(item))}
                      accessibilityRole="button"
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: Spacing.sm + 4,
                        paddingHorizontal: Spacing.sm,
                        borderRadius: Radius.md,
                        backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
                      })}
                    >
                      <ThemedText variant="caption" style={{ width: 30 }}>
                        {item.plate}
                      </ThemedText>
                      <ThemedText style={{ flex: 1 }}>{item.name}</ThemedText>
                      <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
                    </Pressable>
                  )}
                />
              </>
            ) : (
              <FlatList
                data={[{ name: `${selectedCity.name} (${t('common.all')})` }, ...selectedCity.districts]}
                keyExtractor={(d) => d.name}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => pickCity(selectedCity, index === 0 ? undefined : item.name)}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      paddingVertical: Spacing.sm + 4,
                      paddingHorizontal: Spacing.sm,
                      borderRadius: Radius.md,
                      backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
                    })}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </Pressable>
                )}
              />
            )}
            <Button
              title={t('common.back')}
              variant="ghost"
              onPress={() => (selectedCity ? setSelectedCity(null) : setCityPickerOpen(false))}
            />
          </View>
        )}

        {step === 'method' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.sm }}>
            <ThemedText variant="title">{t('onboarding.methodTitle')}</ThemedText>
            <ThemedText variant="secondary" style={{ marginBottom: Spacing.sm }}>
              {t('onboarding.methodSubtitle')}
            </ThemedText>
            {METHODS.slice(0, 4).map((m) => (
              <OptionCard
                key={m}
                icon="time"
                title={t(`prayerTimes.methodNames.${m}`)}
                selected={settings.calcMethod === m}
                badge={m === 'diyanet' ? t('onboarding.recommended') : undefined}
                onPress={() => settings.set('calcMethod', m)}
              />
            ))}
            <ThemedText variant="heading" style={{ marginTop: Spacing.md }}>
              {t('onboarding.madhhabTitle')}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              {(['hanafi', 'shafi'] as MadhabId[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => settings.set('madhab', m)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: settings.madhab === m }}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: Spacing.md,
                    borderRadius: Radius.lg,
                    borderWidth: 1.5,
                    borderColor: settings.madhab === m ? theme.primary : theme.border,
                    backgroundColor: settings.madhab === m ? theme.primarySoft : theme.surface,
                  }}
                >
                  <ThemedText variant="label" color={settings.madhab === m ? theme.primary : theme.text}>
                    {m === 'hanafi' ? t('onboarding.madhhabHanafi') : t('onboarding.madhhabStandard')}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 'notifications' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.md }}>
            <View
              style={{
                alignSelf: 'center',
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: theme.accentSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="notifications" size={38} color={theme.accent} />
            </View>
            <ThemedText variant="title" style={{ textAlign: 'center' }}>
              {t('onboarding.notificationsTitle')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {t('onboarding.notificationsSubtitle')}
            </ThemedText>
            <Button
              title={t('onboarding.enableNotifications')}
              onPress={() => {
                void requestNotificationPermission().then((granted) => {
                  settings.setNotification('prayersEnabled', granted);
                  next();
                });
              }}
            />
            <Button
              title={t('onboarding.notNow')}
              variant="ghost"
              onPress={() => {
                settings.setNotification('prayersEnabled', false);
                next();
              }}
            />
          </View>
        )}

        {step === 'privacy' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.md }}>
            <ThemedText variant="title">{t('onboarding.privacyTitle')}</ThemedText>
            <View
              style={{
                flexDirection: 'row',
                gap: Spacing.md,
                backgroundColor: theme.surface,
                borderRadius: Radius.xl,
                borderWidth: 1,
                borderColor: theme.border,
                padding: Spacing.md,
              }}
            >
              <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
              <ThemedText variant="secondary" style={{ flex: 1 }}>
                {t('onboarding.privacyBody')}
              </ThemedText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: Spacing.md,
                backgroundColor: theme.accentSoft,
                borderRadius: Radius.xl,
                borderWidth: 1,
                borderColor: 'rgba(199,155,60,0.3)',
                padding: Spacing.md,
              }}
            >
              <Ionicons name="sparkles" size={24} color={theme.accent} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" style={{ marginBottom: Spacing.xs }}>
                  {t('onboarding.aiDisclaimerTitle')}
                </ThemedText>
                <ThemedText variant="secondary">{t('onboarding.aiDisclaimerBody')}</ThemedText>
              </View>
            </View>
          </View>
        )}

        {step === 'account' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.md }}>
            <View
              style={{
                alignSelf: 'center',
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: theme.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={38} color={theme.primary} />
            </View>
            <ThemedText variant="title" style={{ textAlign: 'center' }}>
              {t('onboarding.nameTitle')}
            </ThemedText>
            <TextInput
              value={settings.userName}
              onChangeText={(v) => settings.set('userName', v)}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={{
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: Radius.lg,
                padding: Spacing.md,
                color: theme.text,
                textAlign: 'center',
                fontSize: FontSize.md,
              }}
            />
            <ThemedText variant="caption" style={{ textAlign: 'center' }}>
              {t('profile.nameHint')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {t('onboarding.accountInfo')}
            </ThemedText>
            <ThemedText variant="caption" style={{ textAlign: 'center' }}>
              {t('onboarding.accountComingNote')}
            </ThemedText>
            <Button
              title={t('common.continue')}
              onPress={finish}
              disabled={!settings.userName.trim()}
            />
            <Button
              title={t('onboarding.continueAsGuest')}
              variant="ghost"
              onPress={() => {
                // Misafir: isim kaydedilmeden devam edilir
                settings.set('userName', '');
                finish();
              }}
            />
          </View>
        )}
      </View>

      {/* Alt gezinme */}
      {step !== 'account' && step !== 'notifications' && !(step === 'location' && cityPickerOpen) ? (
        <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
          <Button title={t('common.continue')} onPress={next} />
          {step === 'location' ? (
            <Button title={t('common.skip')} variant="ghost" onPress={next} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
