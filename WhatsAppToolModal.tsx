import React, { useState } from 'react';
import { X, Send, Share2, Users, MessageCircle, Check, Copy } from 'lucide-react';

interface WhatsAppToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultText?: string;
}

export const WhatsAppToolModal: React.FC<WhatsAppToolModalProps> = ({
  isOpen,
  onClose,
  defaultText = 'নিশাত আহমেদের সাহিত্য নিকেতন — "ভালোবাসার অন্য ভাষা"। একটি মুগ্ধকর উপন্যাস ও কবিতা পড়ার অভিজ্ঞতা পেতে ভিজিট করুন।'
}) => {
  const [shareText, setShareText] = useState(defaultText);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://nishat-thewriter.com';

  const handleOpenWhatsApp = () => {
    const fullMessage = `${shareText}\n\nপড়ুন এখানে: ${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    const fullMessage = `${shareText}\n\nপড়ুন এখানে: ${currentUrl}`;
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#120a1f] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 font-ui text-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <MessageCircle className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-editorial text-base font-bold text-white">
                হোয়াটসঅ্যাপ সাহিত্য টুল
              </h3>
              <p className="text-[11px] text-emerald-400 font-sans">WhatsApp Share & Community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          <div>
            <label className="text-neutral-300 font-medium block mb-1.5">
              হোয়াটসঅ্যাপে বন্ধুদের পাঠানোর বার্তা:
            </label>
            <textarea
              rows={4}
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-full p-3 rounded-xl border border-purple-800/60 bg-[#190f2b] text-purple-100 text-xs focus:outline-none focus:border-emerald-400 leading-relaxed font-literary"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-grow py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে সরাসরি পাঠান</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl border border-purple-700/60 hover:bg-purple-900/40 text-purple-300"
              title="টেক্সট কপি করুন"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Reader WhatsApp Community Section */}
          <div className="pt-3 border-t border-purple-900/40 mt-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>পাঠক হোয়াটসঅ্যাপ চ্যানেল</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                নতুন পর্বের নোটিফিকেশন ও পাঠকদের আড্ডা
              </p>
            </div>

            <a
              href="https://whatsapp.com/channel"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors shrink-0"
            >
              যুক্ত হোন →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
