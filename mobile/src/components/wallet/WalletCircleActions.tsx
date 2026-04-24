import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';

type ActionKey = 'transfer' | 'topup' | 'withdraw' | 'more';

const BG: Record<ActionKey, string> = {
  transfer: figma.color.actionTransfer,
  topup: figma.color.actionTopUp,
  withdraw: figma.color.actionWithdraw,
  more: figma.color.actionMore
};

const IC: Record<ActionKey, { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  transfer: { name: 'swap-vertical', color: figma.actionIcon.transfer },
  topup: { name: 'wallet', color: figma.actionIcon.topUp },
  withdraw: { name: 'cash', color: figma.actionIcon.withdraw },
  more: { name: 'dots-horizontal', color: figma.actionIcon.more }
};

type WalletCircleActionsProps = {
  appLanguage: AppLanguage;
  onTransfer: () => void;
  onTopUp: () => void;
  onWithdraw: () => void;
  onMore: () => void;
};

export function WalletCircleActions({
  appLanguage,
  onTransfer,
  onTopUp,
  onWithdraw,
  onMore
}: WalletCircleActionsProps) {
  const t = dashboardStrings(appLanguage);
  const items: Array<{
    key: ActionKey;
    label: string;
    onPress: () => void;
  }> = [
    { key: 'transfer', label: t.actionTransfer, onPress: onTransfer },
    { key: 'topup', label: t.actionTopUp, onPress: onTopUp },
    { key: 'withdraw', label: t.actionWithdraw, onPress: onWithdraw },
    { key: 'more', label: t.actionMore, onPress: onMore }
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => {
        const ic = IC[item.key];
        return (
          <Pressable
            accessibilityRole="button"
            key={item.key}
            onPress={item.onPress}
            style={({ pressed }) => [styles.col, pressed && { opacity: 0.9 }]}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: BG[item.key] }
              ]}
            >
              <MaterialCommunityIcons color={ic.color} name={ic.name} size={26} />
            </View>
            <Text numberOfLines={1} style={styles.label}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  col: { width: '22%', minWidth: 68, alignItems: 'center', gap: 8 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: figma.color.glassStroke
  },
  label: { fontSize: 11, fontWeight: '600', color: figma.color.text, textAlign: 'center' }
});
