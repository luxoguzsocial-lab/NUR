import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackToHome } from '@/components/back-to-home';
import { Card } from '@/components/card';
import { TasbihBeads } from '@/components/content/tasbih-beads';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, type IconName } from '@/components/ui-bits';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { DUAS, searchDuas } from '@/data/duas';
import { confirmDialog } from '@/lib/dialogs';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, todayISO } from '@/lib/format';
import { useSettingsStore } from '@/store/settings';
import { BEAD_COLORS, useTasbihStore } from '@/store/tasbih';
import { useTrackerStore } from '@/store/tracker';

const TICK_SOUND = require('../../../assets/sounds/tick.wav') as number;

const DAY_INITIALS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

function KeepAwakeWhileFocused() {
  useKeepAwake();
  return null;
}

/** Bölüm bağlantı kartı (Sabah&Akşam, Tesbihat, Salavat, Esmâ, Hadisler). */
function SectionLink({
  icon,
  title,
  subtitle,
  gold,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  gold?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: gold ? theme.accentSoft : theme.surface,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: gold ? 'rgba(199,155,60,0.3)' : theme.border,
        padding: Spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: Radius.md,
          backgroundColor: gold ? theme.accent : theme.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={22} color={gold ? '#FFF' : theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText variant="heading">{title}</ThemedText>
        <ThemedText variant="caption">{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

export default function ZikirScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const language = useSettingsStore((s) => s.language);

  const store = useTasbihStore();
  const addDhikrToTracker = useTrackerStore((s) => s.addDhikr);
  const tickPlayer = useAudioPlayer(TICK_SOUND);

  const [focusMode, setFocusMode] = useState(false);
  const [pocketMode, setPocketMode] = useState(false);
  const [duaQuery, setDuaQuery] = useState('');
  const [duaCategory, setDuaCategory] = useState<string | null>(null);

  const activeIndex = Math.max(0, store.dhikrList.findIndex((d) => d.id === store.activeId));
  const active = store.dhikrList[activeIndex] ?? store.dhikrList[0]!;
  const beadColor = (BEAD_COLORS.find((c) => c.id === store.beadColorId) ?? BEAD_COLORS[0]!).hex;
  const count = store.counts[active.id] ?? 0;
  const rounds = Math.floor(count / active.target);
  const inRound = count % active.target;
  const shownCount = count > 0 && inRound === 0 ? active.target : inRound;
  const progressPct = Math.round((shownCount / active.target) * 100);

  const dateISO = todayISO();
  const todayTotal = Object.values(store.dailyHistory[dateISO] ?? {}).reduce((a, b) => a + b, 0);
  const grandTotal = Object.values(store.counts).reduce((a, b) => a + b, 0);
  const goalPct = Math.min(100, Math.round((todayTotal / store.dailyGoal) * 100));

  const weekBars = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      const iso = todayISO(d);
      return {
        label: DAY_INITIALS[(d.getDay() + 6) % 7]!,
        total: Object.values(store.dailyHistory[iso] ?? {}).reduce((a, b) => a + b, 0),
        isToday: i === 6,
      };
    });
  }, [store.dailyHistory]);
  const weekMax = Math.max(1, ...weekBars.map((b) => b.total));

  const cycleDhikr = (dir: 1 | -1) => {
    const next = (activeIndex + dir + store.dhikrList.length) % store.dhikrList.length;
    store.setActive(store.dhikrList[next]!.id);
  };

  const tap = () => {
    store.increment(dateISO);
    addDhikrToTracker(dateISO, 1);
    const next = count + 1;
    const completedRound = next % active.target === 0;
    // Günlük hedefe tam bu dokunuşla ulaşıldı mı? (belirgin, farklı titreşim deseni)
    const crossedDailyGoal = todayTotal < store.dailyGoal && todayTotal + 1 >= store.dailyGoal;
    if (store.vibration) {
      if (crossedDailyGoal) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 220);
        setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 440);
      } else if (completedRound) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 200);
      } else {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    if (store.sound) {
      tickPlayer.seekTo(0);
      tickPlayer.play();
    }
    if (completedRound && store.chainMode) {
      setTimeout(() => cycleDhikr(1), 350);
    }
  };

  const confirmReset = () => {
    confirmDialog(t('common.confirmDeleteTitle'), t('tasbih.resetConfirm'), t('common.reset'), () => store.resetCount(active.id), t('common.cancel'));
  };

  const filteredDuas = useMemo(() => {
    let list = duaQuery.trim() ? searchDuas(duaQuery) : DUAS;
    if (duaCategory) list = list.filter((d) => d.category === duaCategory);
    return list;
  }, [duaQuery, duaCategory]);

  const duaCategories = useMemo(
    () => [...new Set(DUAS.map((d) => d.category))],
    [],
  );

  // ——— Cep modu: simsiyah ekran, her dokunuş sayar, uzun basınca çıkılır ———
  if (pocketMode) {
    return (
      <Pressable
        onPress={tap}
        onLongPress={() => setPocketMode(false)}
        delayLongPress={800}
        accessibilityRole="button"
        accessibilityLabel={t('tasbih.tapToCount')}
        style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}
      >
        <KeepAwakeWhileFocused />
        <ThemedText style={{ fontSize: 64, fontWeight: '200', color: 'rgba(255,255,255,0.25)' }}>
          {shownCount}
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{
            position: 'absolute',
            bottom: insets.bottom + Spacing.xl,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          {t('tasbih.pocketExitHint')}
        </ThemedText>
      </Pressable>
    );
  }

  // ——— Odak modu ———
  if (focusMode) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <KeepAwakeWhileFocused />
        <Pressable
          onPress={tap}
          accessibilityRole="button"
          accessibilityLabel={t('tasbih.tapToCount')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <View style={{ position: 'absolute', top: insets.top + Spacing.xl, left: 0, right: 0 }}>
            <TasbihBeads color={beadColor} pullSignal={count} height={140} large />
          </View>
          <View style={{ alignItems: 'center', gap: Spacing.md }}>
            {active.arabic ? (
              <ThemedText variant="arabic" style={{ fontSize: FontSize.arabicMax, textAlign: 'center' }}>
                {active.arabic}
              </ThemedText>
            ) : null}
            <ThemedText variant="secondary">{active.label}</ThemedText>
            <ThemedText style={{ fontSize: 88, fontWeight: '200', color: theme.text }}>
              {shownCount}
            </ThemedText>
            <ThemedText variant="secondary">
              / {active.target} · {t('tasbih.round')}: {rounds}
            </ThemedText>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setFocusMode(false)}
          accessibilityRole="button"
          accessibilityLabel={t('tasbih.focusExit')}
          style={{
            position: 'absolute',
            top: insets.top + Spacing.sm,
            right: Spacing.md,
            backgroundColor: theme.surfaceAlt,
            borderRadius: Radius.full,
            padding: Spacing.sm,
          }}
        >
          <Ionicons name="close" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    );
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg }}>
        <BackToHome />
        <ThemedText variant="title">{t('tasbih.zikirTitle')}</ThemedText>
      </View>

      {/* Zikir seçici kart: ‹ Arapça / ad / anlam / kaynak › */}
      <Card style={{ marginTop: Spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => cycleDhikr(-1)} accessibilityRole="button" accessibilityLabel="←" hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={theme.textSecondary} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
            {active.arabic ? (
              <ThemedText variant="arabic" color={theme.primary} style={{ fontSize: 30, textAlign: 'center' }}>
                {active.arabic}
              </ThemedText>
            ) : null}
            <ThemedText variant="heading">{active.label}</ThemedText>
            {active.meaningTr ? <ThemedText variant="secondary">{active.meaningTr}</ThemedText> : null}
            {active.source ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Ionicons name="ribbon-outline" size={13} color={theme.accent} />
                <ThemedText variant="caption">{active.source}</ThemedText>
              </View>
            ) : null}
            {active.custom ? (
              <Pressable
                onPress={() =>
                  confirmDialog(t('common.confirmDeleteTitle'), t('tasbih.removeCustom'), t('common.delete'), () => store.removeCustomDhikr(active.id), t('common.cancel'))
                }
                accessibilityRole="button"
              >
                <ThemedText variant="caption" color={theme.danger}>
                  {t('tasbih.removeCustom')}
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => cycleDhikr(1)} accessibilityRole="button" accessibilityLabel="→" hitSlop={10}>
            <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
          </Pressable>
        </View>
      </Card>

      {/* Dairesel sayaç — dokununca sayar */}
      <Pressable onPress={tap} accessibilityRole="button" accessibilityLabel={t('tasbih.tapToCount')}>
        <View style={{ alignItems: 'center', marginTop: Spacing.lg }}>
          <View
            style={{
              width: 210,
              height: 210,
              borderRadius: 105,
              borderWidth: 3,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText color={theme.primary} style={{ fontSize: 76, fontWeight: '700' }}>
              {String(shownCount).padStart(2, '0')}
            </ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md }}>
            <ThemedText variant="secondary">/ {active.target}</ThemedText>
            <ThemedText variant="secondary">· {t('tasbih.cycle')} {rounds + 1}</ThemedText>
          </View>
          <View style={{ marginTop: Spacing.md, width: '100%' }}>
            <TasbihBeads color={beadColor} pullSignal={count} height={110} large />
          </View>
          <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
            {t('tasbih.tapToCount')}
          </ThemedText>
        </View>
      </Pressable>

      {/* Odak modu */}
      <Pressable
        onPress={() => setFocusMode(true)}
        accessibilityRole="button"
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: Radius.full,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          marginTop: Spacing.md,
        }}
      >
        <Ionicons name="scan-outline" size={16} color={theme.primary} />
        <ThemedText variant="label" color={theme.primary}>
          {t('tasbih.focusMode')}
        </ThemedText>
      </Pressable>

      {/* Cep modu */}
      <Pressable
        onPress={() => setPocketMode(true)}
        accessibilityRole="button"
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: Radius.full,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          marginTop: Spacing.sm,
        }}
      >
        <Ionicons name="moon-outline" size={16} color={theme.primary} />
        <ThemedText variant="label" color={theme.primary}>
          {t('tasbih.pocketMode')}
        </ThemedText>
      </Pressable>

      {/* Renk seçimi */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginTop: Spacing.lg }}>
        {BEAD_COLORS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => store.setBeadColor(c.id)}
            accessibilityRole="button"
            accessibilityLabel={c.labelTr}
            accessibilityState={{ selected: c.id === store.beadColorId }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: c.hex,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: c.id === store.beadColorId ? 3 : 0,
              borderColor: theme.text,
            }}
          >
            <View style={{ width: 12, height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.55)' }} />
          </Pressable>
        ))}
      </View>

      {/* Tur · Sıfırla · İlerleme */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: Spacing.lg,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <ThemedText variant="caption" style={{ textTransform: 'uppercase' }}>
            {t('tasbih.tur')}
          </ThemedText>
          <ThemedText variant="heading">{rounds}</ThemedText>
        </View>
        <Pressable
          onPress={confirmReset}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
        >
          <Ionicons name="refresh-outline" size={16} color={theme.danger} />
          <ThemedText variant="label" color={theme.danger}>
            {t('tasbih.resetCounter')}
          </ThemedText>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <ThemedText variant="caption" style={{ textTransform: 'uppercase' }}>
            {t('tasbih.progressLabel')}
          </ThemedText>
          <ThemedText variant="heading" color={theme.primary}>
            %{progressPct}
          </ThemedText>
        </View>
      </View>

      {/* İstatistikler */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText variant="heading" color={theme.primary}>
            {todayTotal}
          </ThemedText>
          <ThemedText variant="caption">{t('tasbih.todayCount')}</ThemedText>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText variant="heading">{grandTotal}</ThemedText>
          <ThemedText variant="caption">{t('tasbih.totalCount')}</ThemedText>
        </Card>
      </View>
      <Card style={{ marginTop: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              borderWidth: 4,
              borderColor: goalPct >= 100 ? theme.success : theme.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText variant="caption" color={goalPct >= 100 ? theme.success : theme.primary}>
              %{goalPct}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="label">{t('tasbih.dailyGoalLabel')}</ThemedText>
            <ThemedText variant="heading">
              {todayTotal}/{store.dailyGoal}
            </ThemedText>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[33, 100, 300].map((n) => (
              <Chip
                key={n}
                label={String(n)}
                selected={store.dailyGoal === n}
                onPress={() => store.setDailyGoal(n)}
              />
            ))}
          </View>
        </View>
      </Card>

      {/* Bu hafta */}
      <Card style={{ marginTop: Spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <ThemedText variant="label">{t('tasbih.thisWeek')}</ThemedText>
          <ThemedText variant="caption">{weekBars.reduce((a, b) => a + b.total, 0)}</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, height: 84 }}>
          {weekBars.map((b, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <View
                style={{
                  width: '70%',
                  height: `${Math.max(6, (b.total / weekMax) * 80)}%`,
                  borderRadius: 4,
                  backgroundColor: b.isToday ? theme.primary : theme.surfaceAlt,
                }}
              />
              <ThemedText variant="caption" color={b.isToday ? theme.primary : theme.textSecondary}>
                {b.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      {/* Ayarlar: zincir mod, titreşim, tık sesi */}
      <Card style={{ marginTop: Spacing.sm }}>
        {(
          [
            ['chainMode', t('tasbih.chainMode'), t('tasbih.chainModeSub'), store.chainMode],
            ['vibration', t('tasbih.vibration'), null, store.vibration],
            ['sound', t('tasbih.sound'), null, store.sound],
          ] as ['chainMode' | 'vibration' | 'sound', string, string | null, boolean][]
        ).map(([key, label, sub, value], i) => (
          <Pressable
            key={key}
            onPress={() => store.setOption(key, !value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              paddingVertical: Spacing.sm,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: theme.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText>{label}</ThemedText>
              {sub ? <ThemedText variant="caption">{sub}</ThemedText> : null}
            </View>
            <View
              style={{
                width: 46,
                height: 26,
                borderRadius: 13,
                backgroundColor: value ? theme.primary : theme.surfaceAlt,
                justifyContent: 'center',
                paddingHorizontal: 3,
                alignItems: value ? 'flex-end' : 'flex-start',
              }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' }} />
            </View>
          </Pressable>
        ))}
      </Card>

      {/* Bölümler */}
      <View style={{ gap: Spacing.sm, marginTop: Spacing.lg }}>
        <SectionLink
          icon="partly-sunny"
          gold
          title={t('tasbih.sectionMorningEvening')}
          subtitle={t('tasbih.sectionMorningEveningSub')}
          onPress={() => router.push('/duas/sabah')}
        />
        <SectionLink
          icon="document-text-outline"
          title={t('tasbih.sectionAfterPrayer')}
          subtitle={t('tasbih.sectionAfterPrayerSub')}
          onPress={() => router.push('/duas/namazSonrasi')}
        />
        <SectionLink
          icon="heart"
          title={t('tasbih.sectionSalawat')}
          subtitle={t('tasbih.sectionSalawatSub')}
          onPress={() => store.setActive('salavat')}
        />
        <SectionLink
          icon="sparkles"
          gold
          title={t('tasbih.sectionEsma')}
          subtitle={t('tasbih.sectionEsmaSub')}
          onPress={() => router.push('/esma')}
        />
        <SectionLink
          icon="chatbubbles-outline"
          title={t('tasbih.sectionHadiths')}
          subtitle={t('tasbih.sectionHadithsSub')}
          onPress={() => router.push('/hadiths')}
        />
      </View>

      {/* Dualar */}
      <ThemedText variant="title" style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
        {t('tasbih.duasSection')}
      </ThemedText>
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
        }}
      >
        <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
        <TextInput
          value={duaQuery}
          onChangeText={setDuaQuery}
          placeholder={t('duas.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={{ flex: 1, paddingVertical: Spacing.sm + 2, color: theme.text }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm }}>
        <Chip label={t('common.all')} selected={duaCategory === null} onPress={() => setDuaCategory(null)} />
        {duaCategories.map((c) => (
          <Chip
            key={c}
            label={t(`duas.categories.${c}`, { defaultValue: c })}
            selected={duaCategory === c}
            onPress={() => setDuaCategory(duaCategory === c ? null : c)}
          />
        ))}
      </View>
      <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
        {filteredDuas.map((d) => (
          <Pressable
            key={d.id}
            onPress={() => router.push(`/duas/${d.category}`)}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.md,
              backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
              borderRadius: Radius.xl,
              borderWidth: 1,
              borderColor: theme.border,
              padding: Spacing.md,
            })}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">{d.titleTr}</ThemedText>
              <ThemedText variant="caption" color={theme.accent}>
                {t(`duas.categories.${d.category}`, { defaultValue: d.category })}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>
      <ThemedText variant="caption" style={{ marginTop: Spacing.sm, marginBottom: insets.bottom }}>
        {formatDateShort(new Date(), language)} · {t('common.offlineAvailable')}
      </ThemedText>
    </Screen>
  );
}
