import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function AuthPrimaryButton({ label, onPress, disabled, loading, style }: AuthPrimaryButtonProps) {
  const busy = disabled || loading;
  return (
    <Pressable
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        pressed && !busy && { opacity: 0.95, transform: [{ scale: 0.99 }] },
        busy && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onAccent} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: figma.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: figma.color.accentGold,
    ...figma.shadow.button
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    color: theme.colors.onAccent,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3
  }
});
