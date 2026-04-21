/* ==========================================================
   The Snow Still Falls — interactive behaviour
   ========================================================== */

(function () {
  'use strict';

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('progress');
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Resize iframes to their content height ---------- */
  function resizeIframe(iframe) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc || !doc.body) return;
      const h = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight
      );
      if (h > 0) iframe.style.height = h + 'px';
    } catch (err) {
      /* cross-origin would throw; our iframes are same-origin */
    }
  }

  document.querySelectorAll('iframe.chart-frame').forEach(function (iframe) {
    const handler = function () { resizeIframe(iframe); };
    iframe.addEventListener('load', function () {
      handler();
      // charts may render a moment after load
      setTimeout(handler, 200);
      setTimeout(handler, 700);
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('iframe.chart-frame').forEach(resizeIframe);
  });

  /* ---------- Active section highlighting in TOC ---------- */
  const sectionLinks = document.querySelectorAll('.masthead nav a[href^="#"]');
  const sections = Array.from(document.querySelectorAll('.section'));

  function updateActive() {
    const y = window.scrollY + 120;
    let current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= y) current = s.id;
    });
    sectionLinks.forEach(function (a) {
      const match = a.getAttribute('href') === '#' + current;
      a.style.color = match ? 'var(--ink)' : '';
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
