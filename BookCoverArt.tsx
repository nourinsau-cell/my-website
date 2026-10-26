import React from 'react';

interface BookCoverArtProps {
  title: string;
  subtitle?: string;
  type: 'rain' | 'window' | 'curtain' | 'twilight' | 'candle';
  aspect?: '3:4' | '16:9' | '4:3';
  isMature?: boolean;
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  title,
  subtitle,
  type,
  aspect = '3:4',
  isMature = false,
  className = ''
}) => {
  const getThemeStyles = () => {
    switch (type) {
      case 'rain':
        return {
          gradient: 'from-[#0b1329] via-[#162544] to-[#070d1a]',
          accent: '#82aaff',
          accentSecondary: '#e0838a',
          label: 'শ্রাবণ রাত্রি'
        };
      case 'curtain':
        return {
          gradient: 'from-[#221528] via-[#3d2345] to-[#120a17]',
          accent: '#e2ba4d',
          accentSecondary: '#e88691',
          label: 'গোধূলি আলো'
        };
      case 'candle':
        return {
          gradient: 'from-[#24170e] via-[#482e1b] to-[#150d08]',
          accent: '#f59e0b',
          accentSecondary: '#fb7185',
          label: 'চিলেকোঠা'
        };
      case 'twilight':
        return {
          gradient: 'from-[#0f1f2c] via-[#1c394f] to-[#09141d]',
          accent: '#38bdf8',
          accentSecondary: '#a78bfa',
          label: 'নদীর বাঁক'
        };
      case 'window':
      default:
        return {
          gradient: 'from-[#171b26] via-[#242b3d] to-[#0e1118]',
          accent: '#d4af37',
          accentSecondary: '#e0838a',
          label: 'সাহিত্য নিকেতন'
        };
    }
  };

  const theme = getThemeStyles();
  const aspectClass =
    aspect === '3:4' ? 'aspect-[3/4]' : aspect === '16:9' ? 'aspect-video' : 'aspect-[4/3]';

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br ${theme.gradient} text-white flex flex-col justify-between p-5 select-none transition-all duration-300 group-hover:shadow-xl ${aspectClass} ${className}`}
    >
      {/* Background artistic SVG vectors */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`glow-${type}`} cx="70%" cy="30%" r="60%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <pattern id={`lines-${type}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill={`url(#glow-${type})`} />
        <rect width="100%" height="100%" fill={`url(#lines-${type})`} />

        {type === 'rain' && (
          <g stroke={theme.accent} strokeWidth="1" strokeDasharray="3,12" opacity="0.4">
            <line x1="20" y1="0" x2="40" y2="200" />
            <line x1="70" y1="0" x2="90" y2="200" />
            <line x1="120" y1="0" x2="140" y2="200" />
            <line x1="180" y1="0" x2="200" y2="200" />
            <line x1="240" y1="0" x2="260" y2="200" />
          </g>
        )}

        {type === 'curtain' && (
          <path
            d="M 0,0 C 80,120 120,80 200,240 C 250,320 300,200 400,400"
            fill="none"
            stroke={theme.accentSecondary}
            strokeWidth="1.5"
            opacity="0.3"
          />
        )}

        {type === 'candle' && (
          <circle cx="75%" cy="35%" r="35" fill={theme.accent} filter="blur(15px)" opacity="0.3" />
        )}
      </svg>

      {/* Book spine left border effect */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-editorial text-[11px] tracking-wider text-white/70 uppercase">
          {theme.label}
        </span>
        {isMature && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/40 text-rose-300 bg-rose-950/40">
            ১৮+
          </span>
        )}
      </div>

      {/* Center Title and Subtitle */}
      <div className="relative z-10 my-auto text-left py-4">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#ffccd1] transition-colors leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="font-ui text-xs text-white/75 mt-1.5 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Author Tagline & Subtle Rainbow Hairline */}
      <div className="relative z-10 pt-2 border-t border-white/10">
        <div className="h-[1.5px] w-12 rainbow-hairline rounded-full mb-2 opacity-80" />
        <p className="font-editorial text-xs font-semibold text-white/90">
          নিশাত আহমেদ
        </p>
        <p className="font-ui text-[10px] text-white/50">
          ভালোবাসার অন্য ভাষা
        </p>
      </div>
    </div>
  );
};
