import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const H = 78;
const TAB_ICON = 24;

const ROUTES: Array<{
  key: 'index' | 'stats' | 'wallet' | 'profile';
  ion: keyof typeof Ionicons.glyphMap;
  ionActive: keyof typeof Ionicons.glyphMap;
  label: (t: ReturnType<typeof dashboardStrings>) => string;
}> = [
  { key: 'index', ion: 'home-outline', ionActive: 'home', label: (t) => t.tabHome },
  { key: 'stats', ion: 'bar-chart-outline', ionActive: 'bar-chart', label: (t) => t.tabStats },
  { key: 'wallet', ion: 'card-outline', ionActive: 'card', label: (t) => t.tabWallet },
  { key: 'profile', ion: 'person-outline', ionActive: 'person', label: (t) => t.tabProfile }
];

type Props = BottomTabBarProps;

export function FigmaWavyTabShell({ state, navigation }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = Math.max(320, Dimensions.get('window').width - figma.screen.horizontal * 2);
  const appLanguage = useUiStore((s) => s.appLanguage);
  const t = dashboardStrings(appLanguage);

  const isActive = (key: (typeof ROUTES)[number]['key']): boolean =>
    state.routes[state.index]?.name === key;

  const onTab = (key: (typeof ROUTES)[number]['key']): void => {
    navigation.navigate(key as never);
  };

  const onFab = (): void => {
    if (state.routes[state.index]?.name !== 'index') {
      navigation.navigate('index' as never);
    }
    router.push('/quick-add?mode=income' as Href);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={[styles.barWrap, { width }]}>
        <View style={styles.layerBlur}>
          <BlurView
            intensity={50}
            style={[StyleSheet.absoluteFill, { borderRadius: figma.radius.tabBar }]}
            tint="light"
          />
        </View>
        <View
          style={[
            styles.svgLayer,
            {
              backgroundColor: figma.color.glassFill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: figma.color.glassStroke,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28
            }
          ]}
        />
        <View style={styles.row}>
          {ROUTES.slice(0, 2).map((item) => {
            const active = isActive(item.key);
            return (
              <Pressable
                accessibilityRole="button"
                key={item.key}
                onPress={() => onTab(item.key)}
                style={({ pressed }) => [styles.tab, pressed && { opacity: 0.85 }]}
              >
                <Ionicons
                  color={active ? figma.color.primary : figma.color.textMuted}
                  name={active ? item.ionActive : item.ion}
                  size={TAB_ICON}
                />
                {active ? <View style={styles.activeDot} /> : <View style={styles.dotPlaceholder} />}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    active && { color: figma.color.primary, fontWeight: '800' }
                  ]}
                >
                  {item.label(t)}
                </Text>
              </Pressable>
            );
          })}
          <View style={styles.fabSpacer} />
          {ROUTES.slice(2, 4).map((item) => {
            const active = isActive(item.key);
            return (
              <Pressable
                accessibilityRole="button"
                key={item.key}
                onPress={() => onTab(item.key)}
                style={({ pressed }) => [styles.tab, pressed && { opacity: 0.85 }]}
              >
                <Ionicons
                  color={active ? figma.color.primary : figma.color.textMuted}
                  name={active ? item.ionActive : item.ion}
                  size={TAB_ICON}
                />
                {active ? <View style={styles.activeDot} /> : <View style={styles.dotPlaceholder} />}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    active && { color: figma.color.primary, fontWeight: '800' }
                  ]}
                >
                  {item.label(t)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View pointerEvents="box-none" style={styles.fabLayer}>
          <Pressable
            accessibilityLabel="Scan"
            onPress={onFab}
            style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <MaterialCommunityIcons
              color={figma.color.onAccent}
              name="qrcode-scan"
              size={28}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: figma.screen.horizontal
  },
  barWrap: {
    maxWidth: 420,
    height: H,
    position: 'relative',
    ...figma.shadow.tabBar
  },
  layerBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: figma.radius.tabBar,
    overflow: 'hidden',
    marginHorizontal: 0
  },
  svgLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: figma.radius.tabBar
  },
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4
  },
  tab: { flex: 1, alignItems: 'center', gap: 0 },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: figma.color.primary,
    marginTop: 2
  },
  dotPlaceholder: { height: 4, marginTop: 2 },
  tabText: {
    fontSize: figma.type.tab,
    color: figma.color.textMuted,
    fontWeight: '600',
    marginTop: 2
  },
  fabSpacer: { width: 72 },
  fabLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -32,
    alignItems: 'center',
    zIndex: 4
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: figma.color.fabLime,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: figma.color.fabLimeBorder,
    ...figma.shadow.fab
  }
});
