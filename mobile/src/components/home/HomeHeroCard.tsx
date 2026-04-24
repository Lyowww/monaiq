import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TransactionRecord } from '@ai-finance/shared-types';
import { SpendingSparkline } from '../charts/SpendingSparkline';
import { GlassPanel } from '../ui/GlassPanel';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/i18n.types';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';

const OUT = 'rgba(168, 182, 160, 0.45)';

type HomeHeroCardProps = {
  appLanguage: AppLanguage;
  balanceMinor: number;
  inflowMinor: number;
  outflowMinor: number;
  ghost: boolean;
  onToggleVisibility: () => void;
  transactions: TransactionRecord[];
};

/**
 * Main balance + gold sparkline + in / out — elevated dark card.
 */
export function HomeHeroCard({
  appLanguage,
  balanceMinor,
  inflowMinor,
  outflowMinor,
  ghost,
  onToggleVisibility,
  transactions
}: HomeHeroCardProps) {
  const t = dashboardStrings(appLanguage);
  const { width: winW } = useWindowDimensions();
  const chartW = Math.max(0, winW - 2 * figma.screen.horizontal - 36);
  const label = ghost ? '••••••' : formatAmdFromMinor(balanceMinor);
  return (
    <GlassPanel style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.labelCol}>
          <Text style={styles.eyebrow}>{t.totalBalance}</Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={onToggleVisibility}
          style={({ pressed }) => [styles.eyeBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons
            color={figma.color.textMuted}
            name={ghost ? 'eye-off-outline' : 'eye-outline'}
            size={22}
          />
        </Pressable>
      </View>
      <Pressable style={({ pressed }) => [styles.amtBlock, pressed && { opacity: 0.96 }]}>
        <Text numberOfLines={1} style={styles.balanceAmount}>
          {label}
        </Text>
      </Pressable>
      <View style={styles.chartWrap}>
        {ghost ? null : (
          <SpendingSparkline days={14} transactions={transactions} width={chartW} />
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.footerRow}>
        <View style={styles.footCol}>
          <View style={styles.footLabelRow}>
            <View style={[styles.dot, { backgroundColor: figma.color.accentGold }]} />
            <Text style={styles.footLabel}>{translate(appLanguage, 'monaiq.in')}</Text>
          </View>
          <Text style={styles.footIn}>{formatAmdFromMinor(inflowMinor)}</Text>
        </View>
        <View style={styles.footV} />
        <View style={styles.footCol}>
          <View style={styles.footLabelRow}>
            <View style={[styles.dot, { backgroundColor: OUT }]} />
            <Text style={styles.footLabel}>{translate(appLanguage, 'monaiq.out')}</Text>
          </View>
          <Text style={styles.footOut}>{formatAmdFromMinor(outflowMinor)}</Text>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    ...figma.shadow.card
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  labelCol: { flex: 1 },
  eyebrow: {
    fontSize: figma.type.balanceLabel,
    fontWeight: '600',
    color: figma.color.textMuted,
    letterSpacing: 0.4
  },
  eyeBtn: { padding: 4 },
  amtBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  balanceAmount: {
    fontSize: figma.type.balance,
    fontWeight: '600',
    color: figma.color.text,
    letterSpacing: 0.2,
    flexShrink: 1
  },
  chartWrap: { marginTop: 12, marginBottom: 4, marginHorizontal: -4 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: figma.color.divider, marginVertical: 14 },
  footerRow: { flexDirection: 'row', alignItems: 'stretch' },
  footCol: { flex: 1, gap: 4 },
  footLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  footLabel: {
    fontSize: figma.type.caption,
    fontWeight: '600',
    color: figma.color.textMuted,
    letterSpacing: 0.2
  },
  footIn: { fontSize: 16, fontWeight: '600', color: figma.color.softGold, letterSpacing: 0.2 },
  footOut: { fontSize: 16, fontWeight: '600', color: figma.color.textSecondary, letterSpacing: 0.2 },
  footV: { width: StyleSheet.hairlineWidth, backgroundColor: figma.color.divider, marginHorizontal: 12 }
});
