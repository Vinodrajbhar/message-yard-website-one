/**
 * MESSAGE YARD — INTERACTION SYSTEM
 * Supports DESIGN.md v4.0 Specification
 * 3D Perspective Tilt · Studio Console · Telemetry · Live Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* --------------------------------------------------------------------------
     1. Unified IntersectionObserver for Scroll Reveals & Animations
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-lateral-left, .reveal-fade-lateral-right, .reveal-scale-in, .stagger-group, .metrics-strip'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Trigger number count-ups if within metrics strip
        if (entry.target.classList.contains('metrics-strip') || entry.target.querySelector('[data-target]')) {
          initCounters(entry.target);
        }

        // Trigger shimmer on gradient words inside revealed section
        const gradientWords = entry.target.querySelectorAll('.gradient-word');
        gradientWords.forEach(word => word.classList.add('shimmer-active'));

        // Unobserve after entrance if not re-triggerable
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     2. Count-Up Metrics Animation (requestAnimationFrame)
     -------------------------------------------------------------------------- */
  function initCounters(container) {
    const counterEls = container.querySelectorAll('[data-target]');
    counterEls.forEach(counter => {
      if (counter.dataset.animated) return;
      counter.dataset.animated = 'true';

      const target = parseFloat(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easedProgress * target);

        counter.textContent = currentVal.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }

      if (!isReducedMotion) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Studio Console Tab Switcher
     -------------------------------------------------------------------------- */
  const consoleTabs = document.querySelectorAll('.console-tab');
  const consolePanes = document.querySelectorAll('.console-tab-pane');

  consoleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      consoleTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      consolePanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Studio Console Scroll-Based 3D Flattening
     -------------------------------------------------------------------------- */
  const studioConsole = document.getElementById('studio-console');
  if (studioConsole && !isTouchDevice && !isReducedMotion) {
    window.addEventListener('scroll', () => {
      const rect = studioConsole.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.75 && rect.bottom > 0) {
        studioConsole.classList.add('flattened');
      } else {
        studioConsole.classList.remove('flattened');
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5. 3D Perspective Tilt on Interactive Cards (Desktop Only)
     -------------------------------------------------------------------------- */
  if (!isTouchDevice && !isReducedMotion && window.innerWidth >= 1200) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = y * -6; // max ±3deg
        const rotateY = x * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Smart Navigation Hide/Show on Scroll
     -------------------------------------------------------------------------- */
  const navContainer = document.getElementById('main-nav-container');
  let lastScrollY = window.scrollY;
  let scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      navContainer.classList.add('nav--scrolled');
    } else {
      navContainer.classList.remove('nav--scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY + 10) {
      navContainer.classList.add('nav--hidden');
    } else if (currentScrollY < lastScrollY - 10) {
      navContainer.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  /* --------------------------------------------------------------------------
     7. Live Telemetry Latency Ticker (Cycles 12ms -> 11ms -> 13ms -> 12ms)
     -------------------------------------------------------------------------- */
  const latencyEl = document.getElementById('telemetry-latency');
  if (latencyEl) {
    const latencyValues = ['12ms', '11ms', '13ms', '12ms', '10ms', '12ms'];
    let latencyIndex = 0;

    setInterval(() => {
      latencyIndex = (latencyIndex + 1) % latencyValues.length;
      latencyEl.textContent = latencyValues[latencyIndex];
    }, 2200);
  }

  /* --------------------------------------------------------------------------
     8. Easter Egg: Continuous Live Dispatch Counter (~70 msg/sec)
     -------------------------------------------------------------------------- */
  const dispatchCounterEl = document.getElementById('live-dispatch-counter');
  if (dispatchCounterEl) {
    let dispatchCount = 4231;

    setInterval(() => {
      // Add a randomized batch between 3 and 8 messages per tick (~70/sec)
      const increment = Math.floor(Math.random() * 6) + 3;
      dispatchCount += increment;
      dispatchCounterEl.textContent = dispatchCount.toLocaleString();
    }, 90);
  }

  /* --------------------------------------------------------------------------
     9. Pricing Detailed Comparison Table Accordion Toggle
     -------------------------------------------------------------------------- */
  const comparisonToggle = document.getElementById('comparison-toggle');
  const comparisonContent = document.getElementById('comparison-content');
  const toggleChevron = document.getElementById('toggle-chevron');

  if (comparisonToggle && comparisonContent) {
    comparisonToggle.addEventListener('click', () => {
      const isExpanded = comparisonToggle.getAttribute('aria-expanded') === 'true';
      comparisonToggle.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        comparisonContent.style.display = 'none';
        if (toggleChevron) toggleChevron.style.transform = 'rotate(0deg)';
      } else {
        comparisonContent.style.display = 'block';
        if (toggleChevron) toggleChevron.style.transform = 'rotate(180deg)';
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Floating Back-to-Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
