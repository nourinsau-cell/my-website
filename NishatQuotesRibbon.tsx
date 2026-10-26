import React, { useState, useEffect } from 'react';
import { Sparkles, Quote, RefreshCw } from 'lucide-react';
import { useLanguage } from '../utils/languageContext';

const NISHAT_QUOTES = [
  {
    bn: 'ভালোবাসা যদি সত্যি হয়, তবে অপেক্ষা করাটাও একটা প্রার্থনা।',
    en: 'If love is true, even waiting becomes a sacred prayer.',
    hi: 'अगर मोहब्बत सच्ची हो, तो इंतज़ार करना भी एक इबादत बन जाता है।',
    source: '— ভালোবাসার অন্য ভাষা'
  },
  {
    bn: 'কিছু গল্প শেষ হয়েও শেষ হয় না, হৃদয়ের অলিন্দে তারা অনন্তকাল বেঁচে থাকে।',
    en: 'Some stories never truly end; they live forever in the chambers of the heart.',
    hi: 'कुछ कहानियां खत्म होकर भी खत्म नहीं होतीं, वे दिल के कोनों में हमेशा ज़िंदा रहती हैं।',
    source: '— রোদ্দুর ছোঁয়া প্রেম'
  },
  {
    bn: 'তুমি আমার সেই না-বলা কথা, যা শুধু চোখের তারায় পড়তে পারা যায়।',
    en: 'You are my unspoken word, legible only in the gaze of my eyes.',
    hi: 'तुम मेरी वो अनकही बात हो, जिसे सिर्फ आंखों की पुतलियों में पढ़ा जा सकता है।',
    source: '— মেঘের দেশে চিঠি'
  },
  {
    bn: 'ভালোবাসার কোনো ব্যাকরণ নেই, কেবল দুটি হৃদয়ের নীরব সমঝোতা।',
    en: 'Love has no strict grammar, only the silent understanding between two souls.',
    hi: 'मोहब्बत का कोई व्याकरण नहीं होता, बस दो दिलों का खामोश समझौता होता है।',
    source: '— নিঃশব্দ অনুরণন'
  },
  {
    bn: 'মেঘের দেশে চিঠি লিখি, যদি কোনোদিন বৃষ্টির ফোঁটায় তা তোমার কাছে পৌঁছায়।',
    en: 'I write letters to the kingdom of clouds, hoping rain may one day carry them to you.',
    hi: 'बादलों के देस में खत लिखता हूं, काश कभी बारिश की बूंदें इन्हें तुम तक पहुंचा दें।',
    source: '— বৃষ্টিভেজা দীর্ঘশ্বাস'
  }
];

export const NishatQuotesRibbon: React.FC<{ onShare?: (quote: string) => void }> = ({ onShare }) => {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const current = NISHAT_QUOTES[index];

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % NISHAT_QUOTES.length);
      setFade(true);
    }, 250);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const quoteText =
    language === 'en' ? current.en : language === 'hi' ? current.hi : current.bn;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-900/15 to-amber-500/10 border border-amber-400/25 p-5 sm:p-6 my-8 shadow-sm">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-xl bg-amber-400/15 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <Quote className="w-5 h-5" />
          </div>
          <div className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-editorial text-base sm:text-lg font-bold text-amber-400 leading-snug">
              “{quoteText}”
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-400 font-ui">
              <span className="font-semibold text-white/90">নিশাত আহমেদ</span>
              <span>·</span>
              <span className="italic text-amber-300/80">{current.source}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          title="পরবর্তী চরণ"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-300 border border-white/10 transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
