import React, { useState, useEffect, useRef } from 'react';
import {
  ambientAudio,
  PIANO_LIBRARY_TRACKS,
  PianoTrack,
  saveUserSong,
  getUserSong
} from '../utils/ambientAudio';
import {
  Music,
  Play,
  Pause,
  Upload,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  X,
  FileAudio,
  Sparkles,
  Trash2,
  Heart,
  Sliders,
  Check
} from 'lucide-react';

interface ChapterMiniAudioPlayerProps {
  storyTitle?: string;
  chapterTitle?: string;
}

export const ChapterMiniAudioPlayer: React.FC<ChapterMiniAudioPlayerProps> = ({
  storyTitle,
  chapterTitle
}) => {
  // Mode: 'piano_library' or 'custom_upload'
  const [activeTab, setActiveTab] = useState<'piano' | 'upload'>('piano');

  // Mini-player expansion state (collapsed by default, or auto-expandable)
  const [isExpanded, setIsExpanded] = useState(false);

  // Soft Piano Library State
  const [selectedPianoTrack, setSelectedPianoTrack] = useState<string>('tujh_mein_rab');
  const [isPianoPlaying, setIsPianoPlaying] = useState<boolean>(false);
  const [pianoVolume, setPianoVolume] = useState<number>(0.65);

  // Custom User Upload State
  const [userSongUrl, setUserSongUrl] = useState<string | null>(null);
  const [userSongName, setUserSongName] = useState<string | null>(null);
  const [isUserSongPlaying, setIsUserSongPlaying] = useState<boolean>(false);
  const [userSongVolume, setUserSongVolume] = useState<number>(0.7);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load custom music from IndexedDB on startup
  useEffect(() => {
    getUserSong().then((data) => {
      if (data) {
        setUserSongUrl(data.blobUrl);
        setUserSongName(data.name);
      }
    });

    return () => {
      ambientAudio.stopPianoTrack();
    };
  }, []);

  // --- Piano Library Handlers ---
  const handleTogglePiano = (trackId?: string) => {
    const targetId = trackId || selectedPianoTrack;
    setSelectedPianoTrack(targetId);

    // Stop custom song if playing to avoid cacophony
    if (isUserSongPlaying && userAudioRef.current) {
      userAudioRef.current.pause();
      setIsUserSongPlaying(false);
    }

    const playingState = ambientAudio.togglePianoTrack(targetId);
    setIsPianoPlaying(playingState);
  };

  const handlePianoVolumeChange = (vol: number) => {
    setPianoVolume(vol);
    ambientAudio.setPianoVolume(vol);
  };

  // --- Custom Song Handlers ---
  const handleUploadUserSong = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await saveUserSong(file, file.name);
      const url = URL.createObjectURL(file);
      setUserSongUrl(url);
      setUserSongName(file.name);

      // Stop piano track if playing
      if (isPianoPlaying) {
        ambientAudio.stopPianoTrack();
        setIsPianoPlaying(false);
      }

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
      // Stop piano if playing
      if (isPianoPlaying) {
        ambientAudio.stopPianoTrack();
        setIsPianoPlaying(false);
      }
      userAudioRef.current.play().then(() => setIsUserSongPlaying(true)).catch(() => {});
    }
  };

  const handleUserSongVolumeChange = (vol: number) => {
    setUserSongVolume(vol);
    if (userAudioRef.current) {
      userAudioRef.current.volume = vol;
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

  const handleStopAll = () => {
    ambientAudio.stopPianoTrack();
    setIsPianoPlaying(false);
    if (userAudioRef.current) {
      userAudioRef.current.pause();
    }
    setIsUserSongPlaying(false);
  };

  const isAnyMusicActive = isPianoPlaying || isUserSongPlaying;

  const currentTrackInfo = PIANO_LIBRARY_TRACKS.find((t) => t.id === selectedPianoTrack);

  return (
    <>
      {/* Hidden User Audio Element */}
      {userSongUrl && (
        <audio
          ref={userAudioRef}
          src={userSongUrl}
          loop
          onEnded={() => setIsUserSongPlaying(false)}
        />
      )}

      {/* Persistent Mini Audio Player Component at Bottom of ChapterReader */}
      <aside
        aria-label="পাঠকালীন সুর ও অডিও প্লেয়ার"
        className="fixed bottom-4 right-4 sm:right-8 z-40 font-ui"
      >
        {isExpanded ? (
          /* ================= EXPANDED CARD ================= */
          <div className="w-[320px] sm:w-[360px] bg-[#140b22]/98 text-white rounded-3xl border border-purple-500/50 shadow-2xl backdrop-blur-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in slide-in-from-bottom-3 max-h-[85vh] overflow-y-auto">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <div>
                  <h4 className="text-xs font-bold text-purple-100 leading-none">
                    পাঠকালীন ব্যাকগ্রাউন্ড সুর
                  </h4>
                  <span className="text-[10px] text-purple-400 font-sans">
                    Reading Background Music
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
                  title="সংকুচিত করুন · Minimize"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Selection: Soft Piano Library vs Custom Upload */}
            <div className="flex items-center p-1 rounded-2xl bg-purple-950/60 border border-purple-900/80">
              <button
                onClick={() => setActiveTab('piano')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'piano'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>পিয়ানো লাইব্রেরি</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>নিজের গান আপলোড</span>
              </button>
            </div>

            {/* ================= TAB 1: SOFT PIANO TRACKS LIBRARY ================= */}
            {activeTab === 'piano' && (
              <div className="space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-purple-300">
                  <span>ধীরগতির মিষ্টি রোমান্টিক পিয়ানো সুর:</span>
                  {isPianoPlaying && (
                    <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      বাজছে · Playing
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {PIANO_LIBRARY_TRACKS.map((track) => {
                    const isCurrent = selectedPianoTrack === track.id;
                    const isThisPlaying = isCurrent && isPianoPlaying;

                    return (
                      <div
                        key={track.id}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-purple-900/60 border-purple-400 text-white'
                            : 'bg-purple-950/30 hover:bg-purple-900/40 border-purple-900/60 text-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-grow">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold truncate text-amber-200">
                                {track.titleBn}
                              </span>
                              {track.id === 'tujh_mein_rab' && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-sans">
                                  জনপ্রিয়
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-purple-300/80 truncate mt-0.5">
                              {track.movieOrArtist}
                            </p>
                          </div>

                          <button
                            onClick={() => handleTogglePiano(track.id)}
                            className={`p-2 rounded-full shadow-xs transition-transform active:scale-95 shrink-0 ${
                              isThisPlaying
                                ? 'bg-amber-400 text-purple-950 hover:bg-amber-300'
                                : 'bg-purple-700 hover:bg-purple-600 text-white'
                            }`}
                            title={isThisPlaying ? 'বিরতি' : 'বাজান'}
                          >
                            {isThisPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Piano Volume Slider */}
                <div className="pt-2 flex items-center gap-2 border-t border-purple-900/60">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={pianoVolume}
                    onChange={(e) => handlePianoVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    title="পিয়ানো ভলিউম"
                  />
                  <span className="text-[10px] text-purple-400 font-mono w-7 text-right">
                    {Math.round(pianoVolume * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* ================= TAB 2: CUSTOM SONG UPLOADER ================= */}
            {activeTab === 'upload' && (
              <div className="space-y-3 animate-in fade-in">
                <p className="text-[11px] text-purple-200/80 leading-relaxed font-literary">
                  আপনার মোবাইল বা পিসি থেকে প্রিয় গান (MP3/WAV) যুক্ত করুন। আপনি যতগুলো অধ্যায়ই পড়েন না কেন, ব্যাকগ্রাউন্ডে এই গানটি চলতে থাকবে।
                </p>

                <div className="space-y-2">
                  <input
                    type="file"
                    id="mini-player-custom-upload"
                    accept="audio/*"
                    onChange={handleUploadUserSong}
                    className="hidden"
                  />

                  <label
                    htmlFor="mini-player-custom-upload"
                    className="w-full py-2.5 px-3 rounded-2xl bg-purple-700/60 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {userSongName ? 'অন্য গান আপলোড করুন (Change)' : 'অডিও ফাইল নির্বাচন করুন (Upload Song)'}
                    </span>
                  </label>

                  {userSongName && (
                    <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-800/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileAudio className="w-4 h-4 text-fuchsia-400 shrink-0" />
                          <span className="text-xs font-semibold text-purple-100 truncate">
                            {userSongName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={toggleUserSongPlay}
                            className={`p-2 rounded-full transition-transform active:scale-95 ${
                              isUserSongPlaying
                                ? 'bg-fuchsia-500 text-white'
                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                            }`}
                            title={isUserSongPlaying ? 'বিরতি' : 'প্লে করুন'}
                          >
                            {isUserSongPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>

                          <button
                            onClick={handleDeleteUserSong}
                            className="p-1.5 text-rose-400 hover:text-rose-300"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* User Song Volume */}
                      <div className="flex items-center gap-2 pt-1 border-t border-purple-900/60">
                        <Volume2 className="w-3 h-3 text-purple-400 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={userSongVolume}
                          onChange={(e) => handleUserSongVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
                        />
                        <span className="text-[10px] text-purple-400 font-mono w-7 text-right">
                          {Math.round(userSongVolume * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Global Stop Action */}
            {isAnyMusicActive && (
              <div className="pt-2 border-t border-purple-900/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-purple-300 truncate max-w-[200px]">
                  সুর: {isPianoPlaying ? currentTrackInfo?.titleBn : userSongName}
                </span>

                <button
                  onClick={handleStopAll}
                  className="px-3 py-1 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[11px] font-semibold transition-colors"
                >
                  সুর থামান (Stop)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================= COLLAPSED MINI PILL ================= */
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#120a20]/95 border border-purple-500/50 shadow-xl backdrop-blur-xl text-white">
            <button
              onClick={() => {
                if (isAnyMusicActive) {
                  handleStopAll();
                } else {
                  handleTogglePiano('tujh_mein_rab');
                }
              }}
              className={`p-2.5 rounded-full transition-transform active:scale-95 shadow-md flex items-center justify-center ${
                isAnyMusicActive
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
                  : 'bg-purple-900/70 hover:bg-purple-800 text-purple-200'
              }`}
              title={isAnyMusicActive ? 'সুর থামান · Pause' : 'তুঝ মে রব দিখতা হ্যায় পিয়ানো বাজান'}
            >
              {isAnyMusicActive ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 text-left hover:opacity-90 transition-opacity"
              title="প্লেয়ার খুলুন ও সুর নির্বাচন করুন"
            >
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-amber-200 leading-tight flex items-center gap-1">
                  <Music className={`w-3 h-3 ${isAnyMusicActive ? 'animate-bounce text-amber-300' : 'text-purple-400'}`} />
                  <span className="truncate max-w-[130px] sm:max-w-[170px]">
                    {isPianoPlaying
                      ? currentTrackInfo?.titleBn
                      : isUserSongPlaying
                      ? userSongName
                      : 'তুঝ মে রব দিখতা হ্যায়'}
                  </span>
                </span>
                <span className="text-[9px] text-purple-300/80 font-mono leading-none">
                  {isAnyMusicActive ? 'সুর বাজছে · Tap to tune' : 'ব্যাকগ্রাউন্ড সুর প্লেয়ার'}
                </span>
              </div>

              <ChevronUp className="w-4 h-4 text-purple-400 shrink-0 ml-1" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
