import { ImageResponse } from 'next/og';
import { rng } from '@/lib/quant';

export const alt = 'Madhan Jothimani: quantitative finance, derivatives and machine learning';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Instrument Serif as TTF for the share card; falls back to the default font if unavailable.
async function loadSerif(italic) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@${italic ? 1 : 0}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
    }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

function fan() {
  const { normal } = rng(20270104);
  const W = 640, H = 630, steps = 60, S0 = 100, mu = 0.08, sigma = 0.22;
  const m = Math.log(S0) + (mu - 0.5 * sigma * sigma);
  const lo = m - 3.1 * sigma, hi = m + 3.1 * sigma;
  const X = (k) => 40 + (k / steps) * (W - 80);
  const Y = (l) => H - 90 - ((l - lo) / (hi - lo)) * (H - 180);
  const paths = [];
  for (let i = 0; i < 90; i++) {
    let x = Math.log(S0);
    let d = `M${X(0)},${Y(x)}`;
    for (let k = 1; k <= steps; k++) {
      x += (mu - 0.5 * sigma * sigma) / steps + (sigma / Math.sqrt(steps)) * normal();
      d += `L${X(k).toFixed(1)},${Y(x).toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}

export default async function Image() {
  const [regular, italic] = await Promise.all([loadSerif(false), loadSerif(true)]);
  const fonts = [
    regular && { name: 'Serif', data: regular, style: 'normal', weight: 400 },
    italic && { name: 'Serif', data: italic, style: 'italic', weight: 400 },
  ].filter(Boolean);
  const serif = fonts.length ? 'Serif' : 'serif';
  const paths = fan();

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#09090a', color: '#ece7dc', position: 'relative' }}>
        <svg width="640" height="630" viewBox="0 0 640 630" style={{ position: 'absolute', right: 0, top: 0 }}>
          {paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={i < 6 ? '#d9b97c' : 'rgba(236,231,220,0.09)'} strokeWidth={i < 6 ? 2 : 1.2} />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(90deg, #09090a 0%, rgba(9,9,10,0.92) 42%, rgba(9,9,10,0) 75%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, letterSpacing: 3, color: '#8d8980', textTransform: 'uppercase' }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: '#8cc7a1' }} />
            Incoming MSF · Quantitative Finance · Boston College
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: serif, fontSize: 132, lineHeight: 0.92, letterSpacing: -4 }}>Madhan</div>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 132, lineHeight: 0.92, letterSpacing: -4, color: '#d9b97c' }}>Jothimani</div>
            <div style={{ marginTop: 34, fontSize: 30, color: '#b3aea4', maxWidth: 620, lineHeight: 1.4 }}>
              Derivatives pricing, overfitting-aware backtesting and ML for market stress.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 48, fontSize: 22, color: '#8d8980' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 40, color: '#ece7dc' }}>#1</span>K4 Ramsey, worldwide
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 40, color: '#ece7dc' }}>1,385×</span>MC variance cut
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 40, color: '#ece7dc' }}>0.29</span>Deflated Sharpe
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
