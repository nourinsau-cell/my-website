import React, { useState, useEffect, useRef } from 'react';
import { saveChapterAudio, getChapterAudio, deleteChapterAudio } from '../utils/audioBookManager';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Upload,
  Volume2,
  VolumeX,
  Headphones,
  Mic,
  Trash2,
  Check,
  X,
  FileAudio,
  Bot,
  User,
  Sparkles,
  Sliders
} from 'lucide-react';

interface ChapterAudioBookPlayerProps {
  workId: string;
  chapterId: string;
  chapterTitle: string;
  storyTitle: string;
  chapterText: string[];
}

export const ChapterAudioBookPlayer: React.FC<ChapterAudioBookPlayerProps> = ({
  workId,
  chapterId,
  chapterTitle,
  storyTitle,
  chapterText
}) => {
  const chapterKey = `${workId}_${chapterId}`;

  // Audio Mode: 'ai_voice' or 'uploaded_audio'
  const [audioMode, setAudioMode] = useState<'ai_voice' | 'uploaded_audio'>('ai_voice');

  // AI Voice Synthesis State
  const [isAiPlaying, setIsAiPlaying] = useState(false);
  const [aiVoiceGender, setAiVoiceGender] = useState<'female' | 'male'>('female');
  const [aiRate, setAiRate] = useState<number>(0.95);
  const [aiCurrentParagraphIdx, setAiCurrentParagraphIdx] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Uploaded Audio State
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isUploadedPlaying, setIsUploadedPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Uploader Modal State
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load browser voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        setAvailableVoices(v);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Load custom uploaded audio from IndexedDB on chapter change
  useEffect(() => {
    let active = true;
    getChapterAudio(chapterKey).then((data) => {
      if (!active) return;
      if (data) {
        setCustomAudioUrl(data.blobUrl);
        setAudioFileName(data.fileName);
      } else {
        setCustomAudioUrl(null);
        setAudioFileName(null);
      }
    });

    return () => {
      active = false;
      stopAiVoice();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsUploadedPlaying(false);
    };
  }, [chapterKey]);

  const keepAliveTimerRef = useRef<number | null>(null);

  // AI Voice Controls
  const stopAiVoice = () => {
    if (keepAliveTimerRef.current) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiPlaying(false);
  };

  const playAiVoice = (startFromIndex: number = 0) => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ সিন্থেসিস সাপোর্ট নেই / Speech synthesis not supported');
      return;
    }

    stopAiVoice();

    // Prepare full text queue split into bite-sized sentences to prevent speech engine freeze
    const rawParagraphs = [
      `${chapterTitle}।`,
      ...chapterText.slice(startFromIndex)
    ];

    const sentenceQueue: { text: string; paraIdx: number }[] = [];
    rawParagraphs.forEach((para, pIdx) => {
      // Split by dandi, question, exclamation, semicolon, or newline
      const sentences = para
        .split(/(?<=[।?!;\n])/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length === 0 && para.trim()) {
        sentenceQueue.push({ text: para.trim(), paraIdx: startFromIndex + pIdx });
      } else {
        sentences.forEach((s) => {
          sentenceQueue.push({ text: s, paraIdx: startFromIndex + pIdx });
        });
      }
    });

    if (sentenceQueue.length === 0) return;

    let currentQueueIdx = 0;

    // Chrome 14-second pause bug fix keepalive
    keepAliveTimerRef.current = window.setInterval(() => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 9000);

    const speakNext = () => {
      if (currentQueueIdx >= sentenceQueue.length) {
        stopAiVoice();
        setAiCurrentParagraphIdx(0);
        return;
      }

      const item = sentenceQueue[currentQueueIdx];
      const utterance = new SpeechSynthesisUtterance(item.text);

      // Select natural voice dynamically
      const voices = window.speechSynthesis.getVoices();
      const bengaliVoice = voices.find(
        (v) =>
          v.lang.startsWith('bn') ||
          v.lang.includes('Bengali') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );
      const hindiVoice = voices.find((v) => v.lang.startsWith('hi'));
      const fallbackVoice = bengaliVoice || hindiVoice || voices.find((v) => v.default) || voices[0];

      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
        utterance.lang = fallbackVoice.lang;
      } else {
        utterance.lang = 'bn-BD';
      }

      utterance.rate = aiRate;
      utterance.pitch = aiVoiceGender === 'female' ? 1.08 : 0.92;

      utterance.onstart = () => {
        setAiCurrentParagraphIdx(item.paraIdx);
      };

      utterance.onend = () => {
        currentQueueIdx++;
        speakNext();
      };

      utterance.onerror = (err) => {
        console.warn('Speech chunk warning, skipping to next sentence:', err);
        currentQueueIdx++;
        if (currentQueueIdx < sentenceQueue.length) {
          speakNext();
        } else {
          stopAiVoice();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsAiPlaying(true);
    speakNext();
  };

  const toggleAiVoice = () => {
    if (isAiPlaying) {
      stopAiVoice();
    } else {
      playAiVoice(aiCurrentParagraphIdx);
    }
  };

  // Uploaded audio handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsUploadedPlaying(false);
    setCurrentTime(0);
  };

  const toggleUploadedAudio = () => {
    if (!audioRef.current) return;
    if (isUploadedPlaying) {
      audioRef.current.pause();
      setIsUploadedPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsUploadedPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (sec: number) => {
    if (audioRef.current) {
      const next = Math.max(0, Math.min(duration, audioRef.current.currentTime + sec));
      audioRef.current.currentTime = next;
      setCurrentTime(next);
    }
  };

  const handleSaveUploadedFile = async () => {
    if (!selectedFile) return;
    await saveChapterAudio(chapterKey, selectedFile, selectedFile.name);
    const data = await getChapterAudio(chapterKey);
    if (data) {
      setCustomAudioUrl(data.blobUrl);
      setAudioFileName(data.fileName);
      setAudioMode('uploaded_audio');
    }
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploaderOpen(false);
      setSelectedFile(null);
    }, 1800);
  };

  const handleDeleteAudio = async () => {
    await deleteChapterAudio(chapterKey);
    setCustomAudioUrl(null);
    setAudioFileName(null);
    setAudioMode('ai_voice');
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-10 p-4 sm:p-5 rounded-3xl border border-purple-300/60 dark:border-purple-900/70 bg-gradient-to-r from-purple-50/70 via-white/90 to-purple-50/70 dark:from-[#130b22] dark:via-[#190f2d] dark:to-[#130b22] shadow-sm font-ui text-neutral-800 dark:text-neutral-100">
      
      {/* Hidden audio element for uploaded audio */}
      {customAudioUrl && (
        <audio
          ref={audioRef}
          src={customAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Mode Switcher Tabs (AI Voice Narration vs Uploaded Audio) */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-purple-200/60 dark:border-purple-900/60">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-purple-100/70 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60">
          <button
            onClick={() => {
              if (isUploadedPlaying && audioRef.current) audioRef.current.pause();
              setAudioMode('ai_voice');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              audioMode === 'ai_voice'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 dark:text-purple-300 hover:text-purple-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI কণ্ঠে শুনুন · AI Voice</span>
          </button>

          <button
            onClick={() => {
              stopAiVoice();
              setAudioMode('uploaded_audio');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              audioMode === 'uploaded_audio'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 dark:text-purple-300 hover:text-purple-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>আপলোডকৃত অডিও · Custom Audio</span>
          </button>
        </div>

        {/* Upload Audio Trigger */}
        <button
          onClick={() => setIsUploaderOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-700/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-medium transition-colors"
          title="এই পর্বের জন্য নিজস্ব অডিও আপলোড করুন"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">অডিও আপলোড</span>
        </button>
      </div>

      {/* ================= 1. AI VOICE NARRATION VIEW ================= */}
      {audioMode === 'ai_voice' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>স্বয়ংক্রিয় AI ভয়েস জেনারেটর</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200">
                  Auto Generated
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-purple-300/80 mt-0.5 font-literary">
                “{chapterTitle}” সম্পূর্ণ পর্বটি তাৎক্ষণিক স্বাভাবিক মানবিক AI কণ্ঠে শুনুন।
              </p>
            </div>

            {/* Voice Gender & Speed Switchers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  stopAiVoice();
                  setAiVoiceGender(aiVoiceGender === 'female' ? 'male' : 'female');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/60 dark:bg-purple-950/50 text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50"
                title="কণ্ঠের ধরন পরিবর্তন (নারী / পুরুষ)"
              >
                <User className="w-3 h-3 text-purple-400" />
                <span>{aiVoiceGender === 'female' ? 'নারী কণ্ঠ' : 'পুরুষ কণ্ঠ'}</span>
              </button>

              <button
                onClick={() => {
                  const rates = [0.85, 0.95, 1.15];
                  const nextIdx = (rates.indexOf(aiRate) + 1) % rates.length;
                  setAiRate(rates[nextIdx]);
                  if (isAiPlaying) {
                    stopAiVoice();
                    setTimeout(() => playAiVoice(aiCurrentParagraphIdx), 100);
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white/60 dark:bg-purple-950/50 text-xs font-mono font-bold text-purple-700 dark:text-purple-300"
                title="পড়ার গতি পরিবর্তন"
              >
                {aiRate}x
              </button>
            </div>
          </div>

          {/* AI Voice Play Bar */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={toggleAiVoice}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs shadow-md transition-all active:scale-95 ${
                isAiPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:opacity-95 text-white'
              }`}
            >
              {isAiPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isAiPlaying ? 'AI পাঠ থামান · Pause AI Voice' : 'AI কণ্ঠে শুনুন · Start AI Reading'}</span>
            </button>

            {isAiPlaying && (
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300 font-literary animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>পড়া হচ্ছে: অনুচ্ছেদ #{aiCurrentParagraphIdx + 1}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. UPLOADED CUSTOM AUDIO VIEW ================= */}
      {audioMode === 'uploaded_audio' && (
        <div className="space-y-3">
          {customAudioUrl ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                    সংরক্ষিত অডিও ফাইল: {audioFileName}
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-purple-300/70">
                    লেখকের সরাসরি কণ্ঠে বা আপলোডকৃত অডিও
                  </p>
                </div>

                <button
                  onClick={handleDeleteAudio}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="এই অডিওটি মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Scrubber Timeline */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-purple-200 dark:bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex items-center justify-between text-[10px] text-purple-400 font-mono">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleSkip(-10)}
                  className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-neutral-600 dark:text-purple-300"
                  title="১০ সেকেন্ড পেছনে"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleUploadedAudio}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md"
                >
                  {isUploadedPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isUploadedPlaying ? 'বিরতি · Pause' : 'প্লে করুন · Play'}</span>
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-neutral-600 dark:text-purple-300"
                  title="১০ সেকেন্ড সামনে"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-neutral-500 dark:text-purple-300/80">
                এই অধ্যায়ের জন্য এখনও কোনো নিজস্ব অডিও ফাইল আপলোড করা হয়নি।
              </p>
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>এখনই অডিও আপলোড করুন</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= UPLOADER MODAL ================= */}
      {isUploaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#130b22] border border-purple-500/40 rounded-3xl p-6 text-neutral-100 font-ui shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/60">
              <div className="flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-purple-400" />
                <h3 className="font-editorial text-base font-bold text-white">
                  অধ্যায়ের অডিও আপলোড করুন
                </h3>
              </div>
              <button
                onClick={() => setIsUploaderOpen(false)}
                className="p-1 rounded-full text-purple-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-200/80 leading-relaxed font-literary">
              “{chapterTitle}” পর্বের জন্য আপনার নিজের ভয়েসে রেকর্ড করা বা কোনো পছন্দের অডিও ফাইল (MP3, WAV, M4A) যুক্ত করুন। এটি সংরক্ষিত থাকবে এবং পাঠকেরা সরাসরি শুনতে পাবেন।
            </p>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>অডিও সফলভাবে সংরক্ষিত হয়েছে! / Audio saved!</span>
              </div>
            )}

            <div className="p-4 rounded-2xl border border-dashed border-purple-500/40 bg-purple-950/20 text-center space-y-2">
              <input
                type="file"
                id="chapter-audio-input"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="chapter-audio-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700/60 hover:bg-purple-600 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>অডিও ফাইল নির্বাচন করুন (Choose File)</span>
              </label>

              {selectedFile && (
                <p className="text-xs text-purple-300 font-mono pt-1">
                  নির্বাচিত: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/60">
              <button
                type="button"
                onClick={() => setIsUploaderOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                বাতিল · Cancel
              </button>

              <button
                type="button"
                disabled={!selectedFile}
                onClick={handleSaveUploadedFile}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন · Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
