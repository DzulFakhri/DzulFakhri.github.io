/* ============================================================
   timeline.js — Experience / Education tab switcher
   ============================================================ */

const Timeline = (() => {
  const TABS_ID      = 'timelineTabs';
  const ACTIVE_CLASS = 'active';

  function init() {
    const tabs = document.getElementById(TABS_ID);
    if (!tabs) return;

    const buttons = tabs.querySelectorAll('.tab-btn');
    const panels  = document.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn, buttons, panels));
    });

    // Keyboard navigation
    tabs.addEventListener('keydown', (e) => {
      const current = tabs.querySelector(`.tab-btn.${ACTIVE_CLASS}`);
      const btns = [...buttons];
      const idx  = btns.indexOf(current);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = btns[(idx + 1) % btns.length];
        switchTab(next, buttons, panels);
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = btns[(idx - 1 + btns.length) % btns.length];
        switchTab(prev, buttons, panels);
        prev.focus();
      }
    });
  }

  function switchTab(activeBtn, allButtons, allPanels) {
    const targetId = activeBtn.dataset.tab;

    // Update buttons
    allButtons.forEach(btn => {
      const isActive = btn === activeBtn;
      btn.classList.toggle(ACTIVE_CLASS, isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Update panels — re-trigger reveal animations in the new panel
    allPanels.forEach(panel => {
      const isActive = panel.id === targetId;
      panel.classList.toggle(ACTIVE_CLASS, isActive);

      if (isActive) {
        // Re-trigger scroll reveals inside newly shown panel
        panel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              Reveal.observe(el);
            });
          });
        });
      }
    });
  }

  return { init };
})();
