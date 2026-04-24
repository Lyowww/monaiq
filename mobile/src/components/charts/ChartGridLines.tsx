import { StyleSheet, View } from 'react-native';

type Props = {
  width: number;
  height: number;
  padX: number;
  padY: number;
  /** Horizontal dividers inside the plot (not on top/bottom edge). */
  segments?: number;
  color?: string;
};

/**
 * Faint horizontal grid for chart readability (finance-app baseline).
 */
export function ChartGridLines({
  width,
  height,
  padX,
  padY,
  segments = 4,
  color = 'rgba(61, 70, 63, 0.12)'
}: Props) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const innerH = Math.max(1, h - 2 * padY);
  const lines = Math.max(0, segments - 1);

  if (w <= 0 || h <= 0 || lines === 0) {
    return null;
  }

  return (
    <View style={[styles.wrap, { width: w, height: h }]} pointerEvents="none">
      {Array.from({ length: lines }, (_, i) => {
        const t = (i + 1) / segments;
        const y = padY + t * innerH;
        return (
          <View
            key={`g-${i}`}
            style={[
              styles.line,
              {
                left: padX,
                width: Math.max(0, w - 2 * padX),
                top: y,
                backgroundColor: color
              }
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, top: 0, zIndex: 0 },
  line: { position: 'absolute', height: StyleSheet.hairlineWidth }
});
