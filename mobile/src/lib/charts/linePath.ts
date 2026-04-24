/**
 * Build pixel coordinates for a 1D series (bottom = high value area in screen coords: y grows down).
 */
export function seriesToPoints(
  values: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): { x: number; y: number }[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }
  const max = Math.max(1, ...values);
  const innerW = Math.max(1, width - 2 * padX);
  const innerH = Math.max(1, height - 2 * padY);
  return values.map((v, i) => {
    const x = padX + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
    const y = padY + innerH - (v / max) * innerH;
    return { x, y };
  });
}

/** Same X layout as `seriesToPoints`, but Y is scaled by a shared `maxValue` (for overlaying two series). */
export function seriesToPointsWithMax(
  values: number[],
  maxValue: number,
  width: number,
  height: number,
  padX: number,
  padY: number
): { x: number; y: number }[] {
  const n = values.length;
  if (n === 0) {
    return [];
  }
  const max = Math.max(1, maxValue);
  const innerW = Math.max(1, width - 2 * padX);
  const innerH = Math.max(1, height - 2 * padY);
  return values.map((v, i) => {
    const x = padX + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
    const y = padY + innerH - (v / max) * innerH;
    return { x, y };
  });
}
