'use client';

import { useMemo, useState } from 'react';
import { deflatedSharpe, expectedMaxSharpe, fmt, sampleVariance } from '@/lib/quant';
import { linear } from '@/lib/scale';
import useWidth from '@/components/charts/useWidth';

const BIN = 0.05;
const X_MIN = -0.6;
const X_MAX = 1.05;
const N_MAX = 240;
const nFromU = (u) => Math.max(1, Math.round(Math.pow(N_MAX, u / 1000)));
const uFromN = (n) => Math.round((Math.log(n) / Math.log(N_MAX)) * 1000);

function SharpeDots({ strategies, top, hurdle, n }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);

  const layout = useMemo(() => {
    const bins = new Map();
    const dots = strategies
      .map((s) => ({ name: s[0], family: s[1], sharpe: s[2], cagr: s[3], maxDd: s[4], feasible: s[5] }))
      .sort((a, b) => a.sharpe - b.sharpe)
      .map((d) => {
        const b = Math.floor((d.sharpe - X_MIN) / BIN);
        const level = bins.get(b) || 0;
        bins.set(b, level + 1);
        return { ...d, bin: b, level };
      });
    return { dots, maxLevel: Math.max(...bins.values()) };
  }, [strategies]);

  const m = { t: 30, r: 12, b: 46, l: 12 };
  const iw = Math.max(10, width - m.l - m.r);
  const binW = iw / ((X_MAX - X_MIN) / BIN);
  const d = Math.max(4, Math.min(9, binW - 2));
  const step = d + 2;
  const ih = Math.max(160, layout.maxLevel * step + 8);
  const height = ih + m.t + m.b;
  const xs = linear([X_MIN, X_MAX], [0, iw]);
  const pos = (dot) => ({ cx: xs(X_MIN + (dot.bin + 0.5) * BIN), cy: ih - d / 2 - dot.level * step });
  const hx = xs(hurdle);
  const ticks = [-0.5, 0, 0.5, 1];

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - m.l;
    const py = e.clientY - rect.top - m.t;
    let best = null;
    let bestD = 18 * 18;
    for (const dot of layout.dots) {
      const { cx, cy } = pos(dot);
      const dd = (cx - px) ** 2 + (cy - py) ** 2;
      if (dd < bestD) {
        bestD = dd;
        best = dot;
      }
    }
    setHover(best);
  };

  const hp = hover ? pos(hover) : null;

  return (
    <div className="chart-wrap" ref={ref}>
      <svg
        className="viz"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Dot histogram of in-sample Sharpe ratios for 240 strategies. Luck hurdle for ${n} trials is ${hurdle.toFixed(2)}; the top strategy scored ${top.sharpe.toFixed(2)}.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <g transform={`translate(${m.l},${m.t})`}>
          {/* "Beats luck" zone to the right of the hurdle */}
          <rect x={Math.min(hx, iw)} y={-m.t + 6} width={Math.max(0, iw - hx)} height={ih + m.t - 6} fill="var(--accent)" opacity={0.06} />
          <line className="viz-axis" x1={0} x2={iw} y1={ih + 0.5} y2={ih + 0.5} />
          {ticks.map((t) => (
            <text key={t} x={xs(t)} y={ih + 20} textAnchor="middle">
              {t.toFixed(1)}
            </text>
          ))}
          <text x={iw} y={ih + 34} textAnchor="end" className="viz-label" style={{ fontSize: 10.5 }}>
            In-sample Sharpe ratio (annualized)
          </text>
          <line x1={xs(0)} x2={xs(0)} y1={0} y2={ih} stroke="var(--line)" />

          {layout.dots.map((dot) => {
            const { cx, cy } = pos(dot);
            const isTop = dot.name === top.name;
            return (
              <circle
                key={dot.name}
                cx={cx}
                cy={cy}
                r={d / 2}
                fill={isTop ? 'var(--accent)' : 'var(--viz-neutral)'}
                opacity={hover && hover.name === dot.name ? 1 : isTop ? 1 : 0.75}
                stroke={hover && hover.name === dot.name ? 'var(--ink)' : 'none'}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Hurdle line */}
          <line x1={hx} x2={hx} y1={-m.t + 6} y2={ih} stroke="var(--ink)" strokeWidth={1.5} style={{ transition: 'all .25s' }} />
          <text
            x={hx > iw - 150 ? hx - 8 : hx + 8}
            y={-m.t + 18}
            textAnchor={hx > iw - 150 ? 'end' : 'start'}
            className="viz-label--strong"
          >
            Luck hurdle · N = {n} · {hurdle.toFixed(2)}
          </text>
          {(() => {
            const { cx, cy } = pos(layout.dots.find((x) => x.name === top.name));
            return (
              <g pointerEvents="none">
                <line x1={cx} x2={cx} y1={cy - d / 2 - 4} y2={cy - 22} stroke="var(--accent)" />
                <text x={cx - 6} y={cy - 28} textAnchor="end" className="viz-label--strong">
                  Top pick {top.sharpe.toFixed(2)}
                </text>
              </g>
            );
          })()}
        </g>
      </svg>
      {hover && hp && (
        <div className="chart-tooltip" style={{ left: Math.min(Math.max(m.l + hp.cx, 100), width - 100), top: m.t + hp.cy - 6 }}>
          <div className="chart-tooltip__title">{hover.name}</div>
          <div className="chart-tooltip__row">
            <b>{hover.sharpe.toFixed(2)}</b>
            <span>Sharpe</span>
          </div>
          <div className="chart-tooltip__row">
            <b>{fmt.pct(hover.cagr)}</b>
            <span>CAGR</span>
          </div>
          <div className="chart-tooltip__row">
            <b>{fmt.pct(hover.maxDd)}</b>
            <span>max drawdown</span>
          </div>
          <div className="chart-tooltip__row">
            <b>{hover.feasible ? 'yes' : 'no'}</b>
            <span>meets DD & turnover limits</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Intervals({ rows }) {
  const [ref, width] = useWidth();
  const m = { t: 8, r: 16, b: 30, l: Math.min(190, Math.max(120, width * 0.32)) };
  const rowH = 54;
  const ih = rows.length * rowH;
  const iw = Math.max(10, width - m.l - m.r);
  const xs = linear([-0.4, 1.6], [0, iw]);
  return (
    <div className="chart-wrap" ref={ref}>
      <svg className="viz" width={width} height={ih + m.t + m.b} viewBox={`0 0 ${width} ${ih + m.t + m.b}`} role="img" aria-label="Sharpe ratio with 95% bootstrap confidence intervals: in-sample top pick, walk-forward out of sample, and SPY over the same years">
        <g transform={`translate(${m.l},${m.t})`}>
          <g className="viz-grid">
            {[0, 0.5, 1, 1.5].map((t) => (
              <line key={t} x1={xs(t)} x2={xs(t)} y1={0} y2={ih} />
            ))}
          </g>
          <line x1={xs(0)} x2={xs(0)} y1={0} y2={ih} stroke="var(--line-strong)" />
          {[0, 0.5, 1, 1.5].map((t) => (
            <text key={t} x={xs(t)} y={ih + 20} textAnchor="middle">
              {t.toFixed(1)}
            </text>
          ))}
          {rows.map((r, i) => {
            const cy = i * rowH + rowH / 2 + 6;
            return (
              <g key={r.label}>
                <text x={-14} y={cy} textAnchor="end" dominantBaseline="middle" className={r.strong ? 'viz-label--strong' : 'viz-label'}>
                  {r.label}
                </text>
                {r.lo != null && <line x1={xs(r.lo)} x2={xs(r.hi)} y1={cy} y2={cy} stroke={r.color} strokeWidth={2} strokeLinecap="round" />}
                <circle cx={xs(r.value)} cy={cy} r={5} fill={r.color} stroke="var(--surface)" strokeWidth={2} />
                <text x={xs(r.value)} y={cy - 14} textAnchor="middle" className="viz-label">
                  {r.value.toFixed(2)}
                  {r.lo != null ? ` [${r.lo.toFixed(2)}, ${r.hi.toFixed(2)}]` : ''}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default function OverfitExplorer({ data, compact = false }) {
  const { strategies, summary, meta, walkForward } = data;
  const [u, setU] = useState(1000);
  const n = nFromU(u);

  const sdDaily = useMemo(() => Math.sqrt(sampleVariance(strategies.map((s) => s[2]))) / Math.sqrt(252), [strategies]);
  const topRow = useMemo(() => strategies.reduce((a, b) => (b[2] > a[2] ? b : a)), [strategies]);
  const top = { name: topRow[0], sharpe: topRow[2] };
  const sr0Daily = expectedMaxSharpe(n, sdDaily);
  const hurdle = sr0Daily * Math.sqrt(252);
  const dsr = deflatedSharpe({ sr: summary.dsr.sr_daily, sr0: sr0Daily, T: meta.T, skew: meta.skew, kurtosis: meta.kurtosis });
  const pass = dsr >= 0.95;
  const picks = new Set(walkForward.map((w) => w.selected)).size;
  const fill = (u / 1000) * 100;

  return (
    <div className="panel">
      <div className="panel__grid">
        <div className="panel__side">
          <h3 className="panel__title">Overfitting explorer</h3>
          <p className="panel__note">
            240 strategies were backtested on the same 2007–2025 data. The best one, <span className="mono">{top.name}</span>, scored a Sharpe of{' '}
            {top.sharpe.toFixed(2)}. Is that skill? It depends on how many strategies you admit to trying.
          </p>

          <div className="control" style={{ marginTop: 26 }}>
            <div className="control__row">
              <label className="control__label" htmlFor="ox-n">
                Strategies tried (N)
              </label>
              <span className="control__value">{n}</span>
            </div>
            <input
              id="ox-n"
              className="range"
              type="range"
              min={0}
              max={1000}
              step={1}
              value={u}
              onChange={(e) => setU(Number(e.target.value))}
              aria-valuetext={`${n} strategies`}
              style={{ '--fill': `${fill}%` }}
            />
            <div className="presets">
              {[1, 10, 50, 240].map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={n === v} onClick={() => setU(uFromN(v))}>
                  N = {v}
                  {v === 240 ? ' (honest)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <p className="eyebrow">Deflated Sharpe ratio</p>
            <div className="readout-big" style={{ marginTop: 10 }}>
              <span className="readout-big__value">{dsr.toFixed(3)}</span>
              <span className={`verdict ${pass ? 'verdict--good' : 'verdict--bad'}`}>
                {pass ? '✓ Significant at 95%' : '✕ Indistinguishable from luck'}
              </span>
            </div>
            <div className="meter" role="img" aria-label={`Deflated Sharpe ${dsr.toFixed(3)} against a 0.95 confidence threshold`}>
              <div className="meter__fill" style={{ width: `${dsr * 100}%` }} />
              <div className="meter__mark" style={{ left: '95%' }}>
                <span>0.95</span>
              </div>
            </div>
            <p className="panel__note" style={{ marginTop: 16 }}>
              Hurdle = Sharpe expected from the best of N skill-less strategies (Bailey & López de Prado), using the variance of Sharpe across the grid, T = {fmt.int(meta.T)} days, skew {meta.skew}, kurtosis {meta.kurtosis}.
              At N = 240 this reproduces the repo: hurdle 0.93, DSR 0.288.
            </p>
          </div>
        </div>

        <div className="panel__main">
          <div className="legend" style={{ marginBottom: 6 }}>
            <span className="legend__item">
              <span className="legend__dot" style={{ background: 'var(--viz-neutral)' }} />
              One backtested strategy
            </span>
            <span className="legend__item">
              <span className="legend__dot" style={{ background: 'var(--accent)' }} />
              Top in-sample pick
            </span>
            <span className="legend__item">
              <span className="legend__rect" style={{ background: 'var(--accent)', opacity: 0.25 }} />
              Beats the luck hurdle
            </span>
          </div>
          <SharpeDots strategies={strategies} top={top} hurdle={hurdle} n={n} />

          {!compact && (
            <>
              <div style={{ marginTop: 36 }}>
                <p className="eyebrow" style={{ marginBottom: 6 }}>
                  Then the out-of-sample test
                </p>
                <p className="panel__note" style={{ marginTop: 0, marginBottom: 14 }}>
                  Re-running the search each year on the prior five years and trading the winner (2012–2025). Bars are 95% stationary-bootstrap intervals.
                </p>
                <Intervals
                  rows={[
                    { label: 'In-sample top pick', value: summary.topInSample.sharpe, color: 'var(--accent)' },
                    {
                      label: 'Walk-forward (live)',
                      value: summary.bootstrap.walk_forward.sharpe,
                      lo: summary.bootstrap.walk_forward.lo,
                      hi: summary.bootstrap.walk_forward.hi,
                      color: 'var(--accent)',
                      strong: true,
                    },
                    {
                      label: 'SPY, same years',
                      value: summary.bootstrap.SPY.sharpe,
                      lo: summary.bootstrap.SPY.lo,
                      hi: summary.bootstrap.SPY.hi,
                      color: 'var(--viz-neutral)',
                    },
                  ]}
                />
              </div>
              <dl className="greeks" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
                <div>
                  <dt>PBO</dt>
                  <dd>{summary.pbo.pbo.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>NAIVE PSR</dt>
                  <dd>{summary.dsr.psr_vs_zero.toFixed(4)}</dd>
                </div>
                <div>
                  <dt>WINNERS / 14 YRS</dt>
                  <dd>{picks} configs</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
