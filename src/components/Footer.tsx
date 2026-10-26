import React from 'react';
import { AUTHOR_BIO } from '../data/literaryData';
import { Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-purple-200/50 dark:border-purple-900/60 bg-[#faf7fd] dark:bg-[#0a0614] text-neutral-600 dark:text-purple-300/80 font-ui transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Brand & Tagline with Dual Language */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="font-editorial text-xl font-bold text-neutral-900 dark:text-neutral-100">
                নিশাত আহমেদ
              </span>
              <span className="text-xs text-purple-400">·</span>
              <span className="font-ui text-xs text-purple-600 dark:text-purple-300 font-medium">
                ভালোবাসার অন্য ভাষা
              </span>
              <span className="text-[11px] font-sans text-purple-400/70 hidden sm:inline">
                (The Language of Another Love)
              </span>
            </div>
            <p className="font-literary text-xs text-neutral-500 dark:text-purple-300/70 mt-2 max-w-sm">
              একটি নিভৃত সাহিত্য নিকেতন। যেখানে প্রতিটি অক্ষর লেখা হয় হৃদয়ের নিবিড় আকুলতায়।
            </p>
          </div>

          {/* Quick Dual-Language Nav */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs font-medium">
            <button onClick={() => onSelectTab('home')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">হোম · Home</button>
            <button onClick={() => onSelectTab('novels')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">উপন্যাস · Novels</button>
            <button onClick={() => onSelectTab('stories')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">গল্প · Stories</button>
            <button onClick={() => onSelectTab('short_stories')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">ছোট গল্প · Shorts</button>
            <button onClick={() => onSelectTab('poetry')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">কবিতা · Poetry</button>
            <button onClick={() => onSelectTab('photography')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">ছবি · Photos</button>
            <button onClick={() => onSelectTab('reader_board')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">পাঠকের ডায়েরি · Board</button>
            <button onClick={() => onSelectTab('thoughts')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">ভাবনা · Thoughts</button>
            <button onClick={() => onSelectTab('about')} className="hover:text-purple-600 dark:hover:text-purple-200 transition-colors">লেখক · About</button>
          </div>

          {/* Pen-name Social Links */}
          <div className="flex items-center gap-4 text-xs">
            {AUTHOR_BIO.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
                title={s.note}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom subtle divider & copyright strictly © নিশাত আহমেদ */}
        <div className="mt-8 pt-6 border-t border-purple-200/40 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 dark:text-purple-400/80 gap-2">
          <p>© নিশাত আহমেদ · Nishat Ahmed. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>শব্দে ও সুরের মায়ায় আবদ্ধ · Wrapped in words & melodies</span>
            <Heart className="w-3 h-3 text-purple-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
