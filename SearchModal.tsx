import React, { useState } from 'react';
import { Search, X, BookOpen, Feather, Sparkles } from 'lucide-react';
import { NOVELS, STORIES, SHORT_STORIES, POEMS, THOUGHTS, LiteraryWork } from '../data/literaryData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWork: (work: LiteraryWork) => void;
  onSelectTab: (tabId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectWork,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allWorks = [...NOVELS, ...STORIES, ...SHORT_STORIES];

  const matchedWorks = query.trim()
    ? allWorks.filter(
        (w) =>
          w.title.includes(query) ||
          w.synopsis.includes(query) ||
          w.moodTags.some((tag) => tag.includes(query))
      )
    : [];

  const matchedPoems = query.trim()
    ? POEMS.filter(
        (p) =>
          p.title.includes(query) ||
          p.stanzas.some((s) => s.includes(query)) ||
          p.moodTag.includes(query)
      )
    : [];

  const matchedThoughts = query.trim()
    ? THOUGHTS.filter(
        (t) =>
          t.title.includes(query) ||
          t.text.includes(query) ||
          t.mood.includes(query)
      )
    : [];

  const hasResults =
    matchedWorks.length > 0 || matchedPoems.length > 0 || matchedThoughts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#121826] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden font-ui">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="গল্প, কবিতা, উপন্যাস বা অনুভূতি খুঁজুন (যেমন: বৃষ্টি, মেঘডুবি, প্রেম)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-neutral-400 space-y-2">
              <p>বাংলা শব্দ লিখে অনুসন্ধান করুন</p>
              <div className="flex justify-center gap-2 text-[11px] text-[#d66872]">
                <button onClick={() => setQuery('বৃষ্টি')} className="hover:underline">#বৃষ্টি</button>
                <button onClick={() => setQuery('প্রেম')} className="hover:underline">#প্রেম</button>
                <button onClick={() => setQuery('বিরহ')} className="hover:underline">#বিরহ</button>
                <button onClick={() => setQuery('মেঘডুবি')} className="hover:underline">#মেঘডুবি</button>
              </div>
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="py-8 text-center text-xs text-neutral-400">
              “{query}” দিয়ে কোনো লেখা খুঁজে পাওয়া যায়নি।
            </div>
          )}

          {/* Matched Works */}
          {matchedWorks.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                গল্প ও উপন্যাস ({matchedWorks.length})
              </p>
              <div className="space-y-1.5">
                {matchedWorks.map((work) => (
                  <div
                    key={work.id}
                    onClick={() => {
                      onSelectWork(work);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {work.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{work.synopsis}</p>
                    </div>
                    <BookOpen className="w-4 h-4 text-[#d66872] shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Poems */}
          {matchedPoems.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                কবিতা ({matchedPoems.length})
              </p>
              <div className="space-y-1.5">
                {matchedPoems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectTab('poetry');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {p.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{p.stanzas[0]}</p>
                    </div>
                    <Feather className="w-4 h-4 text-[#c59b27] shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Thoughts */}
          {matchedThoughts.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                ভাবনা ({matchedThoughts.length})
              </p>
              <div className="space-y-1.5">
                {matchedThoughts.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTab('thoughts');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {t.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{t.text}</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
