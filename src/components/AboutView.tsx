import React from 'react';
import { AUTHOR_BIO, PRATILIPI_PROFILE_URL } from '../data/literaryData';
import { Feather, Heart, ExternalLink, ShieldCheck, Plus, Check, Users, BookOpen, Star, Sparkles } from 'lucide-react';

interface AboutViewProps {
  isFollowing?: boolean;
  followerCount?: number;
  totalReaders?: number;
  onToggleFollow?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  isFollowing = false,
  followerCount = 14280,
  totalReaders = 98450,
  onToggleFollow
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 font-ui">
      {/* Editorial Profile Header without face photo */}
      <div className="text-center mb-10 relative z-30">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-900 to-fuchsia-900 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-xl mb-4">
          <Feather className="w-8 h-8" />
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-yellow-400 dark:text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,204,21,0.35)]">
          নিশাত আহমেদ
        </h1>
        <p className="font-ui text-sm text-purple-600 dark:text-purple-300 mt-1 font-medium">
          ভালোবাসার অন্য ভাষা · The Language of Another Love
        </p>

        {/* Live Follower & Reader stats */}
        <div className="flex items-center justify-center gap-4 text-xs text-purple-400/90 mt-3 font-mono">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{followerCount.toLocaleString('bn-BD')} অনুসারী · Followers</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalReaders.toLocaleString('bn-BD')} পাঠক · Readers</span>
          </span>
        </div>

        {/* Follow Button */}
        {onToggleFollow && (
          <div className="mt-4">
            <button
              onClick={onToggleFollow}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-md ${
                isFollowing
                  ? 'bg-purple-950/80 border border-purple-400 text-purple-200'
                  : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90'
              }`}
            >
              {isFollowing ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{isFollowing ? 'অনুসৃত · Following Nishat Ahmed' : 'লেখককে অনুসরণ করুন · Follow'}</span>
            </button>
          </div>
        )}

        <div className="w-16 h-[2px] rainbow-hairline mx-auto mt-6 rounded-full" />
      </div>

      {/* Literary Bio Prose */}
      <article className="rounded-3xl p-6 sm:p-10 border border-purple-200/60 dark:border-purple-900/60 bg-white/80 dark:bg-[#150d24]/80 backdrop-blur-sm shadow-xs space-y-6 font-literary text-base sm:text-lg text-neutral-800 dark:text-purple-100/95 leading-[2.1] text-justify">
        {AUTHOR_BIO.bioParagraphs.map((para, idx) => (
          <p key={idx} className="indent-6">
            {para}
          </p>
        ))}

        {/* Inclusive Manifesto Box */}
        <div className="my-6 p-5 rounded-2xl border border-purple-500/30 bg-purple-950/30 font-ui text-xs text-purple-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-purple-300">
            <Heart className="w-4 h-4 fill-current text-purple-400" />
            <span>অন্তর্ভুক্তি ও শ্রদ্ধার অঙ্গীকার · Inclusive Manifesto</span>
          </div>
          <p className="font-literary leading-relaxed text-sm text-purple-100/90">
            এই প্ল্যাটফর্মটি প্রতিটি ভালোবাসার মুক্ত আশ্রয়। যে ভালোবাসাকে সমাজ অস্বীকার করতে চায়, সমপ্রেমের যে বিশুদ্ধ সুরকে তথাকথিত প্রথা চাপা দিতে চায়—নিশাত আহমেদের কলম সেই প্রতিটি হৃদয়ের পাশে নিঃশর্তভাবে দাঁড়িয়েছে। এখানে প্রতিটি পাঠক তাঁর স্বকীয়তায় সম্মানিত।
          </p>
        </div>

        {/* Privacy Note */}
        <div className="pt-4 border-t border-purple-200/50 dark:border-purple-900/40 flex items-center gap-3 text-xs text-purple-400 font-ui">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            লেখকের ব্যক্তিগত গোপনীয়তা রক্ষা করতে কোনো বাস্তব পরিচয়, কর্মক্ষেত্র বা ব্যক্তিগত যোগাযোগ এখানে সংরক্ষিত বা প্রকাশিত নয়।
          </span>
        </div>
      </article>

      {/* Pratilipi Official Author Showcase Section */}
      <section className="mt-10 p-6 sm:p-8 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-purple-950/20 to-purple-950/40 text-neutral-800 dark:text-neutral-100 font-ui shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-400/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>অফিসিয়াল প্রতিলিপি প্রোফাইল · Pratilipi Verified Author</span>
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold mt-1">
              প্রতিলিপিতে নিশাত আহমেদ (ID: 513beyi069)
            </h3>
          </div>

          <a
            href={PRATILIPI_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950 font-bold text-xs shadow-md transition-transform active:scale-95 shrink-0"
          >
            <span>প্রতিলিপিতে অনুসরণ করুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Pratilipi Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-center">
          <div className="p-3 rounded-2xl bg-white/50 dark:bg-purple-950/50 border border-amber-400/20">
            <span className="text-base sm:text-lg font-bold font-mono text-amber-500 block">
              ৩,০০০+
            </span>
            <span className="text-[11px] text-purple-400">প্রতিলিপি অনুসারী</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-purple-950/50 border border-amber-400/20">
            <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold font-mono text-amber-500">
              <span>৪.৮</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-purple-400">পাঠক রেটিং</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-purple-950/50 border border-amber-400/20">
            <span className="text-base sm:text-lg font-bold font-mono text-amber-500 block">
              ১০+
            </span>
            <span className="text-[11px] text-purple-400">প্রকাশিত সাহিত্যকর্ম</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-purple-950/50 border border-amber-400/20">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 block">
              জনপ্রিয়
            </span>
            <span className="text-[11px] text-purple-400">ধারাবাহিক লেখক</span>
          </div>
        </div>

        {/* Popular Pratilipi Works Grid */}
        <div className="pt-2 space-y-2">
          <span className="text-xs font-semibold text-purple-300 block">
            প্রতিলিপির অন্যতম আলোচিত উপন্যাস ও সিরিজসমূহ:
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 ফাল্গুনী হাওয়া (রূপান্তরিত পুরুষ)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 পিউকাঁহা (পর্ব ১)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 তুমি ও নীল আকাশ (পর্ব ২)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 এবং অবশেষে
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 আপনাদের নিশাত আহমেদের গল্প
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-200">
              📖 কিছুকথা
            </span>
          </div>
        </div>
      </section>

      {/* Pen-Named Social Channels */}
      <div className="mt-10">
        <h3 className="font-editorial text-lg font-bold text-neutral-900 dark:text-neutral-100 text-center mb-6">
          লেখক নিশাত আহমেদের সাথে সংযুক্ত থাকুন · Connect
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUTHOR_BIO.socials.map((soc) => (
            <a
              key={soc.label}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-purple-200/60 dark:border-purple-900/60 hover:border-purple-400 bg-white/50 dark:bg-[#150d24]/50 flex items-center justify-between transition-all group"
            >
              <div>
                <h4 className="text-sm font-semibold text-neutral-800 dark:text-purple-200 group-hover:text-purple-400">
                  {soc.label}
                </h4>
                <p className="text-xs text-purple-400/80 mt-0.5">{soc.note}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
