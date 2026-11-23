import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import MonteCarloHero from '@/components/MonteCarloHero';
import Ticker from '@/components/Ticker';
import SectionHead from '@/components/SectionHead';
import Lab from '@/components/lab/Lab';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import VoltexDiagram from '@/components/VoltexDiagram';
import CopyEmail from '@/components/CopyEmail';
import options from '@/data/options-lab.json';
import strategy from '@/data/strategy-search.json';
import { awards, education, experience, heroStats, moreWork, site, toolkit, work } from '@/lib/content';

const shortDate = (iso) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function WorkFigure({ slug }) {
  if (slug === 'options-engine') {
    return (
      <>
        <div className="figure__head">
          <span className="eyebrow">SPY ATM implied vol · term structure</span>
          <span className="eyebrow">{shortDate(options.snapshot.date)}</span>
        </div>
        <LineChart
          height={250}
          ariaLabel="SPY at-the-money implied volatility by days to expiry"
          x={{ type: 'log', domain: [4, 700], ticks: [7, 30, 90, 180, 365, 600], format: 'days', name: 'Expiry' }}
          y={{ format: 'pct0', domain: [0.06, 0.2], ticks: [0.08, 0.12, 0.16, 0.2] }}
          series={[{ id: 'atm', label: 'ATM implied vol', color: 'var(--accent)', points: options.termStructure, area: true }]}
        />
        <p className="figure__caption">
          From 8.5% at 5 days to 17.8% at 616 days: an upward-sloping curve typical of a calm market. 30-day ATM vol was{' '}
          {(options.snapshot.atm30 * 100).toFixed(2)}% while VIX closed at {options.snapshot.vix}.
        </p>
      </>
    );
  }
  if (slug === 'strategy-search') {
    return (
      <>
        <div className="figure__head">
          <span className="eyebrow">Walk-forward picks vs. SPY · annual return</span>
          <span className="eyebrow">2012–2025</span>
        </div>
        <BarChart
          height={250}
          ariaLabel="Annual return of the walk-forward strategy pick versus SPY, 2012 to 2025"
          y={{ format: 'pct0' }}
          series={[
            { id: 'wf', label: 'Strategy picked on prior 5 years', color: 'var(--accent)' },
            { id: 'spy', label: 'SPY', color: 'var(--viz-neutral)' },
          ]}
          extra={[{ key: 'sharpe', label: 'pick’s Sharpe that year', format: 'num2' }]}
          data={strategy.walkForward.map((w) => ({
            label: `’${String(w.year).slice(2)}`,
            values: [w.testReturn, w.spyReturn],
            meta: { sharpe: w.testSharpe },
          }))}
        />
        <p className="figure__caption">
          Every year the search re-picked its best backtest from the prior five years. Traded live, the picks compounded at 2.2% a year
          against SPY’s 14.9%.
        </p>
      </>
    );
  }
  return (
    <>
      <div className="figure__head">
        <span className="eyebrow">System architecture</span>
        <span className="eyebrow">PayPal-sponsored</span>
      </div>
      <VoltexDiagram />
      <p className="figure__caption">
        The LLM never touches raw market data. It explains model outputs and SHAP drivers, and four guardrails check every alert before it
        reaches an engineer.
      </p>
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero" aria-labelledby="hero-name">
        <MonteCarloHero />
        <div className="wrap hero__body">
          <p className="eyebrow hero__eyebrow rise">
            <span className="dot dot--live" aria-hidden="true" />
            {site.status.split(' · ').map((part, i, all) => (
              <Fragment key={part}>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {part}
                  {i < all.length - 1 ? ' ·' : ''}
                </span>{' '}
              </Fragment>
            ))}
          </p>
          <h1 className="hero__name rise" id="hero-name" style={{ '--delay': '90ms' }}>
            Madhan <em>Jothimani</em>
          </h1>
          <p className="hero__lede rise" style={{ '--delay': '180ms' }}>
            I build <strong>pricing models</strong> and <strong>trading research</strong> that hold up out of sample.
          </p>
          <div className="hero__actions rise" style={{ '--delay': '270ms' }}>
            <a href="#work" className="btn btn--solid">
              See the work <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#lab" className="btn btn--ghost">
              Run the models
            </a>
          </div>
          <p className="hero__caption rise" style={{ '--delay': '320ms' }} aria-hidden="true">
            Background: a live Monte Carlo simulation of <span style={{ whiteSpace: 'nowrap' }}>1-year</span> stock prices.
          </p>
        </div>
        <div className="wrap rise" style={{ '--delay': '360ms' }}>
          <dl className="hero__stats">
            {heroStats.map((s) => (
              <div className="stat" key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="stat__value">{s.value}</dd>
                <dd className="stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Ticker />

      {/* ---------------------------------------------------------------- Work */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <SectionHead
            index="01"
            label="Selected work"
            id="work-title"
            title={
              <>
                Research I can <em>defend</em>.
              </>
            }
            kicker="Three flagship projects. Each asks a market question, answers it with code you can rerun, and reports where the answer stops."
          />
          <div className="work-list">
            {work.map((w) => (
              <article className="work-row" key={w.slug} aria-labelledby={`w-${w.slug}`}>
                <div data-reveal>
                  <div className="work-row__meta">
                    <span className="work-row__num">{w.num}</span>
                    <span className="eyebrow">{w.category}</span>
                    <span className="eyebrow">{w.period}</span>
                  </div>
                  {w.badge && (
                    <p className="badge-new" style={{ marginLeft: 0, marginTop: 18 }}>
                      {w.badge}
                    </p>
                  )}
                  <h3 className="work-row__title" id={`w-${w.slug}`}>
                    <Link href={`/work/${w.slug}`}>{w.title}</Link>
                  </h3>
                  <p className="work-row__summary">{w.summary}</p>
                  <dl className="work-row__figures">
                    {w.figures.map((f) => (
                      <div className="stat" key={f.label}>
                        <dt className="sr-only">{f.label}</dt>
                        <dd className="stat__value">{f.value}</dd>
                        <dd className="stat__label">{f.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="work-row__tags">
                    {w.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="work-row__links">
                    <Link href={`/work/${w.slug}`} className="link-arrow">
                      Read the case study <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                    <a href={w.github} className="link-arrow" target="_blank" rel="noopener noreferrer">
                      Code on GitHub <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <figure className="figure" data-reveal style={{ '--delay': '120ms' }}>
                  <WorkFigure slug={w.slug} />
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Lab */}
      <section className="section section--raise" id="lab" aria-labelledby="lab-title">
        <div className="wrap">
          <SectionHead
            index="02"
            label="The lab"
            id="lab-title"
            title={
              <>
                Models you can <em>interrogate</em>.
              </>
            }
            kicker="The pricer and the overfitting test from my projects, rebuilt to run in your browser on the same data and checked against each repo’s published numbers."
          />
          <div data-reveal>
            <Lab options={options} strategy={strategy} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- More work */}
      <section className="section" id="more" aria-labelledby="more-title">
        <div className="wrap">
          <SectionHead
            index="03"
            label="Also built"
            id="more-title"
            title={
              <>
                Pipelines, retrieval <em>& ML</em>.
              </>
            }
            kicker="Streaming systems, warehouses, search and applied ML: the engineering underneath the research."
          />
          <div className="index-list">
            {moreWork.map((p) => (
              <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className="index-row" data-reveal>
                <span className="index-row__year">{p.year}</span>
                <span>
                  <span className="index-row__title">{p.title}</span>
                  <span className="index-row__desc" style={{ display: 'block' }}>
                    {p.desc}
                  </span>
                  <span className="index-row__stack" style={{ display: 'block' }}>
                    {p.stack.join(' · ')}
                  </span>
                </span>
                <ArrowUpRight className="index-row__arrow" size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Recognition */}
      <section className="section section--raise" id="recognition" aria-labelledby="rec-title">
        <div className="wrap">
          <SectionHead
            index="04"
            label="Recognition"
            id="rec-title"
            title={
              <>
                Wins & <em>community</em>.
              </>
            }
          />
          <div className="awards">
            {awards.map((a) => (
              <div key={a.title} className={`award${a.lead ? ' award--lead' : ''}`} data-reveal>
                <span className="award__year">{a.year}</span>
                <div>
                  <h3 className="award__title">{a.title}</h3>
                  <p className="award__org">{a.org}</p>
                </div>
                <p className="award__desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Background */}
      <section className="section" id="background" aria-labelledby="bg-title">
        <div className="wrap">
          <SectionHead
            index="05"
            label="Background"
            id="bg-title"
            title={
              <>
                Engineer, analyst, <em>quant</em>.
              </>
            }
            kicker="Electronics engineering, two years building production data and ML systems at Infosys, analytics at Northeastern, and next, quantitative finance at Boston College."
          />
          <div className="bg-grid">
            <div data-reveal>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                Education
              </p>
              <div className="ledger">
                {education.map((e) => (
                  <div className="ledger__item" key={e.title}>
                    <div className="ledger__top">
                      <h3 className="ledger__title">
                        {e.title}
                        {e.badge && <span className="badge-new">{e.badge}</span>}
                      </h3>
                      <span className="ledger__when">{e.when}</span>
                    </div>
                    <p className="ledger__sub">{e.org}</p>
                    {e.body && <p className="ledger__body">{e.body}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal style={{ '--delay': '120ms' }}>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                Experience
              </p>
              <div className="ledger">
                {experience.map((x) => (
                  <div className="ledger__item" key={x.title}>
                    <div className="ledger__top">
                      <h3 className="ledger__title">{x.title}</h3>
                      <span className="ledger__when">{x.when}</span>
                    </div>
                    <p className="ledger__sub">{x.org}</p>
                    <div className="ledger__body">
                      <ul>
                        {x.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="toolkit" data-reveal>
            {toolkit.map(([cat, items]) => (
              <div className="toolkit__row" key={cat}>
                <h3 className="toolkit__cat">{cat}</h3>
                <p className="toolkit__items">
                  {items.map((i) => (
                    <Fragment key={i}>
                      <span>{i}</span>{' '}
                    </Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Contact */}
      <section className="contact section--raise" id="contact" aria-labelledby="contact-title" style={{ borderBottom: 0 }}>
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            <span style={{ color: 'var(--accent)' }}>06</span>
            <span style={{ marginLeft: 14 }}>Contact</span>
          </p>
          <h2 className="contact__title" id="contact-title" data-reveal style={{ '--delay': '80ms', marginTop: 24 }}>
            Let’s <em>connect</em>.
          </h2>
          <div className="contact__email" data-reveal style={{ '--delay': '160ms' }}>
            <a className="mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <CopyEmail email={site.email} />
          </div>
          <div className="contact__links" data-reveal style={{ '--delay': '220ms' }}>
            <a className="link-arrow" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className="link-arrow" href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
