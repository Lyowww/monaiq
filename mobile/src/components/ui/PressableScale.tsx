import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../../theme/tokens';

type PressableScaleProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

const DURATION = theme.motion.fast;

/**
 * Subtle press feedback (0.97) — short ease-out, no bouncy motion.
 */
export function PressableScale({ children, style, scaleTo = 0.97, disabled, ...rest }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        if (disabled) {
          return;
        }
        Animated.timing(scale, {
          toValue: scaleTo,
          duration: DURATION,
          useNativeDriver: true
        }).start();
      }}
      onPressOut={() => {
        Animated.timing(scale, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true
        }).start();
      }}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
