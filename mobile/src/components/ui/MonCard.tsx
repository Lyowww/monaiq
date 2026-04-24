import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { figma } from '../../theme/figma';

type MonCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/** Elevated light surface, soft radius, hairline or no border. */
export function MonCard({ children, style, padded = true }: MonCardProps) {
  return <View style={[styles.root, padded && styles.pad, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: figma.color.bgElevated,
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    ...figma.shadow.card
  },
  pad: { padding: figma.screen.cardPadding }
});
