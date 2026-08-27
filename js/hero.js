/**
 * ==========================================================================
 * MESSAGEYARD — INTERACTIVE 3D ISOMETRIC ENGINE (PIXEL-PERFECT VISUALIZER)
 * Dynamic Neon Pipeline Tracers, Particle Flow & Interactive Telemetry
 * ==========================================================================
 */

(function () {
  'use strict';

  // ── Precision Conduit Bezier Paths (Normalized 1000x500 space) ────────
  // Mapped pixel-perfect to the actual rendered pipelines in the image
  const CONDUIT_PATHS = [
    {
      id: 'conduit-green',
      name: 'Flow Logic & Automated Journeys',
      channel: 'logic',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.9)',
      // Starts in tunnel mouth (570, 180) -> curves top-left loop (320, 90) -> (250, 100)
      path: 'M 570 185 C 500 170, 380 100, 310 90 C 270 85, 245 100, 255 110',
      rate: '14,200/s',
      latency: '8ms',
      delivery: '99.99%',
      status: 'Healthy'
    },
    {
      id: 'conduit-blue',
      name: 'WhatsApp Business Cloud Gateway',
      channel: 'whatsapp',
      color: '#0ea5e9',
      glow: 'rgba(14, 165, 233, 0.9)',
      // Starts in tunnel mouth (575, 190) -> curves left to blue trunk (410, 140) -> down to Blue Cube (220, 200)
      path: 'M 575 190 C 510 170, 420 135, 340 160 C 280 180, 240 195, 220 205',
      rate: '45,800/s',
      latency: '12ms',
      delivery: '99.99%',
      status: 'Active · Peak'
    },
    {
      id: 'conduit-orange',
      name: 'Global Aggregator Hub',
      channel: 'aggregate',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.9)',
      // Branches left from blue trunk (340, 160) -> to Orange Cube (130, 195)
      path: 'M 340 160 C 280 165, 200 175, 130 195',
      rate: '18,500/s',
      latency: '15ms',
      delivery: '99.97%',
      status: 'Optimal'
    },
    {
      id: 'conduit-purple',
      name: 'Transactional SMS & RCS Rail',
      channel: 'sms',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.9)',
      // Starts in tunnel mouth (580, 195) -> curves down-left to Purple Cube (315, 245)
      path: 'M 580 195 C 520 185, 440 190, 380 220 C 350 235, 330 240, 315 245',
      rate: '32,100/s',
      latency: '16ms',
      delivery: '99.95%',
      status: 'Optimal'
    },
    {
      id: 'conduit-coral',
      name: 'High-Volume Email Engine',
      channel: 'email',
      color: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.9)',
      // Starts in tunnel mouth (585, 200) -> curves forward-center to Red Cube (415, 268)
      path: 'M 585 200 C 535 200, 480 215, 450 240 C 430 255, 420 262, 415 268',
      rate: '88,400/s',
      latency: '22ms',
      delivery: '99.98%',
      status: 'Active · High'
    },
    {
      id: 'conduit-gold-1',
      name: 'Mobile Push & Webhook Rail 1',
      channel: 'push',
      color: '#eab308',
      glow: 'rgba(234, 179, 8, 0.9)',
      // Starts in tunnel mouth (590, 205) -> curves forward-right to Yellow Cube 1 (600, 285)
      path: 'M 590 205 C 555 215, 530 240, 545 265 C 560 280, 580 285, 600 288',
      rate: '115,000/s',
      latency: '5ms',
      delivery: '99.99%',
      status: 'Lightning'
    },
    {
      id: 'conduit-gold-2',
      name: 'Mobile Push & Webhook Rail 2',
      channel: 'push',
      color: '#eab308',
      glow: 'rgba(234, 179, 8, 0.9)',
      // Branches right from Yellow path to Yellow Cube 2 (725, 270)
      path: 'M 545 265 C 600 275, 670 270, 725 272',
      rate: '94,000/s',
      latency: '6ms',
      delivery: '99.99%',
      status: 'Lightning'
    }
  ];

  // ── Node Telemetry Metadata ─────────────────────────────────────────
  const NODE_DATA = {
    'orange': {
      title: 'Global Aggregator Hub',
      channel: 'Direct Carrier Tier-1 Ingress',
      rate: '18,500 msg/sec',
      latency: '15 ms',
      success: '99.97%',
      activeSessions: '84,120',
      color: '#f97316',
      icon: '📦'
    },
    'blue': {
      title: 'WhatsApp Business Gateway',
      channel: 'Meta Direct Cloud API Tier-1',
      rate: '45,800 msg/sec',
      latency: '12 ms',
      success: '99.99%',
      activeSessions: '342,900',
      color: '#0ea5e9',
      icon: '💬'
    },
    'purple': {
      title: 'Transactional SMS & RCS Rail',
      channel: 'Global SS7 & SMPP High-Throughput Mesh',
      rate: '32,100 msg/sec',
      latency: '16 ms',
      success: '99.95%',
      activeSessions: '198,400',
      color: '#a855f7',
      icon: '📱'
    },
    'coral': {
      title: 'High-Volume Email Engine',
      channel: 'Dedicated IP Pools & Warmers',
      rate: '88,400 msg/sec',
      latency: '22 ms',
      success: '99.98%',
      activeSessions: '512,000',
      color: '#f43f5e',
      icon: '✉️'
    },
    'gold1': {
      title: 'Mobile Push Notifications',
      channel: 'APNs & FCM Ultra-Low Latency Rail',
      rate: '115,000 msg/sec',
      latency: '5 ms',
      success: '99.99%',
      activeSessions: '890,250',
      color: '#eab308',
      icon: '🔔'
    },
    'gold2': {
      title: 'Instant Webhook Dispatches',
      channel: 'Authenticated HTTP Ingress & Callback Rail',
      rate: '94,000 msg/sec',
      latency: '6 ms',
      success: '99.99%',
      activeSessions: '640,100',
      color: '#eab308',
      icon: '⚡'
    }
  };

  // ── Web Audio Synthesizer (Micro Sound FX) ──────────────────────────
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.muted = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (!this.muted && !this.ctx) this.init();
      return this.muted;
    }

    playPip(freq = 600, duration = 0.08) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playBurst() {
      if (this.muted || !this.ctx) return;
      try {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            this.playPip(420 + i * 140, 0.12);
          }, i * 35);
        }
      } catch (e) {}
    }
  }

  const sfx = new SoundFX();

  // ── High-Speed Particle Flow Engine ─────────────────────────────────
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.speedMultiplier = 1;
      this.activeFilter = 'all';
      this.cachedPathElements = [];

      this.initPaths();
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    initPaths() {
      const svgNS = 'http://www.w3.org/2000/svg';
      const tempSvg = document.createElementNS(svgNS, 'svg');
      tempSvg.setAttribute('viewBox', '0 0 1000 500');
      tempSvg.style.position = 'absolute';
      tempSvg.style.width = '0';
      tempSvg.style.height = '0';
      tempSvg.style.visibility = 'hidden';
      document.body.appendChild(tempSvg);

      this.cachedPathElements = CONDUIT_PATHS.map(item => {
        const pathEl = document.createElementNS(svgNS, 'path');
        pathEl.setAttribute('d', item.path);
        tempSvg.appendChild(pathEl);
        return {
          ...item,
          pathElement: pathEl,
          length: pathEl.getTotalLength()
        };
      });
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
    }

    spawnParticle(forcedPath = null) {
      const pathObj = forcedPath || this.cachedPathElements[Math.floor(Math.random() * this.cachedPathElements.length)];
      if (this.activeFilter !== 'all' && pathObj.channel !== this.activeFilter) return;

      this.particles.push({
        pathObj: pathObj,
        progress: 0,
        speed: (0.0035 + Math.random() * 0.003) * this.speedMultiplier,
        size: 3.2 + Math.random() * 2.2,
        alpha: 0.95,
        trail: []
      });
    }

    burst(count = 55) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.spawnParticle();
        }, Math.random() * 450);
      }
      sfx.playBurst();
    }

    updateAndRender() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const scaleX = this.width / 1000;
      const scaleY = this.height / 500;

      // Continuous ambient packets
      if (Math.random() < 0.38 * this.speedMultiplier) {
        this.spawnParticle();
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          this.particles.splice(i, 1);
          continue;
        }

        const len = p.pathObj.length;
        const currentDist = p.progress * len;
        const pt = p.pathObj.pathElement.getPointAtLength(currentDist);

        const screenX = pt.x * scaleX;
        const screenY = pt.y * scaleY;

        p.trail.push({ x: screenX, y: screenY });
        if (p.trail.length > 9) p.trail.shift();

        // 1. Glowing Neon Trail
        this.ctx.save();
        if (p.trail.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            this.ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          this.ctx.strokeStyle = p.pathObj.color;
          this.ctx.lineWidth = p.size * 0.9;
          this.ctx.lineCap = 'round';
          this.ctx.globalAlpha = 0.6;
          this.ctx.stroke();
        }

        // 2. High-Intensity Glowing Head Capsule
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = p.pathObj.color;
        this.ctx.shadowBlur = 14;
        this.ctx.globalAlpha = 1.0;
        this.ctx.fill();
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.updateAndRender());
    }
  }

  // ── DOM Initialization ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('hub-visual-stage');
    const canvas = document.getElementById('hub-particles-canvas');
    const popover = document.getElementById('node-telemetry-popover');
    const popoverClose = document.getElementById('popover-close-btn');

    if (!stage || !canvas) return;

    const engine = new ParticleEngine(canvas);
    engine.updateAndRender();

    // ── 3D Isometric Mouse Tilt & Parallax Physics ─────────────────────
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotateY = x * 8;   // 8 deg max yaw
      targetRotateX = -y * 6;  // 6 deg max pitch
    });

    stage.addEventListener('mouseleave', () => {
      targetRotateX = 0;
      targetRotateY = 0;
    });

    function render3DSpring() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;
      stage.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
      requestAnimationFrame(render3DSpring);
    }
    render3DSpring();

    // ── Interactive Terminal Node Clicks / Hover ──────────────────────
    const pins = document.querySelectorAll('.interactive-node-pin');

    pins.forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeKey = pin.getAttribute('data-node');
        const data = NODE_DATA[nodeKey];
        if (!data) return;

        pins.forEach(p => p.classList.remove('active'));
        pin.classList.add('active');

        // Update Popover
        document.getElementById('pop-title').textContent = data.title;
        document.getElementById('pop-channel').textContent = data.channel;
        document.getElementById('pop-rate').textContent = data.rate;
        document.getElementById('pop-latency').textContent = data.latency;
        document.getElementById('pop-success').textContent = data.success;
        document.getElementById('pop-sessions').textContent = data.activeSessions;
        document.getElementById('pop-icon').textContent = data.icon;
        document.getElementById('pop-icon').style.background = data.color + '22';
        document.getElementById('pop-icon').style.color = data.color;

        popover.classList.remove('hidden');
        sfx.playPip(720, 0.07);

        // Spawn rapid packets on this specific channel
        const matchedPath = engine.cachedPathElements.find(p => p.channel === data.channel.toLowerCase());
        for (let i = 0; i < 6; i++) {
          setTimeout(() => engine.spawnParticle(matchedPath), i * 60);
        }
      });
    });

    if (popoverClose) {
      popoverClose.addEventListener('click', () => {
        popover.classList.add('hidden');
        pins.forEach(p => p.classList.remove('active'));
      });
    }

    // ── Control Bar Buttons ───────────────────────────────────────────
    const burstBtn = document.getElementById('btn-burst-traffic');
    if (burstBtn) {
      burstBtn.addEventListener('click', () => {
        burstBtn.classList.add('burst-active');
        engine.burst(65);
        setTimeout(() => burstBtn.classList.remove('burst-active'), 1200);
      });
    }

    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sfx.toggleMute();
        soundBtn.innerHTML = isMuted
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Sound: Off`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Sound: On`;
        if (!isMuted) sfx.playPip(880, 0.1);
      });
    }

    // ── Channel Filter Switcher ───────────────────────────────────────
    const filterBtns = document.querySelectorAll('.channel-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        engine.activeFilter = filter;
        sfx.playPip(500, 0.05);
      });
    });

    // ── Realtime Counters Generator ───────────────────────────────────
    const tickerRate = document.getElementById('hero-stat-rate');
    let baseRate = 328400;
    setInterval(() => {
      const variation = Math.floor((Math.random() - 0.48) * 1200);
      baseRate += variation;
      if (tickerRate) tickerRate.textContent = baseRate.toLocaleString() + ' /s';
    }, 1500);

    // ── Theme Toggle Support ──────────────────────────────────────────
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = curTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('messageyard-theme', newTheme);
      });
    }
  });
})();
