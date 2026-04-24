import { LayoutAnimation, Platform, ScrollView, StyleSheet, UIManager, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { QuickCommandParsedResult, TransactionRecord } from '@ai-finance/shared-types';
import { QuickActionBar } from '../QuickActionBar';
import { useAppHeaderPaddingTop } from '../navigation/AppFixedHeader';
import { HomeGreeting } from '../home/HomeGreeting';
import { HomeHeroCard } from '../home/HomeHeroCard';
import { HomeQuickActionsRow } from '../home/HomeQuickActionsRow';
import { WalletCardRow } from '../wallet/WalletCardRow';
import { RecentActivityFigma } from '../wallet/RecentActivityFigma';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { figma } from '../../theme/figma';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SmartDashboardProps = {
  firstName: string;
  balanceMinor: number;
  cardBalanceMinor: number;
  cashOnHandMinor: number;
  isSubmittingQuick: boolean;
  onQuickCreate: (payload: { parsed: QuickCommandParsedResult; rawCommand: string }) => Promise<void>;
  transactions: TransactionRecord[];
  monthlyInflowMinor: number;
  monthlyOutflowMinor: number;
};

export function SmartDashboard({
  firstName,
  balanceMinor,
  cardBalanceMinor,
  cashOnHandMinor,
  isSubmittingQuick,
  onQuickCreate,
  transactions,
  monthlyInflowMinor,
  monthlyOutflowMinor
}: SmartDashboardProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerPad = useAppHeaderPaddingTop();
  const appLanguage = useUiStore((s) => s.appLanguage);
  const ghostMode = useUiStore((s) => s.ghostMode);
  const setGhostMode = useUiStore((s) => s.setGhostMode);
  const advancedOpen = useUiStore((s) => s.advancedQuickOpen);

  return (
    <LinearGradient
      colors={['#F5F5F2', 'rgba(168, 182, 160, 0.2)', '#F5F5F2']}
      style={styles.gradient}
    >
      <View style={[styles.screen, { paddingTop: headerPad }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: figma.screen.bottomContentInset + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <HomeGreeting appLanguage={appLanguage} firstName={firstName} />

        <HomeHeroCard
          appLanguage={appLanguage}
          balanceMinor={balanceMinor}
          ghost={ghostMode}
          inflowMinor={monthlyInflowMinor}
          outflowMinor={monthlyOutflowMinor}
          transactions={transactions}
          onToggleVisibility={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setGhostMode(!ghostMode);
          }}
        />

        <HomeQuickActionsRow appLanguage={appLanguage} />

        <WalletCardRow
          appLanguage={appLanguage}
          cardBalanceMinor={cardBalanceMinor}
          cashOnHandMinor={cashOnHandMinor}
          onAddPress={() => router.push('/quick-add?mode=income' as Href)}
        />

        {advancedOpen ? (
          <QuickActionBar
            isSubmitting={isSubmittingQuick}
            onCreate={onQuickCreate}
          />
        ) : null}

        <RecentActivityFigma
          appLanguage={appLanguage}
          transactions={transactions}
        />
      </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: figma.screen.horizontal,
    gap: 20
  },
});
