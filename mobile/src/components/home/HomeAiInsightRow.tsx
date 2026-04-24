import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
type HomeAiInsightRowProps = {
  headline: string;
  detail: string;
  onPress: () => void;
};

export function HomeAiInsightRow({ headline, detail, onPress }: HomeAiInsightRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.95, transform: [{ scale: 0.995 }] }]}
    >
      <View style={styles.inner}>
        <View style={styles.left}>
          <Text numberOfLines={2} style={styles.title}>
            {headline}
          </Text>
          <Text numberOfLines={2} style={styles.body}>
            {detail}
          </Text>
        </View>
        <View style={styles.rightCol}>
          <View style={styles.aiCircle}>
            <Ionicons color={figma.color.accentGold} name="sparkles" size={30} />
          </View>
          <Ionicons color={figma.color.textMuted} name="chevron-forward" size={20} style={styles.chev} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: figma.radius.card, overflow: 'hidden' },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: figma.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.bgElevated,
    minHeight: 88,
    ...figma.shadow.card
  },
  left: { flex: 1, minWidth: 0, gap: 6 },
  title: { fontSize: 16, fontWeight: '600', color: figma.color.text, letterSpacing: 0.2 },
  body: { fontSize: 12, color: figma.color.textSecondary, lineHeight: 18, marginTop: 0, letterSpacing: 0.12 },
  rightCol: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  aiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212, 175, 55, 0.25)'
  },
  chev: { marginTop: 0 }
});
