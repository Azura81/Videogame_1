/**
 * KOMA: Spirit Delivery - Audio Synthesizer & Procedural Music Engine
 * Uses Web Audio API to create authentic cozy Japanese/Sci-Fi sound effects
 * and a memorable, melodic Lo-Fi Zen / Japanese Pentatonic background soundtrack.
 * Zero external audio files required!
 */

const NOTE_FREQS = {
  "D2": 73.42, "G2": 98.00, "A2": 110.00, "Bb2": 116.54,
  "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "Bb3": 233.08,
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "Bb4": 466.16,
  "C5": 523.25, "C#5": 554.37, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "Bb5": 932.33,
  "C6": 1046.50, "D6": 1174.66, "F#6": 1479.98, "E6": 1318.51
};

// Robust 12-TET frequency resolver for any note string (e.g. "B1", "F#3", "C#5", "D7")
function getNoteFreq(note) {
  if (typeof note === "number") return note;
  if (NOTE_FREQS[note]) return NOTE_FREQS[note];
  const noteMap = { "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11 };
  const m = String(note).match(/^([A-G][#b]?)([0-8])$/);
  if (!m) return 440;
  const semitone = noteMap[m[1]] ?? 9;
  const oct = parseInt(m[2], 10);
  const midi = (oct + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// 8-Bar Composition at 76 BPM (128 sixteenth steps, ~25.26s loop)
// Japanese Pentatonic / Hirajōshi + Dm9 / Bbmaj7 / Gm7 / A7 Lo-Fi progression
const BGM_PATTERNS = {
  chords: [
    { step: 0, notes: ["D3", "F3", "A3", "C4", "E4"], dur: 15 },
    { step: 16, notes: ["Bb2", "D3", "F3", "A3"], dur: 15 },
    { step: 32, notes: ["G2", "Bb2", "D3", "F3"], dur: 15 },
    { step: 48, notes: ["A2", "E3", "A3", "D4"], dur: 7 },
    { step: 56, notes: ["A2", "E3", "G3", "C#4"], dur: 7 },
    { step: 64, notes: ["D3", "F3", "A3", "C4", "E4"], dur: 15 },
    { step: 80, notes: ["Bb2", "D3", "F3", "A3"], dur: 15 },
    { step: 96, notes: ["C3", "E3", "G3", "D4"], dur: 15 },
    { step: 112, notes: ["D3", "A3", "D4", "F4"], dur: 15 }
  ],
  bass: [
    { step: 0, note: "D2" }, { step: 6, note: "D2" }, { step: 10, note: "D2" },
    { step: 16, note: "Bb2" }, { step: 22, note: "Bb2" }, { step: 26, note: "Bb2" },
    { step: 32, note: "G2" }, { step: 38, note: "G2" }, { step: 42, note: "G2" },
    { step: 48, note: "A2" }, { step: 54, note: "A2" }, { step: 58, note: "A2" },
    { step: 64, note: "D2" }, { step: 70, note: "D2" }, { step: 74, note: "D2" },
    { step: 80, note: "Bb2" }, { step: 86, note: "Bb2" }, { step: 90, note: "Bb2" },
    { step: 96, note: "C3" }, { step: 102, note: "C3" }, { step: 106, note: "C3" },
    { step: 112, note: "D2" }, { step: 118, note: "D2" }, { step: 122, note: "D2" }
  ],
  lead: [
    // Theme A: The Ancient Shrine Whisper (Catchy, melodic Japanese Pentatonic hook)
    { step: 0, note: "D5", dur: 3 }, { step: 4, note: "F5", dur: 2 }, { step: 6, note: "A5", dur: 2 },
    { step: 8, note: "G5", dur: 2 }, { step: 10, note: "F5", dur: 2 }, { step: 12, note: "D5", dur: 4 },
    { step: 16, note: "E5", dur: 3 }, { step: 19, note: "F5", dur: 1 }, { step: 20, note: "E5", dur: 2 },
    { step: 22, note: "D5", dur: 2 }, { step: 24, note: "C5", dur: 2 }, { step: 26, note: "D5", dur: 6 },
    { step: 32, note: "G4", dur: 2 }, { step: 34, note: "A4", dur: 2 }, { step: 36, note: "C5", dur: 2 },
    { step: 38, note: "D5", dur: 2 }, { step: 40, note: "F5", dur: 3 }, { step: 44, note: "E5", dur: 2 }, { step: 46, note: "D5", dur: 2 },
    { step: 48, note: "E5", dur: 3 }, { step: 52, note: "A4", dur: 3 }, { step: 56, note: "D5", dur: 7 },
    // Theme B: The Kitsune High Flight (Emotional peak & soothing resolution)
    { step: 64, note: "A5", dur: 3 }, { step: 68, note: "G5", dur: 2 }, { step: 70, note: "F5", dur: 2 },
    { step: 72, note: "A5", dur: 2 }, { step: 74, note: "C6", dur: 2 }, { step: 76, note: "A5", dur: 4 },
    { step: 80, note: "F5", dur: 2 }, { step: 82, note: "E5", dur: 2 }, { step: 84, note: "D5", dur: 3 },
    { step: 88, note: "F5", dur: 2 }, { step: 90, note: "E5", dur: 2 }, { step: 92, note: "D5", dur: 4 },
    { step: 96, note: "C5", dur: 2 }, { step: 98, note: "D5", dur: 2 }, { step: 100, note: "E5", dur: 2 },
    { step: 102, note: "G5", dur: 2 }, { step: 104, note: "F5", dur: 2 }, { step: 106, note: "E5", dur: 2 }, { step: 108, note: "D5", dur: 4 },
    { step: 112, note: "C5", dur: 2 }, { step: 114, note: "A4", dur: 2 }, { step: 116, note: "D5", dur: 8 }
  ],
  koto: [
    // Traditional Koto harp arpeggios & accent flourishes
    { step: 2, note: "A4" }, { step: 6, note: "D5" }, { step: 10, note: "F5" }, { step: 14, note: "E5" },
    { step: 18, note: "F4" }, { step: 22, note: "Bb4" }, { step: 26, note: "D5" }, { step: 30, note: "C5" },
    { step: 34, note: "D4" }, { step: 38, note: "G4" }, { step: 42, note: "Bb4" }, { step: 46, note: "D5" },
    { step: 50, note: "E4" }, { step: 54, note: "A4" }, { step: 58, note: "C#4" }, { step: 62, note: "E5" },
    { step: 66, note: "D5" }, { step: 70, note: "F5" }, { step: 74, note: "A5" }, { step: 78, note: "D6" },
    { step: 82, note: "Bb4" }, { step: 86, note: "D5" }, { step: 90, note: "F5" }, { step: 94, note: "A5" },
    { step: 98, note: "G4" }, { step: 102, note: "C5" }, { step: 106, note: "E5" }, { step: 110, note: "G5" },
    { step: 116, note: "D4" }, { step: 119, note: "F4" }, { step: 122, note: "A4" }, { step: 125, note: "D5" }
  ]
};

// Pre-index BGM patterns for O(1) step lookup to eliminate array search overhead
const BGM_LOOKUP = {
  chords: {},
  bass: {},
  lead: {},
  koto: {}
};
BGM_PATTERNS.chords.forEach(c => { BGM_LOOKUP.chords[c.step] = c; });
BGM_PATTERNS.bass.forEach(b => { BGM_LOOKUP.bass[b.step] = b; });
BGM_PATTERNS.lead.forEach(l => { BGM_LOOKUP.lead[l.step] = l; });
BGM_PATTERNS.koto.forEach(k => { BGM_LOOKUP.koto[k.step] = k; });

// --- EISWELT / BERG FUJI WINTER SOUNDTRACK ---
// 8-Bar Composition at 68 BPM (128 sixteenth steps, ~28.24s loop)
// Japanese Hirajōshi in B Minor / D Major: Crystalline Ice Bells, Frosted Glacier Pad, Snow Koto, Sub-Zero Bass
const ICE_BGM_PATTERNS = {
  chords: [
    { step: 0, notes: ["B2", "F#3", "B3", "D4", "F#4", "C#5"], dur: 15 },
    { step: 16, notes: ["A2", "F#3", "B3", "D4", "F#4"], dur: 15 },
    { step: 32, notes: ["G2", "D3", "G3", "B3", "C#4", "F#4"], dur: 15 },
    { step: 48, notes: ["G2", "D3", "B3", "D4", "F#4", "A4"], dur: 15 },
    { step: 64, notes: ["E2", "B2", "E3", "G3", "B3", "D4", "F#4"], dur: 15 },
    { step: 80, notes: ["C#3", "G3", "B3", "E4"], dur: 15 },
    { step: 96, notes: ["F#2", "C#3", "F#3", "B3", "E4"], dur: 7 },
    { step: 104, notes: ["F#2", "C#3", "E3", "A#3", "D4", "G4"], dur: 7 },
    { step: 112, notes: ["B2", "F#3", "B3", "C#4", "F#4", "D5"], dur: 15 }
  ],
  bass: [
    { step: 0, note: "B1" }, { step: 8, note: "B1" },
    { step: 16, note: "A1" }, { step: 24, note: "A1" },
    { step: 32, note: "G1" }, { step: 40, note: "G1" },
    { step: 48, note: "G1" }, { step: 56, note: "F#1" },
    { step: 64, note: "E2" }, { step: 72, note: "E2" },
    { step: 80, note: "C#2" }, { step: 88, note: "C#2" },
    { step: 96, note: "F#1" }, { step: 104, note: "F#1" },
    { step: 112, note: "B1" }, { step: 120, note: "F#1" }
  ],
  lead: [
    // Theme 1: Schneekristalle am Bergfuß (Snow Crystals at the Mountain Base)
    { step: 0, note: "F#5", dur: 4 }, { step: 6, note: "E5", dur: 2 }, { step: 8, note: "D5", dur: 3 },
    { step: 12, note: "C#5", dur: 3 }, { step: 16, note: "D5", dur: 4 }, { step: 22, note: "F#5", dur: 3 },
    { step: 26, note: "B5", dur: 6 },
    // Theme 2: Der gefrorene Wasserfall (The Frozen Waterfall)
    { step: 32, note: "A5", dur: 3 }, { step: 36, note: "F#5", dur: 3 }, { step: 40, note: "D5", dur: 2 },
    { step: 44, note: "E5", dur: 3 }, { step: 48, note: "F#5", dur: 4 }, { step: 54, note: "E5", dur: 2 },
    { step: 56, note: "D5", dur: 6 },
    // Theme 3: Der heilige Gipfelsturm (Ascent to the Sacred Summit)
    { step: 64, note: "B5", dur: 4 }, { step: 70, note: "C#6", dur: 3 }, { step: 74, note: "D6", dur: 3 },
    { step: 78, note: "C#6", dur: 2 }, { step: 80, note: "B5", dur: 4 }, { step: 86, note: "A5", dur: 3 },
    { step: 90, note: "F#5", dur: 5 },
    // Theme 4: Der Geist des Winters / Auflösung (Spirit of the Winter Mountain)
    { step: 96, note: "G5", dur: 3 }, { step: 100, note: "F#5", dur: 3 }, { step: 104, note: "E5", dur: 3 },
    { step: 108, note: "C#5", dur: 3 }, { step: 112, note: "D5", dur: 3 }, { step: 116, note: "F#5", dur: 3 },
    { step: 120, note: "B5", dur: 7 }
  ],
  bells: [
    // Glistening Crystal Ice Chimes (High register sparkle)
    { step: 4, note: "D6" }, { step: 12, note: "F#6" }, { step: 20, note: "B6" }, { step: 28, note: "A6" },
    { step: 36, note: "C#6" }, { step: 44, note: "F#6" }, { step: 52, note: "D6" }, { step: 60, note: "B5" },
    { step: 68, note: "F#6" }, { step: 76, note: "D7" }, { step: 84, note: "C#7" }, { step: 92, note: "A6" },
    { step: 100, note: "G6" }, { step: 108, note: "E6" }, { step: 116, note: "F#6" }, { step: 124, note: "B6" }
  ],
  koto: [
    // Snow Koto Harp Cascade
    { step: 2, note: "F#4" }, { step: 6, note: "B4" }, { step: 10, note: "D5" }, { step: 14, note: "F#5" },
    { step: 18, note: "D4" }, { step: 22, note: "F#4" }, { step: 26, note: "A4" }, { step: 30, note: "D5" },
    { step: 34, note: "G4" }, { step: 38, note: "B4" }, { step: 42, note: "D5" }, { step: 46, note: "F#5" },
    { step: 50, note: "B3" }, { step: 54, note: "D4" }, { step: 58, note: "G4" }, { step: 62, note: "B4" },
    { step: 66, note: "E4" }, { step: 70, note: "G4" }, { step: 74, note: "B4" }, { step: 78, note: "E5" },
    { step: 82, note: "C#4" }, { step: 86, note: "E4" }, { step: 90, note: "G4" }, { step: 94, note: "C#5" },
    { step: 98, note: "F#4" }, { step: 102, note: "A#4" }, { step: 106, note: "C#5" }, { step: 110, note: "E5" },
    { step: 114, note: "B3" }, { step: 118, note: "F#4" }, { step: 122, note: "B4" }, { step: 126, note: "D5" }
  ],
  percussion: [
    // Organic winter powder snow thuds, frozen bamboo clicks, mountain wind whispers
    { step: 0, type: "snow_thud" }, { step: 8, type: "ice_click" }, { step: 10, type: "snow_thud" }, { step: 14, type: "frost_wind" },
    { step: 16, type: "snow_thud" }, { step: 24, type: "ice_click" }, { step: 26, type: "snow_thud" }, { step: 30, type: "frost_wind" },
    { step: 32, type: "snow_thud" }, { step: 40, type: "ice_click" }, { step: 42, type: "snow_thud" }, { step: 46, type: "frost_wind" },
    { step: 48, type: "snow_thud" }, { step: 56, type: "ice_click" }, { step: 58, type: "snow_thud" }, { step: 62, type: "frost_wind" },
    { step: 64, type: "snow_thud" }, { step: 72, type: "ice_click" }, { step: 74, type: "snow_thud" }, { step: 78, type: "frost_wind" },
    { step: 80, type: "snow_thud" }, { step: 88, type: "ice_click" }, { step: 90, type: "snow_thud" }, { step: 94, type: "frost_wind" },
    { step: 96, type: "snow_thud" }, { step: 104, type: "ice_click" }, { step: 106, type: "snow_thud" }, { step: 110, type: "frost_wind" },
    { step: 112, type: "snow_thud" }, { step: 120, type: "ice_click" }, { step: 122, type: "snow_thud" }, { step: 126, type: "frost_wind" }
  ]
};

const ICE_BGM_LOOKUP = {
  chords: {},
  bass: {},
  lead: {},
  bells: {},
  koto: {},
  percussion: {}
};
ICE_BGM_PATTERNS.chords.forEach(c => { ICE_BGM_LOOKUP.chords[c.step] = c; });
ICE_BGM_PATTERNS.bass.forEach(b => { ICE_BGM_LOOKUP.bass[b.step] = b; });
ICE_BGM_PATTERNS.lead.forEach(l => { ICE_BGM_LOOKUP.lead[l.step] = l; });
ICE_BGM_PATTERNS.bells.forEach(b => { ICE_BGM_LOOKUP.bells[b.step] = b; });
ICE_BGM_PATTERNS.koto.forEach(k => { ICE_BGM_LOOKUP.koto[k.step] = k; });
ICE_BGM_PATTERNS.percussion.forEach(p => { ICE_BGM_LOOKUP.percussion[p.step] = p; });

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterMuted = false; // Master Mute (mutes both SFX and BGM)
    this.bgmPlaying = false;
    this.bgmEnabled = true; // User preference for BGM
    this.bgmVolume = 0.16;  // Balanced cozy background volume
    this.sfxVolume = 1.0;   // Full prominent volume for all gameplay sound effects
    this.currentTrack = "default"; // Active BGM theme: "default" (Shrine Zen) or "ice" (Berg Fuji Winter)

    // Sequencer state
    this.step = 0;
    this.nextStepTime = 0;
    this.schedulerTimer = null;
    this.noiseBuffer = null;
    this.activeBgmNodes = new Set(); // O(1) insertion/deletion Set instead of Array

    // Gain nodes
    this.sfxGain = null;
    this.bgmGain = null;

    // Load saved preferences
    if (typeof localStorage !== "undefined") {
      const savedBgm = localStorage.getItem("koma_bgm_enabled");
      if (savedBgm === "false") {
        this.bgmEnabled = false;
      }
      // Clean up legacy mute key so sound effects are enabled cleanly
      if (localStorage.getItem("koma_master_muted") === "true") {
        localStorage.removeItem("koma_master_muted");
      }
      const savedMute = localStorage.getItem("koma_master_muted_v2");
      if (savedMute === "true") {
        this.masterMuted = true;
      }
    }

    // Auto-resume AudioContext and optionally start BGM on first user interaction
    if (typeof window !== "undefined") {
      const startOnGesture = (e) => {
        this.init();
        // If clicking directly on sound or music toggle buttons, let their dedicated click handlers manage state
        if (e && e.target && typeof e.target.closest === "function" && (e.target.closest("#btnMusicToggle") || e.target.closest("#btnSoundToggle"))) {
          window.removeEventListener("pointerdown", startOnGesture);
          window.removeEventListener("keydown", startOnGesture);
          return;
        }
        if (this.bgmEnabled && !this.bgmPlaying && !this.masterMuted) {
          this.startBgm();
        }
        window.removeEventListener("pointerdown", startOnGesture);
        window.removeEventListener("keydown", startOnGesture);
      };
      window.addEventListener("pointerdown", startOnGesture);
      window.addEventListener("keydown", startOnGesture);
    }
  }

  get muted() {
    return this.masterMuted;
  }

  set muted(val) {
    this.masterMuted = !!val;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupAudioGraph();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setupAudioGraph() {
    if (!this.ctx) return;

    // SFX Master Bus (full volume, crisp presence)
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(this.masterMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    this.sfxGain.connect(this.ctx.destination);

    // BGM Master Bus
    this.bgmGain = this.ctx.createGain();
    const targetBgmVol = (this.masterMuted || !this.bgmPlaying) ? 0 : this.bgmVolume;
    this.bgmGain.gain.setValueAtTime(targetBgmVol, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // Pre-generate 1-second white noise buffer for drums & shakers & footstep texture
    const bufferSize = this.ctx.sampleRate;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  // --- Master & Audio Controls ---

  toggleMasterMute() {
    this.init();
    this.masterMuted = !this.masterMuted;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("koma_master_muted_v2", this.masterMuted ? "true" : "false");
    }

    const t = this.ctx ? this.ctx.currentTime : 0;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.cancelScheduledValues(0);
      this.sfxGain.gain.setValueAtTime(this.masterMuted ? 0 : this.sfxVolume, t);
    }

    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(0);
      const bgmTarget = (this.masterMuted || !this.bgmPlaying) ? 0 : this.bgmVolume;
      this.bgmGain.gain.setValueAtTime(bgmTarget, t);
    }

    if (this.masterMuted) {
      this.killActiveBgmNodes();
    } else {
      // When unmuting master, resume BGM if previously enabled
      if (this.bgmEnabled && !this.bgmPlaying) {
        this.startBgm();
      }
    }

    if (window.gameInstance && typeof window.gameInstance.updateAudioButtons === "function") {
      window.gameInstance.updateAudioButtons();
    }

    return this.masterMuted;
  }

  // Backwards compatibility alias for toggleMute()
  toggleMute() {
    return this.toggleMasterMute();
  }

  setMuted(muted) {
    this.masterMuted = !!muted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.cancelScheduledValues(0);
      this.sfxGain.gain.setValueAtTime(this.masterMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(0);
      this.bgmGain.gain.setValueAtTime(this.masterMuted ? 0 : (this.bgmPlaying ? this.bgmVolume : 0), this.ctx.currentTime);
    }
    if (this.masterMuted) {
      this.killActiveBgmNodes();
    }
    return this.masterMuted;
  }

  // --- Background Music (BGM) Controls ---

  startBgm() {
    this.init();
    if (!this.ctx) return;

    // If master was muted, unmute so user gets the music they requested
    if (this.masterMuted) {
      this.masterMuted = false;
      if (this.sfxGain) this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("koma_master_muted_v2", "false");
      }
    }

    this.bgmPlaying = true;
    this.bgmEnabled = true;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("koma_bgm_enabled", "true");
    }

    const t = this.ctx.currentTime;
    if (this.bgmGain) {
      this.bgmGain.gain.cancelScheduledValues(0);
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, t);
    }

    this.step = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.schedulerTimer) clearInterval(this.schedulerTimer);
    // Optimized 45ms scheduler interval with 160ms lookahead (halves CPU timer events while guaranteeing zero audio underrun)
    this.schedulerTimer = setInterval(() => this.scheduleBgm(), 45);

    if (window.gameInstance && typeof window.gameInstance.updateAudioButtons === "function") {
      window.gameInstance.updateAudioButtons();
    }
  }

  stopBgm() {
    this.bgmPlaying = false;
    this.bgmEnabled = false;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("koma_bgm_enabled", "false");
    }

    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    // Immediate 100% reliable silencing
    if (this.ctx && this.bgmGain) {
      this.bgmGain.gain.cancelScheduledValues(0);
      this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }

    this.killActiveBgmNodes();

    if (window.gameInstance && typeof window.gameInstance.updateAudioButtons === "function") {
      window.gameInstance.updateAudioButtons();
    }
  }

  toggleBgm() {
    this.init();
    if (this.bgmPlaying && !this.masterMuted) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  killActiveBgmNodes() {
    const nodes = Array.from(this.activeBgmNodes);
    this.activeBgmNodes.clear();
    nodes.forEach(n => {
      try { n.onended = null; n.stop(); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    });
  }

  registerBgmNode(node) {
    this.activeBgmNodes.add(node);
    node.onended = () => {
      this.activeBgmNodes.delete(node);
    };
  }

  // Smoothly duck BGM volume when triumphant victory chimes play
  duckBgm(targetVol = 0.04, duration = 2.4) {
    if (!this.ctx || !this.bgmGain || !this.bgmPlaying || this.masterMuted) return;
    const t = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(0);
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, t);
    this.bgmGain.gain.linearRampToValueAtTime(targetVol, t + 0.12);
    this.bgmGain.gain.setValueAtTime(targetVol, t + duration);
    this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, t + duration + 0.7);
  }

  // Switch between BGM tracks ("default" or "ice") with smooth crossfade
  setTrack(trackName) {
    const track = (trackName === "ice") ? "ice" : "default";
    if (this.currentTrack === track) return;
    this.currentTrack = track;

    if (this.bgmPlaying && this.ctx && !this.masterMuted) {
      if (this.bgmGain) {
        const t = this.ctx.currentTime;
        this.bgmGain.gain.cancelScheduledValues(0);
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, t);
        this.bgmGain.gain.linearRampToValueAtTime(0.01, t + 0.12);
        this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, t + 0.35);
      }
      setTimeout(() => {
        this.killActiveBgmNodes();
        this.step = 0;
        this.nextStepTime = this.ctx ? this.ctx.currentTime + 0.05 : 0;
      }, 130);
    } else {
      this.step = 0;
    }
  }

  // --- Web Audio Sequencer Lookahead Loop ---

  scheduleBgm() {
    if (!this.ctx || !this.bgmPlaying || this.masterMuted) return;
    const isIce = (this.currentTrack === "ice");
    const bpm = isIce ? 68 : 76;
    const scheduleAheadTime = 0.16; // 160ms lookahead
    const stepDur = 60 / bpm / 4;

    while (this.nextStepTime < this.ctx.currentTime + scheduleAheadTime) {
      const s = this.step;
      const t = this.nextStepTime;

      if (isIce) {
        // --- EISWELT / BERG FUJI WINTER SOUNDTRACK ---
        const chord = ICE_BGM_LOOKUP.chords[s];
        if (chord) {
          this.playIcePad(chord.notes, t, chord.dur * stepDur);
        }

        const b = ICE_BGM_LOOKUP.bass[s];
        if (b) {
          this.playFrostBass(b.note, t, stepDur * 2.8);
        }

        const l = ICE_BGM_LOOKUP.lead[s];
        if (l) {
          this.playIceFlute(l.note, t, l.dur * stepDur);
        }

        const bell = ICE_BGM_LOOKUP.bells[s];
        if (bell) {
          this.playIceBell(bell.note, t);
        }

        const k = ICE_BGM_LOOKUP.koto[s];
        if (k) {
          this.playSnowPluck(k.note, t);
        }

        const p = ICE_BGM_LOOKUP.percussion[s];
        if (p) {
          this.playIceDrum(p.type, t);
        }
      } else {
        // --- DEFAULT SUMMER / SHRINE ZEN SOUNDTRACK ---
        // 1. Chords (Warm Lo-Fi Ambient Pad) - O(1) indexed lookup
        const chord = BGM_LOOKUP.chords[s];
        if (chord) {
          this.playChord(chord.notes, t, chord.dur * stepDur);
        }

        // 2. Sub Bass (Warm low-end pulse) - O(1) indexed lookup
        const b = BGM_LOOKUP.bass[s];
        if (b) {
          this.playBass(b.note, t, stepDur * 2.8);
        }

        // 3. Lead Flute (Shakuhachi Bamboo Flute melody) - O(1) indexed lookup
        const l = BGM_LOOKUP.lead[s];
        if (l) {
          this.playFlute(l.note, t, l.dur * stepDur);
        }

        // 4. Japanese Koto (Plucked harp arpeggios) - O(1) indexed lookup
        const k = BGM_LOOKUP.koto[s];
        if (k) {
          this.playKoto(k.note, t);
        }

        // 5. Chill-Hop Zen Drums
        const barStep = s % 16;
        if (barStep === 0 || barStep === 10) {
          this.playDrum("kick", t);
        }
        if (barStep === 4 || barStep === 12) {
          this.playDrum("snare", t);
        }
        if (s % 2 === 0) {
          this.playDrum("shaker", t);
        }
      }

      this.nextStepTime += stepDur;
      this.step = (this.step + 1) % 128; // 8-bar loop cycle
    }
  }

  // --- Instrument Synthesis Voices ---

  playFlute(note, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const oscHarm = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Gentle breathy vibrato via delayed LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(4.8, startTime);
    lfoGain.gain.setValueAtTime(0, startTime);
    lfoGain.gain.linearRampToValueAtTime(3.2, startTime + 0.18);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(oscHarm.frequency);
    lfo.start(startTime);
    lfo.stop(startTime + duration + 0.25);
    this.registerBgmNode(lfo);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    oscHarm.type = "triangle";
    oscHarm.frequency.setValueAtTime(freq * 2, startTime);
    const harmGain = this.ctx.createGain();
    harmGain.gain.value = 0.22;
    oscHarm.connect(harmGain);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, startTime);
    filter.Q.value = 1.8;

    const attack = 0.08;
    const release = 0.18;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.16, startTime + attack);
    gain.gain.setValueAtTime(0.14, startTime + duration);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

    osc.connect(gain);
    harmGain.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    oscHarm.start(startTime);
    osc.stop(startTime + duration + release + 0.05);
    oscHarm.stop(startTime + duration + release + 0.05);
    this.registerBgmNode(osc);
    this.registerBgmNode(oscHarm);
  }

  playKoto(note, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const oscPluck = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    // Initial finger strike transient
    oscPluck.type = "sine";
    oscPluck.frequency.setValueAtTime(freq * 2.2, startTime);
    oscPluck.frequency.exponentialRampToValueAtTime(freq, startTime + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + 0.4);
    filter.Q.value = 2.5;

    gain.gain.setValueAtTime(0.16, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.75);

    osc.connect(gain);
    oscPluck.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    oscPluck.start(startTime);
    osc.stop(startTime + 0.8);
    oscPluck.stop(startTime + 0.04);
    this.registerBgmNode(osc);
    this.registerBgmNode(oscPluck);
  }

  playChord(notes, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;

    notes.forEach((note) => {
      const freq = getNoteFreq(note);
      if (!freq) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(freq, startTime);
      // Gentle detune
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 1.003, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(540, startTime);
      filter.Q.value = 1.0;

      const attack = 0.35;
      const release = 0.5;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.045, startTime + attack);
      gain.gain.setValueAtTime(0.04, startTime + duration);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(this.bgmGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + release + 0.05);
      osc2.stop(startTime + duration + release + 0.05);
      this.registerBgmNode(osc1);
      this.registerBgmNode(osc2);
    });
  }

  playBass(note, startTime, duration = 0.35) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.05, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.03);

    filter.type = "lowpass";
    filter.frequency.value = 220;

    gain.gain.setValueAtTime(0.24, startTime);
    gain.gain.setValueAtTime(0.20, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
    this.registerBgmNode(osc);
  }

  playDrum(type, startTime) {
    if (!this.ctx || !this.bgmGain) return;

    if (type === "kick") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(115, startTime);
      osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.12);
      gain.gain.setValueAtTime(0.26, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
      this.registerBgmNode(osc);
    } else if (type === "snare") {
      const osc = this.ctx.createOscillator();
      const gainOsc = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, startTime);
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.07);
      gainOsc.gain.setValueAtTime(0.18, startTime);
      gainOsc.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);
      osc.connect(gainOsc);
      gainOsc.connect(this.bgmGain);
      osc.start(startTime);
      osc.stop(startTime + 0.09);
      this.registerBgmNode(osc);

      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1600;
        filter.Q.value = 1.2;
        const gainNoise = this.ctx.createGain();
        gainNoise.gain.setValueAtTime(0.12, startTime);
        gainNoise.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);
        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(this.bgmGain);
        noise.start(startTime);
        noise.stop(startTime + 0.13);
        this.registerBgmNode(noise);
      }
    } else if (type === "shaker") {
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 6500;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.035, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);
        noise.start(startTime);
        noise.stop(startTime + 0.05);
        this.registerBgmNode(noise);
      }
    }
  }

  // --- Ice World (Eiswelt / Fuji Winter) Instrument Synthesis Voices ---

  playIceFlute(note, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const oscHarm = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // High winter vibrato (delayed LFO)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(5.0, startTime);
    lfoGain.gain.setValueAtTime(0, startTime);
    lfoGain.gain.linearRampToValueAtTime(3.8, startTime + 0.14);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(oscHarm.frequency);
    lfo.start(startTime);
    lfo.stop(startTime + duration + 0.25);
    this.registerBgmNode(lfo);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    oscHarm.type = "triangle";
    oscHarm.frequency.setValueAtTime(freq * 2, startTime);
    const harmGain = this.ctx.createGain();
    harmGain.gain.value = 0.18;
    oscHarm.connect(harmGain);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, startTime);
    filter.Q.value = 2.0;

    const attack = 0.07;
    const release = 0.22;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + attack);
    gain.gain.setValueAtTime(0.13, startTime + duration);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

    osc.connect(gain);
    harmGain.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    oscHarm.start(startTime);
    osc.stop(startTime + duration + release + 0.05);
    oscHarm.stop(startTime + duration + release + 0.05);
    this.registerBgmNode(osc);
    this.registerBgmNode(oscHarm);
  }

  playIceBell(note, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    // Dual chime oscillators: fundamental + metallic non-harmonic overtone (2.756x)
    const osc = this.ctx.createOscillator();
    const oscChime = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    oscChime.type = "sine";
    oscChime.frequency.setValueAtTime(freq * 2.756, startTime);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, startTime);
    filter.Q.value = 1.8;

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.35);

    const chimeGain = this.ctx.createGain();
    chimeGain.gain.value = 0.35;
    oscChime.connect(chimeGain);

    osc.connect(gain);
    chimeGain.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    oscChime.start(startTime);
    osc.stop(startTime + 1.4);
    oscChime.stop(startTime + 1.4);
    this.registerBgmNode(osc);
    this.registerBgmNode(oscChime);
  }

  playIcePad(notes, startTime, duration) {
    if (!this.ctx || !this.bgmGain) return;

    notes.forEach((note) => {
      const freq = getNoteFreq(note);
      if (!freq) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(freq, startTime);
      // Delicate stereo chorus shimmer
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 1.0025, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(680, startTime);
      filter.Q.value = 1.4;

      const attack = 0.42;
      const release = 0.65;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.032, startTime + attack);
      gain.gain.setValueAtTime(0.028, startTime + duration);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(this.bgmGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + release + 0.05);
      osc2.stop(startTime + duration + release + 0.05);
      this.registerBgmNode(osc1);
      this.registerBgmNode(osc2);
    });
  }

  playFrostBass(note, startTime, duration = 0.45) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.02, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.04);

    filter.type = "lowpass";
    filter.frequency.value = 160;

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.04);
    gain.gain.setValueAtTime(0.24, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
    this.registerBgmNode(osc);
  }

  playSnowPluck(note, startTime) {
    if (!this.ctx || !this.bgmGain) return;
    const freq = getNoteFreq(note);
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const oscPluck = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    // High crystalline pluck transient
    oscPluck.type = "sine";
    oscPluck.frequency.setValueAtTime(freq * 2.5, startTime);
    oscPluck.frequency.exponentialRampToValueAtTime(freq, startTime + 0.025);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq * 2.2, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + 0.35);
    filter.Q.value = 2.8;

    gain.gain.setValueAtTime(0.14, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

    osc.connect(gain);
    oscPluck.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmGain);

    osc.start(startTime);
    oscPluck.start(startTime);
    osc.stop(startTime + 0.7);
    oscPluck.stop(startTime + 0.03);
    this.registerBgmNode(osc);
    this.registerBgmNode(oscPluck);
  }

  playIceDrum(type, startTime) {
    if (!this.ctx || !this.bgmGain) return;

    if (type === "snow_thud") {
      // Muffled deep footstep in powder snow
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(85, startTime);
      osc.frequency.exponentialRampToValueAtTime(34, startTime + 0.12);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 120;

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
      this.registerBgmNode(osc);
    } else if (type === "ice_click") {
      // Crisp frozen bamboo / icicle snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1720, startTime);
      osc.frequency.exponentialRampToValueAtTime(920, startTime + 0.03);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1400;

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + 0.05);
      this.registerBgmNode(osc);
    } else if (type === "frost_wind") {
      // Cold mountain breeze whisper
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 2200;
        filter.Q.value = 2.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.035, startTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        noise.start(startTime);
        noise.stop(startTime + 0.35);
        this.registerBgmNode(noise);
      }
    }
  }

  // --- Sound Effects (SFX) Controls & Triggers (Crisp, High Presence) ---

  playStep() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Layer 1: Crisp stone-tap click transient (triangle wave, 820Hz -> 280Hz)
    const oscClick = this.ctx.createOscillator();
    const gainClick = this.ctx.createGain();
    oscClick.type = "triangle";
    oscClick.frequency.setValueAtTime(820, t);
    oscClick.frequency.exponentialRampToValueAtTime(280, t + 0.04);
    gainClick.gain.setValueAtTime(0.35, t);
    gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.048);
    oscClick.connect(gainClick);
    gainClick.connect(dest);
    oscClick.start(t);
    oscClick.stop(t + 0.055);

    // Layer 2: Warm stone resonance body thud (sine wave, 240Hz -> 85Hz)
    const oscBody = this.ctx.createOscillator();
    const gainBody = this.ctx.createGain();
    oscBody.type = "sine";
    oscBody.frequency.setValueAtTime(240, t);
    oscBody.frequency.exponentialRampToValueAtTime(85, t + 0.08);
    gainBody.gain.setValueAtTime(0.30, t);
    gainBody.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
    oscBody.connect(gainBody);
    gainBody.connect(dest);
    oscBody.start(t);
    oscBody.stop(t + 0.09);

    // Layer 3: Tactile gravel/garden step noise transient
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2400, t);
      filter.Q.value = 1.4;
      const gainNoise = this.ctx.createGain();
      gainNoise.gain.setValueAtTime(0.14, t);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, t + 0.038);
      noise.connect(filter);
      filter.connect(gainNoise);
      gainNoise.connect(dest);
      noise.start(t);
      noise.stop(t + 0.04);
    }
  }

  playTurn() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Layer 1: Snappy servo motor sweep (triangle wave, 380Hz -> 760Hz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(760, t + 0.08);
    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.09);

    // Layer 2: Shimmer harmonic overtone (sine wave, 760Hz -> 1520Hz)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(760, t);
    osc2.frequency.exponentialRampToValueAtTime(1520, t + 0.07);
    gain2.gain.setValueAtTime(0.18, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(t);
    osc2.stop(t + 0.08);
  }

  // Golden Shrine Delivery & Win Fanfare (Prompt delivery celebration)
  playWin() {
    this.duckBgm(0.03, 2.8); // Smoothly duck background music during victory fanfare

    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // 1. Immediate Sparkling Golden Shrine Bell Chime (Package delivered!)
    const bellNotes = [587.33, 880.00, 1174.66, 1479.98, 1760.00]; // D5, A5, D6, F#6, A6
    bellNotes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + idx * 0.035);
      gain.gain.setValueAtTime(0.32, t + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.035 + 0.52);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t + idx * 0.035);
      osc.stop(t + idx * 0.035 + 0.55);
    });

    // 2. Celebratory Japanese Pentatonic Victory Fanfare Motif
    const notes = [
      { f: 587.33, d: 0.22 }, // D5
      { f: 659.25, d: 0.22 }, // E5
      { f: 698.46, d: 0.22 }, // F5
      { f: 880.00, d: 0.26 }, // A5
      { f: 1046.50, d: 0.32 }, // C6
      { f: 1174.66, d: 0.70 }  // D6
    ];
    let offset = 0.16;
    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, t + offset);
      gain.gain.setValueAtTime(0.36, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + note.d + 0.28);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t + offset);
      osc.stop(t + offset + note.d + 0.32);
      offset += note.d * 0.65;
    });
  }

  playOrb() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Mystical Spirit Lotus Orb pickup chime
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1318.51, t); // E6
    osc.frequency.exponentialRampToValueAtTime(2637.02, t + 0.18); // E7

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1975.53, t); // B6
    osc2.frequency.exponentialRampToValueAtTime(3951.07, t + 0.18); // B7

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.40);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.42);
    osc2.stop(t + 0.42);
  }

  playSwitch() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Layer 1: high crystal ping
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.18);
    gain1.gain.setValueAtTime(0.28, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc1.connect(gain1);
    gain1.connect(dest);
    osc1.start(t);
    osc1.stop(t + 0.26);

    // Layer 2: resonant chime
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(440, t + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(1320, t + 0.35);
    gain2.gain.setValueAtTime(0.22, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.42);
  }

  playGateOpen() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(0.22, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.52);
    });
  }

  playBump() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.15);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playClick() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  playCameraSwivel() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.15);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  playStarChime(starIdx = 0) {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    const freqs = [880, 1174.66, 1760]; // A5, D6, A6
    const f = freqs[starIdx % freqs.length];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, t);
    osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.25);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.42);
  }

  playPortal() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(1240, t + 0.22);
    osc1.frequency.exponentialRampToValueAtTime(440, t + 0.45);

    osc2.frequency.setValueAtTime(640, t);
    osc2.frequency.exponentialRampToValueAtTime(2480, t + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(880, t + 0.45);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.5);
    osc2.stop(t + 0.5);
  }

  playSkinEquip() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Ascending pentatonic chime for shrine wardrobe equip
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + idx * 0.05);
      gain.gain.setValueAtTime(0.25, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.45);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.48);
    });
  }

  playWind() {
    if (this.masterMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    const dest = this.sfxGain || this.ctx.destination;

    // Layer 1: Bandpass filtered noise sweep (gust whoosh)
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 2.2;
      filter.frequency.setValueAtTime(320, t);
      filter.frequency.exponentialRampToValueAtTime(1150, t + 0.16);
      filter.frequency.exponentialRampToValueAtTime(280, t + 0.38);

      const gainNoise = this.ctx.createGain();
      gainNoise.gain.setValueAtTime(0.01, t);
      gainNoise.gain.linearRampToValueAtTime(0.35, t + 0.14);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, t + 0.40);

      noise.connect(filter);
      filter.connect(gainNoise);
      gainNoise.connect(dest);
      noise.start(t);
      noise.stop(t + 0.42);
    }

    // Layer 2: Ethereal flute-like harmonic breeze sweep
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, t);
    osc.frequency.exponentialRampToValueAtTime(880.00, t + 0.16);
    osc.frequency.exponentialRampToValueAtTime(440.00, t + 0.38);
    oscGain.gain.setValueAtTime(0.01, t);
    oscGain.gain.linearRampToValueAtTime(0.12, t + 0.15);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.39);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.40);
  }
}

const Sound = new SoundEngine();
