import { StyleSheet, Text, View } from 'react-native';
import { formatAmdFromMinor } from '../lib/format/currency';
import { theme } from '../theme/tokens';
import { GlassCard } from './GlassCard';

interface LiquidBalanceCardProps {
  balanceMinor: number;
  monthlyInflowMinor: number;
  monthlyOutflowMinor: number;
}

export function LiquidBalanceCard({
  balanceMinor,
  monthlyInflowMinor,
  monthlyOutflowMinor
}: LiquidBalanceCardProps) {
  const balanceLabel = formatAmdFromMinor(balanceMinor);

  return (
    <View>
      <GlassCard style={styles.card}>
        <Text style={styles.eyebrow}>Liquid Balance</Text>
        <Text style={styles.balance}>{balanceLabel}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Inflow</Text>
            <Text style={styles.positiveValue}>{formatAmdFromMinor(monthlyInflowMinor)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Outflow</Text>
            <Text style={styles.negativeValue}>{formatAmdFromMinor(monthlyOutflowMinor)}</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md
  },
  eyebrow: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.1
  },
  balance: {
    color: theme.colors.textPrimary,
    fontSize: 42,
    fontWeight: '800'
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(168, 182, 160, 0.1)',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md
  },
  statLabel: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs
  },
  positiveValue: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: '700'
  },
  negativeValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700'
  }
});
