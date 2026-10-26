import React, { useState, useEffect, useRef } from 'react';
import { LiteraryWork, Chapter } from '../data/literaryData';
import { ThemeMode } from './Header';
import { ChapterAudioBookPlayer } from './ChapterAudioBookPlayer';
import { ChapterMiniAudioPlayer } from './ChapterMiniAudioPlayer';
import { NewsletterBox } from './NewsletterBox';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  ChevronDown,
  Clock,
  Sparkles,
  Heart,
  MessageCircle,
  Check,
  Send,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface ChapterReaderProps {
  work: LiteraryWork;
  initialChapterId?: string;
  onBack: () => void;
  onSelectRelatedWork: (workId: string) => void;
  onOpenQuoteGenerator: (initialQuote?: string, source?: string) => void;
  onOpenWhatsAppTool?: (quote?: string) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
}

interface ReaderComment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  work,
  initialChapterId,
  onBack,
  onSelectRelatedWork,
  onOpenQuoteGenerator,
  onOpenWhatsAppTool,
  theme,
  onSetTheme
}) => {
  const chapters = work.chapters || [];
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    if (!initialChapterId || chapters.length === 0) return 0;
    const foundIdx = chapters.findIndex((c) => c.id === initialChapterId);
    return foundIdx !== -1 ? foundIdx : 0;
  });

  const currentChapter: Chapter | undefined = chapters[currentChapterIndex];

  // Reader Settings State
  const [fontSize, setFontSize] = useState<number>(18);
  const lineHeight = 'leading-[2.1]';
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [savedBookmarkNotice, setSavedBookmarkNotice] = useState<boolean>(false);
  const [chapterSelectorOpen, setChapterSelectorOpen] = useState<boolean>(false);

  // Reader Reactions
  const [reactions, setReactions] = useState<{
    love: number;
    tears: number;
    mesmerized: number;
    hug: number;
  }>({
    love: 48,
    tears: 31,
    mesmerized: 62,
    hug: 24
  });
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

  // Reader Comments State
  const [comments, setComments] = useState<ReaderComment[]>([
    {
      id: 'c-1',
      author: 'একজন মুগ্ধ পাঠক',
      text: 'বৃষ্টির রাতে এই অধ্যায়টা পড়ে বুকের ভেতর কেমন যেন এক অদ্ভুত হাহাকার জেগে উঠল। আপনার লেখার এই মাদকতা অন্য কোথাও পাইনি।',
      date: 'গতকাল রাত ১২:৪০',
      likes: 14
    },
    {
      id: 'c-2',
      author: 'মেঘলা মন',
      text: 'অয়নের সংলাপগুলো সরাসরি হৃদয়ে ছুঁয়ে যায়। পরবর্তী পর্বের অপেক্ষায় রইলাম প্রিয় লেখক!',
      date: 'আজ সকাল ৯:১৫',
      likes: 8
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmittedNotice, setCommentSubmittedNotice] = useState(false);

  // Selected text for quote generator
  const [selectedText, setSelectedText] = useState<string>('');
  const [showQuoteActionBubble, setShowQuoteActionBubble] = useState<boolean>(false);
  const [bubblePosition, setBubblePosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const contentRef = useRef<HTMLDivElement | null>(null);

  // Restore and persist "Continue Reading" state
  useEffect(() => {
    if (!currentChapter) return;
    try {
      const readingState = {
        workId: work.id,
        workTitle: work.title,
        chapterId: currentChapter.id,
        chapterNumber: currentChapter.number,
        chapterTitle: currentChapter.title,
        timestamp: Date.now()
      };
      localStorage.setItem('nishat_last_read', JSON.stringify(readingState));
    } catch {
      // Ignore
    }
  }, [work, currentChapter]);

  // Load reactions from localStorage
  useEffect(() => {
    if (!currentChapter) return;
    const key = `nishat_reactions_${work.id}_${currentChapter.id}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.counts) setReactions(parsed.counts);
        if (parsed.user) setUserReactions(parsed.user);
      }
    } catch {
      // Ignore
    }
  }, [work.id, currentChapter]);

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text Selection Quote Sharer
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setShowQuoteActionBubble(false);
        return;
      }
      const text = selection.toString().trim();
      if (text.length > 10) {
        setSelectedText(text);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setBubblePosition({
          top: rect.top + window.scrollY - 45,
          left: Math.max(20, rect.left + rect.width / 2 - 75)
        });
        setShowQuoteActionBubble(true);
      } else {
        setShowQuoteActionBubble(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentChapterIndex]);

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const toggleReaction = (type: 'love' | 'tears' | 'mesmerized' | 'hug') => {
    if (!currentChapter) return;
    const isAlready = !!userReactions[type];
    const newCounts = {
      ...reactions,
      [type]: isAlready ? reactions[type] - 1 : reactions[type] + 1
    };
    const newUser = {
      ...userReactions,
      [type]: !isAlready
    };
    setReactions(newCounts);
    setUserReactions(newUser);

    try {
      const key = `nishat_reactions_${work.id}_${currentChapter.id}`;
      localStorage.setItem(key, JSON.stringify({ counts: newCounts, user: newUser }));
    } catch {
      // Ignore
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: ReaderComment = {
      id: `c-${Date.now()}`,
      author: newCommentName.trim() || 'নিভৃত পাঠক',
      text: newCommentText.trim(),
      date: 'এইমাত্র',
      likes: 1
    };

    setComments([newC, ...comments]);
    setNewCommentText('');
    setNewCommentName('');
    setCommentSubmittedNotice(true);
    setTimeout(() => setCommentSubmittedNotice(false), 4000);
  };

  const handleSaveBookmark = () => {
    setSavedBookmarkNotice(true);
    setTimeout(() => setSavedBookmarkNotice(false), 2500);
  };

  if (!currentChapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-ui">
        <p className="text-lg text-neutral-600">কোনো পর্ব খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-sm bg-purple-900 text-white rounded-md"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  // Dynamic Text and Background Colors for Day Mood, Night Mood, and Sepia Mood (Scientifically Formulated for Long-Read Eye Soothing Comfort)
  const themeColors = {
    // 1. Day Mood: Eye-Comfort Natural Matte Paper (Warm Ivory & Gentle Soft Charcoal)
    light: {
      pageBg: 'bg-[#fbf8f3]',
      navBg: 'bg-[#fbf8f3]/95 border-[#e8dfd1]',
      title: 'text-[#d97706]',
      subtitle: 'text-[#5e4b3e]',
      meta: 'text-[#7d6859]',
      prose: 'text-[#2b2724]', // Gentle charcoal on warm paper — 0% screen glare
      cliffhanger: 'bg-[#f3ede1] border-[#d8cbbb] text-[#2b2724]',
      card: 'bg-white/90 border-[#e8dfd1] text-[#2b2724]',
      border: 'border-[#e8dfd1]'
    },
    // 2. Night Mood: Kindle Warm Night (Velvet Obsidian & Soft Warm Buttermilk Ivory)
    dark: {
      pageBg: 'bg-[#0e0a17]',
      navBg: 'bg-[#0e0a17]/95 border-purple-900/60',
      title: 'text-[#facc15]', // Golden Yellow Title
      subtitle: 'text-[#d6c7b2]',
      meta: 'text-[#b3a490]',
      prose: 'text-[#ede6da]', // Warm soothing buttermilk ivory — 0% harsh blue glare
      cliffhanger: 'bg-[#181124] border-purple-800/80 text-[#facc15]',
      card: 'bg-[#150f22]/90 border-purple-900/60 text-[#ede6da]',
      border: 'border-purple-900/60'
    },
    // 3. Sepia Mood: Chamomile Warm Linen (Soft Antique Warmth)
    sepia: {
      pageBg: 'bg-[#f6f0e4]',
      navBg: 'bg-[#f6f0e4]/95 border-[#e0d3be]',
      title: 'text-[#b45309]', // Deep Golden Amber Title
      subtitle: 'text-[#6e4e37]',
      meta: 'text-[#85654c]',
      prose: 'text-[#382618]', // Cocoa chestnut prose
      cliffhanger: 'bg-[#ece1cd] border-[#d4c1a5] text-[#382618]',
      card: 'bg-[#faf5ea] border-[#e0d3be] text-[#382618]',
      border: 'border-[#e0d3be]'
    }
  }[theme];

  return (
    <div className={`min-h-screen pb-28 transition-colors duration-300 ${themeColors.pageBg}`}>
      {/* Top Fixed Reading Progress Bar in Purple Gradient */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-purple-950/40 z-30"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Selection Quote Bubble */}
      {showQuoteActionBubble && (
        <div
          style={{ top: `${bubblePosition.top}px`, left: `${bubblePosition.left}px` }}
          className="absolute z-50 animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1.5"
        >
          <button
            onClick={() => {
              onOpenQuoteGenerator(selectedText, `${work.title} — ${currentChapter.title}`);
              setShowQuoteActionBubble(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-700 text-white shadow-xl hover:bg-purple-600 transition-transform active:scale-95 font-ui"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>উক্তি তৈরি করুন</span>
          </button>

          {onOpenWhatsAppTool && (
            <button
              onClick={() => {
                onOpenWhatsAppTool(`“${selectedText}”\n— ${work.title} (${currentChapter.title})`);
                setShowQuoteActionBubble(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition-transform active:scale-95 font-ui"
              title="হোয়াটসঅ্যাপে শেয়ার"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      )}

      {/* Reader Secondary Sticky Subheader for Controls */}
      <div className={`sticky top-0 z-20 w-full ${themeColors.navBg} border-b backdrop-blur-md transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs font-ui">
          
          {/* Back button */}
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-1.5 ${themeColors.meta} hover:${themeColors.title} transition-colors focus:outline-none`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ফিরে যান</span>
          </button>

          {/* Chapter Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setChapterSelectorOpen(!chapterSelectorOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-neutral-800 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors font-medium"
            >
              <span className="truncate max-w-[150px] sm:max-w-[280px]">
                {currentChapter.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            </button>

            {chapterSelectorOpen && (
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-64 sm:w-80 bg-white dark:bg-[#150d24] border border-purple-200 dark:border-purple-900/80 rounded-xl shadow-2xl py-1 z-30 font-ui text-left max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-purple-400 uppercase tracking-wider border-b border-purple-100 dark:border-purple-900/40">
                  সকল পর্ব তালিকা ({chapters.length})
                </div>
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setChapterSelectorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      idx === currentChapterIndex
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/40'
                    }`}
                  >
                    <span className="truncate">{ch.title}</span>
                    {ch.isMature && (
                      <span className="text-[10px] text-rose-500 ml-1 shrink-0">১৮+</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Controls Toolbar: Font Size, Theme, WhatsApp & Bookmark */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* WhatsApp Share trigger */}
            {onOpenWhatsAppTool && (
              <button
                onClick={() =>
                  onOpenWhatsAppTool(
                    `আমি নিশাত আহমেদের “${work.title}” উপন্যাসের পর্ব “${currentChapter.title}” পড়ছি। আপনিও পড়তে পারেন!`
                  )
                }
                title="হোয়াটসঅ্যাপে পর্বটি শেয়ার করুন"
                className="p-1.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Font Size A- / A+ */}
            <div className="flex items-center rounded border border-purple-200 dark:border-purple-900/80 bg-white/50 dark:bg-purple-950/40">
              <button
                onClick={() => setFontSize(Math.max(15, fontSize - 1))}
                className="px-2 py-1 text-[11px] font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                title="হরফ ছোট করুন"
                aria-label="হরফ ছোট করুন"
              >
                A-
              </button>
              <span className="px-1 text-[10px] text-purple-400">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(26, fontSize + 1))}
                className="px-2 py-1 text-[11px] font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                title="হরফ বড় করুন"
                aria-label="হরফ বড় করুন"
              >
                A+
              </button>
            </div>

            {/* Reading Mode Button */}
            <div className="hidden sm:flex items-center rounded border border-purple-200 dark:border-purple-900/80 p-0.5">
              <button
                onClick={() => onSetTheme('light')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  theme === 'light' ? 'bg-white shadow-xs font-semibold text-purple-900' : 'text-purple-400'
                }`}
              >
                দিবা
              </button>
              <button
                onClick={() => onSetTheme('sepia')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  theme === 'sepia' ? 'bg-[#faf5ea] shadow-xs font-semibold text-[#34232c]' : 'text-purple-400'
                }`}
              >
                সেপিয়া
              </button>
              <button
                onClick={() => onSetTheme('dark')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  theme === 'dark' ? 'bg-purple-900 shadow-xs font-semibold text-purple-100' : 'text-purple-400'
                }`}
              >
                রাত্রি
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleSaveBookmark}
              title="বুকমার্ক করুন"
              className="p-1.5 rounded text-neutral-600 dark:text-purple-300 hover:text-purple-600 dark:hover:text-white transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bookmark Saved Notification */}
      {savedBookmarkNotice && (
        <div className="fixed bottom-6 right-6 z-40 bg-purple-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 font-ui animate-in fade-in slide-in-from-bottom-2 border border-purple-400/30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>পড়ার স্থানটি সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Main Reading Canvas */}
      <main className="max-w-2xl mx-auto px-5 sm:px-6 pt-12 md:pt-16">
        
        {/* Work Header & Chapter Meta */}
        <header className="mb-10 text-center">
          <p className={`font-ui text-xs ${themeColors.subtitle} tracking-wide mb-2 uppercase font-semibold`}>
            {work.title}
          </p>

          <h1 className={`font-editorial text-2xl sm:text-3xl md:text-4xl font-bold ${themeColors.title} leading-tight transition-colors`}>
            {currentChapter.title}
          </h1>

          {/* Unboxed Metadata with Typographic Separator */}
          <div className={`flex items-center justify-center gap-2 text-xs ${themeColors.meta} mt-4 font-ui`}>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {currentChapter.estimatedReadTime}
            </span>
            <span aria-hidden="true">·</span>
            <span>লেখক: নিশাত আহমেদ</span>
            {currentChapter.isMature && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-rose-500 font-semibold">১৮+ সংবেদনশীল</span>
              </>
            )}
          </div>

          {work.pratilipiUrl && (
            <div className="mt-3">
              <a
                href={work.pratilipiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-600 dark:text-amber-300 text-xs font-semibold font-ui transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>প্রতিলিপিতে মূল প্রকাশনা · Pratilipi Publication</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          )}

          <div className="w-20 h-[2px] rainbow-hairline mx-auto mt-6 rounded-full" />
        </header>

        {/* Chapter Audiobook Player with Upload Support */}
        <ChapterAudioBookPlayer
          workId={work.id}
          chapterId={currentChapter.id}
          chapterTitle={currentChapter.title}
          storyTitle={work.title}
          chapterText={currentChapter.content}
        />

        {/* Story Prose Body with Dynamic Day, Night, and Sepia text colors */}
        <div
          ref={contentRef}
          className={`space-y-6 ${themeColors.prose} transition-colors font-literary ${lineHeight}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentChapter.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-justify indent-6 tracking-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Chapter Cliffhanger */}
        {currentChapter.cliffhanger && (
          <div className={`mt-12 p-5 rounded-2xl border ${themeColors.cliffhanger} font-ui transition-colors`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>পরবর্তী রোমাঞ্চ</span>
            </div>
            <p className="font-literary text-sm italic">
              {currentChapter.cliffhanger}
            </p>
          </div>
        )}

        {/* Reader Reactions Area */}
        <section className="mt-16 pt-8 border-t border-purple-200/60 dark:border-purple-900/60">
          <h4 className="text-center font-ui text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4">
            অধ্যায়টি কেমন লাগল? অনুভূতি ব্যক্ত করুন
          </h4>
          
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap font-ui">
            <button
              onClick={() => toggleReaction('love')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                userReactions.love
                  ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 shadow-xs'
                  : 'border-purple-200 dark:border-purple-900/60 hover:border-purple-400 text-neutral-700 dark:text-purple-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${userReactions.love ? 'fill-current text-purple-500' : ''}`} />
              <span>ভালোবাসা</span>
              <span className="text-[11px] text-purple-400 font-mono">({reactions.love})</span>
            </button>

            <button
              onClick={() => toggleReaction('tears')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                userReactions.tears
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300'
                  : 'border-purple-200 dark:border-purple-900/60 hover:border-blue-400 text-neutral-700 dark:text-purple-200'
              }`}
            >
              <span>💧</span>
              <span>চোখের জল</span>
              <span className="text-[11px] text-purple-400 font-mono">({reactions.tears})</span>
            </button>

            <button
              onClick={() => toggleReaction('mesmerized')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                userReactions.mesmerized
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                  : 'border-purple-200 dark:border-purple-900/60 hover:border-amber-400 text-neutral-700 dark:text-purple-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>মুগ্ধতা</span>
              <span className="text-[11px] text-purple-400 font-mono">({reactions.mesmerized})</span>
            </button>

            <button
              onClick={() => toggleReaction('hug')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                userReactions.hug
                  ? 'border-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-700 dark:text-fuchsia-300'
                  : 'border-purple-200 dark:border-purple-900/60 hover:border-fuchsia-400 text-neutral-700 dark:text-purple-200'
              }`}
            >
              <span>🫂</span>
              <span>আলিঙ্গন</span>
              <span className="text-[11px] text-purple-400 font-mono">({reactions.hug})</span>
            </button>
          </div>
        </section>

        {/* Previous / Next Chapter Navigation */}
        <nav className="mt-12 flex items-center justify-between gap-4 font-ui pt-6 border-t border-purple-200/60 dark:border-purple-900/60">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
              currentChapterIndex === 0
                ? 'opacity-40 cursor-not-allowed border-purple-200 dark:border-purple-900/40'
                : 'border-purple-300 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-neutral-800 dark:text-purple-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>পূর্ববর্তী পর্ব</span>
          </button>

          <span className="text-xs text-purple-400 font-mono">
            {currentChapterIndex + 1} / {chapters.length}
          </span>

          <button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentChapterIndex === chapters.length - 1
                ? 'opacity-40 cursor-not-allowed border border-purple-900 text-neutral-500'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
            }`}
          >
            <span>পরবর্তী পর্ব</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Reader Comments Section */}
        <section className="mt-16 pt-10 border-t border-purple-200/70 dark:border-purple-900/60 font-ui">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-editorial text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span>পাঠক প্রতিক্রিয়া ({comments.length})</span>
            </h3>
            <span className="text-xs text-purple-400">ভালোবাসার মন্তব্য করুন</span>
          </div>

          {/* Comment submission form */}
          <form onSubmit={handleAddComment} className="mb-8 space-y-3">
            <div>
              <input
                type="text"
                placeholder="আপনার নাম বা ছদ্মনাম (ঐচ্ছিক)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-900/70 bg-white/70 dark:bg-[#140c24]/70 focus:outline-none focus:border-purple-500 text-purple-900 dark:text-purple-100"
              />
            </div>
            <div>
              <textarea
                rows={3}
                placeholder="অধ্যায়টি পড়ে আপনার মনের অনুভূতি লিখুন..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-900/70 bg-white/70 dark:bg-[#140c24]/70 focus:outline-none focus:border-purple-500 leading-relaxed text-purple-900 dark:text-purple-100"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-purple-400">
                মন্তব্যগুলো সৌহার্দ্যপূর্ণ সাহিত্যের অংশ হিসেবে রাখা হয়।
              </p>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors text-xs font-semibold shadow-md"
              >
                <span>মন্তব্য পাঠান</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {commentSubmittedNotice && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/20">
              <Check className="w-4 h-4" />
              <span>আপনার অনুভূতি প্রকাশিত হয়েছে। ধন্যবাদ!</span>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-xl border border-purple-200/60 dark:border-purple-900/50 bg-white/50 dark:bg-[#160d26]/50"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-purple-900 dark:text-purple-200">
                    {comm.author}
                  </span>
                  <span className="text-[11px] text-purple-400">{comm.date}</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-purple-100/90 leading-relaxed font-literary">
                  {comm.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Stories */}
        {work.relatedWorkIds && work.relatedWorkIds.length > 0 && (
          <section className="mt-16 pt-10 border-t border-purple-200/70 dark:border-purple-900/60 font-ui">
            <h3 className="font-editorial text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              সম্পর্কিত লেখা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {work.relatedWorkIds.map((relId) => (
                <div
                  key={relId}
                  onClick={() => onSelectRelatedWork(relId)}
                  className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 hover:border-purple-400 cursor-pointer transition-all bg-white/50 dark:bg-[#150d24]/50"
                >
                  <p className="text-xs font-semibold text-purple-500">ধারাবাহিক</p>
                  <h4 className="font-editorial text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {relId === 'neel-seemana' ? 'নীল সীমানা' : 'চিলেকোঠার আলো'}
                  </h4>
                  <p className="text-xs text-purple-400 mt-1">পড়তে ক্লিক করুন →</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter on the bottom of the reading experience */}
        <div className="mt-16 pt-8">
          <NewsletterBox variant="card" />
        </div>
      </main>

      {/* Persistent Mini Audio Player Component for Background Music */}
      <ChapterMiniAudioPlayer
        storyTitle={work.title}
        chapterTitle={currentChapter.title}
      />
    </div>
  );
};
