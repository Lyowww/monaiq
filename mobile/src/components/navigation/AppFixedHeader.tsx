import * as React from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { dashboardStrings } from '../../locales/dashboard.strings';
import { translate } from '../../locales/i18n';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

const ONLY_ICON = require('../../../assets/only-icon.png');

const HEADER_ACCENT = '#D4AF37';

/**
 * Space below status bar to clear the fixed header (shell padding + blur pill + bottom pad).
 * Keep in sync with `styles.shell` + `styles.blurPill` layout.
 */
export const APP_HEADER_INNER = 70;

export function useAppHeaderPaddingTop(): number {
  const insets = useSafeAreaInsets();
  return insets.top + APP_HEADER_INNER;
}

function tabTitleForSegment(
  screen: string,
  t: ReturnType<typeof dashboardStrings>
): string {
  switch (screen) {
    case 'stats':
      return t.tabStats;
    case 'assistant':
      return t.tabAi;
    case 'wallet':
      return t.tabWallet;
    case 'profile':
      return t.tabProfile;
    case 'index':
    default:
      return t.tabHome;
  }
}

function BlurChrome({ style, children }: { style: object; children: React.ReactNode }) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={theme.blur.chrome} style={style} tint="light">
        {children}
      </BlurView>
    );
  }
  return <View style={style}>{children}</View>;
}

export function AppFixedHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments() as string[];
  const appLanguage = useUiStore((s) => s.appLanguage);
  const toggleAppLanguage = useUiStore((s) => s.toggleAppLanguage);
  const clearSession = useAuthStore((s) => s.clearSession);
  const t = React.useMemo(() => dashboardStrings(appLanguage), [appLanguage]);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const screen = React.useMemo(() => {
    const parts = segments.filter((s) => !s.startsWith('('));
    return parts.length > 0 ? parts[parts.length - 1]! : 'index';
  }, [segments]);

  const title = tabTitleForSegment(screen, t);

  const onNotify = () => {
    router.push('/notifications');
  };

  return (
    <>
      <View
        pointerEvents="box-none"
        style={[styles.shell, { paddingTop: insets.top + 6, paddingBottom: 8 }]}
      >
        <BlurChrome
          style={styles.blurPill}
        >
          <View style={styles.pillInner}>
            <View style={styles.hRow} pointerEvents="box-none">
              <Pressable
                accessibilityLabel={t.menuTitle}
                hitSlop={6}
                onPress={() => setMenuOpen(true)}
                style={({ pressed }) => [styles.brand, pressed && { opacity: 0.88 }]}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={ONLY_ICON}
                  style={styles.brandImg}
                />
              </Pressable>
              <View style={styles.right}>
                <Pressable
                  accessibilityLabel={t.notificationsHint}
                  hitSlop={6}
                  onPress={onNotify}
                  style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.86 }]}
                >
                  <Ionicons color={figma.color.text} name="notifications-outline" size={22} />
                </Pressable>
                <Pressable
                  accessibilityLabel={translate(appLanguage, 'quickAdd.title')}
                  hitSlop={6}
                  onPress={() => router.push('/quick-add?mode=income' as Href)}
                  style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.86 }]}
                >
                  <Ionicons color={HEADER_ACCENT} name="add" size={24} />
                </Pressable>
              </View>
            </View>
            <View style={styles.titleWrap} pointerEvents="none">
              <Text
                numberOfLines={1}
                style={styles.title}
                maxFontSizeMultiplier={1.35}
              >
                {title}
              </Text>
            </View>
          </View>
        </BlurChrome>
      </View>

      <Modal animationType="fade" onRequestClose={() => setMenuOpen(false)} transparent visible={menuOpen}>
        <Pressable onPress={() => setMenuOpen(false)} style={styles.menuBackdrop} />
        <View style={[styles.menuSheet, { top: insets.top + 68 }]}>
          <Text style={styles.menuTitle}>{t.menuTitle}</Text>
          <Pressable
            onPress={() => {
              toggleAppLanguage();
              setMenuOpen(false);
            }}
            style={styles.menuRow}
          >
            <Text style={styles.menuText}>{t.menuLanguage}</Text>
            <Ionicons color={figma.color.accentGold} name="chevron-forward" size={20} />
          </Pressable>
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              void clearSession();
            }}
            style={styles.menuRow}
          >
            <Text style={styles.menuText}>{t.menuSignOut}</Text>
            <Ionicons color={figma.color.accentGold} name="log-out-outline" size={20} />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    paddingHorizontal: figma.screen.horizontal
  },
  blurPill: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(168, 182, 160, 0.4)',
    backgroundColor: Platform.OS === 'ios' ? figma.color.glassOnBlur : figma.color.bgElevated,
    ...figma.shadow.tabBar
  },
  pillInner: { position: 'relative', minHeight: 50, justifyContent: 'center' },
  hRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 1
  },
  brand: {
    width: 49,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14
  },
  brandImg: {
    width: 45,
    height: 45
  },
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 100
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: figma.color.text,
    letterSpacing: 0.1,
    lineHeight: 22,
    ...Platform.select({
      android: { textAlignVertical: 'center' as const, includeFontPadding: false },
      default: {}
    })
  },
  right: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 31, 43, 0.2)'
  },
  menuSheet: {
    position: 'absolute',
    left: 20,
    width: 280,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider,
    padding: 16,
    backgroundColor: figma.color.glassFill,
    zIndex: 300,
    ...figma.shadow.card
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
    color: figma.color.text,
    letterSpacing: 0.2,
    textAlign: 'center',
    ...Platform.select({ android: { includeFontPadding: false }, default: {} })
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: figma.color.divider
  },
  menuText: {
    color: figma.color.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    ...Platform.select({ android: { includeFontPadding: false, textAlignVertical: 'center' }, default: {} })
  }
});
