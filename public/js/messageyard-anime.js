/**
 * MessageYard Ultra-Smooth 60/120fps High-Performance Motion Engine
 * Zero-layout-thrashing architecture, pre-cached geometry, decoupled entrance physics,
 * subtle mouse parallax, gentle floating breathing, and seamless scroll scrub.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSideSectionNav();
  initBackToTop();
  initBlendBarsMotion();
  initStatCounters();
  initPlatformTabs();
  initTestimonialTabs();
  initHeaderScroll();
  initStaggeredScrollReveals();
  initUnifiedMotionAndScrubEngine();
});

/**
 * 0. Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/**
 * 1. Hero Difference Blend Bars Motion
 */
function initBlendBarsMotion() {
  const bars = document.querySelectorAll('section.page-header.home .bars .bar');
  if (!bars.length || typeof anime === 'undefined') return;

  anime({
    targets: bars,
    scaleY: [
      { value: 0.03, duration: 0 },
      { value: (el, i) => (i % 2 === 0 ? 0.055 : 0.035), duration: 1200, easing: 'easeOutExpo' }
    ],
    delay: anime.stagger(80),
    complete: () => {
      anime({
        targets: bars,
        scaleY: (el, i) => [
          (i % 2 === 0 ? 0.055 : 0.035),
          (i % 2 === 0 ? 0.085 : 0.05)
        ],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 3200,
        delay: anime.stagger(150)
      });
    }
  });
}

/**
 * 2. Metric Stat Counters
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length || typeof anime === 'undefined') return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-val') || '0');
        const isDecimal = targetVal % 1 !== 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        const obj = { val: 0 };
        anime({
          targets: obj,
          val: targetVal,
          duration: 1800,
          easing: 'easeOutExpo',
          update: () => {
            el.innerText = prefix + (isDecimal ? obj.val.toFixed(3) : Math.floor(obj.val).toLocaleString()) + suffix;
          }
        });

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * 3. Interactive Platform Tabs with Smooth Cross-Fade & Staggered Elements
 */
function initPlatformTabs() {
  const tabs = document.querySelectorAll('.platform-tab-btn');
  const panels = document.querySelectorAll('.platform-tab-panel');

  if (!tabs.length || !panels.length) return;

  let isAnimating = false;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active') || isAnimating) return;

      const targetId = tab.getAttribute('data-tab-target');
      const targetPanel = document.getElementById(targetId);
      const currentActivePanel = document.querySelector('.platform-tab-panel.active');

      if (!targetPanel) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (typeof anime !== 'undefined' && currentActivePanel) {
        isAnimating = true;

        anime({
          targets: currentActivePanel,
          opacity: [1, 0],
          translateY: [0, -8],
          duration: 160,
          easing: 'easeInQuad',
          complete: () => {
            currentActivePanel.classList.remove('active');
            currentActivePanel.style.transform = '';

            targetPanel.classList.add('active');
            targetPanel.style.opacity = '0';
            targetPanel.style.transform = 'translateY(16px)';

            anime({
              targets: targetPanel,
              opacity: [0, 1],
              translateY: [16, 0],
              duration: 420,
              easing: 'easeOutCubic',
              complete: () => {
                isAnimating = false;
              }
            });

            anime({
              targets: targetPanel.querySelectorAll('.panel-text h3, .panel-text p'),
              opacity: [0, 1],
              translateY: [12, 0],
              duration: 400,
              delay: anime.stagger(60, { start: 40 }),
              easing: 'easeOutCubic'
            });

            anime({
              targets: targetPanel.querySelectorAll('.panel-bullets li'),
              opacity: [0, 1],
              translateX: [-14, 0],
              duration: 380,
              delay: anime.stagger(45, { start: 100 }),
              easing: 'easeOutCubic'
            });

            const mockup = targetPanel.querySelector('.panel-console-mockup');
            if (mockup) {
              anime({
                targets: mockup,
                opacity: [0, 1],
                translateX: [24, 0],
                scale: [0.98, 1],
                duration: 450,
                delay: 60,
                easing: 'easeOutCubic'
              });

              anime({
                targets: mockup.querySelectorAll('.mockup-body > div'),
                opacity: [0, 1],
                translateX: [10, 0],
                duration: 320,
                delay: anime.stagger(35, { start: 140 }),
                easing: 'easeOutCubic'
              });
            }
          }
        });
      } else {
        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * 4. Testimonial Quote Switcher
 */
function initTestimonialTabs() {
  const buttons = document.querySelectorAll('.quote-tab-btn');
  const quotes = [
    {
      text: '"We moved our entire lifecycle marketing program onto Messageyard and cut our martech stack from six vendors to one. Campaign velocity roughly doubled."',
      name: 'Priya Desai',
      role: 'VP Growth Marketing, Northbeam'
    },
    {
      text: '"The fact that our journeys run on Messageyard\'s own CPaaS instead of a reseller markup means our SMS costs dropped and deliverability actually improved."',
      name: 'Marcus Ellery',
      role: 'Head of Marketing Operations, Lumen Retail'
    },
    {
      text: '"Our marketing team builds the journey. Our engineering team extends it with the API when we need something custom. That handoff used to take weeks — now it doesn\'t exist."',
      name: 'Ana Beltrán',
      role: 'CMO, Finwave'
    }
  ];

  const quoteContent = document.querySelector('.quote-content');
  const authorName = document.querySelector('.author-name');
  const authorRole = document.querySelector('.author-role');

  if (!buttons.length || !quoteContent) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-quote-index'), 10);
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (typeof anime !== 'undefined') {
        anime({
          targets: [quoteContent, authorName, authorRole],
          opacity: [1, 0],
          translateY: [0, -8],
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            quoteContent.innerText = quotes[idx].text;
            authorName.innerText = quotes[idx].name;
            authorRole.innerText = quotes[idx].role;

            anime({
              targets: [quoteContent, authorName, authorRole],
              opacity: [0, 1],
              translateY: [8, 0],
              duration: 350,
              easing: 'easeOutQuad'
            });
          }
        });
      } else {
        quoteContent.innerText = quotes[idx].text;
        authorName.innerText = quotes[idx].name;
        authorRole.innerText = quotes[idx].role;
      }
    });
  });
}

/**
 * 5. Header Hide/Show on Scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 120 && currentScrollY > lastScrollY) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/**
 * 6. Staggered Scroll Reveal System for All Sections & Elements
 */
function initStaggeredScrollReveals() {
  if (typeof anime === 'undefined') return;

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;

        if (sec.classList.contains('page-header')) {
          anime({
            targets: sec.querySelectorAll('.eyebrow-badge, h1, .hero-desc, .hero-cta-group, .hero-trust-line'),
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('centered-text')) {
          anime({
            targets: sec.querySelectorAll('.tag-label, h3, .narrative'),
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 850,
            delay: anime.stagger(140),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('cards')) {
          anime({
            targets: sec.querySelectorAll('.card-item'),
            opacity: [0, 1],
            translateY: [35, 0],
            duration: 850,
            delay: anime.stagger(130),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('how-it-works')) {
          anime({
            targets: sec.querySelectorAll('.text-tag, h2, .platform-nav-tabs, .platform-tab-panel.active .panel-text > *, .platform-tab-panel.active .panel-console-mockup'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('link-grid')) {
          anime({
            targets: sec.querySelectorAll('.link-grid-header, .channel-box'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 750,
            delay: anime.stagger(80),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('quote-section')) {
          anime({
            targets: sec.querySelectorAll('.quote-tabs-nav, .quote-content, .quote-author'),
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 800,
            delay: anime.stagger(120),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('featured-articles')) {
          anime({
            targets: sec.querySelectorAll('.articles-header, .article-card'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(110),
            easing: 'easeOutCubic'
          });
        } else if (sec.classList.contains('sock')) {
          anime({
            targets: sec.querySelectorAll('.sock-content h3, .sock-content p, .sock-content .btn-sock-cta'),
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 850,
            delay: anime.stagger(110),
            easing: 'easeOutCubic'
          });
        }

        obs.unobserve(sec);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section').forEach(s => revealObserver.observe(s));
}

/**
 * 7. Zero-Layout-Thrashing 60/120fps Unified Motion Engine
 * - Pre-caches all DOM geometry & coordinates once (and on window resize)
 * - Zero forced synchronous layout recalculations inside the animation loop
 * - High-precision lerp smoothing with dynamic sub-pixel GPU compositing
 */
function initUnifiedMotionAndScrubEngine() {
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // Mouse Parallax Target & Current State
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  // Scroll Target & Current State
  let currentScrollY = window.scrollY;
  let targetScrollY = window.scrollY;
  let isTicking = false;

  function scheduleRender() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderLoop);
    }
  }

  window.addEventListener('mousemove', (e) => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    targetMouseX = (e.clientX / winW - 0.5) * 2;
    targetMouseY = (e.clientY / winH - 0.5) * 2;
    scheduleRender();
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    targetMouseX = 0;
    targetMouseY = 0;
    scheduleRender();
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    scheduleRender();
  }, { passive: true });

  // Cached DOM Nodes
  const hero = document.querySelector('section.page-header.home');
  const heroContent = hero?.querySelector('.content');
  const heroPillsFg = hero ? Array.from(hero.querySelectorAll('.fg .pill')) : [];
  const heroPillsBg = hero ? Array.from(hero.querySelectorAll('.bg .pill')) : [];
  const heroBars = hero ? Array.from(hero.querySelectorAll('.bars .bar')) : [];

  const centeredSec = document.querySelector('section.centered-text');
  const centeredContainer = centeredSec?.querySelector('.container');

  const cardsSec = document.querySelector('section.cards');
  const cards = cardsSec ? Array.from(cardsSec.querySelectorAll('.card-item')) : [];

  const howSec = document.querySelector('section.how-it-works');
  const howHeader = howSec?.querySelector('.how-it-works-wrapper > h2');
  const howTabs = howSec?.querySelector('.platform-nav-tabs');

  const linkSec = document.querySelector('section.link-grid');
  const linkHeader = linkSec?.querySelector('.link-grid-header');
  const channelBoxes = linkSec ? Array.from(linkSec.querySelectorAll('.channel-box')) : [];

  const quoteSec = document.querySelector('section.quote-section');
  const quoteWrapper = quoteSec?.querySelector('.quote-wrapper');

  const articlesSec = document.querySelector('section.featured-articles');
  const articles = articlesSec ? Array.from(articlesSec.querySelectorAll('.article-card')) : [];

  const sockSec = document.querySelector('section.sock');
  const sockContent = sockSec?.querySelector('.sock-content');

  // =========================================================================
  // Geometry Cache Structure (Zero Layout Thrashing in RAF)
  // =========================================================================
  let heroH = 800;
  let focalX = 600;
  let focalY = 800;
  let winH = window.innerHeight;

  let fgPillMetrics = [];
  let bgPillMetrics = [];

  let secOffsets = {
    centered: { top: 0, height: 0 },
    cards: { top: 0, height: 0 },
    how: { top: 0, height: 0 },
    link: { top: 0, height: 0 },
    quote: { top: 0, height: 0 },
    articles: { top: 0, height: 0 },
    sock: { top: 0, height: 0 }
  };

  function updateGeometryCache() {
    winH = window.innerHeight;
    if (hero) {
      heroH = hero.offsetHeight || winH;
      focalX = (hero.offsetWidth || window.innerWidth) / 2;
      focalY = heroH;

      fgPillMetrics = heroPillsFg.map((pill) => {
        const pillCenterX = pill.offsetLeft + pill.offsetWidth / 2;
        const pillCenterY = pill.offsetTop + pill.offsetHeight / 2;
        return {
          deltaX: focalX - pillCenterX,
          deltaY: focalY - pillCenterY,
          isLeft: pillCenterX < focalX
        };
      });

      bgPillMetrics = heroPillsBg.map((bgPill) => {
        const bgCenterX = bgPill.offsetLeft + bgPill.offsetWidth / 2;
        const bgCenterY = bgPill.offsetTop + bgPill.offsetHeight / 2;
        return {
          deltaX: focalX - bgCenterX,
          deltaY: focalY - bgCenterY
        };
      });
    }

    const getDocTop = (el) => {
      if (!el) return 0;
      let top = 0;
      let curr = el;
      while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      return top;
    };

    if (centeredSec) secOffsets.centered = { top: getDocTop(centeredSec), height: centeredSec.offsetHeight };
    if (cardsSec) secOffsets.cards = { top: getDocTop(cardsSec), height: cardsSec.offsetHeight };
    if (howSec) secOffsets.how = { top: getDocTop(howSec), height: howSec.offsetHeight };
    if (linkSec) secOffsets.link = { top: getDocTop(linkSec), height: linkSec.offsetHeight };
    if (quoteSec) secOffsets.quote = { top: getDocTop(quoteSec), height: quoteSec.offsetHeight };
    if (articlesSec) secOffsets.articles = { top: getDocTop(articlesSec), height: articlesSec.offsetHeight };
    if (sockSec) secOffsets.sock = { top: getDocTop(sockSec), height: sockSec.offsetHeight };
  }

  // Pre-calculate once on load and on window resize
  updateGeometryCache();
  window.addEventListener('resize', updateGeometryCache, { passive: true });

  function getCachedSectionDelta(secKey) {
    const sec = secOffsets[secKey];
    if (!sec || !sec.height) return 0;
    const currentTop = sec.top - currentScrollY;
    return (currentTop + sec.height / 2 - winH / 2) / winH;
  }

  function isSectionInView(secKey) {
    const sec = secOffsets[secKey];
    if (!sec || !sec.height) return false;
    const viewTop = currentScrollY - 200;
    const viewBottom = currentScrollY + winH + 200;
    const secBottom = sec.top + sec.height;
    return secBottom >= viewTop && sec.top <= viewBottom;
  }

  // =========================================================================
  // 60/120fps Pure-Calculation Animation Loop
  // =========================================================================
  function renderLoop() {
    const isMobile = window.innerWidth <= 768;

    mouseX = lerp(mouseX, targetMouseX, 0.09);
    mouseY = lerp(mouseY, targetMouseY, 0.09);
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

    const time = performance.now() * 0.0016;

    // 1. HERO SECTION (Only update when within top scroll region)
    if (hero && currentScrollY < (heroH || winH) + 200) {
      const heroScrolled = clamp(currentScrollY / (heroH || 1), 0, 1.25);

      // Hero Center Content
      if (heroContent) {
        const textMouseX = isMobile ? 0 : mouseX * 4;
        const textMouseY = isMobile ? 0 : mouseY * 4;
        const textScrollY = heroScrolled * 60;
        const textOpacity = clamp(1 - heroScrolled * 1.4, 0, 1);
        const textScale = clamp(1 - heroScrolled * 0.05, 0.94, 1);

        heroContent.style.transform = `translate3d(${textMouseX.toFixed(2)}px, ${(textMouseY - textScrollY).toFixed(2)}px, 0) scale(${textScale.toFixed(3)})`;
        heroContent.style.opacity = textOpacity.toFixed(3);
      }

      // Hero Floating Pills (Only on Desktop)
      if (!isMobile) {
        for (let i = 0; i < heroPillsFg.length; i++) {
          const pill = heroPillsFg[i];
          const m = fgPillMetrics[i];
          if (!m) continue;

          const progress = Math.pow(heroScrolled, 1.2);
          const currentDispX = m.deltaX * progress;
          const currentDispY = m.deltaY * progress;

          const depth = (i % 3) + 1;
          const currentMouseX = mouseX * depth * 8;
          const currentMouseY = mouseY * depth * 8;

          const totalX = (currentDispX + currentMouseX).toFixed(2);
          const totalY = (currentDispY + currentMouseY).toFixed(2);
          const scale = clamp(1 - progress * 0.85, 0, 1).toFixed(3);
          const opacity = clamp(1 - progress * 2.2, 0, 1).toFixed(3);

          pill.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) scale(${scale})`;
          pill.style.opacity = opacity;
        }

        // Hero Background Soft Pills
        for (let i = 0; i < heroPillsBg.length; i++) {
          const bgPill = heroPillsBg[i];
          const m = bgPillMetrics[i];
          if (!m) continue;

          const progress = Math.pow(heroScrolled, 1.2);
          const currentDispX = m.deltaX * progress;
          const currentDispY = m.deltaY * progress;

          const depth = 0.5;
          const currentMouseX = mouseX * depth * 5;
          const currentMouseY = mouseY * depth * 5;

          const totalBgX = (currentDispX + currentMouseX).toFixed(2);
          const totalBgY = (currentDispY + currentMouseY).toFixed(2);
          const bgScale = clamp(1 - progress * 0.85, 0, 1).toFixed(3);
          const bgOpacity = clamp(0.5 - progress * 1.5, 0, 0.5).toFixed(3);

          bgPill.style.transform = `translate3d(${totalBgX}px, ${totalBgY}px, 0) scale(${bgScale})`;
          bgPill.style.opacity = bgOpacity;
        }
      }

      // Difference Blend Bars
      for (let i = 0; i < heroBars.length; i++) {
        const base = (i % 2 === 0 ? 0.05 : 0.035);
        const expanded = clamp(base + heroScrolled * 0.35, 0.03, 1).toFixed(3);
        heroBars[i].style.transform = `scaleY(${expanded})`;
      }
    }

    // 2. CENTERED NARRATIVE (Only when in view)
    if (centeredSec && centeredContainer && isSectionInView('centered')) {
      const delta = getCachedSectionDelta('centered');
      const translateY = (delta * (isMobile ? 12 : 20)).toFixed(2);
      centeredContainer.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }

    // 3. CAPABILITY CARDS (Only when in view)
    if (cardsSec && cards.length && isSectionInView('cards')) {
      const delta = getCachedSectionDelta('cards');
      for (let idx = 0; idx < cards.length; idx++) {
        const sideX = isMobile ? 0 : ((idx === 0 ? -1 : idx === 2 ? 1 : 0) * delta * 70).toFixed(2);
        const verticalY = (delta * (isMobile ? 12 : 20)).toFixed(2);
        cards[idx].style.transform = `translate3d(${sideX}px, ${verticalY}px, 0)`;
      }
    }

    // 4. PLATFORM ARCHITECTURE (Only when in view)
    if (howSec && isSectionInView('how')) {
      const delta = getCachedSectionDelta('how');
      if (howHeader) {
        howHeader.style.transform = `translate3d(0, ${(delta * (isMobile ? 8 : 14)).toFixed(2)}px, 0)`;
      }
      if (howTabs) {
        howTabs.style.transform = `translate3d(0, ${(delta * (isMobile ? 6 : 10)).toFixed(2)}px, 0)`;
      }

      const activePanel = howSec.querySelector('.platform-tab-panel.active');
      if (activePanel) {
        const panelText = activePanel.querySelector('.panel-text');
        const panelMockup = activePanel.querySelector('.panel-console-mockup');

        if (panelText) {
          const pSideX = isMobile ? 0 : (-delta * 50).toFixed(2);
          panelText.style.transform = `translate3d(${pSideX}px, ${(delta * 10).toFixed(2)}px, 0)`;
        }

        if (panelMockup) {
          const tiltX = clamp(delta * 4, -5, 5).toFixed(2);
          const mSideX = isMobile ? 0 : (delta * 50).toFixed(2);
          panelMockup.style.transform = isMobile
            ? `translate3d(0, ${(delta * 10).toFixed(2)}px, 0)`
            : `perspective(1000px) rotateX(${tiltX}deg) translate3d(${mSideX}px, ${(delta * 12).toFixed(2)}px, 0)`;
        }
      }
    }

    // 5. CHANNELS GRID (Only when in view)
    if (linkSec && channelBoxes.length && isSectionInView('link')) {
      const delta = getCachedSectionDelta('link');
      if (linkHeader) {
        linkHeader.style.transform = `translate3d(0, ${(delta * (isMobile ? 8 : 12)).toFixed(2)}px, 0)`;
      }
      for (let idx = 0; idx < channelBoxes.length; idx++) {
        const col = idx % 3;
        const sideX = isMobile ? 0 : ((col === 0 ? -1 : col === 2 ? 1 : 0) * delta * 45).toFixed(2);
        const verticalY = (delta * (isMobile ? 10 : 16)).toFixed(2);
        channelBoxes[idx].style.transform = `translate3d(${sideX}px, ${verticalY}px, 0)`;
      }
    }

    // 6. TESTIMONIAL QUOTE (Only when in view)
    if (quoteSec && quoteWrapper && isSectionInView('quote')) {
      const delta = getCachedSectionDelta('quote');
      quoteWrapper.style.transform = `translate3d(0, ${(delta * (isMobile ? 8 : 14)).toFixed(2)}px, 0)`;
    }

    // 7. FEATURED ARTICLES (Only when in view)
    if (articlesSec && articles.length && isSectionInView('articles')) {
      const delta = getCachedSectionDelta('articles');
      for (let idx = 0; idx < articles.length; idx++) {
        const sideX = isMobile ? 0 : ((idx === 0 ? -1 : idx === 2 ? 1 : 0) * delta * 50).toFixed(2);
        const verticalY = (delta * (isMobile ? 10 : 18)).toFixed(2);
        articles[idx].style.transform = `translate3d(${sideX}px, ${verticalY}px, 0)`;
      }
    }

    // 8. SOCK BANNER (Only when in view)
    if (sockSec && sockContent && isSectionInView('sock')) {
      const delta = getCachedSectionDelta('sock');
      const sockY = clamp(delta * (isMobile ? 10 : 16), -18, 18).toFixed(2);
      sockContent.style.transform = `translate3d(0, ${sockY}px, 0)`;
    }

    // Check if motion has settled to sleep the loop and conserve CPU/battery
    const isSettled =
      Math.abs(targetScrollY - currentScrollY) < 0.1 &&
      Math.abs(targetMouseX - mouseX) < 0.002 &&
      Math.abs(targetMouseY - mouseY) < 0.002;

    if (!isSettled) {
      requestAnimationFrame(renderLoop);
    } else {
      currentScrollY = targetScrollY;
      mouseX = targetMouseX;
      mouseY = targetMouseY;
      isTicking = false;
    }
  }

  scheduleRender();
}

/**
 * 8. Fixed Vertical Section Side Navigation (Desktop Only)
 */
function initSideSectionNav() {
  const sideNav = document.getElementById('side-nav');
  const dots = Array.from(document.querySelectorAll('.side-nav-dot'));
  const progressLine = document.getElementById('side-nav-progress');
  if (!sideNav || !dots.length) return;

  const sectionIds = ['hero', 'why-messageyard', 'capabilities', 'platform', 'channels', 'resources', 'sock'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function updateActiveSection() {
    const winH = window.innerHeight;
    const viewportCenter = window.scrollY + winH * 0.5;
    let activeIdx = 0;
    let minDistance = Infinity;

    sections.forEach((sec, idx) => {
      let top = 0;
      let curr = sec;
      while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      const center = top + (sec.offsetHeight || winH) / 2;
      const dist = Math.abs(viewportCenter - center);
      if (dist < minDistance) {
        minDistance = dist;
        activeIdx = idx;
      }
    });

    if (window.scrollY < winH * 0.35) {
      activeIdx = 0;
    } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
      activeIdx = sections.length - 1;
    }

    dots.forEach((dot, idx) => {
      if (idx === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (progressLine && sections.length > 1) {
      const progress = (activeIdx / (sections.length - 1)) * 100;
      progressLine.style.height = `${progress}%`;
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection, { passive: true });
  updateActiveSection();

  // Smooth scroll to section on click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute('data-section');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * 9. Go to Top Button (Bottom Right)
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 380) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 10. Interactive Console Copy Payload Action
 */
window.copyConsolePayload = function(btn) {
  const panel = btn.closest('.panel-console-mockup');
  if (!panel) return;
  const body = panel.querySelector('.mockup-body');
  if (!body) return;

  const textToCopy = body.innerText.replace(/_/g, '').trim();
  navigator.clipboard.writeText(textToCopy).then(() => {
    const span = btn.querySelector('span');
    if (span) {
      const originalText = span.textContent;
      span.textContent = 'Copied! ✓';
      btn.style.borderColor = '#10b981';
      btn.style.color = '#10b981';
      setTimeout(() => {
        span.textContent = originalText;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 1800);
    }
  }).catch(() => {
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = 'Copied! ✓';
      setTimeout(() => { span.textContent = 'Copy'; }, 1500);
    }
  });
};
