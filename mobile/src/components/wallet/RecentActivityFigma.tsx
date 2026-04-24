import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import type { TransactionRecord } from '@ai-finance/shared-types';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/i18n.types';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { formatActivityTime } from '../../lib/format/activityTime';

type RecentActivityFigmaProps = {
  appLanguage: AppLanguage;
  transactions: TransactionRecord[];
};

function iconFor(category: string, merchant?: string): keyof typeof Ionicons.glyphMap {
  const s = `${category} ${merchant ?? ''}`.toLowerCase();
  if (s.includes('income') || s.includes('salary') || s.includes('վարձ')) {
    return 'wallet';
  }
  if (s.includes('util') || s.includes('կոմունալ') || s.includes('electric')) {
    return 'home-outline';
  }
  if (s.includes('grocery') || s.includes('super') || s.includes('shop')) {
    return 'cart';
  }
  if (s.includes('paypal')) {
    return 'logo-paypal';
  }
  if (s.includes('apple')) {
    return 'logo-apple';
  }
  if (s.includes('dropbox')) {
    return 'logo-dropbox';
  }
  if (s.includes('dribbble')) {
    return 'logo-dribbble';
  }
  return 'receipt-outline';
}

function iconBubbleColor(credit: boolean): string {
  if (credit) {
    return 'rgba(212, 175, 55, 0.18)';
  }
  return 'rgba(168, 182, 160, 0.16)';
}

export function RecentActivityFigma({ appLanguage, transactions }: RecentActivityFigmaProps) {
  const t = dashboardStrings(appLanguage);
  const router = useRouter();
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.recentActivity}</Text>
        <Pressable onPress={() => router.push('/(app)/(tabs)/wallet' as Href)} hitSlop={8}>
          <Text style={styles.seeAll}>{t.homeSeeAll}</Text>
        </Pressable>
      </View>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>—</Text>
      ) : (
        transactions.slice(0, 3).map((tx) => {
          const credit = tx.direction === 'credit';
          const icon = iconFor(tx.category, tx.merchantName);
          const when = new Date(tx.bookedAt);
          const dateStr = formatActivityTime(when, appLanguage);
          const bg = iconBubbleColor(credit);
          const iconC = credit ? figma.color.softGold : figma.color.textMuted;
          return (
            <View key={tx.id} style={styles.row}>
              <View style={[styles.iconBubble, { backgroundColor: bg }]}>
                <Ionicons color={iconC} name={icon} size={24} />
              </View>
              <View style={styles.mid}>
                <Text numberOfLines={1} style={styles.merchant}>
                  {tx.merchantName ?? tx.category}
                </Text>
                <Text style={styles.date}>{dateStr}</Text>
              </View>
              <View style={styles.right}>
                <Text
                  style={[
                    styles.amt,
                    credit ? { color: figma.color.softGold } : { color: figma.color.textSecondary }
                  ]}
                >
                  {credit ? '+' : '-'}
                  {formatAmdFromMinor(tx.amountMinor)}
                </Text>
                <Text style={styles.sub}>{tx.category}</Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: figma.type.section, fontWeight: '600', color: figma.color.text, letterSpacing: 0.3 },
  seeAll: { color: figma.color.accentGold, fontWeight: '600', fontSize: 14, letterSpacing: 0.2 },
  empty: { color: figma.color.textMuted, paddingVertical: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: figma.radius.activityRow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated,
    overflow: 'hidden',
    gap: 12,
    marginBottom: 10,
    ...figma.shadow.card
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0
  },
  mid: { flex: 1, minWidth: 0 },
  merchant: { fontSize: 15, fontWeight: '600', color: figma.color.text, letterSpacing: 0.15 },
  date: { fontSize: 12, color: figma.color.textLabel, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amt: { fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
  sub: { fontSize: 11, color: figma.color.textMuted, marginTop: 2 }
});
