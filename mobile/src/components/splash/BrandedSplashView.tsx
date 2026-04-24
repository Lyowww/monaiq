import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthBrandMark } from '../auth/AuthBrandMark';
import { AuthGradientBackground } from '../auth/AuthGradientBackground';
import { figma } from '../../theme/figma';

type BrandedSplashViewProps = {
  tagline: string;
};

export function BrandedSplashView({ tagline }: BrandedSplashViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <AuthGradientBackground>
      <View style={[styles.body, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 }]}>
        <AuthBrandMark size={80} />
        <Text style={styles.title}>MonAIQ</Text>
        <Text style={styles.tagline}>{tagline}</Text>
        <View style={styles.spinner}>
          <ActivityIndicator color={figma.color.primary} size="large" />
        </View>
      </View>
    </AuthGradientBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: figma.screen.horizontal
  },
  title: {
    color: figma.color.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 20,
    textAlign: 'center'
  },
  tagline: {
    color: figma.color.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 300,
    textAlign: 'center'
  },
  spinner: {
    marginTop: 48
  }
});
