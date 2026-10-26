import React, { useState, useEffect, useRef } from 'react';
import {
  ambientAudio,
  saveUserSong,
  getUserSong
} from '../utils/ambientAudio';
import { SeasonalAtmosphere, SeasonalMood } from './SeasonalAtmosphere';
import {
  Volume2,
  CloudRain,
  Sparkles,
  Wind,
  Upload,
  Play,
  Pause,
  Trash2,
  Sliders,
  Check,
  X,
  Compass,
  FileAudio,
  EyeOff,
  Eye,
  Minus,
  Radio,
  Music,
  Globe,
  Link2
} from 'lucide-react';
import { ThemeMode } from './Header';

interface AtmosphericSkyProps {
  theme: ThemeMode;
}

export const AtmosphericSky: React.FC<AtmosphericSkyProps> = ({ theme }) => {
  // Seasonal Mood (can be 'none' to turn off completely)
  const [seasonalMood, setSeasonalMood] = useState<SeasonalMood>(() => {
    try {
      const stored = localStorage.getItem('nishat_seasonal_mood');
      return (stored as SeasonalMood) || 'auto';
    } catch {
      return 'auto';
    }
  });

  // User can completely minimize or dock the widget so it never obstructs Nishat Ahmed's name or profile
  const [isWidgetMinimized, setIsWidgetMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nishat_sky_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const handleSetSeasonalMood = (mood: SeasonalMood) => {
    setSeasonalMood(mood);
    try {
      localStorage.setItem('nishat_seasonal_mood', mood);
    } catch {
      // Ignore
    }
  };

  const toggleWidgetMinimized = (val?: boolean) => {
    const next = typeof val === 'boolean' ? val : !isWidgetMinimized;
    setIsWidgetMinimized(next);
    if (next) {
      setShowPlayer(false);
    }
    try {
      localStorage.setItem('nishat_sky_minimized', String(next));
    } catch {
      // Ignore
    }
  };

  // Independent Nature Sound States
  const [isRainOn, setIsRainOn] = useState(false);
  const [isBirdOn, setIsBirdOn] = useState(false);
  const [isWindOn, setIsWindOn] = useState(false);

  // Independent Nature Volumes
  const [rainVol, setRainVol] = useState(0.5);
  const [birdVol, setBirdVol] = useState(0.65);
  const [windVol, setWindVol] = useState(0.5);

  // User Custom Uploaded Music Player State
  const [userSongUrl, setUserSongUrl] = useState<string | null>(null);
  const [userSongName, setUserSongName] = useState<string | null>(null);
  const [isUserSongPlaying, setIsUserSongPlaying] = useState(false);
  const [userSongVol, setUserSongVol] = useState(0.7);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  // Online Music Streaming State
  const onlineTracks = [
    {
      id: 'piano_rain',
      title: 'শান্ত পিয়ানো ও বৃষ্টিভেজা সুর',
      artist: 'Acoustic Piano Melody',
      genre: 'পিয়ানো',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    },
    {
      id: 'bansuri_flute',
      title: 'রাতের বাঁশি ও রাগ ইমন',
      artist: 'Soulful Indian Flute',
      genre: 'বাঁশির সুর',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3'
    },
    {
      id: 'strings_cello',
      title: 'গভীর প্রেম ও নিভৃত বেহালা',
      artist: 'Romantic Strings & Cello',
      genre: 'বেহালা',
      url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_924a49c951.mp3'
    },
    {
      id: 'lofi_night',
      title: 'বৃষ্টির রাতের লো-ফাই চিল বিট',
      artist: 'Midnight Lofi Reading Beats',
      genre: 'লো-ফাই',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3'
    }
  ];

  const [activeOnlineTrackUrl, setActiveOnlineTrackUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('nishat_online_music_url') || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
    } catch {
      return 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
    }
  });

  const [activeOnlineTrackTitle, setActiveOnlineTrackTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('nishat_online_music_title') || 'শান্ত পিয়ানো ও বৃষ্টিভেজা সুর';
    } catch {
      return 'শান্ত পিয়ানো ও বৃষ্টিভেজা সুর';
    }
  });

  const [customOnlineInput, setCustomOnlineInput] = useState('');
  const [isOnlinePlaying, setIsOnlinePlaying] = useState(false);
  const [onlineVol, setOnlineVol] = useState(0.7);
  const onlineAudioRef = useRef<HTMLAudioElement | null>(null);

  // Widget Expansion Modal State
  const [showPlayer, setShowPlayer] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Load saved user music from IndexedDB on startup
  useEffect(() => {
    getUserSong().then((song) => {
      if (song) {
        setUserSongUrl(song.blobUrl);
        setUserSongName(song.name);
      }
    });
  }, []);

  // Auto-init on first click
  useEffect(() => {
    const handleFirstClick = () => {
      if (!userInteracted) {
        setUserInteracted(true);
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [userInteracted]);

  // Close player modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPlayer) {
        setShowPlayer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayer]);

  // Channel 1: Rain
  const handleToggleRain = () => {
    const state = ambientAudio.toggleRain();
    setIsRainOn(state);
  };

  const handleRainVolChange = (val: number) => {
    setRainVol(val);
    ambientAudio.setRainVolume(val);
  };

  // Channel 2: Birds
  const handleToggleBird = () => {
    const state = ambientAudio.toggleBird();
    setIsBirdOn(state);
  };

  const handleBirdVolChange = (val: number) => {
    setBirdVol(val);
    ambientAudio.setBirdVolume(val);
  };

  // Channel 3: Wind Gusts
  const handleToggleWind = () => {
    const state = ambientAudio.toggleWind();
    setIsWindOn(state);
  };

  const handleWindVolChange = (val: number) => {
    setWindVol(val);
    ambientAudio.setWindVolume(val);
  };

  // Channel 4: User Uploaded Music
  const handleUserMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await saveUserSong(file, file.name);
      const url = URL.createObjectURL(file);
      setUserSongUrl(url);
      setUserSongName(file.name);
      setIsUserSongPlaying(true);
      setTimeout(() => {
        if (userAudioRef.current) {
          userAudioRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  const toggleUserSongPlay = () => {
    if (!userAudioRef.current || !userSongUrl) return;
    if (isUserSongPlaying) {
      userAudioRef.current.pause();
      setIsUserSongPlaying(false);
    } else {
      userAudioRef.current.play().then(() => setIsUserSongPlaying(true)).catch(() => {});
    }
  };

  const handleUserSongVolChange = (val: number) => {
    setUserSongVol(val);
    if (userAudioRef.current) {
      userAudioRef.current.volume = val;
    }
  };

  const handleDeleteUserSong = async () => {
    if (userAudioRef.current) {
      userAudioRef.current.pause();
    }
    setIsUserSongPlaying(false);
    setUserSongUrl(null);
    setUserSongName(null);
    try {
      const db = await indexedDB.open('NishatCustomMusicDB');
      db.onsuccess = () => {
        const tx = db.result.transaction('user_music', 'readwrite');
        tx.objectStore('user_music').delete('current_user_song');
      };
    } catch {
      // Ignore
    }
  };

  const handlePlayOnlineTrack = (url: string, title: string) => {
    setActiveOnlineTrackUrl(url);
    setActiveOnlineTrackTitle(title);
    try {
      localStorage.setItem('nishat_online_music_url', url);
      localStorage.setItem('nishat_online_music_title', title);
    } catch {
      // Ignore
    }

    if (onlineAudioRef.current) {
      onlineAudioRef.current.src = url;
      onlineAudioRef.current.load();
      onlineAudioRef.current.play().then(() => {
        setIsOnlinePlaying(true);
      }).catch(() => {
        // Autoplay requires user interaction
      });
    }
  };

  const toggleOnlinePlay = () => {
    if (!onlineAudioRef.current) return;
    if (isOnlinePlaying) {
      onlineAudioRef.current.pause();
      setIsOnlinePlaying(false);
    } else {
      onlineAudioRef.current.play().then(() => {
        setIsOnlinePlaying(true);
      }).catch(() => {
        // Ignore
      });
    }
  };

  const handleOnlineVolChange = (val: number) => {
    setOnlineVol(val);
    if (onlineAudioRef.current) {
      onlineAudioRef.current.volume = val;
    }
  };

  const handleCustomOnlineUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOnlineInput.trim()) return;
    const url = customOnlineInput.trim();
    const title = 'অনলাইন অডিও লিংক · Custom Stream';
    handlePlayOnlineTrack(url, title);
    setCustomOnlineInput('');
  };

  const handleStopAll = () => {
    ambientAudio.stopAll();
    setIsRainOn(false);
    setIsBirdOn(false);
    setIsWindOn(false);
    if (userAudioRef.current) {
      userAudioRef.current.pause();
    }
    setIsUserSongPlaying(false);
    if (onlineAudioRef.current) {
      onlineAudioRef.current.pause();
    }
    setIsOnlinePlaying(false);
  };

  const isAnyPlaying = isRainOn || isBirdOn || isWindOn || isUserSongPlaying || isOnlinePlaying;

  const seasonalOptions = [
    { id: 'auto', labelBn: '🔄 স্বয়ংক্রিয় দৃশ্যচক্র', labelEn: 'Auto Cycle' },
    { id: 'autumn_kashful', labelBn: '🌾 কাশফুল ও শুভ্র তুলো', labelEn: 'Autumn Kashful' },
    { id: 'colorful_lights', labelBn: '✨ নানান রঙের নরম আলো', labelEn: 'Colorful Lights' },
    { id: 'jhirijhiri_rain', labelBn: '🌧️ ঝিরিঝিরি মিষ্টি বৃষ্টি', labelEn: 'Jhirijhiri Rain' },
    { id: 'fireflies_night', labelBn: '🌟 জোনাকি ও শান্ত রাত', labelEn: 'Fireflies & Night' },
    { id: 'spring_leaves', labelBn: '🌸 বসন্তের ঝরা পাতা', labelEn: 'Spring Leaves' },
    { id: 'ocean_waves', labelBn: '🌊 সমুদ্রের মৃদু ঢেউ', labelEn: 'Ocean Waves' },
    { id: 'none', labelBn: '🚫 দৃশ্য বন্ধ (Clean / Off)', labelEn: 'Turn Off Visuals' }
  ];

  return (
    <>
      {/* Visual Live Seasonal Atmosphere Component */}
      <SeasonalAtmosphere theme={theme} forcedMood={seasonalMood} />

      {/* Hidden User Song Audio Element */}
      {userSongUrl && (
        <audio
          ref={userAudioRef}
          src={userSongUrl}
          loop
          onEnded={() => setIsUserSongPlaying(false)}
        />
      )}

      {/* Hidden Online Music Streaming Audio Element */}
      <audio
        ref={onlineAudioRef}
        src={activeOnlineTrackUrl}
        loop
        onEnded={() => setIsOnlinePlaying(false)}
        onPlay={() => setIsOnlinePlaying(true)}
        onPause={() => setIsOnlinePlaying(false)}
      />

      {/* 2. Moonlight in Night Mode */}
      {theme === 'dark' && seasonalMood !== 'jhirijhiri_rain' && (
        <div className="fixed top-20 right-8 sm:right-16 pointer-events-none z-2 animate-in fade-in duration-1000">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-48 h-48 rounded-full bg-purple-400/15 blur-2xl animate-pulse" />
            <div className="absolute w-32 h-32 rounded-full bg-fuchsia-300/20 blur-xl" />

            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-100 via-purple-100 to-white shadow-[0_0_35px_rgba(230,200,255,0.7)] flex items-center justify-center border border-white/60">
              <div className="absolute top-0 right-1 w-11 h-11 rounded-full bg-[#0a0614]/90" />
              <Sparkles className="absolute -top-3 -left-3 w-3.5 h-3.5 text-amber-200 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop overlay so clicking outside closes the modal immediately */}
      {showPlayer && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowPlayer(false)}
          aria-label="স্ক্রিন থেকে বন্ধ করুন"
        />
      )}

      {/* 3. Floating Atmospheric & Sound Mixer Controller elevated higher up for effortless access */}
      <div className="fixed bottom-20 sm:bottom-24 left-3 sm:left-6 z-50 font-ui">
        {showPlayer ? (
          <div className="p-4 rounded-3xl bg-[#130a22]/98 border border-purple-500/50 shadow-2xl backdrop-blur-2xl text-white text-xs w-80 sm:w-92 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 max-h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-purple-200 text-sm">
                  প্রকৃতি ও সুর মিক্সার · Atmosphere & Sound
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleWidgetMinimized(true)}
                  className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors"
                  title="মিনিমাইজ করুন (কোণায় লুকান)"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPlayer(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-purple-900/50 transition-colors"
                  title="বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- SECTION A: ঋতু ও আবহ পরিবর্তন (SEASONAL ATMOSPHERE SELECTOR) --- */}
            <div className="space-y-2 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 block">
                  আকাশের জীবন্ত দৃশ্য:
                </span>
                <button
                  onClick={() => handleSetSeasonalMood(seasonalMood === 'none' ? 'auto' : 'none')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all ${
                    seasonalMood === 'none'
                      ? 'bg-purple-800 text-purple-200 hover:bg-purple-700'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900'
                  }`}
                  title={seasonalMood === 'none' ? 'দৃশ্য চালু করুন' : 'পর্দা থেকে দৃশ্য বন্ধ করুন'}
                >
                  {seasonalMood === 'none' ? (
                    <>
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>দৃশ্য চালু</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-rose-400" />
                      <span>দৃশ্য বন্ধ</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                {seasonalOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSetSeasonalMood(opt.id as SeasonalMood)}
                    className={`p-2 rounded-xl text-left text-[11px] font-medium transition-all ${
                      seasonalMood === opt.id
                        ? 'bg-purple-600 border border-purple-300 text-white font-semibold shadow-sm'
                        : 'bg-purple-950/70 hover:bg-purple-900/60 text-purple-200 border border-purple-900/60'
                    }`}
                  >
                    <span>{opt.labelBn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- SECTION B: প্রকৃতি ও শব্দের আলাদা আলাদা চ্যানেল --- */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-purple-200 block">
                শব্দ নিয়ন্ত্রণ (Sound Mixer — যার যেটা ইচ্ছে শুনুন):
              </span>

              {/* 1. বৃষ্টির শব্দ (RAIN SOUND) */}
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <CloudRain className={`w-3.5 h-3.5 ${isRainOn ? 'text-blue-300 animate-pulse' : 'text-purple-400'}`} />
                    <span>১. বৃষ্টির শব্দ · Rain Sound</span>
                  </span>
                  <button
                    onClick={handleToggleRain}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isRainOn
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/50'
                    }`}
                  >
                    {isRainOn ? 'চালু · ON' : 'বন্ধ · OFF'}
                  </button>
                </div>
                {isRainOn && (
                  <div className="flex items-center gap-2 pt-1">
                    <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={rainVol}
                      onChange={(e) => handleRainVolChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
                    />
                  </div>
                )}
              </div>

              {/* 2. পাখির গান (BIRD SONG) */}
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <Sparkles className={`w-3.5 h-3.5 ${isBirdOn ? 'text-amber-300' : 'text-purple-400'}`} />
                    <span>২. পাখির মিষ্টি ডাক · Bird Song</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => ambientAudio.playBirdChirp()}
                      title="একবার ডাকুন"
                      className="px-2 py-0.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-amber-300 border border-purple-700/50 text-[10px]"
                    >
                      চিঁহ্ ♫
                    </button>
                    <button
                      onClick={handleToggleBird}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isBirdOn
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/50'
                      }`}
                    >
                      {isBirdOn ? 'চালু · ON' : 'বন্ধ · OFF'}
                    </button>
                  </div>
                </div>
                {isBirdOn && (
                  <div className="flex items-center gap-2 pt-1">
                    <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={birdVol}
                      onChange={(e) => handleBirdVolChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                )}
              </div>

              {/* 3. দমকা হাওয়া / নরম বাতাস (WIND GUSTS) */}
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <Wind className={`w-3.5 h-3.5 ${isWindOn ? 'text-emerald-300 animate-pulse' : 'text-purple-400'}`} />
                    <span>৩. দমকা হাওয়া / মিষ্টি বাতাস · Soft Wind</span>
                  </span>
                  <button
                    onClick={handleToggleWind}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isWindOn
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/50'
                    }`}
                  >
                    {isWindOn ? 'চালু · ON' : 'বন্ধ · OFF'}
                  </button>
                </div>
                {isWindOn && (
                  <div className="flex items-center gap-2 pt-1">
                    <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={windVol}
                      onChange={(e) => handleWindVolChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                )}
              </div>

              {/* 4. নিজের পছন্দের গান আপলোড (USER CUSTOM MUSIC UPLOADER) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-fuchsia-950/60 border border-purple-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>৪. আমার পছন্দের গান আপলোড · My Music</span>
                  </span>
                </div>

                <p className="text-[11px] text-purple-200/80 leading-normal font-literary">
                  আপনার ডিভাইস থেকে নিজের পছন্দের যেকোনো গান (MP3, WAV) আপলোড করুন। গল্প পড়ার সময় এটি আপনার ব্যাকগ্রাউন্ডে বাজবে।
                </p>

                {/* Upload Button or Playing State */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="user-bg-music-upload"
                    accept="audio/*"
                    onChange={handleUserMusicUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="user-bg-music-upload"
                    className="flex-grow py-2 px-3 rounded-xl bg-purple-700/60 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{userSongName ? 'গান পরিবর্তন করুন (Change)' : 'গান আপলোড করুন (Upload MP3)'}</span>
                  </label>

                  {userSongUrl && (
                    <>
                      <button
                        onClick={toggleUserSongPlay}
                        className="p-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-md transition-transform active:scale-95"
                        title={isUserSongPlaying ? 'বিরতি · Pause' : 'প্লে করুন · Play'}
                      >
                        {isUserSongPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        onClick={handleDeleteUserSong}
                        className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                        title="আপলোডকৃত গান মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Current Song Details and Volume Slider */}
                {userSongName && (
                  <div className="space-y-1 pt-1 border-t border-purple-900/60">
                    <div className="flex items-center justify-between text-[10px] text-purple-300">
                      <span className="truncate max-w-[200px]">সংরক্ষিত: {userSongName}</span>
                      <span className="font-semibold text-emerald-400">{isUserSongPlaying ? 'বাজছে' : 'স্থগিত'}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={userSongVol}
                        onChange={(e) => handleUserSongVolChange(parseFloat(e.target.value))}
                        className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. অনলাইন থেকে সরাসরি পছন্দের সুর বাজান (ONLINE MUSIC STREAMER) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-indigo-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>৫. অনলাইন থেকে সরাসরি মিউজিক শুনুন · Online Music</span>
                  </span>
                  {isOnlinePlaying && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>অনলাইনে বাজছে</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-purple-200/80 leading-normal font-literary">
                  নিচে পছন্দের অনলাইন সুরে ক্লিক করে সরাসরি চালান অথবা আপনার পছন্দের যেকোনো অনলাইন অডিও লিংক পেস্ট করে শুনুন:
                </p>

                {/* 4 Curated Instant Online Streaming Presets */}
                <div className="grid grid-cols-2 gap-1.5">
                  {onlineTracks.map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => handlePlayOnlineTrack(tr.url, tr.title)}
                      className={`p-2 rounded-xl text-left transition-all ${
                        activeOnlineTrackUrl === tr.url && isOnlinePlaying
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-300'
                          : 'bg-purple-950/70 hover:bg-purple-900/60 text-purple-200 border border-purple-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="truncate">{tr.title}</span>
                        {activeOnlineTrackUrl === tr.url && isOnlinePlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                        )}
                      </div>
                      <span className="text-[9px] text-purple-300/80 block mt-0.5">{tr.genre} · {tr.artist}</span>
                    </button>
                  ))}
                </div>

                {/* Online Custom URL input */}
                <form onSubmit={handleCustomOnlineUrlSubmit} className="pt-1 flex gap-1.5">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-purple-400" />
                    <input
                      type="url"
                      placeholder="যেকোনো অনলাইন অডিও বা গানের লিংক দিন (MP3 URL)..."
                      value={customOnlineInput}
                      onChange={(e) => setCustomOnlineInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-xl border border-purple-800 bg-[#160d26] text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!customOnlineInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>চালান</span>
                  </button>
                </form>

                {/* Online Music Controls & Volume */}
                <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-900/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-purple-200">
                    <span className="truncate max-w-[200px] text-amber-200 font-medium">
                      সুর: {activeOnlineTrackTitle}
                    </span>
                    <button
                      onClick={toggleOnlinePlay}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95"
                    >
                      {isOnlinePlaying ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>বিরতি</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>প্লে করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={onlineVol}
                      onChange={(e) => handleOnlineVolChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-purple-900/60 space-y-2">
              {isAnyPlaying && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-purple-400">
                    চালু: {[isRainOn && 'বৃষ্টি', isBirdOn && 'পাখি', isWindOn && 'বাতাস', isUserSongPlaying && 'গান', isOnlinePlaying && 'অনলাইন সুর'].filter(Boolean).join(' + ')}
                  </span>
                  <button
                    onClick={handleStopAll}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-xs font-medium"
                  >
                    সব বন্ধ করুন (Stop All)
                  </button>
                </div>
              )}

              {/* Explicit Dismiss Button */}
              <button
                onClick={() => setShowPlayer(false)}
                className="w-full py-2.5 rounded-2xl bg-purple-900/70 hover:bg-purple-800 text-purple-100 text-xs font-semibold flex items-center justify-center gap-2 border border-purple-500/40 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <X className="w-4 h-4 text-purple-300" />
                <span>স্ক্রিন থেকে বন্ধ করুন (Close & Dismiss)</span>
              </button>
            </div>
          </div>
        ) : isWidgetMinimized ? (
          <button
            onClick={() => toggleWidgetMinimized(false)}
            className="p-2.5 rounded-full bg-[#150d24]/90 hover:bg-purple-900 border border-purple-500/40 text-purple-300 shadow-xl backdrop-blur-md transition-all active:scale-95 flex items-center justify-center group"
            title="প্রকৃতি ও সুর প্লেয়ার খুলুন · Open Atmosphere & Sound"
          >
            <Compass className="w-4 h-4 text-purple-300 group-hover:text-amber-300" />
          </button>
        ) : (
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#150d24]/95 border border-purple-500/40 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setShowPlayer(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                isAnyPlaying
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white shadow-purple-900/50'
                  : 'text-purple-200 hover:bg-purple-900/50'
              }`}
              title="প্রকৃতি ও সুর কন্ট্রোলার খুলুন"
            >
              {isOnlinePlaying ? (
                <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              ) : isUserSongPlaying ? (
                <Play className="w-3.5 h-3.5 text-fuchsia-300 animate-pulse fill-current" />
              ) : isWindOn ? (
                <Wind className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
              ) : isRainOn ? (
                <CloudRain className="w-3.5 h-3.5 animate-pulse text-blue-300" />
              ) : isBirdOn ? (
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              ) : (
                <Compass className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>প্রকৃতি ও সুর</span>
              {isAnyPlaying && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </button>

            {/* Quick 1-click scene toggle */}
            <button
              onClick={() => handleSetSeasonalMood(seasonalMood === 'none' ? 'auto' : 'none')}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                seasonalMood === 'none'
                  ? 'text-neutral-500 hover:text-purple-300'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
              title={seasonalMood === 'none' ? 'আকাশের দৃশ্য চালু করুন' : 'আকাশের দৃশ্য বন্ধ করুন (Off)'}
            >
              {seasonalMood === 'none' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {/* Quick 1-click minimize to tiny corner dot */}
            <button
              onClick={() => toggleWidgetMinimized(true)}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white"
              title="স্ক্রিন থেকে সরিয়ে রাখুন / মিনিমাইজ করুন (Minimize)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
