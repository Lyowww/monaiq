import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { QuickCommandParsedResult } from '@ai-finance/shared-types';
import { useUiStore } from '../features/ui/store/useUiStore';
import { translate } from '../locales/i18n';
import { parseQuickActionCommand } from '../lib/parsers/quickAction';
import { figma } from '../theme/figma';
import { theme } from '../theme/tokens';
import { GlassCard } from './GlassCard';

interface QuickActionBarProps {
  isSubmitting?: boolean;
  onCreate: (payload: {
    parsed: QuickCommandParsedResult;
    rawCommand: string;
  }) => Promise<void>;
}

/**
 * Text-only quick commands (e.g. "kfc 3500") — no microphone.
 */
export function QuickActionBar({ isSubmitting = false, onCreate }: QuickActionBarProps) {
  const lang = useUiStore((s) => s.appLanguage);
  const t = (key: string, params?: Record<string, string | number>) => translate(lang, key, params);
  const [command, setCommand] = useState('');

  const submit = async (): Promise<void> => {
    const parsed = parseQuickActionCommand(command, 'typed');
    if (!parsed) {
      Alert.alert(t('quickAction.invalidTitle'), t('quickAction.invalidBody'));
      return;
    }

    await onCreate({
      parsed,
      rawCommand: command
    });

    setCommand('');
  };

  return (
    <GlassCard>
      <Text style={styles.title}>{t('quickAction.title')}</Text>
      <Text style={styles.subtitle}>{t('quickAction.subtitle')}</Text>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setCommand}
        placeholder={t('quickAction.placeholder')}
        placeholderTextColor={figma.color.textMuted}
        style={styles.input}
        value={command}
      />

      <Pressable
        disabled={isSubmitting}
        onPress={submit}
        style={({ pressed }) => [styles.submit, pressed && !isSubmitting && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
      >
        <Text style={styles.submitLabel}>
          {isSubmitting ? t('quickAction.saving') : t('quickAction.createExpense')}
        </Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: figma.color.text,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2
  },
  subtitle: {
    color: figma.color.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
    fontSize: 14
  },
  input: {
    minHeight: 52,
    borderRadius: figma.radius.activityRow,
    backgroundColor: 'rgba(168, 182, 160, 0.2)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    color: figma.color.text,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16
  },
  submit: {
    marginTop: theme.spacing.md,
    minHeight: 50,
    borderRadius: theme.radius.lg,
    backgroundColor: figma.color.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    ...figma.shadow.button
  },
  submitLabel: {
    color: theme.colors.onAccent,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3
  }
});
