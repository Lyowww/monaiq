import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MoneyPocket } from '@ai-finance/shared-types';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { translate } from '../../locales/i18n';
import { theme } from '../../theme/tokens';
import { figma } from '../../theme/figma';

type AmountEntryModalProps = {
  visible: boolean;
  title: string;
  primaryLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onSubmit: (amountAmd: number, pocket: MoneyPocket) => void;
  /** Show card vs cash — income and quick expense should set this. */
  showPocket?: boolean;
  pocketLabel?: string;
};

export function AmountEntryModal({
  visible,
  title,
  primaryLabel,
  cancelLabel,
  onClose,
  onSubmit,
  showPocket = true,
  pocketLabel
}: AmountEntryModalProps) {
  const insets = useSafeAreaInsets();
  const lang = useUiStore((s) => s.appLanguage);
  const [raw, setRaw] = useState('');
  const [pocket, setPocket] = useState<MoneyPocket>('card');
  const pocketHelp = pocketLabel ?? translate(lang, 'pocket.helpDefault');
  const onCard = translate(lang, 'pocket.onCard');
  const cashLabel = translate(lang, 'pocket.cash');
  const amountPh = translate(lang, 'amountEntry.amountPlaceholder');

  const confirm = (): void => {
    const normalized = raw.replace(',', '.').trim();
    const value = Number(normalized);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    onSubmit(value, showPocket ? pocket : 'card');
    setRaw('');
    setPocket('card');
    onClose();
  };

  const handleClose = (): void => {
    setRaw('');
    setPocket('card');
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, { paddingBottom: insets.bottom + 12 }]}
      >
        <Pressable onPress={handleClose} style={StyleSheet.absoluteFillObject} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {showPocket ? (
            <View style={styles.pocketBlock}>
              <Text style={styles.pocketHelp}>{pocketHelp}</Text>
              <View style={styles.pocketRow}>
                <Pressable
                  onPress={() => setPocket('card')}
                  style={({ pressed }) => [
                    styles.pocketChip,
                    pocket === 'card' && styles.pocketChipOn,
                    pressed && { opacity: 0.9 }
                  ]}
                >
                  <Text
                    style={[styles.pocketChipText, pocket === 'card' && styles.pocketChipTextOn]}
                  >
                    {onCard}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPocket('cash')}
                  style={({ pressed }) => [
                    styles.pocketChip,
                    pocket === 'cash' && styles.pocketChipOn,
                    pressed && { opacity: 0.9 }
                  ]}
                >
                  <Text
                    style={[styles.pocketChipText, pocket === 'cash' && styles.pocketChipTextOn]}
                  >
                    {cashLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={setRaw}
            placeholder={amountPh}
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.input}
            value={raw}
          />
          <View style={styles.row}>
            <Pressable onPress={handleClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable onPress={confirm} style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryLabel}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: figma.color.overlay
  },
  sheet: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    gap: theme.spacing.md,
    ...figma.shadow.card
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary
  },
  pocketBlock: { gap: 8 },
  pocketHelp: { fontSize: 13, color: figma.color.textMuted, lineHeight: 18 },
  pocketRow: { flexDirection: 'row', gap: 10 },
  pocketChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    alignItems: 'center',
    backgroundColor: figma.color.bg
  },
  pocketChipOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  pocketChipText: { fontWeight: '600', color: figma.color.textMuted, fontSize: 14 },
  pocketChipTextOn: { color: figma.color.accentGold },
  input: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    paddingHorizontal: theme.spacing.md,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    backgroundColor: figma.color.bg
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm
  },
  btn: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnGhost: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  btnGhostLabel: {
    fontWeight: '700',
    color: theme.colors.textSecondary
  },
  btnPrimary: {
    backgroundColor: figma.color.accentGold
  },
  btnPrimaryLabel: {
    fontWeight: '600',
    color: theme.colors.onAccent
  }
});
