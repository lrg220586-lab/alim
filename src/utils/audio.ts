// Tactile Web Audio API sound effects + Coldplay "Sparks" background track
// with support for user-uploaded custom audio files.

const DEFAULT_SPARKS_URL = '/assets/aistudio/Coldplay_-_Sparks__2__af3ef2f0.mp3';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicPlaying = false;
  private loopTimer: number | null = null;
  private stepIndex = 0;

  private audioEl: HTMLAudioElement | null = null;
  private customObjectUrl: string | null = null;
  private useSynthFallback = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioEl) {
      const audio = new Audio(DEFAULT_SPARKS_URL);
      audio.loop = true;
      audio.volume = 0.55;
      audio.preload = 'auto';
      audio.muted = this.muted;
      audio.addEventListener('error', () => {
        this.useSynthFallback = true;
      });
      this.audioEl = audio;
    }
    return this.audioEl;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public setCustomTrack(objectUrl: string) {
    this.stopMusic();
    if (this.customObjectUrl) {
      URL.revokeObjectURL(this.customObjectUrl);
    }
    this.customObjectUrl = objectUrl;
    this.useSynthFallback = false;

    const audio = new Audio(objectUrl);
    audio.loop = true;
    audio.volume = 0.55;
    audio.muted = this.muted;
    this.audioEl = audio;
    void this.startMusic();
  }

  public async startMusic(): Promise<boolean> {
    if (this.musicPlaying) return true;
    this.musicPlaying = true;

    const audio = this.ensureAudioElement();
    if (audio && !this.useSynthFallback) {
      try {
        audio.muted = this.muted;
        await audio.play();
        return true;
      } catch {
        // Fallback to synthesized arpeggio if audio element fails
        if (!this.useSynthFallback) {
          this.musicPlaying = false;
          return false;
        }
      }
    }

    const ctx = this.ensureContext();
    if (!ctx) {
      this.musicPlaying = false;
      return false;
    }

    const pattern = [
      293.66, 369.99, 440.0, 554.37, 440.0, 369.99,
      246.94, 329.63, 369.99, 493.88, 369.99, 329.63,
      196.0, 293.66, 369.99, 493.88, 369.99, 293.66,
      220.0, 293.66, 369.99, 440.0, 369.99, 293.66,
    ];

    const playNextNote = () => {
      if (!this.musicPlaying) return;
      if (!this.muted && this.ctx) {
        const freq = pattern[this.stepIndex % pattern.length];
        this.playFeltNote(freq, 0.055, 1.35);
      }
      this.stepIndex += 1;
      this.loopTimer = window.setTimeout(playNextNote, 460);
    };

    playNextNote();
    return true;
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  public async toggleMusic(): Promise<boolean> {
    if (this.musicPlaying) {
      this.stopMusic();
      return false;
    }
    return this.startMusic();
  }

  private playFeltNote(freq: number, peakGain: number, duration: number) {
    const ctx = this.ctx;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.04);
    overtone.stop(now + duration + 0.04);
  }

  public playPop() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitchJitter = 0.9 + Math.random() * 0.24;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(290 * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(720 * pitchJitter, now + 0.016);
    osc.frequency.exponentialRampToValueAtTime(125 * pitchJitter, now + 0.055);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.24, now + 0.005);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);

    const bufferSize = Math.floor(ctx.sampleRate * 0.022);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1900 * pitchJitter, now);
    bandpass.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  public playMissionComplete() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      window.setTimeout(() => {
        if (!this.muted) {
          this.playFeltNote(freq, 0.08, 0.9);
        }
      }, idx * 85);
    });
  }

  public playEnvelopePopup() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.playFeltNote(392.0, 0.05, 0.55);
    window.setTimeout(() => {
      if (!this.muted) {
        this.playFeltNote(523.25, 0.05, 0.65);
      }
    }, 65);
  }

  public playOpenNote() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Soft paper slide sound
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(0.9, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    this.playFeltNote(440, 0.06, 0.8);
    window.setTimeout(() => {
      if (!this.muted) this.playFeltNote(554.37, 0.06, 0.9);
    }, 70);
    window.setTimeout(() => {
      if (!this.muted) this.playFeltNote(659.25, 0.06, 1.0);
    }, 140);
  }

  public playSparkle(active: boolean) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const base = active ? 783.99 : 587.33;
    this.playFeltNote(base, 0.055, 0.45);
    if (active) {
      window.setTimeout(() => {
        if (!this.muted) this.playFeltNote(base * 1.25, 0.05, 0.5);
      }, 55);
    }
  }
}

export const soundEngine = new SoundEngine();
