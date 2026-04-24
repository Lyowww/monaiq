import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'style'>;

export function AuthTextField({ label, secureTextEntry, ...rest }: AuthTextFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={figma.color.textLabel}
          secureTextEntry={isPassword && !show}
          style={styles.input}
          {...rest}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setShow((v) => !v)}
            style={styles.eye}
          >
            <Ionicons
              color={figma.color.textMuted}
              name={show ? 'eye-off-outline' : 'eye-outline'}
              size={22}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: theme.spacing.md
  },
  label: {
    color: figma.color.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(168, 182, 160, 0.12)',
    borderColor: figma.color.divider,
    borderRadius: figma.radius.activityRow,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 52
  },
  input: {
    color: figma.color.text,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  eye: {
    paddingRight: 12
  }
});
