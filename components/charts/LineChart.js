'use client';

import { useMemo, useState } from 'react';
import { extent, fmtBy, linear, logScale, niceTicks } from '@/lib/scale';
import useWidth from './useWidth';

function interpAt(points, x) {
  if (!points.length || x < points[0][0] || x > points[points.length - 1][0]) return null;
  let lo = 0;
  let hi = points.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid][0] <= x) lo = mid;
    else hi = mid;
  }
  const [x0, y0] = points[lo];
  const [x1, y1] = points[hi];
  return x1 === x0 ? y0 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

/**
 * Multi-series line chart with a snapping crosshair, one tooltip for every series,
 * a legend for 2+ series, optional end labels and reference markers.
 * Formatter options are names from lib/scale `formats` so server components can configure it.
 */
export default function LineChart({
  series,
  x = {},
  y = {},
  height = 280,
  markers = [],
  endLabels = false,
  ariaLabel,
  showLegend = true,
}) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const xf = fmtBy(x.format);
  const yf = fmtBy(y.format);
  const narrow = width < 520;
  const m = { t: 18, r: endLabels && !narrow ? 104 : 14, b: 36, l: 50 };
  const iw = Math.max(10, width - m.l - m.r);
  const ih = height - m.t - m.b;

  const xDomain = x.domain || extent(series.flatMap((s) => s.points.map((p) => p[0])));
  const yDomain = y.domain || extent(series.flatMap((s) => s.points.map((p) => p[1])), 0.08);
  const xs = x.type === 'log' ? logScale(xDomain, [0, iw]) : linear(xDomain, [0, iw]);
  const ys = linear(yDomain, [ih, 0]);
  const xTicks = x.ticks || niceTicks(xDomain[0], xDomain[1], narrow ? 4 : 6);
  const yTicks = y.ticks || niceTicks(yDomain[0], yDomain[1], 5);

  const paths = series.map((s) => {
    const d = s.points.map(([px, py], i) => `${i ? 'L' : 'M'}${xs(px).toFixed(1)},${ys(py).toFixed(1)}`).join('');
    const area =
      s.area && s.points.length
        ? `${d}L${xs(s.points[s.points.length - 1][0]).toFixed(1)},${ih}L${xs(s.points[0][0]).toFixed(1)},${ih}Z`
        : null;
    return { ...s, d, area };
  });

  // End labels only when they won't collide; the legend always carries identity.
  const ends = endLabels && !narrow
    ? series
        .map((s) => {
          const last = s.points[s.points.length - 1];
          return last ? { id: s.id, label: s.label, y: ys(last[1]), x: xs(last[0]) } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.y - b.y)
    : [];
  const endsOk = ends.every((e, i) => i === 0 || e.y - ends[i - 1].y >= 14);

  const snapXs = useMemo(() => {
    const base = series.reduce((a, s) => (s.points.length > a.length ? s.points : a), []);
    return base.map((p) => p[0]);
  }, [series]);

  const pick = (xVal) => {
    const values = series
      .map((s) => ({ id: s.id, label: s.label, color: s.color, v: interpAt(s.points, xVal) }))
      .filter((v) => v.v !== null && Number.isFinite(v.v));
    setHover({ x: xVal, values });
  };

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.min(iw, Math.max(0, e.clientX - rect.left));
    let xVal = xs.invert(px);
    if (snapXs.length) {
      let best = snapXs[0];
      for (const sx of snapXs) if (Math.abs(sx - xVal) < Math.abs(best - xVal)) best = sx;
      xVal = best;
    }
    pick(xVal);
  };

  const onKey = (e) => {
    if (!snapXs.length) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = hover ? snapXs.indexOf(hover.x) : -1;
    const next = e.key === 'ArrowRight' ? Math.min(snapXs.length - 1, i + 1) : Math.max(0, i < 0 ? 0 : i - 1);
    pick(snapXs[next]);
  };

  const hx = hover ? xs(hover.x) : 0;
  const topY = hover && hover.values.length ? Math.min(...hover.values.map((v) => ys(v.v))) : 0;

  return (
    <div className="chart-wrap" ref={ref}>
      {showLegend && series.length > 1 && (
        <div className="legend" style={{ marginBottom: 12 }}>
          {series.map((s) => (
            <span key={s.id} className="legend__item">
              <span className="legend__line" style={{ background: s.color }} />
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
          <line className="viz-axis" x1={0} x2={iw} y1={ih + 0.5} y2={ih + 0.5} />
          {xTicks
            .filter((t) => t >= xDomain[0] && t <= xDomain[1])
            .map((t) => (
              <text key={t} x={xs(t)} y={ih + 20} textAnchor="middle">
                {xf(t)}
              </text>
            ))}
          {x.label && (
            <text x={iw} y={ih + 34} textAnchor="end" className="viz-label" style={{ fontSize: 10.5 }}>
              {x.label}
            </text>
          )}

          {markers.map((mk, i) => (
            <g key={mk.label}>
              <line x1={xs(mk.x)} x2={xs(mk.x)} y1={0} y2={ih} stroke="var(--line-strong)" strokeWidth={1} />
              {/* Stacked so neighbouring markers (spot ≈ strike) never overprint */}
              <text x={xs(mk.x) + 6} y={10 + i * 15} className="viz-label">
                {mk.label}
              </text>
            </g>
          ))}

          {paths.map((s) =>
            s.area ? <path key={`${s.id}-a`} d={s.area} fill={s.color} opacity={0.1} /> : null
          )}
          {paths.map((s) => (
            <path
              key={s.id}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width || 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={s.muted ? 0.8 : 1}
            />
          ))}

          {endsOk &&
            ends.map((e) => (
              <text key={e.id} x={e.x + 10} y={e.y} dominantBaseline="middle" className="viz-label">
                {e.label}
              </text>
            ))}

          {hover && (
            <g pointerEvents="none">
              <line x1={hx} x2={hx} y1={0} y2={ih} stroke="var(--ink-3)" strokeWidth={1} />
              {hover.values.map((v) => (
                <circle key={v.id} cx={hx} cy={ys(v.v)} r={4} fill={v.color} stroke="var(--surface)" strokeWidth={2} />
              ))}
            </g>
          )}

          <rect
            className="viz-hit"
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="transparent"
            tabIndex={0}
            aria-label={`${ariaLabel || 'Chart'}: use left and right arrow keys to read values`}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
            onKeyDown={onKey}
          />
        </g>
      </svg>
      {hover && hover.values.length > 0 && (
        <div
          className="chart-tooltip"
          style={{
            left: Math.min(Math.max(m.l + hx, 90), width - 90),
            top: m.t + topY + (showLegend && series.length > 1 ? 34 : 0),
          }}
        >
          <div className="chart-tooltip__title">
            {x.name ? `${x.name} ` : ''}
            {xf(hover.x)}
          </div>
          {hover.values.map((v) => (
            <div key={v.id} className="chart-tooltip__row">
              <span className="chart-tooltip__key" style={{ background: v.color }} />
              <b>{yf(v.v)}</b>
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
