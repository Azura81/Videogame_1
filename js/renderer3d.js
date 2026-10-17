/**
 * KOMA: Spirit Delivery - 3D WebGL Renderer (Three.js)
 * Implements an isometric 3D garden world with dynamic lighting, shadows,
 * Sakura trees, water with koi, cyber Torii gates, and animated KOMA robot.
 */

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
    this.tilesGroup = new THREE.Group();
    this.decorGroup = new THREE.Group();
    this.effectsGroup = new THREE.Group();
    this.komaGroup = null;
    this.gateMeshes = [];
    this.switchMeshes = [];
    this.goalMesh = null;
    this.waterMesh = null;
    this.koiFish = [];
    this.sakuraParticles = null;
    this.toriiGateObjects = [];
    
    // Lighting
    this.ambientLight = null;
    this.sunLight = null;
    this.lanternLights = [];
    
    // Textures cache
    this.textures = {};
    
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
      moveDuration: 400,
      startPos: new THREE.Vector3(),
      isRotating: false,
      rotStartTime: 0,
      rotDuration: 280,
      startRotY: 0,
      isBumping: false,
      bumpStartTime: 0,
      isCelebrating: false,
      blinkTimer: 0,
      isBlinking: false
    };
    
    this.clock = new THREE.Clock();
    this.isInitialized = false;
    
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
    
    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    
    // 4. Build Groups
    this.scene.add(this.worldGroup);
    this.worldGroup.add(this.tilesGroup);
    this.worldGroup.add(this.decorGroup);
    this.worldGroup.add(this.effectsGroup);
    
    // 5. Generate Procedural Textures
    this.generateTextures();
    
    // 6. Setup Lighting
    this.setupLighting();
    
    // 7. Setup Background & Water Pond
    this.setupWaterAndSurroundings();
    
    // 8. Setup Sakura Petals Particle System
    this.setupSakuraParticles();
    
    // 9. Build KOMA 3D Model
    this.buildKomaModel();
    
    // 10. Event Listeners
    window.addEventListener("resize", () => this.onResize());
    
    // 11. Start Render Loop
    this.isInitialized = true;
    this.animate();
  }

  updateCameraPosition() {
    // True isometric viewing vector
    const dist = 24;
    this.camera.position.set(-dist, dist * 1.15, -dist);
    this.camera.lookAt(0, 0, 0);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth || window.innerWidth || 800;
    const h = this.container.clientHeight || window.innerHeight || 600;
    const aspect = w / h;
    
    // Dynamically adjust frustum to fit current grid dimensions
    const maxGridDim = Math.max(this.gridWidth, this.gridHeight, 5);
    const frustumSize = maxGridDim * 1.55;
    
    this.camera.left = (-frustumSize * aspect) / 2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(w, h);
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
  }

  setupLighting() {
    // Ambient moonlight / night atmospheric glow
    this.ambientLight = new THREE.AmbientLight(0x283b58, 1.1);
    this.scene.add(this.ambientLight);
    
    // Soft directional moonlight with crisp shadows
    this.sunLight = new THREE.DirectionalLight(0xa5c4f2, 1.25);
    this.sunLight.position.set(16, 28, 14);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 70;
    
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
    // 1. Water Plane beneath the garden
    const waterGeo = new THREE.PlaneGeometry(36, 36, 24, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a1d30,
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92
    });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.y = -0.28;
    this.waterMesh.receiveShadow = true;
    this.worldGroup.add(this.waterMesh);
    
    // 2. Swimming Koi Fish
    this.koiFish = [];
    const koiColors = [0xff5e3a, 0xfafafa, 0xffaa00, 0xff3b5c, 0xf5f5f5];
    for (let i = 0; i < 7; i++) {
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
      const angle = (i / 7) * Math.PI * 2;
      const radius = 4.2 + (i % 3) * 1.4;
      koiGroup.position.set(Math.cos(angle) * radius, -0.22, Math.sin(angle) * radius);
      
      koiGroup.userData = {
        orbitAngle: angle,
        orbitRadius: radius,
        speed: 0.35 + Math.random() * 0.25,
        wobbleOffset: Math.random() * Math.PI * 2,
        tailMesh: tail
      };
      
      this.decorGroup.add(koiGroup);
      this.koiFish.push(koiGroup);
    }
    
    // 3. Floating Lotus / Water Lilies
    for (let i = 0; i < 12; i++) {
      const padAngle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const padDist = 3.6 + Math.random() * 3.5;
      const lx = Math.cos(padAngle) * padDist;
      const lz = Math.sin(padAngle) * padDist;
      
      // Lily pad
      const padGeo = new THREE.CylinderGeometry(0.35 + Math.random() * 0.15, 0.35, 0.02, 16);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x1d4d38, roughness: 0.6 });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(lx, -0.24, lz);
      pad.receiveShadow = true;
      this.decorGroup.add(pad);
      
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
        this.decorGroup.add(flower);
      }
    }
  }

  setupSakuraParticles() {
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = Math.random() * 12 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      
      scales[i] = Math.random() * 0.28 + 0.16;
      
      speeds[i * 3 + 0] = -(Math.random() * 0.03 + 0.02); // gentle wind drift X
      speeds[i * 3 + 1] = -(Math.random() * 0.02 + 0.015); // fall speed Y
      speeds[i * 3 + 2] = Math.random() * 0.02 - 0.01;   // wobble Z
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    geometry.userData = { speeds: speeds };
    
    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: this.textures.petal,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    
    this.sakuraParticles = new THREE.Points(geometry, material);
    this.effectsGroup.add(this.sakuraParticles);
  }

  buildKomaModel() {
    this.komaGroup = new THREE.Group();
    
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf5f8fc,
      metalness: 0.15,
      roughness: 0.22
    });
    
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x101a2b,
      metalness: 0.6,
      roughness: 0.3
    });
    
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x060e18,
      metalness: 0.8,
      roughness: 0.15
    });
    
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff
    });
    
    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.8
    });
    
    const packMat = new THREE.MeshStandardMaterial({
      color: 0xbd7c4c,
      roughness: 0.6
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
    
    // 3. Glowing Cyan Eyes
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
    
    // 4. Single Curved Rabbit Ear / Antenna (KOMA's iconic design)
    const earGroup = new THREE.Group();
    const earGeo = new THREE.CylinderGeometry(0.035, 0.05, 0.28, 12);
    const ear = new THREE.Mesh(earGeo, bodyMat);
    ear.position.y = 0.14;
    ear.castShadow = true;
    earGroup.add(ear);
    
    const earTipGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const earTip = new THREE.Mesh(earTipGeo, cyanGlowMat);
    earTip.position.y = 0.28;
    earGroup.add(earTip);
    
    earGroup.position.set(-0.14, 0.72, 0);
    earGroup.rotation.z = 0.25;
    earGroup.rotation.x = -0.15;
    this.komaGroup.add(earGroup);
    
    // 5. Delivery Backpack / Spirit Parcel
    const packGeo = new THREE.BoxGeometry(0.26, 0.28, 0.2);
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.42, -0.32);
    pack.castShadow = true;
    this.komaGroup.add(pack);
    
    // Pack cyber-straps / ribbon
    const strapGeo = new THREE.BoxGeometry(0.27, 0.04, 0.21);
    const strap = new THREE.Mesh(strapGeo, cyanGlowMat);
    strap.position.set(0, 0.42, -0.32);
    this.komaGroup.add(strap);
    
    // 6. Base / Thruster ring with gentle hover glow
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.14, 0.12, 16);
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = 0.14;
    base.castShadow = true;
    this.komaGroup.add(base);
    
    const thrustRingGeo = new THREE.RingGeometry(0.08, 0.18, 16);
    const thrustRing = new THREE.Mesh(thrustRingGeo, cyanGlowMat);
    thrustRing.rotation.x = Math.PI / 2;
    thrustRing.position.y = 0.07;
    this.komaGroup.add(thrustRing);
    
    // Light cast onto ground beneath KOMA
    this.komaLight = new THREE.PointLight(0x00f5ff, 1.2, 2.2);
    this.komaLight.position.set(0, 0.2, 0);
    this.komaGroup.add(this.komaLight);
    
    this.worldGroup.add(this.komaGroup);
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

  buildToriiGate() {
    const gateGroup = new THREE.Group();
    
    const lacquerMat = new THREE.MeshStandardMaterial({
      color: 0x1f0d2b,
      metalness: 0.4,
      roughness: 0.3
    });
    
    const purpleNeonMat = new THREE.MeshStandardMaterial({
      color: 0xdf6eff,
      emissive: 0xbd42ff,
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
    const sLeft = new THREE.Mesh(stripeGeo, purpleNeonMat);
    sLeft.position.set(-0.42, 0.8, 0.09);
    gateGroup.add(sLeft);
    
    const sRight = new THREE.Mesh(stripeGeo, purpleNeonMat);
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
    const tab = new THREE.Mesh(tabGeo, purpleNeonMat);
    tab.position.set(0, 1.42, 0.04);
    gateGroup.add(tab);
    
    // Energy Barrier Screen (Closed State)
    const barrierGeo = new THREE.PlaneGeometry(0.72, 1.35);
    const barrierMat = new THREE.MeshBasicMaterial({
      color: 0xdf6eff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 0.78, 0);
    gateGroup.add(barrier);
    
    // Gate Point Light
    const gateLight = new THREE.PointLight(0xdf6eff, 1.5, 3.2);
    gateLight.position.set(0, 1.1, 0.1);
    gateGroup.add(gateLight);
    
    gateGroup.userData = {
      barrier: barrier,
      light: gateLight,
      neonMats: [purpleNeonMat, barrierMat],
      isOpen: false
    };
    
    return gateGroup;
  }

  buildSwitchPad() {
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
    
    // Glowing Cyan Circular Core
    const padGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.06, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      emissive: 0x00f5d4,
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
    
    // Switch Light
    const swLight = new THREE.PointLight(0x00f5d4, 1.4, 2.5);
    swLight.position.set(0, 0.4, 0);
    swGroup.add(swLight);
    
    swGroup.userData = {
      padMat: padMat,
      swLight: swLight,
      isActive: false
    };
    
    return swGroup;
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
    
    // Warm Point Light
    const pLight = new THREE.PointLight(0xff9d3b, 1.2, 2.8);
    pLight.position.set(0, 0.65, 0);
    lanternGroup.add(pLight);
    
    return lanternGroup;
  }

  /**
   * Load and render a level into the 3D scene
   */
  loadLevel(levelData) {
    this.gridWidth = levelData.w;
    this.gridHeight = levelData.h;
    
    // 1. Clear previous tiles, decor, and interactive objects
    while (this.tilesGroup.children.length) this.tilesGroup.remove(this.tilesGroup.children[0]);
    while (this.decorGroup.children.length) this.decorGroup.remove(this.decorGroup.children[0]);
    
    this.gateMeshes = [];
    this.switchMeshes = [];
    this.toriiGateObjects = [];
    this.goalMesh = null;
    
    // Setup surroundings again
    this.setupWaterAndSurroundings();
    
    // 2. Center offset: World origin (0,0) is center of grid
    const offsetX = (this.gridWidth - 1) / 2;
    const offsetZ = (this.gridHeight - 1) / 2;
    
    const isWall = (x, y) => (levelData.walls || []).some(w => w[0] === x && w[1] === y);
    const isGate = (x, y) => (levelData.gate || []).some(g => g[0] === x && g[1] === y);
    const isSwitch = (x, y) => (levelData.sw || []).some(s => s[0] === x && s[1] === y);
    const isGoal = (x, y) => levelData.g[0] === x && levelData.g[1] === y;
    
    const tileGeo = new THREE.BoxGeometry(0.94, 0.45, 0.94);
    const tileMat = new THREE.MeshStandardMaterial({
      map: this.textures.stone,
      roughness: 0.6,
      metalness: 0.1
    });
    
    // 3. Build each grid cell
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const posX = (x - offsetX) * this.tileSize;
        const posZ = (y - offsetZ) * this.tileSize;
        
        // Base Stone Slab for walkable/interactive tiles
        if (!isWall(x, y)) {
          const tile = new THREE.Mesh(tileGeo, tileMat);
          tile.position.set(posX, 0.22, posZ);
          tile.receiveShadow = true;
          tile.castShadow = true;
          this.tilesGroup.add(tile);
          
          // Fallen Petals on random path tiles
          if ((x * 3 + y * 7) % 5 === 0) {
            const petalMesh = new THREE.Mesh(
              new THREE.PlaneGeometry(0.25, 0.25),
              new THREE.MeshBasicMaterial({ map: this.textures.petal, transparent: true, opacity: 0.85, depthWrite: false })
            );
            petalMesh.rotation.x = -Math.PI / 2;
            petalMesh.position.set(posX + 0.12, 0.46, posZ - 0.1);
            this.tilesGroup.add(petalMesh);
          }
        }
        
        // Wall -> Sakura Tree or Ancient Stone Wall
        if (isWall(x, y)) {
          const tree = this.buildSakuraTree(x + y * 4);
          tree.position.set(posX, 0, posZ);
          this.decorGroup.add(tree);
        }
        
        // Gate -> Cyber-Torii Gate
        if (isGate(x, y)) {
          const torii = this.buildToriiGate();
          torii.position.set(posX, 0.45, posZ);
          this.decorGroup.add(torii);
          this.toriiGateObjects.push(torii);
          this.gateMeshes.push({ x: x, y: y, obj: torii });
        }
        
        // Switch -> Raised Cyber Switch Pad
        if (isSwitch(x, y)) {
          const swPad = this.buildSwitchPad();
          swPad.position.set(posX, 0.45, posZ);
          this.decorGroup.add(swPad);
          this.switchMeshes.push({ x: x, y: y, obj: swPad });
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
    
    if (this.komaGroup) {
      this.komaGroup.position.copy(worldPos);
      this.komaGroup.rotation.y = rotY;
    }
  }

  animateMove(gx, gy, duration = 380) {
    const target = this.gridToWorld(gx, gy);
    this.komaState.gridX = gx;
    this.komaState.gridY = gy;
    this.komaState.startPos.copy(this.komaGroup.position);
    this.komaState.targetPos.copy(target);
    this.komaState.isMoving = true;
    this.komaState.moveStartTime = performance.now();
    this.komaState.moveDuration = duration;
  }

  animateRotate(dir, duration = 240) {
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
  }

  setGateOpen(isOpen) {
    this.toriiGateObjects.forEach(gate => {
      gate.userData.isOpen = isOpen;
      if (gate.userData.barrier) {
        gate.userData.barrier.visible = !isOpen;
      }
      if (gate.userData.light) {
        gate.userData.light.color.setHex(isOpen ? 0x00f5ff : 0xdf6eff);
        gate.userData.light.intensity = isOpen ? 0.8 : 1.6;
      }
    });
  }

  setSwitchActive(isActive) {
    this.switchMeshes.forEach(sw => {
      sw.obj.userData.isActive = isActive;
      if (sw.obj.userData.padMat) {
        sw.obj.userData.padMat.emissiveIntensity = isActive ? 2.5 : 1.2;
      }
      if (sw.obj.userData.swLight) {
        sw.obj.userData.swLight.intensity = isActive ? 2.8 : 1.4;
      }
    });
  }

  animateWin() {
    this.komaState.isCelebrating = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();
    const now = performance.now();
    
    // 1. KOMA Movement Interpolation
    if (this.komaState.isMoving) {
      const elapsed = now - this.komaState.moveStartTime;
      const progress = Math.min(elapsed / this.komaState.moveDuration, 1);
      
      // Smooth easeInOutCubic
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      this.komaGroup.position.lerpVectors(this.komaState.startPos, this.komaState.targetPos, ease);
      
      // Hop arc (jumping slightly off ground while stepping)
      const hopHeight = Math.sin(progress * Math.PI) * 0.22;
      this.komaGroup.position.y = this.komaState.targetPos.y + hopHeight;
      
      if (progress >= 1) {
        this.komaState.isMoving = false;
        this.komaGroup.position.copy(this.komaState.targetPos);
      }
    } else if (this.komaState.isCelebrating) {
      // Joyful victory spin & hop
      this.komaGroup.rotation.y += delta * 7;
      this.komaGroup.position.y = this.komaState.targetPos.y + Math.abs(Math.sin(time * 6)) * 0.35;
    } else {
      // Gentle idle hovering
      const hoverY = Math.sin(time * 3) * 0.035;
      this.komaGroup.position.y = this.komaState.targetPos.y + hoverY;
    }
    
    // 2. KOMA Rotation Interpolation
    if (this.komaState.isRotating) {
      const elapsed = now - this.komaState.rotStartTime;
      const progress = Math.min(elapsed / this.komaState.rotDuration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      
      this.komaGroup.rotation.y = this.komaState.startRotY + (this.komaState.targetRotY - this.komaState.startRotY) * ease;
      
      if (progress >= 1) {
        this.komaState.isRotating = false;
        this.komaGroup.rotation.y = this.komaState.targetRotY;
      }
    }
    
    // 3. KOMA Bump Wobble
    if (this.komaState.isBumping) {
      const elapsed = now - this.komaState.bumpStartTime;
      if (elapsed < 300) {
        const shake = Math.sin(elapsed * 0.08) * 0.12 * (1 - elapsed / 300);
        this.komaGroup.position.x = this.komaState.targetPos.x + shake;
      } else {
        this.komaState.isBumping = false;
        this.komaGroup.position.x = this.komaState.targetPos.x;
      }
    }
    
    // 4. KOMA Eye Blinking
    this.komaState.blinkTimer += delta;
    if (this.komaState.blinkTimer > 3.5) {
      this.komaState.isBlinking = true;
      if (this.komaEyes) {
        this.komaEyes.forEach(eye => (eye.scale.y = 0.1));
      }
      if (this.komaState.blinkTimer > 3.65) {
        this.komaState.blinkTimer = 0;
        this.komaState.isBlinking = false;
        if (this.komaEyes) {
          this.komaEyes.forEach(eye => (eye.scale.y = 1));
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
      if (gData.light) {
        gData.light.intensity = 1.6 + Math.sin(time * 4) * 0.4;
      }
    }
    
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
    
    // 7. Sakura Petals Drifting in Breeze
    if (this.sakuraParticles) {
      const positions = this.sakuraParticles.geometry.attributes.position.array;
      const speeds = this.sakuraParticles.geometry.userData.speeds;
      const count = positions.length / 3;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] += speeds[i * 3 + 0]; // X drift
        positions[i * 3 + 1] += speeds[i * 3 + 1]; // Y fall
        positions[i * 3 + 2] += Math.sin(time * 2 + i) * 0.008; // Z wobble
        
        // Wrap around when falling too low or drifting off screen
        if (positions[i * 3 + 1] < -0.2) {
          positions[i * 3 + 1] = 11 + Math.random() * 2;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
        }
      }
      this.sakuraParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    // 8. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
