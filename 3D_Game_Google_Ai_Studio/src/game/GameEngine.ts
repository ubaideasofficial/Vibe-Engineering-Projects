/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { 
  Lane, 
  ObstacleInstance, 
  CollectibleInstance, 
  ObstacleType, 
  PowerUpType,
  BoardSkin 
} from '../types';
import { 
  LANE_POSITIONS, 
  BASE_SPEED, 
  MAX_SPEED, 
  ACCELERATION, 
  JUMP_DURATION, 
  JUMP_HEIGHT, 
  SLIDE_DURATION, 
  TRACK_SEGMENT_LENGTH,
  POWERUP_DURATIONS 
} from '../lib/constants';
import { SeededRNG } from '../lib/rng';
import { audio } from '../lib/audio';
import { CharacterModel } from './CharacterModel';
import { EnvironmentBuilder } from './EnvironmentBuilder';

export interface GameEngineCallbacks {
  onScoreUpdate: (deltaDist: number, speed: number) => void;
  onOrbCollect: (amount?: number) => void;
  onNearMiss: () => void;
  onPowerUpPickup: (type: PowerUpType, duration: number) => void;
  onCrash: () => void;
  onShieldDeflect: () => boolean; // returns true if shield absorbed hit
  onScreenShake: (intensity: number) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private callbacks: GameEngineCallbacks;

  // Three.js Core
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private isRunning = false;
  private isPaused = false;

  // Track & Environment
  private roadSegments: THREE.Group[] = [];
  private buildingGroup: THREE.Group = new THREE.Group();
  private rng: SeededRNG;

  // Player & Character Model
  private playerGroup: THREE.Group;
  private character: CharacterModel;
  private shieldBubbleMesh: THREE.Mesh;
  private boostAuraMesh: THREE.Mesh;
  private thrusterParticles: THREE.Points;
  private thrusterGeo: THREE.BufferGeometry;
  private thrusterPosArray: Float32Array;
  private playerHeadlight: THREE.SpotLight;

  private currentLane: Lane = 0;
  private targetX = 0;
  private currentX = 0;
  private playerY = 0.5;
  private boardTiltZ = 0;

  // Player Acrobatics
  private isJumping = false;
  private jumpTimer = 0;
  private isSliding = false;
  private slideTimer = 0;

  // Gameplay Run State
  private speed = BASE_SPEED;
  private totalDistance = 0;
  private currentSkin: BoardSkin;
  public isInMenu = true;

  // Spawners & Instances
  private obstacles: ObstacleInstance[] = [];
  private collectibles: CollectibleInstance[] = [];
  private obstacleMeshes: Map<number, THREE.Object3D> = new Map();
  private collectibleMeshes: Map<number, THREE.Object3D> = new Map();
  private nextObstacleId = 1;
  private nextCollectibleId = 1;
  private lastSpawnZ = 35;

  // Active Power-up States in Engine
  private hasMagnet = false;
  private hasBoost = false;
  private hasShield = false;

  // Camera Shake & Dynamic FOV
  private cameraShakeTime = 0;
  private cameraShakeIntensity = 0;
  private baseFOV = 66;

  // Materials & Geometries Shared
  private materials: Record<string, THREE.Material> = {};
  private geometries: Record<string, THREE.BufferGeometry> = {};

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks, skin: BoardSkin, seed: number = Date.now()) {
    this.container = container;
    this.callbacks = callbacks;
    this.currentSkin = skin;
    this.rng = new SeededRNG(seed);

    // 1. Scene & Realistic Atmosphere Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.012);

    // 2. Camera Setup (positioned slightly higher and behind player for great depth perspective)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(this.baseFOV, aspect, 0.1, 450);
    this.camera.position.set(0, 3.6, -6.8);
    this.camera.lookAt(0, 1.5, 14);

    // 3. Renderer with ACES Tone Mapping & Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    container.appendChild(this.renderer.domElement);

    // 4. Shared Materials & Geometries
    this.initSharedResources();

    // 5. Dynamic Lighting & Realistic Moonlight/Sun
    this.initLights();

    // 6. Environment & Skyline Scenery
    this.initEnvironment();

    // 7. Player Subway Surfers Character & Hoverboard
    this.initPlayer();

    // 8. Track Road Segments
    this.initRoads();

    // 9. Initial Obstacles & Collectibles
    this.seedInitialTrack();

    // 10. Resize Event Listener
    window.addEventListener('resize', this.onWindowResize);
  }

  private initSharedResources() {
    this.geometries.orb = new THREE.IcosahedronGeometry(0.38, 1);
    this.geometries.capsule = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 16);

    this.materials.orb = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.2,
    });

    this.materials.shieldPowerup = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    this.materials.magnetPowerup = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    this.materials.boostPowerup = new THREE.MeshStandardMaterial({
      color: 0xffe600,
      emissive: 0xffe600,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    this.materials.multPowerup = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff007f,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    this.materials.droneBody = new THREE.MeshStandardMaterial({
      color: 0x1f293d,
      roughness: 0.3,
      metalness: 0.8,
    });

    this.materials.laserEye = new THREE.MeshBasicMaterial({
      color: 0xff0055,
    });
  }

  private initLights() {
    // Ambient light with cool night-blue tones
    const ambientLight = new THREE.AmbientLight(0x283655, 1.3);
    this.scene.add(ambientLight);

    // Directional Moonlight casting dramatic edge lighting
    const moonLight = new THREE.DirectionalLight(0xa5c4f5, 1.8);
    moonLight.position.set(15, 30, 20);
    this.scene.add(moonLight);

    // Atmospheric Hemisphere sky/ground bounce
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.7);
    this.scene.add(hemiLight);
  }

  private initEnvironment() {
    this.scene.add(this.buildingGroup);

    // Build rich cityscape skyscrapers on both sides
    const buildingCount = 48;
    const concreteTex = EnvironmentBuilder.getConcreteTexture();

    for (let i = 0; i < buildingCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * this.rng.range(13, 38);
      const z = (i * 12) - 40;
      const h = this.rng.range(30, 95);
      const w = this.rng.range(10, 20);
      const d = this.rng.range(10, 22);

      const bTex = EnvironmentBuilder.getBuildingTexture(i % 4);
      const bGeom = new THREE.BoxGeometry(w, h, d);
      const facadeMat = new THREE.MeshStandardMaterial({
        map: bTex,
        roughness: 0.4,
        metalness: 0.5,
      });
      const roofMat = new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.8,
      });

      const materials = [
        facadeMat, facadeMat, roofMat, roofMat, facadeMat, facadeMat
      ];

      const bMesh = new THREE.Mesh(bGeom, materials);
      bMesh.position.set(x, h / 2 - 2, z);
      this.buildingGroup.add(bMesh);

      // Rooftop Antennas & Water Towers
      if (this.rng.chance(0.4)) {
        const antennaGeom = new THREE.CylinderGeometry(0.1, 0.15, 8, 8);
        const antennaMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
        const antenna = new THREE.Mesh(antennaGeom, antennaMat);
        antenna.position.set(x + (Math.random() - 0.5) * 4, h + 2, z);
        this.buildingGroup.add(antenna);

        // Blinking red aviation warning light on top
        const redBeaconGeom = new THREE.SphereGeometry(0.2, 8, 8);
        const redBeaconMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
        const beacon = new THREE.Mesh(redBeaconGeom, redBeaconMat);
        beacon.position.set(antenna.position.x, h + 6, antenna.position.z);
        this.buildingGroup.add(beacon);
      }
    }

    // Realistic Distant Moon / Cyber City Sun
    const moonGeom = new THREE.CircleGeometry(22, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      fog: false,
    });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonMesh.position.set(0, 32, 320);
    this.scene.add(moonMesh);

    // Glowing atmospheric moon halo ring
    const haloGeom = new THREE.RingGeometry(22, 28, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      fog: false,
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    haloMesh.position.set(0, 32, 319);
    this.scene.add(haloMesh);
  }

  private initRoads() {
    for (let i = 0; i < 5; i++) {
      const segment = this.createRoadSegment(i * TRACK_SEGMENT_LENGTH);
      this.roadSegments.push(segment);
      this.scene.add(segment);
    }
  }

  private createRoadSegment(zOffset: number): THREE.Group {
    const group = new THREE.Group();
    group.position.z = zOffset;

    const roadWidth = 10.5;
    const asphaltTex = EnvironmentBuilder.getAsphaltTexture();
    const concreteTex = EnvironmentBuilder.getConcreteTexture();

    // 1. Realistic Asphalt Surface
    const roadGeom = new THREE.PlaneGeometry(roadWidth, TRACK_SEGMENT_LENGTH);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.65,
      metalness: 0.25,
    });
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0, TRACK_SEGMENT_LENGTH / 2);
    group.add(roadMesh);

    // 2. Realistic Concrete Curbs & Safety Barriers (Left & Right)
    const curbGeom = new THREE.BoxGeometry(0.5, 0.45, TRACK_SEGMENT_LENGTH);
    const curbMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      roughness: 0.85,
    });

    const leftCurb = new THREE.Mesh(curbGeom, curbMat);
    leftCurb.position.set(roadWidth / 2 + 0.25, 0.22, TRACK_SEGMENT_LENGTH / 2);
    group.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeom, curbMat);
    rightCurb.position.set(-roadWidth / 2 - 0.25, 0.22, TRACK_SEGMENT_LENGTH / 2);
    group.add(rightCurb);

    // 3. Metallic Subway Rails along the 3 tracks
    const railGeom = new THREE.BoxGeometry(0.08, 0.06, TRACK_SEGMENT_LENGTH);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.15,
    });

    // Left Lane Rails
    const r1L = new THREE.Mesh(railGeom, railMat);
    r1L.position.set(LANE_POSITIONS[-1] - 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r1L);
    const r1R = new THREE.Mesh(railGeom, railMat);
    r1R.position.set(LANE_POSITIONS[-1] + 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r1R);

    // Center Lane Rails
    const r2L = new THREE.Mesh(railGeom, railMat);
    r2L.position.set(LANE_POSITIONS[0] - 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r2L);
    const r2R = new THREE.Mesh(railGeom, railMat);
    r2R.position.set(LANE_POSITIONS[0] + 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r2R);

    // Right Lane Rails
    const r3L = new THREE.Mesh(railGeom, railMat);
    r3L.position.set(LANE_POSITIONS[1] - 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r3L);
    const r3R = new THREE.Mesh(railGeom, railMat);
    r3R.position.set(LANE_POSITIONS[1] + 0.65, 0.03, TRACK_SEGMENT_LENGTH / 2);
    group.add(r3R);

    // 4. Street Lamps along the shoulders
    const lampLeft = EnvironmentBuilder.createStreetLampMesh('left');
    lampLeft.position.set(roadWidth / 2 + 0.6, 0, TRACK_SEGMENT_LENGTH * 0.3);
    group.add(lampLeft);

    const lampRight = EnvironmentBuilder.createStreetLampMesh('right');
    lampRight.position.set(-roadWidth / 2 - 0.6, 0, TRACK_SEGMENT_LENGTH * 0.7);
    group.add(lampRight);

    // 5. Overhead Railway Steel Truss Gantry (every segment)
    const trussGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });

    const archL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.5, 0.4), metalMat);
    archL.position.set(roadWidth / 2 + 0.3, 3.25, 0);
    trussGroup.add(archL);

    const archR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6.5, 0.4), metalMat);
    archR.position.set(-roadWidth / 2 - 0.3, 3.25, 0);
    trussGroup.add(archR);

    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(roadWidth + 1.2, 0.5, 0.5), metalMat);
    topBeam.position.set(0, 6.25, 0);
    trussGroup.add(topBeam);

    trussGroup.position.set(0, 0, TRACK_SEGMENT_LENGTH * 0.5);
    group.add(trussGroup);

    return group;
  }

  private initPlayer() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(0, this.playerY, 0);

    // 1. Subway Surfers Skater Character & Board
    this.character = new CharacterModel(this.currentSkin);
    this.playerGroup.add(this.character.rootGroup);

    // 2. Shield Bubble FX Mesh
    const shieldGeom = new THREE.SphereGeometry(1.4, 24, 24);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0,
      wireframe: true,
    });
    this.shieldBubbleMesh = new THREE.Mesh(shieldGeom, shieldMat);
    this.shieldBubbleMesh.position.y = 0.8;
    this.playerGroup.add(this.shieldBubbleMesh);

    // 3. Boost Warp Aura Mesh
    const boostGeom = new THREE.CylinderGeometry(0.8, 1.5, 3.4, 16, 1, true);
    const boostMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.boostAuraMesh = new THREE.Mesh(boostGeom, boostMat);
    this.boostAuraMesh.rotation.x = Math.PI / 2;
    this.boostAuraMesh.position.set(0, 0.6, -1.4);
    this.playerGroup.add(this.boostAuraMesh);

    // 4. Thruster Spark Particle Trails
    const particleCount = 45;
    this.thrusterGeo = new THREE.BufferGeometry();
    this.thrusterPosArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      this.thrusterPosArray[i] = (Math.random() - 0.5) * 0.6;
      this.thrusterPosArray[i + 1] = (Math.random() - 0.5) * 0.2;
      this.thrusterPosArray[i + 2] = -Math.random() * 2.8;
    }

    this.thrusterGeo.setAttribute('position', new THREE.BufferAttribute(this.thrusterPosArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(this.currentSkin.trailColor),
      size: 0.14,
      transparent: true,
      opacity: 0.85,
    });
    this.thrusterParticles = new THREE.Points(this.thrusterGeo, particleMat);
    this.thrusterParticles.position.set(0, 0, -1.0);
    this.playerGroup.add(this.thrusterParticles);

    // 5. Dynamic Player Forward Headlight
    this.playerHeadlight = new THREE.SpotLight(0x00f0ff, 1.6, 28, Math.PI / 4, 0.4);
    this.playerHeadlight.position.set(0, 0.4, 0.2);
    this.playerHeadlight.target.position.set(0, 0, 16);
    this.playerGroup.add(this.playerHeadlight);
    this.playerGroup.add(this.playerHeadlight.target);

    this.scene.add(this.playerGroup);
  }

  public updateSkin(skin: BoardSkin) {
    this.currentSkin = skin;
    this.character.updateSkin(skin);
  }

  // ====================== INPUT CONTROLS ======================

  public moveLeft() {
    if (!this.isRunning || this.isPaused) return;
    // Current lane: -1 is Left (+X on screen), 0 is Center, 1 is Right (-X on screen)
    if (this.currentLane > -1) {
      this.currentLane = (this.currentLane - 1) as Lane;
      this.targetX = LANE_POSITIONS[this.currentLane];
      this.boardTiltZ = 0.32; // Bank roll left into turn
      audio.playLaneSwitch(-1);
    }
  }

  public moveRight() {
    if (!this.isRunning || this.isPaused) return;
    if (this.currentLane < 1) {
      this.currentLane = (this.currentLane + 1) as Lane;
      this.targetX = LANE_POSITIONS[this.currentLane];
      this.boardTiltZ = -0.32; // Bank roll right into turn
      audio.playLaneSwitch(1);
    }
  }

  public jump() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpTimer = 0;
      this.isSliding = false; // Cancel slide if jumping
      audio.playJump();
    }
  }

  public slide() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0;
      if (this.isJumping) {
        // Fast drop dive down
        this.isJumping = false;
        this.playerY = 0.5;
      }
      audio.playSlide();
    }
  }

  // ====================== PROCEDURAL SPAWNER ======================

  private seedInitialTrack() {
    let currentZ = 45;
    while (currentZ < 260) {
      this.spawnPatternAt(currentZ);
      currentZ += this.rng.range(32, 50);
    }
    this.lastSpawnZ = currentZ;
  }

  private spawnPatternAt(z: number) {
    const obstacleRoll = this.rng.next();
    const laneChoices: Lane[] = [-1, 0, 1];

    if (obstacleRoll < 0.30) {
      // Pattern 1: Subway Train in 1 lane with orbs
      const lane = this.rng.choice(laneChoices);
      this.createObstacle('subway_train', lane, z);

      // Free lanes get orbs or powerup
      const freeLane = this.rng.choice(laneChoices.filter(l => l !== lane));
      if (this.rng.chance(0.3)) {
        this.createPowerUp(freeLane, z);
      } else {
        this.createOrbLine(freeLane, z - 8, z + 8, 0.8);
      }

    } else if (obstacleRoll < 0.55) {
      // Pattern 2: Construction Roadblock (Jump Barrier)
      const lane = this.rng.choice(laneChoices);
      this.createObstacle('barrier_jump', lane, z);

      // High parabolic orb arc above the roadblock
      this.createOrbArc(lane, z - 8, z + 8);

    } else if (obstacleRoll < 0.78) {
      // Pattern 3: Overhead Clearance Gantry (Slide Gate)
      const lane = this.rng.choice(laneChoices);
      this.createObstacle('laser_gate_slide', lane, z);

      // Low orbs along ground to reward sliding
      this.createOrbLine(lane, z - 5, z + 5, 0.45);

    } else if (obstacleRoll < 0.90) {
      // Pattern 4: 2 Trains / Pillars blocking 2 lanes, leaving 1 escape lane
      const freeLane = this.rng.choice(laneChoices);
      const blockedLanes = laneChoices.filter(l => l !== freeLane);

      blockedLanes.forEach((l, index) => {
        if (index === 0) {
          this.createObstacle('subway_train', l, z);
        } else {
          this.createObstacle('drone_pillar', l, z);
        }
      });

      if (this.rng.chance(0.35)) {
        this.createPowerUp(freeLane, z);
      } else {
        this.createOrbLine(freeLane, z - 6, z + 6, 0.8);
      }

    } else {
      // Pattern 5: Track Maintenance Inspector Drone
      const lane = this.rng.choice(laneChoices);
      this.createObstacle('moving_drone', lane, z);

      const otherLane = this.rng.choice(laneChoices.filter(l => l !== lane));
      this.createOrbLine(otherLane, z - 6, z + 6, 0.8);
    }
  }

  private createObstacle(type: ObstacleType, lane: Lane, z: number) {
    const id = this.nextObstacleId++;
    const x = LANE_POSITIONS[lane];
    let mesh: THREE.Object3D;
    let width = 2.4;
    let height = 1.0;
    let depth = 1.0;

    if (type === 'subway_train') {
      mesh = EnvironmentBuilder.createSubwayTrainMesh();
      mesh.position.set(x, 0, z);
      width = 2.4;
      height = 3.6;
      depth = 14.0;

    } else if (type === 'barrier_jump') {
      mesh = EnvironmentBuilder.createRoadblockBarrierMesh();
      mesh.position.set(x, 0, z);
      width = 2.5;
      height = 0.95;
      depth = 0.8;

    } else if (type === 'laser_gate_slide') {
      mesh = EnvironmentBuilder.createClearanceGateMesh();
      mesh.position.set(x, 0, z);
      width = 2.8;
      height = 3.2;
      depth = 0.8;

    } else if (type === 'moving_drone') {
      const group = new THREE.Group();
      const droneBody = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 14), this.materials.droneBody);
      droneBody.position.y = 1.2;
      group.add(droneBody);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), this.materials.laserEye);
      eye.position.set(0, 1.2, -0.55);
      group.add(eye);

      // Warning amber rotating beacon on top
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 8), this.materials.boostPowerup);
      beacon.position.set(0, 1.9, 0);
      group.add(beacon);

      group.position.set(x, 0, z);
      mesh = group;
      width = 1.8;
      height = 1.9;
      depth = 1.2;

    } else {
      // Heavy Industrial Utility Pillar
      const group = new THREE.Group();
      const colGeom = new THREE.BoxGeometry(2.3, 3.8, 1.4);
      const concreteTex = EnvironmentBuilder.getConcreteTexture();
      const colMat = new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.85 });
      const colMesh = new THREE.Mesh(colGeom, colMat);
      colMesh.position.y = 1.9;
      group.add(colMesh);

      // Yellow hazard caution stripe
      const hazardTex = EnvironmentBuilder.getHazardTexture();
      const stripeGeom = new THREE.BoxGeometry(2.34, 0.4, 1.44);
      const stripeMat = new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.4 });
      const stripe = new THREE.Mesh(stripeGeom, stripeMat);
      stripe.position.y = 1.9;
      group.add(stripe);

      group.position.set(x, 0, z);
      mesh = group;
      width = 2.3;
      height = 3.8;
      depth = 1.4;
    }

    this.scene.add(mesh);
    this.obstacleMeshes.set(id, mesh);

    this.obstacles.push({
      id,
      type,
      lane,
      z,
      width,
      height,
      depth,
      cleared: false,
      nearMissChecked: false,
      oscillationOffset: this.rng.range(0, Math.PI * 2),
    });
  }

  private createOrbArc(lane: Lane, startZ: number, endZ: number) {
    const count = 5;
    const stepZ = (endZ - startZ) / (count - 1);

    for (let i = 0; i < count; i++) {
      const z = startZ + i * stepZ;
      const t = i / (count - 1);
      const y = 0.6 + Math.sin(t * Math.PI) * JUMP_HEIGHT;
      this.createOrb(lane, z, y);
    }
  }

  private createOrbLine(lane: Lane, startZ: number, endZ: number, y: number = 0.8) {
    const count = 4;
    const stepZ = (endZ - startZ) / (count - 1);

    for (let i = 0; i < count; i++) {
      const z = startZ + i * stepZ;
      this.createOrb(lane, z, y);
    }
  }

  private createOrb(lane: Lane, z: number, y: number) {
    const id = this.nextCollectibleId++;
    const x = LANE_POSITIONS[lane];

    const mesh = new THREE.Mesh(this.geometries.orb, this.materials.orb);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.collectibleMeshes.set(id, mesh);

    this.collectibles.push({
      id,
      type: 'orb',
      lane,
      z,
      y,
      collected: false,
      animOffset: this.rng.range(0, Math.PI * 2),
    });
  }

  private createPowerUp(lane: Lane, z: number) {
    const id = this.nextCollectibleId++;
    const x = LANE_POSITIONS[lane];
    const types: PowerUpType[] = ['shield', 'magnet', 'boost', 'multiplier2x'];
    const pType = this.rng.choice(types);

    let mat = this.materials.shieldPowerup;
    if (pType === 'magnet') mat = this.materials.magnetPowerup;
    if (pType === 'boost') mat = this.materials.boostPowerup;
    if (pType === 'multiplier2x') mat = this.materials.multPowerup;

    const group = new THREE.Group();
    const capsule = new THREE.Mesh(this.geometries.capsule, mat);
    group.add(capsule);

    const ringGeom = new THREE.TorusGeometry(0.65, 0.07, 8, 24);
    const ring = new THREE.Mesh(ringGeom, mat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    group.position.set(x, 1.2, z);
    this.scene.add(group);
    this.collectibleMeshes.set(id, group);

    this.collectibles.push({
      id,
      type: 'powerup',
      powerUpType: pType,
      lane,
      z,
      y: 1.2,
      collected: false,
      animOffset: this.rng.range(0, Math.PI * 2),
    });
  }

  // ====================== MAIN GAME LOOP ======================

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (!this.isRunning) return;

      const deltaMs = Math.min(time - lastTime, 100);
      const dt = deltaMs / 1000;
      lastTime = time;

      if (!this.isPaused) {
        this.update(dt, time / 1000);
      }

      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public setMenuMode(inMenu: boolean) {
    this.isInMenu = inMenu;
    if (inMenu) {
      this.isJumping = false;
      this.isSliding = false;
      this.currentLane = 0;
      this.targetX = 0;
      this.currentX = 0;
      this.playerGroup.position.set(0, 0.5, 0);
    }
  }

  public resetRun(seed: number, mode: string = 'endless') {
    this.isInMenu = false;
    this.isPaused = false;
    this.isRunning = true;

    // 1. Remove all old obstacle meshes
    for (const [, mesh] of this.obstacleMeshes.entries()) {
      this.scene.remove(mesh);
    }
    this.obstacleMeshes.clear();
    this.obstacles = [];

    // 2. Remove all old collectible meshes
    for (const [, mesh] of this.collectibleMeshes.entries()) {
      this.scene.remove(mesh);
    }
    this.collectibleMeshes.clear();
    this.collectibles = [];

    // 3. Reset Road segment positions
    for (let i = 0; i < this.roadSegments.length; i++) {
      this.roadSegments[i].position.z = i * TRACK_SEGMENT_LENGTH;
    }

    // 4. Reset RNG & Player positioning
    this.rng = new SeededRNG(seed);
    this.currentLane = 0;
    this.currentX = 0;
    this.targetX = 0;
    this.playerY = 0.5;
    this.isJumping = false;
    this.isSliding = false;
    this.jumpTimer = 0;
    this.slideTimer = 0;
    this.boardTiltZ = 0;
    this.playerGroup.position.set(0, 0.5, 0);
    this.playerGroup.rotation.set(0, 0, 0);

    // 5. Reset Speed & Distance
    this.totalDistance = 0;
    this.speed = mode === 'rush' ? 38 : BASE_SPEED;
    this.hasMagnet = false;
    this.hasBoost = false;
    this.hasShield = false;

    // 6. Reset Camera
    this.camera.position.set(0, 3.6, -6.8);
    this.camera.lookAt(0, 1.5, 14);
    this.camera.fov = this.baseFOV;
    this.camera.updateProjectionMatrix();

    // 7. Seed fresh track
    this.seedInitialTrack();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }

  private update(dt: number, totalTime: number) {
    // In Menu: gentle floating preview without advancing game or obstacle collision
    if (this.isInMenu) {
      const idleFloatY = 0.5 + Math.sin(totalTime * 2.5) * 0.08;
      this.playerGroup.position.set(0, idleFloatY, 0);
      this.playerGroup.rotation.set(0, 0, Math.sin(totalTime * 1.5) * 0.04);
      this.character.animate(dt, totalTime, 0, false, 0, false, 0, 0);
      return;
    }

    // 1. Acceleration & Distance
    const isBoostActive = this.hasBoost;
    const targetSpeed = isBoostActive 
      ? MAX_SPEED * 1.35 
      : Math.min(MAX_SPEED, BASE_SPEED + (this.totalDistance / 100) * ACCELERATION);

    this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed, dt * 2.5);
    const deltaDist = this.speed * dt;
    this.totalDistance += deltaDist;

    this.callbacks.onScoreUpdate(deltaDist, this.speed);

    // 2. Player Lateral Movement (Smooth X Lerp)
    this.currentX = THREE.MathUtils.lerp(this.currentX, this.targetX, dt * 14);
    this.playerGroup.position.x = this.currentX;

    // Board tilt restoration
    this.boardTiltZ = THREE.MathUtils.lerp(this.boardTiltZ, 0, dt * 8);

    // 3. Jump Physics Arc
    let jumpProgress = 0;
    if (this.isJumping) {
      this.jumpTimer += dt;
      jumpProgress = this.jumpTimer / JUMP_DURATION;

      if (jumpProgress >= 1) {
        this.isJumping = false;
        this.playerY = 0.5;
        this.jumpTimer = 0;
      } else {
        this.playerY = 0.5 + Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;
      }
    } else {
      this.playerY = 0.5;
    }

    // 4. Slide Physics
    let slideProgress = 0;
    if (this.isSliding) {
      this.slideTimer += dt;
      slideProgress = this.slideTimer / SLIDE_DURATION;

      if (slideProgress >= 1) {
        this.isSliding = false;
        this.slideTimer = 0;
      }
    }

    this.playerGroup.position.y = this.playerY;

    // 5. Articulated Character Animations (Running, Jumping, Sliding, Banking)
    this.character.animate(
      dt,
      totalTime,
      this.speed,
      this.isJumping,
      jumpProgress,
      this.isSliding,
      slideProgress,
      this.boardTiltZ
    );

    // 6. Thruster Particle Sparks Update
    const positions = this.thrusterGeo.attributes.position.array as Float32Array;
    for (let i = 2; i < positions.length; i += 3) {
      positions[i] -= dt * (this.speed * 0.85);
      if (positions[i] < -4.0) {
        positions[i] = -0.8;
      }
    }
    this.thrusterGeo.attributes.position.needsUpdate = true;

    // 7. World Scrolling: Move Road & Skyline
    for (const segment of this.roadSegments) {
      segment.position.z -= deltaDist;
      if (segment.position.z < -TRACK_SEGMENT_LENGTH) {
        segment.position.z += this.roadSegments.length * TRACK_SEGMENT_LENGTH;
      }
    }

    // 8. Update Obstacles & Check Collisions
    this.updateObstacles(deltaDist, totalTime);

    // 9. Update Collectibles & Magnet Pull
    this.updateCollectibles(deltaDist, totalTime);

    // 10. Procedural Spawning
    this.lastSpawnZ -= deltaDist;
    if (this.lastSpawnZ < 220) {
      this.spawnPatternAt(this.lastSpawnZ + this.rng.range(32, 48));
      this.lastSpawnZ += 40;
    }

    // 11. Shield & Boost FX
    if (this.hasShield) {
      this.shieldBubbleMesh.visible = true;
      (this.shieldBubbleMesh.material as THREE.MeshStandardMaterial).opacity = 0.65;
      this.shieldBubbleMesh.rotation.y += dt * 2.5;
    } else {
      this.shieldBubbleMesh.visible = false;
    }

    if (this.hasBoost) {
      this.boostAuraMesh.visible = true;
      (this.boostAuraMesh.material as THREE.MeshBasicMaterial).opacity = 0.75;
      this.boostAuraMesh.rotation.z += dt * 9;
    } else {
      this.boostAuraMesh.visible = false;
    }

    // 12. Camera Follow & Dynamic FOV
    const targetFOV = this.baseFOV + (this.speed - BASE_SPEED) * 0.32 + (this.hasBoost ? 12 : 0);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFOV, dt * 4);
    this.camera.updateProjectionMatrix();

    // Camera follow with lateral lag
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.currentX * 0.45, dt * 6);

    // Camera Shake
    if (this.cameraShakeTime > 0) {
      this.cameraShakeTime -= dt;
      const shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.y = 3.6 + shakeY;
    } else {
      this.camera.position.y = 3.6;
    }
  }

  private updateObstacles(deltaDist: number, totalTime: number) {
    const toRemove: number[] = [];

    // Player AABB Bounding Box
    const playerMinX = this.currentX - 0.42;
    const playerMaxX = this.currentX + 0.42;
    const playerMinY = this.playerY;
    const playerMaxY = this.playerY + (this.isSliding ? 0.65 : 1.75);
    const playerMinZ = -1.0;
    const playerMaxZ = 1.0;

    for (const obs of this.obstacles) {
      obs.z -= deltaDist;
      const mesh = this.obstacleMeshes.get(obs.id);

      if (mesh) {
        mesh.position.z = obs.z;

        // Oscillate moving drones
        if (obs.type === 'moving_drone' && obs.oscillationOffset !== undefined) {
          const oscX = Math.sin(totalTime * 3 + obs.oscillationOffset) * (LANE_POSITIONS[-1] * 0.85);
          mesh.position.x = oscX;
        }

        // Obstacle AABB
        const obsX = mesh.position.x;
        const obsMinX = obsX - obs.width / 2;
        const obsMaxX = obsX + obs.width / 2;
        const obsMinZ = obs.z - obs.depth / 2;
        const obsMaxZ = obs.z + obs.depth / 2;

        let obsMinY = 0;
        let obsMaxY = obs.height;

        if (obs.type === 'laser_gate_slide') {
          // Low Clearance gate allows sliding underneath (clearance < 0.85m)
          obsMinY = 0.85;
          obsMaxY = 3.2;
        }

        // Collision Check (AABB Overlap)
        const overlapsX = playerMaxX > obsMinX && playerMinX < obsMaxX;
        const overlapsY = playerMaxY > obsMinY && playerMinY < obsMaxY;
        const overlapsZ = playerMaxZ > obsMinZ && playerMinZ < obsMaxZ;

        if (overlapsX && overlapsY && overlapsZ && !obs.cleared) {
          // HIT!
          obs.cleared = true;
          const absorbed = this.callbacks.onShieldDeflect();

          if (absorbed) {
            this.triggerScreenShake(0.35, 0.25);
          } else {
            audio.playObstacleHit();
            this.triggerScreenShake(0.65, 0.4);
            this.callbacks.onCrash();
            return;
          }
        }

        // Near-Miss Proximity Check
        if (!obs.nearMissChecked && obs.z < 0 && obs.z > -2.8) {
          obs.nearMissChecked = true;
          const distToCenter = Math.abs(this.currentX - obsX);

          // Close dodge (< 1.8m laterally) but safely avoided
          if (distToCenter < 1.85 && !overlapsX) {
            this.callbacks.onNearMiss();
            this.triggerScreenShake(0.12, 0.15);
          }
        }
      }

      // Cleanup past obstacles
      if (obs.z < -25) {
        toRemove.push(obs.id);
      }
    }

    for (const id of toRemove) {
      const mesh = this.obstacleMeshes.get(id);
      if (mesh) {
        this.scene.remove(mesh);
        this.obstacleMeshes.delete(id);
      }
      this.obstacles = this.obstacles.filter(o => o.id !== id);
    }
  }

  private updateCollectibles(deltaDist: number, totalTime: number) {
    const toRemove: number[] = [];
    const magnetActive = this.hasMagnet;
    const magnetRadius = 15;

    for (const item of this.collectibles) {
      item.z -= deltaDist;
      const mesh = this.collectibleMeshes.get(item.id);

      if (mesh && !item.collected) {
        // Spin & Float Animation
        mesh.rotation.y = totalTime * 3 + item.animOffset;
        mesh.position.y = item.y + Math.sin(totalTime * 4 + item.animOffset) * 0.15;

        // Magnet Attraction
        if (magnetActive && item.type === 'orb') {
          const dx = this.currentX - mesh.position.x;
          const dz = 0 - item.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < magnetRadius) {
            mesh.position.x += dx * 0.16;
            item.z += dz * 0.16;
            mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, this.playerY + 0.5, 0.16);
          }
        }

        mesh.position.z = item.z;

        // Pickup Check (Radius < 1.8m)
        const dx = this.currentX - mesh.position.x;
        const dy = (this.playerY + 0.5) - mesh.position.y;
        const dz = 0 - item.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 1.85 * 1.85) {
          item.collected = true;

          if (item.type === 'orb') {
            this.callbacks.onOrbCollect();
          } else if (item.type === 'powerup' && item.powerUpType) {
            const dur = POWERUP_DURATIONS[item.powerUpType];
            this.callbacks.onPowerUpPickup(item.powerUpType, dur);
          }

          this.scene.remove(mesh);
        }
      }

      if (item.z < -18 || item.collected) {
        toRemove.push(item.id);
      }
    }

    for (const id of toRemove) {
      const mesh = this.collectibleMeshes.get(id);
      if (mesh) {
        this.scene.remove(mesh);
        this.collectibleMeshes.delete(id);
      }
      this.collectibles = this.collectibles.filter(c => c.id !== id);
    }
  }

  public setPowerUpState(shield: boolean, magnet: boolean, boost: boolean) {
    this.hasShield = shield;
    this.hasMagnet = magnet;
    this.hasBoost = boost;
  }

  public triggerScreenShake(intensity: number, duration: number) {
    this.cameraShakeIntensity = intensity;
    this.cameraShakeTime = duration;
    this.callbacks.onScreenShake(intensity);
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}
