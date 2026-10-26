import React, { useState } from 'react';
import { getStoredProfile, saveProfile } from '../utils/readerAccount';
import { useLanguage } from '../utils/languageContext';
import {
  Gift,
  Heart,
  Coffee,
  BookMarked,
  Sparkles,
  CreditCard,
  DollarSign,
  CheckCircle2,
  X,
  Send,
  ShieldCheck
} from 'lucide-react';

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Currency = 'BDT' | 'INR' | 'USD';

interface GiftPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  amountBDT: number;
  amountINR: number;
  amountUSD: number;
  desc: string;
}

const GIFT_PRESETS: GiftPreset[] = [
  {
    id: 'tea',
    nameBn: 'এক কাপ চা ও প্রেরণা',
    nameEn: 'A Warm Cup of Tea',
    nameHi: 'एक प्याली चाय और प्रेरणा',
    icon: '🍵',
    amountBDT: 100,
    amountINR: 75,
    amountUSD: 2,
    desc: 'নিশাত আহমেদের লেখার টেবিলে এক কাপ গরম চায়ের উষ্ণ শুভেচ্ছা'
  },
  {
    id: 'coffee_pen',
    nameBn: 'কফি ও পাণ্ডুলিপি কলম',
    nameEn: 'Coffee & Fountain Pen',
    nameHi: 'कॉफ़ी और कलम',
    icon: '☕',
    amountBDT: 500,
    amountINR: 350,
    amountUSD: 5,
    desc: 'গভীর রাতে নতুন উপন্যাস লেখার নিরব সঙ্গী'
  },
  {
    id: 'book_stack',
    nameBn: 'বই কেনার ভালোবাসা',
    nameEn: 'Book Lover’s Patronage',
    nameHi: 'किताबों का उपहार',
    icon: '📚',
    amountBDT: 1200,
    amountINR: 850,
    amountUSD: 12,
    desc: 'নতুন গবেষণামূলক বই ও সাহিত্যের রসদ যোগাতে সহায়তা'
  },
  {
    id: 'royal_patron',
    nameBn: 'রাজকীয় পৃষ্ঠপোষকতা',
    nameEn: 'Royal Literary Patron',
    nameHi: 'शाही साहित्य संरक्षक',
    icon: '👑',
    amountBDT: 3500,
    amountINR: 2500,
    amountUSD: 35,
    desc: 'সাহিত্যের পথে নিশাত আহমেদের স্থায়ী পথচলায় আন্তরিক সমর্থন'
  }
];

export const SendGiftModal: React.FC<SendGiftModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [selectedPreset, setSelectedPreset] = useState<string>('coffee_pen');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [readerName, setReaderName] = useState<string>('');
  const [personalMessage, setPersonalMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Auto-fill reader name if profile exists
  React.useEffect(() => {
    const prof = getStoredProfile();
    if (prof) {
      setReaderName(prof.name);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPresetObj = GIFT_PRESETS.find((p) => p.id === selectedPreset) || GIFT_PRESETS[1];

  const getEffectiveAmount = (): number => {
    if (isCustomMode && customAmount && !isNaN(Number(customAmount))) {
      return Number(customAmount);
    }
    if (currency === 'BDT') return currentPresetObj.amountBDT;
    if (currency === 'INR') return currentPresetObj.amountINR;
    return currentPresetObj.amountUSD;
  };

  const getCurrencySymbol = (): string => {
    if (currency === 'BDT') return '৳';
    if (currency === 'INR') return '₹';
    return '$';
  };

  const handleSubmitGift = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Save gift in profile if logged in
      const prof = getStoredProfile();
      if (prof) {
        prof.giftsSent.push({
          id: `gift_${Date.now()}`,
          amount: getEffectiveAmount(),
          currency: currency,
          giftName: isCustomMode
            ? `কাস্টম উপহার (${getCurrencySymbol()}${getEffectiveAmount()})`
            : currentPresetObj.nameBn,
          date: new Date().toLocaleDateString('bn-BD')
        });
        saveProfile(prof);
      }
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#140e1d] text-[#ede6da] border border-amber-400/40 shadow-2xl p-6 sm:p-8 font-ui">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentSuccess ? (
          /* SUCCESS CONFIRMATION RECEIPT & THANK-YOU LETTER FROM NISHAT AHMED */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                উপহার সফলভাবে পৌঁছেছে!
              </span>
              <h3 className="text-2xl font-bold font-editorial text-amber-400 mt-1">
                ধন্যবাদ, প্রিয় পাঠক {readerName || 'বন্ধু'}!
              </h3>
              <p className="text-sm text-neutral-300 mt-1">
                আপনার প্রেরিত {getCurrencySymbol()}{getEffectiveAmount()} উপহার লেখক নিশাত আহমেদের
                হৃদয়ে পৌঁছে গেছে।
              </p>
            </div>

            {/* Handwritten-style personal letter from Nishat Ahmed */}
            <div className="p-6 rounded-2xl bg-amber-400/5 border border-amber-400/30 text-left space-y-3 font-literary relative shadow-inner">
              <div className="text-xs text-amber-400/80 uppercase tracking-widest font-ui">
                — নিশাত আহমেদের কৃতজ্ঞতাপত্র —
              </div>
              <p className="text-sm text-amber-200/95 leading-relaxed italic">
                “একজন লেখকের সবচেয়ে বড় সঞ্চয় পাঠকের ভালোবাসা। আপনার এই উপহার কেবল অর্থ নয়—বরং
                বৃষ্টিভেজা নির্জন রাতে কলম তুলে নেওয়ার সাহস ও অফুরান শক্তি। আপনার প্রতি আমার গভীর
                ভালোবাসা ও শুভেচ্ছা রইল।”
              </p>
              <div className="text-right text-xs font-bold text-amber-400 font-editorial">
                — নিশাত আহমেদ
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm shadow-lg transition-all"
            >
              সম্পন্ন
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <form onSubmit={handleSubmitGift} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/30 text-amber-400">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-editorial text-amber-400">
                  লেখককে উপহার পাঠান · Send Gift
                </h2>
                <p className="text-xs text-neutral-400">
                  টাকা (BDT), রুপি (INR) অথবা ডলার (USD) — যত ইচ্ছা পাঠিয়ে লেখককে উৎসাহিত করুন
                </p>
              </div>
            </div>

            {/* Currency Selector (BDT, INR, USD) */}
            <div className="p-2 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => {
                  setCurrency('BDT');
                  setPaymentMethod('bkash');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currency === 'BDT'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>৳ টাকা (BDT)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrency('INR');
                  setPaymentMethod('upi');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currency === 'INR'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>₹ Rupee (INR)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrency('USD');
                  setPaymentMethod('card');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  currency === 'USD'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>$ Dollar (USD)</span>
              </button>
            </div>

            {/* Gift Items Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-300">
                উপহারের ধরণ বেছে নিন:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {GIFT_PRESETS.map((preset) => {
                  const amt =
                    currency === 'BDT'
                      ? preset.amountBDT
                      : currency === 'INR'
                      ? preset.amountINR
                      : preset.amountUSD;
                  const isSelected = !isCustomMode && selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset.id);
                        setIsCustomMode(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/15 shadow-md ring-1 ring-amber-400'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{preset.icon}</span>
                        <span className="text-sm font-bold text-amber-300 font-editorial">
                          {getCurrencySymbol()}
                          {amt}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {preset.nameBn}
                      </div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                        {preset.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Option - "kew chaile joto icche tk rupee ba dolar pay korte pare" */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>যত ইচ্ছা কাস্টম উপহার (Any Amount)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    isCustomMode ? 'bg-amber-400 text-black' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {isCustomMode ? 'কাস্টম চালু আছে' : 'কাস্টম টাকার পরিমাণ লিখুন'}
                </button>
              </div>

              {isCustomMode && (
                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-base">
                    {getCurrencySymbol()}
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder={`আপনার ইচ্ছেমতো পরিমাণ লিখুন (${getCurrencySymbol()})`}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-amber-400/50 text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Badges */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                পেমেন্ট মাধ্যম বেছে নিন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {currency === 'BDT' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'bkash'
                          ? 'border-pink-500 bg-pink-500/20 text-pink-300 ring-1 ring-pink-500'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      বিকাশ (bKash)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'nagad'
                          ? 'border-orange-500 bg-orange-500/20 text-orange-300 ring-1 ring-orange-500'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      নগদ (Nagad)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'card'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-1 ring-amber-400'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      কার্ড / রকেট
                    </button>
                  </>
                )}

                {currency === 'INR' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'upi'
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      UPI / GPay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('phonepe')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'phonepe'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      PhonePe / Paytm
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'card'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      RuPay / Debit
                    </button>
                  </>
                )}

                {currency === 'USD' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'card'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'applepay'
                          ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      Apple Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMethod === 'paypal'
                          ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                          : 'border-white/10 bg-white/5 text-neutral-400'
                      }`}
                    >
                      PayPal
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Optional Personal Note */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                লেখকের উদ্দেশ্যে আপনার কিছু কথা (ঐচ্ছিক):
              </label>
              <textarea
                rows={2}
                placeholder="আপনার প্রিয় কোনো বই বা নিশাত আহমেদের লেখার প্রতি ভালো লাগা..."
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>পেমেন্ট প্রক্রিয়াকরণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {getCurrencySymbol()}
                    {getEffectiveAmount()} উপহার পাঠান · নিশাত আহমেদ
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
