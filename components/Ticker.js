import { ticker } from '@/lib/content';

const ARROW = { up: '▲', down: '▼', flat: '◆' };

function Group({ hidden }) {
  return (
    <div className="ticker__group" aria-hidden={hidden || undefined}>
      {ticker.map(([sym, value, note, dir]) => (
        <span key={sym} className="ticker__item">
          <span className="ticker__sym">{sym}</span>
          <span className={`ticker__${dir}`}>
            {ARROW[dir]} {value}
          </span>
          <span>{note}</span>
        </span>
      ))}
    </div>
  );
}

// Two identical groups make a seamless loop; the second is hidden from assistive tech.
export default function Ticker() {
  return (
    <div className="ticker" role="region" aria-label="Key results">
      <div className="ticker__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
