import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFxBankRatesQuery } from '../../src/features/fx/hooks/useFxBankRatesQuery';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

function fmt2(n: number): string {
  if (!Number.isFinite(n)) {
    return '—';
  }
  return n < 5 ? n.toFixed(4) : n.toFixed(2);
}

export default function ExchangeRatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lang = useUiStore((s) => s.appLanguage);
  const q = useFxBankRatesQuery();

  const rows = useMemo(() => (q.data?.rates ?? []).filter((r) => r.code !== 'AMD'), [q.data]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingHorizontal: figma.screen.horizontal }]}>
        <ScreenHeader
          leftAction="back"
          onLeftPress={() => router.back()}
          title={translate(lang, 'exchangeRates.title')}
        />
      </View>

      {q.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={figma.color.accentGold} />
        </View>
      ) : q.isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>{translate(lang, 'exchangeRates.error')}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.body,
            { paddingBottom: insets.bottom + 28, paddingHorizontal: figma.screen.horizontal }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sub}>{translate(lang, 'exchangeRates.subtitle')}</Text>
          <Text style={styles.asOf}>
            {translate(lang, 'exchangeRates.asOf', { date: (q.data?.asOf ?? '').replace('T', ' ').slice(0, 19) || '—' })}
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.thc]}>{translate(lang, 'exchangeRates.colCurrency')}</Text>
            <Text style={[styles.th, styles.tr]}>{translate(lang, 'exchangeRates.colBuy')}</Text>
            <Text style={[styles.th, styles.tr]}>{translate(lang, 'exchangeRates.colSell')}</Text>
            <Text style={[styles.th, styles.tr]}>{translate(lang, 'exchangeRates.colMid')}</Text>
          </View>

          {rows.map((r) => (
            <View key={r.code} style={styles.row}>
              <Text style={styles.td}>{r.code}</Text>
              <Text style={[styles.tdNum, r.buyAmd == null && styles.mutedN]}>
                {r.buyAmd != null ? fmt2(r.buyAmd) : '—'}
              </Text>
              <Text style={[styles.tdNum, r.sellAmd == null && styles.mutedN]}>
                {r.sellAmd != null ? fmt2(r.sellAmd) : '—'}
              </Text>
              <Text style={styles.tdNum}>{fmt2(r.midAmdPerUnit)}</Text>
            </View>
          ))}

          <Text style={styles.footnote}>{translate(lang, 'exchangeRates.jpyNote')}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: figma.color.bg },
  header: { marginBottom: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { gap: 12 },
  sub: { color: figma.color.textSecondary, fontSize: 15, lineHeight: 22 },
  asOf: { color: figma.color.textMuted, fontSize: 12 },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    paddingBottom: 8,
    marginTop: 4
  },
  th: { fontWeight: '700', color: figma.color.text, fontSize: 12, letterSpacing: 0.2 },
  thc: { flex: 1.1 },
  tr: { flex: 1, textAlign: 'right' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  td: { flex: 1.1, fontWeight: '600', color: figma.color.text, fontSize: 15 },
  tdNum: { flex: 1, textAlign: 'right', color: figma.color.text, fontSize: 14, fontVariant: ['tabular-nums'] },
  mutedN: { color: figma.color.textMuted },
  footnote: { fontSize: 12, color: figma.color.textMuted, lineHeight: 18, marginTop: 6 },
  muted: { color: figma.color.textMuted, padding: 20 }
});
