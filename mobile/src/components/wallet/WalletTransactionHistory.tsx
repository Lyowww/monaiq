import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TransactionRecord } from '@ai-finance/shared-types';
import { figma } from '../../theme/figma';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { formatActivityTime } from '../../lib/format/activityTime';
import type { AppLanguage } from '../../locales/i18n.types';
import { translate } from '../../locales/i18n';

type WalletTransactionHistoryProps = {
  appLanguage: AppLanguage;
  /** Newest first */
  transactions: TransactionRecord[];
  isLoading: boolean;
  limit?: number;
};

function iconFor(category: string, merchant?: string): keyof typeof Ionicons.glyphMap {
  const s = `${category} ${merchant ?? ''}`.toLowerCase();
  if (s.includes('income') || s.includes('salary') || s.includes('վարձ')) {
    return 'wallet';
  }
  if (s.includes('util') || s.includes('կոմունալ') || s.includes('electric')) {
    return 'home-outline';
  }
  if (s.includes('grocery') || s.includes('food') || s.includes('cart')) {
    return 'cart';
  }
  return 'receipt-outline';
}

export function WalletTransactionHistory({
  appLanguage,
  transactions,
  isLoading,
  limit = 50
}: WalletTransactionHistoryProps) {
  const title = translate(appLanguage, 'wallet.transactionHistory');
  const empty = translate(appLanguage, 'wallet.transactionHistoryEmpty');
  const list = transactions.slice(0, limit);

  if (isLoading) {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>{title}</Text>
        <ActivityIndicator color={figma.color.accentGold} style={styles.loading} />
      </View>
    );
  }

  if (list.length === 0) {
    return (
      <View style={styles.block}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.empty}>{empty}</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      {list.map((tx) => {
        const credit = tx.direction === 'credit';
        const when = new Date(tx.bookedAt);
        return (
          <View key={tx.id} style={styles.row}>
            <View
              style={[
                styles.iconBubble,
                { backgroundColor: credit ? 'rgba(212, 175, 55, 0.18)' : 'rgba(168, 182, 160, 0.14)' }
              ]}
            >
              <Ionicons
                color={credit ? figma.color.softGold : figma.color.textMuted}
                name={iconFor(tx.category, tx.merchantName)}
                size={22}
              />
            </View>
            <View style={styles.mid}>
              <Text numberOfLines={1} style={styles.merchant}>
                {tx.merchantName ?? tx.category}
              </Text>
              <Text style={styles.date}>{formatActivityTime(when, appLanguage)}</Text>
            </View>
            <View style={styles.right}>
              <Text
                style={[
                  styles.amt,
                  credit ? { color: figma.color.softGold } : { color: figma.color.textSecondary }
                ]}
              >
                {credit ? '+' : '−'}
                {formatAmdFromMinor(tx.amountMinor)}
              </Text>
              <Text style={styles.sub}>{tx.category}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  title: { fontSize: figma.type.section, fontWeight: '600', color: figma.color.text, letterSpacing: 0.3 },
  loading: { paddingVertical: 20 },
  empty: { color: figma.color.textMuted, lineHeight: 20, fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: figma.radius.activityRow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated,
    gap: 10
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mid: { flex: 1, minWidth: 0 },
  merchant: { fontSize: 15, fontWeight: '600', color: figma.color.text },
  date: { fontSize: 12, color: figma.color.textLabel, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amt: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 11, color: figma.color.textMuted, marginTop: 2 }
});
