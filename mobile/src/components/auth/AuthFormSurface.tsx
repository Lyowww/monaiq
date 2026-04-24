import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

type AuthFormSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AuthFormSurface({ children, style }: AuthFormSurfaceProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    overflow: 'hidden',
    backgroundColor: figma.color.bgElevated,
    ...figma.shadow.card
  },
  inner: {
    padding: theme.spacing.lg
  }
});
