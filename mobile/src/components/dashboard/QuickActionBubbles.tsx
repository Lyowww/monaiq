import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/tokens';
import { GlassCard } from '../GlassCard';
import { AmountEntryModal } from './AmountEntryModal';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/i18n.types';
import { parseAmdToMinor } from '../../lib/format/currency';
import type { QuickCommandParsedResult } from '@ai-finance/shared-types';

const BUBBLES: Array<{
  id: string;
  label: string;
  category: string;
  merchant: string;
}> = [
  { id: 'kfc', label: 'KFC', category: 'food', merchant: 'KFC' },
  { id: 'yandex', label: 'Yandex', category: 'transport', merchant: 'Yandex' },
  { id: 'zovq', label: 'Zovq', category: 'groceries', merchant: 'Zovq' },
  { id: 'utility', label: 'Utility', category: 'utilities', merchant: 'Utility' }
];

type QuickActionBubblesProps = {
  lang: AppLanguage;
  isSubmitting: boolean;
  onCreate: (payload: {
    parsed: QuickCommandParsedResult;
    rawCommand: string;
  }) => Promise<void>;
};

export function QuickActionBubbles({ lang, isSubmitting, onCreate }: QuickActionBubblesProps) {
  const t = dashboardStrings(lang);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = BUBBLES.find((b) => b.id === activeId);

  const submitAmount = async (amountAmd: number): Promise<void> => {
    if (!active) {
      return;
    }
    const amountMinor = parseAmdToMinor(amountAmd);
    const rawCommand = `${active.merchant} ${amountAmd}`;
    const parsed: QuickCommandParsedResult = {
      merchantName: active.merchant,
      amountMinor,
      currencyCode: 'AMD',
      category: active.category,
      source: 'typed',
      direction: 'debit',
      confidence: 0.98
    };
    await onCreate({ parsed, rawCommand });
  };

  return (
    <View>
      <Text style={styles.heading}>{t.quickBubbles}</Text>
      <GlassCard>
        <View style={styles.row}>
          {BUBBLES.map((b) => (
            <Pressable
              disabled={isSubmitting}
              key={b.id}
              onPress={() => setActiveId(b.id)}
              style={({ pressed }) => [
                styles.bubble,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
            >
              <Text style={styles.bubbleText}>{b.label}</Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <AmountEntryModal
        cancelLabel={t.notNow}
        onClose={() => setActiveId(null)}
        onSubmit={submitAmount}
        primaryLabel={t.amountOk}
        title={active ? `${active.label} · AMD` : ''}
        visible={Boolean(active)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: theme.spacing.sm
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  bubble: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 999,
    backgroundColor: theme.colors.royalBlueMuted,
    borderWidth: 1,
    borderColor: theme.colors.innerGlow
  },
  bubbleText: {
    fontWeight: '800',
    color: theme.colors.royalBlue
  }
});
