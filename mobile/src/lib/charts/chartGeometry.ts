import type { Point2 } from './viewPolyline';

/** Linear interpolate Y along the polyline at pixel X (for area-under-line fills). */
export function yOnPolyline(pts: Point2[], x: number): number {
  if (pts.length === 0) {
    return 0;
  }
  if (pts.length === 1) {
    return pts[0]!.y;
  }
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  if (x <= first.x) {
    return first.y;
  }
  if (x >= last.x) {
    return last.y;
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if (x >= a.x && x <= b.x) {
      const run = b.x - a.x || 0.001;
      const t = (x - a.x) / run;
      return a.y + t * (b.y - a.y);
    }
  }
  return last.y;
}
