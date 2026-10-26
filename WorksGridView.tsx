import React, { useState } from 'react';
import { LiteraryWork } from '../data/literaryData';
import { StoryCard } from './StoryCard';
import { MoodFilter } from './MoodFilter';
import { NewsletterBox } from './NewsletterBox';
import { BookOpen, Sparkles } from 'lucide-react';

interface WorksGridViewProps {
  title: string;
  subtitle: string;
  works: LiteraryWork[];
  onRead: (work: LiteraryWork) => void;
  onOpenComments?: (work: LiteraryWork) => void;
  emptyMessage?: string;
}

export const WorksGridView: React.FC<WorksGridViewProps> = ({
  title,
  subtitle,
  works,
  onRead,
  onOpenComments,
  emptyMessage = 'এই অনুভূতিতে কোনো লেখা এখনও যোগ করা হয়নি।'
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('সব');

  const filteredWorks = selectedMood === 'সব'
    ? works
    : works.filter((w) => w.moodTags.includes(selectedMood));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-ui space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>সাহিত্য সংকলন</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        <p className="font-literary text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          {subtitle}
        </p>
      </div>

      {/* Mood filter */}
      <div className="max-w-md mx-auto">
        <MoodFilter selectedMood={selectedMood} onSelectMood={setSelectedMood} />
      </div>

      {/* Grid of works with React and Comment buttons */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <StoryCard
              key={work.id}
              work={work}
              onRead={onRead}
              onOpenComments={onOpenComments}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-purple-300 dark:border-purple-800 text-neutral-400 font-ui text-sm">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <p>{emptyMessage}</p>
        </div>
      )}

      {/* Newsletter at the bottom of the section */}
      <div className="pt-6">
        <NewsletterBox variant="card" />
      </div>
    </div>
  );
};
