import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { figma } from '../theme/figma';
import { theme } from '../theme/tokens';

interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted card — blur on iOS, high-opacity overlay keeps type crisp;
 * Android uses solid fill + elevation. Shadow lives on the outer shell (no overflow clip).
 */
export function GlassCard({ children, style }: GlassCardProps) {
  const f = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const hasFlex = f.flex != null;
  const shellLayout: ViewStyle = hasFlex
    ? {
        flex: f.flex,
        minWidth: f.minWidth,
        minHeight: f.minHeight,
        alignSelf: f.alignSelf,
        maxWidth: f.maxWidth
      }
    : {};
  const innerStyle: ViewStyle = { ...f };
  if (hasFlex) {
    delete innerStyle.flex;
    delete innerStyle.minWidth;
    delete innerStyle.minHeight;
    delete innerStyle.alignSelf;
    delete innerStyle.maxWidth;
  }

  const grow = hasFlex && f.flex !== 0;

  return (
    <View style={[styles.shadowShell, shellLayout]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={theme.blur.glass}
          tint="light"
          style={[styles.face, grow && { flex: 1 }]}
        >
          <View pointerEvents="none" style={styles.tint} />
          <View style={[styles.content, innerStyle]}>{children}</View>
        </BlurView>
      ) : (
        <View style={[styles.androidFace, grow && { flex: 1 }]}>
          <View style={[styles.content, innerStyle]}>{children}</View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowShell: {
    borderRadius: theme.radius.xl,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    ...figma.shadow.card,
    ...Platform.select({
      android: { elevation: 5 },
      default: {}
    })
  },
  face: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke,
    backgroundColor: 'rgba(245, 245, 242, 0.35)'
  },
  androidFace: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: figma.color.glassOnBlur
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: theme.spacing.lg
  }
});
