/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { BoardSkin } from '../types';

/**
 * 3D Subway Surfers style Skater Character & Hoverboard with full joint articulation
 * and dynamic acrobatic animations (running/cruising, jumping, sliding, and banking turns).
 */
export class CharacterModel {
  public rootGroup: THREE.Group;
  public characterGroup: THREE.Group;
  public hoverboardMesh: THREE.Group;

  // Body Parts for Animation
  private headGroup: THREE.Group;
  private capGroup: THREE.Group;
  private torsoGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftForearm: THREE.Group;
  private rightForearm: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;
  private leftShin: THREE.Group;
  private rightShin: THREE.Group;
  private leftShoe: THREE.Mesh;
  private rightShoe: THREE.Mesh;
  private sprayCan: THREE.Group;

  // Board Parts
  private deckMesh: THREE.Mesh;
  private underglowMesh: THREE.Mesh;
  private leftExhaustCore: THREE.Mesh;
  private rightExhaustCore: THREE.Mesh;

  private currentSkin: BoardSkin;

  constructor(skin: BoardSkin) {
    this.currentSkin = skin;
    this.rootGroup = new THREE.Group();

    // 1. Build Hoverboard Deck
    this.hoverboardMesh = this.buildHoverboard();
    this.rootGroup.add(this.hoverboardMesh);

    // 2. Build Subway Surfers Character
    this.characterGroup = this.buildCharacter();
    this.rootGroup.add(this.characterGroup);
  }

  private buildHoverboard(): THREE.Group {
    const group = new THREE.Group();
    const primaryColor = new THREE.Color(this.currentSkin.primaryColor);
    const secondaryColor = new THREE.Color(this.currentSkin.secondaryColor);
    const glowColor = new THREE.Color(this.currentSkin.glowColor);

    // Main Skateboard Deck (Chunky street board with kicktails)
    const deckGeom = new THREE.BoxGeometry(0.85, 0.08, 2.1);
    const deckMat = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      roughness: 0.4,
      metalness: 0.6,
    });
    this.deckMesh = new THREE.Mesh(deckGeom, deckMat);
    this.deckMesh.position.y = 0.04;
    group.add(this.deckMesh);

    // Top Grip Tape
    const gripGeom = new THREE.PlaneGeometry(0.78, 2.0);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.95,
      metalness: 0.1,
    });
    const grip = new THREE.Mesh(gripGeom, gripMat);
    grip.rotation.x = -Math.PI / 2;
    grip.position.y = 0.085;
    group.add(grip);

    // Grip Tape Center Cyber Decal Stripe
    const stripeGeom = new THREE.PlaneGeometry(0.12, 1.8);
    const stripeMat = new THREE.MeshBasicMaterial({ color: primaryColor });
    const stripe = new THREE.Mesh(stripeGeom, stripeMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.y = 0.088;
    group.add(stripe);

    // Underglow Neon Chassis
    const underglowGeom = new THREE.BoxGeometry(0.92, 0.04, 2.18);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.9,
    });
    this.underglowMesh = new THREE.Mesh(underglowGeom, underglowMat);
    this.underglowMesh.position.y = 0.01;
    group.add(this.underglowMesh);

    // Magnetic Repulsor Discs under board (Front & Back)
    const discGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });

    const frontDisc = new THREE.Mesh(discGeom, discMat);
    frontDisc.position.set(0, -0.02, 0.65);
    group.add(frontDisc);

    const backDisc = new THREE.Mesh(discGeom, discMat);
    backDisc.position.set(0, -0.02, -0.65);
    group.add(backDisc);

    // Twin High-Power Plasma Thrusters at rear
    const thrusterGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.42, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });

    const leftThruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    leftThruster.rotation.x = Math.PI / 2;
    leftThruster.position.set(-0.28, -0.02, -0.95);
    group.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    rightThruster.rotation.x = Math.PI / 2;
    rightThruster.position.set(0.28, -0.02, -0.95);
    group.add(rightThruster);

    // Glowing Exhaust Plasma Rings
    const exhaustGeom = new THREE.CircleGeometry(0.12, 16);
    const exhaustMat = new THREE.MeshBasicMaterial({ color: glowColor });

    this.leftExhaustCore = new THREE.Mesh(exhaustGeom, exhaustMat);
    this.leftExhaustCore.position.set(-0.28, -0.02, -1.17);
    this.leftExhaustCore.rotation.y = Math.PI;
    group.add(this.leftExhaustCore);

    this.rightExhaustCore = new THREE.Mesh(exhaustGeom, exhaustMat);
    this.rightExhaustCore.position.set(0.28, -0.02, -1.17);
    this.rightExhaustCore.rotation.y = Math.PI;
    group.add(this.rightExhaustCore);

    return group;
  }

  private buildCharacter(): THREE.Group {
    const charGroup = new THREE.Group();
    charGroup.position.y = 0.08; // Sits right on top of hoverboard deck

    // Materials Palette for Subway Surfers Jake-style character
    const skinToneMat = new THREE.MeshStandardMaterial({
      color: 0xf3c398, // Warm healthy skin tone
      roughness: 0.7,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x4a2a18, // Skater brown hair
      roughness: 0.8,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSkin.primaryColor), // Dynamic cap color
      roughness: 0.5,
    });

    const capBrimMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Dark cap brim
      roughness: 0.4,
    });

    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Vibrant blue street hoodie / denim vest
      roughness: 0.6,
    });

    const innerShirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // White tee
      roughness: 0.8,
    });

    const jeansMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Denim blue jeans
      roughness: 0.7,
    });

    const sneakerWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    const sneakerAccentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.currentSkin.primaryColor),
      roughness: 0.4,
    });

    // ================= 1. TORSO & HOODIE =================
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 0.95;

    // Main chest / hoodie block
    const chestGeom = new THREE.BoxGeometry(0.56, 0.62, 0.34);
    const chest = new THREE.Mesh(chestGeom, hoodieMat);
    this.torsoGroup.add(chest);

    // Inner White T-Shirt Collar / V-neck reveal
    const collarGeom = new THREE.BoxGeometry(0.24, 0.22, 0.36);
    const collar = new THREE.Mesh(collarGeom, innerShirtMat);
    collar.position.set(0, 0.22, 0);
    this.torsoGroup.add(collar);

    // Hoodie Pocket (Kangaroo front pouch)
    const pocketGeom = new THREE.BoxGeometry(0.38, 0.2, 0.38);
    const pocket = new THREE.Mesh(pocketGeom, hoodieMat);
    pocket.position.set(0, -0.15, 0.01);
    this.torsoGroup.add(pocket);

    // Spray Paint Cylinder / Jetpack on Back
    this.sprayCan = new THREE.Group();
    const canGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.52, 16);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Vibrant spray red
      metalness: 0.8,
      roughness: 0.2,
    });
    const canMesh = new THREE.Mesh(canGeom, canMat);
    this.sprayCan.add(canMesh);

    // Spray Can Nozzle & Cap
    const nozzleGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.12, 8);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const nozzle = new THREE.Mesh(nozzleGeom, nozzleMat);
    nozzle.position.y = 0.3;
    this.sprayCan.add(nozzle);

    this.sprayCan.position.set(0, 0.05, -0.24);
    this.sprayCan.rotation.z = -0.15;
    this.torsoGroup.add(this.sprayCan);

    // Backpack Straps over shoulders
    const strapGeom = new THREE.BoxGeometry(0.08, 0.6, 0.38);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const strapL = new THREE.Mesh(strapGeom, strapMat);
    strapL.position.set(-0.18, 0, 0);
    this.torsoGroup.add(strapL);
    const strapR = new THREE.Mesh(strapGeom, strapMat);
    strapR.position.set(0.18, 0, 0);
    this.torsoGroup.add(strapR);

    charGroup.add(this.torsoGroup);

    // ================= 2. HEAD & BACKWARDS CAP =================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.48, 0.02);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.18, 12);
    const neck = new THREE.Mesh(neckGeom, skinToneMat);
    neck.position.y = -0.18;
    this.headGroup.add(neck);

    // Head Base Sphere
    const headGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeom, skinToneMat);
    head.scale.set(1, 1.05, 1.05);
    this.headGroup.add(head);

    // Stylized Skater Eyes
    const eyeGeom = new THREE.SphereGeometry(0.06, 12, 12);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1e1e24 });

    // Left Eye
    const eyeL = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    eyeL.position.set(-0.09, 0.04, 0.22);
    eyeL.scale.set(1, 1.2, 0.6);
    this.headGroup.add(eyeL);

    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), pupilMat);
    pupilL.position.set(-0.09, 0.04, 0.25);
    this.headGroup.add(pupilL);

    // Right Eye
    const eyeR = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    eyeR.position.set(0.09, 0.04, 0.22);
    eyeR.scale.set(1, 1.2, 0.6);
    this.headGroup.add(eyeR);

    const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), pupilMat);
    pupilR.position.set(0.09, 0.04, 0.25);
    this.headGroup.add(pupilR);

    // Skater Eyebrows
    const browGeom = new THREE.BoxGeometry(0.08, 0.025, 0.04);
    const browL = new THREE.Mesh(browGeom, hairMat);
    browL.position.set(-0.09, 0.12, 0.23);
    browL.rotation.z = -0.1;
    this.headGroup.add(browL);

    const browR = new THREE.Mesh(browGeom, hairMat);
    browR.position.set(0.09, 0.12, 0.23);
    browR.rotation.z = 0.1;
    this.headGroup.add(browR);

    // Skater Hair Tufts sticking out
    const hairTuftGeom = new THREE.ConeGeometry(0.08, 0.2, 6);
    const tuft1 = new THREE.Mesh(hairTuftGeom, hairMat);
    tuft1.rotation.x = Math.PI / 3;
    tuft1.position.set(-0.16, 0.08, 0.16);
    this.headGroup.add(tuft1);

    const tuft2 = new THREE.Mesh(hairTuftGeom, hairMat);
    tuft2.rotation.x = Math.PI / 3;
    tuft2.position.set(0.16, 0.08, 0.16);
    this.headGroup.add(tuft2);

    // Backwards Baseball Cap
    this.capGroup = new THREE.Group();
    const capCrownGeom = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capCrown = new THREE.Mesh(capCrownGeom, capMat);
    capCrown.position.y = 0.05;
    this.capGroup.add(capCrown);

    // Backwards Visor / Brim (points backwards along -Z)
    const brimGeom = new THREE.BoxGeometry(0.24, 0.03, 0.2);
    const brim = new THREE.Mesh(brimGeom, capBrimMat);
    brim.position.set(0, 0.08, -0.28);
    brim.rotation.x = -0.15;
    this.capGroup.add(brim);

    // Cap Front Logo / Emblem Badge
    const badgeGeom = new THREE.CircleGeometry(0.06, 12);
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const badge = new THREE.Mesh(badgeGeom, badgeMat);
    badge.position.set(0, 0.16, 0.26);
    this.capGroup.add(badge);

    this.headGroup.add(this.capGroup);

    // Skater DJ Headphones around neck
    const headphoneBandGeom = new THREE.TorusGeometry(0.22, 0.03, 8, 24, Math.PI);
    const headphoneMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const hpBand = new THREE.Mesh(headphoneBandGeom, headphoneMat);
    hpBand.rotation.x = Math.PI / 2;
    hpBand.position.y = -0.14;
    this.headGroup.add(hpBand);

    // Glowing earcups
    const earcupGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12);
    const earcupGlowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.currentSkin.glowColor) });

    const cupL = new THREE.Mesh(earcupGeom, earcupGlowMat);
    cupL.rotation.z = Math.PI / 2;
    cupL.position.set(-0.24, -0.14, 0);
    this.headGroup.add(cupL);

    const cupR = new THREE.Mesh(earcupGeom, earcupGlowMat);
    cupR.rotation.z = Math.PI / 2;
    cupR.position.set(0.24, -0.14, 0);
    this.headGroup.add(cupR);

    charGroup.add(this.headGroup);

    // ================= 3. ARMS & HANDS =================
    // Left Arm (Outstretched balance arm)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.34, 1.2, 0);

    const shoulderGeom = new THREE.SphereGeometry(0.1, 10, 10);
    const shoulderL = new THREE.Mesh(shoulderGeom, hoodieMat);
    this.leftArmGroup.add(shoulderL);

    const bicepGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.28, 10);
    const bicepL = new THREE.Mesh(bicepGeom, hoodieMat);
    bicepL.position.y = -0.14;
    this.leftArmGroup.add(bicepL);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(0, -0.28, 0);

    const forearmGeom = new THREE.CylinderGeometry(0.07, 0.065, 0.28, 10);
    const forearmL = new THREE.Mesh(forearmGeom, skinToneMat);
    forearmL.position.y = -0.14;
    this.leftForearm.add(forearmL);

    const handGeom = new THREE.SphereGeometry(0.07, 8, 8);
    const handL = new THREE.Mesh(handGeom, skinToneMat);
    handL.position.y = -0.3;
    this.leftForearm.add(handL);

    this.leftArmGroup.add(this.leftForearm);
    charGroup.add(this.leftArmGroup);

    // Right Arm (Skater forward pump arm)
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.34, 1.2, 0);

    const shoulderR = new THREE.Mesh(shoulderGeom, hoodieMat);
    this.rightArmGroup.add(shoulderR);

    const bicepR = new THREE.Mesh(bicepGeom, hoodieMat);
    bicepR.position.y = -0.14;
    this.rightArmGroup.add(bicepR);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.set(0, -0.28, 0);

    const forearmR = new THREE.Mesh(forearmGeom, skinToneMat);
    forearmR.position.y = -0.14;
    this.rightForearm.add(forearmR);

    const handR = new THREE.Mesh(handGeom, skinToneMat);
    handR.position.y = -0.3;
    this.rightForearm.add(handR);

    this.rightArmGroup.add(this.rightForearm);
    charGroup.add(this.rightArmGroup);

    // ================= 4. LEGS & SKATER SNEAKERS =================
    // Left Leg (Front Skate Stance Foot)
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.16, 0.65, 0);

    const thighGeom = new THREE.CylinderGeometry(0.11, 0.09, 0.35, 10);
    const thighL = new THREE.Mesh(thighGeom, jeansMat);
    thighL.position.y = -0.16;
    this.leftLegGroup.add(thighL);

    this.leftShin = new THREE.Group();
    this.leftShin.position.set(0, -0.33, 0);

    const shinGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.32, 10);
    const shinL = new THREE.Mesh(shinGeom, jeansMat);
    shinL.position.y = -0.15;
    this.leftShin.add(shinL);

    // Left High-Top Skate Sneaker
    this.leftShoe = this.buildSneaker(sneakerWhiteMat, sneakerAccentMat);
    this.leftShoe.position.set(0, -0.32, 0.06);
    this.leftShin.add(this.leftShoe);

    this.leftLegGroup.add(this.leftShin);
    charGroup.add(this.leftLegGroup);

    // Right Leg (Rear Skate Stance Foot)
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.16, 0.65, 0);

    const thighR = new THREE.Mesh(thighGeom, jeansMat);
    thighR.position.y = -0.16;
    this.rightLegGroup.add(thighR);

    this.rightShin = new THREE.Group();
    this.rightShin.position.set(0, -0.33, 0);

    const shinR = new THREE.Mesh(shinGeom, jeansMat);
    shinR.position.y = -0.15;
    this.rightShin.add(shinR);

    // Right High-Top Skate Sneaker
    this.rightShoe = this.buildSneaker(sneakerWhiteMat, sneakerAccentMat);
    this.rightShoe.position.set(0, -0.32, -0.04);
    this.rightShin.add(this.rightShoe);

    this.rightLegGroup.add(this.rightShin);
    charGroup.add(this.rightLegGroup);

    return charGroup;
  }

  /**
   * Helper to build chunky Subway Surfers style high-top skate sneakers
   */
  private buildSneaker(whiteMat: THREE.Material, accentMat: THREE.Material): THREE.Mesh {
    const group = new THREE.Group();

    // Thick White Rubber Sole
    const soleGeom = new THREE.BoxGeometry(0.18, 0.06, 0.38);
    const sole = new THREE.Mesh(soleGeom, whiteMat);
    sole.position.y = 0.03;
    group.add(sole);

    // Colored Upper Canvas
    const upperGeom = new THREE.BoxGeometry(0.16, 0.14, 0.32);
    const upper = new THREE.Mesh(upperGeom, accentMat);
    upper.position.set(0, 0.11, -0.02);
    group.add(upper);

    // White Rubber Toe Cap
    const toeGeom = new THREE.SphereGeometry(0.085, 10, 8);
    const toe = new THREE.Mesh(toeGeom, whiteMat);
    toe.scale.set(1, 0.7, 1);
    toe.position.set(0, 0.08, 0.12);
    group.add(toe);

    // White Shoelace Tongue & High-top cuff
    const tongueGeom = new THREE.BoxGeometry(0.12, 0.18, 0.1);
    const tongue = new THREE.Mesh(tongueGeom, whiteMat);
    tongue.position.set(0, 0.16, -0.02);
    group.add(tongue);

    return group as unknown as THREE.Mesh;
  }

  /**
   * Update character appearance when a new deck skin is equipped in the garage
   */
  public updateSkin(skin: BoardSkin) {
    this.currentSkin = skin;
    this.rootGroup.remove(this.hoverboardMesh);
    this.rootGroup.remove(this.characterGroup);

    this.hoverboardMesh = this.buildHoverboard();
    this.characterGroup = this.buildCharacter();

    this.rootGroup.add(this.hoverboardMesh);
    this.rootGroup.add(this.characterGroup);
  }

  /**
   * Continuous animation loop driven by delta time and run speed
   */
  public animate(
    dt: number,
    time: number,
    speed: number,
    isJumping: boolean,
    jumpProgress: number,
    isSliding: boolean,
    slideProgress: number,
    laneBankTilt: number
  ) {
    // 1. Hoverboard Hover Pulse
    const hoverFloat = Math.sin(time * 8) * 0.05;
    this.hoverboardMesh.position.y = hoverFloat;

    // 2. Acrobatic State Machine: Sliding > Jumping > Normal Cruising
    if (isSliding) {
      // Dynamic Knee Slide Pose: Drops low to board with knees bent and torso leaned forward
      const t = Math.sin(slideProgress * Math.PI);

      this.characterGroup.position.y = 0.08 - t * 0.35;
      this.torsoGroup.rotation.x = 0.65; // Deep forward lean
      this.torsoGroup.position.y = 0.65;

      this.headGroup.rotation.x = -0.4; // Look up ahead under the barrier
      this.headGroup.position.y = 1.05;

      // Arms tucked low for sliding
      this.leftArmGroup.rotation.set(0.8, 0, -0.5);
      this.rightArmGroup.rotation.set(0.8, 0, 0.5);
      this.leftForearm.rotation.x = -1.2;
      this.rightForearm.rotation.x = -1.2;

      // Legs deeply squatted
      this.leftLegGroup.rotation.set(-1.1, 0, -0.2);
      this.leftShin.rotation.set(1.4, 0, 0);
      this.rightLegGroup.rotation.set(-1.3, 0, 0.2);
      this.rightShin.rotation.set(1.5, 0, 0);

      // Board stays level and flat on slide
      this.hoverboardMesh.rotation.x = 0.05;

    } else if (isJumping) {
      // Ollie / Jump Tuck Pose: Crouches on launch, tucks knees in mid-air, extends for landing
      const arc = Math.sin(jumpProgress * Math.PI);

      this.torsoGroup.rotation.x = -0.15 * arc;
      this.torsoGroup.position.y = 0.95 + arc * 0.1;
      this.headGroup.rotation.x = 0.1 * arc;

      // Arms spread wide for air balance
      this.leftArmGroup.rotation.set(-0.3, 0, -1.0 * arc - 0.3);
      this.rightArmGroup.rotation.set(-0.3, 0, 1.0 * arc + 0.3);
      this.leftForearm.rotation.x = -0.5 * arc;
      this.rightForearm.rotation.x = -0.5 * arc;

      // Knees tucked high to chest during jump peak
      this.leftLegGroup.rotation.set(-0.8 * arc, 0, -0.15);
      this.leftShin.rotation.set(1.1 * arc, 0, 0);
      this.rightLegGroup.rotation.set(-0.9 * arc, 0, 0.15);
      this.rightShin.rotation.set(1.2 * arc, 0, 0);

      // Board kicks up into an athletic ollie angle
      this.hoverboardMesh.rotation.x = -0.28 * Math.sin(jumpProgress * Math.PI);

    } else {
      // Classic Subway Surfers Skater Stance (Front Foot Forward, Rear Foot Angled)
      const strideRate = Math.min(18, speed * 0.4);
      const sway = Math.sin(time * strideRate) * 0.06;
      const legBounce = Math.abs(Math.sin(time * strideRate)) * 0.04;

      this.characterGroup.position.y = 0.08 + hoverFloat;
      this.torsoGroup.position.y = 0.95 - legBounce;
      this.torsoGroup.rotation.y = 0.35 + sway * 0.5; // Angled skater stance
      this.torsoGroup.rotation.z = -laneBankTilt * 0.6;

      this.headGroup.rotation.y = -0.35 - sway * 0.5; // Head stays focused forward down the track
      this.headGroup.rotation.z = laneBankTilt * 0.3;

      // Arms balancing and rhythmically pumping
      this.leftArmGroup.rotation.set(
        -0.2 + Math.sin(time * strideRate) * 0.25,
        0,
        -0.55 - Math.abs(sway)
      );
      this.leftForearm.rotation.x = -0.6 + Math.cos(time * strideRate) * 0.2;

      this.rightArmGroup.rotation.set(
        0.3 - Math.sin(time * strideRate) * 0.25,
        0,
        0.45 + Math.abs(sway)
      );
      this.rightForearm.rotation.x = -0.8 - Math.cos(time * strideRate) * 0.2;

      // Skater Stance Legs: Left leg forward, right leg back
      this.leftLegGroup.rotation.set(-0.25 + sway * 0.5, 0.1, -0.15);
      this.leftShin.rotation.set(0.35 - legBounce * 2, 0, 0);

      this.rightLegGroup.rotation.set(0.2 - sway * 0.5, -0.25, 0.15);
      this.rightShin.rotation.set(0.25 - legBounce * 2, 0, 0);
    }
  }
}
