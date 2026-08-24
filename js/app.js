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

        // Trigger number count-ups if within metrics strip or contains data-target
        if (entry.target.classList.contains('metrics-strip') || entry.target.querySelector('[data-target]')) {
          initCounters(entry.target);
        }

        // Trigger shimmer on gradient words inside revealed section
        const gradientWords = entry.target.querySelectorAll('.gradient-word');
        gradientWords.forEach(word => word.classList.add('shimmer-active'));

        // Unobserve after entrance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Immediate check for elements already in viewport on page load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed');
        if (el.classList.contains('metrics-strip') || el.querySelector('[data-target]')) {
          initCounters(el);
        }
      }
    });
  }, 100);

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
        card.style.transition = 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        setTimeout(() => {
          card.style.transition = '';
        }, 250);
      });
    });
  }

  /* --------------------------------------------------------------------------
     5b. 21st.dev Spotlight Card Effect (Mouse-Tracking Radial Light)
     -------------------------------------------------------------------------- */
  const spotlightTargets = document.querySelectorAll(
    '.card, .pillar-card, .pricing-card, .testimonial-card, .industry-card, .product-split-card'
  );

  spotlightTargets.forEach(card => {
    if (!card.querySelector('.spotlight-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'spotlight-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      card.appendChild(overlay);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
     6. Navigation Elevation on Scroll (Permanently Fixed)
     -------------------------------------------------------------------------- */
  const navContainer = document.getElementById('main-nav-container');

  if (navContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navContainer.classList.add('nav--scrolled');
      } else {
        navContainer.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

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

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     10c. Clean URL Navigation (No Hash in Address Bar)
     -------------------------------------------------------------------------- */
  // Remove existing hash from address bar on initial load
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Intercept all anchor clicks to prevent hash in URL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      try {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();

          const navOffset = 70;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });

          // Ensure address bar remains clean without hash
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      } catch (err) {}
    });
  });

  /* --------------------------------------------------------------------------
     10b. Mobile Navigation Drawer Controller
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn');

  function toggleMobileMenu(open) {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    const shouldOpen = open !== undefined ? open : !mobileNavDrawer.classList.contains('open');
    mobileNavDrawer.classList.toggle('open', shouldOpen);
    mobileNavDrawer.setAttribute('aria-hidden', !shouldOpen);
    mobileMenuBtn.classList.toggle('active', shouldOpen);
    mobileMenuBtn.setAttribute('aria-expanded', shouldOpen);
  }

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (mobileNavDrawer.classList.contains('open') && !navContainer.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     11. Light / Dark Theme Toggle Controller
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme, savePreference = true) {
    const isLight = theme === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');

    if (themeToggleBtn) {
      const nextThemeLabel = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      themeToggleBtn.setAttribute('aria-label', nextThemeLabel);
      themeToggleBtn.setAttribute('title', nextThemeLabel);
    }

    if (savePreference) {
      try {
        localStorage.setItem('messageyard-theme', theme);
      } catch (e) {
        console.warn('Unable to persist theme preference in localStorage:', e);
      }
    }
  }

  // Initialize theme button states on load
  const initialTheme = getCurrentTheme();
  applyTheme(initialTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = getCurrentTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  // Listen for storage events across other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'messageyard-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue, false);
    }
  });

  // Listen to OS system color scheme changes if user hasn't explicitly set a preference
  const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeMediaQuery.addEventListener('change', (e) => {
    try {
      const hasStored = localStorage.getItem('messageyard-theme');
      if (!hasStored) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    } catch (err) {}
  });

  /* --------------------------------------------------------------------------
     12. Hero Channel Connectors Dynamic Anchor Alignment
     -------------------------------------------------------------------------- */
  function updateHeroRoutes() {
    const canvas = document.querySelector('.hero-tiles-canvas');
    const svg = document.querySelector('.hero-svg-routes');
    const heroContent = document.querySelector('.hero-content');
    if (!canvas || !svg || !heroContent) return;

    const canvasRect = canvas.getBoundingClientRect();
    const width = canvasRect.width;
    const height = canvasRect.height;
    if (width === 0 || height === 0) return;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const contentRect = heroContent.getBoundingClientRect();
    const targetX = (contentRect.left - canvasRect.left) + contentRect.width / 2;
    const targetY = (contentRect.top - canvasRect.top) + contentRect.height * 0.42;

    const tileConfigs = [
      { tile: document.querySelector('.hero-tile-1'), routeId: 'hero-route-1', pulseId: 'hero-pulse-1' },
      { tile: document.querySelector('.hero-tile-2'), routeId: 'hero-route-2', pulseId: 'hero-pulse-2' },
      { tile: document.querySelector('.hero-tile-3'), routeId: 'hero-route-3', pulseId: 'hero-pulse-3' },
      { tile: document.querySelector('.hero-tile-4'), routeId: 'hero-route-4', pulseId: 'hero-pulse-4' },
      { tile: document.querySelector('.hero-tile-5'), routeId: 'hero-route-5', pulseId: null },
      { tile: document.querySelector('.hero-tile-6'), routeId: 'hero-route-6', pulseId: null },
    ];

    tileConfigs.forEach(({ tile, routeId, pulseId }) => {
      if (!tile) return;
      const tileRect = tile.getBoundingClientRect();
      // Center coordinates of the tile card
      const startX = (tileRect.left - canvasRect.left) + tileRect.width / 2;
      const startY = (tileRect.top - canvasRect.top) + tileRect.height / 2;

      const dx = targetX - startX;
      const cp1x = startX + dx * 0.45;
      const cp1y = startY;
      const cp2x = startX + dx * 0.75;
      const cp2y = targetY;

      const pathD = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;

      const routeEl = document.getElementById(routeId);
      if (routeEl) routeEl.setAttribute('d', pathD);

      if (pulseId) {
        const pulseEl = document.getElementById(pulseId);
        if (pulseEl) pulseEl.setAttribute('d', pathD);
      }
    });
  }

  updateHeroRoutes();
  window.addEventListener('resize', updateHeroRoutes, { passive: true });
  window.addEventListener('load', updateHeroRoutes, { passive: true });

  /* --------------------------------------------------------------------------
     13. 21st.dev Pricing Interval Switcher Controller
     -------------------------------------------------------------------------- */
  const switcherBtns = document.querySelectorAll('.switcher-btn');
  const priceElements = document.querySelectorAll('.price-val');

  switcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const interval = btn.dataset.interval;
      switcherBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', isActive);
      });

      priceElements.forEach(priceEl => {
        const newVal = priceEl.dataset[interval];
        if (newVal) {
          priceEl.style.opacity = '0';
          priceEl.style.transform = 'translateY(-6px)';
          setTimeout(() => {
            priceEl.textContent = newVal;
            priceEl.style.transition = 'opacity 200ms ease, transform 200ms ease';
            priceEl.style.opacity = '1';
            priceEl.style.transform = 'translateY(0)';
          }, 150);
        }
      });
    });
  });
});
