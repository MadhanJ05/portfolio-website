// Small, dependency-free quant library used by the interactive pieces.
// The methods mirror the options-lab and strategy-search repos so the site's
// numbers can be checked against them.

const SQRT2PI = Math.sqrt(2 * Math.PI);

export function normPdf(x) {
  return Math.exp(-0.5 * x * x) / SQRT2PI;
}

// Complementary error function, Numerical Recipes erfcc (fractional error < 1.2e-7).
function erfc(x) {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z - 1.26551223 +
        t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
        t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
}

export function normCdf(x) {
  return 0.5 * erfc(-x / Math.SQRT2);
}

// Inverse normal CDF (Acklam's algorithm, relative error ~1e-9).
export function normInv(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - lo) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// Seeded PRNG (mulberry32) + Box-Muller, so Monte Carlo runs are reproducible.
export function rng(seed = 42) {
  let s = seed >>> 0;
  const uniform = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare = null;
  const normal = () => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    while (u === 0) u = uniform();
    const v = uniform();
    const m = Math.sqrt(-2 * Math.log(u));
    spare = m * Math.sin(2 * Math.PI * v);
    return m * Math.cos(2 * Math.PI * v);
  };
  return { uniform, normal };
}

// ---------- Options ----------

/**
 * Black-Scholes-Merton price and Greeks.
 * Units: vega per 1 vol point, theta per calendar day, rho per 1% rate move.
 */
export function blackScholes({ S, K, T, r, q = 0, sigma, type = 'call' }) {
  const call = type === 'call';
  if (T <= 0 || sigma <= 0) {
    const intrinsic = Math.max(call ? S - K : K - S, 0);
    const itm = call ? S > K : S < K;
    return { price: intrinsic, delta: itm ? (call ? 1 : -1) : 0, gamma: 0, vega: 0, theta: 0, rho: 0 };
  }
  const sqT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqT);
  const d2 = d1 - sigma * sqT;
  const dq = Math.exp(-q * T);
  const dr = Math.exp(-r * T);
  const pdf = normPdf(d1);
  const price = call
    ? S * dq * normCdf(d1) - K * dr * normCdf(d2)
    : K * dr * normCdf(-d2) - S * dq * normCdf(-d1);
  const delta = call ? dq * normCdf(d1) : -dq * normCdf(-d1);
  const gamma = (dq * pdf) / (S * sigma * sqT);
  const vega = (S * dq * pdf * sqT) / 100;
  const thetaYear = call
    ? (-S * dq * pdf * sigma) / (2 * sqT) - r * K * dr * normCdf(d2) + q * S * dq * normCdf(d1)
    : (-S * dq * pdf * sigma) / (2 * sqT) + r * K * dr * normCdf(-d2) - q * S * dq * normCdf(-d1);
  const rho = call ? (K * T * dr * normCdf(d2)) / 100 : (-K * T * dr * normCdf(-d2)) / 100;
  return { price, delta, gamma, vega, theta: thetaYear / 365, rho };
}

/** Cox-Ross-Rubinstein binomial tree (European or American). */
export function binomial({ S, K, T, r, q = 0, sigma, type = 'call', steps = 500, american = false }) {
  const call = type === 'call';
  if (T <= 0 || sigma <= 0) return Math.max(call ? S - K : K - S, 0);
  const dt = T / steps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp((r - q) * dt) - d) / (u - d);
  const disc = Math.exp(-r * dt);
  const v = new Float64Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    const ST = S * Math.pow(u, steps - i) * Math.pow(d, i);
    v[i] = Math.max(call ? ST - K : K - ST, 0);
  }
  for (let n = steps - 1; n >= 0; n--) {
    for (let i = 0; i <= n; i++) {
      let cont = disc * (p * v[i] + (1 - p) * v[i + 1]);
      if (american) {
        const Sn = S * Math.pow(u, n - i) * Math.pow(d, i);
        cont = Math.max(cont, call ? Sn - K : K - Sn);
      }
      v[i] = cont;
    }
  }
  return v[0];
}

/**
 * Monte Carlo price of a European option with antithetic variates and the
 * discounted terminal stock price as a control variate (known mean S·e^{-qT}).
 */
export function monteCarlo({ S, K, T, r, q = 0, sigma, type = 'call', paths = 50000, seed = 7 }) {
  const call = type === 'call';
  const { normal } = rng(seed);
  const pairs = Math.max(1, Math.floor(paths / 2));
  const drift = (r - q - 0.5 * sigma * sigma) * T;
  const vol = sigma * Math.sqrt(T);
  const dr = Math.exp(-r * T);
  const ys = new Float64Array(pairs);
  const xs = new Float64Array(pairs);
  let my = 0, mx = 0;
  for (let i = 0; i < pairs; i++) {
    const z = normal();
    const s1 = S * Math.exp(drift + vol * z);
    const s2 = S * Math.exp(drift - vol * z);
    const p1 = Math.max(call ? s1 - K : K - s1, 0);
    const p2 = Math.max(call ? s2 - K : K - s2, 0);
    ys[i] = (0.5 * (p1 + p2)) * dr;
    xs[i] = (0.5 * (s1 + s2)) * dr;
    my += ys[i];
    mx += xs[i];
  }
  my /= pairs;
  mx /= pairs;
  let cxy = 0, cxx = 0;
  for (let i = 0; i < pairs; i++) {
    cxy += (xs[i] - mx) * (ys[i] - my);
    cxx += (xs[i] - mx) ** 2;
  }
  const beta = cxx > 0 ? cxy / cxx : 0;
  const ex = S * Math.exp(-q * T);
  let mean = 0;
  const adj = new Float64Array(pairs);
  for (let i = 0; i < pairs; i++) {
    adj[i] = ys[i] - beta * (xs[i] - ex);
    mean += adj[i];
  }
  mean /= pairs;
  let v = 0;
  for (let i = 0; i < pairs; i++) v += (adj[i] - mean) ** 2;
  const se = Math.sqrt(v / (pairs - 1) / pairs);
  return { price: mean, se, paths: pairs * 2 };
}

// ---------- Backtest overfitting ----------

const EULER_GAMMA = 0.5772156649015329;

/** Sample variance (ddof = 1), matching the strategy-search repo. */
export function sampleVariance(xs) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
}

/**
 * Expected maximum Sharpe ratio among N skill-less trials (Bailey & López de Prado, 2014),
 * given the standard deviation of Sharpe ratios across trials. Same units in and out.
 */
export function expectedMaxSharpe(N, sdSharpe) {
  if (N <= 1) return 0;
  return sdSharpe * ((1 - EULER_GAMMA) * normInv(1 - 1 / N) + EULER_GAMMA * normInv(1 - 1 / (N * Math.E)));
}

/** Deflated (probabilistic) Sharpe ratio. All Sharpe inputs are per-period (daily). */
export function deflatedSharpe({ sr, sr0, T, skew, kurtosis }) {
  const z = ((sr - sr0) * Math.sqrt(T - 1)) / Math.sqrt(1 - skew * sr + ((kurtosis - 1) / 4) * sr * sr);
  return normCdf(z);
}

// ---------- Formatting ----------

export const fmt = {
  num: (x, d = 2) => (Number.isFinite(x) ? x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '–'),
  signed: (x, d = 2) => (Number.isFinite(x) ? `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(d)}` : '–'),
  pct: (x, d = 1) => (Number.isFinite(x) ? `${(x * 100).toFixed(d)}%` : '–'),
  int: (x) => Math.round(x).toLocaleString('en-US'),
};
