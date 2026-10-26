import React, { useState, useEffect } from 'react';
import { ThemeMode } from './Header';

export type SeasonalMood =
  | 'auto'
  | 'none'
  | 'fireflies_night'
  | 'misty_mountains'
  | 'ocean_waves'
  | 'spring_leaves'
  | 'autumn_kashful'
  | 'jhirijhiri_rain'
  | 'colorful_lights'
  | 'soft_clouds';

interface SeasonalAtmosphereProps {
  theme: ThemeMode;
  forcedMood?: SeasonalMood;
  onMoodChange?: (mood: SeasonalMood) => void;
}

export const SeasonalAtmosphere: React.FC<SeasonalAtmosphereProps> = ({
  theme,
  forcedMood = 'auto',
  onMoodChange
}) => {
  const [activeMood, setActiveMood] = useState<SeasonalMood>(
    forcedMood === 'auto' ? 'autumn_kashful' : forcedMood
  );

  // Auto-cycle through scenes every 35 seconds if 'auto'
  useEffect(() => {
    if (forcedMood !== 'auto') {
      setActiveMood(forcedMood);
      return;
    }

    const moods: SeasonalMood[] = [
      'autumn_kashful',
      'colorful_lights',
      'fireflies_night',
      'jhirijhiri_rain',
      'spring_leaves',
      'misty_mountains',
      'ocean_waves'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % moods.length;
      setActiveMood(moods[idx]);
    }, 35000);

    return () => clearInterval(interval);
  }, [forcedMood]);

  if (activeMood === 'none' || forcedMood === 'none') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000" aria-hidden="true">
      
      {/* ================= BACKGROUND MULTI-COLORED LIGHT ORBS (নানান রঙের নরম আলো) ================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 dark:opacity-75">
        {/* Orb 1: Violet & Amethyst Halo */}
        <div className="absolute top-[10%] left-[5%] w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] rounded-full bg-purple-600/15 dark:bg-purple-600/25 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
        
        {/* Orb 2: Warm Golden Amber Sunbeam */}
        <div className="absolute top-[40%] right-[10%] w-[350px] sm:w-[480px] h-[350px] sm:h-[480px] rounded-full bg-amber-400/12 dark:bg-amber-400/20 blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />

        {/* Orb 3: Romantic Rose & Crimson Glow */}
        <div className="absolute bottom-[15%] left-[20%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-rose-500/12 dark:bg-rose-500/20 blur-3xl animate-[pulse_14s_ease-in-out_infinite_4s]" />

        {/* Orb 4: Ethereal Sky Cyan & Indigo Light */}
        <div className="absolute top-[60%] right-[30%] w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] rounded-full bg-cyan-400/10 dark:bg-cyan-400/15 blur-3xl animate-[pulse_11s_ease-in-out_infinite_3s]" />
      </div>

      {/* ================= 1. DEEP MIDNIGHT & GLOWING FIREFLIES (গভীর রাত ও জোনাকি পোকা) ================= */}
      {activeMood === 'fireflies_night' && (
        <div className="absolute inset-0">
          {/* Subtle Midnight Vignette - non-intrusive so title stays crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0e061c]/70 pointer-events-none" />

          {/* Twinkling Midnight Stars */}
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  top: `${(i * 17) % 75}%`,
                  left: `${(i * 23) % 96}%`,
                  animationDuration: `${2.5 + (i % 4)}s`,
                  animationDelay: `${(i * 0.7) % 5}s`
                }}
              />
            ))}
          </div>

          {/* Glowing Bioluminescent Fireflies (জোনাকি পোকা) */}
          {Array.from({ length: 22 }).map((_, i) => {
            const topPos = 20 + ((i * 13) % 70);
            const leftPos = (i * 7.5 + (i % 3) * 4) % 94;
            const duration = 6 + (i % 5) * 2;
            const delay = (i * 0.8) % 6;
            const glowSize = 8 + (i % 3) * 4;

            return (
              <div
                key={`firefly-${i}`}
                className="absolute animate-[fireflyDrift_ease-in-out_infinite]"
                style={{
                  top: `${topPos}%`,
                  left: `${leftPos}%`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`
                }}
              >
                {/* Firefly Body and Phosphorescent Halo */}
                <div
                  className="rounded-full bg-lime-300 animate-[fireflyPulse_ease-in-out_infinite]"
                  style={{
                    width: `${glowSize}px`,
                    height: `${glowSize}px`,
                    boxShadow: '0 0 16px #a3e635, 0 0 24px #84cc16',
                    animationDuration: `${1.8 + (i % 3) * 0.7}s`,
                    animationDelay: `${delay}s`
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 2. MISTY MOUNTAIN SILHOUETTES (পাহাড় ও কুয়াশাঘেরা উপত্যকা) ================= */}
      {activeMood === 'misty_mountains' && (
        <div className="absolute inset-0">
          {/* Distant Mountain Ridge 1 */}
          <svg className="absolute bottom-0 left-0 right-0 w-full h-80 sm:h-96 opacity-35 text-[#1a0f2e] dark:text-[#160c26]" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill="currentColor" d="M0,192L60,186.7C120,181,240,171,360,176C480,181,600,203,720,197.3C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L0,320Z" />
          </svg>

          {/* Valley Fog and Drifting Mist Layer */}
          <div className="absolute bottom-16 -left-[200px] w-[1400px] h-32 bg-gradient-to-r from-purple-300/10 via-purple-100/15 to-transparent blur-2xl animate-[drift_45s_linear_infinite]" />
        </div>
      )}

      {/* ================= 3. OCEAN HORIZON & MOONLIT WAVES (সমুদ্র ও মৃদু ঢেউ) ================= */}
      {activeMood === 'ocean_waves' && (
        <div className="absolute inset-0">
          {/* Distant Sea Horizon Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#09152e]/80 via-[#111e3d]/40 to-transparent pointer-events-none" />

          {/* Wave Layer 1 */}
          <svg className="absolute bottom-0 left-0 right-0 w-full h-32 sm:h-40 opacity-40 text-sky-900/60 dark:text-sky-950/80 animate-[waveUndulate_6s_ease-in-out_infinite]" preserveAspectRatio="none" viewBox="0 0 1440 180">
            <path fill="currentColor" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,180L0,180Z" />
          </svg>

          {/* Wave Layer 2 (Cresting Foam) */}
          <svg className="absolute -bottom-2 left-0 right-0 w-full h-24 sm:h-32 opacity-50 text-indigo-950/80 animate-[waveUndulate_4.5s_ease-in-out_infinite_1.5s]" preserveAspectRatio="none" viewBox="0 0 1440 160">
            <path fill="currentColor" d="M0,96L60,90.7C120,85,240,75,360,85.3C480,96,600,128,720,133.3C840,139,960,117,1080,101.3C1200,85,1320,75,1380,69.3L1440,64L1440,160L0,160Z" />
          </svg>
        </div>
      )}

      {/* ================= 4. SPRING FALLING LEAVES (বসন্তের ঝরা পাতা) ================= */}
      {activeMood === 'spring_leaves' && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => {
            const leftPos = (i * 5.6 + (i % 3) * 2) % 96;
            const duration = 12 + (i % 8) * 2.5;
            const delay = (i * 1.8) % 15;
            const size = 18 + (i % 4) * 6;
            const isReddish = i % 3 === 0;
            const isGolden = i % 3 === 1;

            return (
              <div
                key={`leaf-${i}`}
                className="absolute -top-12 animate-[leafFall_linear_infinite]"
                style={{
                  left: `${leftPos}%`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  opacity: 0.75
                }}
              >
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 24 24"
                  className="animate-[leafSway_4s_ease-in-out_infinite]"
                  style={{
                    transform: `rotate(${(i * 37) % 360}deg)`,
                    fill: isReddish ? '#f43f5e' : isGolden ? '#f59e0b' : '#10b981'
                  }}
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7 9.5V22h6v-.5c4-1.2 7-5 7-9.5 0-5.5-4.5-10-10-10zm0 18c-3.5 0-6.5-2.5-7.5-6 .5-1.5 2-3 4.5-4 3-1 6-1 7.5-.5-1 4.5-2.5 8.5-4.5 10.5z" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 5. AUTUMN KASHFUL (শরতের কাশফুল ও বাতাসে সাদা তুলো) ================= */}
      {activeMood === 'autumn_kashful' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Gentle Sky Horizon Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-400/8 via-transparent to-transparent pointer-events-none" />

          {/* Floating Kashful White Fluffs & Petals in the breeze */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => {
              const topPos = 15 + ((i * 19) % 75);
              const duration = 18 + (i % 6) * 3;
              const delay = (i * 2.1) % 12;
              const size = 6 + (i % 4) * 3;

              return (
                <div
                  key={`kashful-fluff-${i}`}
                  className="absolute animate-[fluffDrift_linear_infinite]"
                  style={{
                    top: `${topPos}%`,
                    left: '-20px',
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                  }}
                >
                  <div
                    className="rounded-full bg-white/80 dark:bg-purple-100/70 blur-[1px] shadow-sm transform rotate-12"
                    style={{
                      width: `${size * 2}px`,
                      height: `${size}px`,
                      boxShadow: '0 0 8px rgba(255,255,255,0.7)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Swaying Kashful Field across bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-56 sm:h-72 flex items-end justify-between px-1 sm:px-6 pointer-events-none">
            {Array.from({ length: 18 }).map((_, i) => {
              const height = 150 + (i % 6) * 25;
              const swayDuration = 3.6 + (i % 4) * 0.9;
              const swayDelay = (i * 0.35) % 2.5;

              return (
                <div
                  key={`kashful-${i}`}
                  className="relative origin-bottom animate-[kashfulSway_ease-in-out_infinite]"
                  style={{
                    height: `${height}px`,
                    animationDuration: `${swayDuration}s`,
                    animationDelay: `${swayDelay}s`
                  }}
                >
                  {/* Stem */}
                  <div className="w-[2px] h-full bg-emerald-600/40 dark:bg-emerald-400/30 mx-auto" />
                  
                  {/* Silky Kashful Feathery White Plume Head */}
                  <div className="absolute -top-12 -left-3.5 w-8 h-28 bg-gradient-to-t from-transparent via-white/85 to-white/95 dark:from-transparent dark:via-purple-100/80 dark:to-white/95 rounded-full blur-[1.2px] shadow-md transform -rotate-3" />
                  <div className="absolute -top-14 -left-2.5 w-6 h-24 bg-white/80 dark:bg-purple-50/70 rounded-full blur-[2px]" />
                  <div className="absolute -top-16 -left-1.5 w-4 h-16 bg-white/90 rounded-full blur-[1px]" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 6. JHIRIJHIRI RAIN (ঝিরিঝিরি মিষ্টি বৃষ্টি - অঝোর ধারা নয়) ================= */}
      {activeMood === 'jhirijhiri_rain' && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
          {/* Subtle mist near bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-400/10 via-sky-300/5 to-transparent blur-xl" />

          {/* Gentle, fine, light diagonal drizzle lines */}
          <svg className="absolute inset-0 w-full h-full opacity-45">
            <defs>
              <pattern id="jhirijhiri-rain-pattern" width="80" height="120" patternUnits="userSpaceOnUse">
                {/* Fine, delicate drops that fall slowly */}
                <line x1="15" y1="5" x2="25" y2="28" stroke="#a4c2f4" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                <line x1="55" y1="40" x2="65" y2="62" stroke="#c084fc" strokeWidth="0.75" strokeLinecap="round" opacity="0.5" />
                <line x1="35" y1="80" x2="45" y2="102" stroke="#93c5fd" strokeWidth="0.75" strokeLinecap="round" opacity="0.55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jhirijhiri-rain-pattern)" className="animate-[jhirijhiriFall_2.2s_linear_infinite]" />
          </svg>
        </div>
      )}

      {/* Global CSS keyframes for atmospheric transitions */}
      <style>{`
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100vw + 600px)); }
        }
        @keyframes fireflyDrift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, -25px); }
          50% { transform: translate(-20px, -45px); }
          75% { transform: translate(25px, -15px); }
        }
        @keyframes fireflyPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes waveUndulate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes leafFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        @keyframes leafSway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25px); }
        }
        @keyframes kashfulSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes fluffDrift {
          0% { transform: translateX(-20px) translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% { transform: translateX(calc(100vw + 40px)) translateY(30px) rotate(45deg); opacity: 0; }
        }
        @keyframes jhirijhiriFall {
          0% { transform: translate(0, 0); }
          100% { transform: translate(12px, 120px); }
        }
      `}</style>
    </div>
  );
};
