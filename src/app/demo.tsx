import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { createElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DeviceKind = 'iphone' | 'android';
type DemoScreenId = 'home' | 'privateWorship' | 'travel';

const DEVICES: Record<
  DeviceKind,
  { width: number; height: number; radius: number; labelKey: string }
> = {
  iphone: { width: 413, height: 892, radius: 54, labelKey: 'demo.iphone' },
  android: { width: 432, height: 912, radius: 40, labelKey: 'demo.android' },
};

const SCREENS: { id: DemoScreenId; icon: keyof typeof Ionicons.glyphMap; labelKey: string; path: string }[] = [
  { id: 'home', icon: 'home-outline', labelKey: 'demo.home', path: '/?preview=1' },
  {
    id: 'privateWorship',
    icon: 'shield-checkmark-outline',
    labelKey: 'demo.privateWorship',
    path: '/private-worship?preview=1',
  },
  { id: 'travel', icon: 'airplane-outline', labelKey: 'demo.travel', path: '/travel?preview=1' },
];

function SegmentButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        minHeight: 42,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.full,
        backgroundColor: active ? theme.primary : theme.surfaceAlt,
        opacity: pressed ? 0.84 : 1,
      })}
    >
      <Ionicons name={icon} size={16} color={active ? theme.onPrimary : theme.textSecondary} />
      <ThemedText variant="label" color={active ? theme.onPrimary : theme.textSecondary}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function PhonePreview({ device, source }: { device: DeviceKind; source: string }) {
  const theme = useTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const spec = DEVICES[device];
  const maxPhoneWidth = viewportWidth < 620 ? Math.max(280, viewportWidth - 32) : spec.width;
  const width = Math.min(spec.width, maxPhoneWidth);
  const scale = width / spec.width;
  const height = spec.height * scale;
  const bezel = (device === 'iphone' ? 10 : 8) * scale;
  const statusHeight = 31 * scale;
  const navigationHeight = (device === 'iphone' ? 24 : 28) * scale;
  const frameStyle: ViewStyle = {
    width,
    height,
    padding: bezel,
    borderRadius: spec.radius * scale,
    backgroundColor: device === 'iphone' ? '#07080A' : '#17191D',
    shadowColor: '#020617',
    shadowOpacity: 0.32,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 20,
  };

  const iframe = useMemo(
    () =>
      createElement('iframe', {
        key: source,
        src: source,
        title: 'NUR live device preview',
        style: {
          width: '100%',
          height: '100%',
          display: 'block',
          border: 0,
          backgroundColor: theme.background,
        },
      }),
    [source, theme.background],
  );

  return (
    <View style={{ position: 'relative' }}>
      {device === 'iphone' ? (
        <>
          <View
            style={{
              position: 'absolute',
              left: -3 * scale,
              top: 122 * scale,
              width: 3 * scale,
              height: 64 * scale,
              borderTopLeftRadius: 2,
              borderBottomLeftRadius: 2,
              backgroundColor: '#3A3C40',
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -3 * scale,
              top: 180 * scale,
              width: 3 * scale,
              height: 92 * scale,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: '#3A3C40',
            }}
          />
        </>
      ) : null}

      <View style={frameStyle}>
        <View
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: (spec.radius - (device === 'iphone' ? 11 : 9)) * scale,
            backgroundColor: theme.background,
          }}
        >
          <View
            style={{
              height: statusHeight,
              paddingHorizontal: 16 * scale,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.surface,
            }}
          >
            <ThemedText style={{ fontSize: 10 * scale, fontWeight: '700' }}>09:41</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 * scale }}>
              <Ionicons name="cellular" size={11 * scale} color={theme.text} />
              <Ionicons name="wifi" size={11 * scale} color={theme.text} />
              <Ionicons name="battery-full" size={13 * scale} color={theme.text} />
            </View>
          </View>

          <View style={{ flex: 1 }}>{iframe}</View>

          <View
            style={{
              height: navigationHeight,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surface,
            }}
          >
            {device === 'iphone' ? (
              <View
                style={{
                  width: 118 * scale,
                  height: 4 * scale,
                  borderRadius: Radius.full,
                  backgroundColor: theme.text,
                  opacity: 0.85,
                }}
              />
            ) : (
              <View style={{ flexDirection: 'row', gap: 48 * scale, alignItems: 'center' }}>
                <Ionicons name="reorder-two-outline" size={14 * scale} color={theme.textSecondary} />
                <Ionicons name="ellipse-outline" size={12 * scale} color={theme.textSecondary} />
                <Ionicons name="chevron-back" size={14 * scale} color={theme.textSecondary} />
              </View>
            )}
          </View>
        </View>

        {device === 'iphone' ? (
          <View
            style={{
              position: 'absolute',
              top: 16 * scale,
              left: '50%',
              marginLeft: -58 * scale,
              width: 116 * scale,
              height: 31 * scale,
              borderRadius: Radius.full,
              backgroundColor: '#000000',
            }}
          />
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 17 * scale,
              left: '50%',
              marginLeft: -7 * scale,
              width: 14 * scale,
              height: 14 * scale,
              borderRadius: 7 * scale,
              backgroundColor: '#08090B',
              borderWidth: 2 * scale,
              borderColor: '#24272D',
            }}
          />
        )}
      </View>
    </View>
  );
}

export default function DemoScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [device, setDevice] = useState<DeviceKind>('iphone');
  const [screen, setScreen] = useState<DemoScreenId>('home');
  const selectedScreen = SCREENS.find((item) => item.id === screen) ?? SCREENS[0];
  const wide = width >= 900;

  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.lg, backgroundColor: theme.background }}>
        <Stack.Screen options={{ title: t('demo.title') }} />
        <Card style={{ gap: Spacing.md }}>
          <Ionicons name="phone-portrait-outline" size={34} color={theme.primary} />
          <ThemedText variant="title">{t('demo.webOnlyTitle')}</ThemedText>
          <ThemedText variant="secondary">{t('demo.webOnlyBody')}</ThemedText>
          <Button title={t('demo.openApp')} onPress={() => router.replace('/(tabs)')} />
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ minHeight: '100%', padding: width < 620 ? Spacing.md : Spacing.xl }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          width: '100%',
          maxWidth: 1160,
          alignSelf: 'center',
          flexDirection: wide ? 'row' : 'column',
          alignItems: wide ? 'flex-start' : 'center',
          justifyContent: 'center',
          gap: width < 620 ? Spacing.lg : Spacing.xxl,
        }}
      >
        <View style={{ width: wide ? 360 : '100%', maxWidth: 560, gap: Spacing.lg, paddingTop: wide ? 72 : 0 }}>
          <View
            style={{
              alignSelf: wide ? 'flex-start' : 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.xs,
              paddingHorizontal: Spacing.sm + 2,
              paddingVertical: Spacing.xs + 2,
              borderRadius: Radius.full,
              backgroundColor: theme.primarySoft,
            }}
          >
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.success }} />
            <ThemedText variant="caption" color={theme.primary}>{t('demo.liveBadge')}</ThemedText>
          </View>

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="title" style={{ fontSize: width < 620 ? 30 : 38, lineHeight: width < 620 ? 36 : 44 }}>
              {t('demo.title')}
            </ThemedText>
            <ThemedText variant="secondary" style={{ fontSize: FontSize.md, lineHeight: 24 }}>
              {t('demo.subtitle')}
            </ThemedText>
          </View>

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="label">{t('demo.device')}</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              <SegmentButton
                active={device === 'iphone'}
                icon="logo-apple"
                label={t('demo.iphone')}
                onPress={() => setDevice('iphone')}
              />
              <SegmentButton
                active={device === 'android'}
                icon="logo-android"
                label={t('demo.android')}
                onPress={() => setDevice('android')}
              />
            </View>
          </View>

          <View style={{ gap: Spacing.sm }}>
            <ThemedText variant="label">{t('demo.screen')}</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
              {SCREENS.map((item) => (
                <SegmentButton
                  key={item.id}
                  active={screen === item.id}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  onPress={() => setScreen(item.id)}
                />
              ))}
            </View>
          </View>

          <Card tone="accent" style={{ gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="sparkles" size={19} color={theme.accent} />
              <ThemedText variant="heading">{t('demo.reviewTitle')}</ThemedText>
            </View>
            {[t('demo.reviewOne'), t('demo.reviewTwo'), t('demo.reviewThree')].map((item) => (
              <View key={item} style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <Ionicons name="checkmark-circle" size={17} color={theme.success} />
                <ThemedText variant="secondary" style={{ flex: 1 }}>{item}</ThemedText>
              </View>
            ))}
          </Card>
        </View>

        <View style={{ alignItems: 'center', gap: Spacing.md }}>
          <PhonePreview device={device} source={selectedScreen.path} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <Ionicons name="hand-left-outline" size={15} color={theme.textSecondary} />
            <ThemedText variant="caption">{t('demo.interactiveHint')}</ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
