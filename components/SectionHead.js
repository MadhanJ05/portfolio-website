export default function SectionHead({ index, label, title, kicker, id }) {
  return (
    <header className="section-head">
      <div className="section-head__index eyebrow" data-reveal>
        <span style={{ color: 'var(--accent)' }}>{index}</span>
        <span>{label}</span>
      </div>
      <h2 className="section-head__title" id={id} data-reveal style={{ '--delay': '80ms' }}>
        {title}
      </h2>
      {kicker && (
        <p className="section-head__kicker" data-reveal style={{ '--delay': '160ms' }}>
          {kicker}
        </p>
      )}
    </header>
  );
}
