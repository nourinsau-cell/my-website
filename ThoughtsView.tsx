import React, { useState } from 'react';
import { THOUGHTS, Thought } from '../data/literaryData';
import { MoodFilter } from './MoodFilter';
import { Feather, Share2, Calendar } from 'lucide-react';

interface ThoughtsViewProps {
  onShareQuote: (quote: string, source: string) => void;
}

export const ThoughtsView: React.FC<ThoughtsViewProps> = ({ onShareQuote }) => {
  const [selectedMood, setSelectedMood] = useState<string>('সব');

  const filteredThoughts = selectedMood === 'সব'
    ? THOUGHTS
    : THOUGHTS.filter((t) => t.mood === selectedMood);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-ui">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d66872] mb-2 uppercase tracking-widest">
          <Feather className="w-3.5 h-3.5" />
          <span>দিনলিপি ও অনুভূতির ডায়েরি</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          ভাবনা
        </h1>
        <p className="font-literary text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          মধ্যরাতের চা, বৃষ্টির শব্দ আর মনের না-বলা খসড়া কথার সংকলন।
        </p>
      </div>

      {/* Mood filter */}
      <div className="max-w-md mx-auto mb-12">
        <MoodFilter selectedMood={selectedMood} onSelectMood={setSelectedMood} />
      </div>

      {/* Timeline Style Cards */}
      <div className="relative pl-6 sm:pl-8 border-l border-neutral-300 dark:border-neutral-800 space-y-10">
        {filteredThoughts.map((thought) => (
          <div key={thought.id} className="relative group">
            {/* Timeline node bullet */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#0a0e17] bg-[#d66872] shadow-xs" />

            {/* Thought Card */}
            <article className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#121826]/70 backdrop-blur-sm shadow-xs hover:border-[#d66872]/40 transition-colors">
              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
                  {thought.date}
                </span>
                <span className="text-[#d66872]">#{thought.mood}</span>
              </div>

              {/* Title */}
              <h3 className="font-editorial text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                {thought.title}
              </h3>

              {/* Text */}
              <p className="font-literary text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed text-justify">
                {thought.text}
              </p>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="font-editorial text-xs text-neutral-400">
                  — নিশাত আহমেদ
                </span>
                <button
                  onClick={() => onShareQuote(thought.text, `ভাবনা: ${thought.title}`)}
                  className="inline-flex items-center gap-1 text-xs text-[#d66872] hover:underline"
                >
                  <Share2 className="w-3 h-3" />
                  <span>উক্তি তৈরি করুন</span>
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};
