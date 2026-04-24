import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppHeaderPaddingTop } from '../../../src/components/navigation/AppFixedHeader';
import { GlassPanel } from '../../../src/components/ui/GlassPanel';
import { financeChatApi } from '../../../src/features/ai/api/financeChatApi';
import { useUiStore } from '../../../src/features/ui/store/useUiStore';
import { translate } from '../../../src/locales/i18n';
import { figma } from '../../../src/theme/figma';

function formatChatDate(iso: string, lang: 'en' | 'hy'): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'hy' ? 'hy-AM' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '';
  }
}

export default function AssistantTab() {
  const headerPad = useAppHeaderPaddingTop();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const lang = useUiStore((s) => s.appLanguage);
  const t = (path: string) => translate(lang, path);

  const { data: conversations = [], isFetching } = useQuery({
    queryKey: ['ai-finance-conversations'],
    queryFn: () => financeChatApi.listConversations()
  });

  return (
    <LinearGradient
      colors={['#F5F5F2', 'rgba(168, 182, 160, 0.2)', '#F5F5F2']}
      style={[styles.root, { paddingTop: headerPad }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: figma.screen.horizontal,
            paddingBottom: tabBarHeight + 28
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{t('assistant.hubKicker')}</Text>
        <Text style={styles.headline}>{t('assistant.title')}</Text>

        <Pressable
          onPress={() => router.push('/assistant-chat')}
          style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.94, transform: [{ scale: 0.99 }] }]}
        >
          <GlassPanel style={styles.primaryCtaInner}>
            <View style={styles.primaryIconWrap}>
              <Ionicons color={figma.color.accentGold} name="chatbubbles-outline" size={26} />
            </View>
            <View style={styles.primaryTextCol}>
              <Text style={styles.primaryTitle}>{t('assistant.openFullChat')}</Text>
              <Text style={styles.primarySub}>{t('assistant.openFullChatSub')}</Text>
            </View>
            <Ionicons color={figma.color.accentGold} name="chevron-forward" size={22} />
          </GlassPanel>
        </Pressable>

        <Text style={styles.sectionLabel}>{t('assistant.shortcutsSection')}</Text>

        <View style={styles.shortcuts}>
          <Pressable
            onPress={() => router.push('/(app)/(tabs)/stats' as Href)}
            style={({ pressed }) => [styles.shortcutHalf, pressed && { opacity: 0.92 }]}
          >
            <GlassPanel style={styles.shortcutCard}>
              <View style={styles.shortcutIcon}>
                <Ionicons color={figma.color.accentGold} name="bar-chart-outline" size={22} />
              </View>
              <Text style={styles.shortcutTitle}>{t('assistant.analyticsTileTitle')}</Text>
              <Text style={styles.shortcutSub}>{t('assistant.analyticsTileSub')}</Text>
            </GlassPanel>
          </Pressable>

          <Pressable
            onPress={() => router.push('/plans')}
            style={({ pressed }) => [styles.shortcutHalf, pressed && { opacity: 0.92 }]}
          >
            <GlassPanel style={styles.shortcutCard}>
              <View style={styles.shortcutIcon}>
                <Ionicons color={figma.color.accentGold} name="flag-outline" size={22} />
              </View>
              <Text style={styles.shortcutTitle}>{t('assistant.planCtaTitle')}</Text>
              <Text style={styles.shortcutSub}>{t('assistant.planCtaSub')}</Text>
            </GlassPanel>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/assistant-try-asking')}
          style={({ pressed }) => [styles.fullWidthTile, pressed && { opacity: 0.92 }]}
        >
          <GlassPanel style={styles.rowTile}>
            <View style={styles.rowIcon}>
              <Ionicons color={figma.color.accentGold} name="bulb-outline" size={22} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('assistant.tryAskingTileTitle')}</Text>
              <Text style={styles.rowSub}>{t('assistant.tryAskingTileSub')}</Text>
            </View>
            <Ionicons color={figma.color.accentGold} name="chevron-forward" size={20} />
          </GlassPanel>
        </Pressable>

        <Pressable
          onPress={() => router.push('/assistant-settings')}
          style={({ pressed }) => [styles.fullWidthTile, pressed && { opacity: 0.92 }]}
        >
          <GlassPanel style={styles.rowTile}>
            <View style={styles.rowIcon}>
              <Ionicons color={figma.color.accentGold} name="settings-outline" size={22} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('assistant.settingsTileTitle')}</Text>
              <Text style={styles.rowSub}>{t('assistant.settingsTileSub')}</Text>
            </View>
            <Ionicons color={figma.color.accentGold} name="chevron-forward" size={20} />
          </GlassPanel>
        </Pressable>

        <View style={styles.historyHeader}>
          <Text style={styles.sectionLabel}>{t('assistant.recentChats')}</Text>
          {isFetching ? <Text style={styles.syncing}>…</Text> : null}
        </View>

        {conversations.length === 0 ? (
          <Text style={styles.emptyHistory}>{t('assistant.noChatsYet')}</Text>
        ) : (
          <View style={styles.historyList}>
            {conversations.map((c) => (
              <Pressable
                key={c.id}
                onPress={() =>
                  router.push({
                    pathname: '/assistant-chat',
                    params: { conversationId: c.id }
                  })
                }
                style={({ pressed }) => [pressed && { opacity: 0.92 }]}
              >
                <GlassPanel style={styles.historyRow}>
                  <View style={styles.historyIcon}>
                    <Ionicons color={figma.color.textMuted} name="chatbox-ellipses-outline" size={20} />
                  </View>
                  <View style={styles.historyTextCol}>
                    <Text numberOfLines={2} style={styles.historyTitle}>
                      {c.title}
                    </Text>
                    <Text style={styles.historyMeta}>{formatChatDate(c.updatedAt, lang)}</Text>
                  </View>
                  <Ionicons color={figma.color.accentGold} name="chevron-forward" size={18} />
                </GlassPanel>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 4, gap: 12 },
  kicker: {
    fontSize: 12,
    color: figma.color.textMuted,
    letterSpacing: 0.2,
    marginBottom: 2
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: figma.color.text,
    letterSpacing: 0.2,
    marginBottom: 8
  },
  primaryCta: { marginTop: 4 },
  primaryCtaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 14
  },
  primaryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.14)'
  },
  primaryTextCol: { flex: 1, minWidth: 0 },
  primaryTitle: { fontSize: 17, fontWeight: '700', color: figma.color.text, letterSpacing: 0.2 },
  primarySub: { fontSize: 12, color: figma.color.textMuted, marginTop: 4, lineHeight: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: figma.color.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 8
  },
  shortcuts: { flexDirection: 'row', gap: 10 },
  shortcutHalf: { flex: 1, minWidth: 0 },
  shortcutCard: {
    padding: 12,
    gap: 8,
    minHeight: 112,
    ...figma.shadow.card
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)'
  },
  shortcutTitle: { fontSize: 14, fontWeight: '700', color: figma.color.text },
  shortcutSub: { fontSize: 11, color: figma.color.textMuted, lineHeight: 15 },
  fullWidthTile: { marginTop: 0 },
  rowTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.12)'
  },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: figma.color.text, letterSpacing: 0.2 },
  rowSub: { fontSize: 12, color: figma.color.textMuted, marginTop: 2, lineHeight: 16 },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  syncing: { fontSize: 14, color: figma.color.textMuted },
  emptyHistory: {
    fontSize: 13,
    color: figma.color.textSecondary,
    lineHeight: 20,
    marginTop: 4
  },
  historyList: { gap: 8 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.surfacePressed
  },
  historyTextCol: { flex: 1, minWidth: 0 },
  historyTitle: { fontSize: 14, fontWeight: '600', color: figma.color.text, lineHeight: 20 },
  historyMeta: { fontSize: 11, color: figma.color.textMuted, marginTop: 2 }
});
