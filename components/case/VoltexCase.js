import VoltexDiagram from '@/components/VoltexDiagram';
import { CaseFigures, CaseHero, CaseNext, CaseSection, Figure } from './Case';

export default function VoltexCase({ project }) {
  return (
    <>
      <CaseHero
        project={project}
        title={
          <>
            VOLTEX: stress, <em>early</em>.
          </>
        }
        summary="Trading platforms tend to break on the days markets go wild. VOLTEX predicts those days from equity-market signals and warns the on-call engineer before the outage, in plain language, with every claim traceable to a model output."
        meta={[
          ['Role', 'Project lead · 3-person team'],
          ['Period', project.period],
          ['Sponsor', 'PayPal · Best Project'],
        ]}
      />
      <CaseFigures
        figures={[
          { value: '0.79', label: 'Macro-F1, vs. 0.61 for a rule-based baseline' },
          { value: '53→22%', label: 'False-positive rate after the ML layer' },
          { value: '6 / 6', label: 'Historical market crises flagged in backtesting' },
          { value: '4', label: 'Guardrails on every LLM-written alert' },
        ]}
      />

      <CaseSection index="01" label="The question" heading="Can market stress predict platform stress early enough to act?">
        <div className="prose" data-reveal>
          <p>
            Order volume surges when markets move violently, and that is when trading infrastructure is most likely to fail. Site reliability engineers
            usually find out from the outage. VOLTEX asks whether public market signals can give them a head start, and whether an LLM can explain the
            warning without being trusted with the decision.
          </p>
        </div>
      </CaseSection>

      <CaseSection index="02" label="Architecture" heading="Models decide. The LLM only explains." wide>
        <Figure title="System architecture" caption="Raw market data stops at the boundary: the agent receives model outputs and SHAP drivers, never prices or volumes.">
          <VoltexDiagram />
        </Figure>
      </CaseSection>

      <CaseSection index="03" label="Signals & models" heading="Twelve causal features, three complementary models.">
        <div className="prose" data-reveal>
          <p>
            Inputs span <strong>S&amp;P 500 data across 505 tickers</strong>, the VIX, and scheduled <strong>FOMC, CPI and NFP</strong> event flags.
            Features that depend on market activity are lagged one trading day, so each row only uses what was known before the day it predicts, and a
            leakage gate rejects anything that isn’t.
          </p>
          <ul>
            <li>
              <strong>XGBoost risk-tier classifier</strong> (Normal → Critical) with isotonic calibration, so a predicted 80% means 80%.
            </li>
            <li>
              <strong>Prophet + ARIMA</strong> volume forecasts; a large forecast surprise is itself a stress signal.
            </li>
            <li>
              <strong>Isolation Forest</strong> anomaly scores to catch unusual days that don’t look like past crises.
            </li>
          </ul>
        </div>
      </CaseSection>

      <CaseSection index="04" label="The alert layer" heading="A guardrailed RAG agent, built to be audited.">
        <div className="prose" data-reveal>
          <p>
            A retrieval-augmented agent (<strong>Gemini</strong> with a <strong>ChromaDB</strong> retrieval index) turns the risk tier and its SHAP
            drivers into an alert an engineer can act on at 9:15 a.m. Four guardrails check every alert before it ships: <strong>schema</strong>,{' '}
            <strong>driver</strong> (only cite drivers the model produced), <strong>precedent</strong>, and <strong>reasoning</strong>. The LLM can’t
            change the tier or its probabilities, and if it isn’t available a deterministic template writes the alert instead.
          </p>
        </div>
      </CaseSection>

      <CaseSection index="05" label="Results" heading="Fewer false alarms, every crisis caught.">
        <div className="prose" data-reveal>
          <p>
            Against a rule-based baseline, the ML layer lifted macro-F1 from <strong>0.61 to 0.79</strong> and cut the false-positive rate from{' '}
            <strong>53% to 22%</strong>, the difference between an alert engineers ignore and one they read. In backtesting it flagged{' '}
            <strong>all six historical market crises</strong> it was tested on. The project was selected as <strong>Best Project by PayPal</strong>.
          </p>
        </div>
      </CaseSection>

      <CaseNext slug={project.slug} />
    </>
  );
}
