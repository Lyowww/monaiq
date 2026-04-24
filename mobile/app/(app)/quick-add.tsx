import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MoneyPocket } from '@ai-finance/shared-types';
import { useFxBankRatesQuery } from '../../src/features/fx/hooks/useFxBankRatesQuery';
import { transactionsApi } from '../../src/features/transactions/api/transactionsApi';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { formatAmdFromMinor, parseAmdToMinor } from '../../src/lib/format/currency';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

const CAT_IDS = [
  'food',
  'transport',
  'groceries',
  'utilities',
  'entertainment',
  'health',
  'general'
] as const;

const CAT_ICON: Record<(typeof CAT_IDS)[number], keyof typeof MaterialCommunityIcons.glyphMap> = {
  food: 'food',
  transport: 'car',
  groceries: 'cart',
  utilities: 'flash',
  entertainment: 'gamepad-variant',
  health: 'medical-bag',
  general: 'label'
};

type Kind = 'expense' | 'income';

const SELECT_CODES = [
  'AMD',
  'USD',
  'EUR',
  'GBP',
  'RUB',
  'CHF',
  'JPY',
  'AED',
  'CNY'
] as const;

function toAmdMajor(
  inputRaw: string,
  code: (typeof SELECT_CODES)[number],
  midByCode: Map<string, number>
): number | null {
  const n = Number(inputRaw.replace(',', '.').trim());
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  if (code === 'AMD') {
    return n;
  }
  const m = midByCode.get(code);
  if (m == null || !Number.isFinite(m) || m <= 0) {
    return null;
  }
  return n * m;
}

export default function QuickAddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lang = useUiStore((s) => s.appLanguage);
  const params = useLocalSearchParams<{ mode?: string }>();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<Kind>(params.mode === 'income' ? 'income' : 'expense');
  const [category, setCategory] = useState<(typeof CAT_IDS)[number]>('food');
  const [rawAmount, setRawAmount] = useState('');
  const [pocket, setPocket] = useState<MoneyPocket>('card');
  const [currencyCode, setCurrencyCode] = useState<(typeof SELECT_CODES)[number]>('AMD');
  const fxQ = useFxBankRatesQuery();

  const midByCode = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of fxQ.data?.rates ?? []) {
      m.set(r.code, r.midAmdPerUnit);
    }
    return m;
  }, [fxQ.data?.rates]);

  useEffect(() => {
    if (params.mode === 'income' || params.mode === 'expense') {
      setKind(params.mode);
    }
  }, [params.mode]);

  const save = useMutation({
    mutationFn: async () => {
      const amdMajor = toAmdMajor(rawAmount, currencyCode, midByCode);
      if (amdMajor == null) {
        throw new Error('amount');
      }
      const amountMinor = parseAmdToMinor(amdMajor);
      const n = Number(rawAmount.replace(',', '.').trim());
      const curS = currencyCode;
      if (kind === 'income') {
        await transactionsApi.createTransaction({
          source: 'manual',
          category: 'income',
          direction: 'credit',
          amountMinor,
          currencyCode: 'AMD',
          bookedAt: new Date().toISOString(),
          merchantName: 'Income',
          quickCommandRaw:
            curS === 'AMD' ? `income ${n}` : `income ${n} ${curS} → ≈${amdMajor.toFixed(2)} AMD`,
          pocket
        });
      } else {
        const label = translate(lang, `quickAdd.cats.${category}`);
        await transactionsApi.createTransaction({
          source: 'manual',
          category,
          direction: 'debit',
          amountMinor,
          currencyCode: 'AMD',
          bookedAt: new Date().toISOString(),
          merchantName: label,
          quickCommandRaw:
            curS === 'AMD'
              ? `quick ${category} ${n}`
              : `quick ${category} ${n} ${curS} → ≈${amdMajor.toFixed(2)} AMD`,
          pocket
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] });
      router.back();
    }
  });

  const previewAmdMajor = useMemo(
    () => toAmdMajor(rawAmount, currencyCode, midByCode),
    [rawAmount, currencyCode, midByCode]
  );

  const canSubmit = useMemo(() => {
    if (fxQ.isLoading && currencyCode !== 'AMD') {
      return false;
    }
    if (fxQ.isError && currencyCode !== 'AMD') {
      return false;
    }
    return previewAmdMajor != null && previewAmdMajor > 0;
  }, [fxQ.isError, fxQ.isLoading, currencyCode, previewAmdMajor]);

  return (
    <View style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 8, paddingHorizontal: figma.screen.horizontal }
          ]}
        >
          <ScreenHeader
            leftAction="back"
            onLeftPress={() => router.back()}
            title={translate(lang, 'quickAdd.title')}
          />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.body,
            { paddingBottom: insets.bottom + 24, paddingHorizontal: figma.screen.horizontal }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.kindRow}>
            <Pressable
              onPress={() => setKind('expense')}
              style={({ pressed }) => [
                styles.kindBtn,
                kind === 'expense' && styles.kindOn,
                pressed && { opacity: 0.92 }
              ]}
            >
              <Text style={[styles.kindText, kind === 'expense' && styles.kindTextOn]}>
                {translate(lang, 'quickAdd.expense')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setKind('income')}
              style={({ pressed }) => [
                styles.kindBtn,
                kind === 'income' && styles.kindOn,
                pressed && { opacity: 0.92 }
              ]}
            >
              <Text style={[styles.kindText, kind === 'income' && styles.kindTextOn]}>
                {translate(lang, 'quickAdd.income')}
              </Text>
            </Pressable>
          </View>
          {/* <Text style={styles.hint}>{translate(lang, 'quickAdd.hint')}</Text> */}

          <Text style={styles.label}>{translate(lang, 'quickAdd.currency')}</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipRow}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
          >
            {SELECT_CODES.map((c) => {
              const on = currencyCode === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCurrencyCode(c)}
                  style={({ pressed }) => [
                    styles.chip,
                    on && styles.chipOn,
                    pressed && { opacity: 0.9 }
                  ]}
                >
                  <Text style={[styles.chipT, on && styles.chipTOn]}>{c}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {fxQ.isError && currencyCode !== 'AMD' ? (
            <Text style={styles.warn}>{translate(lang, 'quickAdd.ratesError')}</Text>
          ) : null}

          {kind === 'expense' ? (
            <>
              <Text style={styles.label}>{translate(lang, 'quickAdd.category')}</Text>
              <View style={styles.catGrid}>
                {CAT_IDS.map((id) => {
                  const on = category === id;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => setCategory(id)}
                      style={({ pressed }) => [
                        styles.catCell,
                        on && styles.catOn,
                        pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] }
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={on ? figma.color.accentGold : figma.color.textMuted}
                        name={CAT_ICON[id]}
                        size={24}
                      />
                      <Text numberOfLines={2} style={[styles.catLbl, on && styles.catLblOn]}>
                        {translate(lang, `quickAdd.cats.${id}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <Text style={styles.label}>
            {translate(lang, 'amountEntry.amountPlaceholder')} ({currencyCode})
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={setRawAmount}
            placeholder="0"
            placeholderTextColor={figma.color.textMuted}
            style={styles.input}
            value={rawAmount}
          />
          {currencyCode !== 'AMD' && previewAmdMajor != null ? (
            <Text style={styles.approx}>
              {translate(lang, 'quickAdd.approxAmd', {
                value: formatAmdFromMinor(parseAmdToMinor(previewAmdMajor))
              })}
            </Text>
          ) : null}

          <Text style={styles.label}>{translate(lang, 'pocket.helpDefault')}</Text>
          <View style={styles.pocketRow}>
            <Pressable
              onPress={() => setPocket('card')}
              style={({ pressed }) => [
                styles.pocket,
                pocket === 'card' && styles.pocketOn,
                pressed && { opacity: 0.9 }
              ]}
            >
              <Text style={[styles.pocketT, pocket === 'card' && styles.pocketTOn]}>
                {translate(lang, 'pocket.onCard')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPocket('cash')}
              style={({ pressed }) => [
                styles.pocket,
                pocket === 'cash' && styles.pocketOn,
                pressed && { opacity: 0.9 }
              ]}
            >
              <Text style={[styles.pocketT, pocket === 'cash' && styles.pocketTOn]}>
                {translate(lang, 'pocket.cash')}
              </Text>
            </Pressable>
          </View>

          <Pressable
            disabled={!canSubmit || save.isPending}
            onPress={() => {
              if (canSubmit) {
                void save.mutateAsync();
              }
            }}
            style={({ pressed }) => [
              styles.save,
              (!canSubmit || save.isPending) && { opacity: 0.45 },
              pressed && canSubmit && !save.isPending && { opacity: 0.92, transform: [{ scale: 0.99 }] }
            ]}
          >
            <Text style={styles.saveT}>
              {save.isPending
                ? translate(lang, 'quickAdd.saving')
                : translate(lang, 'quickAdd.save')}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: figma.color.bg },
  header: {
    marginBottom: 12
  },
  body: { gap: 14 },
  chipRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated
  },
  chipOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  chipT: { fontWeight: '600', color: figma.color.textMuted, fontSize: 13 },
  chipTOn: { color: figma.color.accentGold },
  approx: { color: figma.color.textSecondary, fontSize: 14, fontWeight: '500' },
  warn: { color: '#B45309', fontSize: 13 },
  kindRow: { flexDirection: 'row', gap: 10 },
  kindBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    alignItems: 'center'
  },
  kindOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  kindText: { fontWeight: '600', color: figma.color.textMuted, letterSpacing: 0.2 },
  kindTextOn: { color: figma.color.accentGold },
  hint: { color: figma.color.textMuted, fontSize: 13, lineHeight: 18 },
  label: { fontWeight: '600', color: figma.color.text, fontSize: 14, letterSpacing: 0.2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCell: {
    width: '30%',
    minWidth: 100,
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6
  },
  catOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    ...figma.shadow.card
  },
  catLbl: { fontSize: 11, fontWeight: '600', color: figma.color.textSecondary, textAlign: 'center' },
  catLblOn: { color: figma.color.accentGold },
  input: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    color: figma.color.text,
    backgroundColor: figma.color.bgElevated,
    letterSpacing: 0.3
  },
  pocketRow: { flexDirection: 'row', gap: 10 },
  pocket: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    alignItems: 'center',
    backgroundColor: figma.color.bgElevated
  },
  pocketOn: { borderColor: figma.color.accentGold, backgroundColor: 'rgba(212, 175, 55, 0.08)' },
  pocketT: { fontWeight: '600', color: figma.color.textMuted },
  pocketTOn: { color: figma.color.accentGold },
  save: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: figma.color.accentGold,
    ...figma.shadow.button
  },
  saveT: { color: figma.color.onAccent, fontWeight: '600', fontSize: 17, letterSpacing: 0.3 }
});
