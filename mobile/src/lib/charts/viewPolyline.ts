import type { ColorValue, ViewStyle } from 'react-native';

export type Point2 = { x: number; y: number };

/** Insert points between consecutive samples so line segments look smoother. */
export function densifyLinear(points: Point2[], nPerSeg: number): Point2[] {
  if (points.length < 2) {
    return points;
  }
  const out: Point2[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    out.push(a);
    for (let s = 1; s <= nPerSeg; s++) {
      const t = s / (nPerSeg + 1);
      out.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
    }
  }
  out.push(points[points.length - 1]!);
  return out;
}

/**
 * Renders a polyline as thin rotated Views (no react-native-svg — avoids topSvgLayout / native issues).
 * Segments are centered between endpoints so they meet cleanly.
 */
export function segmentStyle(
  a: Point2,
  b: Point2,
  color: ColorValue,
  strokeWidth: number
): ViewStyle {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) {
    return { position: 'absolute', width: 0, height: 0, opacity: 0 };
  }
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  return {
    position: 'absolute',
    left: midX - len / 2,
    top: midY - strokeWidth / 2,
    width: len,
    height: strokeWidth,
    borderRadius: strokeWidth / 2,
    backgroundColor: color,
    transform: [{ rotate: `${deg}deg` }]
  };
}

export function dotStyle(
  p: Point2,
  r: number,
  color: ColorValue,
  opts?: { ring?: boolean; ringColor?: ColorValue; ringWidth?: number }
): ViewStyle {
  const ring = opts?.ring ?? false;
  const rw = opts?.ringWidth ?? 2;
  return {
    position: 'absolute',
    left: p.x - r,
    top: p.y - r,
    width: 2 * r,
    height: 2 * r,
    borderRadius: r,
    backgroundColor: color,
    borderWidth: ring ? rw : 0,
    borderColor: ring ? (opts?.ringColor ?? 'rgba(245, 245, 242, 0.95)') : 'transparent'
  };
}
