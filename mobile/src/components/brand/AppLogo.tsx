import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';
import { figma } from '../../theme/figma';

const LOGO = require('../../../assets/app-logo.png');

type AppLogoProps = {
  size?: number;
  variant?: 'plain' | 'badge';
  style?: StyleProp<ViewStyle>;
};

export function AppLogo({ size = 56, variant = 'plain', style }: AppLogoProps) {
  const w = size;
  return (
    <View style={[variant === 'badge' && styles.badge, style]}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={LOGO}
        style={{ width: w, height: w }}
      />
    </View>
  );
}

export function AppLogoMark({ size = 44, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  const r = Math.min(28, size * 0.5);
  return (
    <View
      style={[
        styles.markBox,
        { width: size, height: size, borderRadius: r },
        style
      ]}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={LOGO}
        style={styles.markImg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: 4
  },
  markBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    ...figma.shadow.card
  },
  markImg: {
    width: '78%',
    height: '78%'
  }
});
