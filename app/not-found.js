import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="case-hero" style={{ minHeight: '80svh', borderBottom: 0 }}>
      <div className="wrap">
        <p className="eyebrow rise">
          <span style={{ color: 'var(--accent)' }}>404</span>
          <span style={{ marginLeft: 14 }}>Out of sample</span>
        </p>
        <h1 className="case-hero__title rise" style={{ '--delay': '80ms' }}>
          This page didn’t survive the <em>backtest</em>.
        </h1>
        <p className="lede rise" style={{ marginTop: 28, '--delay': '160ms' }}>
          The link may be old, or the page never existed.
        </p>
        <Link href="/" className="btn btn--solid rise" style={{ marginTop: 36, '--delay': '240ms' }}>
          <ArrowLeft size={16} aria-hidden="true" /> Back home
        </Link>
      </div>
    </section>
  );
}
