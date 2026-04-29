/* ============================================================
   reveal.js — Scroll-triggered fade-in animations
   Uses IntersectionObserver for performance
   ============================================================ */

const Reveal = (() => {
  let observer;

  const OPTIONS = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  function init() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }

    observer = new IntersectionObserver(onIntersect, OPTIONS);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function observe(el) {
    if (!observer) return;
    observer.observe(el);
  }

  function onIntersect(entries) {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 55, 300);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }

  return { init, observe };
})();
