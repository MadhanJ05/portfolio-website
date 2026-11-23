import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { work } from '@/lib/content';

export function CaseHero({ project, title, summary, meta }) {
  return (
    <header className="case-hero">
      <div className="wrap">
        <Link href="/#work" className="case-hero__back rise">
          <ArrowLeft size={14} aria-hidden="true" /> All work
        </Link>
        <p className="eyebrow rise" style={{ marginTop: 40, '--delay': '60ms' }}>
          <span style={{ color: 'var(--accent)' }}>{project.num}</span>
          <span style={{ marginLeft: 14 }}>{project.category}</span>
        </p>
        {project.badge && (
          <p className="badge-new rise" style={{ marginLeft: 0, marginTop: 16, '--delay': '90ms' }}>
            {project.badge}
          </p>
        )}
        <h1 className="case-hero__title rise" style={{ marginTop: 20, '--delay': '120ms' }}>
          {title}
        </h1>
        <p className="case-hero__summary lede rise" style={{ '--delay': '180ms' }}>
          {summary}
        </p>
        <dl className="case-meta rise" style={{ '--delay': '240ms' }}>
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>Code</dt>
            <dd>
              <a href={project.github} className="link-arrow" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15 }}>
                GitHub <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export function CaseFigures({ figures }) {
  return (
    <div className="wrap">
      <dl className="case-figures">
        {figures.map((f) => (
          <div className="stat" key={f.label} data-reveal>
            <dt className="sr-only">{f.label}</dt>
            <dd className="stat__value">{f.value}</dd>
            <dd className="stat__label">{f.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CaseSection({ index, label, heading, children, wide }) {
  return (
    <section className="case-section">
      <div className="wrap">
        <div className={wide ? '' : 'case-section__grid'}>
          <div className={wide ? '' : 'case-section__label'} style={wide ? { marginBottom: 28 } : undefined} data-reveal>
            <p className="eyebrow">
              <span style={{ color: 'var(--accent)' }}>{index}</span>
              <span style={{ marginLeft: 12 }}>{label}</span>
            </p>
            {wide && heading && (
              <h2 className="case-section__heading" style={{ marginTop: 14 }}>
                {heading}
              </h2>
            )}
          </div>
          <div className="stack-gap" style={{ minWidth: 0 }}>
            {!wide && heading && (
              <h2 className="case-section__heading" data-reveal>
                {heading}
              </h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseNext({ slug }) {
  const i = work.findIndex((w) => w.slug === slug);
  const next = work[(i + 1) % work.length];
  return (
    <div className="case-next">
      <div className="wrap">
        <Link href={`/work/${next.slug}`}>
          <span className="eyebrow">Next case study · {next.num}</span>
          <span className="case-next__title" style={{ display: 'block' }}>
            {next.title} →
          </span>
        </Link>
      </div>
    </div>
  );
}

export function Figure({ title, aside, caption, children }) {
  return (
    <figure className="figure" data-reveal>
      {(title || aside) && (
        <div className="figure__head">
          <span className="eyebrow">{title}</span>
          {aside && <span className="eyebrow">{aside}</span>}
        </div>
      )}
      {children}
      {caption && <figcaption className="figure__caption">{caption}</figcaption>}
    </figure>
  );
}
