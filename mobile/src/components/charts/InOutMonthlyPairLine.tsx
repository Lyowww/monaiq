import { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { seriesToPoints } from '../../lib/charts/linePath';
import { dotStyle, segmentStyle } from '../../lib/charts/viewPolyline';
import { figma } from '../../theme/figma';

const H = 56;
const PAD = 6;
const STROKE = 2.5;

type Props = {
  inflowMinor: number;
  outflowMinor: number;
  caption: string;
  inLabel: string;
  outLabel: string;
  width: number;
  style?: ViewStyle;
};

/**
 * This month: inflow vs outflow as a two-point line (left = in, right = out).
 */
export function InOutMonthlyPairLine({ inflowMinor, outflowMinor, caption, inLabel, outLabel, width, style }: Props) {
  const w = Math.max(0, width);
  const pts = useMemo(
    () => seriesToPoints([inflowMinor, outflowMinor], w, H, PAD, PAD),
    [inflowMinor, outflowMinor, w]
  );
  const a = pts[0];
  const b = pts[1];

  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.caption}>{caption}</Text>
      <View style={styles.endLabels}>
        <Text style={styles.endL}>{inLabel}</Text>
        <Text style={styles.endR}>{outLabel}</Text>
      </View>
      <View style={[styles.svgBox, { width: w, height: H }]} pointerEvents="none" collapsable={false}>
        {a && b ? (
          <>
            <View style={segmentStyle(a, b, 'rgba(212, 175, 55, 0.2)', STROKE * 2.2)} />
            <View style={segmentStyle(a, b, figma.color.accentGold, STROKE)} />
          </>
        ) : null}
        {a ? <View style={dotStyle(a, 3.5, figma.color.accentGold)} /> : null}
        {b ? <View style={dotStyle(b, 3.5, figma.color.chartOut)} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  caption: { color: figma.color.textMuted, fontSize: 12, marginBottom: 2, fontWeight: '600' },
  endLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  endL: { fontSize: 11, color: figma.color.textLabel, fontWeight: '600' },
  endR: { fontSize: 11, color: figma.color.textLabel, fontWeight: '600' },
  svgBox: { marginTop: 2, position: 'relative' }
});
