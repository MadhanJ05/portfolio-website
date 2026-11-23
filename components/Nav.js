'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, site } from '@/lib/content';
import MarketClock from './MarketClock';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  // Scroll state + progress bar, throttled to one update per frame.
  // Progress is written straight to a CSS variable so scrolling never re-renders the page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      navRef.current?.style.setProperty('--progress', p.toFixed(4));
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Active section: whichever section crosses the middle band of the viewport.
  // Works for sections of any height (unlike a visibility-ratio threshold).
  useEffect(() => {
    if (!isHome) return;
    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  // Mobile menu: lock scroll, close on Escape or route change.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close the menu when the route changes (reset during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const activeId = isHome ? active : null;
  const href = (id) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header ref={navRef} className="nav" data-scrolled={scrolled || open ? 'true' : 'false'}>
        <div className="wrap nav__inner">
          <Link href="/" className="nav__brand" aria-label={`${site.name}, home`}>
            Madhan <em>Jothimani</em>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.id} href={href(n.id)} className="nav__link" aria-current={activeId === n.id ? 'true' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>

          <MarketClock />

          <button
            type="button"
            className="nav__menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 8h16M3 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        <div className="nav__progress" aria-hidden="true" />
      </header>

      {open && (
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          {nav.map((n, i) => (
            <a key={n.id} href={href(n.id)} onClick={() => setOpen(false)}>
              <span>0{i + 1}</span>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
