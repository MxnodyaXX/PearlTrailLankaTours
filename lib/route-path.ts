import type { MapPoint } from "./packages-data";

/** Centripetal Catmull-Rom → cubic bézier path. Passes through every point and
 *  doesn't overshoot at sharp turns. Shared by the live map + the admin editor. */
export function smoothPath(raw: MapPoint[]): string {
  const pts = raw.filter((p, i) => i === 0 || p.x !== raw[i - 1].x || p.y !== raw[i - 1].y);
  const n = pts.length;
  if (n < 2) return n ? `M ${pts[0].x},${pts[0].y}` : "";

  const A = 0.5;
  const EPS = 1e-6;
  const dpow = (a: MapPoint, b: MapPoint) => Math.pow(Math.hypot(b.x - a.x, b.y - a.y), A);

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const t01 = dpow(p0, p1), t12 = dpow(p1, p2), t23 = dpow(p2, p3);

    let m1x: number, m1y: number, m2x: number, m2y: number;
    if (t01 < EPS) { m1x = p2.x - p1.x; m1y = p2.y - p1.y; }
    else {
      m1x = (p2.x - p1.x) + t12 * ((p1.x - p0.x) / t01 - (p2.x - p0.x) / (t01 + t12));
      m1y = (p2.y - p1.y) + t12 * ((p1.y - p0.y) / t01 - (p2.y - p0.y) / (t01 + t12));
    }
    if (t23 < EPS) { m2x = p2.x - p1.x; m2y = p2.y - p1.y; }
    else {
      m2x = (p2.x - p1.x) + t12 * ((p3.x - p2.x) / t23 - (p3.x - p1.x) / (t12 + t23));
      m2y = (p2.y - p1.y) + t12 * ((p3.y - p2.y) / t23 - (p3.y - p1.y) / (t12 + t23));
    }
    const c1x = p1.x + m1x / 3, c1y = p1.y + m1y / 3;
    const c2x = p2.x - m2x / 3, c2y = p2.y - m2y / 3;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}
