import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/tokens';
import { GlassCard } from '../GlassCard';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';
import { formatAmdFromMinor } from '../../lib/format/currency';

type NextBill = {
  amountMinor: number;
  title: string;
  dueInDays: number;
};

type IncomeInsightModalProps = {
  visible: boolean;
  lang: AppLanguage;
  incomeMinor: number;
  nextBill: NextBill | null;
  onDismiss: () => void;
  onPlan: () => void;
};

export function IncomeInsightModal({
  visible,
  lang,
  incomeMinor,
  nextBill,
  onDismiss,
  onPlan
}: IncomeInsightModalProps) {
  const t = dashboardStrings(lang);
  const insets = useSafeAreaInsets();
  const income = formatAmdFromMinor(incomeMinor);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={[styles.backdrop, { paddingBottom: insets.bottom + 8 }]}>
        <GlassCard style={styles.sheet}>
          <Text style={styles.title}>{t.incomeTitle}</Text>
          {nextBill ? (
            <Text style={styles.body}>
              {t.incomeBodyWithBill(
                income,
                nextBill.title,
                formatAmdFromMinor(nextBill.amountMinor),
                nextBill.dueInDays
              )}
            </Text>
          ) : (
            <Text style={styles.body}>{t.incomeBodySimple(income)}</Text>
          )}
          <View style={styles.row}>
            <Pressable onPress={onDismiss} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.ghostText}>{t.notNow}</Text>
            </Pressable>
            <Pressable onPress={onPlan} style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.primaryText}>{t.payPlan}</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(168, 182, 160, 0.2)'
  },
  sheet: { marginBottom: theme.spacing.lg, gap: theme.spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary },
  body: { color: theme.colors.textSecondary, lineHeight: 22, fontSize: 15 },
  row: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  btn: { flex: 1, minHeight: 48, borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { borderWidth: 1, borderColor: 'rgba(168, 182, 160, 0.4)' },
  btnPrimary: { backgroundColor: theme.colors.royalBlue },
  ghostText: { fontWeight: '700', color: theme.colors.textSecondary },
  primaryText: { fontWeight: '800', color: theme.colors.onAccent }
});
