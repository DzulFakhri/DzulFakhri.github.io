/* ============================================================
   navbar.js — Mobile hamburger menu toggle
   ============================================================ */

const Navbar = (() => {
  const TOGGLE_ID  = 'navToggle';
  const MENU_ID    = 'navMenu';
  const OPEN_CLASS = 'open';

  let toggle, menu;

  function init() {
    toggle = document.getElementById(TOGGLE_ID);
    menu   = document.getElementById(MENU_ID);

    if (!toggle || !menu) return;

    toggle.addEventListener('click', handleToggle);

    // Close when any nav link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        close();
      }
    });

    // Close on resize if desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) close();
    });
  }

  function handleToggle() {
    const isOpen = menu.classList.toggle(OPEN_CLASS);
    toggle.classList.toggle(OPEN_CLASS, isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  }

  function close() {
    menu.classList.remove(OPEN_CLASS);
    toggle.classList.remove(OPEN_CLASS);
    toggle.setAttribute('aria-expanded', false);
  }

  return { init };
})();
