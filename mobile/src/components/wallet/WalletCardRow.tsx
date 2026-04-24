import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassPanel } from '../ui/GlassPanel';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CARD_W = 300;

type WalletCardRowProps = {
  cardBalanceMinor: number;
  cashOnHandMinor: number;
  appLanguage: AppLanguage;
  onAddPress?: () => void;
};

export function WalletCardRow({
  cardBalanceMinor,
  cashOnHandMinor,
  appLanguage,
  onAddPress
}: WalletCardRowProps) {
  const t = dashboardStrings(appLanguage);
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.cardSection}</Text>
        <Pressable
          accessibilityLabel={translate(appLanguage, 'quickAdd.title')}
          onPress={onAddPress}
          style={({ pressed }) => [styles.addCircle, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
        >
          <Ionicons color="#0A0C0F" name="add" size={22} />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={styles.caption}>
        {t.walletCardCaption}
      </Text>
      <ScrollView
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={CARD_W + 14}
        contentContainerStyle={styles.scroll}
      >
        <GlassPanel style={styles.card}>
          <View style={styles.topRow}>
            <MaterialCommunityIcons color={figma.color.accentGold} name="contactless-payment" size={24} />
            <Text style={styles.brand}>{t.cardSection}</Text>
            <Ionicons color={figma.color.textMuted} name="card" size={22} />
          </View>
          <Text style={styles.pan}>•••• · •••• · ••••</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.mutedSmall}>BALANCE (AMD)</Text>
              <Text style={styles.balOnCard}>{formatAmdFromMinor(cardBalanceMinor)}</Text>
            </View>
            <Ionicons color={figma.color.textMuted} name="phone-portrait-outline" size={32} />
          </View>
        </GlassPanel>

        <GlassPanel style={[styles.card, styles.second]}>
          <View style={styles.cashTop}>
            <Ionicons color={figma.color.softGold} name="wallet-outline" size={28} />
            <Text style={styles.cashTitle}>{t.cashSection}</Text>
          </View>
          <View style={styles.cashBottom}>
            <Text style={styles.cashLabel}>BALANCE (AMD)</Text>
            <Text style={styles.cashAmt}>{formatAmdFromMinor(cashOnHandMinor)}</Text>
          </View>
        </GlassPanel>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: figma.type.section, fontWeight: '600', color: figma.color.text, letterSpacing: 0.3 },
  caption: { fontSize: 11, lineHeight: 14, color: figma.color.textMuted },
  addCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: figma.color.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(26, 31, 43, 0.1)'
  },
  scroll: { paddingVertical: 4, paddingRight: 20, marginTop: 4 },
  card: {
    width: CARD_W,
    minHeight: 196,
    padding: 20,
    justifyContent: 'space-between',
    ...figma.shadow.card
  },
  second: { marginLeft: 14, minHeight: 196, padding: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: figma.color.text, fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
  pan: {
    color: figma.color.textMuted,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 1.1,
    marginTop: 20
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16
  },
  mutedSmall: { color: figma.color.textMuted, fontSize: 9, fontWeight: '600', letterSpacing: 0.6 },
  balOnCard: { color: figma.color.softGold, fontSize: 20, fontWeight: '600', marginTop: 2, letterSpacing: 0.2 },
  cashTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cashTitle: { color: figma.color.text, fontSize: 18, fontWeight: '600', letterSpacing: 0.2 },
  cashBottom: { marginTop: 24 },
  cashLabel: { color: figma.color.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  cashAmt: { color: figma.color.text, fontSize: 22, fontWeight: '600', marginTop: 4, letterSpacing: 0.2 }
});
