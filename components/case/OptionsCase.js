import options from '@/data/options-lab.json';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DataTable from '@/components/charts/DataTable';
import OptionsPricer from '@/components/lab/OptionsPricer';
import { CaseFigures, CaseHero, CaseNext, CaseSection, Figure } from './Case';

const SMILE_COLORS = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)'];
const ymd = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC' });

export default function OptionsCase({ project }) {
  const { snapshot, termStructure, smile, funnel, yearly, vrp, threeWays, varianceReduction } = options;
  const asian = varianceReduction.filter((v) => v.product.startsWith('Arithmetic Asian'));
  const barrier = varianceReduction.filter((v) => v.product.startsWith('Up-and-out'));

  return (
    <>
      <CaseHero
        project={project}
        title={
          <>
            Quant Options <em>Engine</em>
          </>
        }
        summary="Three pricing methods that have to agree, an implied-volatility surface built from real SPY quotes, and a 19-year test of whether option sellers really get paid for bearing variance risk."
        meta={[
          ['Period', project.period],
          ['Data', `SPY chain (${ymd(snapshot.date)}); SPY, VIX, T-bills 2006–2025`],
          ['Tests', '310 passing (pytest)'],
        ]}
      />
      <CaseFigures
        figures={[
          { value: '1,385×', label: 'Variance cut on an Asian option with a geometric control' },
          { value: `+${vrp.meanVrp.toFixed(2)}`, label: 'Vol points VIX exceeded realized vol, on average' },
          { value: `${Math.round(vrp.hitRate * 100)}%`, label: 'Months a delta-hedged short call made money' },
          { value: vrp.corrGammaTheta.toFixed(2), label: 'Correlation of real hedged P&L with gamma-theta theory' },
        ]}
      />

      <CaseSection index="01" label="The question" heading="Do my pricers agree, and do option sellers actually earn the variance risk premium?">
        <div className="prose" data-reveal>
          <p>
            A pricing library is only trustworthy if independent methods land on the same number. So the engine prices every option three ways (a{' '}
            <strong>Black-Scholes</strong> closed form, a <strong>Cox-Ross-Rubinstein tree</strong>, and <strong>Monte Carlo</strong> with
            variance reduction) and the test suite fails if they drift apart.
          </p>
          <p>
            Then it turns to real markets: extract SPY’s implied-volatility smile from raw quotes, and measure whether selling volatility and
            delta-hedging it actually paid from 2007 to 2025, and by how much.
          </p>
        </div>
      </CaseSection>

      <CaseSection index="02" label="Pricing engine" heading="Three methods, one price.">
        <div className="prose" data-reveal>
          <p>
            With S = 100, T = 1, r = 5%, σ = 20% and q = 1.5%, the 2,000-step tree lands within a tenth of a cent of Black-Scholes, and 1M-path Monte
            Carlo (antithetic + control variate) lands within two standard errors.
          </p>
        </div>
        <div data-reveal className="table-scroll">
          <table className="data-table" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Black-Scholes</th>
                <th scope="col">CRR (N = 2000)</th>
                <th scope="col">Monte Carlo</th>
                <th scope="col">MC z-score</th>
              </tr>
            </thead>
            <tbody>
              {threeWays.map((t) => (
                <tr key={t.kind + t.K}>
                  <td>
                    {t.kind} K = {t.K}
                  </td>
                  <td>{t.bs.toFixed(5)}</td>
                  <td>{t.crr.toFixed(5)}</td>
                  <td>
                    {t.mc.toFixed(5)} <span style={{ color: 'var(--ink-3)' }}>± {t.se.toFixed(5)}</span>
                  </td>
                  <td>{((t.mc - t.bs) / t.se).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose" data-reveal>
          <p>
            Variance reduction only works with the right control. For an arithmetic Asian call, using the geometric Asian (which has a closed form)
            as the control cut variance <strong>{asian.find((a) => a.method === 'control')?.factor.toLocaleString('en-US')}×</strong>. For an
            up-and-out barrier, a vanilla call is a poor control (<strong>{barrier.find((b) => b.method === 'control')?.factor.toFixed(2)}×</strong>
            ), because the vanilla pays most on exactly the paths that knocked out. I report that as measured instead of tuning it away.
          </p>
        </div>
      </CaseSection>

      <CaseSection index="03" label="Try it" heading="The same three methods, live." wide>
        <div data-reveal>
          <OptionsPricer snapshot={snapshot} />
        </div>
      </CaseSection>

      <CaseSection index="04" label="Implied volatility" heading={`SPY’s smile from ${snapshot.quotes.toLocaleString('en-US')} cleaned quotes.`}>
        <div className="prose" data-reveal>
          <p>
            Of {snapshot.rawRows.toLocaleString('en-US')} raw option quotes, liquidity, spread and no-arbitrage filters kept{' '}
            {snapshot.quotes.toLocaleString('en-US')}; Newton’s method solved implied vol for every one. The arbitrage filter caught three stale
            quotes a volume filter missed.
          </p>
        </div>
        <Figure title="Implied vol by log-moneyness" aside={ymd(snapshot.date)} caption="A steep put skew: out-of-the-money puts (left) carry much higher implied vol than calls, and the skew is steepest at short maturities.">
          <LineChart
            height={300}
            ariaLabel="SPY implied volatility smile for three expiries"
            x={{ format: 'logm', name: 'ln(K/F)', label: 'Log-moneyness ln(K/F)', domain: [-0.4, 0.2], ticks: [-0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2] }}
            y={{ format: 'pct0', domain: [0.05, 0.4], ticks: [0.1, 0.2, 0.3, 0.4] }}
            series={smile.map((s, i) => ({
              id: s.expiry,
              label: `${s.days} days (${ymd(s.expiry)})`,
              color: SMILE_COLORS[i],
              points: s.points,
            }))}
          />
        </Figure>
        <Figure title="ATM implied vol · term structure" caption={`The 30-day ATM vol was ${(snapshot.atm30 * 100).toFixed(2)}% while VIX closed at ${snapshot.vix}, a ${(snapshot.vix - snapshot.atm30 * 100).toFixed(1)}-point gap that matters for the next section.`}>
          <LineChart
            height={240}
            ariaLabel="SPY at-the-money implied volatility by days to expiry"
            x={{ type: 'log', domain: [4, 700], ticks: [7, 30, 90, 180, 365, 600], format: 'days', name: 'Expiry' }}
            y={{ format: 'pct0', domain: [0.06, 0.2], ticks: [0.08, 0.12, 0.16, 0.2] }}
            series={[{ id: 'atm', label: 'ATM implied vol', color: 'var(--accent)', points: termStructure, area: true }]}
          />
          <DataTable
            caption="View the cleaning funnel"
            columns={['Filter', 'Quotes left']}
            rows={funnel.map(([f, n]) => [f, n.toLocaleString('en-US')])}
          />
        </Figure>
      </CaseSection>

      <CaseSection index="05" label="Variance risk premium" heading={`VIX was above realized vol in ${Math.round(vrp.shareAbove * 100)}% of months.`}>
        <div className="prose" data-reveal>
          <p>
            Across {vrp.months} monthly trades (short a 30-day ATM SPY call priced at VIX, delta-hedged daily on actual closes), the seller earned{' '}
            <strong>+{vrp.meanPnl.toFixed(2)}% of spot per month</strong> with a {Math.round(vrp.hitRate * 100)}% hit rate. Losses arrived in rare,
            sharp crises: the worst month was {vrp.worst.toFixed(2)}% (March 2020), the best +{vrp.best.toFixed(2)}% (December 2008, when VIX
            overshot to 68.5).
          </p>
          <p>
            Real P&amp;L tracked the gamma-theta approximation ½ΓS²(σ²<sub>implied</sub> − σ²<sub>realized</sub>)dt with correlation{' '}
            {vrp.corrGammaTheta.toFixed(2)}; the biggest misses were crash months, where daily moves are too large for a second-order expansion.
          </p>
        </div>
        <Figure title="Delta-hedged short call · P&L by year" aside="% of spot, summed" caption="Positive in all 19 calendar years. Even 2008 finished up (+2.0%), because VIX overshot realized vol late in the year. The pain shows up within years: monthly losses cluster in crises.">
          <BarChart
            height={260}
            ariaLabel="Yearly summed P&L of the delta-hedged short call strategy, 2007 to 2025"
            y={{ format: 'pctPts1' }}
            series={[{ id: 'pnl', label: 'Hedged P&L, % of spot', color: 'var(--accent)' }]}
            extra={[
              { key: 'vix', label: 'mean VIX', format: 'num1' },
              { key: 'realised', label: 'mean realized vol', format: 'num1' },
              { key: 'hit', label: 'hit rate', format: 'pct0' },
            ]}
            data={yearly.map((y) => ({
              label: `’${String(y.year).slice(2)}`,
              values: [y.pnl],
              meta: { vix: y.vix, realised: y.realised, hit: y.hitRate },
            }))}
          />
          <DataTable
            columns={['Year', 'P&L (% spot)', 'Hit rate', 'Mean VIX', 'Mean realized']}
            rows={yearly.map((y) => [y.year, y.pnl.toFixed(2), `${Math.round(y.hitRate * 100)}%`, y.vix.toFixed(1), y.realised.toFixed(1)])}
          />
        </Figure>
      </CaseSection>

      <CaseSection index="06" label="Caveats" heading="What this does not prove.">
        <div className="caveat" data-reveal>
          <strong>VIX is not SPY ATM implied vol.</strong> It is an SPX measure that includes the put skew; on the snapshot date it sat 2.8 points
          above SPY’s 30-day ATM vol. Priced 3 points below VIX, the hedged call’s profit falls to a statistically insignificant 0.06% per month.
          The premium itself (VIX vs. realized) is robust; how much of it an ATM seller captures is not established here, and option bid/ask costs
          are ignored.
        </div>
      </CaseSection>

      <CaseNext slug={project.slug} />
    </>
  );
}
