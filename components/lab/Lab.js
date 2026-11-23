'use client';

import { useState } from 'react';
import OptionsPricer from './OptionsPricer';
import OverfitExplorer from './OverfitExplorer';

const TABS = [
  { id: 'pricer', label: 'Options pricer' },
  { id: 'overfit', label: 'Overfitting explorer' },
];

export default function Lab({ options, strategy }) {
  const [tab, setTab] = useState('pricer');

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Interactive models" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'pricer' ? <OptionsPricer snapshot={options.snapshot} /> : <OverfitExplorer data={strategy} />}
      </div>
    </div>
  );
}
