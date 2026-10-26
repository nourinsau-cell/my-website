import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface NewsletterBoxProps {
  className?: string;
  variant?: 'inline' | 'card';
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({
  className = '',
  variant = 'card'
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const subscribers = JSON.parse(localStorage.getItem('nishat_subscribers') || '[]');
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem('nishat_subscribers', JSON.stringify(subscribers));
    } catch {
      // Ignore
    }

    setSubmitted(true);
    setEmail('');
  };

  return (
    <div
      className={`rounded-3xl border border-purple-200/60 dark:border-purple-900/60 transition-all font-ui ${
        variant === 'card'
          ? 'p-6 sm:p-10 bg-gradient-to-br from-[#faf7fd] via-purple-50/40 to-[#faf7fd] dark:from-[#130924] dark:via-[#1c0f33] dark:to-[#130924] shadow-sm'
          : 'p-5 bg-white/50 dark:bg-[#160d26]/50'
      } ${className}`}
    >
      <div className="max-w-xl mx-auto text-center space-y-3.5">
        <div className="w-11 h-11 mx-auto rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-inner">
          <Mail className="w-5 h-5" />
        </div>

        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          নতুন পর্ব এলে জানাবো
        </h3>

        <p className="font-literary text-xs sm:text-sm text-neutral-600 dark:text-purple-200/70 leading-relaxed">
          উপন্যাস ও গল্পের নতুন অধ্যায় প্রকাশিত হওয়া মাত্র আপনার ইনবক্সে ভালোবাসার চিঠি পৌঁছে যাবে। কোনো স্প্যাম নেই, কেবল সাহিত্যের ছোঁয়া।
        </p>

        {submitted ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 border border-emerald-500/30 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>ধন্যবাদ! নতুন পর্ব প্রকাশিত হলে আপনাকে জানানো হবে।</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="আপনার ইমেইল ঠিকানা দিন..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#0c0517] text-xs sm:text-sm focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-purple-100"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 text-white text-xs sm:text-sm font-semibold transition-opacity shrink-0 shadow-md"
            >
              যুক্ত হোন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
