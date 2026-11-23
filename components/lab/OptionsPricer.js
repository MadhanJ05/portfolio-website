'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { binomial, blackScholes, fmt, monteCarlo } from '@/lib/quant';
import LineChart from '@/components/charts/LineChart';

export default function OptionsPricer({ snapshot }) {
  const presets = useMemo(
    () => [
      {
        id: 'spy',
        label: `SPY 30D ATM · ${new Date(snapshot.date + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        note: `Spot, 30-day ATM implied vol and T-bill rate from the options-lab snapshot (close of ${snapshot.date}). Dividends set to zero.`,
        p: { S: snapshot.spot, K: Math.round(snapshot.spot / 5) * 5, days: 30, vol: +(snapshot.atm30 * 100).toFixed(2), rate: +(snapshot.rate * 100).toFixed(2), div: 0 },
      },
      {
        id: 'textbook',
        label: 'Textbook: S = K = 100, 1y',
        note: 'Same inputs as the options-lab report (σ 20%, r 5%, q 1.5%). The call should price at 9.52354.',
        p: { S: 100, K: 100, days: 365, vol: 20, rate: 5, div: 1.5 },
      },
    ],
    [snapshot]
  );

  const [type, setType] = useState('call');
  const [presetId, setPresetId] = useState('spy');
  const [p, setP] = useState(presets[0].p);
  const [ref, setRef] = useState(presets[0].p.S);
  const [seed, setSeed] = useState(7);

  const applyPreset = (pr) => {
    setPresetId(pr.id);
    setP(pr.p);
    setRef(pr.p.S);
  };
  const set = (key) => (e) => {
    setPresetId(null);
    setP((prev) => ({ ...prev, [key]: Number(e.target.value) }));
  };

  const dp = useDeferredValue(p);
  const dType = useDeferredValue(type);
  const dSeed = useDeferredValue(seed);

  const result = useMemo(() => {
    const args = { S: dp.S, K: dp.K, T: dp.days / 365, r: dp.rate / 100, q: dp.div / 100, sigma: dp.vol / 100, type: dType };
    const bs = blackScholes(args);
    const crr = binomial({ ...args, steps: 500 });
    const am = binomial({ ...args, steps: 500, american: true });
    const mc = monteCarlo({ ...args, paths: 50000, seed: dSeed });
    const lo = dp.K * 0.7;
    const hi = dp.K * 1.3;
    const grid = Array.from({ length: 121 }, (_, i) => lo + ((hi - lo) * i) / 120);
    const today = grid.map((s) => [s, blackScholes({ ...args, S: s }).price]);
    const expiry = grid.map((s) => [s, Math.max(dType === 'call' ? s - dp.K : dp.K - s, 0)]);
    return { args, bs, crr, am, mc, today, expiry, lo, hi };
  }, [dp, dType, dSeed]);

  const { bs, crr, am, mc } = result;
  const z = mc.se > 0 ? (mc.price - bs.price) / mc.se : 0;
  const stale = dp !== p || dType !== type;
  const preset = presets.find((x) => x.id === presetId);

  const controls = [
    { key: 'S', label: 'Spot', min: +(ref * 0.6).toFixed(0), max: +(ref * 1.4).toFixed(0), step: ref >= 300 ? 0.5 : 0.1, show: (v) => fmt.num(v, 2) },
    { key: 'K', label: 'Strike', min: +(ref * 0.6).toFixed(0), max: +(ref * 1.4).toFixed(0), step: ref >= 300 ? 5 : 1, show: (v) => fmt.num(v, ref >= 300 ? 0 : 1) },
    { key: 'days', label: 'Days to expiry', min: 1, max: 730, step: 1, show: (v) => `${v}d` },
    { key: 'vol', label: 'Implied volatility', min: 5, max: 80, step: 0.05, show: (v) => `${v.toFixed(2)}%` },
    { key: 'rate', label: 'Risk-free rate', min: 0, max: 10, step: 0.01, show: (v) => `${v.toFixed(2)}%` },
    { key: 'div', label: 'Dividend yield', min: 0, max: 6, step: 0.1, show: (v) => `${v.toFixed(1)}%` },
  ];

  return (
    <div className="panel">
      <div className="panel__grid">
        <div className="panel__side">
          <h3 className="panel__title">Options pricer</h3>
          <p className="panel__note">Three independent methods, recomputed on every change, the way the options-lab engine checks itself.</p>

          <div style={{ marginTop: 22 }}>
            <div className="segmented" role="group" aria-label="Option type">
              {['call', 'put'].map((t) => (
                <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}>
                  {t === 'call' ? 'Call' : 'Put'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            {controls.map((c) => {
              const v = p[c.key];
              const fill = ((v - c.min) / (c.max - c.min)) * 100;
              return (
                <div className="control" key={c.key}>
                  <div className="control__row">
                    <label className="control__label" htmlFor={`op-${c.key}`}>
                      {c.label}
                    </label>
                    <span className="control__value">{c.show(v)}</span>
                  </div>
                  <input
                    id={`op-${c.key}`}
                    className="range"
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    value={v}
                    onChange={set(c.key)}
                    style={{ '--fill': `${Math.min(100, Math.max(0, fill))}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>
              Presets
            </p>
            <div className="presets">
              {presets.map((pr) => (
                <button key={pr.id} type="button" className="chip" aria-pressed={presetId === pr.id} onClick={() => applyPreset(pr)}>
                  {pr.label}
                </button>
              ))}
            </div>
            {preset && <p className="panel__note">{preset.note}</p>}
          </div>
        </div>

        <div className="panel__main" style={{ opacity: stale ? 0.7 : 1, transition: 'opacity .2s' }}>
          <div className="readout-big">
            <span className="readout-big__value">{fmt.num(bs.price, ref >= 300 ? 2 : 4)}</span>
            <span className="muted" style={{ fontSize: 14 }}>
              European {type}, Black-Scholes, per share
            </span>
          </div>

          <dl className="greeks" aria-label="Greeks">
            <div>
              <dt>Δ DELTA</dt>
              <dd>{fmt.num(bs.delta, 3)}</dd>
            </div>
            <div>
              <dt>Γ GAMMA</dt>
              <dd>{fmt.num(bs.gamma, 4)}</dd>
            </div>
            <div>
              <dt>VEGA /1pt</dt>
              <dd>{fmt.num(bs.vega, 3)}</dd>
            </div>
            <div>
              <dt>Θ /DAY</dt>
              <dd>{fmt.num(bs.theta, 3)}</dd>
            </div>
            <div>
              <dt>ρ /1%</dt>
              <dd>{fmt.num(bs.rho, 3)}</dd>
            </div>
          </dl>

          <div className="methods" aria-label="Pricing methods compared">
            <div className="method">
              <span className="method__name">
                Black-Scholes<small>closed form</small>
              </span>
              <span className="method__price">{fmt.num(bs.price, 5)}</span>
              <span className="method__diff">reference</span>
            </div>
            <div className="method">
              <span className="method__name">
                Binomial tree<small>Cox-Ross-Rubinstein, 500 steps</small>
              </span>
              <span className="method__price">{fmt.num(crr, 5)}</span>
              <span className="method__diff">{fmt.signed(crr - bs.price, 5)}</span>
            </div>
            <div className="method">
              <span className="method__name">
                Monte Carlo<small>{fmt.int(mc.paths)} paths · antithetic + control variate</small>
              </span>
              <span className="method__price">
                {fmt.num(mc.price, 5)} <span style={{ color: 'var(--ink-3)' }}>± {fmt.num(mc.se, 5)}</span>
              </span>
              <span className="method__diff" style={{ color: Math.abs(z) <= 2 ? 'var(--up)' : 'var(--down)' }}>
                z = {fmt.signed(z, 2)}
              </span>
            </div>
            <div className="method">
              <span className="method__name">
                American exercise<small>same tree, early exercise allowed</small>
              </span>
              <span className="method__price">{fmt.num(am, 5)}</span>
              <span className="method__diff">prem. {fmt.num(Math.max(0, am - crr), 4)}</span>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="chip" onClick={() => setSeed((s) => s + 1)}>
              Re-run Monte Carlo (seed {seed})
            </button>
            <span className="panel__note" style={{ marginTop: 0 }}>
              |z| ≤ 2 means the simulation agrees with the closed form within two standard errors.
            </span>
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Value vs. spot
            </p>
            <LineChart
              height={250}
              ariaLabel={`Option value today and payoff at expiry across spot prices from ${fmt.num(result.lo, 0)} to ${fmt.num(result.hi, 0)}`}
              x={{ format: ref >= 300 ? 'num0' : 'num1', name: 'Spot', domain: [result.lo, result.hi] }}
              y={{ format: ref >= 300 ? 'num0' : 'num1' }}
              markers={[
                { x: Math.min(result.hi, Math.max(result.lo, p.S)), label: 'Spot' },
                { x: p.K, label: 'K' },
              ]}
              series={[
                { id: 'today', label: `Value today (${p.days}d)`, color: 'var(--accent)', points: result.today },
                { id: 'expiry', label: 'Payoff at expiry', color: 'var(--viz-neutral)', points: result.expiry },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
