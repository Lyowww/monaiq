import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../../src/components/ui/GlassPanel';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useUiStore((s) => s.appLanguage);
  const t = (k: string) => translate(lang, k);

  return (
    <LinearGradient
      colors={['#F5F5F2', 'rgba(168, 182, 160, 0.2)', '#F5F5F2']}
      style={styles.gradient}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
        >
          <Ionicons color={figma.color.text} name="chevron-back" size={26} />
        </Pressable>
        <Text style={styles.title}>{t('notifications.title')}</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 28 }
        ]}
        showsVerticalScrollIndicator
      >
        <GlassPanel style={styles.emptyCard}>
          <Ionicons color={figma.color.accentGold} name="notifications-outline" size={36} />
          <Text style={styles.emptyTitle}>{t('notifications.emptyTitle')}</Text>
          <Text style={styles.emptySub}>{t('notifications.emptySub')}</Text>
        </GlassPanel>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: figma.screen.horizontal,
    marginBottom: 8,
    gap: 8
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.surfacePressed
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: figma.color.text,
    letterSpacing: 0.2
  },
  topSpacer: { width: 40 },
  body: {
    paddingHorizontal: figma.screen.horizontal,
    gap: 14
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: figma.color.text,
    textAlign: 'center'
  },
  emptySub: {
    fontSize: 14,
    color: figma.color.textMuted,
    textAlign: 'center',
    lineHeight: 20
  }
});
