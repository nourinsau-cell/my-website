import React from 'react';
import { X, Code, FileText, CheckCircle2 } from 'lucide-react';

interface ContentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentGuideModal: React.FC<ContentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121826] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col font-ui text-neutral-800 dark:text-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#d66872]" />
            <h3 className="font-editorial text-xl font-bold">
              লেখক গাইড — নতুন লেখা যুক্ত করার সহজ নিয়ম
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content instructions */}
        <div className="py-4 space-y-6 overflow-y-auto text-xs sm:text-sm leading-relaxed">
          <p className="font-literary text-neutral-600 dark:text-neutral-300">
            সাইটের কোনো ডিজাইন বা কোড পরিবর্তন না করেই আপনি খুব সহজে নতুন উপন্যাস, গল্প, কবিতা ও আলোকচিত্র যোগ করতে পারবেন। সমস্ত কনটেন্ট রাখা আছে <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-rose-500 font-mono">src/data/literaryData.ts</code> ফাইলে।
          </p>

          {/* 1. Novels & Stories */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>১. নতুন উপন্যাস বা অধ্যায় যোগ করা:</span>
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              <code className="text-indigo-500 font-mono">NOVELS</code> বা <code className="text-indigo-500 font-mono">STORIES</code> অ্যারেতে একটি নতুন অবজেক্ট দিন। প্রতিটি অধ্যায়ের জন্য <code className="font-mono text-rose-500">chapters</code> অ্যারেতে শিরোনাম ও অনুচ্ছেদগুলো যোগ করুন। প্রাপ্তবয়স্ক বা ১৮+ বিষয় থাকলে <code className="font-mono text-amber-500">isMature: true</code> করে দিন।
            </p>
          </div>

          {/* 2. Poems */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>২. নতুন কবিতা যোগ করা:</span>
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              <code className="text-indigo-500 font-mono">POEMS</code> অ্যারেতে কবিতাটির শিরোনাম, তারিখ, অনুভূতি ট্যাগ এবং <code className="font-mono text-rose-500">stanzas</code>-এ প্রতিটি স্তবক বাংলা লাইনে লিখে দিন।
            </p>
          </div>

          {/* 3. Photos */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>৩. নতুন ছবি ও কবিতার চরণ যোগ করা:</span>
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400">
              <code className="text-indigo-500 font-mono">PHOTO_GALLERY</code> অ্যারেতে আলোকচিত্রের শিরোনাম, ক্যাপশন ও সাথে জুড়ে দেওয়ার জন্য কবিতার লাইন (<code className="font-mono text-rose-500">pairedVerse</code>) যুক্ত করুন।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
