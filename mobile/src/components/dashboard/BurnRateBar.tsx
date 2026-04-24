import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/tokens';
import { GlassCard } from '../GlassCard';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';
import { formatAmdFromMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { figma } from '../../theme/figma';
import { type Point2, segmentStyle } from '../../lib/charts/viewPolyline';

type BurnRateBarProps = {
  monthlyOutflowMinor: number;
  monthlyInflowMinor: number;
  lang: AppLanguage;
};

const H = 42;
const STROKE = 3;
const M = 6;

function burnPoints(w: number, fill: number): { a: Point2; b: Point2 } | null {
  if (w <= 2 * M) {
    return null;
  }
  const inner = w - 2 * M;
  const t = Math.min(1, Math.max(0, fill));
  return {
    a: { x: M, y: H - M },
    b: { x: M + t * inner, y: M + (1 - t) * (H - 2 * M) }
  };
}

export function BurnRateBar({ monthlyOutflowMinor, monthlyInflowMinor, lang }: BurnRateBarProps) {
  const t = dashboardStrings(lang);
  const appLanguage = useUiStore((s) => s.appLanguage);
  const daysInMonth = 30;
  const dailyBurn = monthlyOutflowMinor / daysInMonth;
  const dailyBudget = Math.max(monthlyInflowMinor / daysInMonth, 1);
  const fill = Math.min(1, dailyBurn / dailyBudget);
  const [detail, setDetail] = useState(false);

  const [w, setW] = useState(240);
  const onLayout = (e: LayoutChangeEvent) => {
    const x = e.nativeEvent.layout.width;
    if (x > 0) {
      setW(x);
    }
  };

  const seg = useMemo(() => burnPoints(w, fill), [w, fill]);
  const xCap = w - M;

  const guideA = { x: M, y: H - M } as const;
  const guideB = { x: xCap, y: M } as const;

  return (
    <GlassCard>
      <Text style={styles.label}>{t.burnRate}</Text>
      <View style={styles.chartShell} onLayout={onLayout}>
        <Pressable
          onPress={() => setDetail((d) => !d)}
          style={({ pressed }) => [styles.chartPad, { width: w }, pressed && { opacity: 0.95 }]}
        >
          <LinearGradient
            colors={[figma.color.chartSurfaceLight, figma.color.chartSurfaceLight2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{ width: w, height: H, position: 'relative', zIndex: 1 }}
            pointerEvents="none"
            collapsable={false}
          >
            <View
              style={[
                segmentStyle(guideA, { x: xCap, y: H - M }, 'rgba(168, 182, 160, 0.2)', 1),
                { opacity: 0.85 }
              ]}
            />
            <View
              style={[
                segmentStyle(guideA, guideB, 'rgba(8, 10, 15, 0.12)', 1),
                { opacity: 0.5 }
              ]}
            />
            {seg ? (
              <>
                <View
                  style={segmentStyle(
                    seg.a,
                    seg.b,
                    'rgba(212, 175, 55, 0.3)',
                    STROKE * 2.45
                  )}
                />
                <View style={segmentStyle(seg.a, seg.b, figma.color.accentGold, STROKE)} />
              </>
            ) : null}
          </View>
        </Pressable>
      </View>
      <Text style={styles.caption}>
        {formatAmdFromMinor(Math.round(dailyBurn))} /{` ${formatAmdFromMinor(Math.round(dailyBudget))} `}·
        {lang === 'hy' ? 'օրական' : 'per day (est.)'}
      </Text>
      <Text style={styles.tapHint}>{translate(appLanguage, 'stats.burnTapHint')}</Text>
      {detail ? (
        <View style={styles.detailBox}>
          <Text style={styles.detailMain}>
            {translate(appLanguage, 'stats.burnDetailLine', { pct: String(Math.round(fill * 100)) })}
          </Text>
        </View>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
    marginBottom: theme.spacing.sm
  },
  chartShell: {
    minHeight: H + 16,
    width: '100%'
  },
  chartPad: {
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.chartStrokeLight,
    backgroundColor: figma.color.chartSurfaceLight,
    ...figma.shadow.button
  },
  caption: { marginTop: theme.spacing.xs, color: theme.colors.textSecondary, fontSize: 12 },
  tapHint: {
    marginTop: 4,
    fontSize: 10,
    color: 'rgba(8, 10, 15, 0.5)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1
  },
  detailBox: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: figma.color.chartSurfaceLight2,
    borderWidth: 1,
    borderColor: figma.color.chartTooltipBorder
  },
  detailMain: {
    color: figma.color.chartTextInk,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.1
  }
});
