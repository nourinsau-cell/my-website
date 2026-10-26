// Web Audio API: 3 Independent Natural Ambient Sounds (Rain, Birds, Wind Gusts)
// + Built-in Library of Soft Romantic Piano Tracks (e.g., 'Tujh Mein Rab Dikhta Hai')
// + User's Custom Uploaded Music Player with IndexedDB persistence!

const AUDIO_DB_NAME = 'NishatCustomMusicDB';
const MUSIC_STORE = 'user_music';

export interface PianoTrack {
  id: string;
  titleBn: string;
  titleEn: string;
  movieOrArtist: string;
  description: string;
}

export const PIANO_LIBRARY_TRACKS: PianoTrack[] = [
  {
    id: 'tujh_mein_rab',
    titleBn: 'তুঝ মে রব দিখতা হ্যায়',
    titleEn: 'Tujh Mein Rab Dikhta Hai (Piano)',
    movieOrArtist: 'রব নে বনা দি জোড়ি · রূপালী পিয়ানো',
    description: 'হৃদয়স্পর্শী রোমান্টিক ধীরগতির অ্যাকোস্টিক পিয়ানো সুর'
  },
  {
    id: 'tum_hi_ho',
    titleBn: 'তুম হি হো',
    titleEn: 'Tum Hi Ho (Aashiqui 2 Piano)',
    movieOrArtist: 'আশিকী ২ · অরিজিৎ সিং',
    description: 'গভীর ভালোবাসা ও বিরহের মায়াবী পিয়ানো নোটস'
  },
  {
    id: 'jao_pakhi',
    titleBn: 'যাও পাখি বলো',
    titleEn: 'Jao Pakhi Bolo (Shreya Ghoshal)',
    movieOrArtist: 'অন্তহীন · শান্তনুর সুর ও শ্রেয়া ঘোষাল',
    description: 'নরম বৃষ্টিভেজা বাংলা রোমান্টিক সুর'
  },
  {
    id: 'tere_hawaale',
    titleBn: 'তেরে হাওয়ালে',
    titleEn: 'Tere Hawaale (Soulful Piano)',
    movieOrArtist: 'লাল সিং চাড্ডা · অরিজিৎ ও শিল্পা',
    description: 'পরম সমর্পণ ও শান্ত অনুরাগের নিভৃত পিয়ানো'
  }
];

function openMusicDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AUDIO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MUSIC_STORE)) {
        db.createObjectStore(MUSIC_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUserSong(blob: Blob, name: string): Promise<void> {
  const db = await openMusicDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MUSIC_STORE, 'readwrite');
    const store = tx.objectStore(MUSIC_STORE);
    store.put({ id: 'current_user_song', blob, name, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUserSong(): Promise<{ blobUrl: string; name: string } | null> {
  try {
    const db = await openMusicDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MUSIC_STORE, 'readonly');
      const store = tx.objectStore(MUSIC_STORE);
      const req = store.get('current_user_song');
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const blobUrl = URL.createObjectURL(req.result.blob);
          resolve({ blobUrl, name: req.result.name });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // 1. Rain Channel
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private isRainOn: boolean = false;
  private rainVol: number = 0.55;

  // 2. Birdsong Channel
  private birdGain: GainNode | null = null;
  private isBirdOn: boolean = false;
  private birdTimer: any = null;
  private birdVol: number = 0.65;

  // 3. Wind Gust Channel
  private windSource: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private isWindOn: boolean = false;
  private windVol: number = 0.5;
  private windLfo: OscillatorNode | null = null;

  // 4. Soft Piano Library Channel (e.g. Tujh Mein Rab Dikhta Hai)
  private pianoGain: GainNode | null = null;
  private isPianoOn: boolean = false;
  private currentPianoTrack: string = 'tujh_mein_rab';
  private pianoTimer: any = null;
  private pianoVol: number = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Rain Gain Node
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.rainVol * 0.45, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      // Bird Gain Node
      this.birdGain = this.ctx.createGain();
      this.birdGain.gain.setValueAtTime(this.birdVol * 0.8, this.ctx.currentTime);
      this.birdGain.connect(this.masterGain);

      // Wind Gain Node
      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(this.windVol * 0.5, this.ctx.currentTime);
      this.windGain.connect(this.masterGain);

      // Piano Library Gain Node
      this.pianoGain = this.ctx.createGain();
      this.pianoGain.gain.setValueAtTime(this.pianoVol * 0.5, this.ctx.currentTime);
      this.pianoGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ================= 1. RAIN CHANNEL =================
  private createRainBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('Context not initialized');
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    let b0_r = 0, b1_r = 0, b2_r = 0, b3_r = 0, b4_r = 0, b5_r = 0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + whiteL * 0.0555179;
      b1 = 0.99332 * b1 + whiteL * 0.0750759;
      b2 = 0.96900 * b2 + whiteL * 0.1538520;
      b3 = 0.86650 * b3 + whiteL * 0.3104856;
      b4 = 0.55000 * b4 + whiteL * 0.5329522;
      b5 = -0.7616 * b5 - whiteL * 0.0168980;
      left[i] = (b0 + b1 + b2 + b3 + b4 + b5 + whiteL * 0.5362) * 0.11;

      const whiteR = Math.random() * 2 - 1;
      b0_r = 0.99886 * b0_r + whiteR * 0.0555179;
      b1_r = 0.99332 * b1_r + whiteR * 0.0750759;
      b2_r = 0.96900 * b2_r + whiteR * 0.1538520;
      b3_r = 0.86650 * b3_r + whiteR * 0.3104856;
      b4_r = 0.55000 * b4_r + whiteR * 0.5329522;
      b5_r = -0.7616 * b5_r - whiteR * 0.0168980;
      right[i] = (b0_r + b1_r + b2_r + b3_r + b4_r + b5_r + whiteR * 0.5362) * 0.11;
    }

    return buffer;
  }

  public toggleRain(): boolean {
    this.initContext();
    if (this.isRainOn) {
      this.stopRain();
      return false;
    } else {
      this.startRain();
      return true;
    }
  }

  public startRain() {
    this.initContext();
    if (this.isRainOn || !this.ctx || !this.rainGain) return;
    try {
      const rainBuffer = this.createRainBuffer();
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = rainBuffer;
      this.rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.rainSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainSource.start();
      this.isRainOn = true;
    } catch {
      // Ignore
    }
  }

  public stopRain() {
    if (!this.isRainOn) return;
    try {
      if (this.rainSource) {
        this.rainSource.stop();
        this.rainSource.disconnect();
        this.rainSource = null;
      }
    } catch {
      // Ignore
    }
    this.isRainOn = false;
  }

  public setRainVolume(vol: number) {
    this.rainVol = Math.max(0, Math.min(1, vol));
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.rainVol * 0.45, this.ctx.currentTime);
    }
  }

  public getIsRainOn(): boolean {
    return this.isRainOn;
  }

  // ================= 2. BIRD SONG CHANNEL =================
  public toggleBird(): boolean {
    this.initContext();
    if (this.isBirdOn) {
      this.stopBird();
      return false;
    } else {
      this.startBird();
      return true;
    }
  }

  public startBird() {
    this.initContext();
    this.isBirdOn = true;
    this.playBirdChirp();
    this.scheduleNextBird();
  }

  public stopBird() {
    this.isBirdOn = false;
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
  }

  private scheduleNextBird() {
    if (!this.isBirdOn) return;
    const interval = Math.random() * 8000 + 5000;
    this.birdTimer = setTimeout(() => {
      if (this.isBirdOn) {
        this.playBirdChirp();
        this.scheduleNextBird();
      }
    }, interval);
  }

  public playBirdChirp() {
    this.initContext();
    if (!this.ctx || !this.birdGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'sine';
      if (panner) {
        panner.pan.value = (Math.random() - 0.5) * 1.5;
        gain.connect(panner);
        panner.connect(this.birdGain);
      } else {
        gain.connect(this.birdGain);
      }

      const baseFreq = 2600 + Math.random() * 700;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 450, now + 0.19);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 350, now + 0.28);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignore
    }
  }

  public setBirdVolume(vol: number) {
    this.birdVol = Math.max(0, Math.min(1, vol));
    if (this.birdGain && this.ctx) {
      this.birdGain.gain.setValueAtTime(this.birdVol * 0.8, this.ctx.currentTime);
    }
  }

  public getIsBirdOn(): boolean {
    return this.isBirdOn;
  }

  // ================= 3. WIND GUST CHANNEL =================
  private createWindBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('Context not initialized');
    const bufferSize = this.ctx.sampleRate * 6;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let lastL = 0;
    let lastR = 0;
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      lastL = (lastL + 0.025 * whiteL) / 1.025;
      lastR = (lastR + 0.025 * whiteR) / 1.025;
      left[i] = lastL * 3.5;
      right[i] = lastR * 3.5;
    }

    return buffer;
  }

  public toggleWind(): boolean {
    this.initContext();
    if (this.isWindOn) {
      this.stopWind();
      return false;
    } else {
      this.startWind();
      return true;
    }
  }

  public startWind() {
    this.initContext();
    if (this.isWindOn || !this.ctx || !this.windGain) return;
    try {
      const windBuffer = this.createWindBuffer();
      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = windBuffer;
      this.windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(420, this.ctx.currentTime);
      this.windFilter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      this.windLfo = this.ctx.createOscillator();
      this.windLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);

      this.windLfo.connect(lfoGain);
      lfoGain.connect(this.windFilter.frequency);

      this.windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);

      this.windSource.start();
      this.windLfo.start();
      this.isWindOn = true;
    } catch {
      // Ignore
    }
  }

  public stopWind() {
    if (!this.isWindOn) return;
    try {
      if (this.windSource) {
        this.windSource.stop();
        this.windSource.disconnect();
        this.windSource = null;
      }
      if (this.windLfo) {
        this.windLfo.stop();
        this.windLfo.disconnect();
        this.windLfo = null;
      }
    } catch {
      // Ignore
    }
    this.isWindOn = false;
  }

  public setWindVolume(vol: number) {
    this.windVol = Math.max(0, Math.min(1, vol));
    if (this.windGain && this.ctx) {
      this.windGain.gain.setValueAtTime(this.windVol * 0.55, this.ctx.currentTime);
    }
  }

  public getIsWindOn(): boolean {
    return this.isWindOn;
  }

  // ================= 4. PIANO SYNTHESIS FOR 'TUJH MEIN RAB DIKHTA HAI' & LIBRARY =================
  private playPianoNote(freq: number, duration: number, delay: number, velocity: number = 0.8) {
    if (!this.ctx || !this.pianoGain || !this.isPianoOn) return;
    try {
      const startTime = this.ctx.currentTime + delay;

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, startTime);

      const noteGain = this.ctx.createGain();
      const gain2 = this.ctx.createGain();
      const gain3 = this.ctx.createGain();

      gain2.gain.setValueAtTime(0.22, startTime);
      gain3.gain.setValueAtTime(0.1, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.24, startTime + 0.006);
      noteGain.gain.exponentialRampToValueAtTime(velocity * 0.08, startTime + 0.35);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(noteGain);
      osc2.connect(gain2);
      gain2.connect(noteGain);
      osc3.connect(gain3);
      gain3.connect(noteGain);

      noteGain.connect(this.pianoGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc3.start(startTime);

      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);
      osc3.stop(startTime + duration + 0.05);
    } catch {
      // Ignore
    }
  }

  private playPianoChord(rootFreq: number, delay: number, duration: number = 3.5) {
    this.playPianoNote(rootFreq, duration, delay, 0.45);
    this.playPianoNote(rootFreq * 1.5, duration * 0.9, delay + 0.12, 0.35);
    this.playPianoNote(rootFreq * 2, duration * 0.8, delay + 0.24, 0.3);
  }

  // --- Track 1: Tujh Mein Rab Dikhta Hai ---
  private playTujhMeinRabSequence(): number {
    const D3 = 146.83, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const Cs5 = 554.37, D5 = 587.33;

    let t = 0;
    this.playPianoChord(D3, t, 3.5);
    // "Tu hi toh jannat meri..."
    this.playPianoNote(Fs4, 0.5, t + 0.0);
    this.playPianoNote(Fs4, 0.5, t + 0.4);
    this.playPianoNote(G4, 0.5, t + 0.8);
    this.playPianoNote(A4, 0.8, t + 1.2);
    this.playPianoNote(A4, 0.6, t + 1.8);
    this.playPianoNote(G4, 0.5, t + 2.3);
    this.playPianoNote(Fs4, 0.9, t + 2.8);

    t += 3.4;
    this.playPianoChord(B3 * 0.5, t, 3.2);
    // "Tu hi mera junoon..."
    this.playPianoNote(E4, 0.5, t + 0.0);
    this.playPianoNote(Fs4, 0.5, t + 0.4);
    this.playPianoNote(G4, 0.7, t + 0.8);
    this.playPianoNote(Fs4, 0.6, t + 1.4);
    this.playPianoNote(E4, 0.5, t + 1.9);
    this.playPianoNote(D4, 1.4, t + 2.4);

    t += 3.4;
    this.playPianoChord(D3, t, 3.5);
    // "Tu hi toh mannat meri..."
    this.playPianoNote(Fs4, 0.5, t + 0.0);
    this.playPianoNote(Fs4, 0.5, t + 0.4);
    this.playPianoNote(G4, 0.5, t + 0.8);
    this.playPianoNote(A4, 0.8, t + 1.2);
    this.playPianoNote(A4, 0.6, t + 1.8);
    this.playPianoNote(G4, 0.5, t + 2.3);
    this.playPianoNote(Fs4, 0.9, t + 2.8);

    t += 3.4;
    this.playPianoChord(A3 * 0.5, t, 3.2);
    // "Tu hi rooh ka sukoon..."
    this.playPianoNote(E4, 0.5, t + 0.0);
    this.playPianoNote(Fs4, 0.5, t + 0.4);
    this.playPianoNote(G4, 0.7, t + 0.8);
    this.playPianoNote(Fs4, 0.6, t + 1.4);
    this.playPianoNote(E4, 0.5, t + 1.9);
    this.playPianoNote(D4, 1.4, t + 2.4);

    // Chorus: "Tujh mein rab dikhta hai, yaara main kya karoon..."
    t += 3.4;
    this.playPianoChord(D3, t, 3.6);
    this.playPianoNote(A4, 0.5, t + 0.0);
    this.playPianoNote(B4, 0.5, t + 0.4);
    this.playPianoNote(Cs5, 0.5, t + 0.8);
    this.playPianoNote(D5, 0.9, t + 1.2);
    this.playPianoNote(Cs5, 0.6, t + 1.8);
    this.playPianoNote(B4, 0.5, t + 2.3);
    this.playPianoNote(A4, 1.2, t + 2.7);

    t += 3.5;
    this.playPianoChord(G3 * 0.5, t, 3.4);
    this.playPianoNote(Fs4, 0.5, t + 0.0);
    this.playPianoNote(G4, 0.5, t + 0.4);
    this.playPianoNote(A4, 0.5, t + 0.8);
    this.playPianoNote(B4, 0.7, t + 1.2);
    this.playPianoNote(A4, 0.5, t + 1.7);
    this.playPianoNote(G4, 0.5, t + 2.1);
    this.playPianoNote(Fs4, 1.4, t + 2.5);

    t += 3.5;
    this.playPianoChord(D3, t, 3.6);
    this.playPianoNote(A4, 0.5, t + 0.0);
    this.playPianoNote(B4, 0.5, t + 0.4);
    this.playPianoNote(Cs5, 0.5, t + 0.8);
    this.playPianoNote(D5, 0.9, t + 1.2);
    this.playPianoNote(Cs5, 0.6, t + 1.8);
    this.playPianoNote(B4, 0.5, t + 2.3);
    this.playPianoNote(A4, 1.2, t + 2.7);

    t += 3.5;
    this.playPianoChord(A3 * 0.5, t, 3.4);
    this.playPianoNote(Fs4, 0.5, t + 0.0);
    this.playPianoNote(G4, 0.5, t + 0.4);
    this.playPianoNote(A4, 0.5, t + 0.8);
    this.playPianoNote(B4, 0.7, t + 1.2);
    this.playPianoNote(A4, 0.5, t + 1.7);
    this.playPianoNote(G4, 0.5, t + 2.1);
    this.playPianoNote(Fs4, 1.4, t + 2.5);

    t += 3.5;
    this.playPianoChord(D3, t, 3.8);
    this.playPianoNote(D4, 0.5, t + 0.0);
    this.playPianoNote(E4, 0.5, t + 0.4);
    this.playPianoNote(Fs4, 0.7, t + 0.8);
    this.playPianoNote(G4, 0.7, t + 1.3);
    this.playPianoNote(Fs4, 0.6, t + 1.9);
    this.playPianoNote(E4, 0.6, t + 2.4);
    this.playPianoNote(D4, 2.4, t + 2.9);

    t += 4.5;
    return t;
  }

  // --- Track 2: Tum Hi Ho ---
  private playTumHiHoSequence(): number {
    const F3 = 174.61, C4 = 261.63, Db4 = 277.18, Eb4 = 311.13, F4 = 349.23, G4 = 392.00, Ab4 = 415.30, Bb4 = 466.16, C5 = 523.25;

    let t = 0;
    this.playPianoChord(F3, t, 3.5);
    this.playPianoNote(F4, 0.5, t + 0.0);
    this.playPianoNote(G4, 0.5, t + 0.4);
    this.playPianoNote(Ab4, 0.7, t + 0.8);
    this.playPianoNote(Bb4, 0.6, t + 1.3);
    this.playPianoNote(Ab4, 0.5, t + 1.8);
    this.playPianoNote(G4, 0.5, t + 2.3);
    this.playPianoNote(F4, 1.2, t + 2.7);

    t += 3.4;
    this.playPianoChord(Db4 * 0.5, t, 3.4);
    this.playPianoNote(Eb4, 0.5, t + 0.0);
    this.playPianoNote(F4, 0.5, t + 0.4);
    this.playPianoNote(G4, 0.7, t + 0.8);
    this.playPianoNote(Ab4, 0.6, t + 1.3);
    this.playPianoNote(G4, 0.5, t + 1.8);
    this.playPianoNote(F4, 0.5, t + 2.3);
    this.playPianoNote(Eb4, 1.4, t + 2.7);

    t += 3.4;
    this.playPianoChord(F3, t, 3.5);
    this.playPianoNote(C4, 0.5, t + 0.0);
    this.playPianoNote(F4, 0.6, t + 0.4);
    this.playPianoNote(G4, 0.6, t + 0.9);
    this.playPianoNote(Ab4, 1.2, t + 1.4);
    this.playPianoNote(G4, 0.6, t + 2.2);
    this.playPianoNote(F4, 1.2, t + 2.7);

    t += 3.4;
    this.playPianoChord(Bb4 * 0.25, t, 3.4);
    this.playPianoNote(Bb4, 0.6, t + 0.0);
    this.playPianoNote(C5, 0.6, t + 0.5);
    this.playPianoNote(Ab4, 0.8, t + 1.0);
    this.playPianoNote(G4, 0.6, t + 1.6);
    this.playPianoNote(F4, 1.6, t + 2.2);

    t += 4.5;
    return t;
  }

  // --- Track 3: Jao Pakhi Bolo ---
  private playJaoPakhiSequence(): number {
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.00, A4 = 440.00, C5 = 523.25;

    let t = 0;
    this.playPianoChord(C4 * 0.5, t, 3.5);
    this.playPianoNote(C4, 0.6, t + 0.0);
    this.playPianoNote(D4, 0.6, t + 0.5);
    this.playPianoNote(E4, 1.0, t + 1.0);
    this.playPianoNote(G4, 1.2, t + 1.8);

    t += 3.2;
    this.playPianoChord(A4 * 0.25, t, 3.4);
    this.playPianoNote(A4, 0.6, t + 0.0);
    this.playPianoNote(G4, 0.6, t + 0.5);
    this.playPianoNote(E4, 0.7, t + 1.0);
    this.playPianoNote(D4, 0.6, t + 1.6);
    this.playPianoNote(C4, 1.5, t + 2.1);

    t += 4.0;
    return t;
  }

  // --- Track 4: Tere Hawaale ---
  private playTereHawaaleSequence(): number {
    const F3 = 174.61, C4 = 261.63, D4 = 293.66, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

    let t = 0;
    this.playPianoChord(F3, t, 3.6);
    this.playPianoNote(F4, 0.6, t + 0.0);
    this.playPianoNote(G4, 0.6, t + 0.5);
    this.playPianoNote(A4, 0.9, t + 1.0);
    this.playPianoNote(Bb4, 0.7, t + 1.6);
    this.playPianoNote(A4, 0.6, t + 2.2);
    this.playPianoNote(G4, 1.2, t + 2.7);

    t += 3.5;
    this.playPianoChord(D4 * 0.5, t, 3.6);
    this.playPianoNote(F4, 0.6, t + 0.0);
    this.playPianoNote(G4, 0.6, t + 0.5);
    this.playPianoNote(A4, 0.8, t + 1.0);
    this.playPianoNote(C5, 1.2, t + 1.6);
    this.playPianoNote(A4, 0.8, t + 2.3);
    this.playPianoNote(F4, 1.4, t + 2.8);

    t += 4.2;
    return t;
  }

  private loopCurrentPianoCycle() {
    if (!this.isPianoOn) return;

    let duration = 30;
    if (this.currentPianoTrack === 'tujh_mein_rab') {
      duration = this.playTujhMeinRabSequence();
    } else if (this.currentPianoTrack === 'tum_hi_ho') {
      duration = this.playTumHiHoSequence();
    } else if (this.currentPianoTrack === 'jao_pakhi') {
      duration = this.playJaoPakhiSequence();
    } else if (this.currentPianoTrack === 'tere_hawaale') {
      duration = this.playTereHawaaleSequence();
    }

    this.pianoTimer = setTimeout(() => {
      if (this.isPianoOn) {
        this.loopCurrentPianoCycle();
      }
    }, duration * 1000);
  }

  public startPianoTrack(trackId: string = 'tujh_mein_rab') {
    this.initContext();
    this.currentPianoTrack = trackId;
    this.isPianoOn = true;
    if (this.pianoTimer) clearTimeout(this.pianoTimer);
    this.loopCurrentPianoCycle();
  }

  public stopPianoTrack() {
    this.isPianoOn = false;
    if (this.pianoTimer) {
      clearTimeout(this.pianoTimer);
      this.pianoTimer = null;
    }
  }

  public togglePianoTrack(trackId?: string): boolean {
    this.initContext();
    if (trackId && trackId !== this.currentPianoTrack) {
      this.currentPianoTrack = trackId;
      this.isPianoOn = true;
      if (this.pianoTimer) clearTimeout(this.pianoTimer);
      this.loopCurrentPianoCycle();
      return true;
    }

    if (this.isPianoOn) {
      this.stopPianoTrack();
      return false;
    } else {
      this.startPianoTrack(trackId || this.currentPianoTrack);
      return true;
    }
  }

  public setPianoVolume(vol: number) {
    this.pianoVol = Math.max(0, Math.min(1, vol));
    if (this.pianoGain && this.ctx) {
      this.pianoGain.gain.setValueAtTime(this.pianoVol * 0.5, this.ctx.currentTime);
    }
  }

  public getIsPianoPlaying(): boolean {
    return this.isPianoOn;
  }

  public getCurrentPianoTrack(): string {
    return this.currentPianoTrack;
  }

  public stopAll() {
    this.stopRain();
    this.stopBird();
    this.stopWind();
    this.stopPianoTrack();
  }
}

export const ambientAudio = new AmbientAudioEngine();
