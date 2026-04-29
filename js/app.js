/* ============================================================
   app.js — Main entry point, initialises all modules
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
  Timeline.init();
  Carousel.init('mainCarousel');
  Reveal.init();
});
