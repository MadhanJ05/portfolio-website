// VOLTEX architecture. Two layouts (horizontal for wide screens, vertical for phones)
// so labels stay legible at every size.

function Node({ cx, cy, w, h = 46, title, sub, accent }) {
  return (
    <g className={`node${accent ? ' node--accent' : ''}`}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={6} />
      <text className="node__title" x={cx} y={sub ? cy - 4 : cy + 4} textAnchor="middle">
        {title}
      </text>
      {sub && (
        <text className="node__sub" x={cx} y={cy + 13} textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

const h = (x1, y1, x2, y2) => {
  const dx = (x2 - x1) / 2;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
};
const v = (x1, y1, x2, y2) => {
  const dy = (y2 - y1) / 2;
  return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
};

function Wide() {
  const sig = [64, 132, 200];
  const mod = [64, 132, 200];
  return (
    <svg className="diagram only-wide" viewBox="0 0 780 290" role="img" aria-labelledby="voltex-diagram-title">
      <title id="voltex-diagram-title">
        VOLTEX architecture: market signals feed 12 causal features, three models score risk, and a guardrailed RAG agent turns model outputs and SHAP drivers into an alert for the on-call engineer. The LLM never sees raw market data.
      </title>
      {[['SIGNALS', 66], ['FEATURES', 214], ['MODELS', 372], ['AGENT', 560], ['ALERT', 712]].map(([t, x]) => (
        <text key={t} className="lane-label" x={x} y={22} textAnchor="middle">
          {t}
        </text>
      ))}
      {sig.map((y) => (
        <path key={`s${y}`} className="edge" d={h(130, y, 160, 132)} />
      ))}
      {mod.map((y) => (
        <path key={`f${y}`} className="edge" d={h(268, 132, 298, y)} />
      ))}
      {mod.map((y) => (
        <path key={`m${y}`} className="edge" d={h(446, y, 488, 116)} />
      ))}
      <path className="edge edge--accent" d={h(632, 116, 656, 132)} />
      <line x1={467} x2={467} y1={34} y2={272} stroke="var(--accent)" strokeOpacity={0.45} />
      <text className="lane-label" x={474} y={272} style={{ fill: 'var(--accent)' }}>
        LLM BOUNDARY
      </text>

      <Node cx={66} cy={64} w={128} title="S&P 500" sub="505 tickers" />
      <Node cx={66} cy={132} w={128} title="VIX" sub="implied vol index" />
      <Node cx={66} cy={200} w={128} title="Macro calendar" sub="FOMC · CPI · NFP" />
      <Node cx={214} cy={132} w={108} title="Features" sub="12 causal, lagged" />
      <Node cx={372} cy={64} w={148} title="XGBoost" sub="risk tier · isotonic" />
      <Node cx={372} cy={132} w={148} title="Prophet + ARIMA" sub="volume forecast" />
      <Node cx={372} cy={200} w={148} title="Isolation Forest" sub="anomaly score" />
      <Node cx={560} cy={116} w={144} title="RAG agent" sub="Gemini · ChromaDB" accent />
      <text className="node__sub" x={560} y={166} textAnchor="middle">
        4 guardrails: schema,
      </text>
      <text className="node__sub" x={560} y={181} textAnchor="middle">
        driver, precedent, reasoning
      </text>
      <text className="node__sub" x={560} y={203} textAnchor="middle" style={{ fill: 'var(--ink-2)' }}>
        sees SHAP drivers, not raw data
      </text>
      <Node cx={712} cy={132} w={112} title="On-call SRE" sub="auditable alert" />
    </svg>
  );
}

function Tall() {
  const row = [62, 170, 278];
  return (
    <svg className="diagram only-tall" viewBox="0 0 340 600" role="img" aria-labelledby="voltex-diagram-title-m">
      <title id="voltex-diagram-title-m">
        VOLTEX architecture: market signals feed 12 causal features, three models score risk, and a guardrailed RAG agent turns model outputs and SHAP drivers into an alert for the on-call engineer.
      </title>
      <text className="lane-label" x={8} y={22}>SIGNALS</text>
      {row.map((x) => (
        <path key={`a${x}`} className="edge" d={v(x, 74, 170, 126)} />
      ))}
      {row.map((x) => (
        <path key={`b${x}`} className="edge" d={v(170, 172, x, 226)} />
      ))}
      {row.map((x) => (
        <path key={`c${x}`} className="edge" d={v(x, 272, 170, 362)} />
      ))}
      <path className="edge edge--accent" d={v(170, 410, 170, 500)} />
      <line x1={10} x2={330} y1={318} y2={318} stroke="var(--accent)" strokeOpacity={0.45} />
      <text className="lane-label" x={8} y={310} style={{ fill: 'var(--accent)' }}>
        LLM BOUNDARY
      </text>

      <Node cx={62} cy={52} w={100} title="S&P 500" sub="505 tickers" />
      <Node cx={170} cy={52} w={100} title="VIX" sub="vol index" />
      <Node cx={278} cy={52} w={100} title="Macro" sub="FOMC·CPI·NFP" />
      <Node cx={170} cy={149} w={180} title="Features" sub="12 causal, lagged" />
      <Node cx={62} cy={249} w={100} title="XGBoost" sub="risk tier" />
      <Node cx={170} cy={249} w={100} title="Prophet+ARIMA" sub="volume" />
      <Node cx={278} cy={249} w={100} title="Iso. Forest" sub="anomaly" />
      <Node cx={170} cy={386} w={210} title="RAG agent" sub="Gemini · ChromaDB" accent />
      <text className="node__sub" x={170} y={432} textAnchor="middle">
        4 guardrails · sees SHAP drivers, not raw data
      </text>
      <Node cx={170} cy={524} w={190} title="On-call SRE" sub="auditable alert" />
    </svg>
  );
}

export default function VoltexDiagram() {
  return (
    <>
      <Wide />
      <Tall />
    </>
  );
}
