import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'bn' | 'en' | 'hi';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  translateStoryText: (text: string[], targetLang: SupportedLanguage) => string[];
}

const UI_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // Navigation
  'nav.home': { bn: 'হোম', en: 'Home', hi: 'होम' },
  'nav.novels': { bn: 'উপন্যাস', en: 'Novels', hi: 'उपन्यास' },
  'nav.stories': { bn: 'গল্প', en: 'Stories', hi: 'कहानियाँ' },
  'nav.shorts': { bn: 'ছোট গল্প', en: 'Shorts', hi: 'लघु कथाएँ' },
  'nav.poetry': { bn: 'কবিতা', en: 'Poetry', hi: 'कविताएँ' },
  'nav.photos': { bn: 'মাই ফটোগ্রাফি', en: 'My Photography', hi: 'माई फोटोग्राफी' },
  'nav.board': { bn: 'পাঠকের ডায়েরি', en: 'Reader Board', hi: 'पाठक डायरी' },
  'nav.thoughts': { bn: 'ভাবনা', en: 'Thoughts', hi: 'विचार' },
  'nav.about': { bn: 'লেখক', en: 'About', hi: 'लेखक' },
  
  // Actions
  'action.sendGift': { bn: 'লেখককে উপহার 🎁', en: 'Send Gift 🎁', hi: 'लेखक को उपहार 🎁' },
  'action.importPratilipi': { bn: 'প্রতিলিপি লিংক ইমপোর্ট', en: 'Import Pratilipi', hi: 'प्रतिलिपि लिंक आयात' },
  'action.createAccount': { bn: 'প্রোফাইল খুলুন', en: 'Create Account', hi: 'प्रोफ़ाइल बनाएं' },
  'action.myProfile': { bn: 'আমার প্রোফাইল', en: 'My Profile', hi: 'मेरी प्रोफ़ाइल' },
  'action.follow': { bn: 'অনুসরণ করুন', en: 'Follow Author', hi: 'फॉलो करें' },
  'action.following': { bn: 'অনুসরণ করছেন', en: 'Following', hi: 'फॉलो कर रहे हैं' },
  'action.search': { bn: 'অনুসন্ধান', en: 'Search', hi: 'खोजें' },
  'action.read': { bn: 'পড়ুন', en: 'Read', hi: 'पढ़ें' },
  'action.listenAi': { bn: 'এআই ভয়েস শুনুন', en: 'Listen AI Voice', hi: 'एआई आवाज़ सुनें' },

  // Themes
  'theme.day': { bn: 'দিবা', en: 'Day', hi: 'दिन' },
  'theme.night': { bn: 'রাত্রি', en: 'Night', hi: 'रात' },
  'theme.sepia': { bn: 'সেপিয়া', en: 'Sepia', hi: 'सेपिया' },

  // Hero & Headings
  'hero.authorName': { bn: 'নিশাত আহমেদ', en: 'Nishat Ahmed', hi: 'निशात अहमद' },
  'hero.tagline': {
    bn: 'ভালোবাসার নিঃশব্দ গল্প ও অনুভূতির গভীর অনুরণন',
    en: 'Silent stories of love and deep resonances of emotion',
    hi: 'प्यार की खामोश दास्तां और जज़्बातों की गहरी गूंज'
  },
  'hero.featured': { bn: 'নির্বাচিত সাহিত্যকর্ম', en: 'Featured Masterpieces', hi: 'विशेष साहित्य' },
  'photography.title': { bn: 'মাই ফটোগ্রাফি', en: 'My Photography', hi: 'माई फोटोग्राफी' },
  'photography.subtitle': {
    bn: 'ক্যামেরার লেন্সে ধরা পড়া কিছু নির্জন মুহূর্ত ও না-বলা দৃশ্যমালা',
    en: 'Solitary moments and untold visual whispers captured through my camera lens',
    hi: 'कैमरे के लेंस में कैद कुछ शांत पल और अनकही कहानियां'
  },
  'quotes.heading': { bn: 'নিশাত আহমেদের কলমে', en: 'In Nishat Ahmed’s Words', hi: 'निशात अहमद की कलम से' }
};

// Story paragraph translation dictionary / rule-based mapper for full chapters
const BENGALI_TO_ENGLISH_MAP: Record<string, string> = {
  'ভালোবাসার কোনো নির্দিষ্ট ঋতু হয় না।': 'Love has no designated season.',
  'হঠাৎ এক ঝলক বৃষ্টি আর মেঘলা বিকেল—পুরোনো স্মৃতির ক্যানভাসে আবার আলো ফেলে।': 'A sudden shower of rain and an overcast dusk casts fresh light on memories once forgotten.',
  'বৃষ্টিভেজা শহরের রাস্তা তখন নিস্তব্ধ।': 'The rain-soaked streets of the city were quiet then.',
  'অধিকারবোধ কখনো জোর করে পাওয়া যায় না।': 'A sense of belonging can never be forced.',
  'ভালোবাসা যদি সত্যি হয়, তবে অপেক্ষা করাটাও একটা প্রার্থনা।': 'If love is true, even waiting becomes a sacred prayer.',
  'কিছু গল্প শেষ হয়েও শেষ হয় না, হৃদয়ের অলিন্দে তারা অনন্তকাল বেঁচে থাকে।': 'Some stories never truly end; they live forever in the chambers of the heart.',
  'তুমি আমার সেই না-বলা কথা, যা শুধু চোখের তারায় পড়তে পারা যায়।': 'You are my unspoken word, legible only in the gaze of my eyes.'
};

const BENGALI_TO_HINDI_MAP: Record<string, string> = {
  'ভালোবাসার কোনো নির্দিষ্ট ঋতু হয় না।': 'प्यार का कोई निश्चित मौसम नहीं होता।',
  'হঠাৎ এক ঝলক বৃষ্টি আর মেঘলা বিকেল—পুরোনো স্মৃতির ক্যানভাসে আবার আলো ফেলে।': 'अचानक बारिश की एक फुहार और बादलों भरी शाम—पुरानी यादों पर फिर से रोशनी डालती है।',
  'বৃষ্টিভেজা শহরের রাস্তা তখন নিস্তব্ধ।': 'बारिश से भीगी शहर की सड़कें उस वक्त खामोश थीं।',
  'অধিকারবোধ কখনো জোর করে পাওয়া যায় না।': 'अपनेपन का अहसास कभी जबरदस्ती हासिल नहीं किया जा सकता।',
  'ভালোবাসা যদি সত্যি হয়, তবে অপেক্ষা করাটাও একটা প্রার্থনা।': 'अगर मोहब्बत सच्ची हो, तो इंतज़ार करना भी एक इबादत बन जाता है।',
  'কিছু গল্প শেষ হয়েও শেষ হয় না, হৃদয়ের অলিন্দে তারা অনন্তকাল বেঁচে থাকে।': 'कुछ कहानियां खत्म होकर भी खत्म नहीं होतीं, वे दिल के कोनों में हमेशा ज़िंदा रहती हैं।',
  'তুমি আমার সেই না-বলা কথা, যা শুধু চোখের তারায় পড়তে পারা যায়।': 'तुम मेरी वो अनकही बात हो, जिसे सिर्फ आंखों की पुतलियों में पढ़ा जा सकता है।'
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  t: (key: string) => key,
  translateStoryText: (text: string[]) => text
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('site_language');
    if (saved === 'en' || saved === 'hi' || saved === 'bn') return saved;
    return 'bn';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: string): string => {
    const item = UI_TRANSLATIONS[key];
    if (!item) return key;
    return item[language] || item['bn'] || key;
  };

  const translateStoryText = (paragraphs: string[], targetLang: SupportedLanguage): string[] => {
    if (targetLang === 'bn') return paragraphs;

    return paragraphs.map((para) => {
      // Check direct map
      if (targetLang === 'en' && BENGALI_TO_ENGLISH_MAP[para]) {
        return BENGALI_TO_ENGLISH_MAP[para];
      }
      if (targetLang === 'hi' && BENGALI_TO_HINDI_MAP[para]) {
        return BENGALI_TO_HINDI_MAP[para];
      }

      // If english
      if (targetLang === 'en') {
        return para
          .replace(/ভালোবাসা/g, 'love')
          .replace(/বৃষ্টি/g, 'rain')
          .replace(/হৃদয়/g, 'heart')
          .replace(/স্মৃতি/g, 'memories')
          .replace(/নিশাত আহমেদ/g, 'Nishat Ahmed')
          .replace(/তুমি/g, 'you')
          .replace(/আমি/g, 'I');
      }

      // If hindi
      if (targetLang === 'hi') {
        return para
          .replace(/ভালোবাসা/g, 'मोहब्बत')
          .replace(/বৃষ্টি/g, 'बारिश')
          .replace(/হৃদয়/g, 'दिल')
          .replace(/স্মৃতি/g, 'यादें')
          .replace(/নিশাত আহমেদ/g, 'निशात अहमद')
          .replace(/তুমি/g, 'तुम')
          .replace(/আমি/g, 'मैं');
      }

      return para;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateStoryText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
