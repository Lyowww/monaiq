import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TransactionRecord } from '@ai-finance/shared-types';
import { dailyCreditDebitSeries } from '../../lib/analytics/periodMetrics';
import { formatAmdAxisCompact, formatAmdFromMinor } from '../../lib/format/currency';
import { translate } from '../../locales/i18n';
import { useUiStore } from '../../features/ui/store/useUiStore';
import { figma } from '../../theme/figma';
import { ChartGridLines } from './ChartGridLines';

const CHART_H = 168;
const PAD_X = 8;
const PAD_Y = 18;
const Y_GUTTER = 40;
const WELL_RADIUS = 20;

const L = figma.color;

type Props = {
  days: number;
  transactions: TransactionRecord[];
  width: number;
  style?: ViewStyle;
  /** 0 = no edge dimming */
  fadeStrength?: number;
};

export function SpendingSparkline({ days, transactions, width, style, fadeStrength = 0 }: Props) {
  const appLanguage = useUiStore((s) => s.appLanguage);
  const w = width > 0 ? width : 0;
  const plotW = Math.max(0, w - Y_GUTTER);
  const [selected, setSelected] = useState<number | null>(null);

  const { debits: values, labels } = useMemo(
    () => dailyCreditDebitSeries(transactions, days),
    [transactions, days]
  );

  const n = values.length;

  const stats = useMemo(() => {
    const maxV = Math.max(0, ...values);
    const positives = values.filter((v) => v > 0);
    const minV = positives.length > 0 ? Math.min(...positives) : 0;
    const sum = values.reduce((a, b) => a + b, 0);
    let maxI = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i]! >= values[maxI]!) {
        maxI = i;
      }
    }
    return { maxV, minV, sum, hasData: sum > 0, maxI };
  }, [values]);

  const innerH = Math.max(1, CHART_H - 2 * PAD_Y);
  const baselineY = PAD_Y + innerH;

  const yTicks = useMemo(() => {
    const maxV = stats.maxV;
    if (maxV <= 0) {
      return [{ v: 0, y: baselineY }];
    }
    return [0, 1, 2, 3, 4].map((k) => {
      const t = k / 4;
      const v = maxV * (1 - t);
      const y = PAD_Y + t * innerH;
      return { v, y };
    });
  }, [stats.maxV, baselineY, innerH]);

  const xLead = labels[0] ?? '';
  const xTrail = labels[labels.length - 1] ?? xLead;

  const barLayout = useMemo(() => {
    if (n <= 0 || plotW <= 0) {
      return { slot: 0, barW: 0, innerPlot: 0, bars: [] as { h: number; left: number; top: number; key: string }[] };
    }
    const innerPlot = plotW - 2 * PAD_X;
    const slot = innerPlot / n;
    const barW = Math.max(1.5, Math.min(slot * 0.9, slot * 1.05));
    const bars = values.map((v, i) => {
      const h = stats.maxV > 0 ? Math.max(0, (v / stats.maxV) * innerH) * (v > 0 ? 1 : 0) : 0;
      const slotLeft = PAD_X + i * slot;
      const left = slotLeft + (slot - barW) / 2;
      const top = baselineY - h;
      return { h, left, top, key: `b-${i}` };
    });
    return { slot, barW, innerPlot, bars };
  }, [n, plotW, values, stats.maxV, innerH, baselineY]);

  const onBarPress = (i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  };

  const selBar = selected != null ? barLayout.bars[selected] : null;
  const centerX = selBar ? selBar.left + barLayout.barW / 2 : 0;
  const tooltipLeft = Math.min(
    Math.max(PAD_X, centerX - 48),
    plotW - PAD_X - 96
  );
  const tooltipTop = selBar
    ? Math.max(PAD_Y, selBar.top - 52)
    : PAD_Y;

  return (
    <View style={[{ width: w }, style]}>
      <View style={styles.well}>
        <LinearGradient
          colors={[L.chartSurfaceLight, L.chartSurfaceLight2, L.chartSurfaceLight]}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.15, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.6)', 'rgba(212, 175, 55, 0.04)', 'transparent']}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.3, y: 0 }}
          style={[StyleSheet.absoluteFill, { opacity: 1 }]}
        />

        {fadeStrength > 0 ? (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.vignetteRow]}>
            <View style={[styles.vL, { opacity: 0.04 * fadeStrength, width: w * 0.06 }]} />
            <View style={{ flex: 1 }} />
            <View style={[styles.vR, { opacity: 0.04 * fadeStrength, width: w * 0.06 }]} />
          </View>
        ) : null}

        <View style={styles.plotBlock}>
          <View style={[styles.yGutter, { height: CHART_H }]}>
            {yTicks.map((tk, i) => (
              <Text
                key={`y-${i}`}
                numberOfLines={1}
                style={[
                  styles.yLabel,
                  {
                    top: tk.y - 8
                  }
                ]}
              >
                {formatAmdAxisCompact(Math.round(tk.v))}
              </Text>
            ))}
          </View>

          <View style={{ width: plotW, height: CHART_H, position: 'relative' }}>
            <ChartGridLines
              color={L.chartGridLight}
              height={CHART_H}
              padX={PAD_X}
              padY={PAD_Y}
              segments={5}
              width={plotW}
            />

            <View
              style={{
                position: 'absolute',
                left: PAD_X,
                top: baselineY,
                width: plotW - 2 * PAD_X,
                height: StyleSheet.hairlineWidth,
                backgroundColor: 'rgba(26, 31, 43, 0.1)',
                zIndex: 1
              }}
            />

            {barLayout.bars.map((b, i) => (
              <View
                key={b.key}
                pointerEvents="box-none"
                style={[
                  styles.barCol,
                  {
                    left: b.left,
                    top: b.top,
                    width: barLayout.barW,
                    height: Math.max(0, b.h),
                    zIndex: 2 + i
                  }
                ]}
              >
                {b.h > 0.5 ? (
                  <>
                    <LinearGradient
                      colors={[
                        L.chartBarBaseLight,
                        L.chartBarMidLight,
                        L.chartBarSageLight,
                        L.chartBarTopLight
                      ]}
                      locations={[0, 0.32, 0.68, 1]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0.5, y: 1 }}
                      end={{ x: 0.5, y: 0 }}
                    />
                    <View
                      style={[
                        styles.barRim,
                        { opacity: selected === i ? 1 : 0.85 }
                      ]}
                    />
                    {selected === i ? <View style={styles.barSelectRing} /> : null}
                  </>
                ) : null}
              </View>
            ))}

            {n > 0 && barLayout.slot > 0
              ? Array.from({ length: n }, (_, i) => {
                  const left = PAD_X + i * barLayout.slot;
                  return (
                    <Pressable
                      key={`hit-${i}`}
                      accessibilityRole="button"
                      accessibilityLabel={
                        labels[i] ? `${labels[i]} · ${formatAmdFromMinor(values[i]!)}` : formatAmdFromMinor(values[i]!)
                      }
                      onPress={() => onBarPress(i)}
                      style={({ pressed }) => [
                        styles.hitStrip,
                        {
                          left,
                          width: barLayout.slot,
                          opacity: pressed ? 0.45 : 1
                        }
                      ]}
                    />
                  );
                })
              : null}

            {selected != null && stats.hasData && selBar && selBar.h > 0.5 ? (
              <View
                style={[
                  styles.tooltip,
                  {
                    left: tooltipLeft,
                    top: tooltipTop
                  }
                ]}
                pointerEvents="none"
              >
                <View style={styles.tooltipCard}>
                  <Text style={styles.tooltipDate}>{labels[selected] ?? '—'}</Text>
                  <Text style={styles.tooltipAmt}>{formatAmdFromMinor(values[selected]!)}</Text>
                </View>
                <View style={styles.tooltipArrow} />
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.xAxisInner, { paddingLeft: Y_GUTTER + 2 }]}>
          <Text style={styles.xAxisLbl} numberOfLines={1}>
            {xLead}
          </Text>
          <Text style={styles.xAxisHint} numberOfLines={1}>
            {translate(appLanguage, 'stats.chartAxisHint')}
          </Text>
          <Text style={[styles.xAxisLbl, styles.xAxisLblRight]} numberOfLines={1}>
            {xTrail}
          </Text>
        </View>
      </View>

      {stats.hasData ? (
        <>
          <View style={styles.footer}>
            <Text style={styles.footerLabel} numberOfLines={1}>
              {translate(appLanguage, 'stats.sparklinePeak', { amt: formatAmdFromMinor(stats.maxV) })}
            </Text>
            <Text style={[styles.footerLabel, styles.footerRight]} numberOfLines={1}>
              {translate(appLanguage, 'stats.sparklineLow', { amt: formatAmdFromMinor(stats.minV) })}
            </Text>
          </View>
          <Text style={styles.tapHint}>{translate(appLanguage, 'stats.chartTapHint')}</Text>
        </>
      ) : (
        <Text style={styles.footerHint}>{translate(appLanguage, 'stats.sparklineNoSpend')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    position: 'relative',
    borderRadius: WELL_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: L.chartStrokeLight,
    overflow: 'hidden',
    paddingBottom: 2,
    backgroundColor: L.chartSurfaceLight,
    ...figma.shadow.button
  },
  plotBlock: { flexDirection: 'row', alignItems: 'flex-start' },
  yGutter: {
    width: Y_GUTTER,
    position: 'relative',
    marginRight: 0
  },
  yLabel: {
    position: 'absolute',
    right: 2,
    left: 0,
    fontSize: 9,
    fontWeight: '600',
    color: L.chartTextInk,
    textAlign: 'right',
    letterSpacing: 0.04,
    opacity: 0.75
  },
  xAxisInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 26,
    paddingTop: 4,
    paddingRight: 10,
    paddingBottom: 8
  },
  xAxisLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: L.chartTextInk,
    letterSpacing: 0.12,
    minWidth: 32,
    opacity: 0.8
  },
  xAxisLblRight: { textAlign: 'right' },
  xAxisHint: {
    fontSize: 9,
    fontWeight: '500',
    color: L.chartTextSoft,
    letterSpacing: 0.15,
    flex: 1,
    textAlign: 'center'
  },
  vignetteRow: {
    flexDirection: 'row',
    zIndex: 3
  },
  vL: {
    backgroundColor: L.chartTextInk,
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    alignSelf: 'stretch'
  },
  vR: {
    backgroundColor: L.chartTextInk,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    alignSelf: 'stretch'
  },
  barCol: {
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden'
  },
  barRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: L.chartBarRimLight
  },
  barSelectRing: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.65)',
    zIndex: 2
  },
  hitStrip: {
    position: 'absolute',
    top: 0,
    zIndex: 30,
    height: CHART_H
  },
  tooltip: {
    position: 'absolute',
    zIndex: 200,
    alignItems: 'center',
    minWidth: 96
  },
  tooltipCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: L.chartTooltipLight,
    borderWidth: 1,
    borderColor: L.chartTooltipBorder,
    ...figma.shadow.button,
    maxWidth: 200,
    alignItems: 'center'
  },
  tooltipDate: {
    fontSize: 10,
    fontWeight: '600',
    color: L.chartTextSoft,
    marginBottom: 2,
    letterSpacing: 0.2
  },
  tooltipAmt: {
    fontSize: 15,
    fontWeight: '800',
    color: L.chartTextInk,
    letterSpacing: 0.1
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: L.chartTooltipLight,
    marginTop: -0.5
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: figma.color.textMuted,
    letterSpacing: 0.12,
    flex: 1
  },
  footerRight: { textAlign: 'right' },
  tapHint: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '500',
    color: L.chartTextSoft,
    textAlign: 'center',
    letterSpacing: 0.15
  },
  footerHint: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '500',
    color: figma.color.textMuted,
    textAlign: 'center',
    opacity: 0.85
  }
});
