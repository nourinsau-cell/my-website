import React, { useState } from 'react';
import { POEMS, Poem } from '../data/literaryData';
import { MoodFilter } from './MoodFilter';
import { Sparkles, Feather, Calendar } from 'lucide-react';

interface PoetryViewProps {
  onShareQuote: (quote: string, source: string) => void;
}

export const PoetryView: React.FC<PoetryViewProps> = ({ onShareQuote }) => {
  const [selectedMood, setSelectedMood] = useState<string>('সব');
  const [activePoemId, setActivePoemId] = useState<string>(POEMS[0]?.id || '');

  const filteredPoems = selectedMood === 'সব'
    ? POEMS
    : POEMS.filter((p) => p.moodTag === selectedMood);

  const activePoem = filteredPoems.find((p) => p.id === activePoemId) || filteredPoems[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 font-ui">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#d66872] mb-2 uppercase tracking-widest">
          <Feather className="w-3.5 h-3.5" />
          <span>পংক্তিমালা</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          কবিতা
        </h1>
        <p className="font-literary text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          শব্দের ভেতর কিছু না-বলা সুর, মধ্যরাতের নীরব অশ্রু আর ভালোবাসার নিভৃত আকুলতা।
        </p>
      </div>

      {/* Mood filter */}
      <div className="max-w-md mx-auto mb-10">
        <MoodFilter
          selectedMood={selectedMood}
          onSelectMood={(m) => {
            setSelectedMood(m);
            const firstOfMood = (m === 'সব' ? POEMS : POEMS.filter((p) => p.moodTag === m))[0];
            if (firstOfMood) setActivePoemId(firstOfMood.id);
          }}
        />
      </div>

      {/* Poem Selector Tabs (Clean segmented control) */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        {filteredPoems.map((poem) => (
          <button
            key={poem.id}
            onClick={() => setActivePoemId(poem.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activePoem?.id === poem.id
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md font-semibold'
                : 'bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 border border-neutral-200/60 dark:border-neutral-800'
            }`}
          >
            {poem.title}
          </button>
        ))}
      </div>

      {/* Main Minimal Centered Verses Card */}
      {activePoem && (
        <article className="relative max-w-2xl mx-auto rounded-3xl p-8 sm:p-14 border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#111726]/70 backdrop-blur-md shadow-sm transition-all duration-300">
          
          {/* Subtle Ambient Decorative Watermark */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-[1px] rainbow-hairline opacity-60" />

          {/* Poem Meta */}
          <div className="text-center mb-8">
            <span className="text-xs text-neutral-400 font-ui">
              অনুভূতি: #{activePoem.moodTag} · {activePoem.date}
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
              {activePoem.title}
            </h2>
            {activePoem.note && (
              <p className="font-ui text-xs text-[#c59b27] dark:text-[#e2ba4d] mt-1 italic">
                {activePoem.note}
              </p>
            )}
          </div>

          {/* Stanzas in Centered Literary Typography */}
          <div className="space-y-8 text-center font-literary text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-[2.2]">
            {activePoem.stanzas.map((stanza, idx) => (
              <div key={idx} className="relative group">
                <p className="whitespace-pre-line tracking-wide">
                  {stanza}
                </p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onShareQuote(stanza, `কবিতা: ${activePoem.title}`)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#d66872] hover:underline font-ui"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>এই স্তবকটি কার্ড হিসেবে শেয়ার করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Author Signature */}
          <div className="mt-12 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 text-center">
            <p className="font-editorial text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              — নিশাত আহমেদ
            </p>
            <p className="font-ui text-[11px] text-neutral-400 mt-0.5">
              ভালোবাসার অন্য ভাষা
            </p>
          </div>
        </article>
      )}
    </div>
  );
};
