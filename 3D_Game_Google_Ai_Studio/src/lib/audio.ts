/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Procedural Web Audio API Sound Synthesizer & Synthwave BGM Engine
 * Zero external audio downloads needed, 100% responsive, high-fidelity sound.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  
  // BGM Synth State
  private isMusicPlaying = false;
  private bgmTimer: number | null = null;
  private currentStep = 0;
  private bpm = 128;
  private musicVolume = 0.6;
  private sfxVolume = 0.8;
  private isMuted = false;
  private isBoostActive = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn('Web Audio API not supported or initialized on this device.');
    }
  }

  private ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(music: number, sfx: number, muted: boolean) {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.isMuted = muted;

    if (this.ctx && this.musicGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setTargetAtTime(muted ? 0 : this.musicVolume * 0.5, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : this.sfxVolume, now, 0.05);
    }
  }

  public setBoostActive(active: boolean) {
    this.isBoostActive = active;
  }

  // ===================== BGM SYNTH ENGINE =====================

  public startBGM() {
    this.ensureContext();
    if (this.isMusicPlaying || !this.ctx) return;
    this.isMusicPlaying = true;
    this.currentStep = 0;
    this.scheduleMusicStep();
  }

  public stopBGM() {
    this.isMusicPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private scheduleMusicStep() {
    if (!this.isMusicPlaying || !this.ctx) return;

    const stepDuration = 60 / (this.bpm * 4); // 16th note in seconds
    const time = this.ctx.currentTime + 0.05;

    this.playSynthStep(this.currentStep, time);

    this.currentStep = (this.currentStep + 1) % 64; // 4 bar loop
    this.bgmTimer = window.setTimeout(() => {
      this.scheduleMusicStep();
    }, stepDuration * 1000);
  }

  private playSynthStep(step: number, time: number) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    const bar = Math.floor(step / 16);
    const sixteenth = step % 16;

    // Chord Roots: E minor (0) -> C major (1) -> G major (2) -> D major (3)
    const roots = [82.41, 65.41, 98.0, 73.42]; // E2, C2, G2, D2
    const currentRoot = roots[bar];

    // 1. Cyberpunk 16th Bassline
    const bassOctave = (sixteenth % 2 === 0) ? 1 : 2;
    const bassFreq = currentRoot * bassOctave * (this.isBoostActive ? 1.5 : 1.0);
    this.synthBassNote(bassFreq, time, 0.1, 0.35);

    // 2. Drum Kit (Synth Kick + Snare + Hi-Hat)
    // Kick on 0, 4, 8, 12 (Four on the floor)
    if (sixteenth % 4 === 0) {
      this.synthKick(time, 0.5);
    }
    // Snare on 4, 12
    if (sixteenth === 4 || sixteenth === 12) {
      this.synthSnare(time, 0.35);
    }
    // Hi-hat on every odd 16th note
    if (sixteenth % 2 === 1) {
      this.synthHiHat(time, sixteenth % 4 === 2 ? 0.25 : 0.15);
    }

    // 3. Arpeggiated Cyber Lead Melody (Steps on 0, 3, 6, 9, 12, 14)
    const arpSteps = [0, 3, 6, 9, 12, 14];
    if (arpSteps.includes(sixteenth)) {
      const scaleOffsets = [1, 1.2, 1.33, 1.5, 1.8]; // Minor Pentatonic
      const offset = scaleOffsets[(sixteenth + bar * 2) % scaleOffsets.length];
      const leadFreq = currentRoot * 4 * offset;
      this.synthLeadNote(leadFreq, time, 0.18, 0.25);
    }
  }

  private synthKick(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private synthSnare(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    
    // Noise component
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(900, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.8, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  private synthHiHat(time: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private synthBassNote(freq: number, time: number, dur: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.isBoostActive ? 1600 : 800, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + dur);

    gain.gain.setValueAtTime(volume * 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  private synthLeadNote(freq: number, time: number, dur: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume * 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  // ===================== SFX ENGINE =====================

  public playLaneSwitch(direction: number) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = direction > 0 ? 300 : 450;
    const endFreq = direction > 0 ? 600 : 250;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    if (pan) {
      pan.pan.setValueAtTime(direction * 0.6, now);
      osc.connect(pan);
      pan.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playJump() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playSlide() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playOrbCollect(streak: number = 1) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 523.25; // C5
    const pitchMultiplier = 1 + (streak % 8) * 0.12;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * pitchMultiplier * 1.5, now + 0.09);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playPowerUpPickup() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Arpeggiated 3-chord flourish
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = now + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  public playNearMiss() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playShieldDeflect() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  public playObstacleHit() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Sub rumble + noise burst
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  public playButtonClick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playGameOver() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const freqs = [392.00, 349.23, 311.13, 261.63]; // G4 -> F4 -> Eb4 -> C4
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = now + i * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  public playFanfare() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, noteTime);

      gain.gain.setValueAtTime(0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  }
}

export const audio = new AudioManager();
