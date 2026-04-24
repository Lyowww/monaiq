import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../../src/components/ui/GlassPanel';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';

export default function AssistantSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useUiStore((s) => s.appLanguage);
  const moneyFocus = useUiStore((s) => s.moneyFocus);
  const setMoneyFocus = useUiStore((s) => s.setMoneyFocus);
  const t = (path: string) => translate(lang, path);

  return (
    <LinearGradient colors={['#F5F5F2', 'rgba(168, 182, 160, 0.2)', '#F5F5F2']} style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons color={figma.color.text} name="chevron-back" size={26} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {t('assistant.settingsScreenTitle')}
        </Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24, paddingHorizontal: figma.screen.horizontal }
        ]}
      >
        <Text style={styles.sectionLead}>{t('assistant.settingsScreenLead')}</Text>

        <GlassPanel style={styles.focusCard}>
          <Text style={styles.focusTitle}>{t('assistant.focusTitle')}</Text>
          <View style={styles.focusRow}>
            <Pressable
              onPress={() => setMoneyFocus('save')}
              style={({ pressed }) => [
                styles.focusChip,
                moneyFocus === 'save' && styles.focusChipOn,
                pressed && { opacity: 0.92 }
              ]}
            >
              <Text style={[styles.focusChipText, moneyFocus === 'save' && styles.focusChipTextOn]}>
                {t('assistant.focusSave')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMoneyFocus(null)}
              style={({ pressed }) => [styles.focusChip, styles.focusChipGhost, pressed && { opacity: 0.88 }]}
            >
              <Text style={styles.focusChipTextMuted}>{t('assistant.focusClear')}</Text>
            </Pressable>
          </View>
          {moneyFocus === 'save' ? <Text style={styles.focusHint}>{t('assistant.focusSavedHint')}</Text> : null}
        </GlassPanel>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: figma.screen.horizontal,
    paddingBottom: 10,
    gap: 8
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 182, 160, 0.15)'
  },
  iconBtnPlaceholder: { width: 40, height: 40 },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: figma.color.text,
    letterSpacing: 0.2
  },
  scroll: { paddingTop: 8, gap: 16 },
  sectionLead: {
    fontSize: 13,
    color: figma.color.textSecondary,
    lineHeight: 20,
    letterSpacing: 0.1
  },
  focusCard: { padding: 14, gap: 10 },
  focusTitle: { fontSize: 13, fontWeight: '600', color: figma.color.textMuted, letterSpacing: 0.2 },
  focusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  focusChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    backgroundColor: figma.color.surfacePressed
  },
  focusChipGhost: {
    backgroundColor: 'transparent'
  },
  focusChipOn: {
    borderColor: figma.color.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.14)'
  },
  focusChipText: { fontSize: 14, fontWeight: '600', color: figma.color.text },
  focusChipTextOn: { color: figma.color.primaryDeep },
  focusChipTextMuted: { fontSize: 14, fontWeight: '600', color: figma.color.textMuted },
  focusHint: { fontSize: 12, color: figma.color.textSecondary, lineHeight: 17 }
});
