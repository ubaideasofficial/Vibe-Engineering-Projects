/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * Procedural texture and asset generator for a realistic Subway Surfers / Urban Cyber Highway environment.
 */
export class EnvironmentBuilder {
  // Cached textures & materials
  private static asphaltTexture: THREE.CanvasTexture | null = null;
  private static concreteTexture: THREE.CanvasTexture | null = null;
  private static hazardTexture: THREE.CanvasTexture | null = null;
  private static trainFrontTexture: THREE.CanvasTexture | null = null;
  private static trainSideTexture: THREE.CanvasTexture | null = null;
  private static buildingTextures: THREE.CanvasTexture[] = [];
  private static subwaySignTexture: THREE.CanvasTexture | null = null;

  /**
   * Generates realistic road asphalt with subtle grain, painted solid curbs, and clean dashed lane lines
   */
  public static getAsphaltTexture(): THREE.CanvasTexture {
    if (this.asphaltTexture) return this.asphaltTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // 1. Dark asphalt base
    ctx.fillStyle = '#11141c';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Fine asphalt grain & noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      data[i] = Math.max(10, Math.min(35, data[i] + noise));
      data[i + 1] = Math.max(12, Math.min(38, data[i + 1] + noise));
      data[i + 2] = Math.max(18, Math.min(48, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Subtle road tar joints & tire track wear
    ctx.fillStyle = 'rgba(6, 8, 14, 0.35)';
    // Left lane tire tracks
    ctx.fillRect(200, 0, 80, 1024);
    ctx.fillRect(360, 0, 80, 1024);
    // Center lane tire tracks
    ctx.fillRect(470, 0, 80, 1024);
    ctx.fillRect(630, 0, 80, 1024);
    // Right lane tire tracks
    ctx.fillRect(740, 0, 80, 1024);
    ctx.fillRect(900, 0, 80, 1024);

    // 4. Outer yellow boundary lines with subtle glow
    ctx.fillStyle = '#f5b000';
    ctx.shadowColor = '#ffc800';
    ctx.shadowBlur = 4;
    ctx.fillRect(40, 0, 14, 1024);
    ctx.fillRect(970, 0, 14, 1024);

    // 5. White dashed lane lines
    ctx.fillStyle = '#f0f4f8';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 3;
    const dashH = 90;
    const gapH = 90;
    const totalDashes = Math.ceil(1024 / (dashH + gapH));

    for (let i = 0; i < totalDashes; i++) {
      const y = i * (dashH + gapH);
      // Left lane divider
      ctx.fillRect(350, y, 10, dashH);
      // Right lane divider
      ctx.fillRect(670, y, 10, dashH);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    tex.anisotropy = 8;
    this.asphaltTexture = tex;
    return tex;
  }

  /**
   * Generates realistic weathered concrete texture for curbs, barriers, and pillars
   */
  public static getConcreteTexture(): THREE.CanvasTexture {
    if (this.concreteTexture) return this.concreteTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Concrete base
    ctx.fillStyle = '#3a404c';
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 35;
      data[i] = Math.max(45, Math.min(100, data[i] + noise));
      data[i + 1] = Math.max(48, Math.min(105, data[i + 1] + noise));
      data[i + 2] = Math.max(55, Math.min(115, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Weathered streaks
    ctx.fillStyle = 'rgba(20, 24, 32, 0.25)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 512;
      const w = 4 + Math.random() * 12;
      ctx.fillRect(x, 0, w, 512);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.concreteTexture = tex;
    return tex;
  }

  /**
   * Generates hazard stripes (yellow/black or cyan/black) for construction barriers and clearance gantries
   */
  public static getHazardTexture(): THREE.CanvasTexture {
    if (this.hazardTexture) return this.hazardTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(0, 0, 256, 64);

    ctx.fillStyle = '#181818';
    const stripeW = 24;
    for (let x = -64; x < 320; x += stripeW * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripeW, 0);
      ctx.lineTo(x + stripeW - 32, 64);
      ctx.lineTo(x - 32, 64);
      ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.hazardTexture = tex;
    return tex;
  }

  /**
   * Generates realistic Subway Train Front texture with windshield, wipers, headlights, and route sign
   */
  public static getTrainFrontTexture(): THREE.CanvasTexture {
    if (this.trainFrontTexture) return this.trainFrontTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Train Body Front (Subway metallic blue / graphite)
    ctx.fillStyle = '#1e2638';
    ctx.fillRect(0, 0, 512, 512);

    // Hazard stripes at bumper bottom
    ctx.fillStyle = '#ffb700';
    ctx.fillRect(0, 420, 512, 92);
    ctx.fillStyle = '#111';
    for (let x = -50; x < 560; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 420);
      ctx.lineTo(x + 20, 420);
      ctx.lineTo(x, 512);
      ctx.lineTo(x - 20, 512);
      ctx.fill();
    }

    // Top Digital Destination Route Sign
    ctx.fillStyle = '#080c14';
    ctx.fillRect(60, 40, 392, 60);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 40, 392, 60);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUBWAY LINE 7 • DOWNTOWN', 256, 80);

    // Front Windshield Glass
    const grad = ctx.createLinearGradient(0, 120, 0, 310);
    grad.addColorStop(0, '#0f2238');
    grad.addColorStop(1, '#05101a');
    ctx.fillStyle = grad;
    ctx.fillRect(50, 120, 412, 190);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 120, 412, 190);

    // Windshield center divider
    ctx.fillStyle = '#1e2638';
    ctx.fillRect(250, 120, 12, 190);

    // Dual High-Power Train Headlights
    // Left headlight
    ctx.fillStyle = '#fff4cc';
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(110, 360, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Right headlight
    ctx.beginPath();
    ctx.arc(402, 360, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Train Emblem
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(256, 360, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b0f19';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('⚡', 256, 368);

    const tex = new THREE.CanvasTexture(canvas);
    this.trainFrontTexture = tex;
    return tex;
  }

  /**
   * Generates realistic Subway Train Side panel texture with passenger windows, doors, and metal corrugation
   */
  public static getTrainSideTexture(): THREE.CanvasTexture {
    if (this.trainSideTexture) return this.trainSideTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Brushed metal body
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#475569');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Cyberpunk Subway cyan accent stripe along waistline
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(0, 320, 1024, 20);

    // Corrugated horizontal metal ridges
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 3;
    for (let y = 350; y < 490; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Glowing passenger windows with warm interior lighting
    const winCount = 5;
    const winW = 120;
    const winH = 140;
    const spacing = 190;

    for (let i = 0; i < winCount; i++) {
      const x = 40 + i * spacing;
      const winGrad = ctx.createLinearGradient(x, 100, x, 240);
      winGrad.addColorStop(0, '#fef08a');
      winGrad.addColorStop(0.7, '#f59e0b');
      winGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = winGrad;
      ctx.fillRect(x, 100, winW, winH);

      // Window rubber frame
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 6;
      ctx.strokeRect(x, 100, winW, winH);

      // Passenger silhouettes
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.beginPath();
        ctx.arc(x + 60, 170, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + 40, 190, 40, 50);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    this.trainSideTexture = tex;
    return tex;
  }

  /**
   * Generates realistic detailed skyscraper facade textures with illuminated window grids
   */
  public static getBuildingTexture(type: number = 0): THREE.CanvasTexture {
    if (this.buildingTextures[type]) return this.buildingTextures[type];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Building facade background
    const bgColors = ['#0c101d', '#080c16', '#111728', '#0e1422'];
    ctx.fillStyle = bgColors[type % bgColors.length];
    ctx.fillRect(0, 0, 512, 1024);

    // Window grid
    const cols = 8;
    const rows = 28;
    const winW = 34;
    const winH = 22;
    const gapX = (512 - cols * winW) / (cols + 1);
    const gapY = (1024 - rows * winH) / (rows + 1);

    const warmLit = ['#ffe885', '#ffd166', '#fef08a', '#fffae0'];
    const cyberLit = ['#00f0ff', '#38bdf8', '#ff007f', '#a855f7'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (winW + gapX);
        const y = gapY + r * (winH + gapY);

        const isLit = Math.random() > 0.45;
        if (isLit) {
          const colorPool = (type % 2 === 0) ? warmLit : cyberLit;
          ctx.fillStyle = colorPool[Math.floor(Math.random() * colorPool.length)];
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = 'rgba(20, 30, 48, 0.4)';
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(x, y, winW, winH);
      }
    }
    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    this.buildingTextures[type] = tex;
    return tex;
  }

  /**
   * Builds a realistic 3D Subway Train Obstacle (like in Subway Surfers)
   */
  public static createSubwayTrainMesh(): THREE.Group {
    const group = new THREE.Group();
    const trainWidth = 2.4;
    const trainHeight = 3.6;
    const trainLength = 14;

    // Train Body Box
    const bodyGeom = new THREE.BoxGeometry(trainWidth, trainHeight, trainLength);

    // Multi-material for train (front has windshield/headlights, sides have windows)
    const frontTex = this.getTrainFrontTexture();
    const sideTex = this.getTrainSideTexture();
    const concreteTex = this.getConcreteTexture();

    const metalSideMat = new THREE.MeshStandardMaterial({
      map: sideTex,
      roughness: 0.35,
      metalness: 0.7,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      roughness: 0.3,
      metalness: 0.6,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      map: concreteTex,
      roughness: 0.8,
      metalness: 0.3,
    });

    const undercarriageMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
    });

    // BoxFace order in Three.js: +X (right), -X (left), +Y (top), -Y (bottom), +Z (front facing camera), -Z (back)
    const materials = [
      metalSideMat, // +X right side
      metalSideMat, // -X left side
      roofMat,      // +Y roof
      undercarriageMat, // -Y bottom
      undercarriageMat, // +Z (back)
      frontMat,     // -Z (front facing player approaching from -Z towards +Z)
    ];

    const bodyMesh = new THREE.Mesh(bodyGeom, materials);
    bodyMesh.position.y = trainHeight / 2 + 0.3;
    group.add(bodyMesh);

    // Rooftop AC Pods & Pantograph details
    const acGeom = new THREE.BoxGeometry(1.4, 0.4, 3.2);
    const acMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const acPod1 = new THREE.Mesh(acGeom, acMat);
    acPod1.position.set(0, trainHeight + 0.5, -3);
    group.add(acPod1);

    const acPod2 = new THREE.Mesh(acGeom, acMat);
    acPod2.position.set(0, trainHeight + 0.5, 3);
    group.add(acPod2);

    // Front Headlight Glow Cones (illuminating the track in front of the train)
    const lightGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffea75,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    const coneGeom = new THREE.ConeGeometry(1.6, 7, 16, 1, true);
    const cone1 = new THREE.Mesh(coneGeom, lightGlowMat);
    cone1.rotation.x = -Math.PI / 2;
    cone1.position.set(-0.7, 1.2, -trainLength / 2 - 3.5);
    group.add(cone1);

    const cone2 = new THREE.Mesh(coneGeom, lightGlowMat);
    cone2.rotation.x = -Math.PI / 2;
    cone2.position.set(0.7, 1.2, -trainLength / 2 - 3.5);
    group.add(cone2);

    // Wheel Bogies & Undercarriage tracks
    const wheelGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 });

    const wheelOffsetsZ = [-4.5, -3.2, 3.2, 4.5];
    wheelOffsetsZ.forEach((z) => {
      const wL = new THREE.Mesh(wheelGeom, wheelMat);
      wL.rotation.z = Math.PI / 2;
      wL.position.set(-1.05, 0.35, z);
      group.add(wL);

      const wR = new THREE.Mesh(wheelGeom, wheelMat);
      wR.rotation.z = Math.PI / 2;
      wR.position.set(1.05, 0.35, z);
      group.add(wR);
    });

    return group;
  }

  /**
   * Builds a realistic Construction Sawhorse Roadblock Barrier (Jump Obstacle)
   */
  public static createRoadblockBarrierMesh(): THREE.Group {
    const group = new THREE.Group();
    const hazardTex = this.getHazardTexture();
    const concreteTex = this.getConcreteTexture();

    // Heavy Concrete Jersey Barrier base
    const baseGeom = new THREE.BoxGeometry(2.5, 0.55, 0.6);
    const baseMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      roughness: 0.85,
      metalness: 0.1,
    });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.y = 0.28;
    group.add(base);

    // Striped Wooden Plank on top
    const plankGeom = new THREE.BoxGeometry(2.6, 0.32, 0.15);
    const plankMat = new THREE.MeshStandardMaterial({
      map: hazardTex,
      roughness: 0.4,
    });
    const plank = new THREE.Mesh(plankGeom, plankMat);
    plank.position.set(0, 0.72, 0);
    group.add(plank);

    // Flashing Amber Construction Beacons
    const beaconGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.25, 12);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      emissive: 0xffaa00,
      emissiveIntensity: 0.9,
    });

    const beaconLeft = new THREE.Mesh(beaconGeom, beaconMat);
    beaconLeft.position.set(-1.05, 0.98, 0);
    group.add(beaconLeft);

    const beaconRight = new THREE.Mesh(beaconGeom, beaconMat);
    beaconRight.position.set(1.05, 0.98, 0);
    group.add(beaconRight);

    return group;
  }

  /**
   * Builds a realistic Overhead Railway Gantry / Low Clearance Gate (Slide Obstacle)
   */
  public static createClearanceGateMesh(): THREE.Group {
    const group = new THREE.Group();
    const hazardTex = this.getHazardTexture();

    // Heavy Steel Industrial Side Columns
    const postGeom = new THREE.BoxGeometry(0.3, 3.4, 0.3);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x242e42,
      roughness: 0.5,
      metalness: 0.7,
    });

    const leftPost = new THREE.Mesh(postGeom, metalMat);
    leftPost.position.set(-1.3, 1.7, 0);
    group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeom, metalMat);
    rightPost.position.set(1.3, 1.7, 0);
    group.add(rightPost);

    // Overhead Steel Truss Bar
    const trussGeom = new THREE.BoxGeometry(2.9, 0.4, 0.4);
    const truss = new THREE.Mesh(trussGeom, metalMat);
    truss.position.set(0, 3.2, 0);
    group.add(truss);

    // Dangling Hazard Clearance Barrier (laser / yellow barrier block from 0.85m to 2.9m)
    const barrierGeom = new THREE.BoxGeometry(2.5, 1.8, 0.18);
    const barrierMat = new THREE.MeshStandardMaterial({
      map: hazardTex,
      roughness: 0.4,
      metalness: 0.5,
    });
    const barrier = new THREE.Mesh(barrierGeom, barrierMat);
    barrier.position.set(0, 1.85, 0);
    group.add(barrier);

    // Hanging chains from truss to barrier
    const chainGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6);
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

    const chain1 = new THREE.Mesh(chainGeom, chainMat);
    chain1.position.set(-0.9, 2.9, 0);
    group.add(chain1);

    const chain2 = new THREE.Mesh(chainGeom, chainMat);
    chain2.position.set(0.9, 2.9, 0);
    group.add(chain2);

    // Red LED Warning Signal Lights
    const redLightGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const redLightMat = new THREE.MeshStandardMaterial({
      color: 0xff0044,
      emissive: 0xff0044,
      emissiveIntensity: 1.0,
    });

    const sigLeft = new THREE.Mesh(redLightGeom, redLightMat);
    sigLeft.position.set(-0.6, 3.2, -0.25);
    group.add(sigLeft);

    const sigRight = new THREE.Mesh(redLightGeom, redLightMat);
    sigRight.position.set(0.6, 3.2, -0.25);
    group.add(sigRight);

    return group;
  }

  /**
   * Builds realistic Highway Street Lamps casting directional downward light
   */
  public static createStreetLampMesh(side: 'left' | 'right'): THREE.Group {
    const group = new THREE.Group();

    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x1f293d,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Vertical steel pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 7.5, 12), poleMat);
    pole.position.y = 3.75;
    group.add(pole);

    // Curved lamp head arching over the road
    const armGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
    const arm = new THREE.Mesh(armGeom, poleMat);
    arm.rotation.z = side === 'left' ? -Math.PI / 3 : Math.PI / 3;
    arm.position.set(side === 'left' ? 0.8 : -0.8, 7.2, 0);
    group.add(arm);

    // Lamp fixture housing
    const fixtureGeom = new THREE.BoxGeometry(0.6, 0.2, 0.8);
    const fixture = new THREE.Mesh(fixtureGeom, poleMat);
    fixture.position.set(side === 'left' ? 1.6 : -1.6, 7.6, 0);
    group.add(fixture);

    // Glowing LED emitter
    const ledGeom = new THREE.PlaneGeometry(0.45, 0.65);
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0x99e6ff,
      side: THREE.DoubleSide,
    });
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.rotation.x = Math.PI / 2;
    led.position.set(side === 'left' ? 1.6 : -1.6, 7.48, 0);
    group.add(led);

    return group;
  }
}
