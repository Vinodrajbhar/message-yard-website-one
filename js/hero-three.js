/**
 * ==========================================================================
 * MESSAGEYARD — THREE.JS 3D ISOMETRIC INTERACTIVE ENGINE
 * Combines the high-resolution Octane 3D render with a real-time WebGL particle
 * physics engine, dynamic neon light tracers, 3D raycasting & live telemetry.
 * ==========================================================================
 */

(function () {
  'use strict';

  // ── Global State ────────────────────────────────────────────────────
  const state = {
    theme: 'light',
    speedMultiplier: 1,
    activeFilter: 'all',
    soundEnabled: false,
    selectedNode: null
  };

  // ── Conduit Stream Coordinates in Normalized 3D Space ───────────────
  // Mapped directly to the high-detail visual conduits
  const CONDUIT_STREAMS = [
    {
      id: 'green',
      name: 'Flow Logic & Automated Journeys',
      channel: 'logic',
      color: 0x10b981,
      colorHex: '#10b981',
      points: [
        new THREE.Vector3(1.4, 0.2, -3.2),
        new THREE.Vector3(-1.0, 0.2, -4.5),
        new THREE.Vector3(-4.5, 0.2, -6.5),
        new THREE.Vector3(-7.2, 0.2, -6.0),
        new THREE.Vector3(-8.0, 0.2, -5.2)
      ],
      terminalPos: new THREE.Vector3(-8.0, 0.3, -5.2),
      hitArea: { x: 0.128, y: 0.39, radius: 0.045 },
      rate: '14,200/s',
      latency: '8ms',
      delivery: '99.99%',
      activeSessions: '124,500',
      icon: '⚡'
    },
    {
      id: 'orange',
      name: 'Global Aggregator Hub',
      channel: 'aggregate',
      color: 0xf97316,
      colorHex: '#f97316',
      points: [
        new THREE.Vector3(1.4, 0.15, -3.0),
        new THREE.Vector3(-2.0, 0.15, -1.5),
        new THREE.Vector3(-5.5, 0.15, 0.0),
        new THREE.Vector3(-9.2, 0.15, 1.2),
        new THREE.Vector3(-11.5, 0.15, 2.4)
      ],
      terminalPos: new THREE.Vector3(-11.5, 0.3, 2.4),
      hitArea: { x: 0.128, y: 0.39, radius: 0.045 },
      rate: '18,500/s',
      latency: '15ms',
      delivery: '99.97%',
      activeSessions: '84,120',
      icon: '📦'
    },
    {
      id: 'blue',
      name: 'WhatsApp Business Cloud Gateway',
      channel: 'whatsapp',
      color: 0x0ea5e9,
      colorHex: '#0ea5e9',
      points: [
        new THREE.Vector3(1.5, 0.15, -2.8),
        new THREE.Vector3(-1.5, 0.15, -0.8),
        new THREE.Vector3(-4.5, 0.15, 1.8),
        new THREE.Vector3(-7.2, 0.15, 3.8),
        new THREE.Vector3(-8.8, 0.15, 5.0)
      ],
      terminalPos: new THREE.Vector3(-8.8, 0.3, 5.0),
      hitArea: { x: 0.216, y: 0.41, radius: 0.045 },
      rate: '45,800/s',
      latency: '12ms',
      delivery: '99.99%',
      activeSessions: '342,900',
      icon: '💬'
    },
    {
      id: 'purple',
      name: 'Transactional SMS & RCS Rail',
      channel: 'sms',
      color: 0xa855f7,
      colorHex: '#a855f7',
      points: [
        new THREE.Vector3(1.6, 0.15, -2.6),
        new THREE.Vector3(-0.5, 0.15, -0.2),
        new THREE.Vector3(-2.2, 0.15, 2.5),
        new THREE.Vector3(-4.2, 0.15, 5.8),
        new THREE.Vector3(-5.5, 0.15, 7.5)
      ],
      terminalPos: new THREE.Vector3(-5.5, 0.3, 7.5),
      hitArea: { x: 0.314, y: 0.49, radius: 0.045 },
      rate: '32,100/s',
      latency: '16ms',
      delivery: '99.95%',
      activeSessions: '198,400',
      icon: '📱'
    },
    {
      id: 'coral',
      name: 'High-Volume Email Engine',
      channel: 'email',
      color: 0xf43f5e,
      colorHex: '#f43f5e',
      points: [
        new THREE.Vector3(1.7, 0.15, -2.4),
        new THREE.Vector3(0.5, 0.15, 0.5),
        new THREE.Vector3(-0.2, 0.15, 3.8),
        new THREE.Vector3(-1.0, 0.15, 7.5),
        new THREE.Vector3(-1.5, 0.15, 9.5)
      ],
      terminalPos: new THREE.Vector3(-1.5, 0.3, 9.5),
      hitArea: { x: 0.415, y: 0.536, radius: 0.045 },
      rate: '88,400/s',
      latency: '22ms',
      delivery: '99.98%',
      activeSessions: '512,000',
      icon: '✉️'
    },
    {
      id: 'gold1',
      name: 'Mobile Push Notifications',
      channel: 'push',
      color: 0xeab308,
      colorHex: '#eab308',
      points: [
        new THREE.Vector3(1.8, 0.15, -2.2),
        new THREE.Vector3(1.8, 0.15, 1.2),
        new THREE.Vector3(2.5, 0.15, 4.8),
        new THREE.Vector3(4.0, 0.15, 8.5),
        new THREE.Vector3(5.0, 0.15, 10.5)
      ],
      terminalPos: new THREE.Vector3(5.0, 0.3, 10.5),
      hitArea: { x: 0.598, y: 0.575, radius: 0.045 },
      rate: '115,000/s',
      latency: '5ms',
      delivery: '99.99%',
      activeSessions: '890,250',
      icon: '🔔'
    },
    {
      id: 'gold2',
      name: 'Instant Webhook Rail',
      channel: 'push',
      color: 0xeab308,
      colorHex: '#eab308',
      points: [
        new THREE.Vector3(2.5, 0.15, 4.8),
        new THREE.Vector3(5.2, 0.15, 6.5),
        new THREE.Vector3(8.0, 0.15, 8.2),
        new THREE.Vector3(9.5, 0.15, 9.2)
      ],
      terminalPos: new THREE.Vector3(9.5, 0.3, 9.2),
      hitArea: { x: 0.724, y: 0.544, radius: 0.045 },
      rate: '94,000/s',
      latency: '6ms',
      delivery: '99.99%',
      activeSessions: '640,100',
      icon: '⚡'
    }
  ];

  // ── Web Audio Synthesizer ───────────────────────────────────────────
  class SoundEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    }

    playTone(freq = 600, duration = 0.08) {
      if (!state.soundEnabled || !this.ctx) return;
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
      if (!state.soundEnabled || !this.ctx) return;
      for (let i = 0; i < 6; i++) {
        setTimeout(() => this.playTone(380 + i * 120, 0.1), i * 35);
      }
    }
  }

  const sound = new SoundEngine();

  // ── Main Three.js Scene Engine ──────────────────────────────────────
  class HybridThreeHub3D {
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth;
      this.height = container.clientHeight || 580;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.conduits = [];
      this.packets = [];
      this.interactiveNodes = [];
      this.targetCameraRot = { x: 0, y: 0 };
      this.currentCameraRot = { x: 0, y: 0 };

      this.init();
    }

    init() {
      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(state.theme === 'light' ? 0xf6f8fc : 0x090e1a);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
      this.camera.position.set(0, 0, 18);
      this.camera.lookAt(0, 0, 0);

      // 3. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(this.renderer.domElement);

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      this.scene.add(ambientLight);

      // 5. Load High-Detail Backdrop Stage
      this.createPhotorealStagePlane();

      // 6. Build 3D Particle Conduits & Hitboxes
      this.createConduitStreams();
      this.createInteractiveTerminals();

      // 7. Event Listeners
      window.addEventListener('resize', () => this.onResize());
      this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.container.addEventListener('click', (e) => this.onClick(e));

      // 8. Start Loop
      this.animate();
    }

    // ── High-Resolution Octane 3D Backdrop Mesh ───────────────────────
    createPhotorealStagePlane() {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('assets/images/hero-hub-exact.jpg', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // Plane aspect ratio matches 2:1 (1024x512)
        const planeGeo = new THREE.PlaneGeometry(24, 12);
        const planeMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: false
        });
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.position.set(0, 0, 0);
        this.scene.add(planeMesh);
        this.stagePlane = planeMesh;
      });
    }

    // ── Glowing 3D Conduit Particle Paths ─────────────────────────────
    createConduitStreams() {
      CONDUIT_STREAMS.forEach(stream => {
        const curve = new THREE.CatmullRomCurve3(stream.points);

        // Subtle glowing neon trail line
        const points = curve.getPoints(60);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: stream.color,
          transparent: true,
          opacity: 0.65,
          linewidth: 2
        });
        const line = new THREE.Line(geo, mat);
        line.position.z = 0.05; // Slightly in front of plane
        this.scene.add(line);

        this.conduits.push({
          stream: stream,
          curve: curve,
          line: line
        });
      });
    }

    // ── 3D Interactive Terminal Hotspots ──────────────────────────────
    createInteractiveTerminals() {
      CONDUIT_STREAMS.forEach(stream => {
        // Invisible 3D mesh hitbox for precise Three.js Raycaster clicking
        const hitGeo = new THREE.SphereGeometry(0.85, 12, 12);
        const hitMat = new THREE.MeshBasicMaterial({
          color: stream.color,
          transparent: true,
          opacity: 0.0,
          depthWrite: false
        });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.position.copy(stream.terminalPos);
        hitMesh.position.z = 0.2;
        hitMesh.userData = { stream: stream };
        this.scene.add(hitMesh);
        this.interactiveNodes.push(hitMesh);

        // Animated Glowing Halo Ring
        const ringGeo = new THREE.RingGeometry(0.5, 0.7, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: stream.color,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(stream.terminalPos);
        ring.position.z = 0.08;
        this.scene.add(ring);
        hitMesh.userData.ring = ring;
      });
    }

    // ── Data Packet Spawner ───────────────────────────────────────────
    spawnPacket(forcedStream = null) {
      const streamObj = forcedStream || CONDUIT_STREAMS[Math.floor(Math.random() * CONDUIT_STREAMS.length)];
      if (state.activeFilter !== 'all' && streamObj.type !== state.activeFilter) return;

      const conduit = this.conduits.find(c => c.stream.id === streamObj.id);
      if (!conduit) return;

      // Glowing Packet Sphere
      const packetGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(packetGeo, packetMat);

      // Glow Shell
      const glowGeo = new THREE.SphereGeometry(0.32, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({
        color: streamObj.color,
        transparent: true,
        opacity: 0.8
      });
      mesh.add(new THREE.Mesh(glowGeo, glowMat));

      const startPt = conduit.curve.getPointAt(0);
      mesh.position.copy(startPt);
      mesh.position.z = 0.12;
      this.scene.add(mesh);

      this.packets.push({
        mesh: mesh,
        conduit: conduit,
        progress: 0,
        speed: (0.005 + Math.random() * 0.004) * state.speedMultiplier
      });
    }

    triggerBurst(count = 55) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.spawnPacket();
        }, Math.random() * 450);
      }
      sound.playBurst();
    }

    // ── Mouse & Raycasting ────────────────────────────────────────────
    onMouseMove(e) {
      const rect = this.container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / this.width;
      const ny = (e.clientY - rect.top) / this.height;

      this.mouse.x = nx * 2 - 1;
      this.mouse.y = -(ny * 2 - 1);

      // 3D Parallax Tilt
      this.targetCameraRot.y = (nx - 0.5) * 0.08;
      this.targetCameraRot.x = -(ny - 0.5) * 0.06;

      // Raycasting
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveNodes);

      if (intersects.length > 0) {
        this.container.style.cursor = 'pointer';
        const hit = intersects[0].object;
        if (hit.userData.ring) {
          hit.userData.ring.scale.set(1.4, 1.4, 1.4);
          hit.userData.ring.material.opacity = 0.9;
        }
      } else {
        this.container.style.cursor = 'default';
        this.interactiveNodes.forEach(node => {
          if (node.userData.ring && state.selectedNode !== node.userData.stream.id) {
            node.userData.ring.scale.set(1, 1, 1);
            node.userData.ring.material.opacity = 0.5;
          }
        });
      }
    }

    onClick(e) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveNodes);

      if (intersects.length > 0) {
        const stream = intersects[0].object.userData.stream;
        this.selectNode(stream);
        sound.playTone(720, 0.08);
      }
    }

    selectNode(stream) {
      state.selectedNode = stream.id;

      for (let i = 0; i < 8; i++) {
        setTimeout(() => this.spawnPacket(stream), i * 60);
      }

      // Update Popover UI
      const popover = document.getElementById('node-telemetry-popover');
      if (popover) {
        document.getElementById('pop-title').textContent = stream.name;
        document.getElementById('pop-channel').textContent = stream.type.toUpperCase() + ' Carrier Gateway';
        document.getElementById('pop-rate').textContent = stream.rate;
        document.getElementById('pop-latency').textContent = stream.latency;
        document.getElementById('pop-success').textContent = stream.delivery;
        document.getElementById('pop-sessions').textContent = stream.activeSessions;
        document.getElementById('pop-icon').textContent = stream.icon;
        document.getElementById('pop-icon').style.background = stream.colorHex + '22';
        document.getElementById('pop-icon').style.color = stream.colorHex;
        popover.classList.remove('hidden');
      }
    }

    onResize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight || 580;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }

    // ── Main Render Loop ──────────────────────────────────────────────
    animate() {
      requestAnimationFrame(() => this.animate());

      const time = performance.now() * 0.001;

      // 1. Smooth 3D Camera Parallax
      this.currentCameraRot.x += (this.targetCameraRot.x - this.currentCameraRot.x) * 0.08;
      this.currentCameraRot.y += (this.targetCameraRot.y - this.currentCameraRot.y) * 0.08;
      this.camera.rotation.x = this.currentCameraRot.x;
      this.camera.rotation.y = this.currentCameraRot.y;

      // 2. Ambient Continuous Packet Generation
      if (Math.random() < 0.32 * state.speedMultiplier) {
        this.spawnPacket();
      }

      // 3. Move Packets along Conduits
      for (let i = this.packets.length - 1; i >= 0; i--) {
        const p = this.packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          this.packets.splice(i, 1);
          continue;
        }

        const point = p.conduit.curve.getPointAt(p.progress);
        p.mesh.position.set(point.x, point.y, 0.12);
      }

      // 4. Pulsate Interactive Terminal Rings
      this.interactiveNodes.forEach((node, idx) => {
        if (node.userData.ring) {
          const pulse = 1.0 + Math.sin(time * 3 + idx) * 0.15;
          node.userData.ring.scale.set(pulse, pulse, pulse);
        }
      });

      // 5. Render Scene
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ── DOM Initialization ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-hub-container');
    if (!container) return;

    const visualizer = new HybridThreeHub3D(container);

    // High-Speed Burst Button
    const burstBtn = document.getElementById('btn-burst-traffic');
    if (burstBtn) {
      burstBtn.addEventListener('click', () => {
        burstBtn.classList.add('burst-active');
        visualizer.triggerBurst(60);
        setTimeout(() => burstBtn.classList.remove('burst-active'), 1200);
      });
    }

    // Reset Camera
    const resetCamBtn = document.getElementById('btn-reset-cam');
    if (resetCamBtn) {
      resetCamBtn.addEventListener('click', () => {
        visualizer.targetCameraRot.x = 0;
        visualizer.targetCameraRot.y = 0;
        sound.playTone(550, 0.05);
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) sound.init();
        soundBtn.innerHTML = state.soundEnabled
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Sound: On`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Sound: Off`;
        if (state.soundEnabled) sound.playTone(880, 0.1);
      });
    }

    // Channel Filters
    const filterBtns = document.querySelectorAll('.channel-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');
        sound.playTone(500, 0.05);
      });
    });

    // Close Popover
    const popoverClose = document.getElementById('popover-close-btn');
    if (popoverClose) {
      popoverClose.addEventListener('click', () => {
        const popover = document.getElementById('node-telemetry-popover');
        if (popover) popover.classList.add('hidden');
        state.selectedNode = null;
      });
    }

    // Realtime Throughput Randomizer
    const tickerRate = document.getElementById('hero-stat-rate');
    let baseRate = 328400;
    setInterval(() => {
      const variation = Math.floor((Math.random() - 0.48) * 1400);
      baseRate += variation;
      if (tickerRate) tickerRate.textContent = baseRate.toLocaleString() + ' /s';
    }, 1200);

    // Theme Switcher
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = curTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('messageyard-theme', newTheme);
        state.theme = newTheme;
        visualizer.scene.background = new THREE.Color(newTheme === 'light' ? 0xf6f8fc : 0x090e1a);
      });
    }
  });
})();
