import strategy from '@/data/strategy-search.json';
import BarChart from '@/components/charts/BarChart';
import DataTable from '@/components/charts/DataTable';
import OverfitExplorer from '@/components/lab/OverfitExplorer';
import { CaseFigures, CaseHero, CaseNext, CaseSection, Figure } from './Case';

export default function StrategyCase({ project }) {
  const { summary, walkForward, strategies, meta } = strategy;
  const families = ['meanrev', 'tsmom', 'xsmom'].map((f) => {
    const xs = strategies.filter((s) => s[1] === f).map((s) => s[2]);
    return { family: f, n: xs.length, mean: xs.reduce((a, b) => a + b, 0) / xs.length, best: Math.max(...xs) };
  });
  const feasible = strategies.filter((s) => s[5]).length;
  const picks = new Set(walkForward.map((w) => w.selected)).size;
  const familyName = { meanrev: 'Mean reversion', tsmom: 'Time-series momentum', xsmom: 'Cross-sectional momentum' };

  return (
    <>
      <CaseHero
        project={project}
        title={
          <>
            Quant Strategy <em>Search</em>
          </>
        }
        summary="I searched 240 trading strategies for the best backtest, then spent most of the project trying to prove it was luck. It was."
        meta={[
          ['Period', project.period],
          ['Universe', `${meta.universe} ETFs, 2007–2025, ${meta.costBps} bps costs`],
          ['Tests', '36-test no-lookahead suite'],
        ]}
      />
      <CaseFigures
        figures={[
          { value: `${summary.topInSample.sharpe.toFixed(2)} → ${summary.dsr.dsr.toFixed(2)}`, label: 'Top in-sample Sharpe → its Deflated Sharpe (0.95 needed)' },
          { value: `${summary.walkForward.sharpe.toFixed(2)}`, label: `Walk-forward Sharpe, vs. ${summary.spyOos.sharpe.toFixed(2)} for SPY` },
          { value: summary.pbo.pbo.toFixed(2), label: `Probability of backtest overfitting (${summary.pbo.n_splits.toLocaleString('en-US')} splits)` },
          { value: `${picks} / 14`, label: 'Different “best” strategies in 14 walk-forward years' },
        ]}
      />

      <CaseSection index="01" label="The question" heading="Try enough strategies and one will look brilliant by accident. How brilliant?">
        <div className="prose" data-reveal>
          <p>
            Every backtest you run and discard still counts. Pick the best of many and its Sharpe ratio is biased upward, often enough to make noise
            look like an edge. This project builds a fast search engine, runs a deliberately wide search, and then applies the tools designed to catch
            exactly this: the <strong>Deflated Sharpe Ratio</strong>, the <strong>Probability of Backtest Overfitting</strong> via combinatorially
            symmetric cross-validation, <strong>walk-forward</strong> selection, and <strong>block-bootstrap</strong> confidence intervals.
          </p>
        </div>
      </CaseSection>

      <CaseSection index="02" label="The search" heading="240 configurations across three strategy families.">
        <div className="prose" data-reveal>
          <p>
            A vectorized engine over {meta.universe} ETFs from 2007 to 2025 swept lookbacks, holding periods, long-only vs. long/short and volatility
            targeting, charging {meta.costBps} bps per side. Only {feasible} of 240 met the risk limits (max drawdown under 30%, turnover at most 20× a
            year), and a 36-test suite proves the engine never peeks ahead.
          </p>
        </div>
        <div className="table-scroll" data-reveal>
          <table className="data-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th scope="col">Family</th>
                <th scope="col">Configs</th>
                <th scope="col">Mean Sharpe</th>
                <th scope="col">Best Sharpe</th>
              </tr>
            </thead>
            <tbody>
              {families.map((f) => (
                <tr key={f.family}>
                  <td>{familyName[f.family]}</td>
                  <td>{f.n}</td>
                  <td>{f.mean.toFixed(2)}</td>
                  <td>{f.best.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CaseSection>

      <CaseSection index="03" label="Deflating the winner" heading="Drag N and watch a 0.80 Sharpe lose its significance." wide>
        <div data-reveal>
          <OverfitExplorer data={strategy} />
        </div>
      </CaseSection>

      <CaseSection index="04" label="Walk-forward" heading="Traded live, the search picked a different winner almost every year.">
        <div className="prose" data-reveal>
          <p>
            Each year from 2012 to 2025 the search re-ran on the prior five years and traded its winner. The result: a Sharpe of{' '}
            {summary.walkForward.sharpe.toFixed(2)} (CAGR {(summary.walkForward.cagr * 100).toFixed(1)}%, max drawdown{' '}
            {(summary.walkForward.max_dd * 100).toFixed(1)}%) against SPY’s {summary.spyOos.sharpe.toFixed(2)}. Every pick had a drawdown under 30% in
            training, yet the live sequence fell {(summary.walkForward.max_dd * 100).toFixed(1)}%. The difference in Sharpe vs. SPY has a 95% interval
            of [{summary.bootstrap['walk_forward - SPY'].lo.toFixed(2)}, {summary.bootstrap['walk_forward - SPY'].hi.toFixed(2)}], entirely below zero.
          </p>
        </div>
        <Figure title="Walk-forward pick vs. SPY · annual return" aside="2012–2025">
          <BarChart
            height={280}
            ariaLabel="Annual return of the walk-forward strategy pick versus SPY, 2012 to 2025"
            y={{ format: 'pct0' }}
            series={[
              { id: 'wf', label: 'Strategy picked on prior 5 years', color: 'var(--accent)' },
              { id: 'spy', label: 'SPY', color: 'var(--viz-neutral)' },
            ]}
            extra={[
              { key: 'train', label: 'Sharpe in training', format: 'num2' },
              { key: 'test', label: 'Sharpe that year', format: 'num2' },
            ]}
            data={walkForward.map((w) => ({
              label: String(w.year),
              values: [w.testReturn, w.spyReturn],
              meta: { train: w.trainSharpe, test: w.testSharpe },
            }))}
          />
          <DataTable
            columns={['Year', 'Picked on prior 5 years', 'Train SR', 'Test SR', 'Return', 'SPY']}
            rows={walkForward.map((w) => [
              w.year,
              w.selected,
              w.trainSharpe.toFixed(2),
              w.testSharpe.toFixed(2),
              `${(w.testReturn * 100).toFixed(1)}%`,
              `${(w.spyReturn * 100).toFixed(1)}%`,
            ])}
          />
        </Figure>
      </CaseSection>

      <CaseSection index="05" label="What held up" heading="Not everything was noise.">
        <div className="prose" data-reveal>
          <ul>
            <li>
              <strong>No lookahead.</strong> Results don’t depend on the execution assumption: trading a day later gives a Sharpe of{' '}
              {summary.lag2Sharpe.toFixed(2)} vs. {summary.topInSample.sharpe.toFixed(2)}.
            </li>
            <li>
              <strong>Ranking carries a little information.</strong> In {(100 - summary.pbo.pbo * 100).toFixed(1)}% of CSCV splits the in-sample winner
              still beat the median config out of sample, but its median Sharpe roughly halved (0.96 → 0.46).
            </li>
            <li>
              <strong>Trend rules cut drawdowns.</strong> Long-only trend strategies fell far less than SPY in-sample (14.1% vs. 55.2%). Whether that is
              skill or one lucky episode (2008) can’t be separated with a single history.
            </li>
          </ul>
        </div>
      </CaseSection>

      <CaseSection index="06" label="Caveats" heading="Limits I’d raise myself.">
        <div className="caveat" data-reveal>
          Sharpe uses a 0% risk-free rate and no borrow or shorting fees, which flatters long/short and vol-targeted configs. 2012–2025 was unusually
          strong for US large caps, so SPY is a tough benchmark. And there is <strong>one historical path</strong>: every test here measures selection
          bias within this history; none can rule out that the history itself was unrepresentative. Nothing was tuned after seeing results.
        </div>
      </CaseSection>

      <CaseNext slug={project.slug} />
    </>
  );
}
