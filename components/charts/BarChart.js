'use client';

import { useState } from 'react';
import { barPath, extent, fmtBy, linear, niceTicks } from '@/lib/scale';
import useWidth from './useWidth';

/**
 * Vertical columns (1–2 series, grouped), negative values allowed.
 * Bars are capped at 24px, rounded at the data end, square at the baseline,
 * separated by a 2px gap. Each group is its own hover/focus target.
 * `extra` adds rows to the tooltip: [{ key, label, format }] read from datum.meta.
 */
export default function BarChart({ data, series, y = {}, height = 260, extra = [], ariaLabel, labelEvery }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const yf = fmtBy(y.format);
  const m = { t: 16, r: 8, b: 32, l: 48 };
  const iw = Math.max(10, width - m.l - m.r);
  const ih = height - m.t - m.b;

  const [lo, hi] = y.domain || extent([0, ...data.flatMap((d) => d.values)], 0.06);
  const ys = linear([lo, hi], [ih, 0]);
  const yTicks = y.ticks || niceTicks(lo, hi, 5);

  const band = iw / data.length;
  const k = series.length;
  const barW = Math.min(24, Math.max(3, (band * 0.72 - (k - 1) * 2) / k));
  const groupW = barW * k + (k - 1) * 2;
  const every = labelEvery || (band < 26 ? Math.ceil(26 / band) : 1);
  const y0 = ys(0);

  return (
    <div className="chart-wrap" ref={ref}>
      {series.length > 1 && (
        <div className="legend" style={{ marginBottom: 12 }}>
          {series.map((s) => (
            <span key={s.id} className="legend__item">
              <span className="legend__rect" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <svg className="viz" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
        <g transform={`translate(${m.l},${m.t})`}>
          <g className="viz-grid">
            {yTicks.map((t) => (
              <line key={t} x1={0} x2={iw} y1={Math.round(ys(t)) + 0.5} y2={Math.round(ys(t)) + 0.5} />
            ))}
          </g>
          {yTicks.map((t) => (
            <text key={t} x={-10} y={ys(t)} textAnchor="end" dominantBaseline="middle">
              {yf(t)}
            </text>
          ))}
          <line className="viz-axis" x1={0} x2={iw} y1={Math.round(y0) + 0.5} y2={Math.round(y0) + 0.5} />

          {data.map((d, i) => {
            const gx = i * band + (band - groupW) / 2;
            const isHover = hover === i;
            return (
              <g key={d.label}>
                {d.values.map((v, j) => (
                  <path
                    key={j}
                    d={barPath(gx + j * (barW + 2), barW, y0, ys(v))}
                    fill={series[j].color}
                    opacity={hover === null || isHover ? 1 : 0.45}
                  />
                ))}
                {i % every === 0 && (
                  <text x={i * band + band / 2} y={ih + 20} textAnchor="middle">
                    {d.label}
                  </text>
                )}
                <rect
                  className="viz-hit"
                  x={i * band}
                  y={0}
                  width={band}
                  height={ih}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${d.label}: ${d.values.map((v, j) => `${series[j].label} ${yf(v)}`).join(', ')}`}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                />
              </g>
            );
          })}
        </g>
      </svg>
      {hover !== null && data[hover] && (
        <div
          className="chart-tooltip"
          style={{
            left: Math.min(Math.max(m.l + hover * band + band / 2, 90), width - 90),
            top: m.t + Math.min(y0, ...data[hover].values.map((v) => ys(v))) + (series.length > 1 ? 34 : 0),
          }}
        >
          <div className="chart-tooltip__title">{data[hover].label}</div>
          {data[hover].values.map((v, j) => (
            <div key={j} className="chart-tooltip__row">
              <span className="chart-tooltip__key" style={{ background: series[j].color }} />
              <b>{yf(v)}</b>
              <span>{series[j].label}</span>
            </div>
          ))}
          {extra.map((e) => (
            <div key={e.key} className="chart-tooltip__row">
              <span className="chart-tooltip__key" style={{ background: 'transparent' }} />
              <b>{data[hover].meta?.[e.key] != null ? fmtBy(e.format)(data[hover].meta[e.key]) : '–'}</b>
              <span>{e.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
