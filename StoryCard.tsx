import React, { useState, useEffect } from 'react';
import { LiteraryWork } from '../data/literaryData';
import { BookCoverArt } from './BookCoverArt';
import { BookOpen, Clock, Heart, MessageSquare, Sparkles } from 'lucide-react';

interface StoryCardProps {
  work: LiteraryWork;
  onRead: (work: LiteraryWork, chapterId?: string) => void;
  onOpenComments?: (work: LiteraryWork) => void;
  featured?: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  work,
  onRead,
  onOpenComments,
  featured = false
}) => {
  // Local reaction states
  const [likes, setLikes] = useState(() => {
    try {
      const stored = localStorage.getItem(`nishat_card_react_${work.id}`);
      return stored ? JSON.parse(stored) : { count: 38 + Math.floor(work.title.length * 3), reacted: false };
    } catch {
      return { count: 45, reacted: false };
    }
  });

  const [showReactPicker, setShowReactPicker] = useState(false);
  const [activeReaction, setActiveReaction] = useState<'heart' | 'tears' | 'sparkle' | null>(null);

  const getWorkTypeBengali = (type: string) => {
    switch (type) {
      case 'novel':
        return 'ধারাবাহিক উপন্যাস';
      case 'story':
        return 'গল্প';
      case 'short_story':
        return 'ছোট গল্প';
      default:
        return 'সাহিত্য';
    }
  };

  const toggleHeartReact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newReacted = !likes.reacted;
    const newCount = newReacted ? likes.count + 1 : likes.count - 1;
    const newState = { count: newCount, reacted: newReacted };
    setLikes(newState);
    setActiveReaction(newReacted ? 'heart' : null);

    try {
      localStorage.setItem(`nishat_card_react_${work.id}`, JSON.stringify(newState));
    } catch {
      // Ignore
    }
  };

  const handlePickReaction = (e: React.MouseEvent, type: 'heart' | 'tears' | 'sparkle') => {
    e.stopPropagation();
    setActiveReaction(type);
    if (!likes.reacted) {
      const newState = { count: likes.count + 1, reacted: true };
      setLikes(newState);
      try {
        localStorage.setItem(`nishat_card_react_${work.id}`, JSON.stringify(newState));
      } catch {
        // Ignore
      }
    }
    setShowReactPicker(false);
  };

  return (
    <article
      onClick={() => onRead(work)}
      className={`group cursor-pointer rounded-2xl border transition-all duration-300 hover:border-purple-400/50 dark:hover:border-purple-500/60 bg-white/80 dark:bg-[#150d24]/80 backdrop-blur-sm overflow-hidden border-purple-200/50 dark:border-purple-900/40 hover:shadow-xl hover:shadow-purple-500/5 ${
        featured ? 'grid grid-cols-1 md:grid-cols-12 gap-6 p-6' : 'flex flex-col p-5'
      }`}
    >
      {/* Cover representation */}
      <div className={featured ? 'md:col-span-5' : 'mb-4'}>
        <BookCoverArt
          title={work.title}
          subtitle={work.subtitle}
          type={work.coverIllustrationType}
          aspect={featured ? '4:3' : '3:4'}
          isMature={work.isMature}
        />
      </div>

      {/* Content representation */}
      <div className={featured ? 'md:col-span-7 flex flex-col justify-between' : 'flex flex-col flex-grow'}>
        <div>
          {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-purple-600 dark:text-purple-300/80 mb-2 font-ui">
            <span>{getWorkTypeBengali(work.type)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">{work.status}</span>
            {work.totalChapters && (
              <>
                <span aria-hidden="true">·</span>
                <span>{work.totalChapters} টি পর্ব</span>
              </>
            )}
            {work.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {work.readingTime}
                </span>
              </>
            )}
            {work.readersCount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-purple-500/90 dark:text-purple-300/80 font-mono text-[11px]">
                  {work.readersCount}
                </span>
              </>
            )}
            {work.isMature && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-rose-500 font-semibold">১৮+</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-editorial text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug">
            {work.title}
          </h3>

          {/* Subtitle if available */}
          {work.subtitle && (
            <p className="font-ui text-sm text-purple-600/90 dark:text-purple-300/80 mt-1 font-medium">
              {work.subtitle}
            </p>
          )}

          {work.pratilipiUrl && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30 text-[10px] font-semibold font-ui inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>প্রতিলিপি মূল প্রকাশনা · Pratilipi</span>
              </span>
            </div>
          )}

          {/* Synopsis */}
          <p className="font-literary text-sm text-neutral-600 dark:text-neutral-300/90 mt-3 line-clamp-3 leading-relaxed">
            {work.synopsis}
          </p>

          {/* Mood Tags (Quiet unboxed text) */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400 dark:text-neutral-500 font-ui">
            <span>অনুভূতি:</span>
            {work.moodTags.map((tag, idx) => (
              <span key={tag} className="text-purple-500/80 dark:text-purple-400/80">
                #{tag}
                {idx < work.moodTags.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Action Toolbar with React and Comment Buttons */}
        <div className="mt-5 pt-4 border-t border-purple-100 dark:border-purple-900/50 flex items-center justify-between gap-2 flex-wrap font-ui">
          
          {/* Reaction & Comment Action Strip */}
          <div className="flex items-center gap-2 relative">
            {/* React Button with Popover option */}
            <div className="relative">
              <button
                onClick={toggleHeartReact}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowReactPicker(!showReactPicker);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  likes.reacted
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300'
                    : 'border-purple-200/80 dark:border-purple-900/60 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-neutral-600 dark:text-neutral-300'
                }`}
                title="প্রতিক্রিয়া দিন (রাইট ক্লিক করে আরও ইমোজি দেখুন)"
              >
                {activeReaction === 'tears' ? (
                  <span>💧</span>
                ) : activeReaction === 'sparkle' ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Heart className={`w-3.5 h-3.5 ${likes.reacted ? 'fill-current text-purple-600 dark:text-purple-400' : ''}`} />
                )}
                <span className="font-mono text-[11px]">{likes.count}</span>
                <span className="text-[11px]">ভালোবাসা</span>
              </button>

              {/* Quick Reaction Emoji Picker Popover */}
              {showReactPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full mb-1 left-0 bg-[#1e1333] border border-purple-500/40 rounded-xl p-1.5 shadow-xl flex items-center gap-1 z-30 animate-in fade-in"
                >
                  <button
                    onClick={(e) => handlePickReaction(e, 'heart')}
                    className="p-1 hover:bg-purple-900/60 rounded-md text-base"
                    title="ভালোবাসা"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={(e) => handlePickReaction(e, 'tears')}
                    className="p-1 hover:bg-purple-900/60 rounded-md text-base"
                    title="চোখের জল"
                  >
                    💧
                  </button>
                  <button
                    onClick={(e) => handlePickReaction(e, 'sparkle')}
                    className="p-1 hover:bg-purple-900/60 rounded-md text-base"
                    title="মুগ্ধতা"
                  >
                    ✨
                  </button>
                </div>
              )}
            </div>

            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenComments) onOpenComments(work);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-purple-200/80 dark:border-purple-900/60 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="পাঠক মন্তব্য দেখুন বা লিখুন"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>মন্তব্য</span>
            </button>
          </div>

          {/* Direct Read Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(work);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 hover:underline focus:outline-none"
          >
            <span>পড়া শুরু করুন</span>
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
