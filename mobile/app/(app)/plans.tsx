import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FinancePlanRecord } from '@ai-finance/shared-types';
import { GlassPanel } from '../../src/components/ui/GlassPanel';
import { useSubscriptionPaywall } from '../../src/features/subscription/SubscriptionPaywallProvider';
import { SUBSCRIPTION_FEATURE } from '../../src/features/subscription/subscriptionFeatureIds';
import { useEntitlements } from '../../src/features/subscription/hooks/useEntitlements';
import { plansApi } from '../../src/features/plans/api/plansApi';
import { formatAmdFromMinor, parseAmdToMinor } from '../../src/lib/format/currency';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PlanType = FinancePlanRecord['planType'];

export default function PlansScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useUiStore((s) => s.appLanguage);
  const t = (path: string, params?: Record<string, string | number>) => translate(lang, path, params);
  const queryClient = useQueryClient();
  const { hasFeature } = useEntitlements();
  const paywall = useSubscriptionPaywall();

  const plansQuery = useQuery({
    queryKey: ['plans', 'active'],
    queryFn: () => plansApi.list('active')
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [planType, setPlanType] = useState<PlanType>('monthly_spend_cap');
  const [title, setTitle] = useState('');
  const [amountAmd, setAmountAmd] = useState('');
  const [category, setCategory] = useState('');
  const [savedAmd, setSavedAmd] = useState('');
  const [notes, setNotes] = useState('');

  const createMutation = useMutation({
    mutationFn: () => {
      const cap = parseAmdToMinor(Number(amountAmd.replace(/,/g, '')) || 0);
      const saved = parseAmdToMinor(Number(savedAmd.replace(/,/g, '')) || 0);
      if (planType === 'savings_target') {
        return plansApi.create({
          title: title.trim(),
          planType,
          targetMinor: cap,
          savedMinor: saved,
          notes: notes.trim() || undefined
        });
      }
      if (planType === 'category_spend_cap') {
        return plansApi.create({
          title: title.trim(),
          planType,
          capMinor: cap,
          category: category.trim(),
          notes: notes.trim() || undefined
        });
      }
      return plansApi.create({
        title: title.trim(),
        planType: 'monthly_spend_cap',
        capMinor: cap,
        notes: notes.trim() || undefined
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      setModalOpen(false);
      resetForm();
    }
  });

  const resetForm = useCallback(() => {
    setTitle('');
    setAmountAmd('');
    setCategory('');
    setSavedAmd('');
    setNotes('');
    setPlanType('monthly_spend_cap');
  }, []);

  const archiveMutation = useMutation({
    mutationFn: (id: string) => plansApi.update(id, { status: 'archived' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
    }
  });

  const planLabel = useMemo(
    () =>
      ({
        monthly_spend_cap: translate(lang, 'plans.typeMonthly'),
        category_spend_cap: translate(lang, 'plans.typeCategory'),
        savings_target: translate(lang, 'plans.typeSavings')
      }) as Record<PlanType, string>,
    [lang]
  );

  const onArchive = (p: FinancePlanRecord) => {
    Alert.alert(p.title, t('plans.archiveConfirm'), [
      { text: t('common.close'), style: 'cancel' },
      {
        text: t('plans.archive'),
        style: 'destructive',
        onPress: () => void archiveMutation.mutateAsync(p.id)
      }
    ]);
  };

  const onDelete = (p: FinancePlanRecord) => {
    Alert.alert(p.title, t('plans.deleteConfirm'), [
      { text: t('common.close'), style: 'cancel' },
      {
        text: t('plans.delete'),
        style: 'destructive',
        onPress: () => void deleteMutation.mutateAsync(p.id)
      }
    ]);
  };

  const openCreate = () => {
    if (!hasFeature(SUBSCRIPTION_FEATURE.CUSTOM_CATEGORIES)) {
      paywall.open({ featureId: SUBSCRIPTION_FEATURE.CUSTOM_CATEGORIES });
      return;
    }
    resetForm();
    setModalOpen(true);
  };

  return (
    <LinearGradient
      colors={['#F5F5F2', 'rgba(168, 182, 160, 0.2)', '#F5F5F2']}
      style={styles.gradient}
    >
      <View style={[styles.safeTop, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
          >
            <Ionicons color={figma.color.text} name="chevron-back" size={26} />
          </Pressable>
          <View style={styles.topTitles}>
            <Text style={styles.screenTitle}>{t('plans.title')}</Text>
            <Text style={styles.screenSub}>{t('plans.subtitle')}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={openCreate}
            style={({ pressed }) => [styles.addPill, pressed && { opacity: 0.9 }]}
          >
            <Ionicons color="#1A1F2B" name="add" size={22} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.listPad,
            { paddingBottom: insets.bottom + 32 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {plansQuery.isPending ? (
            <ActivityIndicator color={figma.color.accentGold} style={{ marginTop: 24 }} />
          ) : null}
          {!plansQuery.isPending && (plansQuery.data?.length ?? 0) === 0 ? (
            <GlassPanel style={styles.emptyCard}>
              <Ionicons color={figma.color.accentGold} name="sparkles-outline" size={32} />
              <Text style={styles.emptyTitle}>{t('plans.empty')}</Text>
            </GlassPanel>
          ) : null}
          {(plansQuery.data ?? []).map((p) => (
            <GlassPanel key={p.id} style={styles.planCard}>
              <View style={styles.planTop}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{planLabel[p.planType]}</Text>
                </View>
                <View style={styles.planActions}>
                  <Pressable
                    hitSlop={8}
                    onPress={() => onArchive(p)}
                    style={({ pressed }) => [styles.miniAct, pressed && { opacity: 0.75 }]}
                  >
                    <Ionicons color={figma.color.textMuted} name="archive-outline" size={20} />
                  </Pressable>
                  <Pressable
                    hitSlop={8}
                    onPress={() => onDelete(p)}
                    style={({ pressed }) => [styles.miniAct, pressed && { opacity: 0.75 }]}
                  >
                    <Ionicons color="rgba(26, 31, 43, 0.7)" name="trash-outline" size={20} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.planTitle}>{p.title}</Text>
              {p.planType === 'savings_target' ? (
                <Text style={styles.planAmt}>
                  {formatAmdFromMinor(p.savedMinor ?? 0)} / {formatAmdFromMinor(p.targetMinor ?? 0)}
                </Text>
              ) : (
                <Text style={styles.planAmt}>
                  {t('plans.capLine', {
                    amt: formatAmdFromMinor(p.capMinor ?? 0)
                  })}
                </Text>
              )}
              {p.category ? (
                <Text style={styles.planMeta}>
                  {t('plans.categoryLine', { cat: p.category })}
                </Text>
              ) : null}
              {p.notes ? <Text style={styles.planNotes}>{p.notes}</Text> : null}
            </GlassPanel>
          ))}
        </ScrollView>
      </View>

      <Modal animationType="fade" transparent visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalOpen(false)} />
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
          <GlassPanel style={styles.modalGlass}>
            <Text style={styles.modalH}>{t('plans.add')}</Text>
            <Text style={styles.modalHint}>{t('plans.pickerHint')}</Text>
            <View style={styles.typeRow}>
              {(['monthly_spend_cap', 'category_spend_cap', 'savings_target'] as const).map((pt) => (
                <Pressable
                  key={pt}
                  onPress={() => setPlanType(pt)}
                  style={[
                    styles.typeChip,
                    planType === pt && styles.typeChipOn
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      planType === pt && styles.typeChipTextOn
                    ]}
                  >
                    {planLabel[pt]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLbl}>{t('plans.titleLabel')}</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder={t('plans.placeholderTitle')}
              placeholderTextColor={figma.color.textMuted}
              style={styles.input}
              value={title}
            />
            {planType === 'category_spend_cap' ? (
              <>
                <Text style={styles.fieldLbl}>{t('plans.categoryLabel')}</Text>
                <TextInput
                  onChangeText={setCategory}
                  placeholder={t('plans.placeholderCategory')}
                  placeholderTextColor={figma.color.textMuted}
                  style={styles.input}
                  value={category}
                />
              </>
            ) : null}
            <Text style={styles.fieldLbl}>
              {planType === 'savings_target' ? t('plans.targetLabel') : t('plans.amountLabel')}
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setAmountAmd}
              placeholder="0"
              placeholderTextColor={figma.color.textMuted}
              style={styles.input}
              value={amountAmd}
            />
            {planType === 'savings_target' ? (
              <>
                <Text style={styles.fieldLbl}>{t('plans.savedLabel')}</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={setSavedAmd}
                  placeholder="0"
                  placeholderTextColor={figma.color.textMuted}
                  style={styles.input}
                  value={savedAmd}
                />
              </>
            ) : null}
            <Text style={styles.fieldLbl}>{t('plans.notesLabel')}</Text>
            <TextInput
              multiline
              numberOfLines={3}
              onChangeText={setNotes}
              placeholder="—"
              placeholderTextColor={figma.color.textMuted}
              style={[styles.input, styles.inputMulti]}
              value={notes}
            />
            <Pressable
              disabled={createMutation.isPending}
              onPress={() => void createMutation.mutateAsync()}
              style={({ pressed }) => [
                styles.saveBtn,
                (pressed || createMutation.isPending) && { opacity: 0.9 }
              ]}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#1A1F2B" />
              ) : (
                <Text style={styles.saveBtnText}>{t('plans.save')}</Text>
              )}
            </Pressable>
            <Pressable onPress={() => setModalOpen(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{t('common.close')}</Text>
            </Pressable>
          </GlassPanel>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeTop: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: figma.screen.horizontal,
    marginBottom: 14,
    gap: 8
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.surfacePressed
  },
  topTitles: { flex: 1, minWidth: 0 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: figma.color.text,
    letterSpacing: 0.3
  },
  screenSub: {
    fontSize: 12,
    color: figma.color.textMuted,
    marginTop: 2,
    lineHeight: 16
  },
  addPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: figma.color.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    ...figma.shadow.button
  },
  listPad: {
    paddingHorizontal: figma.screen.horizontal,
    gap: 14
  },
  emptyCard: {
    padding: 28,
    alignItems: 'center',
    gap: 12
  },
  emptyTitle: {
    color: figma.color.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15
  },
  planCard: {
    padding: 18
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.15)'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: figma.color.softGold,
    letterSpacing: 0.6,
    textTransform: 'uppercase'
  },
  planActions: { flexDirection: 'row', gap: 4 },
  miniAct: { padding: 6 },
  planTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: figma.color.text,
    marginBottom: 6
  },
  planAmt: {
    fontSize: 20,
    fontWeight: '700',
    color: figma.color.accentGold,
    letterSpacing: 0.2
  },
  planMeta: {
    marginTop: 6,
    fontSize: 13,
    color: figma.color.textMuted
  },
  planNotes: {
    marginTop: 10,
    fontSize: 13,
    color: figma.color.textSecondary,
    lineHeight: 18
  },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: figma.color.overlay
  },
  modalSheet: {
    paddingHorizontal: 16
  },
  modalGlass: {
    padding: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22
  },
  modalH: {
    fontSize: 20,
    fontWeight: '700',
    color: figma.color.text,
    marginBottom: 6
  },
  modalHint: {
    fontSize: 13,
    color: figma.color.textMuted,
    marginBottom: 14,
    lineHeight: 18
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: figma.color.surfacePressed,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke
  },
  typeChipOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.12)'
  },
  typeChipText: { fontSize: 12, color: figma.color.textMuted, fontWeight: '600' },
  typeChipTextOn: { color: figma.color.accentGold },
  fieldLbl: {
    fontSize: 12,
    fontWeight: '600',
    color: figma.color.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: figma.color.text,
    marginBottom: 14,
    backgroundColor: 'rgba(168, 182, 160, 0.12)'
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: figma.color.accentGold,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    ...figma.shadow.button
  },
  saveBtnText: {
    color: figma.color.onAccent,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3
  },
  cancelBtn: { paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { color: figma.color.textMuted, fontWeight: '600' }
});
