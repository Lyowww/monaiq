import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme/tokens';
import { figma } from '../../theme/figma';
import { Ionicons } from '@expo/vector-icons';
import type { AppLanguage } from '../../locales/i18n.types';
import { dashboardStrings } from '../../locales/dashboard.strings';
import { AppLogoMark } from '../brand/AppLogo';

type WalletHeaderFigmaProps = {
  firstName: string;
  appLanguage: AppLanguage;
  onOpenLanguage: () => void;
  onSignOut: () => void;
};

export function WalletHeaderFigma({
  firstName,
  appLanguage,
  onOpenLanguage,
  onSignOut
}: WalletHeaderFigmaProps) {
  const t = dashboardStrings(appLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = (firstName || '?').trim().charAt(0).toUpperCase() || '•';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <AppLogoMark size={44} />
        <View style={styles.greetingBlock}>
          <View style={styles.helloRow}>
            <Text style={styles.hello}>{t.hello(firstName || '...')}</Text>
            <View style={styles.initials}>
              <Text style={styles.initialsText}>{initial}</Text>
            </View>
          </View>
          <Text style={styles.welcome} numberOfLines={1}>
            {t.welcomeBackFigma}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => setMenuOpen(true)}
        style={({ pressed }) => [styles.gridBtn, pressed && { opacity: 0.8 }]}
      >
        <Ionicons color={figma.color.text} name="grid" size={22} />
      </Pressable>

      <Modal animationType="fade" transparent visible={menuOpen} onRequestClose={() => setMenuOpen(false)}>
        <Pressable onPress={() => setMenuOpen(false)} style={styles.menuBackdrop} />
        <View style={styles.menuSheet}>
          <Text style={styles.menuTitle}>{t.menuTitle}</Text>
          <Pressable
            onPress={() => {
              onOpenLanguage();
              setMenuOpen(false);
            }}
            style={styles.menuRow}
          >
            <Text style={styles.menuText}>{t.menuLanguage}</Text>
            <Ionicons color={figma.color.primary} name="chevron-forward" size={20} />
          </Pressable>
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              onSignOut();
            }}
            style={styles.menuRow}
          >
            <Text style={styles.menuText}>{t.menuSignOut}</Text>
            <Ionicons color={figma.color.primary} name="log-out-outline" size={20} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  greetingBlock: { flex: 1, minWidth: 0 },
  helloRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  initials: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212, 175, 55, 0.35)'
  },
  initialsText: { fontSize: 12, fontWeight: '800', color: figma.color.primaryDeep },
  hello: {
    color: figma.color.textLabel,
    fontSize: figma.type.hello,
    fontWeight: '500',
    flexShrink: 1
  },
  welcome: { color: figma.color.text, fontSize: figma.type.welcome, fontWeight: '800' },
  gridBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(168, 182, 160, 0.22)'
  },
  menuSheet: {
    position: 'absolute',
    right: 20,
    top: 120,
    width: 260,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: figma.color.glassStroke,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(245, 245, 242, 0.98)',
    zIndex: 20
  },
  menuTitle: { fontWeight: '800', fontSize: 16, marginBottom: 8, color: figma.color.text },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(168, 182, 160, 0.35)'
  },
  menuText: { color: figma.color.text, fontSize: 15, fontWeight: '600' }
});
