import { ActivityIndicator, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';
import { PressableScale } from './PressableScale';

type MonButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function MonButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style
}: MonButtonProps) {
  const busy = disabled || loading;
  if (variant === 'secondary') {
    return (
      <PressableScale
        disabled={busy}
        onPress={onPress}
        style={[styles.secOuter, busy && styles.disabled, style]}
      >
        {loading ? (
          <ActivityIndicator color={figma.color.textMuted} size="small" />
        ) : (
          <Text style={styles.secLabel}>{label}</Text>
        )}
      </PressableScale>
    );
  }
  return (
    <PressableScale disabled={busy} onPress={onPress} style={[styles.primaryOuter, style]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.onAccent} size="small" />
      ) : (
        <Text style={styles.primaryLabel}>{label}</Text>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  primaryOuter: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: figma.color.accentGold,
    borderRadius: figma.radius.card,
    ...figma.shadow.button
  },
  primaryLabel: {
    color: theme.colors.onAccent,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.35
  },
  secOuter: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(168, 182, 160, 0.5)',
    backgroundColor: 'transparent'
  },
  secLabel: {
    color: figma.color.neutralLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3
  },
  disabled: { opacity: 0.45 }
});
