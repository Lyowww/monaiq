import { StyleSheet, Text, View, Pressable } from 'react-native';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';
import { formatAmdFromMinor } from '../../lib/format/currency';

type WalletBalanceBlockProps = {
  balanceMinor: number;
  ghost: boolean;
  appLanguage: AppLanguage;
  onLongPress: () => void;
};

function Squiggle() {
  return (
    <View style={squiggleStyles.wrap}>
      <View style={squiggleStyles.line} />
    </View>
  );
}

const squiggleStyles = StyleSheet.create({
  wrap: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  line: {
    width: 36,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(168, 182, 160, 0.4)',
    transform: [{ rotate: '-7deg' }]
  }
});

export function WalletBalanceBlock({ balanceMinor, ghost, appLanguage, onLongPress }: WalletBalanceBlockProps) {
  const t = dashboardStrings(appLanguage);
  const label = ghost ? '••••••' : formatAmdFromMinor(balanceMinor);

  return (
    <View style={styles.block}>
      <Text style={styles.eyebrow}>{t.totalBalance}</Text>
      <View style={styles.row}>
        <Pressable
          delayLongPress={450}
          onLongPress={onLongPress}
          style={({ pressed }) => [styles.balanceRow, pressed && { opacity: 0.92 }]}
        >
          <Text numberOfLines={1} style={styles.balance}>
            {label}
          </Text>
        </Pressable>
        <View style={styles.squiggle}>
          <Squiggle />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 6 },
  eyebrow: { fontSize: 13, fontWeight: '600', color: figma.color.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  balanceRow: { flex: 1, minWidth: 0 },
  balance: { fontSize: 30, fontWeight: '800', color: figma.color.text },
  squiggle: { opacity: 0.9 }
});
