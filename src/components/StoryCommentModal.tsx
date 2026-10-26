import React, { useState, useEffect } from 'react';
import { LiteraryWork } from '../data/literaryData';
import { X, MessageSquare, Send, Check, Heart, MessageCircle, CornerDownRight, Smile } from 'lucide-react';
import { ReaderChatModal } from './ReaderChatModal';

interface StoryCommentModalProps {
  work: LiteraryWork | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  reactions?: {
    love: number;
    applause: number;
    emotional: number;
    thought: number;
  };
  myReaction?: string;
  replies?: CommentReply[];
}

export const StoryCommentModal: React.FC<StoryCommentModalProps> = ({
  work,
  isOpen,
  onClose
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Active reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  // Reader-to-reader Chat state
  const [chatTargetReader, setChatTargetReader] = useState<string | null>(null);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!work) return;
    try {
      const stored = localStorage.getItem(`nishat_story_comments_${work.id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        // Initial rich comments with reactions & sample reply
        const initial: CommentItem[] = [
          {
            id: 'c-init-1',
            author: 'মেঘলা বিকেল',
            text: `“${work.title}” পড়ে হৃদয় কেমন ভারী হয়ে উঠল। শব্দচয়ন এবং অনুভূতির প্রকাশ অসাধারণ!`,
            date: 'গতকাল',
            reactions: {
              love: 14,
              applause: 8,
              emotional: 5,
              thought: 3
            },
            replies: [
              {
                id: 'r-1',
                author: 'শুভ্র নীল',
                text: 'একমত! বিশেষ করে শেষ অনুচ্ছেদের উপমাটা মনে দাগ কেটে যায়।',
                date: 'আজ সকাল'
              }
            ]
          }
        ];
        setComments(initial);
      }
    } catch {
      // Ignore
    }
  }, [work]);

  if (!isOpen || !work) return null;

  const saveComments = (newComments: CommentItem[]) => {
    setComments(newComments);
    try {
      localStorage.setItem(`nishat_story_comments_${work.id}`, JSON.stringify(newComments));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: authorName.trim() || 'নিভৃত পাঠক',
      text: commentText.trim(),
      date: 'এইমাত্র',
      reactions: {
        love: 1,
        applause: 0,
        emotional: 0,
        thought: 0
      },
      replies: []
    };

    saveComments([newComment, ...comments]);

    setAuthorName('');
    setCommentText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Handle reaction on a comment
  const handleReaction = (commentId: string, reactionType: 'love' | 'applause' | 'emotional' | 'thought') => {
    const updated = comments.map((c) => {
      if (c.id !== commentId) return c;

      const currentReactions = c.reactions || { love: 0, applause: 0, emotional: 0, thought: 0 };
      const hadReaction = c.myReaction === reactionType;

      const nextReactions = { ...currentReactions };
      if (hadReaction) {
        nextReactions[reactionType] = Math.max(0, nextReactions[reactionType] - 1);
      } else {
        if (c.myReaction && nextReactions[c.myReaction as keyof typeof nextReactions] !== undefined) {
          nextReactions[c.myReaction as keyof typeof nextReactions] = Math.max(0, nextReactions[c.myReaction as keyof typeof nextReactions] - 1);
        }
        nextReactions[reactionType] = (nextReactions[reactionType] || 0) + 1;
      }

      return {
        ...c,
        reactions: nextReactions,
        myReaction: hadReaction ? undefined : reactionType
      };
    });

    saveComments(updated);
  };

  // Handle submitting a threaded reply
  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      author: replyAuthor.trim() || 'পাঠক বন্ধু',
      text: replyText.trim(),
      date: 'এইমাত্র'
    };

    const updated = comments.map((c) => {
      if (c.id !== commentId) return c;
      return {
        ...c,
        replies: [...(c.replies || []), newReply]
      };
    });

    saveComments(updated);
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <>
      {/* Reader-to-Reader Direct Chat Modal */}
      {chatTargetReader && (
        <ReaderChatModal
          isOpen={!!chatTargetReader}
          onClose={() => setChatTargetReader(null)}
          targetReaderName={chatTargetReader}
          initialContext={chatContext}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl bg-[#140c24] border border-purple-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 font-ui text-neutral-100 max-h-[88vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-purple-600/30 text-purple-300">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-white">
                  পাঠক মন্তব্য, প্রতিক্রিয়া ও আলোচনা
                </h3>
                <p className="text-xs text-purple-400 font-literary line-clamp-1">{work.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-purple-900/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comment list */}
          <div className="py-4 space-y-4 overflow-y-auto flex-grow max-h-[360px] pr-1">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#1b1030] border border-purple-900/50 text-xs space-y-2.5 transition-all"
              >
                {/* Author Info & Reader-to-Reader Text Trigger */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xs">
                      {c.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-purple-200 font-semibold block">{c.author}</span>
                      <span className="text-[10px] text-purple-400">{c.date}</span>
                    </div>
                  </div>

                  {/* Text reader button */}
                  <button
                    onClick={() => {
                      setChatTargetReader(c.author);
                      setChatContext(`মন্তব্য: “${c.text.slice(0, 35)}...”`);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-300 hover:text-white border border-purple-700/50 text-[11px] font-medium transition-all active:scale-95"
                    title={`${c.author} কে সরাসরি মেসেজ পাঠান`}
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>টেক্সট করুন</span>
                  </button>
                </div>

                {/* Comment Text */}
                <p className="text-purple-100 font-literary leading-relaxed text-xs sm:text-sm pl-9">
                  {c.text}
                </p>

                {/* Action Bar: Reactions & Reply Button */}
                <div className="pl-9 pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-purple-900/40">
                  {/* Reactions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleReaction(c.id, 'love')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        c.myReaction === 'love'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 scale-105'
                          : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                      }`}
                      title="ভালোবাসা · Love"
                    >
                      <span>❤️</span>
                      <span className="text-[10px] font-mono">{c.reactions?.love || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(c.id, 'applause')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        c.myReaction === 'applause'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 scale-105'
                          : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                      }`}
                      title="দারুণ · Clap"
                    >
                      <span>👏</span>
                      <span className="text-[10px] font-mono">{c.reactions?.applause || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(c.id, 'emotional')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        c.myReaction === 'emotional'
                          ? 'bg-sky-500/30 text-sky-300 border border-sky-500/50 scale-105'
                          : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                      }`}
                      title="আবেগঘন · Emotional"
                    >
                      <span>😢</span>
                      <span className="text-[10px] font-mono">{c.reactions?.emotional || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(c.id, 'thought')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        c.myReaction === 'thought'
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 scale-105'
                          : 'bg-purple-950/60 hover:bg-purple-900/50 text-purple-300'
                      }`}
                      title="সুন্দর ভাবনা · Inspiring"
                    >
                      <span>💡</span>
                      <span className="text-[10px] font-mono">{c.reactions?.thought || 0}</span>
                    </button>
                  </div>

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white transition-colors"
                  >
                    <CornerDownRight className="w-3 h-3 text-purple-400" />
                    <span>{replyingToId === c.id ? 'বাতিল' : 'উত্তর দিন · Reply'}</span>
                  </button>
                </div>

                {/* Inline Reply Form */}
                {replyingToId === c.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(c.id, e)}
                    className="pl-9 pt-2 space-y-2 animate-in fade-in"
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
                        placeholder={`${c.author} এর মন্তব্যের উত্তর লিখুন...`}
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
                {c.replies && c.replies.length > 0 && (
                  <div className="pl-9 pt-2 space-y-2 border-l-2 border-purple-900/60 ml-4">
                    {c.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-2.5 rounded-xl bg-[#23153f]/60 border border-purple-800/40 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between text-purple-300 font-semibold">
                          <span className="flex items-center gap-1">
                            <span>↳ {rep.author}</span>
                          </span>
                          <span className="text-[10px] text-purple-400">{rep.date}</span>
                        </div>
                        <p className="text-purple-100 font-literary leading-relaxed text-xs">
                          {rep.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New Comment Input form */}
          <form onSubmit={handleSubmit} className="pt-3 border-t border-purple-900/50 space-y-2">
            {submitted && (
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>আপনার মন্তব্য ও অনুভূতি যুক্ত হয়েছে!</span>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="আপনার নাম বা ছদ্মনাম"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-1/3 text-xs px-3 py-2 rounded-xl border border-purple-800/60 bg-[#1b1030] text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
              />
              <textarea
                rows={2}
                required
                placeholder="এই সাহিত্যকর্ম নিয়ে আপনার ভালো লাগা ও অনুভূতি লিখুন..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-purple-800/60 bg-[#1b1030] text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 leading-relaxed font-literary"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-purple-400">
                💬 সহ-পাঠকদের সাথে আলোচনা ও অনুভূতি বিনিময় করুন
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>মন্তব্য প্রকাশ করুন</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
