import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

type LiquidFlowCircleProps = {
  label: string;
  sublabel: string;
  balanceText: string;
  onPress: () => void;
  onLongPress: () => void;
};

const SIZE = 220;
const RING = 3;

export function LiquidFlowCircle({
  label,
  sublabel,
  balanceText,
  onPress,
  onLongPress
}: LiquidFlowCircleProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.04, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onLongPress={onLongPress}
          onPress={onPress}
          style={({ pressed }) => [pressed && { opacity: 0.92 }]}
        >
          <View style={styles.outerRing}>
            <BlurView intensity={theme.blur.glass} tint="light" style={styles.glassDisc}>
              <View style={styles.innerStroke}>
                <Text style={styles.eyebrow}>{label}</Text>
                  <Text style={styles.balance}>{balanceText}</Text>
                <Text style={styles.hint}>{sublabel}</Text>
              </View>
            </BlurView>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  outerRing: {
    width: SIZE,
    height: SIZE,
    borderRadius: theme.radius.full,
    padding: RING,
    backgroundColor: theme.colors.royalBlueMuted,
    borderWidth: 1,
    borderColor: theme.colors.innerGlow
  },
  glassDisc: {
    flex: 1,
    borderRadius: theme.radius.full,
    backgroundColor: figma.color.glassFill,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 182, 160, 0.5)'
  },
  innerStroke: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  eyebrow: {
    fontSize: 12,
    color: theme.colors.royalBlue,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase'
  },
  balance: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.textPrimary
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 180
  }
});
