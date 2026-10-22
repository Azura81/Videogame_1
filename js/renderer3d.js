/**
 * KOMA: Spirit Delivery - 3D WebGL Renderer (Three.js)
 * Implements an isometric 3D garden world with dynamic lighting, shadows,
 * Sakura trees, water with koi, cyber Torii gates, and animated KOMA robot.
 */

const COLOR_PALETTE = {
  cyan: {
    hex: 0x00f5ff,
    closedHex: 0x00c4cc,
    neon: 0x00f5ff,
    barrier: 0x00f5ff,
    pad: 0x00f5d4,
    lightClosed: 0x00f5ff,
    lightActive: 0xffffff,
    sparkColor: 0x00f5ff,
    name: "Cyan"
  },
  magenta: {
    hex: 0xdf6eff,
    closedHex: 0x9d4edd,
    neon: 0xdf6eff,
    barrier: 0xdf6eff,
    pad: 0xdf6eff,
    lightClosed: 0xdf6eff,
    lightActive: 0xffffff,
    sparkColor: 0xdf6eff,
    name: "Magenta"
  },
  gold: {
    hex: 0xffb703,
    closedHex: 0xfb8500,
    neon: 0xffb703,
    barrier: 0xffb703,
    pad: 0xffb703,
    lightClosed: 0xffb703,
    lightActive: 0xffffff,
    sparkColor: 0xffb703,
    name: "Gold"
  },
  green: {
    hex: 0x06d6a0,
    closedHex: 0x059669,
    neon: 0x06d6a0,
    barrier: 0x06d6a0,
    pad: 0x06d6a0,
    lightClosed: 0x06d6a0,
    lightActive: 0xffffff,
    sparkColor: 0x06d6a0,
    name: "Smaragd"
  }
};

class GardenRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Level & Grid Dimensions
    this.gridWidth = 5;
    this.gridHeight = 5;
    this.tileSize = 1.0;
    
    // Scene objects
    this.worldGroup = new THREE.Group();
    this.pondGroup = new THREE.Group();
    this.tilesGroup = new THREE.Group();
    this.decorGroup = new THREE.Group();
    this.effectsGroup = new THREE.Group();
    this.komaGroup = null;
    this.gateMeshes = [];
    this.switchMeshes = [];
    this.goalMesh = null;
    this.waterMesh = null;
    this.waterAnchor = null;
    this.isFujiThemeActive = false;
    this.koiFish = [];
    this.sakuraParticles = null;
    this.fireflyParticles = null;
    this.toriiGateObjects = [];
    this.portalMeshes = [];
    this.orbMeshes = [];
    this.windMeshes = [];
    this.komaEarMeshes = [];
    this.fujiGroup = null;
    this.snowParticles = null;
    this.fragileMeshes = {};
    this.blockMeshes = {};
    
    // Lighting
    this.ambientLight = null;
    this.sunLight = null;
    this.lanternLights = [];
    
    // Textures cache
    this.textures = {};
    this.sharedAssets = {};
    
    // Animation & State
    this.komaState = {
      gridX: 0,
      gridY: 0,
      targetPos: new THREE.Vector3(),
      currentPos: new THREE.Vector3(),
      targetRotY: 0,
      currentRotY: 0,
      isMoving: false,
      moveStartTime: 0,
      moveDuration: 300,
      startPos: new THREE.Vector3(),
      isRotating: false,
      rotStartTime: 0,
      rotDuration: 220,
      startRotY: 0,
      isBumping: false,
      bumpStartTime: 0,
      isCelebrating: false,
      isWindSliding: false,
      slideStartTime: 0,
      slideDuration: 260,
      slideDir: "N",
      onSlideLanding: null,
      blinkTimer: 0,
      isBlinking: false,
      landingBounce: 0,
      twitchTimer: 0,
      onLanding: null
    };
    
    this.clock = new THREE.Clock();
    this.isInitialized = false;
    
    // Camera Orbit State & Swivel Controls
    this.defaultOrbit = {
      azimuth: -Math.PI * 0.75,
      elevation: 0.68,
      distance: 43.7
    };
    this.orbit = {
      azimuth: this.defaultOrbit.azimuth,
      elevation: this.defaultOrbit.elevation,
      distance: this.defaultOrbit.distance,
      targetAzimuth: this.defaultOrbit.azimuth,
      targetElevation: this.defaultOrbit.elevation
    };
    this.onSwivelCallback = null;
    this.dynamicEffects = [];
    
    this.init();
  }

  init() {
    if (!this.container) return;
    
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1424);
    this.scene.fog = new THREE.FogExp2(0x0a1424, 0.015);
    
    // 2. Camera: Isometric Orthographic
    const w = this.container.clientWidth || window.innerWidth || 800;
    const h = this.container.clientHeight || window.innerHeight || 600;
    const aspect = w / h;
    const frustumSize = 10;
    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      -50,
      100
    );
    
    // Isometric angle: 45° azimuth, ~35° elevation
    this.updateCameraPosition();
    
    // 3. Renderer - High-performance single-pass WebGL (solid background, locked 1.0 pixelRatio for ultra-smooth laptop & mobile 60fps)
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(Math.min(w, 1920), Math.min(h, 1080));
    this.renderer.setPixelRatio(1.0);
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    
    // 4. Build Groups
    this.scene.add(this.worldGroup);
    this.worldGroup.add(this.pondGroup);
    this.worldGroup.add(this.tilesGroup);
    this.worldGroup.add(this.decorGroup);
    this.worldGroup.add(this.effectsGroup);
    
    // 5. Generate Procedural Textures & Shared Geometry Assets
    this.generateTextures();
    this.setupSharedAssets();
    
    // 6. Setup Lighting
    this.setupLighting();
    
    // 7. Setup Background & Water Pond (built once, persistent across levels)
    this.setupWaterAndSurroundings();
    this.setupMountFuji();
    
    // 8. Setup Sakura Petals & Alpine Snow Particle Systems
    this.setupSakuraParticles();
    this.setupSnowParticles();
    
    // 8b. Setup Firefly & Spirit Motes Particle System
    this.setupFireflyParticles();
    
    // 9. Build KOMA 3D Model
    const savedSkin = (typeof localStorage !== "undefined" && localStorage.getItem("koma_equipped_skin")) || "original";
    this.buildKomaModel(savedSkin);
    
    // 10. Camera Orbit Controls & Resize Listeners
    this.setupCameraControls();
    window.addEventListener("resize", () => this.onResize());
    
    // 11. Start Render Loop
    this.isInitialized = true;
    this.animate();
  }

  setupSharedAssets() {
    // Shared Stone & Grass Slabs - reused across all grid tiles
    this.sharedStoneGeo = new THREE.BoxGeometry(0.94, 0.45, 0.94);
    this.sharedStoneGeo.userData.isShared = true;

    this.sharedStoneMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      roughness: 0.6,
      metalness: 0.1
    });
    this.sharedStoneMat.userData.isShared = true;

    // Winter / Mount Fuji Snow-Dusted Stone Slab Material
    this.sharedSnowStoneMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      color: 0xd8e4ee,
      roughness: 0.65,
      metalness: 0.05
    });
    this.sharedSnowStoneMat.userData.isShared = true;

    this.sharedMossMat = new THREE.MeshStandardMaterial({
      map: this.textures.moss,
      roughness: 0.8,
      metalness: 0.02
    });
    this.sharedMossMat.userData.isShared = true;

    // Winter / Mount Fuji Alpine Frost Meadow Material
    this.sharedSnowGrassMat = new THREE.MeshStandardMaterial({
      map: this.textures.moss,
      color: 0xdcebf5,
      roughness: 0.85,
      metalness: 0.02
    });
    this.sharedSnowGrassMat.userData.isShared = true;

    // Snow Patch Topping on Walkable Slabs
    this.sharedSnowPatchGeo = new THREE.BoxGeometry(0.72, 0.04, 0.72);
    this.sharedSnowPatchGeo.userData.isShared = true;

    this.sharedSnowPatchMat = new THREE.MeshStandardMaterial({
      color: 0xf4f9ff,
      roughness: 0.8,
      metalness: 0.05
    });
    this.sharedSnowPatchMat.userData.isShared = true;

    // Petal sprite plane
    this.sharedPetalGeo = new THREE.PlaneGeometry(0.25, 0.25);
    this.sharedPetalGeo.userData.isShared = true;
    this.sharedPetalMat = new THREE.MeshBasicMaterial({
      map: this.textures.petal,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    this.sharedPetalMat.userData.isShared = true;

    // Particle / Spark geometries & materials (Reused by step dust and spark emitters to prevent GC spikes)
    this.sharedSparkGeo = new THREE.SphereGeometry(0.035, 6, 6);
    this.sharedSparkGeo.userData.isShared = true;

    this.sharedDustGeo = new THREE.RingGeometry(0.08, 0.28, 16);
    this.sharedDustGeo.userData.isShared = true;

    this.sharedCyanSparkMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    this.sharedCyanSparkMat.userData.isShared = true;

    this.sharedMagentaSparkMat = new THREE.MeshBasicMaterial({ color: 0xdf6eff });
    this.sharedMagentaSparkMat.userData.isShared = true;

    this.sharedGoldSparkMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
    this.sharedGoldSparkMat.userData.isShared = true;

    this.sharedPinkSparkMat = new THREE.MeshBasicMaterial({ color: 0xff70a6 });
    this.sharedPinkSparkMat.userData.isShared = true;
  }

  // Recursive GPU resource disposal helper to eliminate VRAM and geometry leaks
  disposeHierarchy(obj) {
    if (!obj) return;
    obj.traverse(child => {
      if (child.isMesh || child.isPoints || child.isLine) {
        if (child.geometry && !child.geometry.userData?.isShared) {
          child.geometry.dispose();
        }
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(m => {
            if (!m.userData?.isShared) m.dispose();
          });
        }
      }
      if (child.isLight && typeof child.dispose === "function") {
        child.dispose();
      }
    });
  }

  setupCameraControls() {
    // Pure two-finger pinch-to-zoom (no single-finger drag rotation, prevents camera token exploit)
    const activePointers = new Map();
    let initialPinchDist = 0;
    let initialOrbitDist = this.orbit.distance;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 2) {
        // Pinch zoom start on mobile touch
        const pts = Array.from(activePointers.values());
        initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialOrbitDist = this.orbit.distance;
      }
    };

    const onPointerMove = (e) => {
      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      if (activePointers.size === 2 && initialPinchDist > 0) {
        // Pinch to zoom on mobile
        const pts = Array.from(activePointers.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const factor = initialPinchDist / Math.max(currentDist, 1);
        this.orbit.distance = Math.max(24, Math.min(60, initialOrbitDist * factor));
      }
    };

    const onPointerUp = (e) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        initialPinchDist = 0;
      }
    };

    this.container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  updateCameraPosition() {
    const x = this.orbit.distance * Math.cos(this.orbit.elevation) * Math.sin(this.orbit.azimuth);
    const y = this.orbit.distance * Math.sin(this.orbit.elevation);
    const z = this.orbit.distance * Math.cos(this.orbit.elevation) * Math.cos(this.orbit.azimuth);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);

    if (this.waterAnchor) {
      this.updateWaterBackdrop();
    }
    if (this.fujiGroup && this.fujiGroup.visible) {
      this.updateFujiBackdrop();
    }
  }

  rotateCameraBy(deltaRad) {
    if (this.swivelDisabled) return;
    this.orbit.targetAzimuth += deltaRad;
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
    if (typeof this.onSwivelCallback === "function") {
      this.onSwivelCallback();
    }
  }

  resetCameraView() {
    this.orbit.targetAzimuth = this.defaultOrbit.azimuth;
    this.orbit.targetElevation = this.defaultOrbit.elevation;
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const rawW = this.container.clientWidth || window.innerWidth || 800;
    const rawH = this.container.clientHeight || window.innerHeight || 600;
    const w = Math.min(rawW, 1920);
    const h = Math.min(rawH, 1080);
    const aspect = w / h;
    
    // Dynamically adjust frustum to fit current grid dimensions
    const maxGridDim = Math.max(this.gridWidth, this.gridHeight, 5);
    const frustumSize = maxGridDim * 1.55;
    
    if (aspect < 1.0) {
      // Mobile portrait view: frame full garden horizontally without clipping
      const vFrustum = frustumSize / aspect;
      this.camera.left = -frustumSize / 2;
      this.camera.right = frustumSize / 2;
      // Center garden vertically in the visible viewport between top bar and bottom dock
      const yOffset = vFrustum * 0.08;
      this.camera.top = vFrustum / 2 - yOffset;
      this.camera.bottom = -vFrustum / 2 - yOffset;
    } else {
      this.camera.left = (-frustumSize * aspect) / 2;
      this.camera.right = (frustumSize * aspect) / 2;
      this.camera.top = frustumSize / 2;
      this.camera.bottom = -frustumSize / 2;
    }
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(w, h);
    if (this.fujiGroup && this.fujiGroup.visible) {
      this.updateFujiBackdrop();
    }
    if (this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  generateTextures() {
    // 1. Cobblestone / Path Texture
    const stoneCanvas = document.createElement("canvas");
    stoneCanvas.width = 256;
    stoneCanvas.height = 256;
    const sctx = stoneCanvas.getContext("2d");
    
    // Slate gradient
    const sGrad = sctx.createLinearGradient(0, 0, 256, 256);
    sGrad.addColorStop(0, "#4a5368");
    sGrad.addColorStop(0.5, "#3d4558");
    sGrad.addColorStop(1, "#2f3647");
    sctx.fillStyle = sGrad;
    sctx.fillRect(0, 0, 256, 256);
    
    // Subtle stone noise & moss
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 3 + 1;
      sctx.fillStyle = Math.random() > 0.4 ? "rgba(255,255,255,0.06)" : "rgba(35,80,50,0.18)";
      sctx.beginPath();
      sctx.arc(x, y, r, 0, Math.PI * 2);
      sctx.fill();
    }
    // Bevel borders
    sctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    sctx.lineWidth = 4;
    sctx.strokeRect(4, 4, 248, 248);
    sctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    sctx.lineWidth = 4;
    sctx.strokeRect(1, 1, 254, 254);
    
    this.textures.stone = new THREE.CanvasTexture(stoneCanvas);
    
    // 2. Sakura Petal Sprite Texture
    const petalCanvas = document.createElement("canvas");
    petalCanvas.width = 64;
    petalCanvas.height = 64;
    const pctx = petalCanvas.getContext("2d");
    
    const pGrad = pctx.createRadialGradient(32, 28, 2, 32, 32, 26);
    pGrad.addColorStop(0, "#ffdeec");
    pGrad.addColorStop(0.5, "#ff8fb8");
    pGrad.addColorStop(0.9, "#f0568c");
    pGrad.addColorStop(1, "rgba(240, 86, 140, 0)");
    pctx.fillStyle = pGrad;
    
    pctx.beginPath();
    pctx.moveTo(32, 10);
    pctx.bezierCurveTo(46, 10, 56, 24, 48, 44);
    pctx.bezierCurveTo(42, 54, 32, 58, 32, 58);
    pctx.bezierCurveTo(32, 58, 22, 54, 16, 44);
    pctx.bezierCurveTo(8, 24, 18, 10, 32, 10);
    pctx.fill();
    
    this.textures.petal = new THREE.CanvasTexture(petalCanvas);

    // 3. Vibrant Moss / Grass Garden Tile Texture
    const mossCanvas = document.createElement("canvas");
    mossCanvas.width = 256;
    mossCanvas.height = 256;
    const mctx = mossCanvas.getContext("2d");
    const mGrad = mctx.createLinearGradient(0, 0, 256, 256);
    mGrad.addColorStop(0, "#235c34");
    mGrad.addColorStop(0.5, "#2a6e3e");
    mGrad.addColorStop(1, "#1c4a2a");
    mctx.fillStyle = mGrad;
    mctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 450; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 2.5 + 0.8;
      const colChoice = Math.random();
      if (colChoice < 0.6) {
        mctx.fillStyle = "rgba(76, 175, 80, 0.4)";
      } else if (colChoice < 0.85) {
        mctx.fillStyle = "rgba(129, 199, 132, 0.35)";
      } else {
        mctx.fillStyle = "rgba(15, 50, 25, 0.4)";
      }
      mctx.beginPath();
      mctx.arc(x, y, r, 0, Math.PI * 2);
      mctx.fill();
    }
    for (let i = 0; i < 18; i++) {
      const fx = Math.random() * 240 + 8;
      const fy = Math.random() * 240 + 8;
      mctx.fillStyle = Math.random() > 0.5 ? "#fff9c4" : "#ffeb3b";
      mctx.beginPath();
      mctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
      mctx.fill();
    }
    this.textures.moss = new THREE.CanvasTexture(mossCanvas);

    // 4. Japanese Timber Wood Texture
    const woodCanvas = document.createElement("canvas");
    woodCanvas.width = 256;
    woodCanvas.height = 256;
    const wctx = woodCanvas.getContext("2d");
    const wGrad = wctx.createLinearGradient(0, 0, 256, 0);
    wGrad.addColorStop(0, "#3e2723");
    wGrad.addColorStop(0.5, "#4e342e");
    wGrad.addColorStop(1, "#2e1c18");
    wctx.fillStyle = wGrad;
    wctx.fillRect(0, 0, 256, 256);
    wctx.fillStyle = "rgba(20, 10, 5, 0.25)";
    for (let y = 0; y < 256; y += 4 + Math.random() * 6) {
      wctx.fillRect(0, y, 256, 1.5);
    }
    this.textures.wood = new THREE.CanvasTexture(woodCanvas);

    // 5. Traditional Shoji Screen Paper (Kumiko lattice)
    const shojiCanvas = document.createElement("canvas");
    shojiCanvas.width = 128;
    shojiCanvas.height = 128;
    const shctx = shojiCanvas.getContext("2d");
    shctx.fillStyle = "#fff8e7";
    shctx.fillRect(0, 0, 128, 128);
    shctx.strokeStyle = "#4e342e";
    shctx.lineWidth = 3;
    shctx.strokeRect(0, 0, 128, 128);
    for (let i = 16; i < 128; i += 16) {
      shctx.beginPath();
      shctx.moveTo(i, 0);
      shctx.lineTo(i, 128);
      shctx.stroke();
    }
    for (let j = 24; j < 128; j += 24) {
      shctx.beginPath();
      shctx.moveTo(0, j);
      shctx.lineTo(128, j);
      shctx.stroke();
    }
    this.textures.shoji = new THREE.CanvasTexture(shojiCanvas);

    // 6. Japanese Kawara Roof Tile Texture
    const roofCanvas = document.createElement("canvas");
    roofCanvas.width = 128;
    roofCanvas.height = 128;
    const rfctx = roofCanvas.getContext("2d");
    rfctx.fillStyle = "#263238";
    rfctx.fillRect(0, 0, 128, 128);
    rfctx.fillStyle = "#1e272c";
    for (let y = 0; y < 128; y += 12) {
      rfctx.fillRect(0, y, 128, 5);
      rfctx.fillStyle = "rgba(255,255,255,0.08)";
      rfctx.fillRect(0, y + 5, 128, 1.5);
      rfctx.fillStyle = "#1e272c";
    }
    this.textures.roofTile = new THREE.CanvasTexture(roofCanvas);

    // 7. Bamboo Cane Texture
    const bamCanvas = document.createElement("canvas");
    bamCanvas.width = 64;
    bamCanvas.height = 128;
    const bmctx = bamCanvas.getContext("2d");
    const bGrad = bmctx.createLinearGradient(0, 0, 64, 0);
    bGrad.addColorStop(0, "#7cb342");
    bGrad.addColorStop(0.5, "#9ccc65");
    bGrad.addColorStop(1, "#558b2f");
    bmctx.fillStyle = bGrad;
    bmctx.fillRect(0, 0, 64, 128);
    bmctx.fillStyle = "#33691e";
    for (let y = 20; y < 128; y += 40) {
      bmctx.fillRect(0, y, 64, 3);
      bmctx.fillStyle = "rgba(255,255,255,0.2)";
      bmctx.fillRect(0, y + 3, 64, 1.5);
      bmctx.fillStyle = "#33691e";
    }
    this.textures.bamboo = new THREE.CanvasTexture(bamCanvas);

    // 8. Ancient Stone Wall Texture (Ishigaki)
    const swCanvas = document.createElement("canvas");
    swCanvas.width = 128;
    swCanvas.height = 128;
    const swctx = swCanvas.getContext("2d");
    swctx.fillStyle = "#37474f";
    swctx.fillRect(0, 0, 128, 128);
    swctx.strokeStyle = "#212121";
    swctx.lineWidth = 2.5;
    for (let y = 0; y < 128; y += 22) {
      swctx.beginPath();
      swctx.moveTo(0, y);
      swctx.lineTo(128, y);
      swctx.stroke();
      const offset = (y / 22) % 2 === 0 ? 0 : 20;
      for (let x = offset; x < 128; x += 40) {
        swctx.beginPath();
        swctx.moveTo(x, y);
        swctx.lineTo(x, y + 22);
        swctx.stroke();
      }
    }
    for (let i = 0; i < 40; i++) {
      swctx.fillStyle = "rgba(46, 125, 50, 0.4)";
      swctx.beginPath();
      swctx.arc(Math.random() * 128, Math.random() * 128, Math.random() * 4 + 1.5, 0, Math.PI * 2);
      swctx.fill();
    }
    this.textures.stoneWall = new THREE.CanvasTexture(swCanvas);

    // 9. Soft Shinto Contact Shadow Texture (Zero-cost character grounding)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const shdctx = shadowCanvas.getContext("2d");
    const shdGrad = shdctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    shdGrad.addColorStop(0, "rgba(2, 6, 14, 0.62)");
    shdGrad.addColorStop(0.45, "rgba(2, 6, 14, 0.38)");
    shdGrad.addColorStop(0.8, "rgba(2, 6, 14, 0.1)");
    shdGrad.addColorStop(1.0, "rgba(2, 6, 14, 0)");
    shdctx.fillStyle = shdGrad;
    shdctx.beginPath();
    shdctx.arc(32, 32, 30, 0, Math.PI * 2);
    shdctx.fill();
    this.textures.contactShadow = new THREE.CanvasTexture(shadowCanvas);

    // 9. Bio-luminescent Firefly & Spirit Mote Texture (Hotaru / Kitsune-Bi)
    const ffCanvas = document.createElement("canvas");
    ffCanvas.width = 64;
    ffCanvas.height = 64;
    const ffctx = ffCanvas.getContext("2d");
    const ffGrad = ffctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    ffGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    ffGrad.addColorStop(0.2, "rgba(255, 245, 170, 0.95)");
    ffGrad.addColorStop(0.5, "rgba(112, 224, 0, 0.65)");
    ffGrad.addColorStop(0.85, "rgba(0, 245, 212, 0.2)");
    ffGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ffctx.fillStyle = ffGrad;
    ffctx.beginPath();
    ffctx.arc(32, 32, 30, 0, Math.PI * 2);
    ffctx.fill();
    this.textures.firefly = new THREE.CanvasTexture(ffCanvas);
  }

  setupLighting() {
    // Ambient moonlight / night atmospheric glow
    this.ambientLight = new THREE.AmbientLight(0x283b58, 1.15);
    this.scene.add(this.ambientLight);
    
    // Soft directional moonlight with crisp optimized shadow map
    this.sunLight = new THREE.DirectionalLight(0xa5c4f2, 1.25);
    this.sunLight.position.set(16, 28, 14);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 512;
    this.sunLight.shadow.mapSize.height = 512;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 70;
    this.sunLight.shadow.radius = 1.2;
    
    const d = 12;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);
    
    // Cyber accent light for scene rim reflections
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 0.4);
    cyanRim.position.set(-15, 12, -15);
    this.scene.add(cyanRim);
  }

  setupWaterAndSurroundings() {
    // Only construct pond and fish once - persistent across levels
    if (this.waterMesh) return;

    this.waterAnchor = new THREE.Group();
    this.pondGroup.add(this.waterAnchor);

    // 1. Water Plane beneath the garden (seamless zen pond covering entire base)
    const waterGeo = new THREE.PlaneGeometry(36, 36, 1, 1);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a1d30,
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92
    });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(0, -0.28, 0);
    this.waterMesh.receiveShadow = true;
    this.waterAnchor.add(this.waterMesh);
    
    // 2. Swimming Koi Fish (3 elegant zen fish)
    this.koiFish = [];
    const koiColors = [0xff5e3a, 0xfafafa, 0xffaa00];
    for (let i = 0; i < 3; i++) {
      const koiGroup = new THREE.Group();
      
      // Body
      const bodyGeo = new THREE.ConeGeometry(0.12, 0.55, 6);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: koiColors[i % koiColors.length],
        emissive: koiColors[i % koiColors.length],
        emissiveIntensity: 0.15,
        roughness: 0.4
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      koiGroup.add(body);
      
      // Tail fin
      const tailGeo = new THREE.PlaneGeometry(0.18, 0.22);
      const tailMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      tail.position.z = -0.32;
      koiGroup.add(tail);
      
      // Initial state
      const angle = (i / 3) * Math.PI * 2;
      const radius = 4.2 + (i % 2) * 1.6;
      koiGroup.position.set(Math.cos(angle) * radius, -0.22, Math.sin(angle) * radius);
      
      koiGroup.userData = {
        orbitAngle: angle,
        orbitRadius: radius,
        speed: 0.35 + (i * 0.08),
        wobbleOffset: i * 2.1,
        tailMesh: tail
      };
      
      this.pondGroup.add(koiGroup);
      this.koiFish.push(koiGroup);
    }
    
    // 3. Floating Lotus / Water Lilies (5 serene pads)
    for (let i = 0; i < 5; i++) {
      const padAngle = (i / 5) * Math.PI * 2 + 0.3;
      const padDist = 3.8 + (i % 3) * 1.2;
      const lx = Math.cos(padAngle) * padDist;
      const lz = Math.sin(padAngle) * padDist;
      
      // Lily pad
      const padGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.02, 12);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x1d4d38, roughness: 0.6 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(lx, -0.24, lz);
      this.pondGroup.add(pad);
      
      // Blossom on some
      if (i % 2 === 0) {
        const flowerGeo = new THREE.ConeGeometry(0.12, 0.16, 6);
        const flowerMat = new THREE.MeshStandardMaterial({
          color: 0xff99bb,
          emissive: 0xff5588,
          emissiveIntensity: 0.25
        });
        const flower = new THREE.Mesh(flowerGeo, flowerMat);
        flower.position.set(lx, -0.16, lz);
        this.pondGroup.add(flower);
      }
    }
  }

  setupSakuraParticles() {
    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Delicate Japanese sakura petal palette (from snow-white pink to deep cherry blossom)
    const petalPalette = [
      new THREE.Color(0xffffff), // snowy white-pink
      new THREE.Color(0xffe2ed), // pale blossom
      new THREE.Color(0xffb8d2), // classic sakura pink
      new THREE.Color(0xff85b8), // spring rose
      new THREE.Color(0xf472b6)  // vibrant magenta-pink accent
    ];
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = Math.random() * 12 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
      
      scales[i] = Math.random() * 0.32 + 0.18;
      
      speeds[i * 3 + 0] = -(Math.random() * 0.025 + 0.018); // gentle wind drift X
      speeds[i * 3 + 1] = -(Math.random() * 0.02 + 0.012);  // gentle fall speed Y
      speeds[i * 3 + 2] = Math.random() * 0.02 - 0.01;      // wobble Z

      const c = petalPalette[i % petalPalette.length];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.userData = { speeds: speeds };
    
    const material = new THREE.PointsMaterial({
      size: 0.38,
      map: this.textures.petal,
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    
    this.sakuraParticles = new THREE.Points(geometry, material);
    this.effectsGroup.add(this.sakuraParticles);
  }

  setupMountFuji() {
    // 3D Mount Fuji mountain mesh disabled per user request; snow scenery, snowfall & winter effects retained
    this.fujiGroup = null;
  }

  updateWaterBackdrop() {
    // Seamless water pond at standard (0, -0.28, 0) across all levels
    if (this.waterAnchor) {
      this.waterAnchor.rotation.y = 0;
    }
    if (this.waterMesh) {
      this.waterMesh.position.set(0, -0.28, 0);
    }
  }

  updateFujiBackdrop() {
    // Mountain mesh disabled
  }

  setupSnowParticles() {
    if (this.snowParticles) return;
    const particleCount = 45;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const snowPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xf0f9ff),
      new THREE.Color(0xe0f2fe),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = Math.random() * 16 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 32;

      scales[i] = Math.random() * 0.28 + 0.15;

      speeds[i * 3 + 0] = -(Math.random() * 0.015 + 0.008);
      speeds[i * 3 + 1] = -(Math.random() * 0.032 + 0.018);
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

      const c = snowPalette[i % snowPalette.length];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.userData = { speeds: speeds };

    const material = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.snowParticles = new THREE.Points(geometry, material);
    this.snowParticles.visible = false;
    this.effectsGroup.add(this.snowParticles);
  }

  setFujiTheme(enabled) {
    this.isFujiThemeActive = !!enabled;
    this.updateWaterBackdrop();

    if (this.fujiGroup) {
      this.fujiGroup.visible = false;
    }
    if (this.snowParticles) {
      this.snowParticles.visible = !!enabled;
    }
    if (this.sakuraParticles) {
      this.sakuraParticles.visible = !enabled;
    }

    // Dynamic Alpine Winter Atmosphere (Frozen Lake & Frost Night Sky)
    if (this.waterMesh && this.waterMesh.material) {
      if (enabled) {
        this.waterMesh.material.color.setHex(0x1a3854); // Serene frozen alpine lake pond
        this.waterMesh.material.metalness = 0.6;
        this.waterMesh.material.roughness = 0.2;
      } else {
        this.waterMesh.material.color.setHex(0x0a1d30); // Deep summer night pond
        this.waterMesh.material.metalness = 0.85;
        this.waterMesh.material.roughness = 0.15;
      }
    }

    if (this.scene) {
      if (enabled) {
        this.scene.background.setHex(0x0a1626); // Frosty winter dawn navy
        if (this.scene.fog) this.scene.fog.color.setHex(0x0a1626);
      } else {
        this.scene.background.setHex(0x0a1424); // Summer shrine night
        if (this.scene.fog) this.scene.fog.color.setHex(0x0a1424);
      }
    }

    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }
  }

  setupFireflyParticles() {
    const count = 14;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const fireflyData = [];

    // Spiritual sanctuary firefly color palette: golden, jade, spirit cyan, moon lavender
    const ffPalette = [
      new THREE.Color(0xffd166), // warm golden ember
      new THREE.Color(0x70e000), // fresh bamboo jade
      new THREE.Color(0x00f5d4), // spirit river cyan
      new THREE.Color(0xff85b8), // sakura spirit pink
      new THREE.Color(0xc084fc)  // celestial lavender
    ];

    for (let i = 0; i < count; i++) {
      // Scatter gracefully around the garden pond, rockeries, and torii gates
      const radius = Math.random() * 8.5 + 1.2;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.random() * 3.8 + 0.35;
      const z = Math.sin(angle) * radius;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const baseCol = ffPalette[i % ffPalette.length];
      colors[i * 3 + 0] = baseCol.r;
      colors[i * 3 + 1] = baseCol.g;
      colors[i * 3 + 2] = baseCol.b;

      fireflyData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        baseColor: baseCol,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        speedY: Math.random() * 0.5 + 0.4,
        speedZ: (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        pulseFreq: Math.random() * 2.2 + 1.2,
        wanderRadius: Math.random() * 0.85 + 0.45
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.userData = { fireflies: fireflyData };

    const material = new THREE.PointsMaterial({
      size: 0.44,
      map: this.textures.firefly,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.fireflyParticles = new THREE.Points(geometry, material);
    this.effectsGroup.add(this.fireflyParticles);
  }

  buildKomaModel(skinId = "original") {
    this.currentSkinId = skinId;
    const skinDef = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS[skinId]) 
      || (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS.original) 
      || null;

    const matsDef = skinDef?.materials || {
      body: { color: 0xf5f8fc, metalness: 0.15, roughness: 0.22 },
      visor: { color: 0x060e18, metalness: 0.8, roughness: 0.15 },
      base: { color: 0x101a2b, metalness: 0.6, roughness: 0.3 },
      eye: { color: 0x00f5ff },
      glow: { color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.8 },
      pack: { color: 0xbd7c4c, roughness: 0.6 },
      packStrap: { color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.8 },
      light: 0x00f5ff
    };

    this.komaGroup = new THREE.Group();
    
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: matsDef.body.color,
      metalness: matsDef.body.metalness ?? 0.15,
      roughness: matsDef.body.roughness ?? 0.22
    });
    
    const darkMat = new THREE.MeshStandardMaterial({
      color: matsDef.base.color,
      metalness: matsDef.base.metalness ?? 0.6,
      roughness: matsDef.base.roughness ?? 0.3
    });
    
    const visorMat = new THREE.MeshStandardMaterial({
      color: matsDef.visor.color,
      metalness: matsDef.visor.metalness ?? 0.8,
      roughness: matsDef.visor.roughness ?? 0.15
    });
    
    const eyeMat = new THREE.MeshBasicMaterial({
      color: matsDef.eye.color
    });
    
    const glowMat = new THREE.MeshStandardMaterial({
      color: matsDef.glow.color,
      emissive: matsDef.glow.emissive,
      emissiveIntensity: matsDef.glow.emissiveIntensity ?? 1.0
    });
    
    const packMat = new THREE.MeshStandardMaterial({
      color: matsDef.pack.color,
      roughness: matsDef.pack.roughness ?? 0.5,
      metalness: matsDef.pack.metalness ?? 0.1
    });

    const packStrapMat = new THREE.MeshStandardMaterial({
      color: matsDef.packStrap.color,
      emissive: matsDef.packStrap.emissive ?? matsDef.packStrap.color,
      emissiveIntensity: matsDef.packStrap.emissiveIntensity ?? 0.8
    });
    
    // 1. Main Round Head / Torso
    const headGeo = new THREE.SphereGeometry(0.32, 24, 24);
    headGeo.scale(1.0, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 0.44;
    head.castShadow = true;
    head.receiveShadow = true;
    this.komaGroup.add(head);
    
    // 2. Dark Visor Face Screen
    const visorGeo = new THREE.SphereGeometry(0.24, 20, 20);
    visorGeo.scale(0.92, 0.68, 0.55);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.44, 0.21);
    this.komaGroup.add(visor);
    
    // 3. Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    eyeGeo.scale(0.8, 1.3, 0.6);
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.09, 0.45, 0.32);
    leftEye.rotation.z = 0.08;
    this.komaGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.09, 0.45, 0.32);
    rightEye.rotation.z = -0.08;
    this.komaGroup.add(rightEye);
    
    this.komaEyes = [leftEye, rightEye];
    
    // 4. Japanese Themed Accessories & Expressive Ear Physics
    this.komaEarMeshes = [];
    const accessories = skinDef?.accessories || ["singleEar"];

    // (a) Single Curved Rabbit Ear (Original Shiro Usagi)
    if (accessories.includes("singleEar")) {
      const earGroup = new THREE.Group();
      const earGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.28, 12);
      const ear = new THREE.Mesh(earGeo, bodyMat);
      ear.position.y = 0.14;
      ear.castShadow = true;
      earGroup.add(ear);
      
      const earTipGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const earTip = new THREE.Mesh(earTipGeo, glowMat);
      earTip.position.y = 0.28;
      earGroup.add(earTip);
      
      earGroup.position.set(-0.14, 0.72, 0);
      earGroup.rotation.z = 0.25;
      earGroup.rotation.x = -0.15;
      this.komaGroup.add(earGroup);
      this.komaEarMeshes.push({ mesh: earGroup, baseRotZ: 0.25, baseRotX: -0.15, type: "rabbit", side: 1 });
    }

    // (b) Dual Kitsune Fox Ears (Sakura Kitsune)
    if (accessories.includes("dualEars")) {
      [-1, 1].forEach(side => {
        const foxEar = new THREE.Group();
        const coneGeo = new THREE.ConeGeometry(0.065, 0.26, 12);
        coneGeo.scale(0.85, 1, 0.55);
        const earMesh = new THREE.Mesh(coneGeo, bodyMat);
        earMesh.position.y = 0.13;
        earMesh.castShadow = true;
        foxEar.add(earMesh);

        const innerGeo = new THREE.ConeGeometry(0.04, 0.18, 8);
        innerGeo.scale(0.6, 1, 0.3);
        const innerMesh = new THREE.Mesh(innerGeo, glowMat);
        innerMesh.position.set(0, 0.1, 0.02);
        foxEar.add(innerMesh);

        const tipGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const tipMesh = new THREE.Mesh(tipGeo, glowMat);
        tipMesh.position.y = 0.26;
        foxEar.add(tipMesh);

        foxEar.position.set(side * 0.16, 0.71, 0.02);
        foxEar.rotation.z = -side * 0.35;
        foxEar.rotation.x = -0.12;
        this.komaGroup.add(foxEar);
        this.komaEarMeshes.push({ mesh: foxEar, baseRotZ: -side * 0.35, baseRotX: -0.12, type: "fox", side: side });
      });
    }

    // (c) Stylized Cherry Blossom Hair Ornament (Sakura Kitsune)
    if (accessories.includes("sakuraFlower")) {
      const flower = new THREE.Group();
      const petalMat = new THREE.MeshStandardMaterial({
        color: 0xff85b8,
        emissive: 0xff3385,
        emissiveIntensity: 0.35,
        roughness: 0.4
      });
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2;
        const pGeo = new THREE.SphereGeometry(0.035, 8, 8);
        pGeo.scale(1.2, 0.45, 0.7);
        const pMesh = new THREE.Mesh(pGeo, petalMat);
        pMesh.position.set(Math.cos(angle) * 0.05, Math.sin(angle) * 0.05, 0);
        pMesh.rotation.z = angle;
        flower.add(pMesh);
      }
      const centerGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const centerMat = new THREE.MeshBasicMaterial({ color: 0xffd13b });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      centerMesh.position.z = 0.015;
      flower.add(centerMesh);

      flower.position.set(0.24, 0.65, 0.14);
      flower.rotation.y = 0.5;
      flower.rotation.z = -0.3;
      this.komaGroup.add(flower);
    }

    // (d) Dual Cyber Antennas (Neo Tokyo 2099)
    if (accessories.includes("dualAntenna")) {
      [-1, 1].forEach(side => {
        const antGroup = new THREE.Group();
        const rodGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.24, 8);
        const rodMesh = new THREE.Mesh(rodGeo, darkMat);
        rodMesh.position.y = 0.12;
        rodMesh.castShadow = true;
        antGroup.add(rodMesh);

        const tipGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        const tipMesh = new THREE.Mesh(tipGeo, glowMat);
        tipMesh.position.y = 0.24;
        antGroup.add(tipMesh);

        antGroup.position.set(side * 0.18, 0.72, -0.05);
        antGroup.rotation.z = -side * 0.3;
        antGroup.rotation.x = -0.2;
        this.komaGroup.add(antGroup);
        this.komaEarMeshes.push({ mesh: antGroup, baseRotZ: -side * 0.3, baseRotX: -0.2, type: "antenna", side: side });
      });
    }

    // (e) Cyber Visor Line (Neo Tokyo 2099)
    if (accessories.includes("cyberVisor")) {
      const visorBandGeo = new THREE.TorusGeometry(0.24, 0.012, 8, 24, Math.PI * 0.65);
      const visorBand = new THREE.Mesh(visorBandGeo, glowMat);
      visorBand.position.set(0, 0.44, 0.21);
      visorBand.rotation.x = -0.05;
      visorBand.rotation.z = Math.PI * 0.675;
      this.komaGroup.add(visorBand);
    }

    // (f) Akuma Oni Horns (Akuma Oni)
    if (accessories.includes("oniHorns")) {
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x994400,
        emissiveIntensity: 0.3
      });
      [-1, 1].forEach(side => {
        const hornGroup = new THREE.Group();
        const h1Geo = new THREE.ConeGeometry(0.055, 0.22, 10);
        const h1 = new THREE.Mesh(h1Geo, hornMat);
        h1.position.y = 0.11;
        h1.castShadow = true;
        hornGroup.add(h1);

        const h2Geo = new THREE.ConeGeometry(0.035, 0.16, 8);
        const h2 = new THREE.Mesh(h2Geo, hornMat);
        h2.position.set(0, 0.23, -0.04);
        h2.rotation.x = -0.45;
        h2.castShadow = true;
        hornGroup.add(h2);

        hornGroup.position.set(side * 0.15, 0.67, 0.18);
        hornGroup.rotation.z = -side * 0.4;
        hornGroup.rotation.x = -0.3;
        this.komaGroup.add(hornGroup);
        this.komaEarMeshes.push({ mesh: hornGroup, baseRotZ: -side * 0.4, baseRotX: -0.3, type: "horn", side: side });
      });
    }

    // (g) Crescent Moon Forehead Crest (Tsukuyomi Shinobi)
    if (accessories.includes("moonCrest")) {
      const crestGroup = new THREE.Group();
      const moonMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xa855f7,
        emissiveIntensity: 0.6
      });
      const arcGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 24, Math.PI * 1.35);
      const moonArc = new THREE.Mesh(arcGeo, moonMat);
      moonArc.rotation.z = -Math.PI * 0.675;
      crestGroup.add(moonArc);

      const gemGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const gemMesh = new THREE.Mesh(gemGeo, glowMat);
      gemMesh.position.set(0, 0, 0.01);
      crestGroup.add(gemMesh);

      crestGroup.position.set(0, 0.69, 0.27);
      crestGroup.rotation.x = -0.28;
      this.komaGroup.add(crestGroup);
      this.komaEarMeshes.push({ mesh: crestGroup, baseRotZ: 0, baseRotX: -0.28, type: "crest", side: 0 });
    }

    // (h) Stealth Fin Ears (Tsukuyomi Shinobi)
    if (accessories.includes("shadowEar")) {
      [-1, 1].forEach(side => {
        const finGroup = new THREE.Group();
        const finGeo = new THREE.BoxGeometry(0.04, 0.22, 0.14);
        finGeo.scale(0.8, 1, 1);
        const fin = new THREE.Mesh(finGeo, bodyMat);
        fin.position.set(0, 0.11, -0.04);
        fin.rotation.x = -0.55;
        fin.castShadow = true;
        finGroup.add(fin);

        const edgeGeo = new THREE.BoxGeometry(0.02, 0.22, 0.02);
        const edge = new THREE.Mesh(edgeGeo, glowMat);
        edge.position.set(0, 0.11, 0.03);
        edge.rotation.x = -0.55;
        finGroup.add(edge);

        finGroup.position.set(side * 0.18, 0.68, 0.02);
        finGroup.rotation.z = -side * 0.35;
        this.komaGroup.add(finGroup);
        this.komaEarMeshes.push({ mesh: finGroup, baseRotZ: -side * 0.35, baseRotX: 0, type: "fin", side: side });
      });
    }

    // (i) Golden Torii Halo (Gold Kami)
    if (accessories.includes("kamiHalo")) {
      const haloGroup = new THREE.Group();
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0xffe066,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0xffb703,
        emissiveIntensity: 0.8
      });
      const haloGeo = new THREE.TorusGeometry(0.28, 0.022, 12, 32);
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      haloGroup.add(haloMesh);

      const gemMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
      for (let g = 0; g < 6; g++) {
        const angle = (g / 6) * Math.PI * 2;
        const gemGeo = new THREE.SphereGeometry(0.032, 8, 8);
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(Math.cos(angle) * 0.28, 0, Math.sin(angle) * 0.28);
        haloGroup.add(gem);
      }

      haloGroup.position.set(0, 0.88, -0.02);
      this.komaGroup.add(haloGroup);
      this.komaHalo = haloGroup;
    }

    // (j) Divine Celestial Ears (Gold Kami)
    if (accessories.includes("kamiEars")) {
      [-1, 1].forEach(side => {
        const kEarGroup = new THREE.Group();
        const earGeo = new THREE.CylinderGeometry(0.04, 0.055, 0.32, 12);
        const ear = new THREE.Mesh(earGeo, bodyMat);
        ear.position.y = 0.16;
        ear.castShadow = true;
        kEarGroup.add(ear);

        const tipGeo = new THREE.SphereGeometry(0.05, 12, 12);
        const tipMesh = new THREE.Mesh(tipGeo, glowMat);
        tipMesh.position.y = 0.32;
        kEarGroup.add(tipMesh);

        kEarGroup.position.set(side * 0.14, 0.72, 0);
        kEarGroup.rotation.z = -side * 0.25;
        kEarGroup.rotation.x = -0.15;
        this.komaGroup.add(kEarGroup);
        this.komaEarMeshes.push({ mesh: kEarGroup, baseRotZ: -side * 0.25, baseRotX: -0.15, type: "kami", side: side });
      });
    }
    
    // 5. Delivery Backpack / Spirit Parcel
    const packGeo = new THREE.BoxGeometry(0.26, 0.28, 0.2);
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.42, -0.32);
    pack.castShadow = true;
    this.komaGroup.add(pack);
    
    // Pack ribbon / straps
    const strapGeo = new THREE.BoxGeometry(0.27, 0.04, 0.21);
    const strap = new THREE.Mesh(strapGeo, packStrapMat);
    strap.position.set(0, 0.42, -0.32);
    this.komaGroup.add(strap);
    
    // 6. Base / Thruster ring with gentle hover glow
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.14, 0.12, 16);
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = 0.14;
    base.castShadow = true;
    this.komaGroup.add(base);
    
    const thrustRingGeo = new THREE.RingGeometry(0.08, 0.18, 16);
    const thrustRing = new THREE.Mesh(thrustRingGeo, glowMat);
    thrustRing.rotation.x = Math.PI / 2;
    thrustRing.position.y = 0.07;
    this.komaGroup.add(thrustRing);
    
    // Light cast onto ground beneath KOMA
    const lightColor = matsDef.light ?? 0x00f5ff;
    this.komaLight = new THREE.PointLight(lightColor, 1.2, 2.2);
    this.komaLight.position.set(0, 0.2, 0);
    this.komaGroup.add(this.komaLight);
    
    // Procedural Shinto Contact Shadow beneath KOMA
    if (!this.komaShadow) {
      const shadowGeo = new THREE.PlaneGeometry(0.72, 0.72);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: this.textures.contactShadow,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
      });
      this.komaShadow = new THREE.Mesh(shadowGeo, shadowMat);
      this.komaShadow.rotation.x = -Math.PI / 2;
      this.komaShadow.position.y = 0.455;
      this.worldGroup.add(this.komaShadow);
    }
    
    this.worldGroup.add(this.komaGroup);
  }

  setKomaSkin(skinId) {
    if (!this.komaGroup) {
      this.buildKomaModel(skinId);
      return;
    }
    const currentPos = this.komaGroup.position.clone();
    const currentRotY = this.komaGroup.rotation.y;
    this.worldGroup.remove(this.komaGroup);
    this.disposeHierarchy(this.komaGroup);
    this.komaEyes = [];
    this.komaHalo = null;
    this.komaEarMeshes = [];
    this.buildKomaModel(skinId);
    this.komaGroup.position.copy(currentPos);
    this.komaGroup.rotation.y = currentRotY;
  }

  buildSakuraTree(seed = 0) {
    const treeGroup = new THREE.Group();
    
    // Twisted dark wooden trunk
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x422a1d,
      roughness: 0.9,
      metalness: 0.05
    });
    
    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.22, 1.1, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.55;
    trunk.rotation.z = ((seed % 3) - 1) * 0.08;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    // Branches
    const branchGeo = new THREE.CylinderGeometry(0.06, 0.1, 0.6, 6);
    const b1 = new THREE.Mesh(branchGeo, trunkMat);
    b1.position.set(-0.16, 0.85, 0.1);
    b1.rotation.z = 0.65;
    b1.castShadow = true;
    treeGroup.add(b1);
    
    const b2 = new THREE.Mesh(branchGeo, trunkMat);
    b2.position.set(0.18, 0.9, -0.08);
    b2.rotation.z = -0.6;
    b2.castShadow = true;
    treeGroup.add(b2);
    
    // Fluffy Multi-Tier Sakura Canopy
    const pinkColors = [0xff8eb8, 0xff6b9d, 0xffa5c5, 0xff4f87, 0xffd2e4];
    const baseColor = pinkColors[seed % pinkColors.length];
    const foliageMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.75,
      metalness: 0.05
    });
    
    const clusterPositions = [
      { x: 0, y: 1.35, z: 0, r: 0.52 },
      { x: -0.32, y: 1.25, z: 0.18, r: 0.42 },
      { x: 0.35, y: 1.28, z: -0.15, r: 0.44 },
      { x: 0.12, y: 1.48, z: 0.22, r: 0.38 },
      { x: -0.18, y: 1.45, z: -0.22, r: 0.36 }
    ];
    
    clusterPositions.forEach((pos, idx) => {
      const fGeo = new THREE.DodecahedronGeometry(pos.r, 2);
      const fMesh = new THREE.Mesh(fGeo, foliageMat);
      fMesh.position.set(pos.x, pos.y, pos.z);
      fMesh.castShadow = true;
      fMesh.receiveShadow = true;
      treeGroup.add(fMesh);
    });
    
    treeGroup.userData = { isTree: true, swayOffset: seed };
    return treeGroup;
  }

  buildPineTree(seed = 0, isSnow = false) {
    const pineGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.9,
      metalness: 0.05
    });

    // Leaning, sculpted Niwaki bonsai trunk
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 1.1, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 0.55, 0);
    trunk.rotation.z = 0.15;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    pineGroup.add(trunk);

    const branchGeo = new THREE.CylinderGeometry(0.05, 0.09, 0.5, 6);
    const b1 = new THREE.Mesh(branchGeo, trunkMat);
    b1.position.set(-0.2, 0.75, 0.05);
    b1.rotation.z = 0.75;
    pineGroup.add(b1);

    const b2 = new THREE.Mesh(branchGeo, trunkMat);
    b2.position.set(0.22, 0.88, -0.05);
    b2.rotation.z = -0.7;
    pineGroup.add(b2);

    // Sculpted Cloud-Pine Needle Pads (Niwaki clouds)
    const pineMat = new THREE.MeshStandardMaterial({
      color: isSnow ? 0x13381e : 0x1b4324,
      roughness: 0.85,
      metalness: 0.02
    });

    const pads = [
      { x: 0.08, y: 1.25, z: 0, rx: 0.45, rz: 0.4, h: 0.18 },
      { x: -0.38, y: 0.95, z: 0.1, rx: 0.35, rz: 0.32, h: 0.15 },
      { x: 0.4, y: 1.05, z: -0.1, rx: 0.38, rz: 0.35, h: 0.16 },
      { x: -0.1, y: 1.42, z: 0.05, rx: 0.3, rz: 0.28, h: 0.14 }
    ];

    pads.forEach(p => {
      const padGeo = new THREE.CylinderGeometry(p.rx, p.rx * 1.1, p.h, 10);
      const pad = new THREE.Mesh(padGeo, pineMat);
      pad.position.set(p.x, p.y, p.z);
      pad.castShadow = true;
      pad.receiveShadow = true;
      pineGroup.add(pad);

      // Authentic Japanese Winter Yukizuri snow dusting on pine clouds
      if (isSnow && this.sharedSnowPatchMat) {
        const snowPadGeo = new THREE.CylinderGeometry(p.rx * 0.82, p.rx * 0.98, 0.045, 10);
        const snowPad = new THREE.Mesh(snowPadGeo, this.sharedSnowPatchMat);
        snowPad.position.set(p.x, p.y + p.h * 0.5 + 0.02, p.z);
        pineGroup.add(snowPad);
      }
    });

    pineGroup.userData = { isTree: true, swayOffset: seed + 2 };
    return pineGroup;
  }

  buildMachiyaHouse(seed = 0) {
    const houseGroup = new THREE.Group();

    // 1. Foundation Plinth (dark stone base)
    const fGeo = new THREE.BoxGeometry(0.92, 0.2, 0.92);
    const fMat = new THREE.MeshStandardMaterial({ color: 0x2b303a, roughness: 0.8 });
    const fMesh = new THREE.Mesh(fGeo, fMat);
    fMesh.position.y = 0.1;
    fMesh.receiveShadow = true;
    fMesh.castShadow = true;
    houseGroup.add(fMesh);

    // 2. Timber Corner Posts & Beams
    const timberMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.7,
      metalness: 0.1
    });

    // 4 Corner Pillars
    const postGeo = new THREE.BoxGeometry(0.08, 0.75, 0.08);
    const postCoords = [
      [-0.41, 0.57, -0.41],
      [0.41, 0.57, -0.41],
      [-0.41, 0.57, 0.41],
      [0.41, 0.57, 0.41]
    ];
    postCoords.forEach(([px, py, pz]) => {
      const post = new THREE.Mesh(postGeo, timberMat);
      post.position.set(px, py, pz);
      post.castShadow = true;
      houseGroup.add(post);
    });

    // 3. Illuminated Shoji Paper Walls
    const shojiMat = new THREE.MeshStandardMaterial({
      map: this.textures.shoji,
      emissive: 0xffe6a3,
      emissiveIntensity: 0.45,
      roughness: 0.5
    });

    // Front & Back Wall
    const wallZGeo = new THREE.BoxGeometry(0.76, 0.68, 0.04);
    const wFront = new THREE.Mesh(wallZGeo, shojiMat);
    wFront.position.set(0, 0.55, 0.4);
    houseGroup.add(wFront);

    const wBack = new THREE.Mesh(wallZGeo, shojiMat);
    wBack.position.set(0, 0.55, -0.4);
    houseGroup.add(wBack);

    // Left & Right Wall
    const wallXGeo = new THREE.BoxGeometry(0.04, 0.68, 0.76);
    const wLeft = new THREE.Mesh(wallXGeo, shojiMat);
    wLeft.position.set(-0.4, 0.55, 0);
    houseGroup.add(wLeft);

    const wRight = new THREE.Mesh(wallXGeo, shojiMat);
    wRight.position.set(0.4, 0.55, 0);
    houseGroup.add(wRight);

    // 4. Overhanging Curved Kawara Roof (Hip-and-gable)
    const roofMat = new THREE.MeshStandardMaterial({
      map: this.textures.roofTile,
      roughness: 0.5,
      metalness: 0.2
    });

    // Lower Roof Tier
    const lowerRoofGeo = new THREE.ConeGeometry(0.72, 0.42, 4);
    const lowerRoof = new THREE.Mesh(lowerRoofGeo, roofMat);
    lowerRoof.position.y = 1.05;
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.4, 0.65, 1.4);
    lowerRoof.castShadow = true;
    lowerRoof.receiveShadow = true;
    houseGroup.add(lowerRoof);

    // Upper Ridge Eaves
    const ridgeGeo = new THREE.BoxGeometry(0.95, 0.08, 0.12);
    const ridge = new THREE.Mesh(ridgeGeo, timberMat);
    ridge.position.y = 1.2;
    ridge.castShadow = true;
    houseGroup.add(ridge);

    // Golden Ridge Ornaments (Onigawara finials)
    const finialGeo = new THREE.ConeGeometry(0.06, 0.14, 4);
    const finialMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.6 });
    const f1 = new THREE.Mesh(finialGeo, finialMat);
    f1.position.set(-0.46, 1.24, 0);
    houseGroup.add(f1);
    const f2 = new THREE.Mesh(finialGeo, finialMat);
    f2.position.set(0.46, 1.24, 0);
    houseGroup.add(f2);

    // 5. Hanging Paper Lantern (Chochin)
    const lanternGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.16, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xff3b30,
      emissive: 0xff3b30,
      emissiveIntensity: 0.85
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0.3, 0.72, 0.48);
    houseGroup.add(lantern);

    return houseGroup;
  }

  buildGardenPavilion(seed = 0) {
    const pavGroup = new THREE.Group();

    // 1. Raised Wood Deck
    const deckGeo = new THREE.BoxGeometry(0.9, 0.16, 0.9);
    const deckMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.7
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.08;
    deck.receiveShadow = true;
    deck.castShadow = true;
    pavGroup.add(deck);

    // Tatami Inset
    const tatamiGeo = new THREE.BoxGeometry(0.74, 0.02, 0.74);
    const tatamiMat = new THREE.MeshStandardMaterial({ color: 0x8a9a5b, roughness: 0.8 });
    const tatami = new THREE.Mesh(tatamiGeo, tatamiMat);
    tatami.position.y = 0.17;
    pavGroup.add(tatami);

    // 2. Four Open Corner Pillars
    const postGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.9, 8);
    const postMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.6
    });
    const coords = [
      [-0.38, 0.55, -0.38],
      [0.38, 0.55, -0.38],
      [-0.38, 0.55, 0.38],
      [0.38, 0.55, 0.38]
    ];
    coords.forEach(([px, py, pz]) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, py, pz);
      post.castShadow = true;
      pavGroup.add(post);
    });

    // 3. Sweeping Pagoda Roof
    const roofMat = new THREE.MeshStandardMaterial({
      map: this.textures.roofTile,
      roughness: 0.5,
      metalness: 0.2
    });
    const roofGeo = new THREE.ConeGeometry(0.75, 0.45, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.15;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.4, 0.7, 1.4);
    roof.castShadow = true;
    roof.receiveShadow = true;
    pavGroup.add(roof);

    // Hanging Bell / Lantern in Pavilion Center (emissive material provides glow)
    const lanternGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.2
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 0.8, 0);
    pavGroup.add(lantern);

    return pavGroup;
  }

  buildBambooFence(direction = "H") {
    const fenceGroup = new THREE.Group();
    const bamMat = new THREE.MeshStandardMaterial({
      map: this.textures.bamboo,
      roughness: 0.5
    });

    // Upright Bamboo Posts
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8);
    const p1 = new THREE.Mesh(postGeo, bamMat);
    p1.position.set(direction === "H" ? -0.42 : 0, 0.27, direction === "H" ? 0 : -0.42);
    p1.castShadow = true;
    fenceGroup.add(p1);

    const p2 = new THREE.Mesh(postGeo, bamMat);
    p2.position.set(direction === "H" ? 0.42 : 0, 0.27, direction === "H" ? 0 : 0.42);
    p2.castShadow = true;
    fenceGroup.add(p2);

    const pMid = new THREE.Mesh(postGeo, bamMat);
    pMid.position.set(0, 0.27, 0);
    pMid.castShadow = true;
    fenceGroup.add(pMid);

    // Horizontal Rails
    const railGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.94, 8);
    const rTop = new THREE.Mesh(railGeo, bamMat);
    if (direction === "H") {
      rTop.rotation.z = Math.PI / 2;
      rTop.position.set(0, 0.46, 0);
    } else {
      rTop.rotation.x = Math.PI / 2;
      rTop.position.set(0, 0.46, 0);
    }
    fenceGroup.add(rTop);

    const rBottom = new THREE.Mesh(railGeo, bamMat);
    if (direction === "H") {
      rBottom.rotation.z = Math.PI / 2;
      rBottom.position.set(0, 0.2, 0);
    } else {
      rBottom.rotation.x = Math.PI / 2;
      rBottom.position.set(0, 0.2, 0);
    }
    fenceGroup.add(rBottom);

    // Vertical Bamboo Slats (open lattice)
    const slatGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.48, 6);
    const slatOffsets = [-0.28, -0.14, 0.14, 0.28];
    slatOffsets.forEach(off => {
      const slat = new THREE.Mesh(slatGeo, bamMat);
      slat.position.set(direction === "H" ? off : 0, 0.24, direction === "H" ? 0 : off);
      slat.castShadow = true;
      fenceGroup.add(slat);
    });

    return fenceGroup;
  }

  buildStoneWall(direction = "H") {
    const wallGroup = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.textures.stoneWall,
      roughness: 0.8,
      metalness: 0.1
    });

    // Low ancient stone block (height 0.44)
    const blockGeo = new THREE.BoxGeometry(
      direction === "H" ? 0.94 : 0.28,
      0.44,
      direction === "H" ? 0.28 : 0.94
    );
    const block = new THREE.Mesh(blockGeo, wallMat);
    block.position.y = 0.22;
    block.castShadow = true;
    block.receiveShadow = true;
    wallGroup.add(block);

    // Coping Stone Cap
    const capGeo = new THREE.BoxGeometry(
      direction === "H" ? 0.96 : 0.32,
      0.06,
      direction === "H" ? 0.32 : 0.96
    );
    const capMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.46;
    cap.castShadow = true;
    wallGroup.add(cap);

    // Small Moss Tufts on wall top
    const mossTuftGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const mossTuftMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 });
    const m1 = new THREE.Mesh(mossTuftGeo, mossTuftMat);
    m1.scale.set(1.5, 0.5, 1.2);
    m1.position.set(direction === "H" ? -0.2 : 0, 0.5, direction === "H" ? 0 : -0.2);
    wallGroup.add(m1);

    return wallGroup;
  }

  buildWoodBridge(direction = "H") {
    const bridgeGroup = new THREE.Group();

    // Vermilion Lacquer Material
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xc93a2b,
      roughness: 0.4,
      metalness: 0.1
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      map: this.textures.wood,
      roughness: 0.7
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.3,
      metalness: 0.7
    });

    // 1. Arched Wooden Planks Deck (Walkable)
    const deckGeo = new THREE.BoxGeometry(
      direction === "H" ? 0.98 : 0.88,
      0.14,
      direction === "H" ? 0.88 : 0.98
    );
    const deck = new THREE.Mesh(deckGeo, redMat);
    deck.position.y = 0.32;
    deck.castShadow = true;
    deck.receiveShadow = true;
    bridgeGroup.add(deck);

    // Plank grooves
    const plankMat = new THREE.MeshStandardMaterial({ color: 0x8a2318, roughness: 0.6 });
    for (let i = -0.36; i <= 0.36; i += 0.18) {
      const lineGeo = new THREE.BoxGeometry(
        direction === "H" ? 0.02 : 0.86,
        0.02,
        direction === "H" ? 0.86 : 0.02
      );
      const line = new THREE.Mesh(lineGeo, plankMat);
      line.position.set(direction === "H" ? i : 0, 0.395, direction === "H" ? 0 : i);
      bridgeGroup.add(line);
    }

    // 2. Red Side Railings
    const railOffset = 0.41;
    const sides = [-railOffset, railOffset];
    sides.forEach(s => {
      // Top curved rail
      const railGeo = new THREE.BoxGeometry(
        direction === "H" ? 0.98 : 0.06,
        0.05,
        direction === "H" ? 0.06 : 0.98
      );
      const rail = new THREE.Mesh(railGeo, redMat);
      rail.position.set(direction === "H" ? 0 : s, 0.58, direction === "H" ? s : 0);
      rail.castShadow = true;
      bridgeGroup.add(rail);

      // Posts with Golden Giboshi Finials
      const postEnds = [-0.42, 0, 0.42];
      postEnds.forEach(p => {
        const postGeo = new THREE.BoxGeometry(0.06, 0.32, 0.06);
        const post = new THREE.Mesh(postGeo, darkWoodMat);
        post.position.set(direction === "H" ? p : s, 0.46, direction === "H" ? s : p);
        post.castShadow = true;
        bridgeGroup.add(post);

        // Golden Giboshi onion finial
        const finialGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const finial = new THREE.Mesh(finialGeo, goldMat);
        finial.position.set(direction === "H" ? p : s, 0.63, direction === "H" ? s : p);
        bridgeGroup.add(finial);
      });
    });

    return bridgeGroup;
  }

  buildGrassTile(posX, posZ, isSnow = false) {
    const tileGroup = new THREE.Group();
    // Reuses shared stone slab geometry and moss/snow material
    const grassMat = isSnow ? this.sharedSnowGrassMat : this.sharedMossMat;
    const slab = new THREE.Mesh(this.sharedStoneGeo, grassMat);
    slab.position.set(posX, 0.22, posZ);
    slab.receiveShadow = true;
    tileGroup.add(slab);
    return tileGroup;
  }

  buildRiverTile(posX, posZ, isSnow = false) {
    const riverGroup = new THREE.Group();

    // Sunken River Canal Bed
    const bedGeo = new THREE.BoxGeometry(0.94, 0.18, 0.94);
    const bedMat = new THREE.MeshStandardMaterial({ color: isSnow ? 0x223246 : 0x1a2634, roughness: 0.7 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(posX, 0.09, posZ);
    bed.receiveShadow = true;
    riverGroup.add(bed);

    // River Water Surface (or Frozen Glacier Ice in Fuji levels)
    const waterGeo = new THREE.PlaneGeometry(0.94, 0.94);
    const waterMat = new THREE.MeshStandardMaterial({
      color: isSnow ? 0x7dd3fc : 0x00f5ff,
      emissive: isSnow ? 0x38bdf8 : 0x005577,
      emissiveIntensity: isSnow ? 0.3 : 0.2,
      roughness: isSnow ? 0.08 : 0.1,
      metalness: isSnow ? 0.3 : 0.85,
      transparent: true,
      opacity: isSnow ? 0.92 : 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(posX, 0.16, posZ);
    water.receiveShadow = true;
    riverGroup.add(water);

    // River Pebbles / Stepping Stones
    const pebbleGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.6 });
    const p1 = new THREE.Mesh(pebbleGeo, pebbleMat);
    p1.scale.set(1.4, 0.4, 1.2);
    p1.position.set(posX + 0.2, 0.13, posZ - 0.2);
    riverGroup.add(p1);

    return riverGroup;
  }

  buildToriiGate(colorKey = "magenta") {
    const palette = COLOR_PALETTE[colorKey] || COLOR_PALETTE.magenta;
    const gateGroup = new THREE.Group();
    
    const lacquerMat = new THREE.MeshStandardMaterial({
      color: 0x1f0d2b,
      metalness: 0.4,
      roughness: 0.3
    });
    
    const neonMat = new THREE.MeshStandardMaterial({
      color: palette.neon,
      emissive: palette.neon,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });
    
    // 2 Vertical Pillars
    const pGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 12);
    const pLeft = new THREE.Mesh(pGeo, lacquerMat);
    pLeft.position.set(-0.42, 0.8, 0);
    pLeft.castShadow = true;
    gateGroup.add(pLeft);
    
    const pRight = new THREE.Mesh(pGeo, lacquerMat);
    pRight.position.set(0.42, 0.8, 0);
    pRight.castShadow = true;
    gateGroup.add(pRight);
    
    // Vertical Neon Stripes
    const stripeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
    const sLeft = new THREE.Mesh(stripeGeo, neonMat);
    sLeft.position.set(-0.42, 0.8, 0.09);
    gateGroup.add(sLeft);
    
    const sRight = new THREE.Mesh(stripeGeo, neonMat);
    sRight.position.set(0.42, 0.8, 0.09);
    gateGroup.add(sRight);
    
    // Top Horizontal Beams (Kasagi & Shimaki)
    const topBeamGeo = new THREE.BoxGeometry(1.22, 0.12, 0.2);
    const topBeam = new THREE.Mesh(topBeamGeo, lacquerMat);
    topBeam.position.set(0, 1.65, 0);
    topBeam.castShadow = true;
    gateGroup.add(topBeam);
    
    const lowerBeamGeo = new THREE.BoxGeometry(1.05, 0.08, 0.14);
    const lowerBeam = new THREE.Mesh(lowerBeamGeo, lacquerMat);
    lowerBeam.position.set(0, 1.42, 0);
    lowerBeam.castShadow = true;
    gateGroup.add(lowerBeam);
    
    // Center Sacred Tablet
    const tabGeo = new THREE.BoxGeometry(0.18, 0.22, 0.08);
    const tab = new THREE.Mesh(tabGeo, neonMat);
    tab.position.set(0, 1.42, 0.04);
    gateGroup.add(tab);
    
    // Energy Barrier Screen (Closed State)
    const barrierGeo = new THREE.PlaneGeometry(0.72, 1.35);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: palette.barrier,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 0.78, 0);
    gateGroup.add(barrier);
    
    gateGroup.userData = {
      color: colorKey,
      colors: palette,
      barrier: barrier,
      neonMats: [neonMat, barrierMat],
      isOpen: false
    };
    
    return gateGroup;
  }

  buildSwitchPad(colorKey = "cyan") {
    const palette = COLOR_PALETTE[colorKey] || COLOR_PALETTE.cyan;
    const swGroup = new THREE.Group();
    
    // Raised Stone Pad Base
    const baseGeo = new THREE.BoxGeometry(0.88, 0.12, 0.88);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x182c38,
      roughness: 0.4
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.06;
    base.receiveShadow = true;
    swGroup.add(base);
    
    // Glowing Circular Core with matching color
    const padGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.06, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: palette.pad,
      emissive: palette.pad,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.14;
    swGroup.add(pad);
    
    // Inner Ring
    const ringGeo = new THREE.TorusGeometry(0.22, 0.02, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18;
    swGroup.add(ring);
    
    swGroup.userData = {
      color: colorKey,
      colors: palette,
      padMat: padMat,
      isActive: false
    };
    
    return swGroup;
  }

  buildPortal(colorKey = "cyan") {
    const palette = COLOR_PALETTE[colorKey] || COLOR_PALETTE.cyan;
    const portalGroup = new THREE.Group();
    
    const baseGeo = new THREE.CylinderGeometry(0.44, 0.46, 0.08, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x15222e, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.04;
    portalGroup.add(base);
    
    const discGeo = new THREE.CircleGeometry(0.38, 32);
    const discMat = new THREE.MeshBasicMaterial({
      color: palette.hex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.085;
    portalGroup.add(disc);

    const ringGeo = new THREE.TorusGeometry(0.34, 0.025, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.09;
    portalGroup.add(ring);

    portalGroup.userData = { ring, disc };
    return portalGroup;
  }

  buildWindTileMarker(windDir = "N") {
    const group = new THREE.Group();

    // 1. Frost / Wind Glyph Base Pad
    const padGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.025, 20);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.2
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.012;
    pad.receiveShadow = true;
    group.add(pad);

    // 2. Directional Angle Mapping (facing direction)
    // N = -Z (angle 0), E = +X (angle -PI/2), S = +Z (angle PI), W = -X (angle PI/2)
    const angleMap = { N: 0, E: -Math.PI / 2, S: Math.PI, W: Math.PI / 2 };
    const rotY = angleMap[windDir] || 0;

    const arrowGroup = new THREE.Group();
    arrowGroup.rotation.y = rotY;

    // Wind Streamer Chevrons (pointing in gust direction)
    const chevronMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });

    for (let c = 0; c < 2; c++) {
      const zOffset = -0.06 - c * 0.14;
      const wingGeo = new THREE.BoxGeometry(0.18, 0.03, 0.04);
      
      const leftWing = new THREE.Mesh(wingGeo, chevronMat);
      leftWing.position.set(-0.065, 0.03, zOffset + 0.04);
      leftWing.rotation.y = Math.PI / 4;
      arrowGroup.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, chevronMat);
      rightWing.position.set(0.065, 0.03, zOffset + 0.04);
      rightWing.rotation.y = -Math.PI / 4;
      arrowGroup.add(rightWing);
    }

    // Central gust spine
    const spineGeo = new THREE.BoxGeometry(0.04, 0.03, 0.32);
    const spine = new THREE.Mesh(spineGeo, chevronMat);
    spine.position.set(0, 0.03, 0.02);
    arrowGroup.add(spine);

    group.add(arrowGroup);

    // 3. Floating Swirling Wind Wisp Ring (animates in render loop)
    const ringGeo = new THREE.TorusGeometry(0.34, 0.015, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;
    group.add(ring);

    group.userData = {
      spinRing: ring,
      arrowGroup: arrowGroup,
      windDir: windDir
    };

    return group;
  }

  buildSpiritOrb() {
    const orbGroup = new THREE.Group();
    
    const orbGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xff70a6,
      emissive: 0xff70a6,
      emissiveIntensity: 1.6,
      roughness: 0.2
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 0.65;
    orbGroup.add(orb);

    const haloGeo = new THREE.TorusGeometry(0.28, 0.018, 8, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffd1dc });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 3;
    halo.position.y = 0.65;
    orbGroup.add(halo);

    orbGroup.userData = { orb, halo, isCollected: false };
    return orbGroup;
  }

  buildGoalBeacon() {
    const goalGroup = new THREE.Group();
    
    // Base Gold Shrine Pad
    const baseGeo = new THREE.BoxGeometry(0.9, 0.14, 0.9);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x5a3d1c,
      roughness: 0.35
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.07;
    base.receiveShadow = true;
    goalGroup.add(base);
    
    // Glowing Golden Circle
    const circleGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.08, 24);
    const circleMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0xffb703,
      emissiveIntensity: 1.4,
      roughness: 0.2
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.position.y = 0.16;
    goalGroup.add(circle);
    
    // Floating Golden Spirit Parcel / Delivery Target Icon
    const parcelGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const parcelMat = new THREE.MeshStandardMaterial({
      color: 0xffc43d,
      emissive: 0xff9f1c,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.2
    });
    const parcel = new THREE.Mesh(parcelGeo, parcelMat);
    parcel.position.y = 0.75;
    parcel.castShadow = true;
    goalGroup.add(parcel);
    
    // Concentric Orbiting Golden Ring
    const orbitRingGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 24);
    const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0xffe6a7 });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 4;
    orbitRing.position.y = 0.75;
    goalGroup.add(orbitRing);
    
    // Warm Golden Beacon Light
    const goalLight = new THREE.PointLight(0xffb703, 1.8, 3.5);
    goalLight.position.set(0, 0.8, 0);
    goalGroup.add(goalLight);
    
    goalGroup.userData = {
      parcel: parcel,
      orbitRing: orbitRing,
      light: goalLight
    };
    
    return goalGroup;
  }

  buildStoneLantern() {
    const lanternGroup = new THREE.Group();
    
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d4756, roughness: 0.8 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff9d3b });
    
    // Pedestal
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.15, 0.32), stoneMat);
    base.position.y = 0.075;
    base.castShadow = true;
    lanternGroup.add(base);
    
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.45, 8), stoneMat);
    post.position.y = 0.35;
    post.castShadow = true;
    lanternGroup.add(post);
    
    // Firebox with warm glow
    const firebox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), glowMat);
    firebox.position.y = 0.65;
    lanternGroup.add(firebox);
    
    // Roof (Kasa)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.2, 4), stoneMat);
    roof.position.y = 0.86;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    lanternGroup.add(roof);
    
    // Note: The glowing orange firebox provides self-illumination without an extra hardware PointLight pass
    return lanternGroup;
  }

  buildFragileTile(isFuji = false) {
    const group = new THREE.Group();

    // 1. Weathered Stone Slab with darker mossy tones
    const slabGeo = new THREE.BoxGeometry(0.94, 0.45, 0.94);
    const slabMat = new THREE.MeshStandardMaterial({
      color: isFuji ? 0x8294a5 : 0x485848,
      roughness: 0.88,
      metalness: 0.05
    });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.y = 0.22;
    slab.receiveShadow = true;
    group.add(slab);

    // 2. Visible Glowing Fractures / Cracks on top surface
    const crackMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.85
    });

    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.04), crackMat);
    c1.position.set(0.05, 0.452, -0.05);
    c1.rotation.y = 0.35;
    group.add(c1);

    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.035), crackMat);
    c2.position.set(-0.12, 0.452, 0.14);
    c2.rotation.y = -0.55;
    group.add(c2);

    const c3 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.03), crackMat);
    c3.position.set(0.18, 0.452, 0.12);
    c3.rotation.y = 0.85;
    group.add(c3);

    group.userData = { slab, crackMat, isFragile: true, state: "intact" };
    return group;
  }

  buildStoneBlock() {
    const group = new THREE.Group();

    // 1. Carved Sacred Stone Boulder
    const stoneGeo = new THREE.BoxGeometry(0.76, 0.74, 0.76);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x728394,
      roughness: 0.65,
      metalness: 0.15
    });
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.position.y = 0.38;
    stone.castShadow = true;
    stone.receiveShadow = true;
    group.add(stone);

    // 2. Shimenawa Sacred Straw Rope around middle perimeter
    const ropeGeo = new THREE.TorusGeometry(0.42, 0.032, 8, 24);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.9,
      metalness: 0.02
    });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.40;
    group.add(rope);

    // 3. Shide Paper Zigzags (4 hanging paper streamers)
    const shideMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const shideGeo = new THREE.BoxGeometry(0.08, 0.14, 0.02);
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    angles.forEach(ang => {
      const shide = new THREE.Mesh(shideGeo, shideMat);
      const rad = 0.40;
      shide.position.set(Math.cos(ang) * rad, 0.33, Math.sin(ang) * rad);
      shide.rotation.y = -ang;
      group.add(shide);
    });

    // 4. Sacred Kanji Inscription plate on top (磐 - Iwa)
    const topCapGeo = new THREE.BoxGeometry(0.38, 0.02, 0.38);
    const topCapMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.55,
      roughness: 0.2
    });
    const topCap = new THREE.Mesh(topCapGeo, topCapMat);
    topCap.position.y = 0.76;
    group.add(topCap);

    group.userData = { stone, rope, isBlock: true, isSunken: false };
    return group;
  }

  crackFragileTile(x, y) {
    const item = this.fragileMeshes[`${x},${y}`];
    if (!item || item.state !== "intact") return;
    item.state = "cracked";
    const mesh = item.obj;
    mesh.position.y = 0.18;
    mesh.rotation.x = (Math.random() - 0.5) * 0.08;
    mesh.rotation.z = (Math.random() - 0.5) * 0.08;
    if (mesh.userData && mesh.userData.crackMat) {
      mesh.userData.crackMat.color.setHex(0xff3300);
    }
  }

  collapseFragileTile(x, y, onComplete) {
    const item = this.fragileMeshes[`${x},${y}`];
    if (!item || item.state === "collapsed") {
      if (typeof onComplete === "function") onComplete();
      return;
    }
    item.state = "collapsed";
    const mesh = item.obj;
    const startY = mesh.position.y;
    const targetY = -1.4;
    const startTime = performance.now();
    const duration = 280;

    const animateCollapse = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      mesh.position.y = startY + (targetY - startY) * (progress * progress);
      mesh.rotation.x += 0.02;
      if (progress < 1) {
        requestAnimationFrame(animateCollapse);
      } else {
        mesh.visible = false;
        if (typeof onComplete === "function") onComplete();
      }
    };
    requestAnimationFrame(animateCollapse);
  }

  animateBlockPush(fromX, fromY, toX, toY, isWaterDestination, onComplete) {
    const item = this.blockMeshes[`${fromX},${fromY}`];
    if (!item) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const offsetX = (this.gridWidth - 1) / 2;
    const offsetZ = (this.gridHeight - 1) / 2;
    const startPos = item.obj.position.clone();
    const targetPos = new THREE.Vector3(
      (toX - offsetX) * this.tileSize,
      0.45,
      (toY - offsetZ) * this.tileSize
    );

    const startTime = performance.now();
    const duration = 260;

    const animateSlide = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 2);
      item.obj.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
      item.obj.position.z = startPos.z + (targetPos.z - startPos.z) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateSlide);
      } else {
        item.obj.position.copy(targetPos);
        delete this.blockMeshes[`${fromX},${fromY}`];

        if (isWaterDestination) {
          item.obj.position.y = 0.22;
          item.isSunken = true;
          this.blockMeshes[`${toX},${toY}`] = item;
          item.x = toX;
          item.y = toY;
          if (typeof onComplete === "function") onComplete();
        } else {
          this.blockMeshes[`${toX},${toY}`] = item;
          item.x = toX;
          item.y = toY;
          if (typeof onComplete === "function") onComplete();
        }
      }
    };
    requestAnimationFrame(animateSlide);
  }

  resetMechanics(levelData) {
    const offsetX = (this.gridWidth - 1) / 2;
    const offsetZ = (this.gridHeight - 1) / 2;

    if (this.fragileMeshes) {
      Object.values(this.fragileMeshes).forEach(item => {
        item.state = "intact";
        item.obj.visible = true;
        item.obj.position.y = 0.22;
        item.obj.rotation.set(0, 0, 0);
        if (item.obj.userData && item.obj.userData.crackMat) {
          item.obj.userData.crackMat.color.setHex(0xffaa00);
        }
      });
    }

    if (this.blockMeshes && levelData && levelData.blocks) {
      const allBlockObjs = Object.values(this.blockMeshes).map(b => b.obj);
      this.blockMeshes = {};
      levelData.blocks.forEach((bCoord, idx) => {
        const obj = allBlockObjs[idx];
        if (obj) {
          const posX = (bCoord[0] - offsetX) * this.tileSize;
          const posZ = (bCoord[1] - offsetZ) * this.tileSize;
          obj.position.set(posX, 0.45, posZ);
          obj.visible = true;
          this.blockMeshes[`${bCoord[0]},${bCoord[1]}`] = {
            x: bCoord[0],
            y: bCoord[1],
            initialX: bCoord[0],
            initialY: bCoord[1],
            obj: obj,
            isSunken: false
          };
        }
      });
    }
  }

  /**
   * Load and render a level into the 3D scene
   */
  loadLevel(levelData) {
    this.gridWidth = levelData.w;
    this.gridHeight = levelData.h;
    
    // 1. Recursive GPU disposal of previous level assets (avoids memory & VRAM leaks)
    this.disposeHierarchy(this.tilesGroup);
    this.disposeHierarchy(this.decorGroup);
    while (this.tilesGroup.children.length) this.tilesGroup.remove(this.tilesGroup.children[0]);
    while (this.decorGroup.children.length) this.decorGroup.remove(this.decorGroup.children[0]);
    
    this.gateMeshes = [];
    this.switchMeshes = [];
    this.toriiGateObjects = [];
    this.portalMeshes = [];
    this.orbMeshes = [];
    this.windMeshes = [];
    this.fragileMeshes = {};
    this.blockMeshes = {};
    this.goalMesh = null;

    // Apply Mount Fuji scenic background and alpine snowfall for Fuji levels
    const isFuji = (levelData.c && (levelData.c.includes("Fuji") || levelData.c.includes("Berg"))) || levelData.theme === "fuji";
    this.setFujiTheme(isFuji);
    
    // 2. Center offset: World origin (0,0) is center of grid
    const offsetX = (this.gridWidth - 1) / 2;
    const offsetZ = (this.gridHeight - 1) / 2;
    
    const isWall = (x, y) => (levelData.walls || []).some(w => w[0] === x && w[1] === y);
    const getGateDef = (x, y) => (levelData.gates || levelData.gate || []).find(g => g[0] === x && g[1] === y);
    const getSwitchDef = (x, y) => (levelData.sw || []).find(s => s[0] === x && s[1] === y);
    const isPortal = (x, y) => (levelData.portals || []).some(p => p[0] === x && p[1] === y);
    const isOrb = (x, y) => (levelData.orbs || []).some(o => o[0] === x && o[1] === y);
    const isGoal = (x, y) => levelData.g[0] === x && levelData.g[1] === y;
    const getBridgeDef = (x, y) => (levelData.bridges || []).find(b => b[0] === x && b[1] === y);
    const isGrass = (x, y) => (levelData.grass || []).some(g => g[0] === x && g[1] === y);
    const isRiver = (x, y) => (levelData.water || []).some(w => w[0] === x && w[1] === y);
    const isFragile = (x, y) => (levelData.fragile || []).some(f => f[0] === x && f[1] === y);
    
    // 3. Build each grid cell
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const posX = (x - offsetX) * this.tileSize;
        const posZ = (y - offsetZ) * this.tileSize;
        
        // --- Walkable & Interactive Tiles ---
        if (!isWall(x, y)) {
          const bridgeDef = getBridgeDef(x, y);
          if (bridgeDef) {
            // Vermilion Wooden Bridge across water
            const bDir = bridgeDef[2] || "H";
            const bridge = this.buildWoodBridge(bDir);
            bridge.position.set(posX, 0.22, posZ);
            this.tilesGroup.add(bridge);
          } else if (isFragile(x, y)) {
            // Fragile Stepping Stone sits in sunken river canal
            const river = this.buildRiverTile(posX, posZ, isFuji);
            this.tilesGroup.add(river);
          } else if (isRiver(x, y)) {
            // Open River / Water Canal
            const river = this.buildRiverTile(posX, posZ, isFuji);
            this.tilesGroup.add(river);
          } else if (isGrass(x, y)) {
            // Lush Green Moss / Alpine Frost Meadow Tile
            const grass = this.buildGrassTile(posX, posZ, isFuji);
            this.tilesGroup.add(grass);
          } else {
            // Standard Stone Path Slab (reusing shared geometry & material, frosty stone on Fuji)
            const tileMat = isFuji ? this.sharedSnowStoneMat : this.sharedStoneMat;
            const tile = new THREE.Mesh(this.sharedStoneGeo, tileMat);
            tile.position.set(posX, 0.22, posZ);
            tile.receiveShadow = true;
            this.tilesGroup.add(tile);
            
            if (isFuji) {
              // Procedural crisp snow patches on alternating path stones in Fuji levels
              if ((x + y) % 2 === 0 && this.sharedSnowPatchGeo) {
                const snowPatch = new THREE.Mesh(this.sharedSnowPatchGeo, this.sharedSnowPatchMat);
                snowPatch.position.set(posX, 0.455, posZ);
                this.tilesGroup.add(snowPatch);
              }
            } else {
              // Fallen Petals on random path tiles in summer levels
              if ((x * 3 + y * 7) % 5 === 0) {
                const petalMesh = new THREE.Mesh(this.sharedPetalGeo, this.sharedPetalMat);
                petalMesh.rotation.x = -Math.PI / 2;
                petalMesh.position.set(posX + 0.12, 0.46, posZ - 0.1);
                this.tilesGroup.add(petalMesh);
              }
            }
          }
        }
        
        // --- Wall / Obstacle Tiles (Diverse Japanese Garden Elements) ---
        if (isWall(x, y)) {
          const obsKey = `${x},${y}`;
          const explicitObs = levelData.obstacles ? (levelData.obstacles[obsKey] || levelData.obstacles[`${x}_${y}`]) : null;

          if (explicitObs === "house") {
            const house = this.buildMachiyaHouse(x + y * 5);
            house.position.set(posX, 0.22, posZ);
            this.decorGroup.add(house);
          } else if (explicitObs === "pavilion") {
            const pav = this.buildGardenPavilion(x + y);
            pav.position.set(posX, 0.22, posZ);
            this.decorGroup.add(pav);
          } else if (explicitObs === "fence" || explicitObs === "fence_h") {
            const fence = this.buildBambooFence("H");
            fence.position.set(posX, 0.22, posZ);
            this.decorGroup.add(fence);
          } else if (explicitObs === "fence_v") {
            const fence = this.buildBambooFence("V");
            fence.position.set(posX, 0.22, posZ);
            this.decorGroup.add(fence);
          } else if (explicitObs === "wall" || explicitObs === "wall_h") {
            const sw = this.buildStoneWall("H");
            sw.position.set(posX, 0.22, posZ);
            this.decorGroup.add(sw);
          } else if (explicitObs === "wall_v") {
            const sw = this.buildStoneWall("V");
            sw.position.set(posX, 0.22, posZ);
            this.decorGroup.add(sw);
          } else if (explicitObs === "pine") {
            const pine = this.buildPineTree(x + y, isFuji);
            pine.position.set(posX, 0, posZ);
            this.decorGroup.add(pine);
          } else if (explicitObs === "water" || explicitObs === "river" || isRiver(x, y)) {
            const river = this.buildRiverTile(posX, posZ, isFuji);
            this.decorGroup.add(river);
          } else if (explicitObs === "tree" || explicitObs === "sakura") {
            const tree = this.buildSakuraTree(x + y * 4);
            tree.position.set(posX, 0, posZ);
            this.decorGroup.add(tree);
          } else {
            // Intelligent procedural variation: No more "Baumwald"!
            const hasHNeighbor = isWall(x - 1, y) || isWall(x + 1, y);
            const hasVNeighbor = isWall(x, y - 1) || isWall(x, y + 1);
            const seed = (x * 7 + y * 13 + (levelData.w || 5)) % 100;

            if (levelData.w >= 6 && (x + y * 3) % 11 === 0 && x > 0 && x < this.gridWidth - 1 && y > 0 && y < this.gridHeight - 1) {
              // Machiya Townhouse with glowing Shoji screens
              const house = this.buildMachiyaHouse(x + y * 3);
              house.position.set(posX, 0.22, posZ);
              this.decorGroup.add(house);
            } else if (levelData.w >= 6 && (x * 3 + y * 5) % 19 === 0) {
              // Open Tea Garden Pavilion
              const pav = this.buildGardenPavilion(x + y);
              pav.position.set(posX, 0.22, posZ);
              this.decorGroup.add(pav);
            } else if ((hasHNeighbor || hasVNeighbor) && seed < 40) {
              // Low Bamboo Lattice Fence (Yotsume-Gaki)
              const dir = hasHNeighbor ? "H" : "V";
              const fence = this.buildBambooFence(dir);
              fence.position.set(posX, 0.22, posZ);
              this.decorGroup.add(fence);
            } else if ((hasHNeighbor || hasVNeighbor) && seed < 70) {
              // Ancient Low Stone Wall (Ishigaki)
              const dir = hasHNeighbor ? "H" : "V";
              const stoneWall = this.buildStoneWall(dir);
              stoneWall.position.set(posX, 0.22, posZ);
              this.decorGroup.add(stoneWall);
            } else if (seed < 86) {
              // Sculpted Cloud Pine (Niwaki, snow on Fuji)
              const pine = this.buildPineTree(x + y, isFuji);
              pine.position.set(posX, 0, posZ);
              this.decorGroup.add(pine);
            } else {
              // Accent Sakura Tree
              const tree = this.buildSakuraTree(x + y * 4);
              tree.position.set(posX, 0, posZ);
              this.decorGroup.add(tree);
            }
          }
        }
        
        // Gate -> Cyber-Torii Gate (with color)
        const gateDef = getGateDef(x, y);
        if (gateDef) {
          const gateColor = gateDef[2] || "magenta";
          const torii = this.buildToriiGate(gateColor);
          torii.position.set(posX, 0.45, posZ);
          this.decorGroup.add(torii);
          this.toriiGateObjects.push(torii);
          this.gateMeshes.push({ x: x, y: y, color: gateColor, obj: torii });
        }
        
        // Switch -> Raised Cyber Switch Pad (with color)
        const swDef = getSwitchDef(x, y);
        if (swDef) {
          const swColor = swDef[2] || "cyan";
          const swPad = this.buildSwitchPad(swColor);
          swPad.position.set(posX, 0.45, posZ);
          this.decorGroup.add(swPad);
          this.switchMeshes.push({ x: x, y: y, color: swColor, obj: swPad });
        }

        // Portal -> Kitsune Teleporter
        if (isPortal(x, y)) {
          const portal = this.buildPortal();
          portal.position.set(posX, 0.45, posZ);
          this.decorGroup.add(portal);
          this.portalMeshes.push({ x: x, y: y, obj: portal });
        }

        // Orb -> Spirit Lotus Orb
        if (isOrb(x, y)) {
          const orb = this.buildSpiritOrb();
          orb.position.set(posX, 0.45, posZ);
          this.decorGroup.add(orb);
          this.orbMeshes.push({ x: x, y: y, obj: orb });
        }

        // Wind Tile Marker (Windböen)
        const windDef = (levelData.winds || []).find(w => w[0] === x && w[1] === y);
        if (windDef) {
          const windMarker = this.buildWindTileMarker(windDef[2]);
          windMarker.position.set(posX, 0.455, posZ);
          this.tilesGroup.add(windMarker);
          this.windMeshes.push({ x: x, y: y, dir: windDef[2], obj: windMarker });
        }

        // Fragile Stepping Stone Tile
        if (isFragile(x, y)) {
          const fragileTile = this.buildFragileTile(isFuji);
          fragileTile.position.set(posX, 0, posZ);
          this.tilesGroup.add(fragileTile);
          this.fragileMeshes[`${x},${y}`] = { x: x, y: y, obj: fragileTile, state: "intact" };
        }

        // Sacred Pushable Stone Boulder
        const isBlock = (levelData.blocks || []).some(b => b[0] === x && b[1] === y);
        if (isBlock) {
          const stoneBlock = this.buildStoneBlock();
          stoneBlock.position.set(posX, 0.45, posZ);
          this.decorGroup.add(stoneBlock);
          this.blockMeshes[`${x},${y}`] = { x: x, y: y, initialX: x, initialY: y, obj: stoneBlock, isSunken: false };
        }
        
        // Goal -> Golden Shrine Beacon
        if (isGoal(x, y)) {
          const goal = this.buildGoalBeacon();
          goal.position.set(posX, 0.45, posZ);
          this.decorGroup.add(goal);
          this.goalMesh = goal;
        }
      }
    }
    
    // 4. Place Stone Lanterns on outer corners
    const corners = [
      { x: -offsetX - 0.9, z: -offsetZ - 0.9 },
      { x: offsetX + 0.9, z: -offsetZ - 0.9 },
      { x: -offsetX - 0.9, z: offsetZ + 0.9 },
      { x: offsetX + 0.9, z: offsetZ + 0.9 }
    ];
    corners.forEach(cor => {
      const lantern = this.buildStoneLantern();
      lantern.position.set(cor.x, 0, cor.z);
      this.decorGroup.add(lantern);
    });
    
    // 5. Position KOMA at start location
    this.setKomaInitialState(levelData.s[0], levelData.s[1], levelData.s[2]);
    
    // 6. Adjust Camera Zoom for grid size
    this.onResize();
  }

  gridToWorld(gx, gy) {
    const offsetX = (this.gridWidth - 1) / 2;
    const offsetZ = (this.gridHeight - 1) / 2;
    return new THREE.Vector3(
      (gx - offsetX) * this.tileSize,
      0.45, // surface of tile
      (gy - offsetZ) * this.tileSize
    );
  }

  dirToAngle(dir) {
    // Rotations around Y: Facing +Z (South) = 0, East = Math.PI/2, North = Math.PI, West = -Math.PI/2
    const map = {
      S: 0,
      E: Math.PI / 2,
      N: Math.PI,
      W: -Math.PI / 2
    };
    return map[dir] !== undefined ? map[dir] : 0;
  }

  setKomaInitialState(gx, gy, dir) {
    this.komaState.gridX = gx;
    this.komaState.gridY = gy;
    const worldPos = this.gridToWorld(gx, gy);
    this.komaState.currentPos.copy(worldPos);
    this.komaState.targetPos.copy(worldPos);
    this.komaState.startPos.copy(worldPos);
    
    const rotY = this.dirToAngle(dir);
    this.komaState.currentRotY = rotY;
    this.komaState.targetRotY = rotY;
    this.komaState.startRotY = rotY;
    
    this.komaState.isMoving = false;
    this.komaState.isRotating = false;
    this.komaState.isBumping = false;
    this.komaState.isCelebrating = false;
    this.komaState.isWindSliding = false;
    
    if (this.komaShadow) {
      this.komaShadow.position.set(worldPos.x, 0.455, worldPos.z);
      this.komaShadow.scale.set(1, 1, 1);
      this.komaShadow.material.opacity = 0.6;
    }
    
    if (this.komaGroup) {
      this.komaGroup.position.copy(worldPos);
      this.komaGroup.rotation.y = rotY;
    }
  }

  animateMove(gx, gy, duration = 300, onLanding = null) {
    const target = this.gridToWorld(gx, gy);
    this.komaState.gridX = gx;
    this.komaState.gridY = gy;
    this.komaState.startPos.copy(this.komaGroup.position);
    this.komaState.targetPos.copy(target);
    this.komaState.isMoving = true;
    this.komaState.isWindSliding = false;
    this.komaState.moveStartTime = performance.now();
    this.komaState.moveDuration = duration;
    this.komaState.onLanding = onLanding;
  }

  animateWindSlide(gx, gy, dir, onLanding = null) {
    const target = this.gridToWorld(gx, gy);
    this.komaState.gridX = gx;
    this.komaState.gridY = gy;
    this.komaState.startPos.copy(this.komaGroup.position);
    this.komaState.targetPos.copy(target);
    this.komaState.isWindSliding = true;
    this.komaState.isMoving = false;
    this.komaState.slideStartTime = performance.now();
    this.komaState.slideDuration = 260;
    this.komaState.slideDir = dir;
    this.komaState.onSlideLanding = onLanding;

    this.spawnWindTrail(this.komaState.startPos, target);
  }

  spawnWindTrail(from, to) {
    const dirVec = new THREE.Vector3().subVectors(to, from);
    const dist = dirVec.length();
    const normDir = dirVec.clone().normalize();

    for (let i = 0; i < 7; i++) {
      const pGeo = new THREE.PlaneGeometry(0.24, 0.05);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      
      const t = (i / 7) * dist;
      pMesh.position.copy(from).addScaledVector(normDir, t);
      pMesh.position.y += 0.28 + (Math.random() - 0.5) * 0.12;
      pMesh.position.x += (Math.random() - 0.5) * 0.2;
      pMesh.position.z += (Math.random() - 0.5) * 0.2;
      pMesh.lookAt(pMesh.position.clone().add(normDir));

      this.effectsGroup.add(pMesh);

      const startTime = performance.now();
      const duration = 300 + Math.random() * 120;
      this.dynamicEffects.push({
        mesh: pMesh,
        disposeGeo: true,
        disposeMat: true,
        startTime: startTime,
        duration: duration,
        update: (p) => {
          pMesh.position.addScaledVector(normDir, 0.02);
          pMat.opacity = 0.85 * (1 - p);
          pMesh.scale.x = 1.0 + p * 0.8;
        }
      });
    }
  }

  animateRotate(dir, duration = 220) {
    const target = this.dirToAngle(dir);
    this.komaState.startRotY = this.komaGroup.rotation.y;
    
    // Shortest angular difference
    let diff = (target - (this.komaState.startRotY % (Math.PI * 2))) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;
    
    this.komaState.targetRotY = this.komaState.startRotY + diff;
    this.komaState.isRotating = true;
    this.komaState.rotStartTime = performance.now();
    this.komaState.rotDuration = duration;
  }

  animateBump() {
    this.komaState.isBumping = true;
    this.komaState.bumpStartTime = performance.now();
    if (this.komaGroup) {
      const facePos = this.komaGroup.position.clone();
      facePos.y += 0.44;
      const dirAngle = this.komaGroup.rotation.y;
      facePos.x += Math.sin(dirAngle) * 0.32;
      facePos.z += Math.cos(dirAngle) * 0.32;
      for (let i = 0; i < 5; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b, transparent: true, opacity: 0.9 });
        const pMesh = new THREE.Mesh(this.sharedSparkGeo, pMat);
        pMesh.position.copy(facePos);
        this.effectsGroup.add(pMesh);
        const vx = (Math.random() - 0.5) * 0.035;
        const vy = Math.random() * 0.035 + 0.015;
        const vz = (Math.random() - 0.5) * 0.035;
        this.dynamicEffects.push({
          mesh: pMesh,
          disposeGeo: false,
          disposeMat: true,
          startTime: performance.now(),
          duration: 320,
          update: (p) => {
            pMesh.position.x += vx;
            pMesh.position.y += vy;
            pMesh.position.z += vz;
            pMesh.material.opacity = 0.9 * (1 - p);
          }
        });
      }
    }
  }

  spawnStepDust(worldX, worldZ) {
    const skin = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS[this.currentSkinId]) || null;
    const dustType = skin?.dustType || "default";
    const dustColor = skin?.materials?.dustColor ?? 0x98b5d5;

    // Base expanding shockwave ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: dustColor,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(this.sharedDustGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(worldX, 0.46, worldZ);
    this.effectsGroup.add(ring);

    this.dynamicEffects.push({
      mesh: ring,
      disposeGeo: false,
      disposeMat: true,
      startTime: performance.now(),
      duration: 320,
      update: (p) => {
        const s = 1 + p * 1.5;
        ring.scale.set(s, s, 1);
        ring.material.opacity = 0.65 * (1 - p);
      }
    });

    // Custom themed particles per skin
    if (dustType === "sakura") {
      // 3 floating pink cherry blossom petals
      for (let i = 0; i < 3; i++) {
        const petalGeo = new THREE.SphereGeometry(0.035, 6, 6);
        petalGeo.scale(1.2, 0.3, 0.8);
        const petalMat = new THREE.MeshBasicMaterial({ color: 0xffa5c5, transparent: true, opacity: 0.85 });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(worldX + (Math.random() - 0.5) * 0.35, 0.48, worldZ + (Math.random() - 0.5) * 0.35);
        petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        this.effectsGroup.add(petal);

        const vx = (Math.random() - 0.5) * 0.02;
        const vy = 0.02 + Math.random() * 0.02;
        const vz = (Math.random() - 0.5) * 0.02;

        this.dynamicEffects.push({
          mesh: petal,
          disposeGeo: true,
          disposeMat: true,
          startTime: performance.now(),
          duration: 450,
          update: (p) => {
            petal.position.x += vx;
            petal.position.y += vy;
            petal.position.z += vz;
            petal.rotation.y += 0.08;
            petal.material.opacity = 0.85 * (1 - p);
          }
        });
      }
    } else if (dustType === "cyber") {
      // 4 cyber glitch spark pixels
      for (let i = 0; i < 4; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f5ff : 0xdf6eff, transparent: true, opacity: 0.9 });
        const pMesh = new THREE.Mesh(this.sharedSparkGeo, pMat);
        pMesh.position.set(worldX + (Math.random() - 0.5) * 0.35, 0.48, worldZ + (Math.random() - 0.5) * 0.35);
        this.effectsGroup.add(pMesh);

        const vx = (Math.random() - 0.5) * 0.035;
        const vy = 0.03 + Math.random() * 0.03;
        const vz = (Math.random() - 0.5) * 0.035;

        this.dynamicEffects.push({
          mesh: pMesh,
          disposeGeo: false,
          disposeMat: true,
          startTime: performance.now(),
          duration: 350,
          update: (p) => {
            pMesh.position.x += vx;
            pMesh.position.y += vy;
            pMesh.position.z += vz;
            pMesh.material.opacity = 0.9 * (1 - p);
          }
        });
      }
    } else if (dustType === "fire") {
      // 3 glowing ember sparks
      for (let i = 0; i < 3; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff4d00 : 0xffbe0b, transparent: true, opacity: 0.9 });
        const pMesh = new THREE.Mesh(this.sharedSparkGeo, pMat);
        pMesh.position.set(worldX + (Math.random() - 0.5) * 0.3, 0.48, worldZ + (Math.random() - 0.5) * 0.3);
        this.effectsGroup.add(pMesh);

        const vx = (Math.random() - 0.5) * 0.02;
        const vy = 0.035 + Math.random() * 0.025;
        const vz = (Math.random() - 0.5) * 0.02;

        this.dynamicEffects.push({
          mesh: pMesh,
          disposeGeo: false,
          disposeMat: true,
          startTime: performance.now(),
          duration: 400,
          update: (p) => {
            pMesh.position.x += vx;
            pMesh.position.y += vy;
            pMesh.position.z += vz;
            pMesh.material.opacity = 0.9 * (1 - p);
          }
        });
      }
    } else if (dustType === "shadow") {
      // 3 purple shadow vapor orbs
      for (let i = 0; i < 3; i++) {
        const vaporGeo = new THREE.SphereGeometry(0.045, 6, 6);
        const vaporMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.7 });
        const vapor = new THREE.Mesh(vaporGeo, vaporMat);
        vapor.position.set(worldX + (Math.random() - 0.5) * 0.35, 0.48, worldZ + (Math.random() - 0.5) * 0.35);
        this.effectsGroup.add(vapor);

        const vx = (Math.random() - 0.5) * 0.015;
        const vy = 0.02 + Math.random() * 0.02;
        const vz = (Math.random() - 0.5) * 0.015;

        this.dynamicEffects.push({
          mesh: vapor,
          disposeGeo: true,
          disposeMat: true,
          startTime: performance.now(),
          duration: 400,
          update: (p) => {
            vapor.position.x += vx;
            vapor.position.y += vy;
            vapor.position.z += vz;
            const s = 1 + p * 1.2;
            vapor.scale.set(s, s, s);
            vapor.material.opacity = 0.7 * (1 - p);
          }
        });
      }
    } else if (dustType === "gold") {
      // 4 gold stardust sparkles
      for (let i = 0; i < 4; i++) {
        const pMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffd700 : 0x00f5d4, transparent: true, opacity: 0.95 });
        const pMesh = new THREE.Mesh(this.sharedSparkGeo, pMat);
        pMesh.position.set(worldX + (Math.random() - 0.5) * 0.35, 0.48, worldZ + (Math.random() - 0.5) * 0.35);
        this.effectsGroup.add(pMesh);

        const vx = (Math.random() - 0.5) * 0.025;
        const vy = 0.03 + Math.random() * 0.03;
        const vz = (Math.random() - 0.5) * 0.025;

        this.dynamicEffects.push({
          mesh: pMesh,
          disposeGeo: false,
          disposeMat: true,
          startTime: performance.now(),
          duration: 450,
          update: (p) => {
            pMesh.position.x += vx;
            pMesh.position.y += vy;
            pMesh.position.z += vz;
            pMesh.material.opacity = 0.95 * (1 - p);
          }
        });
      }
    }
  }

  spawnGateSparks(worldX, worldZ) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const mat = i % 2 === 0 ? this.sharedMagentaSparkMat : this.sharedCyanSparkMat;
      const spark = new THREE.Mesh(this.sharedSparkGeo, mat);
      spark.position.set(worldX + (Math.random() - 0.5) * 0.7, 0.7 + Math.random() * 0.4, worldZ + (Math.random() - 0.5) * 0.7);
      this.effectsGroup.add(spark);

      const vx = (Math.random() - 0.5) * 0.04;
      const vy = Math.random() * 0.04 + 0.03;
      const vz = (Math.random() - 0.5) * 0.04;

      this.dynamicEffects.push({
        mesh: spark,
        disposeGeo: false,
        disposeMat: false,
        startTime: performance.now(),
        duration: 450 + Math.random() * 150,
        update: (p) => {
          spark.position.x += vx;
          spark.position.y += vy;
          spark.position.z += vz;
          spark.scale.setScalar(Math.max(0, 1 - p));
        }
      });
    }
  }

  spawnPortalSparks(worldX, worldZ, colorHex = 0x00f5ff) {
    const count = 16;
    const mat = colorHex === 0xdf6eff ? this.sharedMagentaSparkMat : this.sharedCyanSparkMat;
    for (let i = 0; i < count; i++) {
      const spark = new THREE.Mesh(this.sharedSparkGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.15 + Math.random() * 0.25;
      spark.position.set(worldX + Math.cos(angle) * radius, 0.5, worldZ + Math.sin(angle) * radius);
      this.effectsGroup.add(spark);

      const vy = Math.random() * 0.05 + 0.04;
      this.dynamicEffects.push({
        mesh: spark,
        disposeGeo: false,
        disposeMat: false,
        startTime: performance.now(),
        duration: 450 + Math.random() * 150,
        update: (p) => {
          spark.position.y += vy;
          spark.rotation.y += 0.1;
          spark.scale.setScalar(Math.max(0, 1 - p));
        }
      });
    }
  }

  spawnOrbSparks(worldX, worldZ) {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const mat = i % 2 === 0 ? this.sharedPinkSparkMat : this.sharedGoldSparkMat;
      const spark = new THREE.Mesh(this.sharedSparkGeo, mat);
      spark.position.set(worldX + (Math.random() - 0.5) * 0.4, 0.65 + Math.random() * 0.3, worldZ + (Math.random() - 0.5) * 0.4);
      this.effectsGroup.add(spark);

      const vx = (Math.random() - 0.5) * 0.05;
      const vy = Math.random() * 0.05 + 0.03;
      const vz = (Math.random() - 0.5) * 0.05;

      this.dynamicEffects.push({
        mesh: spark,
        disposeGeo: false,
        disposeMat: false,
        startTime: performance.now(),
        duration: 500 + Math.random() * 150,
        update: (p) => {
          spark.position.x += vx;
          spark.position.y += vy;
          spark.position.z += vz;
          spark.scale.setScalar(Math.max(0, 1 - p));
        }
      });
    }
  }

  animateTeleport(destGridX, destGridY) {
    const worldX = (destGridX - (this.gridWidth - 1) / 2) * this.tileSize;
    const worldZ = (destGridY - (this.gridHeight - 1) / 2) * this.tileSize;
    
    this.spawnPortalSparks(this.komaGroup.position.x, this.komaGroup.position.z, 0x00f5ff);
    
    this.komaState.targetPos.set(worldX, 0.58, worldZ);
    this.komaGroup.position.copy(this.komaState.targetPos);
    
    this.spawnPortalSparks(worldX, worldZ, 0xdf6eff);
  }

  collectOrb(x, y) {
    const orbItem = this.orbMeshes.find(o => o.x === x && o.y === y);
    if (orbItem && orbItem.obj.visible) {
      orbItem.obj.visible = false;
      this.spawnOrbSparks(orbItem.obj.position.x, orbItem.obj.position.z);
    }
  }

  resetOrbs() {
    this.orbMeshes.forEach(o => {
      o.obj.visible = true;
    });
  }

  setGateOpen(targetColorOrOpen, maybeIsOpen) {
    let targetColor = null;
    let isOpen = true;
    if (typeof targetColorOrOpen === "boolean") {
      isOpen = targetColorOrOpen;
    } else if (typeof targetColorOrOpen === "string") {
      targetColor = targetColorOrOpen;
      isOpen = maybeIsOpen !== undefined ? maybeIsOpen : true;
    }

    this.toriiGateObjects.forEach(gate => {
      if (!targetColor || targetColor === "all" || gate.userData.color === targetColor) {
        gate.userData.isOpen = isOpen;
        if (gate.userData.barrier) {
          gate.userData.barrier.visible = !isOpen;
        }
        if (gate.userData.light) {
          const activeHex = (gate.userData.colors && gate.userData.colors.lightActive) || 0xffffff;
          const closedHex = (gate.userData.colors && gate.userData.colors.lightClosed) || 0xdf6eff;
          gate.userData.light.color.setHex(isOpen ? activeHex : closedHex);
          gate.userData.light.intensity = isOpen ? 0.8 : 1.6;
        }
        if (isOpen) {
          this.spawnGateSparks(gate.position.x, gate.position.z);
        }
      }
    });
  }

  setSwitchActive(colorOrActive, maybeActive) {
    let targetColor = null;
    let isActive = true;
    if (typeof colorOrActive === "boolean") {
      isActive = colorOrActive;
    } else if (typeof colorOrActive === "string") {
      targetColor = colorOrActive;
      isActive = maybeActive !== undefined ? maybeActive : true;
    }

    this.switchMeshes.forEach(sw => {
      if (!targetColor || targetColor === "all" || sw.color === targetColor) {
        sw.obj.userData.isActive = isActive;
        if (sw.obj.userData.padMat) {
          sw.obj.userData.padMat.emissiveIntensity = isActive ? 2.5 : 1.2;
        }
        if (sw.obj.userData.swLight) {
          sw.obj.userData.swLight.intensity = isActive ? 2.8 : 1.4;
        }
      }
    });
  }

  spawnCelebrationBurst() {
    if (!this.komaGroup) return;
    const origin = this.komaGroup.position.clone();
    origin.y += 0.5;

    // 1. Golden Shinto stars & Kami sparks
    for (let i = 0; i < 28; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffd700 : (i % 3 === 0 ? 0xff85b8 : 0x00f5ff),
        transparent: true,
        opacity: 0.95
      });
      const pMesh = new THREE.Mesh(this.sharedSparkGeo, pMat);
      pMesh.position.copy(origin);
      this.effectsGroup.add(pMesh);

      const angle = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speedH = 0.035 + Math.random() * 0.045;
      const vx = Math.cos(angle) * speedH;
      const vy = 0.06 + Math.random() * 0.05;
      const vz = Math.sin(angle) * speedH;

      this.dynamicEffects.push({
        mesh: pMesh,
        disposeGeo: false,
        disposeMat: true,
        startTime: performance.now(),
        duration: 900 + Math.random() * 300,
        update: (p) => {
          pMesh.position.x += vx;
          pMesh.position.y += vy - p * 0.09;
          pMesh.position.z += vz;
          pMesh.rotation.y += 0.12;
          pMesh.rotation.x += 0.08;
          pMesh.material.opacity = 0.95 * (1 - p);
          const s = 1.2 * (1 - p * 0.5);
          pMesh.scale.set(s, s, s);
        }
      });
    }

    // 2. Swirling celebratory sakura petals
    for (let i = 0; i < 16; i++) {
      const petalGeo = new THREE.SphereGeometry(0.04, 6, 6);
      petalGeo.scale(1.3, 0.35, 0.85);
      const petalMat = new THREE.MeshBasicMaterial({
        color: 0xffa5c5,
        transparent: true,
        opacity: 0.9
      });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.copy(origin);
      this.effectsGroup.add(petal);

      const angle = Math.random() * Math.PI * 2;
      const speedH = 0.02 + Math.random() * 0.035;
      const vx = Math.cos(angle) * speedH;
      const vy = 0.04 + Math.random() * 0.04;
      const vz = Math.sin(angle) * speedH;

      this.dynamicEffects.push({
        mesh: petal,
        disposeGeo: true,
        disposeMat: true,
        startTime: performance.now(),
        duration: 1100 + Math.random() * 400,
        update: (p) => {
          petal.position.x += vx + Math.sin(p * 8) * 0.01;
          petal.position.y += vy - p * 0.06;
          petal.position.z += vz + Math.cos(p * 8) * 0.01;
          petal.rotation.x += 0.07;
          petal.rotation.y += 0.1;
          petal.material.opacity = 0.9 * (1 - p);
        }
      });
    }
  }

  enterHomeScreenMode() {
    this.isHomeScreenMode = true;
    if (this.komaGroup) {
      if (!this.savedLevelKomaPos) {
        this.savedLevelKomaPos = this.komaGroup.position.clone();
      }
      this.savedLevelKomaRotY = this.komaGroup.rotation.y;
    }
    // Set showroom camera distance and smooth elevation
    this.savedOrbitAzimuth = this.orbit.targetAzimuth;
    this.savedOrbitElevation = this.orbit.targetElevation;
    this.savedOrbitDistance = this.orbit.distance;

    this.orbit.targetElevation = 0.38;
    this.orbit.elevation = 0.38;
    this.orbit.distance = 28;
    this.updateCameraPosition();

    // Position KOMA exactly inside the showroom stage
    this.alignKomaToShowroom();
  }

  alignKomaToShowroom() {
    if (!this.komaGroup || !this.camera) return;
    const stage = document.getElementById("showroomRobotStage");
    if (stage) {
      const rect = stage.getBoundingClientRect();
      const screenW = window.innerWidth || 800;
      const screenH = window.innerHeight || 600;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.65;
      
      const ndcX = (centerX / screenW) * 2 - 1;
      const ndcY = -(centerY / screenH) * 2 + 1;

      // Unproject NDC point into world space
      const v = new THREE.Vector3(ndcX, ndcY, 0.5);
      v.unproject(this.camera);

      // Camera ray direction
      const rayDir = new THREE.Vector3();
      this.camera.getWorldDirection(rayDir);

      // We want the point on the ray that intersects the horizontal plane Y = 0.45
      const planeY = 0.45;
      const t = (planeY - v.y) / rayDir.y;
      const pos = v.clone().add(rayDir.clone().multiplyScalar(t));

      this.homeScreenKomaY = planeY;
      this.homeScreenKomaPos = pos.clone();
      this.komaGroup.position.copy(pos);
    } else {
      this.komaGroup.position.set(0, 0.45, 0);
    }
  }

  exitHomeScreenMode() {
    this.isHomeScreenMode = false;
    this.homeScreenKomaPos = null;
    if (this.komaGroup && this.savedLevelKomaPos) {
      this.komaGroup.position.copy(this.savedLevelKomaPos);
      this.komaGroup.rotation.y = this.savedLevelKomaRotY || 0;
      this.savedLevelKomaPos = null;
    }
    if (this.savedOrbitElevation !== undefined) {
      this.orbit.targetElevation = this.savedOrbitElevation;
      this.orbit.targetAzimuth = this.savedOrbitAzimuth;
      this.orbit.distance = this.savedOrbitDistance || this.defaultOrbit.distance;
      this.updateCameraPosition();
    }
  }

  animateWin() {
    this.komaState.isCelebrating = true;
    this.spawnCelebrationBurst();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();
    const now = performance.now();
    const cappedDelta = Math.min(delta, 0.05);
    
    // Smooth camera orbit interpolation (frame-rate independent, zero updates when stationary)
    const azDiff = this.orbit.targetAzimuth - this.orbit.azimuth;
    const elDiff = this.orbit.targetElevation - this.orbit.elevation;
    if (Math.abs(azDiff) > 0.0002 || Math.abs(elDiff) > 0.0002) {
      const camLerp = 1 - Math.exp(-14 * cappedDelta);
      this.orbit.azimuth += azDiff * camLerp;
      this.orbit.elevation += elDiff * camLerp;
      this.updateCameraPosition();
    }

    // Dynamic effects (step dust, gate sparks)
    for (let i = this.dynamicEffects.length - 1; i >= 0; i--) {
      const eff = this.dynamicEffects[i];
      const p = Math.min((now - eff.startTime) / eff.duration, 1);
      eff.update(p);
      if (p >= 1) {
        this.effectsGroup.remove(eff.mesh);
        if (eff.disposeGeo && eff.mesh.geometry) eff.mesh.geometry.dispose();
        if (eff.disposeMat && eff.mesh.material) eff.mesh.material.dispose();
        this.dynamicEffects.splice(i, 1);
      }
    }
    
    // 1. KOMA Movement Interpolation & Juicy Physics
    let scaleX = 1.0;
    let scaleY = 1.0;
    let scaleZ = 1.0;
    let earTwitchX = 0;
    let earTwitchZ = 0;

    if (this.isHomeScreenMode && this.komaGroup) {
      // Showroom 360-degree turntable continuous rotation
      this.komaGroup.rotation.y += delta * 0.65;
      const hoverY = Math.sin(time * 2.5) * 0.038;
      if (this.homeScreenKomaPos) {
        this.komaGroup.position.x = this.homeScreenKomaPos.x;
        this.komaGroup.position.z = this.homeScreenKomaPos.z;
        this.komaGroup.position.y = this.homeScreenKomaPos.y + hoverY;
      } else {
        this.komaGroup.position.y = (this.homeScreenKomaY || 0.45) + hoverY;
      }
      
      const breathe = Math.sin(time * 2.2) * 0.02;
      scaleY += breathe;
      scaleX -= breathe * 0.5;
      scaleZ -= breathe * 0.5;
    } else if (this.komaState.isMoving) {
      const elapsed = now - this.komaState.moveStartTime;
      const progress = Math.min(elapsed / this.komaState.moveDuration, 1);
      
      // Smooth easeInOutCubic
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      this.komaGroup.position.lerpVectors(this.komaState.startPos, this.komaState.targetPos, ease);
      
      // Hop arc (jumping slightly off ground while stepping)
      const hopHeight = Math.sin(progress * Math.PI) * 0.24;
      this.komaGroup.position.y = this.komaState.targetPos.y + hopHeight;

      // Squash & Stretch: Stretch while rising, squash before landing
      const hopStretch = Math.sin(progress * Math.PI);
      scaleY += hopStretch * 0.14;
      scaleX -= hopStretch * 0.07;
      scaleZ -= hopStretch * 0.07;

      // Wind resistance tilts ears/accessories back dynamically
      earTwitchX = -hopStretch * 0.22;
      
      if (progress >= 1) {
        this.komaState.isMoving = false;
        this.komaGroup.position.copy(this.komaState.targetPos);
        this.komaState.landingBounce = 1.0; // Trigger juicy impact squash
        this.spawnStepDust(this.komaState.targetPos.x, this.komaState.targetPos.z);
        if (typeof this.komaState.onLanding === "function") {
          const cb = this.komaState.onLanding;
          this.komaState.onLanding = null;
          cb();
        }
      }
    } else if (this.komaState.isWindSliding) {
      const elapsed = now - this.komaState.slideStartTime;
      const progress = Math.min(elapsed / this.komaState.slideDuration, 1);
      const ease = progress * (2 - progress); // Smooth quad ease-out
      this.komaGroup.position.lerpVectors(this.komaState.startPos, this.komaState.targetPos, ease);

      // Low glide hover
      const hover = Math.sin(progress * Math.PI) * 0.08;
      this.komaGroup.position.y = this.komaState.targetPos.y + hover;

      // Streamlined wind posture: ears laid back, slight streamline squash
      earTwitchX = -0.26;
      scaleY -= 0.05 * Math.sin(progress * Math.PI);
      scaleX += 0.06 * Math.sin(progress * Math.PI);
      scaleZ += 0.06 * Math.sin(progress * Math.PI);

      if (progress >= 1) {
        this.komaState.isWindSliding = false;
        this.komaGroup.position.copy(this.komaState.targetPos);
        this.komaState.landingBounce = 0.6;
        if (typeof this.komaState.onSlideLanding === "function") {
          const cb = this.komaState.onSlideLanding;
          this.komaState.onSlideLanding = null;
          cb();
        }
      }
    } else if (this.komaState.isCelebrating) {
      // Joyful victory spin & hop
      this.komaGroup.rotation.y += delta * 7;
      const celebHop = Math.abs(Math.sin(time * 7)) * 0.38;
      this.komaGroup.position.y = this.komaState.targetPos.y + celebHop;
      
      // Joyful squash on jump
      const celebSquash = Math.sin(time * 7);
      scaleY += celebSquash * 0.12;
      scaleX -= celebSquash * 0.06;
      scaleZ -= celebSquash * 0.06;
      
      // Cheerful ear perk & wiggle
      earTwitchZ = Math.sin(time * 14) * 0.16;
      earTwitchX = 0.18;
    } else {
      // Gentle idle hovering & organic chest breathing
      const hoverY = Math.sin(time * 3) * 0.035;
      this.komaGroup.position.y = this.komaState.targetPos.y + hoverY;

      const breathe = Math.sin(time * 2.4) * 0.022;
      scaleY += breathe;
      scaleX -= breathe * 0.5;
      scaleZ -= breathe * 0.5;

      // Natural ear-twitch timer (every 3.8 to 5s)
      this.komaState.twitchTimer += delta;
      if (this.komaState.twitchTimer > 3.8) {
        const twP = (this.komaState.twitchTimer - 3.8) / 0.32;
        if (twP <= 1) {
          earTwitchZ = Math.sin(twP * Math.PI * 4) * 0.2;
        } else {
          this.komaState.twitchTimer = Math.random() * 1.5;
        }
      }
    }

    // Impact landing bounce dampening
    if (this.komaState.landingBounce > 0.005) {
      this.komaState.landingBounce *= 0.82;
      const bSquash = Math.sin(this.komaState.landingBounce * Math.PI) * this.komaState.landingBounce * 0.22;
      scaleY -= bSquash;
      scaleX += bSquash * 0.6;
      scaleZ += bSquash * 0.6;
    } else {
      this.komaState.landingBounce = 0;
    }

    // Kami Skin Halo Rotation
    if (this.komaHalo) {
      this.komaHalo.rotation.y += delta * 1.5;
    }
    
    // 2. KOMA Rotation Interpolation
    if (this.komaState.isRotating) {
      const elapsed = now - this.komaState.rotStartTime;
      const progress = Math.min(elapsed / this.komaState.rotDuration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      
      this.komaGroup.rotation.y = this.komaState.startRotY + (this.komaState.targetRotY - this.komaState.startRotY) * ease;
      
      // Subtle bank lean while spinning
      this.komaGroup.rotation.z = Math.sin(progress * Math.PI) * 0.08 * Math.sign(this.komaState.targetRotY - this.komaState.startRotY);

      if (progress >= 1) {
        this.komaState.isRotating = false;
        this.komaGroup.rotation.y = this.komaState.targetRotY;
        this.komaGroup.rotation.z = 0;
      }
    }
    
    // 3. KOMA Bump Wobble & Impact Recoil
    if (this.komaState.isBumping) {
      const elapsed = now - this.komaState.bumpStartTime;
      if (elapsed < 320) {
        const p = elapsed / 320;
        const shake = Math.sin(elapsed * 0.08) * 0.14 * (1 - p);
        this.komaGroup.position.x = this.komaState.targetPos.x + shake;
        scaleY -= Math.sin(p * Math.PI) * 0.12;
        scaleX += Math.sin(p * Math.PI) * 0.08;
        scaleZ += Math.sin(p * Math.PI) * 0.08;
        earTwitchX = -0.25; // Droop ears backwards in dismay
      } else {
        this.komaState.isBumping = false;
        this.komaGroup.position.x = this.komaState.targetPos.x;
      }
    }

    // Apply squash and stretch scale to KOMA
    if (this.komaGroup) {
      this.komaGroup.scale.set(scaleX, scaleY, scaleZ);
    }

    // Apply expressive ear / antenna physics
    if (this.komaEarMeshes && this.komaEarMeshes.length > 0) {
      this.komaEarMeshes.forEach(ear => {
        if (ear.mesh) {
          const sideSign = (ear.side !== undefined && ear.side !== 0) ? ear.side : 1;
          ear.mesh.rotation.z = ear.baseRotZ + sideSign * earTwitchZ;
          ear.mesh.rotation.x = ear.baseRotX + earTwitchX;
        }
      });
    }
    
    // 4. KOMA Expressive Eyes (Blinking, Victory Squint, Bump Reaction)
    if (this.komaEyes) {
      if (this.komaState.isCelebrating) {
        if (this.komaState.eyeState !== "squint") {
          this.komaEyes.forEach(eye => eye.scale.set(1.25, 0.24, 1));
          this.komaState.eyeState = "squint";
        }
      } else if (this.komaState.isBumping) {
        if (this.komaState.eyeState !== "bump") {
          this.komaEyes.forEach(eye => eye.scale.set(0.65, 0.2, 1));
          this.komaState.eyeState = "bump";
        }
      } else {
        this.komaState.blinkTimer += cappedDelta;
        if (this.komaState.blinkTimer > 3.6) {
          if (this.komaState.eyeState !== "blink") {
            this.komaEyes.forEach(eye => eye.scale.set(1, 0.1, 1));
            this.komaState.eyeState = "blink";
          }
          if (this.komaState.blinkTimer > 3.75) {
            this.komaState.blinkTimer = 0;
            this.komaEyes.forEach(eye => eye.scale.set(1, 1, 1));
            this.komaState.eyeState = "normal";
          }
        } else if (this.komaState.eyeState !== "normal") {
          this.komaEyes.forEach(eye => eye.scale.set(1, 1, 1));
          this.komaState.eyeState = "normal";
        }
      }
    }
    
    // 5. Goal Beacon Animations
    if (this.goalMesh) {
      const gData = this.goalMesh.userData;
      if (gData.parcel) {
        gData.parcel.rotation.y += delta * 1.5;
        gData.parcel.position.y = 0.75 + Math.sin(time * 3.5) * 0.08;
      }
      if (gData.orbitRing) {
        gData.orbitRing.rotation.z += delta * 2;
        gData.orbitRing.position.y = 0.75 + Math.sin(time * 3.5) * 0.08;
      }
    }
    
    // 5b. Kitsune Portal Animations
    this.portalMeshes.forEach(p => {
      const u = p.obj.userData;
      if (u.ring) u.ring.rotation.z += delta * 2.2;
      if (u.disc) u.disc.material.opacity = 0.72 + Math.sin(time * 4) * 0.22;
    });

    // 5c. Spirit Lotus Orb Animations
    this.orbMeshes.forEach((o, idx) => {
      if (o.obj.visible) {
        const u = o.obj.userData;
        const bob = Math.sin(time * 3 + idx * 1.5) * 0.08;
        if (u.orb) {
          u.orb.position.y = 0.65 + bob;
          u.orb.rotation.y += delta * 1.8;
          if (u.orb.material) {
            u.orb.material.emissiveIntensity = 1.3 + Math.sin(time * 3 + idx) * 0.35;
          }
        }
        if (u.halo) {
          u.halo.position.y = 0.65 + bob;
          u.halo.rotation.z += delta * 2.5;
        }
      }
    });
    
    // 6. Koi Fish Swimming Motion
    this.koiFish.forEach(koi => {
      const kData = koi.userData;
      kData.orbitAngle += delta * kData.speed * 0.4;
      
      const kx = Math.cos(kData.orbitAngle) * kData.orbitRadius;
      const kz = Math.sin(kData.orbitAngle) * kData.orbitRadius;
      koi.position.set(kx, -0.22, kz);
      
      // Face direction of motion (tangent to circle)
      koi.rotation.y = -kData.orbitAngle + Math.PI / 2;
      
      // Tail wagging
      if (kData.tailMesh) {
        kData.tailMesh.rotation.y = Math.sin(time * 9 + kData.wobbleOffset) * 0.45;
      }
    });
    
    // 7. Particle Systems (Throttled to every 2nd frame for 60fps performance)
    this.particleTick = (this.particleTick || 0) + 1;
    const updateParticles = (this.particleTick % 2 === 0);

    // 7a. Sakura Petals Drifting in Breeze & Dynamic Wind Gusts (Only when visible)
    if (this.sakuraParticles && this.sakuraParticles.visible && updateParticles) {
      const positions = this.sakuraParticles.geometry.attributes.position.array;
      const speeds = this.sakuraParticles.geometry.userData.speeds;
      const count = positions.length / 3;
      
      // Wind gust simulation: smooth sinusoidal breeze every ~8s
      const gustCycle = (time % 8.0) / 8.0;
      let gustBonus = 0;
      if (gustCycle > 0.35 && gustCycle < 0.72) {
        const gustProgress = (gustCycle - 0.35) / 0.37;
        gustBonus = Math.sin(gustProgress * Math.PI) * 0.038;
      }
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] += (speeds[i * 3 + 0] - gustBonus) * 2;
        positions[i * 3 + 1] += (speeds[i * 3 + 1] - gustBonus * 0.25) * 2;
        positions[i * 3 + 2] += (Math.sin(time * 2.4 + i * 0.7) * 0.012 + (speeds[i * 3 + 2] || 0)) * 2;
        
        // Wrap around when falling too low or drifting off screen
        if (positions[i * 3 + 1] < -0.25 || positions[i * 3 + 0] < -14) {
          positions[i * 3 + 1] = 11 + Math.random() * 2.5;
          positions[i * 3 + 0] = 11 + Math.random() * 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
        }
      }
      this.sakuraParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7b. Bio-luminescent Fireflies & Spirit Motes (Hotaru / Kitsune-Bi)
    if (this.fireflyParticles && updateParticles) {
      const positions = this.fireflyParticles.geometry.attributes.position.array;
      const fireflies = this.fireflyParticles.geometry.userData.fireflies;
      const count = fireflies.length;
      const komaPos = this.komaGroup ? this.komaGroup.position : null;

      for (let i = 0; i < count; i++) {
        const ff = fireflies[i];
        
        // Gentle Lissajous wandering in 3D space
        let targetX = ff.baseX + Math.sin(time * ff.speedX + ff.phase) * ff.wanderRadius;
        let targetY = ff.baseY + Math.sin(time * ff.speedY + ff.phase * 1.5) * (ff.wanderRadius * 0.6);
        let targetZ = ff.baseZ + Math.cos(time * ff.speedZ + ff.phase) * ff.wanderRadius;

        // Interactive gentle repulsion if KOMA hops near (< 1.5m)
        if (komaPos) {
          const dx = targetX - komaPos.x;
          const dz = targetZ - komaPos.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < 2.25 && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const repel = (1.5 - dist) * 0.45;
            targetX += (dx / dist) * repel;
            targetZ += (dz / dist) * repel;
            targetY += repel * 0.35;
          }
        }

        positions[i * 3 + 0] = targetX;
        positions[i * 3 + 1] = targetY;
        positions[i * 3 + 2] = targetZ;
      }

      this.fireflyParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7c. Alpine Snow Particles (Heiliger Berg Fuji)
    if (this.snowParticles && this.snowParticles.visible && updateParticles) {
      const positions = this.snowParticles.geometry.attributes.position.array;
      const speeds = this.snowParticles.geometry.userData.speeds;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] += speeds[i * 3 + 0] * 2;
        positions[i * 3 + 1] += speeds[i * 3 + 1] * 2;
        positions[i * 3 + 2] += (speeds[i * 3 + 2] + Math.sin(time * 2.2 + i * 0.8) * 0.006) * 2;

        // Reset snow particles when reaching ground
        if (positions[i * 3 + 1] < -0.2) {
          positions[i * 3 + 1] = 14 + Math.random() * 2.0;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 32;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 32;
        }
      }
      this.snowParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7d. Animated Swirling Wind Tiles (Windböen)
    if (this.windMeshes && this.windMeshes.length > 0) {
      for (let i = 0; i < this.windMeshes.length; i++) {
        const wm = this.windMeshes[i];
        if (wm.obj && wm.obj.userData.spinRing) {
          wm.obj.userData.spinRing.rotation.z += delta * 2.8;
          wm.obj.userData.spinRing.position.y = 0.05 + Math.sin(time * 3.8 + i) * 0.015;
        }
      }
    }
    
    // Update procedural Shinto contact shadow under KOMA
    if (this.komaShadow && this.komaGroup) {
      this.komaShadow.position.x = this.komaGroup.position.x;
      this.komaShadow.position.z = this.komaGroup.position.z;
      const hopOffset = Math.max(0, this.komaGroup.position.y - this.komaState.targetPos.y);
      const s = Math.max(0.65, 1.0 - hopOffset * 0.9);
      this.komaShadow.scale.set(s, s, 1);
      this.komaShadow.material.opacity = Math.max(0.2, 0.6 - hopOffset * 0.85);
    }

    // 8. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

/**
 * Showroom3DViewer
 * Dedicated lightweight 3D viewport that renders the equipped KOMA robot
 * directly on the showroom pedestal inside the Home Screen card.
 */
class Showroom3DViewer {
  constructor(canvasId = "showroomCanvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const w = this.canvas.clientWidth || 340;
    const h = this.canvas.clientHeight || 230;
    this.renderer.setSize(w, h, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
    this.camera.position.set(0, 0.38, 2.35);
    this.camera.lookAt(0, 0.36, 0);

    // Warm Shinto Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    keyLight.position.set(2.5, 4, 3.5);
    this.scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f5ff, 2.2);
    cyanRimLight.position.set(-2.5, 2.5, -2);
    this.scene.add(cyanRimLight);

    const bottomGlow = new THREE.PointLight(0x00f5ff, 2.5, 3.0);
    bottomGlow.position.set(0, 0.08, 0);
    this.scene.add(bottomGlow);

    this.currentSkinId = "original";
    this.komaGroup = null;
    this.komaBaseY = 0.02;
    this.clock = new THREE.Clock();

    this.loadSkin(window.gameInstance?.equippedSkin || "original");

    // Handle resize
    window.addEventListener("resize", () => this.onResize());

    this.animate();
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const w = this.canvas.clientWidth || 340;
    const h = this.canvas.clientHeight || 230;
    if (w > 0 && h > 0) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  loadSkin(skinId = "original") {
    this.currentSkinId = skinId;
    if (this.komaGroup) {
      this.scene.remove(this.komaGroup);
      this.komaGroup = null;
    }

    if (window.gameInstance && window.gameInstance.renderer) {
      const gRenderer = window.gameInstance.renderer;
      const prevGroup = gRenderer.komaGroup;
      gRenderer.buildKomaModel(skinId);
      this.komaGroup = gRenderer.komaGroup;
      gRenderer.komaGroup = prevGroup;
    }

    if (this.komaGroup) {
      this.komaGroup.position.set(0, this.komaBaseY || 0.02, 0);
      this.komaGroup.scale.set(1.22, 1.22, 1.22);
      this.scene.add(this.komaGroup);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.komaGroup) {
      this.komaGroup.rotation.y += delta * 0.75;
      this.komaGroup.position.y = (this.komaBaseY || 0.02) + Math.sin(time * 2.4) * 0.02;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

if (typeof window !== "undefined") {
  window.Showroom3DViewer = Showroom3DViewer;
}
