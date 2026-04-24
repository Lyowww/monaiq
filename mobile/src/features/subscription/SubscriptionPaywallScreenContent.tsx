import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscriptionApi } from './api/subscriptionApi';
import { usersApi } from '../users/api/usersApi';
import { formatPriceMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';
import { useUiStore } from '../ui/store/useUiStore';
import { figma } from '../../theme/figma';

const FEATURE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  sparkles: 'sparkles-outline',
  'line-chart': 'bar-chart-outline',
  lightbulb: 'bulb-outline',
  layers: 'layers-outline',
  'calendar-clock': 'calendar-outline',
  'file-down': 'download-outline',
  coins: 'cash-outline',
  tags: 'pricetags-outline',
  headphones: 'headset-outline',
  rocket: 'rocket-outline'
};

type Props = {
  lockedFeatureId?: string;
  onClose: () => void;
};

export function SubscriptionPaywallScreenContent({ lockedFeatureId, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const lang = useUiStore((s) => s.appLanguage);
  const qc = useQueryClient();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const plansQ = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => subscriptionApi.listPlans(),
    staleTime: 60_000
  });

  const featQ = useQuery({
    queryKey: ['subscription', 'features'],
    queryFn: () => subscriptionApi.listFeatures(),
    staleTime: 300_000
  });

  const subscribe = useMutation({
    mutationFn: (planKey: string) =>
      usersApi.patchMe({
        settings: { subscriptionPlanKey: planKey, subscription: 'premium' }
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users', 'me'] });
      onClose();
    }
  });

  const downgrade = useMutation({
    mutationFn: () =>
      usersApi.patchMe({
        settings: { subscriptionPlanKey: null, subscription: 'free' }
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users', 'me'] });
      onClose();
    }
  });

  const catalogById = useMemo(() => {
    const m = new Map<string, { title: string; icon: string }>();
    (featQ.data ?? []).forEach((f) => m.set(f.id, { title: f.title, icon: f.icon }));
    return m;
  }, [featQ.data]);

  const lockedTitle = lockedFeatureId
    ? catalogById.get(lockedFeatureId)?.title ?? lockedFeatureId
    : null;

  const plans = plansQ.data ?? [];
  const cardW = width - figma.screen.horizontal * 2;

  return (
    <LinearGradient colors={[figma.color.bg, '#EDEAE2', figma.color.bgAlt]} style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={onClose}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons color={figma.color.text} name="chevron-back" size={26} />
        </Pressable>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <LinearGradient colors={[figma.color.accentGold, '#C9A227']} style={styles.heroMark}>
            <Ionicons color="#1A1F2B" name="diamond-outline" size={28} />
          </LinearGradient>
          <Text style={styles.heroTitle}>{translate(lang, 'subscription.title')}</Text>
          <Text style={styles.heroSub}>
            {lockedTitle
              ? translate(lang, 'subscription.subtitleLocked', { feature: lockedTitle })
              : translate(lang, 'subscription.subtitle')}
          </Text>
        </View>

        {plans.length > 0 ? (
          <Text style={styles.sectionLabel}>{translate(lang, 'subscription.pickPlan')}</Text>
        ) : null}

        {plansQ.isPending ? (
          <ActivityIndicator color={figma.color.accentGold} style={styles.loader} />
        ) : plans.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons color={figma.color.accentGold} name="albums-outline" size={40} />
            <Text style={styles.emptyTitle}>{translate(lang, 'subscription.noPlans')}</Text>
            <Text style={styles.emptySub}>{translate(lang, 'subscription.noPlansHint')}</Text>
          </View>
        ) : (
          <View style={styles.planList}>
            {plans.map((p, idx) => {
              const on = selectedKey === p.key || (selectedKey == null && idx === 0);
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setSelectedKey(p.key)}
                  style={({ pressed }) => [
                    styles.planCard,
                    { width: cardW },
                    on && styles.planCardOn,
                    pressed && { opacity: 0.94 }
                  ]}
                >
                  {p.highlightTag ? (
                    <View style={styles.ribbon}>
                      <Text style={styles.ribbonTxt}>{p.highlightTag}</Text>
                    </View>
                  ) : null}
                  <View style={styles.planCardHeader}>
                    <Text style={styles.planName}>{p.name}</Text>
                    {on ? (
                      <Ionicons color={figma.color.accentGold} name="checkmark-circle" size={24} />
                    ) : (
                      <View style={styles.radioOuter}>
                        <View style={styles.radioInner} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.planPrice}>
                    {formatPriceMinor(p.priceMinor, p.currencyCode)}
                    <Text style={styles.planPeriod}>
                      {p.billingPeriod === 'year'
                        ? translate(lang, 'subscription.perYear')
                        : translate(lang, 'subscription.perMonth')}
                    </Text>
                  </Text>
                  {p.description ? (
                    <Text style={styles.planDesc}>{p.description}</Text>
                  ) : null}
                  <View style={styles.miniFeat}>
                    {p.featureIds.map((fid) => {
                      const meta = catalogById.get(fid);
                      const ion = meta
                        ? FEATURE_ICONS[meta.icon] ?? 'checkmark-circle-outline'
                        : 'checkmark-circle-outline';
                      return (
                        <View key={fid} style={styles.miniFeatRow}>
                          <Ionicons color={figma.color.accentGold} name={ion} size={17} />
                          <Text style={styles.miniFeatTxt}>{meta?.title ?? fid}</Text>
                        </View>
                      );
                    })}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {plans.length > 0 ? (
          <>
            <Pressable
              disabled={subscribe.isPending}
              onPress={() => {
                const key = selectedKey ?? plans[0]?.key;
                if (key) {
                  void subscribe.mutateAsync(key);
                }
              }}
              style={({ pressed }) => [
                styles.cta,
                (subscribe.isPending || plans.length === 0) && { opacity: 0.55 },
                pressed && { opacity: 0.88 }
              ]}
            >
              <LinearGradient colors={[figma.color.accentGold, '#C9A227']} style={styles.ctaGrad}>
                {subscribe.isPending ? (
                  <ActivityIndicator color="#1A1F2B" />
                ) : (
                  <Text style={styles.ctaTxt}>{translate(lang, 'subscription.cta')}</Text>
                )}
              </LinearGradient>
            </Pressable>

            <Text style={styles.demoNote}>{translate(lang, 'subscription.demoNote')}</Text>

            <Pressable
              disabled={downgrade.isPending}
              onPress={() => void downgrade.mutateAsync()}
              style={({ pressed }) => [styles.textLink, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.textLinkTxt}>{translate(lang, 'subscription.useFree')}</Text>
            </Pressable>
          </>
        ) : null}

        {(subscribe.isError || downgrade.isError) && (
          <Text style={styles.err}>{translate(lang, 'subscription.error')}</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: figma.screen.horizontal,
    paddingBottom: 4,
    gap: 10
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.surfacePressed
  },
  topBarSpacer: { flex: 1 },
  scrollContent: {
    paddingHorizontal: figma.screen.horizontal,
    alignItems: 'center'
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
    paddingHorizontal: 8
  },
  heroMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: figma.color.text,
    letterSpacing: -0.4,
    textAlign: 'center'
  },
  heroSub: {
    fontSize: 14,
    color: figma.color.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
    marginTop: 8
  },
  sectionLabel: {
    alignSelf: 'stretch',
    fontSize: 13,
    fontWeight: '700',
    color: figma.color.text,
    letterSpacing: 0.35,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4
  },
  loader: { marginVertical: 36 },
  planList: { width: '100%', alignItems: 'center', gap: 14 },
  planCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1.5,
    borderColor: 'rgba(168, 182, 160, 0.4)',
    overflow: 'hidden',
    ...figma.shadow.card,
    elevation: 3
  },
  planCardOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(168, 182, 160, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent'
  },
  ribbon: {
    position: 'absolute',
    top: 14,
    right: -36,
    backgroundColor: figma.color.accentGold,
    paddingVertical: 5,
    paddingHorizontal: 44,
    transform: [{ rotate: '45deg' }]
  },
  ribbonTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A1F2B',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  planName: { fontSize: 19, fontWeight: '800', color: figma.color.text, flex: 1 },
  planPrice: { fontSize: 26, fontWeight: '800', color: '#8A7A2F' },
  planPeriod: { fontSize: 14, fontWeight: '600', color: figma.color.textMuted },
  planDesc: { marginTop: 10, fontSize: 14, color: figma.color.textMuted, lineHeight: 20 },
  miniFeat: { marginTop: 14, gap: 10 },
  miniFeatRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  miniFeatTxt: { flex: 1, fontSize: 13, fontWeight: '600', color: figma.color.text, lineHeight: 18 },
  cta: {
    marginTop: 22,
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden'
  },
  ctaGrad: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaTxt: { fontSize: 17, fontWeight: '800', color: '#1A1F2B' },
  demoNote: {
    marginTop: 14,
    fontSize: 12,
    color: figma.color.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 8
  },
  textLink: { marginTop: 12, alignSelf: 'center', padding: 10 },
  textLinkTxt: { fontSize: 15, fontWeight: '700', color: figma.color.text },
  err: { marginTop: 14, color: '#8B3A3A', textAlign: 'center', fontSize: 13 },
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 12, paddingHorizontal: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: figma.color.text, textAlign: 'center' },
  emptySub: { fontSize: 14, color: figma.color.textMuted, textAlign: 'center', lineHeight: 20 }
});
