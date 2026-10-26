import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageSquare, Feather, Share2, Sparkles, Check, Clock, MessageCircle, CornerDownRight } from 'lucide-react';
import { ReaderChatModal } from './ReaderChatModal';

export interface ReaderReply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ReaderPost {
  id: string;
  author: string;
  text: string;
  mood: string;
  timestamp: string;
  likes: number;
  reactions?: {
    love: number;
    applause: number;
    emotional: number;
    thought: number;
  };
  myReaction?: string;
  replies?: ReaderReply[];
}

interface ReaderBoardProps {
  onShareWhatsApp?: (text: string) => void;
  isSidebar?: boolean;
}

export const ReaderBoard: React.FC<ReaderBoardProps> = ({
  onShareWhatsApp,
  isSidebar = false
}) => {
  const [posts, setPosts] = useState<ReaderPost[]>(() => {
    try {
      const stored = localStorage.getItem('nishat_reader_posts');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [
      {
        id: 'rp-1',
        author: 'তানভীর',
        mood: 'বিরহ',
        text: 'মধ্যরাতে যখন বৃষ্টি নামে, তখন পুরোনো কোনো স্মৃতির ছায়া এসে জানালার পাশে দাঁড়ায়। নিশাত ভাইয়ের লেখাগুলো যেন আমার মনের কথাই বলে।',
        timestamp: 'আজ রাত ১:২০',
        likes: 19,
        reactions: { love: 19, applause: 6, emotional: 12, thought: 4 },
        replies: [
          {
            id: 'rep-1',
            author: 'সোহাগ',
            text: 'বৃষ্টির শব্দে প্রিয় মানুষটির স্মৃতি আরও তীব্র হয়ে ওঠে...',
            timestamp: 'রাত ১:৪৫'
          }
        ]
      },
      {
        id: 'rp-2',
        author: 'অরণ্য',
        mood: 'প্রেম',
        text: 'ভালোবাসাকে কোনো সংজ্ঞায় বাঁধা যায় না। মেঘডুবি রাতের অয়ন আর নিলয়ের গল্পটা পড়ে চোখের জল আটকাতে পারিনি। সমপ্রেমের এত পবিত্র রূপ আগে কখনো বাংলায় পড়িনি।',
        timestamp: 'গতকাল রাত ১১:৪৫',
        likes: 34,
        reactions: { love: 34, applause: 18, emotional: 22, thought: 15 },
        replies: [
          {
            id: 'rep-2',
            author: 'মেঘলা মন',
            text: 'নিশাত ভাইয়ের গভীর মানবপ্রেমের দৃষ্টি সত্যিই অন্যরকম।',
            timestamp: 'আজ সকাল ৯:৩০'
          }
        ]
      },
      {
        id: 'rp-3',
        author: 'নীলাঞ্জনা',
        mood: 'অপেক্ষা',
        text: 'এক কাপ চা আর বৃষ্টির শব্দ... এর চেয়ে সুন্দর সন্ধ্যা আর কী হতে পারে?',
        timestamp: '২ দিন আগে',
        likes: 12,
        reactions: { love: 12, applause: 5, emotional: 2, thought: 7 },
        replies: []
      }
    ];
  });

  const [authorName, setAuthorName] = useState('');
  const [postText, setPostText] = useState('');
  const [selectedMood, setSelectedMood] = useState('প্রেম');
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Active reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  // Reader-to-Reader Direct Chat Modal state
  const [chatTargetReader, setChatTargetReader] = useState<string | null>(null);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  const moods = ['প্রেম', 'বিরহ', 'অপেক্ষা', 'আশা', 'স্মৃতি', 'অনুভূতি'];

  const savePosts = (newPosts: ReaderPost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem('nishat_reader_posts', JSON.stringify(newPosts));
    } catch {
      // Ignore
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const newPost: ReaderPost = {
      id: `rp-${Date.now()}`,
      author: authorName.trim() || 'নিভৃত পাঠক / Anonymous Reader',
      text: postText.trim(),
      mood: selectedMood,
      timestamp: 'এইমাত্র / Just now',
      likes: 1,
      reactions: {
        love: 1,
        applause: 0,
        emotional: 0,
        thought: 0
      },
      replies: []
    };

    savePosts([newPost, ...posts]);
    setPostText('');
    setAuthorName('');
    setPostedSuccess(true);
    setTimeout(() => setPostedSuccess(false), 3000);
  };

  // Toggle or add reaction
  const handleReaction = (postId: string, reactionType: 'love' | 'applause' | 'emotional' | 'thought') => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      const currentReactions = p.reactions || { love: 0, applause: 0, emotional: 0, thought: 0 };
      const hadReaction = p.myReaction === reactionType;

      const nextReactions = { ...currentReactions };
      if (hadReaction) {
        nextReactions[reactionType] = Math.max(0, nextReactions[reactionType] - 1);
      } else {
        if (p.myReaction && nextReactions[p.myReaction as keyof typeof nextReactions] !== undefined) {
          nextReactions[p.myReaction as keyof typeof nextReactions] = Math.max(0, nextReactions[p.myReaction as keyof typeof nextReactions] - 1);
        }
        nextReactions[reactionType] = (nextReactions[reactionType] || 0) + 1;
      }

      const totalLikes = nextReactions.love + (p.likes > 0 && !p.myReaction ? 0 : 0);

      return {
        ...p,
        reactions: nextReactions,
        myReaction: hadReaction ? undefined : reactionType,
        likes: Math.max(totalLikes, nextReactions.love)
      };
    });

    savePosts(updated);
  };

  // Handle reply submission on a post
  const handleReplySubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: ReaderReply = {
      id: `rep-${Date.now()}`,
      author: replyAuthor.trim() || 'সহ-পাঠক',
      text: replyText.trim(),
      timestamp: 'এইমাত্র'
    };

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        replies: [...(p.replies || []), newReply]
      };
    });

    savePosts(updated);
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <>
      {/* Reader-to-Reader Private Messaging Modal */}
      {chatTargetReader && (
        <ReaderChatModal
          isOpen={!!chatTargetReader}
          onClose={() => setChatTargetReader(null)}
          targetReaderName={chatTargetReader}
          initialContext={chatContext}
        />
      )}

      <div className={`mx-auto ${isSidebar ? 'p-4' : 'max-w-4xl px-4 sm:px-6 py-10'} font-ui`}>
        
        {/* Title Header */}
        {!isSidebar && (
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-semibold">
              <Feather className="w-3.5 h-3.5" />
              <span>পাঠকের ডায়েরি ও মুক্ত দেয়াল</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              পাঠকের ভাবনা ও অনুভূতি
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-purple-300/80 leading-relaxed font-literary">
              এখানে যেকোনো পাঠক নিজের অনুভব প্রকাশ করতে পারেন, একে অন্যের মন্তব্যে প্রতিক্রিয়া জানাতে পারেন, উত্তর দিতে পারেন এবং সরাসরি সহ-পাঠককে টেক্সট পাঠাতে পারেন।
            </p>
          </div>
        )}

        {/* Input Card Form */}
        <div className="p-5 sm:p-6 rounded-3xl border border-purple-200/80 dark:border-purple-800/60 bg-gradient-to-br from-white/90 via-purple-50/40 to-white/70 dark:from-[#170e28] dark:to-[#120a20] shadow-sm mb-8 backdrop-blur-md">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            {postedSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>আপনার অনুভূতি পাঠকের দেওয়ালে যুক্ত হয়েছে!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-purple-400 font-medium block mb-1">
                  আপনার নাম বা ছদ্মনাম (Your Name):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মেঘলা মন, নিভৃত পাঠক..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-white/70 dark:bg-[#1b1030] text-purple-900 dark:text-purple-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-purple-400 font-medium block mb-1">
                  অনুভূতির ধরন (Mood / Feeling):
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {moods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMood(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                        selectedMood === m
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-purple-100/60 dark:bg-purple-900/40 text-neutral-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70'
                      }`}
                    >
                      #{m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-purple-400 font-medium block mb-1">
                আপনার অনুভূতি বা ভাবনা (Your Thoughts):
              </label>
              <textarea
                rows={3}
                required
                placeholder="বৃষ্টির রাত, না-বলা প্রেম, একাকীত্ব কিংবা নিশাত আহমেদের লেখা নিয়ে মনের কথা লিখুন..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-white/70 dark:bg-[#1b1030] text-purple-900 dark:text-purple-100 focus:outline-none focus:border-purple-500 leading-relaxed font-literary"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-400">
                💬 সহ-পাঠকদের সাথে খোলা মনে অনুভূতি ভাগ করে নিন
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>পোস্ট করুন · Post</span>
              </button>
            </div>
          </form>
        </div>

        {/* Reader Posts Feed */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>সর্বশেষ পাঠক বার্তা ও আলোচনা ({posts.length})</span>
            <span className="text-[11px] font-normal text-neutral-400">Latest Reader Notes</span>
          </h3>

          {posts.map((post) => (
            <article
              key={post.id}
              className="p-5 rounded-3xl border border-purple-200/60 dark:border-purple-900/40 bg-white/60 dark:bg-[#130b22]/70 backdrop-blur-sm shadow-xs transition-all hover:border-purple-400/50 space-y-3"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-purple-100 font-editorial block">
                      {post.author}
                    </span>
                    <span className="px-2 py-0.2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px]">
                      #{post.mood}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-purple-400/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.timestamp}
                  </span>

                  {/* Reader to Reader Text Button */}
                  <button
                    onClick={() => {
                      setChatTargetReader(post.author);
                      setChatContext(`পোস্ট: “${post.text.slice(0, 35)}...”`);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium transition-all active:scale-95"
                    title={`${post.author} কে সরাসরি টেক্সট পাঠান`}
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>টেক্সট করুন</span>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-purple-100/90 leading-relaxed font-literary whitespace-pre-line pl-10">
                {post.text}
              </p>

              {/* Bottom Actions: Reactions Bar & Reply Trigger */}
              <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-900/30 flex flex-wrap items-center justify-between gap-2 pl-10">
                
                {/* 4 Multi-Reactions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleReaction(post.id, 'love')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      post.myReaction === 'love'
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 scale-105'
                        : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                    }`}
                    title="ভালোবাসা · Love"
                  >
                    <span>❤️</span>
                    <span className="text-[11px] font-mono">{post.reactions?.love || post.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(post.id, 'applause')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      post.myReaction === 'applause'
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 scale-105'
                        : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                    }`}
                    title="দারুণ · Clap"
                  >
                    <span>👏</span>
                    <span className="text-[11px] font-mono">{post.reactions?.applause || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(post.id, 'emotional')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      post.myReaction === 'emotional'
                        ? 'bg-sky-500/30 text-sky-300 border border-sky-500/50 scale-105'
                        : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                    }`}
                    title="আবেগঘন · Emotional"
                  >
                    <span>😢</span>
                    <span className="text-[11px] font-mono">{post.reactions?.emotional || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction(post.id, 'thought')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      post.myReaction === 'thought'
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 scale-105'
                        : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                    }`}
                    title="সুন্দর ভাবনা · Inspiring"
                  >
                    <span>💡</span>
                    <span className="text-[11px] font-mono">{post.reactions?.thought || 0}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingToId(replyingToId === post.id ? null : post.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>{replyingToId === post.id ? 'বাতিল' : 'উত্তর দিন · Reply'}</span>
                  </button>

                  {onShareWhatsApp && (
                    <button
                      onClick={() =>
                        onShareWhatsApp(`“${post.text}”\n— ${post.author} (নিশাত আহমেদ পাঠক ডায়েরি)`)
                      }
                      className="flex items-center gap-1 text-[11px] text-emerald-500 hover:underline"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>শেয়ার</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Reply Form */}
              {replyingToId === post.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(post.id, e)}
                  className="pl-10 pt-2 space-y-2 animate-in fade-in"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="আপনার নাম..."
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      className="w-1/3 text-xs px-2.5 py-1.5 rounded-xl border border-purple-800 bg-[#140c24] text-white focus:outline-none focus:border-purple-400"
                    />
                    <input
                      type="text"
                      required
                      placeholder={`${post.author} এর পোস্টের উত্তর লিখুন...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-purple-800 bg-[#140c24] text-white focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Send className="w-3 h-3" />
                      <span>পাঠান</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Nested Replies List */}
              {post.replies && post.replies.length > 0 && (
                <div className="pl-10 pt-2 space-y-2 border-l-2 border-purple-800/40 ml-4">
                  {post.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-2xl bg-[#1d1136]/70 border border-purple-800/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-purple-300 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="text-purple-400">↳</span>
                          <span>{rep.author}</span>
                        </span>
                        <span className="text-[10px] text-purple-400">{rep.timestamp}</span>
                      </div>
                      <p className="text-purple-100 font-literary leading-relaxed text-xs">
                        {rep.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
};
