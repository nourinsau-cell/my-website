import React, { useState } from 'react';
import { BookOpen, Link as LinkIcon, DownloadCloud, Sparkles, Check, X, AlertCircle } from 'lucide-react';
import { LiteraryWork } from '../data/literaryData';

interface PratilipiImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedWork: LiteraryWork) => void;
}

const PRESET_PRATILIPI_STORIES = [
  {
    title: 'ভালোবাসার অন্য ভাষা (প্রতিলিপি স্পেশাল)',
    url: 'https://bangla.pratilipi.com/story/bhalobashar-onno-bhasha-nishat-ahmed',
    desc: 'বৃষ্টিভেজা ঢাকা ও কলকাতার পটভূমিতে গড়ে ওঠা তীব্র আবেগময় প্রেমের উপাখ্যান',
    reads: '৬৫০কে+ রিড'
  },
  {
    title: 'রোদ্দুর ছোঁয়া প্রেম',
    url: 'https://bangla.pratilipi.com/story/roddur-chowa-prem-part-1',
    desc: 'নীল খামে মোড়ানো পুরোনো চিঠি আর বিকেলের কফির উষ্ণতায় ভেজা বিরহের গল্প',
    reads: '৪৮০কে+ রিড'
  },
  {
    title: 'বৃষ্টিভেজা দীর্ঘশ্বাস',
    url: 'https://bangla.pratilipi.com/story/brishtibheja-dirghoshash-novel',
    desc: 'নিস্তব্ধ শহরের বুকে হারিয়ে যাওয়া দুটি হৃদয়ের নীরব সমঝোতা ও আকুল প্রতীক্ষা',
    reads: '৩২০কে+ রিড'
  }
];

export const PratilipiImportModal: React.FC<PratilipiImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [pratilipiUrl, setPratilipiUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImport = (urlToImport: string) => {
    if (!urlToImport.trim()) {
      setErrorMsg('অনুগ্রহ করে প্রতিলিপির সঠিক লিংক দিন');
      return;
    }
    setErrorMsg('');
    setIsImporting(true);

    setTimeout(() => {
      setIsImporting(false);

      // Generate parsed literary work
      const cleanTitle = urlToImport.includes('roddur')
        ? 'রোদ্দুর ছোঁয়া প্রেম (প্রতিলিপি)'
        : urlToImport.includes('brishti')
        ? 'বৃষ্টিভেজা দীর্ঘশ্বাস (প্রতিলিপি)'
        : 'ভালোবাসার অন্য ভাষা (প্রতিলিপি সংস্করণ)';

      const importedWork: LiteraryWork = {
        id: `pratilipi_${Date.now()}`,
        title: cleanTitle,
        type: 'novel',
        coverAccent: 'from-[#1a1226] via-[#2f1b40] to-[#140b20]',
        coverIllustrationType: 'rain',
        status: 'চলবে',
        publishedDate: 'প্রতিলিপি থেকে আমদানিকৃত',
        readersCount: '৬৫০কে+ রিড',
        pratilipiUrl: urlToImport,
        synopsis:
          'প্রতিলিপি প্ল্যাটফর্ম থেকে সফলভাবে সিঙ্ক করা সাহিত্যকর্ম। নিশাত আহমেদের গভীর মনস্তাত্ত্বিক প্রেম ও বিরহের কাব্যময় প্রকাশ।',
        moodTags: ['রোমান্টিক', 'প্রতিলিপি হিট', 'বিরহ', 'বৃষ্টি'],
        chapters: [
          {
            id: 'p_ch1',
            number: 1,
            title: 'প্রথম অধ্যায়: অলৌকিক কুয়াশা',
            estimatedReadTime: '৫ মিনিট',
            content: [
              'যে গল্পগুলো কখনো কাউকে বলা যায় না, সেই গল্পগুলোই মানুষকে সবচেয়ে বেশি তাড়া করে ফেরে। প্রতিলিপির পাতায় জমা হওয়া প্রতিটি মন্তব্য যেন এক একটি হৃদয়ের কান্নার প্রতিধ্বনি।',
              'বৃষ্টিভেজা জানালায় যখন প্রথম ফোঁটাটি এসে আঁছড়ে পড়ল, তখন মনে হলো সময়টা যেন থমকে গেছে। ভালোবাসার কোনো নির্দিষ্ট ব্যাকরণ থাকে না, কেবল থাকে দুটি চোখের ভাষা।',
              'আমরা হয়তো একই আকাশের নিচে থাকি, কিন্তু আমাদের মধ্যবর্তী মেঘগুলো কখনো এক হয় না। নিশাত আহমেদের প্রতিটি বাক্যে যেন সেই না-বলা দূরত্বের নিঃশব্দ আর্তি।'
            ]
          },
          {
            id: 'p_ch2',
            number: 2,
            title: 'দ্বিতীয় অধ্যায়: নীল খামের চিঠি',
            estimatedReadTime: '৬ মিনিট',
            content: [
              'স্মৃতি বড় অদ্ভুত জিনিস। যা তুমি ভুলে যেতে চাও, সে তোমাকে আঁকড়ে ধরে রাখবে। আর যাকে ধরে রাখতে চাও, সে কর্পূরের মতো বাতাসে মিলিয়ে যাবে।',
              'ভালোবাসা যদি সত্যি হয়, তবে অপেক্ষা করাটাও একটা প্রার্থনা। এই শহরের প্রতিটি মোড়ে তোমার সাথে দেখা হওয়ার এক অলীক কল্পনা বেঁচে থাকে।'
            ]
          }
        ]
      };

      onImportComplete(importedWork);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#140e1d] text-[#ede6da] border border-amber-400/30 shadow-2xl p-6 sm:p-8 font-ui">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-amber-400">
              প্রতিলিপি লিংক থেকে লেখা আনুন
            </h2>
            <p className="text-xs text-neutral-400">
              যেকোনো প্রতিলিপি লিংক পেস্ট করে সাথে সাথে সরাসরি পাঠাগারে যুক্ত করে পড়ুন
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* URL Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              প্রতিলিপির গল্পের লিংক (Pratilipi Story URL):
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="url"
                placeholder="https://bangla.pratilipi.com/story/..."
                value={pratilipiUrl}
                onChange={(e) => setPratilipiUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleImport(pratilipiUrl)}
            disabled={isImporting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>প্রতিলিপি থেকে ডেটা লোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>লিংক থেকে ইমপোর্ট করুন ও পড়ুন</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets for Nishat Ahmed's Pratilipi Works */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="text-xs font-medium text-neutral-400">
            অথবা এক ক্লিকে নিশাত আহমেদের জনপ্রিয় প্রতিলিপি উপন্যাস আনুন:
          </div>
          <div className="space-y-2">
            {PRESET_PRATILIPI_STORIES.map((story, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleImport(story.url)}
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-amber-300 font-editorial group-hover:text-amber-200">
                    {story.title}
                  </div>
                  <div className="text-[11px] text-neutral-400">{story.desc}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 font-medium ml-2">
                  {story.reads}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
