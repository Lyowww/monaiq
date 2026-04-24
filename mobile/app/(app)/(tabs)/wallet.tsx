import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppHeaderPaddingTop } from '../../../src/components/navigation/AppFixedHeader';
import { WalletCardRow } from '../../../src/components/wallet/WalletCardRow';
import { WalletTransactionHistory } from '../../../src/components/wallet/WalletTransactionHistory';
import { useUiStore } from '../../../src/features/ui/store/useUiStore';
import { useDashboardSummaryQuery } from '../../../src/features/dashboard/hooks/useDashboardQuery';
import { useTransactionsListQuery } from '../../../src/features/transactions/hooks/useTransactionsListQuery';
import { formatAmdFromMinor } from '../../../src/lib/format/currency';
import { translate } from '../../../src/locales/i18n';
import { dashboardStrings } from '../../../src/locales/dashboard.strings';
import { figma } from '../../../src/theme/figma';
import { theme } from '../../../src/theme/tokens';
import type { TransactionRecord } from '@ai-finance/shared-types';

function sortByDateDesc(txs: TransactionRecord[]): TransactionRecord[] {
  return [...txs].sort(
    (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
  );
}

export default function WalletTab() {
  const insets = useSafeAreaInsets();
  const headerPad = useAppHeaderPaddingTop();
  const router = useRouter();
  const appLanguage = useUiStore((s) => s.appLanguage);
  const t = dashboardStrings(appLanguage);
  const q = useDashboardSummaryQuery();
  const txQ = useTransactionsListQuery(200);
  const cardBal = q.data?.cardBalanceMinor ?? 0;
  const cashBal = q.data?.cashOnHandMinor ?? 0;
  const upcoming = q.data?.upcomingPayments ?? [];
  const iOwe = q.data?.debtsIOwe ?? [];
  const theyOwe = q.data?.debtsTheyOweMe ?? [];
  const recurring = q.data?.recurringPayments ?? [];

  const sortedTx = useMemo(
    () => sortByDateDesc(txQ.data ?? []),
    [txQ.data]
  );

  return (
    <LinearGradient colors={[figma.color.bg, figma.color.bgAlt]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerPad + 8, paddingBottom: 100 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sub}>{t.walletSubtitle}</Text>
        <WalletCardRow
          appLanguage={appLanguage}
          cardBalanceMinor={cardBal}
          cashOnHandMinor={cashBal}
          onAddPress={() => router.push('/quick-add?mode=income' as Href)}
        />
        <Pressable
          onPress={() => router.push('/exchange-rates' as Href)}
          style={({ pressed }) => [styles.ratesCta, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.ratesCtaT}>{translate(appLanguage, 'exchangeRates.openScreen')}</Text>
        </Pressable>
        <WalletTransactionHistory
          appLanguage={appLanguage}
          isLoading={txQ.isPending && !txQ.data}
          transactions={sortedTx}
        />
        {upcoming.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.h2}>{t.walletUpcoming}</Text>
            {upcoming.slice(0, 8).map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.itemTitle}>{p.title}</Text>
                <Text style={styles.itemRight}>{formatAmdFromMinor(p.amountMinor)}</Text>
                <Text style={styles.muted} numberOfLines={1}>
                  {new Date(p.dueDate).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {recurring.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.h2}>{t.walletRecurring}</Text>
            {recurring.slice(0, 6).map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.itemTitle}>{p.title}</Text>
                <Text style={styles.itemRight}>{formatAmdFromMinor(p.amountMinor)}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {iOwe.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.h2}>{t.walletIOwe}</Text>
            {iOwe.slice(0, 6).map((d) => (
              <View key={d.id} style={styles.row}>
                <Text style={styles.itemTitle}>{d.personName}</Text>
                <Text style={styles.itemRight}>
                  {formatAmdFromMinor(d.outstandingMinor)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {theyOwe.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.h2}>{t.walletTheyOwe}</Text>
            {theyOwe.slice(0, 6).map((d) => (
              <View key={d.id} style={styles.row}>
                <Text style={styles.itemTitle}>{d.personName}</Text>
                <Text style={styles.itemRight}>
                  {formatAmdFromMinor(d.outstandingMinor)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ratesCta: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 4
  },
  ratesCtaT: { color: figma.color.accentGold, fontWeight: '600', fontSize: 15 },
  root: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg },
  h2: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 8 },
  sub: { color: theme.colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: figma.color.bgElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  row: { marginBottom: 10 },
  itemTitle: { fontWeight: '700', color: theme.colors.textPrimary },
  itemRight: { fontWeight: '800', color: figma.color.primary, marginTop: 2 },
  muted: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }
});
