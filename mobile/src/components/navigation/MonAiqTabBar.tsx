import * as React from "react";
import {
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { figma } from "../../theme/figma";
import { theme } from "../../theme/tokens";
import { useUiStore } from "../../features/ui/store/useUiStore";
import { dashboardStrings } from "../../locales/dashboard.strings";

const AI_TAB_ICON = require("../../../assets/only-icon.png");

const ICON = 22;
/** PNG size inside the center AI disc. */
const ICON_AI = 64;
const BAR_EDGE_INSET = 10;
/** Center AI button diameter. */
const AI_CIRCLE = 76;
const CENTER_SLOT_W = AI_CIRCLE;
const PILL_TOP_INSET = 22;
const PILL_ROW_PAD_TOP = 8;
const BLUR_PAD_TOP = 8;
const BAR_SURFACE_Y = PILL_TOP_INSET + PILL_ROW_PAD_TOP + BLUR_PAD_TOP;
const AI_CIRCLE_EXTRA_UP = 10;
const AI_CIRCLE_MARGIN_TOP =
  BAR_SURFACE_Y - AI_CIRCLE * 0.35 - AI_CIRCLE_EXTRA_UP;

const ROUTES: Array<{
  key: "index" | "stats" | "assistant" | "wallet" | "profile";
  ion: keyof typeof Ionicons.glyphMap;
  ionActive: keyof typeof Ionicons.glyphMap;
  label: (t: ReturnType<typeof dashboardStrings>) => string;
}> = [
  {
    key: "index",
    ion: "home-outline",
    ionActive: "home",
    label: (t) => t.tabHome,
  },
  {
    key: "stats",
    ion: "stats-chart-outline",
    ionActive: "stats-chart",
    label: (t) => t.tabAnalytics,
  },
  {
    key: "assistant",
    ion: "chatbubble-ellipses-outline",
    ionActive: "chatbubble-ellipses",
    label: (t) => t.tabAi,
  },
  {
    key: "wallet",
    ion: "wallet-outline",
    ionActive: "wallet",
    label: (t) => t.tabWallet,
  },
  {
    key: "profile",
    ion: "settings-outline",
    ionActive: "settings",
    label: (t) => t.tabSettings,
  },
];

const LEFT_TAB_KEYS = new Set<"index" | "stats">(["index", "stats"]);

type Props = BottomTabBarProps;

export function MonAiqTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const onTabBarHeight = React.useContext(BottomTabBarHeightCallbackContext);
  const appLanguage = useUiStore((s) => s.appLanguage);
  const t = dashboardStrings(appLanguage);

  const onOuterLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      onTabBarHeight?.(e.nativeEvent.layout.height);
    },
    [onTabBarHeight],
  );

  const isActive = (key: (typeof ROUTES)[number]["key"]): boolean =>
    state.routes[state.index]?.name === key;

  const onTab = (key: (typeof ROUTES)[number]["key"]): void => {
    navigation.navigate(key as never);
  };

  const leftRoutes = ROUTES.filter((r) =>
    LEFT_TAB_KEYS.has(r.key as "index" | "stats"),
  );
  const rightRoutes = ROUTES.filter(
    (r) => r.key === "wallet" || r.key === "profile",
  );
  const aiRoute = ROUTES.find((r) => r.key === "assistant")!;

  const renderSideTab = (item: (typeof ROUTES)[number]) => {
    const active = isActive(item.key);
    return (
      <Pressable
        accessibilityLabel={item.label(t)}
        accessibilityRole="button"
        key={item.key}
        onPress={() => onTab(item.key)}
        style={({ pressed }) => [styles.sideTab, pressed && { opacity: 0.88 }]}
      >
        <Ionicons
          color={active ? figma.color.accentGold : figma.color.textMuted}
          name={active ? item.ionActive : item.ion}
          size={ICON}
        />
      </Pressable>
    );
  };

  const aiActive = isActive("assistant");

  return (
    <View
      onLayout={onOuterLayout}
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 6) }]}
    >
      <View style={[styles.dock, { marginHorizontal: BAR_EDGE_INSET }]}>
        <View style={styles.pillRow}>
          <BlurContainer style={styles.unifiedBar}>
            <View style={styles.barInner}>
              <View style={styles.sideCluster}>
                {leftRoutes.map(renderSideTab)}
              </View>
              <View style={[styles.centerSlot, { width: CENTER_SLOT_W }]} />
              <View style={styles.sideCluster}>
                {rightRoutes.map(renderSideTab)}
              </View>
            </View>
          </BlurContainer>
        </View>

        <View style={styles.aiCircleLayer} pointerEvents="box-none">
          <Pressable
            accessibilityLabel={aiRoute.label(t)}
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => onTab("assistant")}
            style={({ pressed }) => [
              styles.aiCircle,
              aiActive && styles.aiCircleActive,
              pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={AI_TAB_ICON}
              style={[styles.aiTabIcon, { opacity: aiActive ? 1 : 0.45 }]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function BlurContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}) {
  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={theme.blur.chrome} tint="light" style={style}>
        {children}
      </BlurView>
    );
  }
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: figma.screen.horizontal,
  },
  dock: {
    position: "relative",
    width: "100%",
    maxWidth: 520 - BAR_EDGE_INSET * 2,
    alignItems: "center",
    alignSelf: "center",
    overflow: "visible",
  },
  aiCircleLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Math.max(0, AI_CIRCLE_MARGIN_TOP) + AI_CIRCLE + 12,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 20,
    pointerEvents: "box-none",
  },
  aiCircle: {
    marginTop: AI_CIRCLE_MARGIN_TOP,
    width: AI_CIRCLE,
    height: AI_CIRCLE,
    borderRadius: AI_CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(212, 175, 55, 0.45)",
    backgroundColor: "rgba(245, 245, 242, 0.98)",
    shadowColor: "#1A1F2B",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 14,
  },
  aiCircleActive: {
    borderColor: figma.color.accentGold,
    backgroundColor: "rgba(212, 175, 55, 0.18)",
    shadowColor: figma.color.accentGold,
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  aiTabIcon: {
    width: ICON_AI + 20,
    height: ICON_AI + 20,
    paddingTop: 10
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 56,
    marginTop: PILL_TOP_INSET,
    paddingTop: PILL_ROW_PAD_TOP,
    paddingBottom: 10,
    zIndex: 4,
  },
  unifiedBar: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(168, 182, 160, 0.4)",
    backgroundColor:
      Platform.OS === "ios" ? figma.color.glassOnBlur : figma.color.bgElevated,
    paddingVertical: BLUR_PAD_TOP,
    paddingHorizontal: 6,
    ...figma.shadow.tabBar,
  },
  barInner: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
    width: "100%",
  },
  centerSlot: {
    flexShrink: 0,
  },
  sideCluster: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    minWidth: 0,
  },
  sideTab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
  },
});
