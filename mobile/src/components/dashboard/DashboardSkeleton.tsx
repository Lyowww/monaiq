import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { figma } from '../../theme/figma';
import { useAppHeaderPaddingTop } from '../navigation/AppFixedHeader';

function SkBlock({ style }: { style?: object }) {
  const o = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(o, {
          toValue: 0.55,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(o, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );
    a.start();
    return () => a.stop();
  }, [o]);
  return (
    <Animated.View
      style={[styles.block, style, { opacity: o, backgroundColor: figma.color.bgElevated }]}
    />
  );
}

export function DashboardSkeleton() {
  const headerPad = useAppHeaderPaddingTop();
  return (
    <View style={[styles.root, { paddingTop: headerPad }]}>
      <View style={styles.grow}>
        <SkBlock style={styles.h1} />
        <SkBlock style={styles.h2} />
      </View>
      <SkBlock style={styles.big} />
      <SkBlock style={styles.card} />
      <SkBlock style={styles.cardTall} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: figma.color.bg, paddingHorizontal: figma.screen.horizontal, gap: 20 },
  grow: { gap: 8 },
  block: { borderRadius: 20, overflow: 'hidden' },
  h1: { height: 18, width: '70%', borderRadius: 10 },
  h2: { height: 14, width: '45%', borderRadius: 8 },
  big: { height: 64, width: '85%', borderRadius: 20 },
  card: { height: 100, width: '100%', borderRadius: 24 },
  cardTall: { height: 180, width: '100%', borderRadius: 24, flex: 1 }
});
