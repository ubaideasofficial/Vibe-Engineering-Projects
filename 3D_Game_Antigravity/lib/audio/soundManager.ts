// High-performance procedural Web Audio synthesizer engine for Cyberpunk SFX and Ambient Synthwave
class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  private currentStep: number = 0;

  constructor() {
    // Lazy initialize AudioContext upon user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.8;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.85;
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.45;
        this.musicGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, val));
  }

  public setSfxVolume(val: number) {
    this.initContext();
    if (this.sfxGain) this.sfxGain.gain.value = Math.max(0, Math.min(1, val));
  }

  public setMusicVolume(val: number) {
    this.initContext();
    if (this.musicGain) this.musicGain.gain.value = Math.max(0, Math.min(1, val));
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.8;
    }
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public playLaneSwitch() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.22);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playSlide() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.28);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(350, t);
    filter.Q.value = 3.0;

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.31);
  }

  public playOrbCollect(combo: number = 1) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const baseFreq = 587.33; // D5
    const notes = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66]; // Cyberpunk pentatonic
    const note = notes[(combo - 1) % notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note, t);
    osc.frequency.exponentialRampToValueAtTime(note * 1.5, t + 0.18);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  public playPowerup() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880]; // A major triumphant chord
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + idx * 0.05 + 0.25);

      gain.gain.setValueAtTime(0.2, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.36);
    });
  }

  public playShieldHit() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.25);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, t);
    filter.Q.value = 5;

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  public playNearMiss() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.exponentialRampToValueAtTime(1567.98, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.19);
  }

  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.7);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.75);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.8);
  }

  // --- PROCEDURAL SYNTHWAVE MUSIC LOOP ---

  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying || !this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;
    this.currentStep = 0;

    const bassline = [110, 110, 130.81, 110, 146.83, 130.81, 98, 110]; // A2 bass progression
    const arpeggio = [440, 523.25, 659.25, 880, 659.25, 523.25, 440, 392];

    const bpm = 128;
    const stepTime = (60 / bpm) / 2; // 16th notes approx

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted || !this.isMusicPlaying) return;

      const t = this.ctx.currentTime;
      const step = this.currentStep % 16;
      
      // Bass synth on 8th notes
      if (step % 2 === 0) {
        const bassFreq = bassline[(step / 2) % bassline.length];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        const bFilter = this.ctx.createBiquadFilter();

        bOsc.type = "sawtooth";
        bOsc.frequency.setValueAtTime(bassFreq, t);

        bFilter.type = "lowpass";
        bFilter.frequency.setValueAtTime(450, t);
        bFilter.frequency.exponentialRampToValueAtTime(180, t + 0.15);

        bGain.gain.setValueAtTime(0.3, t);
        bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        bOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.musicGain);

        bOsc.start(t);
        bOsc.stop(t + 0.21);
      }

      // Arp synth
      if (step % 2 === 1) {
        const arpFreq = arpeggio[step % arpeggio.length];
        const aOsc = this.ctx.createOscillator();
        const aGain = this.ctx.createGain();

        aOsc.type = "sine";
        aOsc.frequency.setValueAtTime(arpFreq, t);

        aGain.gain.setValueAtTime(0.12, t);
        aGain.gain.exponentialRampToValueAtTime(0.005, t + 0.1);

        aOsc.connect(aGain);
        aGain.connect(this.musicGain);

        aOsc.start(t);
        aOsc.stop(t + 0.11);
      }

      this.currentStep++;
    }, stepTime * 1000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
