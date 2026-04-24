import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../../src/components/ui/GlassPanel';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate, translateList } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';

export default function AssistantTryAskingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useUiStore((s) => s.appLanguage);
  const setMoneyFocus = useUiStore((s) => s.setMoneyFocus);
  const t = (path: string) => translate(lang, path);
  const commonQuestions = translateList(lang, 'assistant.questions');

  const onPick = (q: string) => {
    if (/\bsave\b/i.test(q) && /\b(money|more|month)\b/i.test(q)) {
      setMoneyFocus('save');
    }
    router.push({
      pathname: '/assistant-chat',
      params: { autoSend: q }
    });
  };

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
          {t('assistant.tryAskingScreenTitle')}
        </Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <Text style={[styles.hint, { marginHorizontal: figma.screen.horizontal }]}>{t('assistant.modalHint')}</Text>

      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24, paddingHorizontal: figma.screen.horizontal }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {commonQuestions.map((q, i) => (
          <Pressable
            key={`q-${i}`}
            onPress={() => onPick(q)}
            style={({ pressed }) => [pressed && { opacity: 0.92 }]}
          >
            <GlassPanel style={styles.row}>
              <Text style={styles.rowText}>{q}</Text>
              <Ionicons color={figma.color.accentGold} name="chevron-forward" size={20} />
            </GlassPanel>
          </Pressable>
        ))}
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
  hint: {
    fontSize: 12,
    color: figma.color.textMuted,
    marginBottom: 10,
    lineHeight: 16
  },
  list: { gap: 10, paddingTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14
  },
  rowText: { flex: 1, fontSize: 15, color: figma.color.text, lineHeight: 22, fontWeight: '500' }
});
