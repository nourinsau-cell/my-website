/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ThemeMode } from './components/Header';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { WorksGridView } from './components/WorksGridView';
import { PoetryView } from './components/PoetryView';
import { PhotographyView } from './components/PhotographyView';
import { ThoughtsView } from './components/ThoughtsView';
import { AboutView } from './components/AboutView';
import { ChapterReader } from './components/ChapterReader';
import { ContinueReadingBanner } from './components/ContinueReadingBanner';
import { AgeGateModal } from './components/AgeGateModal';
import { QuoteCardModal } from './components/QuoteCardModal';
import { SearchModal } from './components/SearchModal';
import { ContentGuideModal } from './components/ContentGuideModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { WhatsAppToolModal } from './components/WhatsAppToolModal';
import { StoryCommentModal } from './components/StoryCommentModal';
import { ReaderBoard } from './components/ReaderBoard';
import { ReaderChatModal } from './components/ReaderChatModal';
import { AtmosphericSky } from './components/AtmosphericSky';
import { useFollowersAndReaders } from './hooks/useFollowersAndReaders';
import { NOVELS, STORIES, SHORT_STORIES, LiteraryWork } from './data/literaryData';
import { setupCopyrightProtection } from './utils/copyrightProtection';
import { LanguageProvider, useLanguage } from './utils/languageContext';
import { ReaderFolderModal } from './components/ReaderFolderModal';
import { SendGiftModal } from './components/SendGiftModal';
import { PratilipiImportModal } from './components/PratilipiImportModal';
import { NishatQuotesRibbon } from './components/NishatQuotesRibbon';
import { recordChapterRead } from './utils/readerAccount';
import { BookOpen, HelpCircle, Bot, MessageCircle, MessageSquare, Sparkles, PenLine, X, Check, ShieldCheck, Gift, FolderHeart, DownloadCloud } from 'lucide-react';

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeWork, setActiveWork] = useState<LiteraryWork | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);
  const [novelsList, setNovelsList] = useState<LiteraryWork[]>(NOVELS);

  // New Modals
  const [isReaderFolderOpen, setIsReaderFolderOpen] = useState(false);
  const [isSendGiftOpen, setIsSendGiftOpen] = useState(false);
  const [isPratilipiImportOpen, setIsPratilipiImportOpen] = useState(false);

  // Followers and Readers State & Counter Hook
  const {
    isFollowing,
    followerCount,
    totalReaders,
    activeReadersNow,
    followToast,
    toggleFollow,
    recordStoryRead
  } = useFollowersAndReaders();

  // Theme Mode: Set default to 'light' (Warm Ivory Paper Background)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('nishat_theme');
      if (stored === 'dark' || stored === 'sepia' || stored === 'light') return stored;
    } catch {
      // Ignore
    }
    return 'light'; // Default Day Mood
  });

  // Rain and floating petals micro-particles toggle
  const [rainActive, setRainActive] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('nishat_rain');
      return stored !== 'false';
    } catch {
      return true;
    }
  });

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isWhatsAppToolOpen, setIsWhatsAppToolOpen] = useState(false);
  const [whatsAppText, setWhatsAppText] = useState<string | undefined>(undefined);

  const [isStoryCommentModalOpen, setIsStoryCommentModalOpen] = useState(false);
  const [commentTargetWork, setCommentTargetWork] = useState<LiteraryWork | null>(null);

  // Side drawer for Reader's Wall
  const [isReaderSideDrawerOpen, setIsReaderSideDrawerOpen] = useState(false);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState<{ quote: string; source: string }>({
    quote: '',
    source: ''
  });
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isReaderChatOpen, setIsReaderChatOpen] = useState(false);
  const [chatTargetReader, setChatTargetReader] = useState('সহ-পাঠক');
  const [copyrightToast, setCopyrightToast] = useState<string | null>(null);

  // Activate smart copyright attribution on copying
  useEffect(() => {
    const cleanup = setupCopyrightProtection((msg) => {
      setCopyrightToast(msg);
      setTimeout(() => setCopyrightToast(null), 4000);
    });
    return cleanup;
  }, []);

  // Sync theme with HTML document classes & background styles
  useEffect(() => {
    try {
      localStorage.setItem('nishat_theme', theme);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    root.classList.remove('dark', 'theme-light', 'theme-sepia');

    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#15092a';
      document.body.style.color = '#facc15';
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
      document.body.style.backgroundColor = '#f7f1e6';
      document.body.style.color = '#b45309';
    } else {
      root.classList.add('theme-light');
      document.body.style.backgroundColor = '#fbf8f3';
      document.body.style.color = '#111111';
    }
  }, [theme]);

  const handleToggleRain = () => {
    const next = !rainActive;
    setRainActive(next);
    try {
      localStorage.setItem('nishat_rain', String(next));
    } catch {
      // Ignore
    }
  };

  const handleStartReading = (work: LiteraryWork, chapterId?: string) => {
    recordStoryRead();
    const chId = chapterId || (work.chapters && work.chapters[0]?.id) || 'ch1';
    recordChapterRead(`${work.id}_${chId}`);
    setActiveWork(work);
    setActiveChapterId(chapterId);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePratilipiImport = (importedWork: LiteraryWork) => {
    setNovelsList((prev) => [importedWork, ...prev]);
    handleStartReading(importedWork);
  };

  const handleContinueReading = (workId: string, chapterId: string) => {
    const all = [...novelsList, ...STORIES, ...SHORT_STORIES];
    const found = all.find((w) => w.id === workId);
    if (found) {
      handleStartReading(found, chapterId);
    }
  };

  const handleOpenQuoteGenerator = (quote?: string, source?: string) => {
    setQuoteData({
      quote: quote || 'ভালোবাসার কোনো ব্যাকরণ নেই, কেবল কিছু অসমাপ্ত আর্তনাদ আর মধ্যরাতের মৌনতা আছে।',
      source: source || 'নিশাত আহমেদ'
    });
    setIsQuoteModalOpen(true);
  };

  const handleOpenWhatsApp = (text?: string) => {
    setWhatsAppText(text);
    setIsWhatsAppToolOpen(true);
  };

  const handleOpenCommentsModal = (work: LiteraryWork) => {
    setCommentTargetWork(work);
    setIsStoryCommentModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${
        theme === 'dark'
          ? 'bg-[#15092a] text-[#facc15]'
          : theme === 'sepia'
          ? 'bg-[#f7f1e6] text-[#b45309]'
          : 'bg-[#fbf8f3] text-[#111111]'
      }`}
    >
      {/* Procedural Atmospheric Sky */}
      <AtmosphericSky theme={theme} />

      {/* Floating Follow Toast Feedback */}
      {followToast && (
        <div className="fixed top-20 right-6 z-50 bg-purple-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-purple-400/50 animate-in fade-in slide-in-from-top-3 font-ui">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{followToast}</span>
        </div>
      )}

      {/* Floating Copyright Protection Citation Banner */}
      {copyrightToast && (
        <div className="fixed top-32 right-6 z-50 max-w-sm bg-[#160c28] text-purple-100 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-2.5 border border-purple-400/60 animate-in fade-in slide-in-from-top-3 font-ui">
          <ShieldCheck className="w-4 h-4 text-purple-300 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-semibold text-white block">কপিরাইট উদ্ধৃতি সংরক্ষিত</span>
            <span className="text-[11px] text-purple-300/90 leading-tight block">{copyrightToast}</span>
          </div>
        </div>
      )}

      {/* First-visit gentle 18+ Safety Modal */}
      <AgeGateModal onConfirm={() => {}} />

      {/* Quote Card Creator Modal */}
      <QuoteCardModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialQuote={quoteData.quote}
        source={quoteData.source}
      />

      {/* AI Assistant Tool Modal (Nishat AI) */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onShareWhatsApp={handleOpenWhatsApp}
      />

      {/* WhatsApp Tool Modal */}
      <WhatsAppToolModal
        isOpen={isWhatsAppToolOpen}
        onClose={() => setIsWhatsAppToolOpen(false)}
        defaultText={whatsAppText}
      />

      {/* Direct Story Comment Modal */}
      <StoryCommentModal
        work={commentTargetWork}
        isOpen={isStoryCommentModalOpen}
        onClose={() => setIsStoryCommentModalOpen(false)}
      />

      {/* Global Bengali & English Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectWork={(work) => handleStartReading(work)}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Content Management Guide Modal */}
      <ContentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Reader-to-Reader Direct Chat Modal */}
      <ReaderChatModal
        isOpen={isReaderChatOpen}
        onClose={() => setIsReaderChatOpen(false)}
        targetReaderName={chatTargetReader}
      />

      {/* Top Bar Header */}
      {currentTab !== 'reader' && (
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          theme={theme}
          onToggleTheme={(t) => setTheme(t)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          onOpenWhatsAppTool={() => handleOpenWhatsApp()}
          isFollowing={isFollowing}
          followerCount={followerCount}
          onToggleFollow={toggleFollow}
          rainActive={rainActive}
          onToggleRain={handleToggleRain}
        />
      )}

      {/* "Continue Reading" memory banner */}
      {currentTab === 'home' && (
        <ContinueReadingBanner onContinue={handleContinueReading} />
      )}

      {/* Main View Container */}
      <div className="flex-grow relative z-10">
        {currentTab === 'reader' && activeWork && (
          <ChapterReader
            work={activeWork}
            initialChapterId={activeChapterId}
            onBack={() => {
              setCurrentTab(activeWork.type === 'novel' ? 'novels' : activeWork.type === 'story' ? 'stories' : 'home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRelatedWork={(relId) => {
              const all = [...NOVELS, ...STORIES, ...SHORT_STORIES];
              const rel = all.find((w) => w.id === relId);
              if (rel) handleStartReading(rel);
            }}
            onOpenQuoteGenerator={handleOpenQuoteGenerator}
            onOpenWhatsAppTool={handleOpenWhatsApp}
            theme={theme}
            onSetTheme={setTheme}
          />
        )}

        {currentTab === 'home' && (
          <HomeHero
            onStartReading={handleStartReading}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuoteGenerator={handleOpenQuoteGenerator}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onOpenWhatsAppTool={handleOpenWhatsApp}
            onOpenComments={handleOpenCommentsModal}
            isFollowing={isFollowing}
            followerCount={followerCount}
            totalReaders={totalReaders}
            activeReadersNow={activeReadersNow}
            onToggleFollow={toggleFollow}
            rainActive={rainActive}
            onToggleRain={handleToggleRain}
          />
        )}

        {currentTab === 'novels' && (
          <WorksGridView
            title="উপন্যাস · Novels"
            subtitle="দীর্ঘ আখ্যান, বহমান জীবনের টানাপোড়েন এবং নিষিদ্ধ ভালোবাসার আত্ম-উন্মোচন।"
            works={NOVELS}
            onRead={handleStartReading}
            onOpenComments={handleOpenCommentsModal}
          />
        )}

        {currentTab === 'stories' && (
          <WorksGridView
            title="গল্প · Stories"
            subtitle="ধারাবাহিক ও সম্পূর্ণ প্রেমের কাহিনী, না-বলা কথা আর অন্তরের সুর।"
            works={STORIES}
            onRead={handleStartReading}
            onOpenComments={handleOpenCommentsModal}
          />
        )}

        {currentTab === 'short_stories' && (
          <WorksGridView
            title="ছোট গল্প · Short Stories"
            subtitle="এক বসায় পড়ার মতো আবেগঘন গল্প, যা মনের ভেতর দীর্ঘস্থায়ী অনুরণন রেখে যায়।"
            works={SHORT_STORIES}
            onRead={handleStartReading}
            onOpenComments={handleOpenCommentsModal}
          />
        )}

        {currentTab === 'poetry' && (
          <PoetryView onShareQuote={handleOpenQuoteGenerator} />
        )}

        {currentTab === 'photography' && (
          <PhotographyView onShareQuote={handleOpenQuoteGenerator} />
        )}

        {currentTab === 'reader_board' && (
          <ReaderBoard onShareWhatsApp={handleOpenWhatsApp} />
        )}

        {currentTab === 'thoughts' && (
          <ThoughtsView onShareQuote={handleOpenQuoteGenerator} />
        )}

        {currentTab === 'about' && (
          <AboutView
            isFollowing={isFollowing}
            followerCount={followerCount}
            totalReaders={totalReaders}
            onToggleFollow={toggleFollow}
          />
        )}
      </div>

      {/* Floating Action Trigger on the right edge */}
      <div className="fixed top-1/2 -translate-y-1/2 right-0 z-40">
        <button
          onClick={() => setIsReaderSideDrawerOpen(true)}
          className="flex items-center gap-1.5 py-3 px-2 rounded-l-2xl bg-gradient-to-b from-purple-600 to-fuchsia-600 text-white shadow-2xl border-y border-l border-purple-400/40 font-ui text-xs font-semibold [writing-mode:vertical-rl] hover:pr-3 transition-all active:scale-95 cursor-pointer"
          title="একপাশে কিছু পোস্ট করুন · Reader's Post Wall"
        >
          <PenLine className="w-3.5 h-3.5 rotate-90" />
          <span>পাঠক পোস্ট · Reader Post</span>
        </button>
      </div>

      {/* Reader Side Drawer */}
      {isReaderSideDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#130b22] border-l border-purple-500/40 h-full overflow-y-auto shadow-2xl relative animate-in slide-in-from-right duration-300 text-neutral-100">
            <div className="sticky top-0 bg-[#170e28] p-4 border-b border-purple-900/60 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-purple-400" />
                <h3 className="font-editorial text-base font-bold text-white">
                  পাঠকের দেয়াল · Reader&apos;s Wall
                </h3>
              </div>
              <button
                onClick={() => setIsReaderSideDrawerOpen(false)}
                className="p-1 rounded-full text-purple-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ReaderBoard onShareWhatsApp={handleOpenWhatsApp} isSidebar={true} />
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Tools */}
      <div className="fixed bottom-5 left-5 z-30 font-ui flex items-center gap-2">
        <button
          onClick={() => setIsGuideModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1030]/90 hover:bg-[#1b1030] text-purple-200 text-xs border border-purple-500/30 shadow-lg backdrop-blur-md transition-all active:scale-95"
          title="নতুন লেখা যুক্ত করার গাইড · Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">লেখক গাইড · Guide</span>
        </button>
      </div>

      <div className="fixed bottom-5 right-5 z-30 font-ui flex items-center gap-2">
        <button
          onClick={() => {
            setChatTargetReader('সহ-পাঠক');
            setIsReaderChatOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:opacity-95 text-white shadow-xl shadow-purple-950/40 border border-purple-400/40 transition-transform active:scale-95 text-xs font-semibold"
          title="পাঠক চ্যাট ও বার্তা বিনিময় · Reader Chat"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">পাঠক চ্যাট</span>
        </button>

        <button
          onClick={() => handleOpenWhatsApp()}
          className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-90"
          title="হোয়াটসঅ্যাপে শেয়ার · WhatsApp"
          aria-label="হোয়াটসঅ্যাপ টুল"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
        </button>

        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:opacity-95 text-white shadow-xl shadow-purple-950/50 border border-purple-400/40 transition-transform active:scale-95 font-medium text-xs"
          title="সাহিত্য সহকারী · AI Assistant"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">সাহিত্য সহকারী · AI</span>
        </button>
      </div>

      {currentTab !== 'reader' && (
        <Footer
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
