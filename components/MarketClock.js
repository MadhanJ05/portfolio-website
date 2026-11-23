'use client';

import { useEffect, useState } from 'react';

// NYSE full-day closures and 1 p.m. early closes (ET), 2026–2027.
const HOLIDAYS = new Set([
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25', '2026-06-19',
  '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25',
  '2027-01-01', '2027-01-18', '2027-02-15', '2027-03-26', '2027-05-31', '2027-06-18',
  '2027-07-05', '2027-09-06', '2027-11-25', '2027-12-24',
]);
const EARLY_CLOSE = new Set(['2026-11-27', '2026-12-24', '2027-11-26']);

function marketState(now) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hour12: false,
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value])
  );
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const hour = Number(parts.hour) % 24;
  const minutes = hour * 60 + Number(parts.minute);
  const weekend = parts.weekday === 'Sat' || parts.weekday === 'Sun';
  const close = EARLY_CLOSE.has(date) ? 13 * 60 : 16 * 60;
  const open = !weekend && !HOLIDAYS.has(date) && minutes >= 9 * 60 + 30 && minutes < close;
  return { open, time: `${String(hour).padStart(2, '0')}:${parts.minute}` };
}

export default function MarketClock() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const tick = () => setState(marketState(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="nav__clock" aria-live="off">
      <span className={`dot ${state?.open ? 'dot--live' : ''}`} aria-hidden="true" />
      {state ? (
        <span>
          NYSE {state.open ? 'open' : 'closed'} · Boston {state.time} ET
        </span>
      ) : (
        <span>NYSE · Boston ET</span>
      )}
    </div>
  );
}
