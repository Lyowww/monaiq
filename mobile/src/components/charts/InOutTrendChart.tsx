import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { seriesToPointsWithMax } from '../../lib/charts/linePath';
import { densifyLinear, dotStyle, segmentStyle } from '../../lib/charts/viewPolyline';
import { formatAmdAxisCompact, formatAmdFromMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { figma } from '../../theme/figma';
import { ChartAreaStrips } from './ChartAreaStrips';
import { ChartGridLines } from './ChartGridLines';

const CHART_H = 128;
const PAD_X = 10;
const PAD_Y = 18;
const AXIS_PAD = 4;
const IN_STROKE = 2.85;
const OUT_STROKE = 2.35;
const IN_GLOW = IN_STROKE * 2.35;
const OUT_GLOW = OUT_STROKE * 2.2;
const WELL_RADIUS = 22;
const Y_GUTTER = 38;

const F = figma.color;
const GRID_COLOR = F.chartGridLight;
const IN_AREA = F.inAreaLight;
const IN_GLOW_COLOR = F.inGlowLight;
const OUT_GLOW_COLOR = F.chartOutGlowLight;
const OUT_STROKE_COLOR = F.chartOutLight;

type Props = {
  credits: number[];
  debits: number[];
  labels: string[];
  width: number;
  style?: ViewStyle;
  fadeStrength?: number;
  dayActivity?: number[] | null;
};

function renderPolylineGlow(
  points: { x: number; y: number }[],
  glowColor: string,
  glowW: number,
  color: string,
  sw: number,
  keyPrefix: string
) {
  const d = points.length > 1 ? densifyLinear(points, 4) : points;
  if (d.length < 2) {
    return null;
  }
  const segs = d.slice(0, -1).map((a, i) => {
    const b = d[i + 1]!;
    return (
      <View key={`${keyPrefix}-g-${i}`} style={segmentStyle(a, b, glowColor, glowW)} />
    );
  });
  const main = d.slice(0, -1).map((a, i) => {
    const b = d[i + 1]!;
    return <View key={`${keyPrefix}-m-${i}`} style={segmentStyle(a, b, color, sw)} />;
  });
  return (
    <>
      {segs}
      {main}
    </>
  );
}

function shouldShowDot(i: number, n: number): boolean {
  if (n <= 16) {
    return true;
  }
  if (i === 0 || i === n - 1) {
    return true;
  }
  const stride = Math.max(2, Math.ceil(n / 12));
  return i % stride === 0;
}

export function InOutTrendChart({ credits, debits, labels, width, style, dayActivity, fadeStrength = 0 }: Props) {
  const appLanguage = useUiStore((s) => s.appLanguage);
  const [selected, setSelected] = useState<number | null>(null);
  const w = width > 0 ? width : 0;
  const plotW = Math.max(0, w - Y_GUTTER);
  const n = credits.length;
  const nOut = debits.length;
  const inSeries = credits;
  const outSeries = nOut > 0 ? debits : credits;

  const sharedMax = useMemo(
    () => Math.max(1, ...inSeries, ...outSeries),
    [inSeries, outSeries]
  );

  const innerH = Math.max(1, CHART_H - 2 * PAD_Y);
  const baselineY = PAD_Y + innerH;

  const inPts = useMemo(
    () => seriesToPointsWithMax(inSeries, sharedMax, plotW, CHART_H, PAD_X, PAD_Y),
    [inSeries, sharedMax, plotW]
  );
  const outPts = useMemo(
    () => seriesToPointsWithMax(outSeries, sharedMax, plotW, CHART_H, PAD_X, PAD_Y),
    [outSeries, sharedMax, plotW]
  );

  const inLine = useMemo(() => densifyLinear(inPts, 4), [inPts]);

  const act = useMemo(
    () => (dayActivity && dayActivity.length === n ? dayActivity : null),
    [dayActivity, n]
  );

  const firstLabel = labels[0] ?? '';
  const midLabel = n > 2 ? labels[Math.floor((n - 1) / 2)] ?? '' : firstLabel;
  const lastLabel = labels[labels.length - 1] ?? firstLabel;
  const rangeLine = firstLabel && lastLabel ? `${firstLabel} — ${lastLabel}` : '—';

  const innerW = Math.max(1, w - 2 * AXIS_PAD);

  const yTicks = useMemo(() => {
    const maxV = sharedMax;
    return [0, 1, 2, 3, 4].map((k) => {
      const t = k / 4;
      const v = maxV * (1 - t);
      const y = PAD_Y + t * innerH;
      return { v, y };
    });
  }, [sharedMax, innerH]);

  const onDayPress = (i: number) => {
    setSelected((p) => (p === i ? null : i));
  };

  const slotW = n > 0 ? (plotW - 2 * PAD_X) / n : 0;
  const selP = selected != null && inPts[selected] ? inPts[selected]! : null;
  const cashTooltipLeft = selP
    ? Math.min(
        Math.max(PAD_X, selP.x - 52),
        plotW - PAD_X - 104
      )
    : PAD_X;
  const cashTooltipTop = selP
    ? Math.max(PAD_Y, Math.min(selP.y - 56, baselineY - 72))
    : PAD_Y;

  return (
    <View style={[{ width: w }, style]}>
      <View style={styles.well}>
        <LinearGradient
          colors={[F.chartSurfaceLight, F.chartSurfaceLight2, F.chartSurfaceLight]}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.12, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.5)', 'rgba(212, 175, 55, 0.03)', 'transparent']}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.3, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        {fadeStrength > 0 ? (
          <View pointerEvents="none" style={[styles.vignetteRow, { width: w, height: CHART_H }]}>
            <View style={[styles.vL, { opacity: 0.04 * fadeStrength, width: w * 0.05 }]} />
            <View style={{ flex: 1 }} />
            <View style={[styles.vR, { opacity: 0.04 * fadeStrength, width: w * 0.05 }]} />
          </View>
        ) : null}

        <View style={styles.plotRow}>
          <View style={[styles.yGutter, { height: CHART_H }]}>
            {yTicks.map((tk, i) => (
              <Text key={`ty-${i}`} numberOfLines={1} style={[styles.yLabel, { top: tk.y - 8 }]}>
                {formatAmdAxisCompact(Math.round(tk.v))}
              </Text>
            ))}
          </View>

          <View style={{ width: plotW, height: CHART_H, position: 'relative' }}>
            <ChartGridLines color={GRID_COLOR} height={CHART_H} padX={PAD_X} padY={PAD_Y} segments={5} width={plotW} />

            {inLine.length > 1 ? (
              <ChartAreaStrips
                baselineY={baselineY}
                color={IN_AREA}
                padX={PAD_X}
                plotWidth={plotW}
                points={inLine}
                stepPx={2}
              />
            ) : null}

            <LinearGradient
              pointerEvents="none"
              colors={['rgba(212, 175, 55, 0.1)', 'transparent']}
              style={{
                position: 'absolute',
                left: 0,
                top: PAD_Y,
                height: innerH * 0.5,
                width: plotW,
                zIndex: 1,
                opacity: 0.55
              }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />

            <View style={[styles.chartWrap, { width: plotW, height: CHART_H }]} pointerEvents="none" collapsable={false}>
              <View
                style={{
                  position: 'absolute',
                  left: PAD_X,
                  top: baselineY,
                  width: plotW - 2 * PAD_X,
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: 'rgba(26, 31, 43, 0.1)',
                  opacity: 1
                }}
              />
              {nOut > 0
                ? renderPolylineGlow(outPts, OUT_GLOW_COLOR, OUT_GLOW, String(OUT_STROKE_COLOR), OUT_STROKE, 'out')
                : null}
              {renderPolylineGlow(inPts, IN_GLOW_COLOR, IN_GLOW, String(figma.color.accentGold), IN_STROKE, 'in')}
              {nOut > 0
                ? outPts.map((p, i) => {
                    if (!shouldShowDot(i, n)) {
                      return null;
                    }
                    return (
                      <View
                        key={`out-${i}`}
                        style={dotStyle(p, 2.35, OUT_STROKE_COLOR, {
                          ring: i === 0 || i === n - 1,
                          ringColor: 'rgba(255, 255, 255, 0.95)'
                        })}
                      />
                    );
                  })
                : null}
              {inPts.map((p, i) => {
                if (!shouldShowDot(i, n)) {
                  return null;
                }
                return (
                  <View
                    key={`in-${i}`}
                    style={dotStyle(p, 2.85, figma.color.accentGold, {
                      ring: i === 0 || i === n - 1,
                      ringColor: 'rgba(255, 255, 255, 0.98)'
                    })}
                  />
                );
              })}
            </View>

            {n > 0 && slotW > 0
              ? Array.from({ length: n }, (_, i) => (
                  <Pressable
                    key={`day-hit-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={labels[i] ?? `Day ${i + 1}`}
                    onPress={() => onDayPress(i)}
                    style={({ pressed }) => [
                      styles.dayHit,
                      {
                        left: PAD_X + i * slotW,
                        width: slotW,
                        opacity: pressed ? 0.5 : 1
                      }
                    ]}
                  />
                ))
              : null}

            {selected != null && labels[selected] != null ? (
              <View
                pointerEvents="none"
                style={[
                  styles.cashTip,
                  {
                    left: cashTooltipLeft,
                    top: cashTooltipTop
                  }
                ]}
              >
                <View style={styles.cashTipCard}>
                  <Text style={styles.cashTipDate}>{labels[selected]}</Text>
                  <Text style={styles.cashTipRow}>
                    {translate(appLanguage, 'monaiq.in')}: {formatAmdFromMinor(credits[selected] ?? 0)}
                  </Text>
                  {nOut > 0 ? (
                    <Text style={styles.cashTipRowOut}>
                      {translate(appLanguage, 'monaiq.out')}: {formatAmdFromMinor(debits[selected] ?? 0)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.cashTipArrow} />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.xAxisThree}>
          <Text style={styles.xLbl} numberOfLines={1}>
            {firstLabel}
          </Text>
          <Text style={styles.xMid} numberOfLines={1}>
            {midLabel}
          </Text>
          <Text style={[styles.xLbl, styles.xLblR]} numberOfLines={1}>
            {lastLabel}
          </Text>
        </View>
        <Text style={styles.tapRow}>{translate(appLanguage, 'stats.cashflowTapHint')}</Text>

        {act && w > 0 ? (
          <View
            style={[styles.dayBarRow, { width: w, marginTop: 2, marginBottom: 2, paddingHorizontal: AXIS_PAD }]}
          >
            {act.map((a, i) => {
              const h = 2.5 + 11.5 * a;
              return (
                <Pressable
                  key={i}
                  onPress={() => onDayPress(i)}
                  style={[styles.daySeg, { width: innerW / n, maxWidth: innerW / n }]}
                >
                  <View style={[styles.dayPip, { height: h, opacity: 0.4 + 0.55 * a }]}>
                    <LinearGradient
                      colors={[
                        F.chartBarBaseLight,
                        a > 0.15 ? F.chartBarMidLight : F.chartBarBaseLight,
                        F.chartBarTopLight
                      ]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0.5, y: 1 }}
                      end={{ x: 0.5, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.pipRim} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <View style={styles.caption} pointerEvents="none">
        <Text style={styles.captionText} numberOfLines={1}>
          {rangeLine}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    position: 'relative',
    borderRadius: WELL_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: F.chartStrokeLight,
    overflow: 'hidden',
    backgroundColor: F.chartSurfaceLight,
    ...figma.shadow.button
  },
  plotRow: { flexDirection: 'row', alignItems: 'flex-start' },
  yGutter: {
    width: Y_GUTTER,
    position: 'relative',
    marginRight: 2
  },
  yLabel: {
    position: 'absolute',
    right: 2,
    left: 0,
    fontSize: 9,
    fontWeight: '600',
    color: F.chartTextInk,
    textAlign: 'right',
    letterSpacing: 0.04,
    opacity: 0.75
  },
  chartWrap: { position: 'relative', zIndex: 2 },
  vignetteRow: { position: 'absolute', flexDirection: 'row', zIndex: 3, top: 0, left: 0 },
  vL: {
    backgroundColor: F.chartTextInk,
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    alignSelf: 'stretch'
  },
  vR: {
    backgroundColor: F.chartTextInk,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    alignSelf: 'stretch'
  },
  xAxisThree: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingTop: 6,
    paddingBottom: 4,
    paddingHorizontal: Y_GUTTER + 4
  },
  tapRow: {
    fontSize: 9,
    fontWeight: '500',
    color: F.chartTextSoft,
    textAlign: 'center',
    paddingBottom: 6,
    paddingHorizontal: 12,
    letterSpacing: 0.12
  },
  xLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: F.chartTextInk,
    flex: 1,
    letterSpacing: 0.1,
    opacity: 0.85
  },
  xLblR: { textAlign: 'right' },
  xMid: {
    fontSize: 9,
    fontWeight: '500',
    color: F.chartTextSoft,
    paddingHorizontal: 6,
    textAlign: 'center'
  },
  dayHit: {
    position: 'absolute',
    top: 0,
    zIndex: 24,
    height: CHART_H
  },
  cashTip: {
    position: 'absolute',
    zIndex: 200,
    alignItems: 'center',
    minWidth: 108
  },
  cashTipCard: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: F.chartTooltipLight,
    borderWidth: 1,
    borderColor: F.chartTooltipBorder,
    ...figma.shadow.button,
    maxWidth: 220
  },
  cashTipDate: {
    fontSize: 10,
    fontWeight: '700',
    color: F.chartTextInk,
    marginBottom: 4,
    textAlign: 'center'
  },
  cashTipRow: {
    fontSize: 12,
    fontWeight: '600',
    color: F.chartTextInk,
    letterSpacing: 0.1
  },
  cashTipRowOut: {
    fontSize: 12,
    fontWeight: '600',
    color: F.chartTextSoft,
    marginTop: 2,
    letterSpacing: 0.1
  },
  cashTipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: F.chartTooltipLight,
    marginTop: -0.5
  },
  caption: { width: '100%', paddingTop: 6, alignItems: 'center' },
  captionText: {
    color: figma.color.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2
  },
  dayBarRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 16 },
  daySeg: { height: 16, alignItems: 'center', justifyContent: 'flex-end' },
  dayPip: {
    width: 5,
    minHeight: 2.5,
    borderRadius: 2,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden'
  },
  pipRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: F.chartBarRimLight,
    opacity: 0.9
  }
});
