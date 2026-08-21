/* ==========================================================================
   MessageYard — Dialog UI Interactions & Micro-Animations
   Strict implementation of design.md with Bidirectional Scroll Reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initNavbarScroll();
  init3DParallax();
  initBrowserTabs();
  initInboxShowroom();
  initWhatsAppEditor();
  initFaqAccordion();
  initContactForm();
});

/* ==========================================================================
   1. Bidirectional "To and Fro" Scroll Reveal Engine
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Entering the viewport: trigger reveal animation
          entry.target.classList.add('is-visible');
        } else {
          // Leaving the viewport (scrolled past or scrolled back up): reset for re-reveal
          const bounding = entry.boundingClientRect;
          if (bounding.top > 0 || bounding.bottom < 0) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   2. Floating Nav Pill Scroll Elevation
   ========================================================================== */
function initNavbarScroll() {
  const navPill = document.getElementById('main-nav-pill');
  if (!navPill) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navPill.classList.add('is-scrolled');
    } else {
      navPill.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. Browser Frame Tab Switcher with Micro-Transitions
   ========================================================================== */
function initBrowserTabs() {
  const tabBtns = document.querySelectorAll('.browser-tab-btn');
  const panes = document.querySelectorAll('.studio-pane-layout');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const viewKey = btn.getAttribute('data-view');
      tabBtns.forEach((b) => b.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`view-${viewKey}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Showroom Inbox Interactive Demo
   ========================================================================== */
const showroomThreads = {
  1: {
    name: 'Sophia Laurent',
    location: 'Paris, France • VIP Customer',
    org: 'Luxe Boutique Paris',
    spend: '€2,450.00',
    avatar: 'assets/images/avatar-claire.jpg',
    messages: [
      { type: 'in', text: 'Bonjour! Could you confirm if the Summer Silk Trench is in stock in Paris?' },
      { type: 'out', text: 'Hello Sophia! Yes, we have 2 pieces reserved in store for you. Would you like a direct checkout link?' },
      { type: 'in', text: 'Yes please, send the payment link via WhatsApp!' }
    ]
  },
  2: {
    name: 'David Miller',
    location: 'San Francisco, USA • Enterprise Lead',
    org: 'Miller Dev & Cloud',
    spend: '$14,200.00',
    avatar: 'assets/images/avatar-tobias.jpg',
    messages: [
      { type: 'in', text: 'Hi! We need Postgres trigger webhooks configured for our team trial.' },
      { type: 'out', text: 'Hey David! Your Postgres real-time telemetry pipeline is now active in workspace settings.' },
      { type: 'in', text: 'Stripe webhook question: can we pass custom metadata tags?' }
    ]
  },
  3: {
    name: 'Marcus Vance',
    location: 'London, UK • Logistics Partner',
    org: 'Vance Fleet Logistics',
    spend: '$4,150.00',
    avatar: 'assets/images/avatar-rajesh.jpg',
    messages: [
      { type: 'in', text: 'Order #MY-9821 dispatch received. SMS tracking delivered instantly.' },
      { type: 'out', text: 'Great to hear Marcus! Let us know if you need automated customs clearance notifications configured.' }
    ]
  }
};

let activeThreadId = '1';

function initInboxShowroom() {
  const cards = document.querySelectorAll('.showroom-thread-card');
  const chatStream = document.getElementById('chat-stream-box');
  const inputElem = document.getElementById('showroom-input');
  const sendBtn = document.getElementById('showroom-send-btn');

  const avatarElem = document.getElementById('active-avatar');
  const nameElem = document.getElementById('active-name');
  const orgElem = document.getElementById('crm-org');
  const valElem = document.getElementById('crm-val');

  function renderThread() {
    const thread = showroomThreads[activeThreadId];
    if (!thread) return;

    if (avatarElem) avatarElem.src = thread.avatar;
    if (nameElem) nameElem.textContent = thread.name;
    if (orgElem) orgElem.textContent = thread.org;
    if (valElem) valElem.textContent = thread.spend;

    if (chatStream) {
      chatStream.innerHTML = '';
      thread.messages.forEach((msg) => {
        const bubble = document.createElement('div');
        bubble.className = `s-bubble ${msg.type}`;
        bubble.textContent = msg.text;
        chatStream.appendChild(bubble);
      });
      chatStream.scrollTop = chatStream.scrollHeight;
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      activeThreadId = card.getAttribute('data-id');
      renderThread();
    });
  });

  function handleSend() {
    if (!inputElem || !inputElem.value.trim()) return;
    const text = inputElem.value.trim();

    if (showroomThreads[activeThreadId]) {
      showroomThreads[activeThreadId].messages.push({ type: 'out', text: text });
    }

    renderThread();
    inputElem.value = '';
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputElem) {
    inputElem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  renderThread();
}

/* ==========================================================================
   5. WhatsApp Studio Live Two-Way Editor
   ========================================================================== */
function initWhatsAppEditor() {
  const titleIn = document.getElementById('wa-title-in');
  const bodyIn = document.getElementById('wa-body-in');
  const titleOut = document.getElementById('wa-title-out');
  const bodyOut = document.getElementById('wa-body-out');

  if (titleIn && titleOut) {
    titleIn.addEventListener('input', (e) => {
      titleOut.textContent = e.target.value || 'VIP PRIVATE SALE';
    });
  }

  if (bodyIn && bodyOut) {
    bodyIn.addEventListener('input', (e) => {
      bodyOut.textContent = e.target.value || 'Hello, your private shopping code is ready.';
    });
  }
}

/* ==========================================================================
   6. FAQ Showroom Accordion with Spring Transition
   ========================================================================== */
function initFaqAccordion() {
  const cards = document.querySelectorAll('.faq-showroom-card');
  cards.forEach((card) => {
    const q = card.querySelector('.faq-showroom-q');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        cards.forEach((c) => c.classList.remove('open'));
        if (!isOpen) card.classList.add('open');
      });
    }
  });
}

/* ==========================================================================
   7. Interactive Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form-element');
  const successMsg = document.getElementById('contact-success-msg');

  if (form && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = 'Message Sent ✓';
          submitBtn.style.background = '#059669';
          submitBtn.style.color = '#FFFFFF';
        }
        successMsg.style.display = 'block';
        form.reset();
      }, 600);
    });
  }
}

/* ==========================================================================
   8. 3D Parallax Mouse Physics Engine
   ========================================================================== */
function init3DParallax() {
  const stage = document.getElementById('hero-3d-stage');
  const scene = document.getElementById('hero-3d-scene');
  if (!stage || !scene) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x;
    mouseY = y;
  });

  stage.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const rotX = 14 - currentY * 24;
    const rotY = -16 + currentX * 30;
    const rotZ = 2 - currentX * 3;

    scene.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
    requestAnimationFrame(animate);
  }

  animate();
}
