/* ============================================================
   AMZExpand Landing Page — main.js
   Vanilla JS interactions
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. HEADER SCROLL ─────────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ── 2. MOBILE HAMBURGER ──────────────────────────────── */
  var hamburger  = document.getElementById('hdr-hamburger');
  var mobileNav  = document.getElementById('hdr-mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    /* Close on mobile link click */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ── 3. VSL PLAY BUTTON ──────────────────────────────── */
  var vsl = document.getElementById('vsl-trigger');
  if (vsl) {
    function activateVsl () {
      /* In a real implementation this would inject an iframe or video tag.
         For demo purposes we show an activated state. */
      vsl.style.cursor = 'default';
      var center = vsl.querySelector('.s1-vsl-center');
      if (center) center.style.display = 'none';
      var footer = vsl.querySelector('.s1-vsl-footer');
      if (footer) footer.style.display = 'none';
      /* Visual feedback */
      vsl.style.background = 'linear-gradient(150deg, #0D1119 0%, #131929 100%)';
    }

    vsl.addEventListener('click', activateVsl);
    vsl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateVsl();
      }
    });
  }

  /* ── 4. SECTION 2 COUNTER ANIMATION ─────────────────── */
  var counter   = document.getElementById('s2-counter');
  var s2Section = document.querySelector('.s2');
  if (counter && s2Section) {
    var target   = 50000;
    var duration = 2200;
    var started  = false;

    function easeOutCubic (t) { return 1 - Math.pow(1 - t, 3); }

    function formatNum (n) {
      var s = '' + Math.floor(n);
      var r = '';
      for (var i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 === 0) r += ',';
        r += s[i];
      }
      return '$' + r + '+';
    }

    function runCounter (startTs) {
      function tick (ts) {
        var progress = Math.min((ts - startTs) / duration, 1);
        counter.textContent = formatNum(target * easeOutCubic(progress));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) {
        started = true;
        requestAnimationFrame(function (ts) { runCounter(ts); });
      }
    }, { threshold: 0.2 });

    obs.observe(s2Section);
  }

  /* ── 5. SECTION 7 FAQ ACCORDION ─────────────────────── */
  var faqTriggers = document.querySelectorAll('.s7-trigger');
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item   = trigger.closest('.s7-item');
      var panel  = item.querySelector('.s7-panel');
      var isOpen = trigger.classList.contains('is-open');

      /* Close all */
      faqTriggers.forEach(function (t) {
        t.classList.remove('is-open');
        t.setAttribute('aria-expanded', 'false');
        var p = t.closest('.s7-item').querySelector('.s7-panel');
        if (p) p.classList.remove('is-open');

        /* Reset icon colours */
        var path = t.querySelector('.s7-chevron');
        var circle = t.querySelector('circle');
        if (path) path.setAttribute('stroke', '#5E626C');
        if (circle) circle.setAttribute('stroke', '#C2C5CC');
      });

      /* Toggle clicked one */
      if (!isOpen) {
        trigger.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');

        /* Update icon to orange */
        var path = trigger.querySelector('.s7-chevron');
        var circle = trigger.querySelector('circle');
        if (path) path.setAttribute('stroke', '#E8800A');
        if (circle) circle.setAttribute('stroke', '#E8800A');
      }
    });
  });

  /* Open first FAQ by default */
  if (faqTriggers.length > 0) {
    var firstPath   = faqTriggers[0].querySelector('.s7-chevron');
    var firstCircle = faqTriggers[0].querySelector('circle');
    if (firstPath)   firstPath.setAttribute('stroke', '#E8800A');
    if (firstCircle) firstCircle.setAttribute('stroke', '#E8800A');
  }

  /* ── 6. SECTION 9 EXPANDABLE PANEL ──────────────────── */
  var s9Trigger = document.getElementById('s9-expand-btn');
  var s9Panel   = document.getElementById('s9-panel');
  if (s9Trigger && s9Panel) {
    s9Trigger.addEventListener('click', function () {
      var isOpen = s9Trigger.classList.toggle('is-open');
      s9Panel.classList.toggle('is-open', isOpen);
      s9Trigger.setAttribute('aria-expanded', String(isOpen));
      s9Panel.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  /* ── 7. SMOOTH ANCHOR SCROLL ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerH = header ? header.getBoundingClientRect().height : 65;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── 8. REVEAL ANIMATION ON SCROLL ──────────────────── */
  var revealEls = document.querySelectorAll(
    '.s2-inner, .s3-card, .s4-left, .s4-right, .s5-featured, .s5-mini, ' +
    '.s6-left, .s6-right, .s7-item, .s8-metric, .s8-guarantee-item, .s9-inner'
  );

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      revealObs.observe(el);
    });
  }

  /* Apply revealed styles */
  document.addEventListener('animationend', function () {}, false);

  /* Simple CSS class toggling for reveal */
  var style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);

  /* ── S5 MINI CARDS MOBILE CAROUSEL ──────────────────────── */
  (function () {
    var track   = document.getElementById('s5-trio-track');
    var prevBtn = document.getElementById('s5-prev');
    var nextBtn = document.getElementById('s5-next');
    var dots    = document.querySelectorAll('.s5-carousel-dot');
    if (!track || !prevBtn || !nextBtn) return;

    var current = 0;
    var total   = 3;

    function isMobile() { return window.innerWidth <= 767; }

    function goTo(index) {
      if (!isMobile()) return;
      current = Math.max(0, Math.min(index, total - 1));
      /* Slide the track */
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      /* Update dots */
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    /* Init track style for mobile sliding */
    function initCarousel() {
      if (isMobile()) {
        track.style.transition = 'transform 0.35s ease';
        track.style.willChange = 'transform';
        goTo(current);
      } else {
        /* Reset on desktop */
        track.style.transform = '';
        track.style.transition = '';
        dots.forEach(function (d) { d.classList.remove('active'); });
        dots[0] && dots[0].classList.add('active');
        current = 0;
      }
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-index'), 10));
      });
    });

    /* Sync dots on touch swipe */
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!isMobile()) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); }
    }, { passive: true });

    initCarousel();
    window.addEventListener('resize', initCarousel);
  }());

})();
