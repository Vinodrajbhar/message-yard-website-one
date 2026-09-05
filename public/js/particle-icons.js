/**
 * MessageYard Card Background Interactive Particle Engine
 * Based on Bruno Imbrizi's Interactive Particles Simulation
 * Renders large ambient icon watermark particle fields in the background of each card,
 * dispersing into interactive particle clouds on hover with Hooke's Law spring physics.
 */

class CardBackgroundParticle {
  constructor(card) {
    this.card = card;
    this.svg = card.querySelector('.particle-source-svg') || card.querySelector('svg');
    if (!this.svg) return;

    // Create background canvas for the card and insert behind content
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'card-particle-bg-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.card.insertBefore(this.canvas, this.card.firstChild);

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 0;
    this.height = 0;
    this.particles = [];

    // Interaction Physics (Soothing, Silky Fluid Dynamics)
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.isHovered = false;
    this.mouseRadius = 75;
    this.mousePower = 3.2;
    this.spring = 0.045;
    this.friction = 0.885;
    this.settled = false;
    this.animId = null;
    this.cachedRestCanvas = null;
    this.isSectionVisible = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.createRestCache();
      this.drawRestState();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const cardObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          this.isSectionVisible = e.isIntersecting;
        });
      }, { rootMargin: '100px' });
      cardObs.observe(this.card);
    } else {
      this.isSectionVisible = true;
    }

    this.sampleParticles();
    this.bindEvents();
  }

  resize() {
    const rect = this.card.getBoundingClientRect();
    this.width = rect.width || 380;
    this.height = rect.height || 260;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  sampleParticles() {
    const sampleSize = 160;
    const offscreen = document.createElement('canvas');
    offscreen.width = sampleSize;
    offscreen.height = sampleSize;
    const offCtx = offscreen.getContext('2d');

    const svgString = new XMLSerializer().serializeToString(this.svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      offCtx.clearRect(0, 0, sampleSize, sampleSize);
      offCtx.drawImage(img, 12, 12, sampleSize - 24, sampleSize - 24);
      URL.revokeObjectURL(blobURL);

      const imgData = offCtx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imgData.data;
      this.particles = [];

      // Position the background watermark icon towards the bottom-right/center of the card
      const offsetX = this.width - sampleSize - 20;
      const offsetY = this.height - sampleSize - 10;

      const step = 3.5; // Fine micro-stardust resolution
      for (let y = 0; y < sampleSize; y += step) {
        for (let x = 0; x < sampleSize; x += step) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          const idx = (py * sampleSize + px) * 4;
          const alpha = data[idx + 3];

          if (alpha > 40) {
            const posX = offsetX + x;
            const posY = offsetY + y;
            const normX = x / sampleSize;
            const normY = y / sampleSize;

            let color = '#38bdf8';
            if (normX < 0.3) color = '#38bdf8';
            else if (normX < 0.65) color = '#60a5fa';
            else if (normY > 0.5) color = '#c084fc';
            else color = '#818cf8';

            this.particles.push({
              originX: posX,
              originY: posY,
              x: posX,
              y: posY,
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.2,
              size: Math.random() * 0.35 + 0.85, // Ultra-fine micro particles
              color: color,
              restAlpha: 0.14,
              activeAlpha: 0.68,
              currentAlpha: 0.14,
              noiseOffset: Math.random() * 100
            });
          }
        }
      }

      this.createRestCache();
      this.drawRestState();
    };

    img.src = blobURL;
  }

  createRestCache() {
    if (!this.particles.length) return;
    this.cachedRestCanvas = document.createElement('canvas');
    this.cachedRestCanvas.width = this.width * this.dpr;
    this.cachedRestCanvas.height = this.height * this.dpr;
    const cCtx = this.cachedRestCanvas.getContext('2d');
    cCtx.scale(this.dpr, this.dpr);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = p.restAlpha;
      cCtx.beginPath();
      cCtx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
      cCtx.fill();
    }
  }

  drawRestState() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.cachedRestCanvas) {
      this.ctx.drawImage(this.cachedRestCanvas, 0, 0, this.width, this.height);
    }
  }

  bindEvents() {
    this.card.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.wake();
      // Gentle, soothing expansion wave
      this.particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.8;
        p.vx += Math.cos(angle) * speed;
        p.vy += Math.sin(angle) * speed;
      });
    });

    this.card.addEventListener('mousemove', (e) => {
      const rect = this.card.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.wake();
    });

    this.card.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.mouseX = -9999;
      this.mouseY = -9999;
      this.wake();
    });

    // Touch support for mobile devices
    this.card.addEventListener('touchstart', (e) => {
      this.isHovered = true;
      const touch = e.touches[0];
      const rect = this.card.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      this.wake();
    }, { passive: true });

    this.card.addEventListener('touchend', () => {
      this.isHovered = false;
      this.mouseX = -9999;
      this.mouseY = -9999;
      this.wake();
    }, { passive: true });
  }

  wake() {
    this.settled = false;
    if (!this.isSectionVisible) return;
    if (!this.animId) {
      this.render();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = performance.now() * 0.002;
    let maxVelocity = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 1. Interactive Cursor Repulsion (Elastic Spring Splash)
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouseRadius && dist > 0) {
        const force = Math.pow(1 - dist / this.mouseRadius, 1.5) * this.mousePower;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force;
        p.vy -= Math.sin(angle) * force;
      }

      // 2. Soothing Ambient Levitation
      if (this.isHovered) {
        p.vx += Math.sin(time + p.noiseOffset) * 0.12;
        p.vy += Math.cos(time + p.noiseOffset) * 0.12;
      }

      // 3. Spring Return Force (Hooke's Law)
      const homeX = p.originX - p.x;
      const homeY = p.originY - p.y;
      p.vx += homeX * this.spring;
      p.vy += homeY * this.spring;

      // 4. Damping / Friction
      p.vx *= this.friction;
      p.vy *= this.friction;

      // 5. Update Position
      p.x += p.vx;
      p.y += p.vy;

      const currentVel = Math.abs(p.vx) + Math.abs(p.vy);
      if (currentVel > maxVelocity) {
        maxVelocity = currentVel;
      }

      // 6. Smooth Alpha Transition
      const targetAlpha = this.isHovered ? p.activeAlpha : p.restAlpha;
      p.currentAlpha += (targetAlpha - p.currentAlpha) * 0.08;

      // 7. Draw Ultra-Fine Particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.currentAlpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;

    // Sleep when settled and not hovered to conserve battery/CPU
    if (!this.isHovered && maxVelocity < 0.025) {
      this.settled = true;
      this.animId = null;
      this.drawRestState();
      return;
    }

    this.animId = requestAnimationFrame(() => this.render());
  }
}

/**
 * Initialize Background Particle Watermarks on all Channel Cards
 */
function initCardBackgroundParticles() {
  const cards = document.querySelectorAll('section.link-grid .channel-box');
  cards.forEach(card => {
    new CardBackgroundParticle(card);
  });
}

/**
 * Cosmic Constellation Interactive Particle Engine for section.sock
 */
class CosmicSockParticles {
  constructor(section) {
    this.section = section;
    this.canvas = section.querySelector('.sock-particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.particles = [];
    this.numParticles = 85;
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.maxConnectDist = 120;
    this.mouseRadius = 150;

    this.isVisible = false;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    this.createParticles();
    this.bindEvents();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animId) {
            this.animate();
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(this.section);
    } else {
      this.isVisible = true;
      this.animate();
    }
  }

  resize() {
    this.width = this.section.offsetWidth || window.innerWidth;
    this.height = this.section.offsetHeight || window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  createParticles() {
    this.particles = [];
    const colors = ['#38bdf8', '#60a5fa', '#818cf8', '#c084fc'];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.45 + 0.35,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    this.section.addEventListener('mousemove', (e) => {
      const rect = this.section.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.section.addEventListener('mouseleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    });

    this.section.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = this.section.getBoundingClientRect();
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
    }, { passive: true });

    this.section.addEventListener('touchend', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    }, { passive: true });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = performance.now() * 0.002;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mouse Gravitational Interaction
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouseRadius && dist > 0) {
        const force = (1 - dist / this.mouseRadius) * 0.8;
        p.vx += (dx / dist) * force * 0.12;
        p.vy += (dy / dist) * force * 0.12;
      }

      // Natural speed damping & update
      p.vx *= 0.988;
      p.vy *= 0.988;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around bounds
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Draw particle dot with gentle twinkle
      const alpha = p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.15;
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0.1, Math.min(alpha, 1));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw Constellation Lines between nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const pDx = p.x - p2.x;
        const pDy = p.y - p2.y;
        const pDist = Math.sqrt(pDx * pDx + pDy * pDy);

        if (pDist < this.maxConnectDist) {
          const lineAlpha = (1 - pDist / this.maxConnectDist) * 0.2;
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.globalAlpha = lineAlpha;
          this.ctx.lineWidth = 0.75;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Draw Mouse Connection Lines
      if (dist < this.mouseRadius) {
        const mouseLineAlpha = (1 - dist / this.mouseRadius) * 0.35;
        this.ctx.strokeStyle = '#60a5fa';
        this.ctx.globalAlpha = mouseLineAlpha;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouseX, this.mouseY);
        this.ctx.stroke();
      }
    }

    this.ctx.globalAlpha = 1;
    if (!this.isVisible) {
      this.animId = null;
      return;
    }
    this.animId = requestAnimationFrame(() => this.animate());
  }
}

/**
 * Initialize Cosmic Particles on section.sock
 */
function initSockParticles() {
  const sockSec = document.querySelector('section.sock#sock');
  if (sockSec) {
    new CosmicSockParticles(sockSec);
  }
}

/**
 * Luminous Aurora Wave Mesh Ribbon at the bottom of Hero Section
 * Smooth harmonic flowing spline ribbons with Electric Blue, Cyan & Violet gradients.
 */
class HeroBottomMesh {
  constructor(canvas) {
    this.canvas = canvas;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.mouseX = 0;
    this.targetMouseX = 0;
    this.isVisible = false;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      const winW = window.innerWidth;
      this.targetMouseX = (e.clientX / winW - 0.5) * 2;
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animId) {
            this.animate();
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(this.canvas);
    } else {
      this.isVisible = true;
      this.animate();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = this.canvas.offsetHeight || 140;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.03;

    const time = performance.now() * 0.0012;
    const baseY = this.height * 0.65;

    // Layer 1: Deep Violet-Blue Ambient Wave Ribbon
    this.drawWaveRibbon({
      time: time * 0.8,
      speed: 0.004,
      freq: 0.003,
      amp: 22,
      baseY: baseY + 10,
      mouseOffset: this.mouseX * 12,
      gradColors: ['rgba(56, 189, 248, 0.12)', 'rgba(37, 99, 235, 0.18)', 'rgba(124, 58, 237, 0.14)'],
      strokeColor: 'rgba(56, 189, 248, 0.35)',
      lineWidth: 1.2
    });

    // Layer 2: Electric Cyan-Azure Harmonic Wave Ribbon
    this.drawWaveRibbon({
      time: time * 1.1 + 2,
      speed: 0.006,
      freq: 0.0045,
      amp: 18,
      baseY: baseY - 6,
      mouseOffset: this.mouseX * -10,
      gradColors: ['rgba(124, 58, 237, 0.1)', 'rgba(56, 189, 248, 0.22)', 'rgba(37, 99, 235, 0.12)'],
      strokeColor: 'rgba(37, 99, 235, 0.45)',
      lineWidth: 1.4
    });

    // Layer 3: Foreground Delicate Luminous Crest
    this.drawWaveRibbon({
      time: time * 1.3 + 4,
      speed: 0.008,
      freq: 0.006,
      amp: 14,
      baseY: baseY + 4,
      mouseOffset: this.mouseX * 8,
      gradColors: ['rgba(56, 189, 248, 0.06)', 'rgba(147, 197, 253, 0.15)', 'rgba(56, 189, 248, 0.04)'],
      strokeColor: 'rgba(56, 189, 248, 0.55)',
      lineWidth: 1.6
    });

    // Ambient floating stardust nodes along the wave horizon
    const nodeCount = 12;
    for (let i = 0; i <= nodeCount; i++) {
      const x = (i / nodeCount) * this.width;
      const waveY = baseY + Math.sin(time + x * 0.005) * 16 + Math.cos(time * 0.8 + x * 0.003) * 10;
      const alpha = 0.3 + Math.sin(time * 2 + i) * 0.25;

      this.ctx.fillStyle = '#38bdf8';
      this.ctx.globalAlpha = Math.max(0.1, alpha);
      this.ctx.beginPath();
      this.ctx.arc(x, waveY, 2.2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    if (!this.isVisible) {
      this.animId = null;
      return;
    }
    this.animId = requestAnimationFrame(() => this.animate());
  }

  drawWaveRibbon(opt) {
    const step = 8;
    const points = [];

    for (let x = 0; x <= this.width + step; x += step) {
      const y = opt.baseY +
        Math.sin(opt.time + x * opt.freq) * opt.amp +
        Math.cos(opt.time * 0.7 + x * opt.freq * 0.8) * (opt.amp * 0.6) +
        opt.mouseOffset * Math.sin(x / this.width * Math.PI);
      points.push({ x, y });
    }

    // 1. Fill smooth gradient underneath wave
    const fillGrad = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    fillGrad.addColorStop(0, opt.gradColors[0]);
    fillGrad.addColorStop(0.5, opt.gradColors[1]);
    fillGrad.addColorStop(1, opt.gradColors[2]);

    this.ctx.fillStyle = fillGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    for (let i = 0; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.lineTo(this.width, this.height);
    this.ctx.closePath();
    this.ctx.fill();

    // 2. Stroke glowing top crest curve
    this.ctx.strokeStyle = opt.strokeColor;
    this.ctx.lineWidth = opt.lineWidth;
    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) this.ctx.moveTo(points[i].x, points[i].y);
      else this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.stroke();
  }
}

/**
 * Initialize Hero Bottom Mesh
 */
function initHeroBottomMesh() {
  const canvas = document.getElementById('hero-mesh');
  if (canvas) {
    new HeroBottomMesh(canvas);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroBottomMesh();
  initCardBackgroundParticles();
  initSockParticles();
});
