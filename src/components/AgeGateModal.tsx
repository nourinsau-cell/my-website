import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface AgeGateModalProps {
  onConfirm: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const confirmed = localStorage.getItem('nishat_age_confirmed');
      if (!confirmed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('nishat_age_confirmed', 'true');
    } catch {
      // Ignore
    }
    setIsVisible(false);
    onConfirm();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#fdfbf7] dark:bg-[#121826] border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-center font-ui">
        
        {/* Soft Icon */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-[#d66872] dark:text-[#e88691]">
          <Heart className="w-6 h-6 fill-current opacity-80" />
        </div>

        {/* Title */}
        <h3 className="font-editorial text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          স্বাগতম নিশাত আহমেদের সাহিত্য নিকেতনে
        </h3>

        {/* Gentle Notice */}
        <p className="font-literary text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
          এই সাইটে প্রাপ্তবয়স্ক পাঠকদের জন্য আবেগী, নিবিড় রোমান্টিক এবং সমপ্রেমের স্পর্শকাতর কিছু পরিণত সাহিত্য রয়েছে। ভালোবাসা ও অনুভূতির গভীরতাকে উপলব্ধি করার জন্য পাঠকদের পরিণত মানসিকতা কাম্য।
        </p>

        {/* Confirm Button */}
        <button
          onClick={handleAccept}
          className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#d66872] to-[#c59b27] hover:opacity-95 text-white font-medium text-sm shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>আমার বয়স ১৮+ বছর (প্রবেশ করুন)</span>
        </button>

        <p className="mt-4 text-[11px] text-neutral-400">
          ভালোবাসার প্রতিটি অনুভূতিকে আমরা শ্রদ্ধা জানাই।
        </p>
      </div>
    </div>
  );
};
