import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { figma } from '../../theme/figma';

type GlassPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

/**
 * Frosted glass surface — iOS uses native blur; Android falls back to opaque fill.
 * Semi-opaque fill keeps text and charts readable over the blur.
 */
export function GlassPanel({ children, style, intensity = 44 }: GlassPanelProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} style={[styles.blur, style]} tint="light">
        {children}
      </BlurView>
    );
  }
  return <View style={[styles.androidFallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke,
    backgroundColor: figma.color.glassOnBlur
  },
  androidFallback: {
    overflow: 'hidden',
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke,
    backgroundColor: figma.color.glassFill
  }
});
