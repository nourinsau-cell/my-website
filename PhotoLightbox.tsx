import React from 'react';
import { PhotoEntry } from '../data/literaryData';
import { Maximize2, Sparkles, MapPin, Calendar } from 'lucide-react';

interface PhotoArtCardProps {
  photo: PhotoEntry;
  onClick: (photo: PhotoEntry) => void;
}

export const PhotoArtCard: React.FC<PhotoArtCardProps> = ({ photo, onClick }) => {
  // Artistic SVG visual illustration representing each photo style
  const renderVisualIllustration = () => {
    switch (photo.visualStyle) {
      case 'monsoon_street':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-[#090e18] via-[#141f33] to-[#1e2d4a] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-60" viewBox="0 0 400 300">
              {/* Rain puddles and lantern reflections */}
              <defs>
                <radialGradient id="lampGlow" cx="70%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d97706" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="300" fill="url(#lampGlow)" />
              {/* Road wet ripples */}
              <ellipse cx="280" cy="240" rx="90" ry="25" fill="#f59e0b" opacity="0.15" />
              <ellipse cx="140" cy="220" rx="120" ry="30" fill="#38bdf8" opacity="0.1" />
              {/* Street lamp silhouette */}
              <line x1="280" y1="90" x2="280" y2="280" stroke="#000" strokeWidth="4" opacity="0.7" />
              <circle cx="280" cy="85" r="10" fill="#fbbf24" filter="drop-shadow(0 0 10px #fbbf24)" />
              {/* Falling rain streaks */}
              <g stroke="#93c5fd" strokeWidth="1" opacity="0.4" strokeDasharray="4,8">
                <line x1="50" y1="20" x2="70" y2="180" />
                <line x1="120" y1="10" x2="140" y2="220" />
                <line x1="200" y1="40" x2="220" y2="250" />
                <line x1="330" y1="30" x2="350" y2="240" />
              </g>
            </svg>
          </div>
        );
      case 'tea_window':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b120c] via-[#332216] to-[#452e1e] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-65" viewBox="0 0 300 400">
              <defs>
                <radialGradient id="teaSteam" cx="50%" cy="60%" r="40%">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="300" height="400" fill="url(#teaSteam)" />
              {/* Window frame grid */}
              <rect x="30" y="30" width="240" height="240" fill="none" stroke="#2b1a10" strokeWidth="8" />
              <line x1="150" y1="30" x2="150" y2="270" stroke="#2b1a10" strokeWidth="4" />
              <line x1="30" y1="150" x2="270" y2="150" stroke="#2b1a10" strokeWidth="4" />
              {/* Clay tea cup */}
              <path d="M 120,320 C 120,360 180,360 180,320 Z" fill="#b45309" opacity="0.8" />
              {/* Rising steam curve */}
              <path d="M 140,300 Q 130,260 150,220 T 145,180" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.5" />
              <path d="M 160,300 Q 170,260 155,220 T 165,180" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
        );
      case 'dusk_skies':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-[#180e1c] via-[#38163f] to-[#6b2158] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-70" viewBox="0 0 400 300">
              {/* River water gradient */}
              <rect y="200" width="400" height="100" fill="#130917" opacity="0.9" />
              {/* Setting sun glow */}
              <circle cx="200" cy="180" r="50" fill="#fb923c" opacity="0.6" filter="blur(15px)" />
              <circle cx="200" cy="180" r="30" fill="#fde047" opacity="0.8" />
              {/* Birds in flight */}
              <path d="M 80,90 Q 90,80 100,90 Q 110,80 120,90" fill="none" stroke="#fed7aa" strokeWidth="2" />
              <path d="M 115,110 Q 123,102 131,110 Q 139,102 147,110" fill="none" stroke="#fed7aa" strokeWidth="1.5" />
              <path d="M 270,70 Q 280,60 290,70 Q 300,60 310,70" fill="none" stroke="#fed7aa" strokeWidth="2" />
            </svg>
          </div>
        );
      case 'vintage_book':
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-[#16120e] via-[#2c221a] to-[#3a2c20] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full opacity-65" viewBox="0 0 300 400">
              {/* Old manuscript & dried petals */}
              <rect x="40" y="50" width="220" height="300" rx="4" fill="#faf0e6" opacity="0.1" stroke="#d4af37" strokeWidth="1" />
              <line x1="60" y1="90" x2="240" y2="90" stroke="#f5d0a9" strokeWidth="1" opacity="0.3" />
              <line x1="60" y1="120" x2="240" y2="120" stroke="#f5d0a9" strokeWidth="1" opacity="0.3" />
              <line x1="60" y1="150" x2="240" y2="150" stroke="#f5d0a9" strokeWidth="1" opacity="0.3" />
              <line x1="60" y1="180" x2="180" y2="180" stroke="#f5d0a9" strokeWidth="1" opacity="0.3" />
              {/* Dried rose petal */}
              <path d="M 180,240 C 160,220 190,190 210,210 C 230,230 200,260 180,240 Z" fill="#e11d48" opacity="0.6" />
            </svg>
          </div>
        );
    }
  };

  const isPortrait = photo.aspect === 'portrait';

  return (
    <article
      onClick={() => onClick(photo)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-[#161e2e] shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Aspect Ratio Container */}
      <div className={`relative w-full ${isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        {renderVisualIllustration()}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

        {/* Hover Action Badge */}
        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Text Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 text-[11px] text-white/70 mb-1.5 font-ui flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-semibold tracking-wide">
              My Photography
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#d66872]" />
              {photo.locationMood}
            </span>
            <span aria-hidden="true">·</span>
            <span>{photo.date}</span>
          </div>

          <h3 className="font-editorial text-lg sm:text-xl font-bold text-white group-hover:text-[#f8d7da] transition-colors leading-snug">
            {photo.title}
          </h3>

          <p className="font-literary text-xs text-white/80 italic mt-1 line-clamp-2">
            {photo.pairedVerse}
          </p>
        </div>
      </div>
    </article>
  );
};

interface PhotoLightboxProps {
  photo: PhotoEntry | null;
  onClose: () => void;
  onShareQuote: (quote: string, source: string) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose, onShareQuote }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0f1420] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row text-white font-ui">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/80 transition-colors"
          aria-label="বন্ধ করুন"
        >
          ✕
        </button>

        {/* Media Frame Left */}
        <div className="md:w-3/5 bg-black flex items-center justify-center p-6 relative min-h-[300px]">
          <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden border border-white/15 relative shadow-2xl">
            <PhotoArtCard photo={photo} onClick={() => {}} />
          </div>
        </div>

        {/* Story & Verse Frame Right */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#121828]">
          <div className="space-y-4">
            {/* Header meta */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-semibold">
                My Photography
              </span>
              <span className="text-[#e2ba4d]">{photo.locationMood}</span>
              <span aria-hidden="true">·</span>
              <span>{photo.date}</span>
            </div>

            <h2 className="font-editorial text-2xl font-bold text-white">
              {photo.title}
            </h2>

            {/* Bengali Caption */}
            <p className="font-ui text-sm text-neutral-300 leading-relaxed">
              {photo.caption}
            </p>

            {/* Paired Verse */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
              <p className="font-editorial text-xs font-semibold text-[#e88691]">
                ছবির সাথে কবিতার চরণ:
              </p>
              <p className="font-literary text-sm italic text-neutral-200 leading-relaxed">
                {photo.pairedVerse}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-editorial">
              নিশাত আহমেদ আলোকচিত্র
            </span>

            <button
              onClick={() => onShareQuote(photo.pairedVerse, `আলোকচিত্র: ${photo.title}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d66872] hover:bg-[#c5555f] text-white text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>উক্তি শেয়ার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
