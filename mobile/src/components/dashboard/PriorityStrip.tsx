import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/tokens';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { GlassCard } from '../GlassCard';
import type { AppLanguage } from '../../locales/i18n.types';
import { dashboardStrings } from '../../locales/dashboard.strings';

export type PriorityItem = {
  id: string;
  kind: 'loan' | 'utility';
  label: string;
  amountMinor: number;
  dueInDays: number;
};

type PriorityStripProps = {
  items: PriorityItem[];
  lang: AppLanguage;
  titleOverride?: string;
};

export function PriorityStrip({ items, lang, titleOverride }: PriorityStripProps) {
  const t = dashboardStrings(lang);

  return (
    <View style={styles.wrap}>
      {titleOverride ? (
        <Text style={styles.heading}>{titleOverride}</Text>
      ) : (
        <Text style={styles.heading}>{t.priorityStrip}</Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {items.map((item) => (
          <GlassCard key={item.id} style={styles.chip}>
            <View style={styles.chipRow}>
              <View
                style={[
                  styles.pill,
                  item.kind === 'loan' ? styles.pillLoan : styles.pillUtil
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    item.kind === 'utility' ? styles.pillTextUtility : null
                  ]}
                >
                  {item.kind === 'loan' ? t.loanChip : t.utilityChip}
                </Text>
              </View>
              <View>
                <Text style={styles.chipLabel}>{item.label}</Text>
                <Text style={styles.chipSub}>
                  {formatAmdFromMinor(item.amountMinor)} · {t.dueIn(item.dueInDays)}
                </Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  heading: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: theme.spacing.xs
  },
  scroll: { flexGrow: 0 },
  chip: { marginRight: theme.spacing.md, minWidth: 220 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  pillLoan: { backgroundColor: theme.colors.royalBlueMuted },
  pillUtil: { backgroundColor: theme.colors.primaryEmeraldMuted },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.royalBlue
  },
  pillTextUtility: {
    color: theme.colors.primaryEmerald
  },
  chipLabel: { fontWeight: '800', color: theme.colors.textPrimary },
  chipSub: { marginTop: 2, color: theme.colors.textSecondary, fontSize: 13 }
});
