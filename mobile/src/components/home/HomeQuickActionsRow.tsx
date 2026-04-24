import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/i18n.types';

const TILE = 64;

const LOG_GOLD = '#D4AF37';

const ICON = {
  accounts: { name: 'wallet-outline' as const, col: figma.color.accentGold },
  analytics: { name: 'chart-line' as const, col: figma.color.softGold },
  budget: { name: 'view-dashboard-outline' as const, col: LOG_GOLD },
  ai: { name: 'lightbulb-on-outline' as const, col: figma.color.accentGold }
} as const;

type HomeQuickActionsRowProps = {
  appLanguage: AppLanguage;
};

/**
 * Four premium shortcuts: Accounts, Analytics, Budget, AI Insights.
 */
export function HomeQuickActionsRow({ appLanguage }: HomeQuickActionsRowProps) {
  const t = dashboardStrings(appLanguage);
  const router = useRouter();
  const items = [
    {
      key: 'accounts' as const,
      label: t.featureAccounts,
      on: () => router.push('/(app)/(tabs)/wallet' as Href)
    },
    {
      key: 'analytics' as const,
      label: t.featureAnalytics,
      on: () => router.push('/(app)/(tabs)/stats' as Href)
    },
    {
      key: 'budget' as const,
      label: t.featureBudget,
      on: () => router.push('/quick-add?mode=expense' as Href)
    },
    {
      key: 'ai' as const,
      label: t.featureAi,
      on: () => router.push('/(app)/(tabs)/assistant' as Href)
    }
  ];
  const section = t.homeQuickRowTitle?.trim();
  return (
    <View style={styles.block}>
      {section ? <Text style={styles.sectionTitle}>{section}</Text> : null}
      <View style={styles.row}>
        {items.map((it) => {
          const ic = ICON[it.key];
          return (
            <Pressable
              key={it.key}
              accessibilityLabel={it.label}
              accessibilityRole="button"
              onPress={it.on}
              style={({ pressed }) => [styles.cell, pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] }]}
            >
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons color={ic.col} name={ic.name} size={32} />
              </View>
              <Text numberOfLines={1} style={styles.lbl}>
                {it.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  sectionTitle: {
    fontSize: figma.type.section,
    fontWeight: '600',
    color: figma.color.text,
    letterSpacing: 0.35
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cell: { flex: 1, minWidth: 0, alignItems: 'center', gap: 8 },
  iconWrap: {
    width: TILE,
    height: TILE,
    borderRadius: figma.radius.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 182, 160, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  lbl: {
    fontSize: 10,
    fontWeight: '700',
    color: figma.color.text,
    textAlign: 'center',
    opacity: 0.85,
    letterSpacing: 0.2
  }
});
