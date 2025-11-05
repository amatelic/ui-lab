// https://devouringdetails.com/principles/simulating-physics
export function dampen(
  val: number,
  [min, max]: [number, number],
  factor: number = 2,
): number {
  if (val > max) {
    return damp(val, max, factor);
  } else if (val < min) {
    return damp(val, min, factor);
  } else {
    return val;
  }
}

function damp(val: number, dist: number, factor: number): number {
  const extra = val - dist;
  const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
  return dist + dampenedExtra * factor;
}
