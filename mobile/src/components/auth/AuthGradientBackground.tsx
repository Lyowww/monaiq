import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { figma } from '../../theme/figma';

type AuthGradientBackgroundProps = {
  children: ReactNode;
};

export function AuthGradientBackground({ children }: AuthGradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[figma.color.bg, figma.color.bgElevated]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.fill}
    >
      <View style={styles.fill}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
