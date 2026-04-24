import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';
import { translate } from '../../locales/i18n';
import type { AppLanguage } from '../../locales/i18n.types';

type HomeMoneyActionsRowProps = {
  appLanguage: AppLanguage;
  onAddIncome: () => void;
  onAddExpense: () => void;
};

/**
 * Obvious home CTAs: add money & add expense (FAB still available).
 */
export function HomeMoneyActionsRow({ appLanguage, onAddIncome, onAddExpense }: HomeMoneyActionsRowProps) {
  const hint = translate(appLanguage, 'dashboard.moneyActionsHint').trim();
  return (
    <View style={styles.wrap}>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={translate(appLanguage, 'quickAdd.income')}
          accessibilityRole="button"
          onPress={onAddIncome}
          style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] }]}
        >
          <Ionicons color={theme.colors.onAccent} name="trending-up" size={26} />
          <Text style={styles.btnPrimaryText}>{translate(appLanguage, 'dashboard.addMoneyCta')}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={translate(appLanguage, 'quickAdd.expense')}
          accessibilityRole="button"
          onPress={onAddExpense}
          style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        >
          <Ionicons color={figma.color.text} name="receipt-outline" size={24} />
          <Text style={styles.btnSecondaryText}>{translate(appLanguage, 'dashboard.addExpenseCta')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  hint: { fontSize: 13, color: figma.color.textMuted, lineHeight: 18, letterSpacing: 0.15 },
  row: { flexDirection: 'row', gap: 10 },
  btnPrimary: {
    flex: 1,
    minHeight: 52,
    borderRadius: figma.radius.card,
    backgroundColor: figma.color.accentGold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    ...figma.shadow.button
  },
  btnPrimaryText: { color: theme.colors.onAccent, fontWeight: '600', fontSize: 15, letterSpacing: 0.2 },
  btnSecondary: {
    flex: 1,
    minHeight: 52,
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12
  },
  btnSecondaryText: { color: figma.color.text, fontWeight: '600', fontSize: 15, letterSpacing: 0.2 }
});
