// Pulls published results from the project repos and writes compact JSON into /data.
// Every chart and interactive on the site reads from these files, so the site never
// shows a number the repos don't contain. Re-run after a project's results change:
//   node scripts/sync-data.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OWNER = 'MadhanJ05';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'data');

async function get(repo, file) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${repo}/main/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// Minimal CSV parser (handles quoted fields).
function csv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const r = (x, d = 4) => Math.round(+x * 10 ** d) / 10 ** d;

async function strategySearch() {
  const repo = 'strategy-search';
  const [results, summary, wf] = await Promise.all([
    get(repo, 'results/search_results.csv').then(csv),
    get(repo, 'results/summary.json').then(JSON.parse),
    get(repo, 'results/walkforward.csv').then(csv),
  ]);
  return {
    source: `https://github.com/${OWNER}/${repo}`,
    meta: {
      universe: 15,
      window: ['2007-01-08', '2025-12-31'],
      costBps: 5,
      // From report/report.md, section 3 (inputs to the Deflated Sharpe Ratio).
      T: 4777,
      skew: -0.59,
      kurtosis: 6.5,
    },
    // [name, family, sharpe, cagr, maxDrawdown, feasible]
    strategies: results.map(s => [s.name, s.family, r(s.sharpe), r(s.cagr), r(s.max_dd), s.feasible === 'True']),
    summary: {
      top: summary.top_config,
      topInSample: summary.top_in_sample,
      walkForward: summary.walk_forward,
      spyOos: summary.spy_oos,
      bootstrap: summary.bootstrap_ci,
      dsr: summary.dsr,
      pbo: summary.pbo,
      lag2Sharpe: summary.lag2_sharpe,
    },
    walkForward: wf.map(w => ({
      year: +w.test_year,
      selected: w.selected,
      trainSharpe: r(w.train_sharpe, 3),
      testSharpe: r(w.test_sharpe, 3),
      testReturn: r(w.test_return),
      spyReturn: r(w.spy_test_return),
      percentile: r(w.test_percentile, 3),
    })),
  };
}

async function optionsLab() {
  const repo = 'options-lab';
  const [iv, ts, chain, yearly, hist, funnel, three, mcvr] = await Promise.all([
    get(repo, 'results/iv_summary.json').then(JSON.parse),
    get(repo, 'results/iv_term_structure.csv').then(csv),
    get(repo, 'data/spy_chain_clean_2026-10-09.csv').then(csv),
    get(repo, 'results/hist_yearly.csv').then(csv),
    get(repo, 'results/hist_summary.json').then(JSON.parse),
    get(repo, 'results/iv_cleaning_funnel.csv').then(csv),
    get(repo, 'results/pricing_three_ways.csv').then(csv),
    get(repo, 'results/mc_variance_reduction.csv').then(csv),
  ]);
  const smileExpiries = ['2026-10-16', '2026-12-31', '2027-09-17'];
  const smile = smileExpiries.map(expiry => {
    const pts = chain
      .filter(q => q.expiry === expiry && q.iv_status === 'newton')
      .map(q => [r(q.log_moneyness), r(q.iv), +q.days])
      .filter(([k]) => k >= -0.4 && k <= 0.2)
      .sort((a, b) => a[0] - b[0]);
    return { expiry, days: pts[0]?.[2] ?? null, points: pts.map(([k, v]) => [k, v]) };
  });
  return {
    source: `https://github.com/${OWNER}/${repo}`,
    snapshot: {
      date: iv.quote_date,
      spot: r(iv.spot_close, 2),
      rate: r(iv.risk_free_cc),
      vix: r(iv.vix_close_on_quote_date, 2),
      atm30: r(iv.spy_atm_iv_30d_interpolated),
      quotes: iv.n_clean_quotes,
      rawRows: iv.n_raw_rows,
    },
    termStructure: ts.map(t => [+t.days, r(t.atm_iv)]),
    smile,
    funnel: funnel.map(f => [f.filter, +f.rows_remaining]),
    yearly: yearly.map(y => ({
      year: +y.year,
      pnl: r(y.total_pnl_pct, 3),
      hitRate: r(y.hit_rate, 3),
      vix: r(y.mean_vix, 2),
      realised: r(y.mean_realised, 2),
    })),
    vrp: {
      months: hist.n_months,
      meanVrp: r(hist.mean_vrp_vol_pts, 2),
      shareAbove: r(hist.share_months_vix_above_realised, 3),
      meanPnl: r(hist.mean_pnl_pct_of_spot, 3),
      hitRate: r(hist.hit_rate, 3),
      corrGammaTheta: r(hist.corr_pnl_vs_gamma_approx, 3),
      worst: r(hist.worst_month_pct, 2),
      best: r(hist.best_month_pct, 2),
    },
    threeWays: three.map(t => ({
      kind: t.kind, K: +t.K, bs: r(t.black_scholes, 5), crr: r(t.crr_2000, 5), mc: r(t.mc_price, 5), se: r(t.mc_se, 5),
    })),
    varianceReduction: mcvr.map(m => ({ product: m.product, method: m.method, factor: r(m.variance_reduction, 2) })),
  };
}

await mkdir(OUT, { recursive: true });
const [ss, ol] = await Promise.all([strategySearch(), optionsLab()]);
await writeFile(path.join(OUT, 'strategy-search.json'), JSON.stringify(ss));
await writeFile(path.join(OUT, 'options-lab.json'), JSON.stringify(ol));
console.log(`strategy-search.json: ${ss.strategies.length} strategies, ${ss.walkForward.length} walk-forward years`);
console.log(`options-lab.json: ${ol.termStructure.length} expiries, smile points ${ol.smile.map(s => s.points.length).join('/')}`);
