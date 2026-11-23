// Tiny scale + formatting helpers shared by server and client charts.

export function linear([d0, d1], [r0, r1]) {
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const f = (x) => r0 + (x - d0) * k;
  f.invert = (y) => (k === 0 ? d0 : d0 + (y - r0) / k);
  return f;
}

export function logScale([d0, d1], [r0, r1]) {
  const l0 = Math.log(d0);
  const l1 = Math.log(d1);
  const k = (r1 - r0) / (l1 - l0);
  const f = (x) => r0 + (Math.log(x) - l0) * k;
  f.invert = (y) => Math.exp(l0 + (y - r0) / k);
  return f;
}

export function niceTicks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  const span = max - min;
  const raw = span / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const start = Math.ceil(min / step - 1e-9) * step;
  const out = [];
  for (let v = start; v <= max + step * 1e-9; v += step) out.push(Math.round(v / step) * step);
  return out;
}

export function extent(values, pad = 0) {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of values) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const p = (hi - lo) * pad;
  return [lo - p, hi + p];
}

// Formatters are referenced by name so server components can configure client charts.
export const formats = {
  num0: (v) => v.toLocaleString('en-US', { maximumFractionDigits: 0 }),
  num1: (v) => v.toFixed(1),
  num2: (v) => v.toFixed(2),
  num3: (v) => v.toFixed(3),
  usd2: (v) => `$${v.toFixed(2)}`,
  pct0: (v) => `${(v * 100).toFixed(0)}%`,
  pct1: (v) => `${(v * 100).toFixed(1)}%`,
  pctPts1: (v) => `${v.toFixed(1)}%`,
  signedPctPts1: (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`,
  signedPct1: (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(1)}%`,
  days: (v) => (v >= 365 ? `${(v / 365).toFixed(v >= 730 ? 0 : 1)}y` : `${Math.round(v)}d`),
  year: (v) => String(Math.round(v)),
  logm: (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`,
};

export const fmtBy = (name) => formats[name] || formats.num2;

// Rounded data-end bar path, square at the baseline (4px radius by default).
export function barPath(x, w, y0, y1, r = 4) {
  const up = y1 < y0;
  const h = Math.abs(y0 - y1);
  const rr = Math.min(r, w / 2, h);
  if (h < 0.5) return '';
  if (up) {
    return `M${x},${y0}V${y1 + rr}Q${x},${y1} ${x + rr},${y1}H${x + w - rr}Q${x + w},${y1} ${x + w},${y1 + rr}V${y0}Z`;
  }
  return `M${x},${y0}V${y1 - rr}Q${x},${y1} ${x + rr},${y1}H${x + w - rr}Q${x + w},${y1} ${x + w},${y1 - rr}V${y0}Z`;
}
