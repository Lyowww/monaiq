import { Fragment, memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Point2 } from '../../lib/charts/viewPolyline';
import { yOnPolyline } from '../../lib/charts/chartGeometry';

type Props = {
  points: Point2[];
  padX: number;
  plotWidth: number;
  baselineY: number;
  color: string;
  /** Wider steps = fewer views, slightly faster. */
  stepPx?: number;
};

/**
 * Area under a polyline using vertical strips (no SVG) — soft “neon fill” look.
 */
export const ChartAreaStrips = memo(function ChartAreaStrips({
  points,
  padX,
  plotWidth,
  baselineY,
  color,
  stepPx = 2
}: Props) {
  if (points.length < 2 || plotWidth <= 2 * padX) {
    return null;
  }
  const xMax = plotWidth - padX;
  const strips: ReactNode[] = [];
  for (let x = Math.floor(padX); x <= Math.ceil(xMax); x += stepPx) {
    const y = yOnPolyline(points, x);
    const h = baselineY - y;
    if (h > 0.5) {
      strips.push(
        <View
          key={x}
          style={[
            styles.strip,
            {
              left: x,
              top: y,
              width: stepPx,
              height: h,
              backgroundColor: color
            }
          ]}
        />
      );
    }
  }
  return <Fragment>{strips}</Fragment>;
});

const styles = StyleSheet.create({
  strip: {
    position: 'absolute'
  }
});
