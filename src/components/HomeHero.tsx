import React, { useState, useEffect } from 'react';
import { HeroRainParticles } from './HeroRainParticles';
import { StoryCard } from './StoryCard';
import { NewsletterBox } from './NewsletterBox';
import { NOVELS, STORIES, SHORT_STORIES, FEATURED_QUOTES, LiteraryWork } from '../data/literaryData';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Feather,
  Bot,
  MessageCircle,
  Share2,
  Users,
  Plus,
  Check,
  Eye,
  BookOpen
} from 'lucide-react';

interface HomeHeroProps {
  onStartReading: (work: LiteraryWork, chapterId?: string) => void;
  onSelectTab: (tabId: string) => void;
  onOpenQuoteGenerator: (quote: string, source: string) => void;
  onOpenAiAssistant: () => void;
  onOpenWhatsAppTool: (quote?: string) => void;
  onOpenComments: (work: LiteraryWork) => void;
  isFollowing?: boolean;
  followerCount?: number;
  totalReaders?: number;
  activeReadersNow?: number;
  onToggleFollow?: () => void;
  rainActive: boolean;
  onToggleRain: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartReading,
  onSelectTab,
  onOpenQuoteGenerator,
  onOpenAiAssistant,
  onOpenWhatsAppTool,
  onOpenComments,
  isFollowing = false,
  followerCount = 14280,
  totalReaders = 98450,
  activeReadersNow = 342,
  onToggleFollow,
  rainActive,
  onToggleRain
}) => {
  // Quote Rotator State
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FEATURED_QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = FEATURED_QUOTES[quoteIndex] || FEATURED_QUOTES[0];
  const featuredNovel = NOVELS[0]; // Meghdubi Raat

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % FEATURED_QUOTES.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + FEATURED_QUOTES.length) % FEATURED_QUOTES.length);
  };

  return (
    <div className="w-full space-y-16 sm:space-y-24">
      {/* 1. Full-screen Grand Hero in Deep Purple & Velvet Plum */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#110722] via-[#1a0a33] to-[#0a0614] text-white px-4 sm:px-6 py-20">
        
        {/* Hero rain & petal particles */}
        <HeroRainParticles active={rainActive} intensity="light" />

        {/* Ambient Purple Lamplight Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(192,132,252,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-20 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Tagline Kicker with Bangla & English Side-by-Side */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 backdrop-blur-md text-xs tracking-wide text-purple-300 font-ui animate-in fade-in duration-500 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>ভালোবাসার অন্য ভাষা</span>
            <span className="text-purple-400/80 font-sans tracking-tight">· The Language of Another Love</span>
          </div>

          {/* Author Name & Follow Button Lockup */}
          <div className="space-y-3 relative z-30">
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-yellow-300 drop-shadow-[0_2px_20px_rgba(253,224,71,0.4)] leading-tight">
              নিশাত আহমেদ
            </h1>
            <p className="text-sm sm:text-base font-sans tracking-widest uppercase text-yellow-200/90 font-semibold">
              Nishat Ahmed — The Writer
            </p>

            {/* Author Follow Button on Hero */}
            {onToggleFollow && (
              <div className="pt-1 flex justify-center">
                <button
                  onClick={onToggleFollow}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold font-ui transition-all active:scale-95 shadow-md ${
                    isFollowing
                      ? 'bg-purple-900/80 border border-purple-400/90 text-purple-200'
                      : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 text-white'
                  }`}
                >
                  {isFollowing ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                  <span>{isFollowing ? 'আপনি লেখককে অনুসরণ করছেন · Following' : 'লেখককে অনুসরণ করুন · Follow Author'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/30 font-mono text-[11px] tabular-nums">
                    {followerCount.toLocaleString('bn-BD')}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Subtle Tasteful Purple-Rainbow Underline */}
          <div className="w-40 sm:w-52 h-[2.5px] rainbow-hairline mx-auto rounded-full opacity-90 shadow-sm" />

          {/* Poetic line in Bangla & English */}
          <div className="space-y-1.5 max-w-2xl mx-auto">
            <p className="font-literary text-base sm:text-xl md:text-2xl text-purple-100/95 leading-relaxed italic">
              “কিছু গল্প বলা হয় চোখের ভাষায়, কিছু গল্প রয়ে যায় বৃষ্টির রাতে...”
            </p>
            <p className="font-sans text-xs sm:text-sm text-purple-300/80 italic">
              “Some tales are spoken in silence, some linger in rainy nights...”
            </p>
          </div>

          {/* Live Readers and Followers Counter Stats Ribbon (koto jon follow korche, koto jon read korche) */}
          <div className="py-2.5 px-4 max-w-xl mx-auto rounded-2xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-md grid grid-cols-3 gap-2 text-center font-ui text-xs">
            {/* Followers Counter */}
            <div className="p-1.5">
              <div className="flex items-center justify-center gap-1 text-purple-300 font-semibold font-mono text-sm sm:text-base tabular-nums">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{followerCount.toLocaleString('bn-BD')}</span>
              </div>
              <div className="text-[10px] text-purple-400/80 mt-0.5">
                অনুসারী · Followers
              </div>
            </div>

            {/* Total Readers Counter */}
            <div className="p-1.5 border-x border-purple-800/50">
              <div className="flex items-center justify-center gap-1 text-purple-300 font-semibold font-mono text-sm sm:text-base tabular-nums">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{totalReaders.toLocaleString('bn-BD')}</span>
              </div>
              <div className="text-[10px] text-purple-400/80 mt-0.5">
                মোট পাঠ · Total Reads
              </div>
            </div>

            {/* Currently Reading Live Counter */}
            <div className="p-1.5">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold font-mono text-sm sm:text-base tabular-nums">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{activeReadersNow.toLocaleString('bn-BD')}</span>
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">
                এখন পড়ছেন · Live Now
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-ui">
            <button
              onClick={() => onStartReading(featuredNovel)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 hover:opacity-95 text-white font-medium text-sm shadow-xl shadow-purple-900/30 transition-all duration-300 flex items-center justify-center gap-2 group focus:outline-none"
            >
              <span>পড়া শুরু করুন · Read Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-400/40 bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 text-sm font-medium transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span>AI সহকারী · Assistant</span>
            </button>

            <button
              onClick={() => onSelectTab('reader_board')}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-sm font-medium transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-purple-300" />
              <span>পাঠকের ডায়েরি · Board</span>
            </button>
          </div>

          {/* Particle Weather Ambient Indicator */}
          <div className="pt-4">
            <button
              onClick={onToggleRain}
              className="text-[11px] text-purple-300/70 hover:text-purple-200 transition-colors underline decoration-dotted font-ui"
            >
              {rainActive ? 'বৃষ্টির আবহ সক্রিয় · Rain Active (Click to toggle)' : 'বৃষ্টির আবহ বন্ধ · Rain Off (Click to toggle)'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. "নতুন পর্ব" Latest Chapter Alert Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 dark:bg-purple-950/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-ui">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                <span>নতুন পর্ব প্রকাশিত হয়েছে</span>
                <span className="font-sans text-[11px] text-purple-400/80">/ Latest Chapter</span>
                <span aria-hidden="true">·</span>
                <span>ভাদ্র ১৪৩১</span>
              </div>
              <h3 className="font-editorial text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                মেঘডুবি রাত — তৃতীয় পর্ব (১৮+ নিষিদ্ধ ভোরের প্রতিধ্বনি)
              </h3>
            </div>
          </div>

          <button
            onClick={() => onStartReading(featuredNovel, 'c3')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-opacity shrink-0 w-full sm:w-auto justify-center shadow-md"
          >
            <span>সরাসরি পর্বটি পড়ুন · Read</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. Featured Ongoing Series (ধারাবাহিক উপন্যাস · Featured Series) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-ui flex items-center gap-1.5">
              <span>চলতি ধারাবাহিক</span>
              <span className="text-[11px] font-sans text-purple-400/80">/ Ongoing Series</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              প্রধান সাহিত্য আখ্যান
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('novels')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:underline font-ui flex items-center gap-1"
          >
            <span>সব দেখুন · View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Novel Big Showcase Card with React and Comment buttons */}
        <StoryCard
          work={featuredNovel}
          onRead={onStartReading}
          onOpenComments={onOpenComments}
          featured={true}
        />
      </section>

      {/* 4. Rotating "আজকের কথা" (Today's Quote) Card with WhatsApp Share */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 sm:p-12 border border-purple-200/60 dark:border-purple-900/60 bg-gradient-to-br from-white/90 via-purple-50/30 to-white/90 dark:from-[#150d24]/90 dark:via-[#1f1236]/90 dark:to-[#150d24]/90 backdrop-blur-md shadow-xs text-center font-ui">
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5" />
              <span>আজকের কথা · Quote of the Day</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevQuote}
                className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-neutral-500 dark:text-purple-300"
                aria-label="পূর্ববর্তী উক্তি"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextQuote}
                className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-neutral-500 dark:text-purple-300"
                aria-label="পরবর্তী উক্তি"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quote Body */}
          <blockquote className="my-4">
            <p className="font-literary text-lg sm:text-2xl text-neutral-800 dark:text-purple-100 leading-relaxed font-medium">
              “{currentQuote.text}”
            </p>
          </blockquote>

          {/* Source & Actions (WhatsApp / Image Card) */}
          <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 dark:text-purple-300/80 font-editorial">
              — {currentQuote.source}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenWhatsAppTool(`"${currentQuote.text}" — ${currentQuote.source}`)}
                className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>হোয়াটসঅ্যাপে শেয়ার · WhatsApp</span>
              </button>

              <button
                onClick={() => onOpenQuoteGenerator(currentQuote.text, currentQuote.source)}
                className="inline-flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-300 hover:underline font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>উক্তি কার্ড · Image Card</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. More Works Grid Preview (গল্প ও ছোট গল্প) with React & Comment */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-ui flex items-center gap-1.5">
              <span>এক বসায় পাঠ</span>
              <span className="text-[11px] font-sans text-purple-400/80">/ Quick Reads</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              গল্প ও ছোট গল্প
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('short_stories')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:underline font-ui flex items-center gap-1"
          >
            <span>সব ছোট গল্প · All Shorts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHORT_STORIES.map((story) => (
            <StoryCard
              key={story.id}
              work={story}
              onRead={onStartReading}
              onOpenComments={onOpenComments}
            />
          ))}
          {STORIES.slice(0, 1).map((story) => (
            <StoryCard
              key={story.id}
              work={story}
              onRead={onStartReading}
              onOpenComments={onOpenComments}
            />
          ))}
        </div>
      </section>

      {/* 6. Newsletter Signup Section on the Bottom */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <NewsletterBox variant="card" />
      </section>
    </div>
  );
};
