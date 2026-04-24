import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '../../../src/components/GlassCard';
import { useAppHeaderPaddingTop } from '../../../src/components/navigation/AppFixedHeader';
import { useAuthStore } from '../../../src/features/auth/store/useAuthStore';
import { useUiStore } from '../../../src/features/ui/store/useUiStore';
import { useSubscriptionPaywall } from '../../../src/features/subscription/SubscriptionPaywallProvider';
import { usersApi } from '../../../src/features/users/api/usersApi';
import { dashboardStrings } from '../../../src/locales/dashboard.strings';
import { figma } from '../../../src/theme/figma';
import { theme } from '../../../src/theme/tokens';
import { translate } from '../../../src/locales/i18n';

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const headerPad = useAppHeaderPaddingTop();
  const router = useRouter();
  const [remindersOn, setRemindersOn] = useState(true);
  const session = useAuthStore((s) => s.session);
  const clearSession = useAuthStore((s) => s.clearSession);
  const appLanguage = useUiStore((s) => s.appLanguage);
  const toggleAppLanguage = useUiStore((s) => s.toggleAppLanguage);
  const t = dashboardStrings(appLanguage);
  const me = useQuery({ queryKey: ['users', 'me'], queryFn: () => usersApi.me() });
  const paywall = useSubscriptionPaywall();

  return (
    <LinearGradient colors={[figma.color.bg, figma.color.bgAlt]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerPad + 8, paddingBottom: 100 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.name}>
          {session?.user.firstName} {session?.user.lastName}
        </Text>
        <Text style={styles.email}>{session?.user.email}</Text>

        <GlassCard>
          <Pressable onPress={toggleAppLanguage} style={styles.rowBtn}>
            <Text style={styles.rowLabel}>{t.menuLanguage} (EN / հայ)</Text>
            <Text style={styles.rowVal}>{appLanguage === 'en' ? 'EN' : 'ՀՅ'}</Text>
          </Pressable>
        </GlassCard>
        <GlassCard>
          <Text style={styles.rowLabel}>{t.profileSubscription}</Text>
          <Text style={styles.subtle}>
            {me.data?.settings?.subscriptionPlanKey
              ? `${translate(appLanguage, 'subscription.currentPaid')}: ${me.data.settings.subscriptionPlanKey}`
              : me.data?.settings?.subscription === 'premium'
                ? t.profilePremium
                : translate(appLanguage, 'subscription.currentFree')}
          </Text>
          <Pressable
            onPress={() => paywall.open()}
            style={({ pressed }) => [styles.upgradeRow, pressed && { opacity: 0.9 }]}
          >
            <Ionicons color={figma.color.accentGold} name="diamond-outline" size={20} />
            <Text style={styles.upgradeRowText}>
              {me.data?.settings?.subscriptionPlanKey
                ? translate(appLanguage, 'subscription.manage')
                : translate(appLanguage, 'subscription.upgrade')}
            </Text>
            <Ionicons color={figma.color.textMuted} name="chevron-forward" size={18} />
          </Pressable>
        </GlassCard>
        <GlassCard>
          <Text style={styles.rowLabel}>{t.profileNotifications}</Text>
          <Text style={styles.subtle}>
            {me.isLoading
              ? t.profileLoading
              : me.data?.settings
                ? t.profileNotifLine(
                    me.data.settings.notificationPayments ? t.commonOn : t.commonOff,
                    me.data.settings.notificationLowBalance ? t.commonOn : t.commonOff
                  )
                : t.profileDefaults}
          </Text>
        </GlassCard>
        <GlassCard>
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.rowLabel}>{translate(appLanguage, 'profile.pushReminders')}</Text>
              {translate(appLanguage, 'profile.pushRemindersHint').trim() ? (
                <Text style={styles.subtleSmall}>{translate(appLanguage, 'profile.pushRemindersHint')}</Text>
              ) : null}
            </View>
            <Switch
              ios_backgroundColor="rgba(168, 182, 160, 0.2)"
              onValueChange={setRemindersOn}
              thumbColor="#F5F5F2"
              trackColor={{ false: 'rgba(168, 182, 160, 0.25)', true: figma.color.primary }}
              value={remindersOn}
            />
          </View>
        </GlassCard>
        <GlassCard>
          <Text style={styles.rowLabel}>{translate(appLanguage, 'profile.currency')}</Text>
          <Text style={styles.currencyVal}>
            {(() => {
              const h = translate(appLanguage, 'profile.currencyHint').trim();
              return h ? `AMD — ${h}` : 'AMD';
            })()}
          </Text>
        </GlassCard>
        <Pressable
          onPress={() => router.push('/assistant')}
          style={({ pressed }) => [styles.fabRow, pressed && { opacity: 0.9 }]}
        >
          <Ionicons color={figma.color.primary} name="chatbubble-ellipses-outline" size={22} />
          <Text style={styles.fabRowText}>{t.profileOpenAi}</Text>
        </Pressable>
        <View style={styles.legal}>
          <Text style={styles.legalH}>{t.profileLegal}</Text>
          <Text
            onPress={() => void Linking.openURL('https://example.com/tos')}
            style={styles.link}
          >
            {t.profileTerms}
          </Text>
          <Text
            onPress={() => void Linking.openURL('https://example.com/privacy')}
            style={styles.link}
          >
            {t.profilePrivacy}
          </Text>
        </View>

        <Pressable
          onPress={() => void clearSession()}
          style={({ pressed }) => [styles.out, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.outText}>{t.signOut}</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: figma.screen.horizontal, gap: theme.spacing.lg },
  name: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 4, textAlign: 'center' },
  email: { color: theme.colors.textSecondary, marginTop: 4, textAlign: 'center' },
  subtle: { color: theme.colors.textSecondary, marginTop: 8, lineHeight: 20 },
  upgradeRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 4
  },
  upgradeRowText: { flex: 1, fontWeight: '800', color: figma.color.text, fontSize: 15 },
  fabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryEmeraldMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.innerGlow
  },
  fabRowText: { color: theme.colors.primary, fontWeight: '700', letterSpacing: 0.2, fontSize: 15 },
  legal: { marginTop: 4, gap: 6 },
  legalH: { fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  link: { color: figma.color.primary, fontWeight: '600' },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  rowVal: { color: figma.color.primary, fontWeight: '800' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  switchText: { flex: 1, gap: 4 },
  subtleSmall: { color: theme.colors.textSecondary, fontSize: 12, lineHeight: 16 },
  currencyVal: { color: theme.colors.textSecondary, marginTop: 8, fontWeight: '600' },
  out: { padding: 16, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.innerGlow },
  outText: { textAlign: 'center', color: theme.colors.danger, fontWeight: '800' }
});
