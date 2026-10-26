import React from 'react';
import { ALL_MOODS } from '../data/literaryData';

interface MoodFilterProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  title?: string;
}

export const MoodFilter: React.FC<MoodFilterProps> = ({
  selectedMood,
  onSelectMood,
  title = 'অনুভূতি অনুযায়ী পড়ুন'
}) => {
  return (
    <div className="space-y-3 font-ui">
      {title && (
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold uppercase tracking-wider">{title}</span>
          <span className="text-[11px]">মনের ভাব নির্বাচন করুন</span>
        </div>
      )}

      {/* Clean segmented interactive control */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-200/50 dark:bg-neutral-800/60 rounded-xl overflow-x-auto no-scrollbar">
        {ALL_MOODS.map((mood) => {
          const isActive = selectedMood === mood;
          return (
            <button
              key={mood}
              onClick={() => onSelectMood(mood)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap focus:outline-none ${
                isActive
                  ? 'bg-white dark:bg-[#1a2233] text-[#d66872] dark:text-[#e88691] shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {mood === 'সব' ? 'সকল অনুভূতি' : mood}
            </button>
          );
        })}
      </div>
    </div>
  );
};
