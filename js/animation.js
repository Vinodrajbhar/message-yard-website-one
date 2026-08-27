/**
 * ==========================================================================
 * MESSAGEYARD — OPTION 1: GLTF/GLB PIPELINE + UNREAL BLOOM + THREE.JS
 * Full 3D Production Pipeline with Post-Processing & Model Loader
 * ==========================================================================
 */

(function () {
  'use strict';

  // ── Global State ────────────────────────────────────────────────────
  const state = {
    theme: 'dark', // 'dark' | 'light'
    speedMultiplier: 1,
    activeFilter: 'all',
    soundEnabled: false,
    selectedNode: null,
    modelLoaded: false,
    bloomEnabled: true
  };

  // ── 6 Channel Rails & Spatial Coordinates ───────────────────────────
  const CHANNELS = [
    {
      id: 'green',
      name: 'Workflow Logic & Journey Engine',
      type: 'logic',
      color: 0x10b981,
      colorHex: '#10b981',
      emissive: 0x059669,
      curvePoints: [
        new THREE.Vector3(2.5, 3.8, -4.5),
        new THREE.Vector3(-2.0, 3.8, -4.5),
        new THREE.Vector3(-8.0, 3.5, -6.5),
        new THREE.Vector3(-14.0, 3.0, -8.5),
        new THREE.Vector3(-18.0, 2.5, -9.0)
      ],
      terminalPos: new THREE.Vector3(-18.0, 2.5, -9.0),
      rate: '14,200/s',
      latency: '8ms',
      delivery: '99.99%',
      activeSessions: '124,500',
      icon: '⚡'
    },
    {
      id: 'orange',
      name: 'Global Aggregator Ingress Hub',
      type: 'aggregate',
      color: 0xf97316,
      colorHex: '#f97316',
      emissive: 0xea580c,
      curvePoints: [
        new THREE.Vector3(2.0, 3.2, -4.5),
        new THREE.Vector3(-4.0, 3.0, -1.0),
        new THREE.Vector3(-10.5, 2.0, 3.0),
        new THREE.Vector3(-15.0, 1.2, 6.5),
        new THREE.Vector3(-17.0, 1.0, 8.5)
      ],
      terminalPos: new THREE.Vector3(-17.0, 1.0, 8.5),
      rate: '18,500/s',
      latency: '15ms',
      delivery: '99.97%',
      activeSessions: '84,120',
      icon: '📦'
    },
    {
      id: 'blue',
      name: 'WhatsApp Business Cloud Gateway',
      type: 'whatsapp',
      color: 0x0ea5e9,
      colorHex: '#0ea5e9',
      emissive: 0x0284c7,
      curvePoints: [
        new THREE.Vector3(1.5, 2.8, -4.5),
        new THREE.Vector3(-2.5, 2.5, 1.5),
        new THREE.Vector3(-7.0, 1.8, 7.0),
        new THREE.Vector3(-10.5, 1.2, 12.0),
        new THREE.Vector3(-12.0, 1.0, 14.5)
      ],
      terminalPos: new THREE.Vector3(-12.0, 1.0, 14.5),
      rate: '45,800/s',
      latency: '12ms',
      delivery: '99.99%',
      activeSessions: '342,900',
      icon: '💬'
    },
    {
      id: 'purple',
      name: 'Transactional SMS & RCS Rail',
      type: 'sms',
      color: 0xa855f7,
      colorHex: '#a855f7',
      emissive: 0x9333ea,
      curvePoints: [
        new THREE.Vector3(1.0, 2.5, -4.5),
        new THREE.Vector3(-1.0, 2.2, 2.5),
        new THREE.Vector3(-3.0, 1.5, 8.5),
        new THREE.Vector3(-4.8, 1.0, 15.0),
        new THREE.Vector3(-5.5, 0.9, 18.5)
      ],
      terminalPos: new THREE.Vector3(-5.5, 0.9, 18.5),
      rate: '32,100/s',
      latency: '16ms',
      delivery: '99.95%',
      activeSessions: '198,400',
      icon: '📱'
    },
    {
      id: 'coral',
      name: 'High-Volume Email Engine',
      type: 'email',
      color: 0xf43f5e,
      colorHex: '#f43f5e',
      emissive: 0xe11d48,
      curvePoints: [
        new THREE.Vector3(0.5, 2.2, -4.5),
        new THREE.Vector3(0.8, 1.8, 3.5),
        new THREE.Vector3(1.2, 1.2, 9.5),
        new THREE.Vector3(1.5, 0.9, 16.0),
        new THREE.Vector3(1.5, 0.9, 21.5)
      ],
      terminalPos: new THREE.Vector3(1.5, 0.9, 21.5),
      rate: '88,400/s',
      latency: '22ms',
      delivery: '99.98%',
      activeSessions: '512,000',
      icon: '✉️'
    },
    {
      id: 'gold1',
      name: 'Mobile Push Notifications',
      type: 'push',
      color: 0xeab308,
      colorHex: '#eab308',
      emissive: 0xca8a04,
      curvePoints: [
        new THREE.Vector3(0.0, 2.0, -4.5),
        new THREE.Vector3(2.5, 1.6, 3.5),
        new THREE.Vector3(5.5, 1.1, 9.5),
        new THREE.Vector3(7.5, 0.9, 16.0),
        new THREE.Vector3(8.5, 0.9, 22.5)
      ],
      terminalPos: new THREE.Vector3(8.5, 0.9, 22.5),
      rate: '115,000/s',
      latency: '5ms',
      delivery: '99.99%',
      activeSessions: '890,250',
      icon: '🔔'
    },
    {
      id: 'gold2',
      name: 'Instant Webhook Dispatches',
      type: 'push',
      color: 0xeab308,
      colorHex: '#eab308',
      emissive: 0xca8a04,
      curvePoints: [
        new THREE.Vector3(5.5, 1.1, 9.5),
        new THREE.Vector3(9.5, 1.0, 12.0),
        new THREE.Vector3(13.0, 0.9, 16.0),
        new THREE.Vector3(15.5, 0.9, 20.0)
      ],
      terminalPos: new THREE.Vector3(15.5, 0.9, 20.0),
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

  // ── Master Three.js Scene Engine ────────────────────────────────────
  class GLTFPipelineHub3D {
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth;
      this.height = container.clientHeight;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.composer = null;
      this.bloomPass = null;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.modelGroup = null;
      this.mixer = null;
      this.clock = new THREE.Clock();

      this.conduits = [];
      this.packets = [];
      this.interactiveCubes = [];
      this.floatingBadges = [];
      this.pointLights = [];

      this.init();
    }

    init() {
      // 1. Scene
      this.scene = new THREE.Scene();
      this.updateAtmosphere();

      // 2. Camera: Isometric Diagonal Angle
      this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 600);
      this.camera.position.set(42, 30, 46);

      // 3. WebGL Renderer with High-Precision Color & Shadow Mapping
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(this.renderer.domElement);

      // 4. Post-Processing Pipeline (Unreal Bloom)
      this.setupPostProcessing();

      // 5. Studio Environment Map Reflections
      this.setupEnvironmentLighting();

      // 6. OrbitControls
      if (window.THREE.OrbitControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(-1, 3.0, 3.5);
        this.controls.maxPolarAngle = Math.PI / 2.12;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 120;
      }

      // 7. Lighting
      this.setupLighting();

      // 8. Build Base Environment & Check for GLTF Model
      this.createIsometricFloor();
      this.createTerminalPedestals();
      this.createNeonConduits();
      this.createOverheadNetwork();
      this.loadGLTFModelOrFallback();

      // 9. Drag & Drop 3D Model Importer (instant Blender .glb testing)
      this.setupDragAndDrop();

      // 10. Event Listeners
      window.addEventListener('resize', () => this.onResize());
      this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.container.addEventListener('click', (e) => this.onClick(e));

      // 11. Start Loop
      this.animate();
    }

    updateAtmosphere() {
      if (!this.scene) return;
      if (state.theme === 'light') {
        this.scene.background = new THREE.Color(0xf1f5f9);
      } else {
        this.scene.background = new THREE.Color(0x070b16);
      }
    }

    // ── Unreal Bloom Post-Processing ──────────────────────────────────
    setupPostProcessing() {
      if (!window.THREE.EffectComposer || !window.THREE.UnrealBloomPass) return;

      const renderPass = new THREE.RenderPass(this.scene, this.camera);

      // Bloom Parameters: Luminous soft glow for neon tubes and portals
      this.bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(this.width, this.height),
        0.85,  // strength
        0.4,   // radius
        0.82   // threshold (only bright emissive elements glow)
      );

      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(renderPass);
      this.composer.addPass(this.bloomPass);
    }

    // ── Studio HDRI Environment Map ───────────────────────────────────
    setupEnvironmentLighting() {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();

      const envCanvas = document.createElement('canvas');
      envCanvas.width = 512;
      envCanvas.height = 256;
      const ctx = envCanvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#dbeafe');
      grad.addColorStop(0.7, '#f1f5f9');
      grad.addColorStop(1, '#64748b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      const envTex = new THREE.CanvasTexture(envCanvas);
      this.scene.environment = pmrem.fromEquirectangular(envTex).texture;
    }

    setupLighting() {
      // Ambient Light
      this.ambientLight = new THREE.AmbientLight(0xffffff, state.theme === 'light' ? 0.65 : 0.4);
      this.scene.add(this.ambientLight);

      // Key Directional Light (Casting Soft Shadows)
      this.keySun = new THREE.DirectionalLight(0xfffaf0, 1.8);
      this.keySun.position.set(38, 55, 32);
      this.keySun.castShadow = true;
      this.keySun.shadow.mapSize.width = 2048;
      this.keySun.shadow.mapSize.height = 2048;
      this.keySun.shadow.camera.near = 10;
      this.keySun.shadow.camera.far = 130;
      this.keySun.shadow.camera.left = -35;
      this.keySun.shadow.camera.right = 35;
      this.keySun.shadow.camera.top = 35;
      this.keySun.shadow.camera.bottom = -35;
      this.keySun.shadow.bias = -0.0003;
      this.keySun.shadow.radius = 2.0;
      this.scene.add(this.keySun);

      // Fill Sky Light
      this.fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5);
      this.fillLight.position.set(-30, 25, -20);
      this.scene.add(this.fillLight);

      // Portal Interior Light
      this.portalLight = new THREE.PointLight(0x38bdf8, 4.0, 22);
      this.portalLight.position.set(0.5, 3.5, -4.5);
      this.scene.add(this.portalLight);

      // Truck Bay Light
      this.bayLight = new THREE.PointLight(0x38bdf8, 2.2, 16);
      this.bayLight.position.set(16.5, 3.5, -4.0);
      this.scene.add(this.bayLight);
    }

    // ── GLTF / GLB Model Loader with Auto-PBR Enhancement ─────────────
    loadGLTFModelOrFallback() {
      const loader = new THREE.GLTFLoader();

      // Configure Draco decoder if available
      if (window.THREE.DRACOLoader) {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
        loader.setDRACOLoader(dracoLoader);
      }

      // Check for custom model file at assets/models/messageyard-hub.glb
      loader.load(
        'assets/models/messageyard-hub.glb',
        (gltf) => {
          this.onGLTFLoaded(gltf);
        },
        undefined,
        (error) => {
          console.info('Custom GLB model not found yet at assets/models/messageyard-hub.glb. Using high-detail procedural structure (Drag & Drop any .glb to preview!).');
          this.createProceduralMessageYardFacility();
          this.createProceduralTruck();
        }
      );
    }

    onGLTFLoaded(gltf) {
      if (this.proceduralFacility) this.scene.remove(this.proceduralFacility);
      if (this.proceduralTruck) this.scene.remove(this.proceduralTruck);

      this.modelGroup = gltf.scene;

      // Traverse meshes to configure PBR materials, shadows, and bloom emissions
      this.modelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Enhance glass and emissive materials
          if (child.material) {
            child.material.envMapIntensity = 1.2;
            if (child.material.name.toLowerCase().includes('glass') || child.material.name.toLowerCase().includes('conduit')) {
              child.material.transmission = 0.9;
              child.material.roughness = 0.05;
              child.material.transparent = true;
            }
            if (child.material.emissive && child.material.emissive.getHex() > 0) {
              child.material.emissiveIntensity = 2.0; // Trigger Unreal Bloom
            }
          }
        }
      });

      // Position model
      this.modelGroup.position.set(0, 0, -10);
      this.scene.add(this.modelGroup);
      state.modelLoaded = true;

      // Handle embedded GLTF animations if present
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.modelGroup);
        gltf.animations.forEach((clip) => {
          this.mixer.clipAction(clip).play();
        });
      }

      const statusPill = document.getElementById('engine-status-text');
      if (statusPill) statusPill.textContent = 'CUSTOM GLB MODEL ACTIVE';
    }

    // ── Drag & Drop 3D Model Importer (Blender/C4D direct test) ───────
    setupDragAndDrop() {
      window.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.container.style.border = '2px dashed #38bdf8';
      });

      window.addEventListener('dragleave', () => {
        this.container.style.border = 'none';
      });

      window.addEventListener('drop', (e) => {
        e.preventDefault();
        this.container.style.border = 'none';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
              const loader = new THREE.GLTFLoader();
              loader.parse(reader.result, '', (gltf) => {
                this.onGLTFLoaded(gltf);
                sound.playTone(880, 0.1);
              });
            };
          }
        }
      });
    }

    // ── Floor Tiles ───────────────────────────────────────────────────
    createIsometricFloor() {
      const tileSize = 6;
      const tileCount = 20;
      const halfSize = (tileCount * tileSize) / 2;

      const bedGeo = new THREE.PlaneGeometry(130, 130);
      const bedMat = new THREE.MeshStandardMaterial({
        color: state.theme === 'light' ? 0xd1d5db : 0x070b16,
        roughness: 0.5
      });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.rotation.x = -Math.PI / 2;
      bed.position.y = -0.05;
      bed.receiveShadow = true;
      this.scene.add(bed);

      const tileGeo = new THREE.BoxGeometry(tileSize - 0.2, 0.1, tileSize - 0.2);
      const tileMat = new THREE.MeshStandardMaterial({
        color: state.theme === 'light' ? 0xffffff : 0x0f172a,
        roughness: 0.18,
        metalness: 0.08
      });

      const tileGroup = new THREE.Group();
      for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
          const tile = new THREE.Mesh(tileGeo, tileMat);
          tile.position.set(
            -halfSize + i * tileSize + tileSize / 2,
            0,
            -halfSize + j * tileSize + tileSize / 2
          );
          tile.receiveShadow = true;
          tileGroup.add(tile);
        }
      }
      this.scene.add(tileGroup);

      const nodeGeo = new THREE.BoxGeometry(0.85, 0.12, 0.85);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const positions = [
        [-24, 12], [-26, -6], [-14, -18], [26, 14], [28, -8], [-6, 30]
      ];
      positions.forEach(([x, z]) => {
        const n = new THREE.Mesh(nodeGeo, nodeMat);
        n.position.set(x, 0.08, z);
        this.scene.add(n);
      });
    }

    // ── Procedural Facility (Active until custom GLB model is dropped in)
    createProceduralMessageYardFacility() {
      this.proceduralFacility = new THREE.Group();

      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.05 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.15, metalness: 0.85 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.9, opacity: 0.85, transparent: true, roughness: 0.05 });

      const podium = new THREE.Mesh(new THREE.BoxGeometry(38, 1.2, 24), whiteMat);
      podium.position.set(4, 0.6, -11);
      podium.castShadow = true;
      podium.receiveShadow = true;
      this.proceduralFacility.add(podium);

      const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(18, 10, 16), whiteMat);
      mainBuilding.position.set(0, 5.5, -12);
      mainBuilding.castShadow = true;
      mainBuilding.receiveShadow = true;
      this.proceduralFacility.add(mainBuilding);

      const arch = new THREE.Mesh(new THREE.BoxGeometry(12, 6.2, 4.5), whiteMat);
      arch.position.set(0, 3.6, -4.8);
      arch.castShadow = true;
      this.proceduralFacility.add(arch);

      const tunnelInterior = new THREE.Mesh(new THREE.BoxGeometry(9, 4.8, 4.6), new THREE.MeshBasicMaterial({ color: 0x0369a1 }));
      tunnelInterior.position.set(0, 3.3, -4.9);
      this.proceduralFacility.add(tunnelInterior);

      const neonArch = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.18, 16, 32, Math.PI), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      neonArch.position.set(0, 3.6, -2.5);
      this.proceduralFacility.add(neonArch);

      const signCanvas = document.createElement('canvas');
      signCanvas.width = 1024;
      signCanvas.height = 256;
      const sCtx = signCanvas.getContext('2d');
      sCtx.fillStyle = '#ffffff';
      sCtx.fillRect(0, 0, 1024, 256);
      sCtx.fillStyle = '#090d16';
      sCtx.font = '900 116px "Plus Jakarta Sans", sans-serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.letterSpacing = '3px';
      sCtx.fillText('MESSAGEYARD', 512, 128);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(10.2, 2.55), new THREE.MeshBasicMaterial({ map: signTex }));
      signMesh.position.set(0, 8.0, -2.52);
      this.proceduralFacility.add(signMesh);

      const upperDeck = new THREE.Mesh(new THREE.CylinderGeometry(7.6, 7.6, 4.2, 32, 1, false, -Math.PI / 2, Math.PI), glassMat);
      upperDeck.position.set(0, 12.6, -12);
      this.proceduralFacility.add(upperDeck);

      const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(19, 0.8, 17), whiteMat);
      roofSlab.position.set(0, 11, -12);
      roofSlab.castShadow = true;
      this.proceduralFacility.add(roofSlab);

      const hvac1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.0, 20), chromeMat);
      hvac1.position.set(-5, 12.2, -15);
      const hvac2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.0, 20), chromeMat);
      hvac2.position.set(4, 12.2, -15);
      this.proceduralFacility.add(hvac1);
      this.proceduralFacility.add(hvac2);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 7, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      mast.position.set(6, 15.0, -12);
      this.proceduralFacility.add(mast);

      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e });
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });

      const createPine = (x, y, z, scale = 1) => {
        const g = new THREE.Group();
        const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.4 * scale, 8), trunkMat);
        tr.position.y = 0.7 * scale;
        g.add(tr);
        const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.9 * scale, 1.6 * scale, 8), foliageMat);
        c1.position.y = 1.8 * scale;
        g.add(c1);
        const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.65 * scale, 1.3 * scale, 8), foliageMat);
        c2.position.y = 2.4 * scale;
        g.add(c2);
        g.position.set(x, y, z);
        return g;
      };

      this.proceduralFacility.add(createPine(8.5, 4.5, -8, 1.1));
      this.proceduralFacility.add(createPine(10.2, 4.5, -9, 0.85));
      this.proceduralFacility.add(createPine(9.0, 4.5, -10.5, 1.0));

      const bay = new THREE.Mesh(new THREE.BoxGeometry(13, 8.5, 13), whiteMat);
      bay.position.set(16.5, 4.8, -12);
      bay.castShadow = true;
      this.proceduralFacility.add(bay);

      const bayPortal = new THREE.Mesh(new THREE.BoxGeometry(7.5, 6.0, 4.5), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      bayPortal.position.set(16.5, 3.8, -5.2);
      this.proceduralFacility.add(bayPortal);

      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 10), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      rail1.position.set(12.3, 0.9, 0.8);
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.9, 10), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
      rail2.position.set(20.7, 0.9, 0.8);
      this.proceduralFacility.add(rail1);
      this.proceduralFacility.add(rail2);

      this.scene.add(this.proceduralFacility);
    }

    createProceduralTruck() {
      this.proceduralTruck = new THREE.Group();

      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.1 });
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.15, metalness: 0.85 });
      const windshieldMat = new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.05, metalness: 0.8, transmission: 0.3 });

      const cargo = new THREE.Mesh(new THREE.BoxGeometry(5.0, 4.4, 9.0), whiteMat);
      cargo.position.set(0, 3.4, -1);
      cargo.castShadow = true;
      this.proceduralTruck.add(cargo);

      const cab = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.8, 4.0), whiteMat);
      cab.position.set(0, 2.7, 5.2);
      cab.castShadow = true;
      this.proceduralTruck.add(cab);

      const wind = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.0), windshieldMat);
      wind.position.set(0, 3.3, 7.22);
      this.proceduralTruck.add(wind);

      const wheelPositions = [
        [-2.4, 0.75, 5.0], [2.4, 0.75, 5.0],
        [-2.4, 0.75, -3.4], [2.4, 0.75, -3.4],
        [-2.4, 0.75, -1.4], [2.4, 0.75, -1.4]
      ];

      wheelPositions.forEach(([x, y, z]) => {
        const wg = new THREE.Group();
        wg.position.set(x, y, z);

        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.65, 20), tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wg.add(tire);

        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.67, 16), rimMat);
        rim.rotation.z = Math.PI / 2;
        wg.add(rim);

        this.proceduralTruck.add(wg);
      });

      this.proceduralTruck.position.set(16.5, 0, -2.2);
      this.scene.add(this.proceduralTruck);
    }

    // ── Glowing Neon Conduits (6 Channels) ────────────────────────────
    createNeonConduits() {
      CHANNELS.forEach(ch => {
        const curve = new THREE.CatmullRomCurve3(ch.curvePoints);

        const outerGeo = new THREE.TubeGeometry(curve, 72, 0.6, 18, false);
        const outerMat = new THREE.MeshPhysicalMaterial({
          color: ch.color,
          transmission: 0.88,
          opacity: 0.5,
          transparent: true,
          roughness: 0.05,
          metalness: 0.1,
          ior: 1.45
        });
        const outerTube = new THREE.Mesh(outerGeo, outerMat);
        this.scene.add(outerTube);

        const innerGeo = new THREE.TubeGeometry(curve, 72, 0.22, 12, false);
        const innerMat = new THREE.MeshBasicMaterial({ color: ch.color });
        const innerTube = new THREE.Mesh(innerGeo, innerMat);
        this.scene.add(innerTube);

        const flange = new THREE.Mesh(
          new THREE.TorusGeometry(0.68, 0.08, 12, 24),
          new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.85, roughness: 0.2 })
        );
        flange.position.copy(ch.curvePoints[0]);
        this.scene.add(flange);

        this.conduits.push({
          channel: ch,
          curve: curve,
          outer: outerTube,
          inner: innerTube
        });
      });
    }

    // ── Terminal Pedestals & Cubes ────────────────────────────────────
    createTerminalPedestals() {
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.08 });

      CHANNELS.forEach(ch => {
        const group = new THREE.Group();
        group.position.copy(ch.terminalPos);

        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2.4), pedestalMat);
        base.position.y = -0.35;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        const ring = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.9, 32), new THREE.MeshBasicMaterial({ color: ch.color, side: THREE.DoubleSide }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.68;
        group.add(ring);

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 2.1, 2.1),
          new THREE.MeshPhysicalMaterial({
            color: ch.color,
            emissive: ch.emissive,
            emissiveIntensity: 0.9,
            transmission: 0.75,
            opacity: 0.9,
            transparent: true,
            roughness: 0.06,
            metalness: 0.05
          })
        );
        cube.position.y = 1.05;
        cube.castShadow = true;
        cube.userData = { channel: ch, baseEmissive: 0.9 };
        group.add(cube);
        this.interactiveCubes.push(cube);

        const envMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        envMesh.position.set(0, 1.05, 1.06);
        group.add(envMesh);

        const pLight = new THREE.PointLight(ch.color, 2.2, 14);
        pLight.position.set(0, 1.1, 0);
        group.add(pLight);
        this.pointLights.push(pLight);

        this.scene.add(group);
      });
    }

    createOverheadNetwork() {
      const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(7, 9.5, -14),
        new THREE.Vector3(17, 9.5, -14),
        new THREE.Vector3(26, 8.5, -10),
        new THREE.Vector3(26, 4.0, -4)
      ]);
      const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 36, 0.16, 10, false), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      this.scene.add(pipe);
    }

    // ── Animated Data Packets ─────────────────────────────────────────
    spawnPacket(forcedChannel = null) {
      const ch = forcedChannel || CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
      if (state.activeFilter !== 'all' && ch.type !== state.activeFilter) return;

      const conduit = this.conduits.find(c => c.channel.id === ch.id);
      if (!conduit) return;

      const packetGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(packetGeo, packetMat);

      const glowGeo = new THREE.SphereGeometry(0.52, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({ color: ch.color, transparent: true, opacity: 0.85 });
      mesh.add(new THREE.Mesh(glowGeo, glowMat));

      const startPt = conduit.curve.getPointAt(0);
      mesh.position.copy(startPt);
      this.scene.add(mesh);

      this.packets.push({
        mesh: mesh,
        conduit: conduit,
        progress: 0,
        speed: (0.0045 + Math.random() * 0.0035) * state.speedMultiplier
      });
    }

    triggerBurst(count = 50) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => this.spawnPacket(), Math.random() * 500);
      }
      sound.playBurst();
    }

    // ── Mouse & Raycasting ────────────────────────────────────────────
    onMouseMove(e) {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / this.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveCubes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.container.style.cursor = 'pointer';
        hit.material.emissiveIntensity = 1.8;
      } else {
        this.container.style.cursor = 'grab';
        this.interactiveCubes.forEach(cube => {
          if (state.selectedNode !== cube.userData.channel.id) {
            cube.material.emissiveIntensity = cube.userData.baseEmissive;
          }
        });
      }
    }

    onClick(e) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveCubes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const ch = hit.userData.channel;
        this.selectNode(ch);
        sound.playTone(720, 0.08);
      }
    }

    selectNode(ch) {
      state.selectedNode = ch.id;

      this.interactiveCubes.forEach(cube => {
        cube.material.emissiveIntensity = cube.userData.channel.id === ch.id ? 2.0 : 0.4;
      });

      for (let i = 0; i < 8; i++) {
        setTimeout(() => this.spawnPacket(ch), i * 60);
      }

      const card = document.getElementById('telemetry-card');
      if (card) {
        document.getElementById('card-title').textContent = ch.name;
        document.getElementById('card-sub').textContent = ch.type.toUpperCase() + ' Direct Gateway';
        document.getElementById('stat-rate').textContent = ch.rate;
        document.getElementById('stat-latency').textContent = ch.latency;
        document.getElementById('stat-success').textContent = ch.delivery;
        document.getElementById('stat-sessions').textContent = ch.activeSessions;
        document.getElementById('card-icon').textContent = ch.icon;
        document.getElementById('card-icon').style.background = ch.colorHex + '22';
        document.getElementById('card-icon').style.color = ch.colorHex;
        card.classList.remove('hidden');
      }
    }

    onResize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      if (this.composer) this.composer.setSize(this.width, this.height);
    }

    // ── Animation Loop ────────────────────────────────────────────────
    animate() {
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();

      if (this.controls) this.controls.update();
      if (this.mixer) this.mixer.update(delta);

      if (Math.random() < 0.28 * state.speedMultiplier) {
        this.spawnPacket();
      }

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
        p.mesh.position.copy(point);
      }

      // Render via Bloom Post-Processing Composer (or standard renderer fallback)
      if (this.composer && state.bloomEnabled) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  // ── DOM Initialization ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const visualizer = new GLTFPipelineHub3D(container);

    const burstBtn = document.getElementById('btn-burst');
    if (burstBtn) {
      burstBtn.addEventListener('click', () => {
        burstBtn.classList.add('btn-burst-active');
        visualizer.triggerBurst(55);
        setTimeout(() => burstBtn.classList.remove('btn-burst-active'), 1200);
      });
    }

    const resetCamBtn = document.getElementById('btn-reset-cam');
    if (resetCamBtn) {
      resetCamBtn.addEventListener('click', () => {
        if (visualizer.controls) {
          visualizer.camera.position.set(42, 30, 46);
          visualizer.controls.target.set(-1, 3.0, 3.5);
          visualizer.controls.update();
          sound.playTone(550, 0.05);
        }
      });
    }

    const soundBtn = document.getElementById('btn-sound');
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

    const themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        visualizer.updateAtmosphere();
        themeBtn.textContent = state.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
      });
    }

    const filterBtns = document.querySelectorAll('.ch-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');
        sound.playTone(500, 0.05);
      });
    });

    const cardClose = document.getElementById('card-close-btn');
    if (cardClose) {
      cardClose.addEventListener('click', () => {
        const card = document.getElementById('telemetry-card');
        if (card) card.classList.add('hidden');
        state.selectedNode = null;
        visualizer.interactiveCubes.forEach(c => {
          c.material.emissiveIntensity = c.userData.baseEmissive;
        });
      });
    }
  });
})();
