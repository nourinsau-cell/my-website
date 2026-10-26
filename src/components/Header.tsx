import React, { useState } from 'react';
import { Moon, Sun, BookOpen, Search, Menu, X, Sparkles, MessageCircle, Bot, Users, Plus, Check, ExternalLink, Gift, FolderHeart, Globe, DownloadCloud } from 'lucide-react';
import { PRATILIPI_PROFILE_URL } from '../data/literaryData';
import { useLanguage, SupportedLanguage } from '../utils/languageContext';
import { getStoredProfile, AVATAR_OPTIONS, ReaderProfile } from '../utils/readerAccount';

export type ThemeMode = 'light' | 'dark' | 'sepia';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  onOpenSearch: () => void;
  onOpenAiAssistant: () => void;
  onOpenWhatsAppTool: () => void;
  onOpenReaderFolder?: () => void;
  onOpenSendGift?: () => void;
  onOpenPratilipiImport?: () => void;
  isFollowing?: boolean;
  followerCount?: number;
  onToggleFollow?: () => void;
  rainActive: boolean;
  onToggleRain: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onOpenSearch,
  onOpenAiAssistant,
  onOpenWhatsAppTool,
  onOpenReaderFolder,
  onOpenSendGift,
  onOpenPratilipiImport,
  isFollowing = false,
  followerCount = 14280,
  onToggleFollow,
  rainActive,
  onToggleRain
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ReaderProfile | null>(getStoredProfile);

  React.useEffect(() => {
    const handleUpdate = () => setProfile(getStoredProfile());
    window.addEventListener('reader_profile_updated', handleUpdate);
    return () => window.removeEventListener('reader_profile_updated', handleUpdate);
  }, []);

  // Bangla and English Side-by-Side Nav Items
  const navItems = [
    { id: 'home', bn: 'হোম', en: 'Home', hi: 'होम' },
    { id: 'novels', bn: 'উপন্যাস', en: 'Novels', hi: 'उपन्यास' },
    { id: 'stories', bn: 'গল্প', en: 'Stories', hi: 'कहानियाँ' },
    { id: 'short_stories', bn: 'ছোট গল্প', en: 'Shorts', hi: 'लघुकथा' },
    { id: 'poetry', bn: 'কবিতা', en: 'Poetry', hi: 'कविता' },
    { id: 'photography', bn: 'মাই ফটোগ্রাফি', en: 'My Photography', hi: 'माई फोटोग्राफी' },
    { id: 'reader_board', bn: 'পাঠকের ডায়েরি', en: 'Board', hi: 'डायरी' },
    { id: 'thoughts', bn: 'ভাবনা', en: 'Thoughts', hi: 'विचार' },
    { id: 'about', bn: 'লেখক', en: 'About', hi: 'लेखक' }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cycleTheme = () => {
    if (theme === 'light') onToggleTheme('sepia');
    else if (theme === 'sepia') onToggleTheme('dark');
    else onToggleTheme('light');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 border-purple-200/50 dark:border-purple-900/60 bg-[#faf7fd]/95 dark:bg-[#0a0614]/95 text-neutral-800 dark:text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with Bangla & English subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left focus:outline-none"
            aria-label="নিশাত আহমেদ - মূল পাতা / Home"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-yellow-400 dark:text-yellow-300 drop-shadow-[0_1px_8px_rgba(250,204,21,0.3)] transition-colors group-hover:text-yellow-200">
                নিশাত আহমেদ
              </span>
              <span className="text-[11px] font-sans tracking-wide text-yellow-300/80 font-medium hidden sm:inline">
                The Writer
              </span>
            </div>
            <div className="h-[2px] w-full rainbow-hairline rounded-full opacity-70 group-hover:opacity-100 transition-opacity mt-0.5" />
          </button>
        </div>

        {/* Zone 2: Bangla & English Side-by-Side text navigation links (desktop) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium font-ui">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 relative whitespace-nowrap focus:outline-none flex items-center gap-1 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-300 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-purple-200'
                }`}
              >
                <span>{item.bn}</span>
                <span className="text-[10px] text-purple-400/80 font-sans tracking-tight">/ {item.en}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-600 dark:bg-purple-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium screens compact nav */}
        <nav className="hidden lg:flex xl:hidden items-center gap-3.5 text-xs font-medium font-ui">
          {navItems.slice(0, 7).map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 relative whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-300 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-purple-600'
                }`}
              >
                <span>{item.bn}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary tools (Language switch, Send Gift, Reader Folder, Follow button, AI Assistant, WhatsApp, Search, Rain toggle, Theme cycler) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Multi-Language Selector: Bangla, English, Hindi */}
          <div className="flex items-center rounded-full bg-black/30 border border-purple-400/30 p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                language === 'bn' ? 'bg-amber-400 text-black font-extrabold shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="বাংলা ভাষা"
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                language === 'en' ? 'bg-amber-400 text-black font-extrabold shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="English Language"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                language === 'hi' ? 'bg-amber-400 text-black font-extrabold shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="हिन्दी भाषा"
            >
              हिन्दी
            </button>
          </div>

          {/* Send Gift to Writer (BDT, INR, USD) */}
          {onOpenSendGift && (
            <button
              onClick={onOpenSendGift}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold font-ui transition-all active:scale-95 shadow-md shadow-amber-500/20"
              title="লেখককে উপহার পাঠান (টাকা, রুপি, ডলার) / Send Gift to Author"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>উপহার 🎁</span>
            </button>
          )}

          {/* Reader Folder / Profile & Goals Button */}
          {onOpenReaderFolder && (
            <button
              onClick={onOpenReaderFolder}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold font-ui transition-all active:scale-95"
              title="পাঠক ফোল্ডার ও পড়ার লক্ষ্য · Reader Profile & Monthly Goal"
            >
              {profile ? (
                <>
                  <span className="text-sm">
                    {AVATAR_OPTIONS.find((a) => a.id === profile.avatar)?.emoji || '📖'}
                  </span>
                  <span className="max-w-[70px] truncate hidden sm:inline">{profile.name}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    {Math.min(100, Math.round(((profile.monthlyCompleted || 0) / (profile.monthlyGoal || 10)) * 100))}%
                  </span>
                </>
              ) : (
                <>
                  <FolderHeart className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">পাঠক ফোল্ডার</span>
                </>
              )}
            </button>
          )}

          {/* Pratilipi Import Button */}
          {onOpenPratilipiImport && (
            <button
              onClick={onOpenPratilipiImport}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium font-ui transition-colors"
              title="প্রতিলিপি লিংক থেকে লেখা আনুন / Import Pratilipi Story"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span>প্রতিলিপি ইমপোর্ট</span>
            </button>
          )}

          {/* Interactive Follow Button with Live Follower Count */}
          {onToggleFollow && (
            <button
              onClick={onToggleFollow}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-ui transition-all active:scale-95 shadow-xs ${
                isFollowing
                  ? 'bg-purple-900/60 border border-purple-400/80 text-purple-200'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
              title={isFollowing ? 'অনুসরণ করছেন · Following' : 'নিশাত আহমেদকে অনুসরণ করুন · Follow Nishat Ahmed'}
            >
              {isFollowing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isFollowing ? 'অনুসৃত' : 'অনুসরণ'}</span>
              <span className="font-mono text-[10px] opacity-80 tabular-nums">
                ({followerCount.toLocaleString('bn-BD')})
              </span>
            </button>
          )}

          {/* AI Assistant Tool Button */}
          <button
            onClick={onOpenAiAssistant}
            title="সাহিত্য সহকারী / AI Assistant"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90 shadow-sm transition-transform active:scale-95 text-xs font-semibold font-ui"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI সহকারী</span>
          </button>

          {/* WhatsApp Tool Button */}
          <button
            onClick={onOpenWhatsAppTool}
            title="হোয়াটসঅ্যাপ টুল · WhatsApp Share & Community"
            className="p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors focus:outline-none"
            aria-label="হোয়াটসঅ্যাপ টুল"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </button>

          {/* Search Tool Trigger */}
          <button
            onClick={onOpenSearch}
            title="অনুসন্ধান টুল · Search Tool"
            className="p-2 rounded-full text-neutral-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-colors focus:outline-none"
            aria-label="অনুসন্ধান টুল"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Rain / Atmosphere particle toggle */}
          <button
            onClick={onToggleRain}
            title={rainActive ? 'বৃষ্টির আবহ বন্ধ করুন / Turn off Rain' : 'বৃষ্টির আবহ চালু করুন / Turn on Rain'}
            className={`p-2 rounded-full transition-colors focus:outline-none ${
              rainActive
                ? 'text-purple-600 dark:text-purple-300 bg-purple-500/10'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
            }`}
            aria-label="বৃষ্টির প্রভাব টগল"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Theme Mode Cycler: Light -> Sepia -> Dark */}
          <button
            onClick={cycleTheme}
            title={`মোড পরিবর্তন করুন (বর্তমান: ${theme === 'light' ? 'দিবা' : theme === 'sepia' ? 'সেপিয়া' : 'রাত্রি'})`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-900/80 text-neutral-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors focus:outline-none"
            aria-label="থিম পরিবর্তন"
          >
            {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {theme === 'sepia' && <BookOpen className="w-3.5 h-3.5 text-amber-700" />}
            {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-purple-300" />}
            <span className="hidden sm:inline font-ui text-[11px]">
              {theme === 'light' ? 'দিবা' : theme === 'sepia' ? 'সেপিয়া' : 'রাত্রি'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-neutral-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/40 focus:outline-none"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-200 dark:border-purple-900/70 bg-[#faf7fd] dark:bg-[#0a0614] px-4 py-4 space-y-3 font-ui animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs text-left transition-colors font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200'
                      : 'text-neutral-700 dark:text-purple-300/90 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{item.bn}</span>
                    <span className="text-[10px] text-purple-400 font-sans">{item.en}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                </button>
              );
            })}
          </div>

          {/* Mobile Follow Button */}
          {onToggleFollow && (
            <button
              onClick={onToggleFollow}
              className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 ${
                isFollowing
                  ? 'bg-purple-900/60 border border-purple-400 text-purple-200'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {isFollowing ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{isFollowing ? 'অনুসৃত · Following Nishat Ahmed' : 'নিশাত আহমেদকে অনুসরণ করুন · Follow'}</span>
              <span className="font-mono text-[11px]">({followerCount.toLocaleString('bn-BD')})</span>
            </button>
          )}

          {/* Mobile Reader Folder & Send Gift Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onOpenReaderFolder && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReaderFolder();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FolderHeart className="w-4 h-4 text-amber-400" />
                <span>পাঠক ফোল্ডার</span>
              </button>
            )}
            {onOpenSendGift && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSendGift();
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Gift className="w-4 h-4" />
                <span>উপহার পাঠান 🎁</span>
              </button>
            )}
          </div>

          {/* Mobile Action Tools */}
          <div className="pt-2 border-t border-purple-200 dark:border-purple-900/50 flex items-center justify-around text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAssistant();
              }}
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 text-white font-medium"
            >
              <Bot className="w-4 h-4" />
              <span>AI সহকারী</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsAppTool();
              }}
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপ</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-purple-900/40 text-purple-200 border border-purple-700/50"
            >
              <Search className="w-4 h-4" />
              <span>সার্চ / Search</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
