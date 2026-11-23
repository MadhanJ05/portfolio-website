'use client';

import { useEffect, useRef } from 'react';
import { normCdf, rng } from '@/lib/quant';

// Geometric Brownian motion, simulated live in the browser.
const S0 = 100;
const MU = 0.08;
const SIGMA = 0.22;
const T = 1;
const STEPS = 126;
const BINS = 52;
const ANALYTIC_MEAN = S0 * Math.exp(MU * T);
const PRICE_TICKS = [60, 100, 160];
const HINT_LONG = 'price ↑ · frequency →';
const HINT_SHORT = 'price ↑ · count →';
// Animation runs on the clock, not the frame count, so it is the same speed at 60Hz and 120Hz.
// A gold path crosses its simulated year in about 2.6–3.6 seconds.
const LIVE_SPEED_MIN = STEPS / 3.6; // steps per second
const LIVE_SPEED_MAX = STEPS / 2.6;
const BG_PATHS_PER_SEC = 150; // unseen paths that keep the estimate converging

function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function MonteCarloHero() {
  const canvasRef = useRef(null);
  const nRef = useRef(null);
  const meanRef = useRef(null);
  const zRef = useRef(null);
  const verdictRef = useRef(null);
  const readoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const accum = document.createElement('canvas');
    const actx = accum.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const css = getComputedStyle(document.documentElement);
    const [ar, ag, ab] = hexToRgb(css.getPropertyValue('--accent') || '#d9b97c');
    const [ir, ig, ib] = hexToRgb(css.getPropertyValue('--ink') || '#ece7dc');
    const accent = (a) => `rgba(${ar},${ag},${ab},${a})`;
    const ink = (a) => `rgba(${ir},${ig},${ib},${a})`;

    const { normal, uniform } = rng(20270104);
    const m = Math.log(S0) + (MU - 0.5 * SIGMA * SIGMA) * T;
    const s = SIGMA * Math.sqrt(T);
    const lnMin = m - 3.1 * s;
    const lnMax = m + 3.1 * s;
    const dt = T / STEPS;
    const drift = (MU - 0.5 * SIGMA * SIGMA) * dt;
    const vol = SIGMA * Math.sqrt(dt);

    let W = 0, H = 0, L = null;
    let raf = 0, running = false, onScreen = true, lastReadout = 0, commits = 0, lastT = 0, bgDue = 0;
    let n = 0, sum = 0, sumSq = 0;
    let hist = new Float64Array(BINS);
    let live = [];

    const X = (k) => L.x0 + (k / STEPS) * (L.x1 - L.x0);
    const Y = (lnS) => L.y1 - ((lnS - lnMin) / (lnMax - lnMin)) * (L.y1 - L.y0);

    const simulate = () => {
      const p = new Float32Array(STEPS + 1);
      let x = Math.log(S0);
      p[0] = x;
      for (let k = 1; k <= STEPS; k++) {
        x += drift + vol * normal();
        p[k] = x;
      }
      return p;
    };

    const spawn = (progress = 0) => ({
      p: simulate(),
      k: progress,
      speed: LIVE_SPEED_MIN + uniform() * (LIVE_SPEED_MAX - LIVE_SPEED_MIN),
    });

    const record = (p) => {
      const lnST = p[STEPS];
      const ST = Math.exp(lnST);
      n++;
      sum += ST;
      sumSq += ST * ST;
      const bi = Math.floor(((lnST - lnMin) / (lnMax - lnMin)) * BINS);
      if (bi >= 0 && bi < BINS) hist[bi]++;
    };

    const strokePath = (c, p, upTo) => {
      c.beginPath();
      c.moveTo(X(0), Y(p[0]));
      const end = Math.min(STEPS, Math.floor(upTo));
      for (let k = 1; k <= end; k++) c.lineTo(X(k), Y(p[k]));
      c.stroke();
    };

    const commit = (p, alpha) => {
      actx.strokeStyle = ink(alpha);
      actx.lineWidth = 1;
      strokePath(actx, p, STEPS);
      record(p);
      commits++;
      // Let old paths fade so the fan never saturates.
      if (commits % 140 === 0) {
        actx.globalCompositeOperation = 'destination-out';
        actx.fillStyle = 'rgba(0,0,0,0.12)';
        actx.fillRect(0, 0, W, H);
        actx.globalCompositeOperation = 'source-over';
      }
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [canvas, accum]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      actx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = W < 768;
      // Keep the plot's bottom labels clear of the readout box (shown at 1024px and up).
      let plotBottom = H * 0.66;
      const ro = readoutRef.current;
      if (ro && ro.offsetParent !== null) {
        plotBottom = Math.min(plotBottom, ro.getBoundingClientRect().top - rect.top - 36);
      }
      // Start the fan just past the end of the name so gold paths never cross the gold type.
      let nameRight = W * 0.4;
      const nameEl = document.getElementById('hero-name');
      if (nameEl) {
        const range = document.createRange();
        range.selectNodeContents(nameEl);
        for (const r of range.getClientRects()) nameRight = Math.max(nameRight, r.right - rect.left);
      }
      L = mobile
        ? { x0: W * 0.05, x1: W * 0.76, hx0: W * 0.79, hx1: W * 0.97, y0: H * 0.07, y1: H * 0.42, faint: 0.035, live: 4, labels: false, quiet: true }
        : {
            x0: Math.min(Math.max(nameRight + 56, W * 0.46), W * 0.62),
            x1: W * 0.835,
            hx0: W * 0.855,
            hx1: W * 0.952,
            y0: Math.max(H * 0.14, 110), // leaves room for the histogram title below the 64px nav
            y1: plotBottom,
            faint: 0.055,
            live: 8,
            labels: true,
            quiet: false,
          };
      n = 0; sum = 0; sumSq = 0; commits = 0;
      hist = new Float64Array(BINS);
      actx.clearRect(0, 0, W, H);
      const prefill = reduce ? 700 : mobile ? 220 : 380;
      for (let i = 0; i < prefill; i++) commit(simulate(), L.faint);
      // Start the gold paths at staggered points so they don't all set off together.
      live = reduce ? [] : Array.from({ length: L.live }, () => spawn(uniform() * STEPS * 0.85));
    };

    const drawChrome = () => {
      // S0 reference + time labels: just enough axis to read it as a chart.
      const yS0 = Y(Math.log(S0));
      ctx.strokeStyle = ink(0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(L.x0, Math.round(yS0) + 0.5);
      ctx.lineTo(L.x1, Math.round(yS0) + 0.5);
      ctx.stroke();
      if (!L.labels) return;
      ctx.font = '10.5px ' + (css.getPropertyValue('--font-mono') || 'monospace');
      // Shared price axis: faint guides through paths and histogram, values on the right edge.
      for (const price of PRICE_TICKS) {
        const y = Math.round(Y(Math.log(price))) + 0.5;
        ctx.strokeStyle = ink(price === S0 ? 0.12 : 0.06);
        ctx.beginPath();
        ctx.moveTo(price === S0 ? L.x1 : L.x0, y);
        ctx.lineTo(L.hx1 + 6, y);
        ctx.stroke();
        ctx.fillStyle = ink(0.42);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(price), L.hx1 + 10, y);
      }
      ctx.fillStyle = ink(0.42);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('S₀ = 100', L.x0 - 10, yS0);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('t = 0', L.x0, L.y1 + 18);
      ctx.textAlign = 'right';
      ctx.fillText('T = 1y', L.x1, L.y1 + 18);
      // Histogram title sits above the panel; below it is the live readout.
      ctx.textAlign = 'left';
      ctx.fillText('S_T distribution', L.hx0, L.y0 - 36);
      const hint = ctx.measureText(HINT_LONG).width <= W - L.hx0 - 8 ? HINT_LONG : HINT_SHORT;
      ctx.fillStyle = ink(0.3);
      ctx.fillText(hint, L.hx0, L.y0 - 21);
    };

    const drawHistogram = () => {
      let maxC = 0;
      const expected = new Float64Array(BINS);
      for (let i = 0; i < BINS; i++) {
        maxC = Math.max(maxC, hist[i]);
        const lo = lnMin + (i / BINS) * (lnMax - lnMin);
        const hi = lnMin + ((i + 1) / BINS) * (lnMax - lnMin);
        expected[i] = n * (normCdf((hi - m) / s) - normCdf((lo - m) / s));
      }
      const scale = Math.max(maxC, ...expected) || 1;
      const bh = (L.y1 - L.y0) / BINS;
      const width = L.hx1 - L.hx0;
      ctx.fillStyle = accent(L.quiet ? 0.2 : 0.38);
      for (let i = 0; i < BINS; i++) {
        if (!hist[i]) continue;
        const y = L.y1 - (i + 1) * bh;
        ctx.fillRect(L.hx0, y + 0.5, (hist[i] / scale) * width, Math.max(1, bh - 1.5));
      }
      // Analytic lognormal density, scaled to the same counts.
      ctx.strokeStyle = ink(L.quiet ? 0.35 : 0.75);
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i < BINS; i++) {
        const x = L.hx0 + (expected[i] / scale) * width;
        const y = L.y1 - (i + 0.5) * bh;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(accum, 0, 0, W, H);
      drawChrome();
      drawHistogram();
      for (const lp of live) {
        ctx.strokeStyle = L.quiet ? ink(0.45) : accent(0.9);
        ctx.lineWidth = L.quiet ? 1.1 : 1.4;
        strokePath(ctx, lp.p, lp.k);
        const k = Math.min(STEPS, Math.floor(lp.k));
        ctx.fillStyle = L.quiet ? ink(0.7) : accent(1);
        ctx.beginPath();
        ctx.arc(X(k), Y(lp.p[k]), 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const updateReadout = () => {
      if (!nRef.current || n < 2) return;
      const mean = sum / n;
      const se = Math.sqrt(Math.max(0, sumSq / n - mean * mean) / (n - 1));
      const z = Math.abs(mean - ANALYTIC_MEAN) / se;
      nRef.current.textContent = n.toLocaleString('en-US');
      meanRef.current.textContent = `${mean.toFixed(2)} ± ${se.toFixed(2)}`;
      zRef.current.textContent = z.toFixed(2);
      // Plain-English verdict: within two standard errors of the closed form.
      const ok = z <= 2;
      verdictRef.current.textContent = ok ? '✓ matches theory' : 'converging…';
      verdictRef.current.dataset.ok = ok ? 'true' : 'false';
    };

    const frame = (t) => {
      raf = 0;
      if (!running) return;
      // Seconds since the last frame; capped so a stalled frame doesn't make paths jump.
      const dt = lastT ? Math.min(t - lastT, 50) / 1000 : 1 / 60;
      lastT = t;
      while (live.length < L.live) live.push(spawn());
      for (let i = live.length - 1; i >= 0; i--) {
        live[i].k += live[i].speed * dt;
        if (live[i].k >= STEPS) {
          commit(live[i].p, L.faint);
          live.splice(i, 1);
        }
      }
      // Background paths: keep the estimate converging faster than the eye can follow.
      bgDue += BG_PATHS_PER_SEC * dt;
      while (bgDue >= 1) {
        commit(simulate(), L.faint * 0.5);
        bgDue -= 1;
      }
      render();
      if (t - lastReadout > 250) {
        lastReadout = t;
        updateReadout();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce || !onScreen || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      lastT = 0; // resume without a time jump after the tab or section was hidden
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    render();
    updateReadout();
    start();

    // The display face swaps in after first paint; re-measure the name once it has.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      setup();
      render();
      updateReadout();
    });

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    let lastW = W, lastH = H, resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const r = canvas.getBoundingClientRect();
        if (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 80) return;
        lastW = r.width;
        lastH = r.height;
        setup();
        render();
        updateReadout();
      }, 160);
    });
    ro.observe(canvas);

    return () => {
      alive = false;
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <p className="sr-only">
        Background: a live Monte Carlo simulation of stock price paths under geometric Brownian motion, with the simulated
        terminal price distribution building up against the analytic lognormal density.
      </p>
      <div className="hero__readout" ref={readoutRef} aria-hidden="true">
        <div className="eyebrow">
          <span className="dot dot--live" /> Live · Simulating 1 year of stock prices
        </div>
        <div>
          GBM Monte Carlo · μ 8% · σ 22% · <b ref={nRef}>–</b> paths
        </div>
        <div>
          E[S<sub>T</sub>] simulated <b ref={meanRef}>–</b>
        </div>
        <div>
          analytic <b>{ANALYTIC_MEAN.toFixed(2)}</b> · |z| <b ref={zRef}>–</b> · <span ref={verdictRef} className="hero__verdict" />
        </div>
      </div>
    </>
  );
}
