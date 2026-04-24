import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { InOutTrendChart } from '../../../src/components/charts/InOutTrendChart';
import { SpendingSparkline } from '../../../src/components/charts/SpendingSparkline';
import { BurnRateBar } from '../../../src/components/dashboard/BurnRateBar';
import { GlassCard } from '../../../src/components/GlassCard';
import { useAppHeaderPaddingTop } from '../../../src/components/navigation/AppFixedHeader';
import { useUiStore } from '../../../src/features/ui/store/useUiStore';
import { useDashboardSummaryQuery } from '../../../src/features/dashboard/hooks/useDashboardQuery';
import { plansApi } from '../../../src/features/plans/api/plansApi';
import { useSubscriptionPaywall } from '../../../src/features/subscription/SubscriptionPaywallProvider';
import { SUBSCRIPTION_FEATURE } from '../../../src/features/subscription/subscriptionFeatureIds';
import { useEntitlements } from '../../../src/features/subscription/hooks/useEntitlements';
import { useTransactionsListQuery } from '../../../src/features/transactions/hooks/useTransactionsListQuery';
import { dailyCreditDebitSeries, type AnalyticsPeriod } from '../../../src/lib/analytics/periodMetrics';
import { formatAmdFromMinor } from '../../../src/lib/format/currency';
import { dashboardStrings } from '../../../src/locales/dashboard.strings';
import { figma } from '../../../src/theme/figma';
import { theme } from '../../../src/theme/tokens';
import { translate } from '../../../src/locales/i18n';

const PERIODS: AnalyticsPeriod[] = [7, 30, 90];

export default function StatsTab() {
  const insets = useSafeAreaInsets();
  const headerPad = useAppHeaderPaddingTop();
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const appLanguage = useUiStore((s) => s.appLanguage);
  const moneyFocus = useUiStore((s) => s.moneyFocus);
  const t = dashboardStrings(appLanguage);
  const tr = (key: string) => translate(appLanguage, key);
  const [period, setPeriod] = useState<AnalyticsPeriod>(7);
  const { hasFeature } = useEntitlements();
  const paywall = useSubscriptionPaywall();
  const canAdvanced = hasFeature(SUBSCRIPTION_FEATURE.ADVANCED_ANALYTICS);

  useEffect(() => {
    if (!canAdvanced && period > 7) {
      setPeriod(7);
    }
  }, [canAdvanced, period]);

  const q = useDashboardSummaryQuery();
  const txQ = useTransactionsListQuery(200);
  const plansQ = useQuery({
    queryKey: ['plans', 'active'],
    queryFn: () => plansApi.list('active'),
    staleTime: 60_000
  });

  const fullTx = useMemo(() => txQ.data ?? [], [txQ.data]);
  const savingsPlans = useMemo(
    () => (plansQ.data ?? []).filter((p) => p.planType === 'savings_target'),
    [plansQ.data]
  );

  const inflow = q.data?.monthlyInflowMinor ?? 0;
  const outflow = q.data?.monthlyOutflowMinor ?? 0;
  const ob = q.data?.obligationDueMinor ?? 0;
  const pressure = q.data?.debtPressureScore ?? 0;
  const warnings = useMemo(() => q.data?.aiWarnings ?? [], [q.data]);

  const { credits, debits, labels: trendLabels } = useMemo(
    () => dailyCreditDebitSeries(fullTx, period),
    [fullTx, period]
  );

  const dayActivity = useMemo(() => {
    const combined = credits.map((c, i) => c + (debits[i] ?? 0));
    const mx = Math.max(1, ...combined);
    return combined.map((v) => v / mx);
  }, [credits, debits]);

  const seriesTotals = useMemo(() => {
    const cin = credits.reduce((a, b) => a + b, 0);
    const dout = debits.reduce((a, b) => a + b, 0);
    return { in: cin, out: dout, net: cin - dout };
  }, [credits, debits]);

  const coachLines = useMemo(() => {
    const lines: string[] = [];
    const tin = seriesTotals.in;
    const tout = seriesTotals.out;
    const hasFlow = fullTx.length > 0 && (tin > 0 || tout > 0);

    if (hasFlow && tin === 0 && tout > 0) {
      lines.push(translate(appLanguage, 'stats.coachNoIncome'));
    } else if (hasFlow && tin > 0 && tout > tin) {
      lines.push(translate(appLanguage, 'stats.coachNegativeNet'));
    } else if (hasFlow && tin > 0 && tout / tin >= 0.85) {
      lines.push(translate(appLanguage, 'stats.coachTight'));
    }

    if (moneyFocus === 'save') {
      lines.push(translate(appLanguage, 'stats.coachSaveFocus'));
      lines.push(translate(appLanguage, 'stats.coachSaveAvoid'));
    }

    if (lines.length === 0) {
      lines.push(translate(appLanguage, 'stats.coachDefault'));
    }

    return lines;
  }, [appLanguage, fullTx.length, moneyFocus, seriesTotals.in, seriesTotals.out]);

  const chartW = winW - 2 * figma.screen.horizontal - 2 * theme.spacing.lg;
  const hasLedger = fullTx.length > 0;
  const barChartEmpty = !hasLedger || (seriesTotals.in === 0 && seriesTotals.out === 0);

  if ((q.isPending && !q.data) || (txQ.isPending && !txQ.data)) {
    return (
      <LinearGradient
        colors={[figma.color.bg, figma.color.bgAlt]}
        style={[styles.rootLoading, { paddingTop: headerPad }]}
      >
        <ActivityIndicator color={figma.color.primary} size="large" />
      </LinearGradient>
    );
  }

  const showSaveCard = moneyFocus === 'save' || savingsPlans.length > 0;

  return (
    <LinearGradient
      colors={[figma.color.bg, figma.color.bgAlt]}
      style={[styles.root, { paddingTop: headerPad }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: figma.screen.bottomContentInset + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageSubOnly}>{tr('stats.pageSubtitle')}</Text>

        <View style={styles.periodRow}>
          {PERIODS.map((d) => {
            const on = period === d;
            const locked = d > 7 && !canAdvanced;
            const labelKey = d === 7 ? 'stats.period7' : d === 30 ? 'stats.period30' : 'stats.period90';
            return (
              <Pressable
                key={d}
                onPress={() => {
                  if (locked) {
                    paywall.open({ featureId: SUBSCRIPTION_FEATURE.ADVANCED_ANALYTICS });
                    return;
                  }
                  setPeriod(d);
                }}
                style={({ pressed }) => [
                  styles.periodChip,
                  on && styles.periodChipOn,
                  locked && styles.periodChipLocked,
                  pressed && { opacity: 0.9 }
                ]}
              >
                <View style={styles.periodChipInner}>
                  <Text style={[styles.periodChipText, on && styles.periodChipTextOn]}>
                    {tr(labelKey)}
                  </Text>
                  {locked ? (
                    <Ionicons color={figma.color.accentGold} name="lock-closed-outline" size={14} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <Text style={styles.kpiLbl}>{tr('stats.totalIn')}</Text>
            <Text style={[styles.kpiVal, { color: figma.color.positive }]}>
              {formatAmdFromMinor(seriesTotals.in)}
            </Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiLbl}>{tr('stats.totalOut')}</Text>
            <Text style={styles.kpiVal}>{formatAmdFromMinor(seriesTotals.out)}</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiLbl}>{tr('stats.net')}</Text>
            <Text
              style={[
                styles.kpiVal,
                { color: seriesTotals.net >= 0 ? figma.color.positive : figma.color.text }
              ]}
            >
              {formatAmdFromMinor(seriesTotals.net)}
            </Text>
          </View>
        </View>

        <GlassCard style={styles.chartCard}>
          <View style={styles.chartTitleRow}>
            <View style={styles.accentPip} />
            <Text style={styles.chartTitle}>{tr('stats.spendTrend')}</Text>
          </View>
          {barChartEmpty ? (
            <Text style={styles.mutedBox}>{tr('stats.ledgerEmpty')}</Text>
          ) : (
            <SpendingSparkline days={period} transactions={fullTx} width={chartW} />
          )}
        </GlassCard>

        <GlassCard style={styles.chartCard}>
          <View style={styles.chartTitleRow}>
            <View style={styles.accentPip} />
            <Text style={styles.chartTitle}>{tr('stats.cashflowTitle')}</Text>
          </View>
          {barChartEmpty ? (
            <Text style={styles.mutedBox}>{tr('stats.ledgerEmpty')}</Text>
          ) : canAdvanced ? (
            <>
              <InOutTrendChart
                credits={credits}
                dayActivity={dayActivity}
                debits={debits}
                labels={trendLabels}
                width={chartW}
              />
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: figma.color.accentGold }]} />
                  <Text style={styles.legendTxt}>{tr('stats.legendIn')}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: figma.color.chartOutLight }]} />
                  <Text style={styles.legendTxt}>{tr('stats.legendOut')}</Text>
                </View>
              </View>
            </>
          ) : (
            <Pressable
              onPress={() => paywall.open({ featureId: SUBSCRIPTION_FEATURE.ADVANCED_ANALYTICS })}
              style={({ pressed }) => [styles.lockedChartWrap, pressed && { opacity: 0.92 }]}
            >
              <LinearGradient
                colors={['rgba(212, 175, 55, 0.15)', 'rgba(168, 182, 160, 0.12)']}
                style={styles.lockedChart}
              >
                <Ionicons color={figma.color.accentGold} name="lock-closed-outline" size={32} />
                <Text style={styles.lockedChartTitle}>{tr('stats.unlockCashflow')}</Text>
                <Text style={styles.lockedChartCta}>{tr('stats.tapToUnlock')}</Text>
              </LinearGradient>
            </Pressable>
          )}
        </GlassCard>

        <GlassCard>
          <Text style={styles.benchTitle}>{tr('stats.coachTitle')}</Text>
          <Text style={styles.coachIntro}>{tr('stats.coachIntro')}</Text>
          {coachLines.map((line, i) => (
            <Text key={`c-${i}`} style={styles.coachLine}>
              • {line}
            </Text>
          ))}
          <Pressable
            onPress={() => router.push('/(app)/(tabs)/assistant' as Href)}
            style={({ pressed }) => [styles.coachCta, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.coachCtaText}>{t.aiLink}</Text>
          </Pressable>
        </GlassCard>

        {showSaveCard ? (
          <GlassCard>
            <Text style={styles.benchTitle}>{tr('stats.saveSectionTitle')}</Text>
            {moneyFocus === 'save' ? (
              <Text style={styles.muted}>{tr('assistant.focusSavedHint')}</Text>
            ) : null}
            {savingsPlans.map((p) => (
              <Text key={p.id} style={styles.planLine}>
                {translate(appLanguage, 'stats.savingsPlanProgress', {
                  title: p.title,
                  saved: formatAmdFromMinor(p.savedMinor ?? 0),
                  target: formatAmdFromMinor(p.targetMinor ?? 0)
                })}
              </Text>
            ))}
            {moneyFocus === 'save' && savingsPlans.length === 0 ? (
              <Pressable
                onPress={() => router.push('/plans')}
                style={({ pressed }) => [styles.coachCta, pressed && { opacity: 0.9 }]}
              >
                <Text style={styles.coachCtaText}>{tr('assistant.planCtaTitle')}</Text>
              </Pressable>
            ) : null}
          </GlassCard>
        ) : null}

        <BurnRateBar
          monthlyInflowMinor={inflow}
          monthlyOutflowMinor={outflow}
          lang={appLanguage}
        />
        <View style={styles.row}>
          <GlassCard style={styles.half}>
            <Text style={styles.label}>{t.statsObligations}</Text>
            <Text style={styles.val}>{formatAmdFromMinor(ob)}</Text>
          </GlassCard>
          <GlassCard style={styles.half}>
            <Text style={styles.label}>{t.statsPressure}</Text>
            <Text style={styles.val}>{pressure}/100</Text>
          </GlassCard>
        </View>
        <GlassCard>
          <Text style={styles.benchTitle}>{tr('stats.warningsTitle')}</Text>
          {warnings.length === 0 ? (
            <Text style={styles.muted}>{t.statsNoShortfall}</Text>
          ) : (
            warnings.map((w) => (
              <View key={w.noteId} style={styles.w}>
                <Text style={styles.wt}>{w.title}</Text>
                <Text style={styles.wb}>{w.message}</Text>
              </View>
            ))
          )}
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  rootLoading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: figma.screen.horizontal, gap: figma.screen.sectionGap },
  pageSubOnly: { color: figma.color.textMuted, marginBottom: 12, lineHeight: 20, fontSize: 14 },
  periodRow: { flexDirection: 'row', gap: 8 },
  periodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    alignItems: 'center'
  },
  periodChipOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  periodChipLocked: { opacity: 0.85 },
  periodChipInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  periodChipText: { fontSize: 13, fontWeight: '700', color: figma.color.textMuted },
  periodChipTextOn: { color: figma.color.primaryDeep },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpi: {
    flex: 1,
    backgroundColor: figma.color.bgElevated,
    borderRadius: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  kpiLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: figma.color.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  kpiVal: { fontSize: 15, fontWeight: '800', color: figma.color.text },
  chartCard: { gap: 12, paddingVertical: theme.spacing.md },
  chartTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  accentPip: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: figma.color.accentGold,
    opacity: 0.85
  },
  chartTitle: { fontSize: 16, fontWeight: '600', color: figma.color.text, letterSpacing: 0.2 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendTxt: { fontSize: 12, color: figma.color.textSecondary, fontWeight: '600' },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  half: { flex: 1 },
  label: { color: figma.color.textMuted, fontSize: 13, marginBottom: 8, fontWeight: '600' },
  val: { fontSize: 20, fontWeight: '800', color: figma.color.text },
  benchTitle: { fontWeight: '800', color: figma.color.text, marginBottom: 6, fontSize: 15 },
  coachIntro: { color: figma.color.textMuted, fontSize: 13, lineHeight: 19, marginBottom: 10 },
  coachLine: { color: figma.color.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 6 },
  coachCta: { marginTop: 14, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 },
  coachCtaText: { color: figma.color.accentGold, fontWeight: '700', fontSize: 14 },
  planLine: { color: figma.color.text, fontSize: 14, fontWeight: '600', marginTop: 8 },
  muted: { color: figma.color.textMuted, fontSize: 14, lineHeight: 20 },
  mutedBox: { color: figma.color.textMuted, textAlign: 'center', fontSize: 14, paddingVertical: 20 },
  lockedChartWrap: { borderRadius: 16, overflow: 'hidden' },
  lockedChart: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212, 175, 55, 0.35)'
  },
  lockedChartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: figma.color.text,
    textAlign: 'center',
    lineHeight: 22
  },
  lockedChartCta: { fontSize: 13, fontWeight: '800', color: figma.color.accentGold },
  w: { marginTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(26, 31, 43, 0.08)' },
  wt: { color: theme.colors.warning, fontWeight: '700' },
  wb: { color: figma.color.textMuted, marginTop: 4, fontSize: 13, lineHeight: 18 }
});
