import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassPanel } from '../../src/components/ui/GlassPanel';
import { financeChatApi } from '../../src/features/ai/api/financeChatApi';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { getAssistantChatErrorText } from '../../src/lib/ai/assistantChatErrorText';
import { translate } from '../../src/locales/i18n';
import { figma } from '../../src/theme/figma';

const COMPOSER_CONTROL_HEIGHT = 48;

type Msg = { role: 'user' | 'assistant'; text: string };

export default function AssistantChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ conversationId?: string; autoSend?: string }>();
  const paramConversationId = typeof params.conversationId === 'string' ? params.conversationId : undefined;
  const autoSendRaw = typeof params.autoSend === 'string' ? params.autoSend : undefined;

  const lang = useUiStore((s) => s.appLanguage);
  const setMoneyFocus = useUiStore((s) => s.setMoneyFocus);
  const t = (path: string, paramsArg?: Record<string, string | number>) => translate(lang, path, paramsArg);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(paramConversationId ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const autoSentRef = useRef(false);
  const loadKeyRef = useRef<string | null>(null);

  const chat = useMutation({
    mutationFn: (args: { text: string; convId?: string | null }) =>
      financeChatApi.sendMessage(args.text, lang, args.convId ?? undefined)
  });

  useEffect(() => {
    if (!paramConversationId) {
      setConversationId(null);
      setMessages([]);
      setLoadError(null);
      loadKeyRef.current = null;
      return;
    }
    if (loadKeyRef.current === paramConversationId) {
      return;
    }
    loadKeyRef.current = paramConversationId;
    let cancelled = false;
    setLoadError(null);
    void (async () => {
      try {
        const data = await financeChatApi.getConversation(paramConversationId);
        if (cancelled) {
          return;
        }
        setConversationId(data.id);
        setMessages(data.messages.map((m) => ({ role: m.role, text: m.content })));
      } catch {
        if (!cancelled) {
          setLoadError(translate(lang, 'assistant.historyLoadError'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paramConversationId, lang]);

  const send = useCallback(
    async (text: string, convOverride?: string | null) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      const convForRequest = convOverride !== undefined ? convOverride : conversationId;
      setMessages((m) => [...m, { role: 'user', text: trimmed }]);
      setInput('');
      try {
        const { reply, conversationId: nextId } = await chat.mutateAsync({
          text: trimmed,
          convId: convForRequest
        });
        setConversationId(nextId);
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
        void queryClient.invalidateQueries({ queryKey: ['ai-finance-conversations'] });
      } catch (err) {
        setMessages((m) => [...m, { role: 'assistant', text: getAssistantChatErrorText(lang, err) }]);
      }
    },
    [chat, conversationId, lang, queryClient]
  );

  useEffect(() => {
    if (!autoSendRaw || autoSentRef.current || paramConversationId) {
      return;
    }
    if (/\bsave\b/i.test(autoSendRaw) && /\b(money|more|month)\b/i.test(autoSendRaw)) {
      setMoneyFocus('save');
    }
    autoSentRef.current = true;
    void send(autoSendRaw, null);
  }, [autoSendRaw, paramConversationId, send, setMoneyFocus]);

  const onNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setConversationId(null);
    setLoadError(null);
    loadKeyRef.current = null;
    chat.reset();
    router.setParams({ conversationId: undefined, autoSend: undefined });
  }, [chat, router]);

  const bottomPad = Math.max(insets.bottom, 12) + 12;

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
          {t('assistant.title')}
        </Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={onNewChat}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons color={figma.color.accentGold} name="create-outline" size={22} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
        keyboardVerticalOffset={Platform.select({ ios: 8, default: 0 })}
      >
        {loadError ? <Text style={styles.loadErr}>{loadError}</Text> : null}
        <ScrollView
          style={styles.chat}
          contentContainerStyle={[
            styles.bubbleList,
            {
              paddingHorizontal: figma.screen.horizontal,
              paddingTop: 8,
              paddingBottom: 12
            }
          ]}
        >
          {messages.length === 0 && !chat.isPending ? (
            <Text style={styles.empty}>{t('assistant.emptyChat')}</Text>
          ) : null}
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <View key={`${i}-${m.role}-${m.text.slice(0, 12)}`} style={[styles.bubble, styles.bubbleUser]}>
                <Text style={styles.bubbleTextUser}>{m.text}</Text>
              </View>
            ) : (
              <GlassPanel key={`${i}-${m.role}-${m.text.slice(0, 12)}`} style={styles.bubbleGlass}>
                <Text style={styles.bubbleTextAssistant}>{m.text}</Text>
              </GlassPanel>
            )
          )}
          {chat.isPending ? (
            <View style={styles.loading}>
              <ActivityIndicator color={figma.color.accentGold} />
              <Text style={styles.muted}>…</Text>
            </View>
          ) : null}
        </ScrollView>

        <GlassPanel
          style={[
            styles.inputRowGlass,
            {
              marginHorizontal: figma.screen.horizontal,
              marginBottom: bottomPad,
              marginTop: 4
            }
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              editable={!chat.isPending}
              multiline
              onChangeText={setInput}
              placeholder={t('assistant.inputPlaceholder')}
              placeholderTextColor={figma.color.textMuted}
              style={styles.input}
              value={input}
            />
            <Pressable
              onPress={() => void send(input)}
              style={({ pressed }) => [styles.send, pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] }]}
              disabled={chat.isPending}
            >
              <Text style={styles.sendText}>{t('common.send')}</Text>
            </Pressable>
          </View>
        </GlassPanel>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
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
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: figma.color.text,
    letterSpacing: 0.2
  },
  loadErr: {
    marginHorizontal: figma.screen.horizontal,
    marginBottom: 8,
    color: figma.color.textSecondary,
    fontSize: 13
  },
  chat: { flex: 1 },
  bubbleList: { gap: 10 },
  empty: { color: figma.color.textMuted, lineHeight: 20, fontSize: 13 },
  bubble: { maxWidth: '92%', padding: 12, borderRadius: 16 },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(212, 175, 55, 0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212, 175, 55, 0.35)'
  },
  bubbleGlass: { alignSelf: 'flex-start', maxWidth: '92%', padding: 12 },
  bubbleTextUser: { color: figma.color.text, lineHeight: 22, fontSize: 15 },
  bubbleTextAssistant: { color: figma.color.textSecondary, lineHeight: 22, fontSize: 15 },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  muted: { color: figma.color.textMuted },
  inputRowGlass: { paddingHorizontal: 10, paddingVertical: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: COMPOSER_CONTROL_HEIGHT,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.glassStroke,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: figma.color.text,
    backgroundColor: 'rgba(168, 182, 160, 0.12)'
  },
  send: {
    minHeight: COMPOSER_CONTROL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: figma.color.accentGold,
    ...figma.shadow.button
  },
  sendText: { color: figma.color.onAccent, fontWeight: '600', letterSpacing: 0.3 }
});
