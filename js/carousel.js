/* ============================================================
   carousel.js — Full-featured image carousel
   Features: drag/swipe, keyboard, autoplay, dots, thumbnails
   ============================================================ */

const Carousel = (() => {
  const AUTOPLAY_DELAY = 5000;
  const DRAG_THRESHOLD = 50; // px to register as swipe

  function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track     = container.querySelector('.carousel-track');
    const slides    = [...container.querySelectorAll('.carousel-slide')];
    const btnPrev   = container.querySelector('.carousel-btn--prev');
    const btnNext   = container.querySelector('.carousel-btn--next');
    const dotsWrap  = container.querySelector('.carousel-dots');
    const thumbsWrap= container.querySelector('.carousel-thumbs');
    const counter   = container.querySelector('.carousel-counter');

    if (!track || slides.length === 0) return;

    let current     = 0;
    let autoplayTimer = null;
    let isDragging  = false;
    let dragStartX  = 0;
    let dragDeltaX  = 0;

    // ── Build dots ──
    const dots = [];
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    // ── Build thumbnails ──
    const thumbs = [];
    if (thumbsWrap) {
      slides.forEach((slide, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'carousel-thumb' + (i === 0 ? ' active' : '');
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', `Go to slide ${i + 1}`);

        const img = slide.querySelector('.carousel-slide__media');
        if (img) {
          const thumbImg = document.createElement('img');
          thumbImg.src = img.src || img.getAttribute('src');
          thumbImg.alt = '';
          thumb.appendChild(thumbImg);
        } else {
          const label = slide.querySelector('.carousel-slide__title');
          thumb.style.background = 'linear-gradient(135deg, #1a1a2e, #0d1530)';
          thumb.style.display = 'flex';
          thumb.style.alignItems = 'center';
          thumb.style.justifyContent = 'center';
          thumb.style.fontSize = '0.6rem';
          thumb.style.color = 'rgba(255,255,255,0.5)';
          thumb.style.padding = '0.25rem';
          thumb.style.textAlign = 'center';
          thumb.style.fontFamily = "'Barlow Condensed', sans-serif";
          thumb.style.fontWeight = '700';
          thumb.style.letterSpacing = '0.05em';
          thumb.style.textTransform = 'uppercase';
          thumb.textContent = label ? label.textContent.slice(0, 20) : `Slide ${i+1}`;
        }

        thumb.addEventListener('click', () => goTo(i));
        thumb.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
        });

        thumbsWrap.appendChild(thumb);
        thumbs.push(thumb);
      });
    }

    // ── Navigation buttons ──
    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    // ── Keyboard ──
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAutoplay(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
    });

    // ── Touch / mouse drag ──
    function onDragStart(clientX) {
      isDragging = true;
      dragStartX = clientX;
      dragDeltaX = 0;
      track.style.transition = 'none';
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      dragDeltaX = clientX - dragStartX;
      const offset = -current * 100;
      const drag   = (dragDeltaX / container.offsetWidth) * 100;
      track.style.transform = `translateX(calc(${offset}% + ${dragDeltaX}px))`;
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';

      if (Math.abs(dragDeltaX) > DRAG_THRESHOLD) {
        goTo(dragDeltaX < 0 ? current + 1 : current - 1);
      } else {
        goTo(current); // snap back
      }
      resetAutoplay();
    }

    // Touch events
    track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove',  (e) => onDragMove(e.touches[0].clientX),  { passive: true });
    track.addEventListener('touchend',   onDragEnd);

    // Mouse drag
    track.addEventListener('mousedown',  (e) => { onDragStart(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => { if (isDragging) onDragMove(e.clientX); });
    window.addEventListener('mouseup',   onDragEnd);

    // ── Core navigation ──
    function goTo(index) {
      const total = slides.length;
      current = ((index % total) + total) % total; // wrap

      // Move track
      track.style.transform = `translateX(-${current * 100}%)`;

      // Update dots
      dots.forEach((d, i) => d.classList.toggle('active', i === current));

      // Update thumbs
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === current);
        if (i === current && thumbsWrap) {
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      // Update counter
      if (counter) {
        counter.innerHTML = `<span>${current + 1}</span> / ${total}`;
      }
    }

    // ── Autoplay ──
    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    // Pause on hover/focus
    container.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('focusin',    () => clearInterval(autoplayTimer));
    container.addEventListener('focusout',   startAutoplay);

    // ── Init ──
    goTo(0);
    startAutoplay();

    // Public API
    return { goTo, next: () => goTo(current + 1), prev: () => goTo(current - 1) };
  }

  return { init };
})();
