'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Fades [data-reveal] elements in as they enter the viewport. Each element is observed
// on its own with threshold 0, so very tall blocks still reveal on small phones.
// Without JavaScript the CSS never hides anything (see `@media (scripting: enabled)`).
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]:not(.is-in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
