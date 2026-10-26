import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, X } from 'lucide-react';

interface LastReadData {
  workId: string;
  workTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  timestamp: number;
}

interface ContinueReadingBannerProps {
  onContinue: (workId: string, chapterId: string) => void;
}

export const ContinueReadingBanner: React.FC<ContinueReadingBannerProps> = ({ onContinue }) => {
  const [lastRead, setLastRead] = useState<LastReadData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nishat_last_read');
      if (stored) {
        setLastRead(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!lastRead || dismissed) return null;

  return (
    <div className="w-full bg-[#d66872]/10 dark:bg-[#d66872]/15 border-y border-[#d66872]/20 py-3 px-4 transition-all font-ui">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-full bg-[#d66872] text-white">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[11px] font-semibold text-[#d66872] uppercase tracking-wider">
              আপনার পড়া সংরক্ষিত ছিল
            </div>
            <div className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
              <span className="font-bold">{lastRead.workTitle}</span>: {lastRead.chapterTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onContinue(lastRead.workId, lastRead.chapterId)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d66872] text-white hover:bg-[#c45761] text-xs font-semibold shadow-xs transition-transform active:scale-95"
          >
            <span>যেখানে ছিলেন সেখান থেকে পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            aria-label="মুছে দিন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
