import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuote?: string;
  source?: string;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  isOpen,
  onClose,
  initialQuote = 'ভালোবাসার কোনো ব্যাকরণ নেই, কেবল কিছু অসমাপ্ত আর্তনাদ আর মধ্যরাতের মৌনতা আছে।',
  source = 'উপন্যাস: মেঘডুবি রাত'
}) => {
  const [quoteText, setQuoteText] = useState(initialQuote);
  const [quoteSource, setQuoteSource] = useState(source);
  const [cardTheme, setCardTheme] = useState<'midnight' | 'cream' | 'sepia' | 'rose'>('midnight');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (initialQuote) setQuoteText(initialQuote);
    if (source) setQuoteSource(source);
  }, [initialQuote, source]);

  // Render canvas card
  const renderCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Theme backgrounds & text colors
    let bgColor = '#0a0e17';
    let textColor = '#f4f0e6';
    let subTextColor = '#e2ba4d';
    let tagColor = '#94a3b8';
    let borderColor = 'rgba(255, 255, 255, 0.12)';

    if (cardTheme === 'cream') {
      bgColor = '#fcf8ef';
      textColor = '#1e1b18';
      subTextColor = '#c59b27';
      tagColor = '#78716c';
      borderColor = 'rgba(0, 0, 0, 0.08)';
    } else if (cardTheme === 'sepia') {
      bgColor = '#f4ebd0';
      textColor = '#33261d';
      subTextColor = '#a67f1b';
      tagColor = '#7c6858';
      borderColor = 'rgba(100, 70, 40, 0.15)';
    } else if (cardTheme === 'rose') {
      bgColor = '#1e1218';
      textColor = '#fff1f2';
      subTextColor = '#fb7185';
      tagColor = '#fda4af';
      borderColor = 'rgba(251, 113, 133, 0.2)';
    }

    // 1. Background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle paper/gradient glow
    const radial = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 600);
    radial.addColorStop(0, cardTheme === 'cream' ? 'rgba(240, 230, 210, 0.4)' : 'rgba(25, 35, 60, 0.5)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 2. Elegant Border Frame
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(75, 75, width - 150, height - 150);

    // 3. Top Accent Line (Subtle Rainbow)
    const rainbowGrad = ctx.createLinearGradient(120, 100, width - 120, 100);
    rainbowGrad.addColorStop(0, '#e88691');
    rainbowGrad.addColorStop(0.3, '#e6ba5c');
    rainbowGrad.addColorStop(0.6, '#80cbab');
    rainbowGrad.addColorStop(1, '#82b4f0');
    ctx.fillStyle = rainbowGrad;
    ctx.fillRect(width / 2 - 80, 120, 160, 3);

    // 4. Quote Mark Symbol
    ctx.fillStyle = subTextColor;
    ctx.font = 'italic 90px "Noto Serif Bengali", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('“', width / 2, 240);

    // 5. Quote Text Wrapping
    ctx.fillStyle = textColor;
    ctx.font = '500 42px "Noto Serif Bengali", "Tiro Bangla", serif';
    ctx.textAlign = 'center';

    const maxLineWidth = width - 260;
    const words = quoteText.split(' ');
    let lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = 72;
    const totalTextHeight = lines.length * lineHeight;
    let startY = height / 2 - totalTextHeight / 2 + 30;

    lines.forEach((line) => {
      ctx.fillText(line, width / 2, startY);
      startY += lineHeight;
    });

    // 6. Source & Author Lockup
    if (quoteSource) {
      ctx.fillStyle = tagColor;
      ctx.font = '400 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`— ${quoteSource}`, width / 2, startY + 40);
    }

    // Author Watermark Bottom
    ctx.fillStyle = subTextColor;
    ctx.font = 'bold 36px "Tiro Bangla", "Noto Serif Bengali", serif';
    ctx.fillText('নিশাত আহমেদ', width / 2, height - 160);

    ctx.fillStyle = tagColor;
    ctx.font = '300 22px "Hind Siliguri", sans-serif';
    ctx.fillText('ভালোবাসার অন্য ভাষা', width / 2, height - 120);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        renderCard();
      }, 50);
    }
  }, [isOpen, quoteText, quoteSource, cardTheme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nishat-ahmed-quote-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      });
    } catch {
      // Fallback: copy text
      navigator.clipboard.writeText(`"${quoteText}" — নিশাত আহমেদ (${quoteSource})`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121826] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col font-ui">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d66872]" />
            <h3 className="font-editorial text-lg font-bold text-neutral-900 dark:text-neutral-100">
              উক্তি কার্ড প্রস্তুত করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-grow">
          {/* Canvas Preview Area */}
          <div className="flex justify-center bg-neutral-100 dark:bg-[#0a0e17] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
            <canvas
              ref={canvasRef}
              className="max-h-[300px] sm:max-h-[360px] w-auto aspect-square rounded-lg shadow-md object-contain"
            />
          </div>

          {/* Theme selector */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-neutral-500 font-medium">রঙের আবহ নির্বাচন:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCardTheme('midnight')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  cardTheme === 'midnight'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                রাত্রি
              </button>
              <button
                onClick={() => setCardTheme('cream')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  cardTheme === 'cream'
                    ? 'bg-[#fcf8ef] text-neutral-900 border border-neutral-300 font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                ক্রিম
              </button>
              <button
                onClick={() => setCardTheme('sepia')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  cardTheme === 'sepia'
                    ? 'bg-[#f4ebd0] text-[#33261d] font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                সেপিয়া
              </button>
              <button
                onClick={() => setCardTheme('rose')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  cardTheme === 'rose'
                    ? 'bg-[#4c1d24] text-rose-200 font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                গোধূলি
              </button>
            </div>
          </div>

          {/* Editable quote & source text inputs */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                উক্তির বাক্য (সম্পাদনাযোগ্য)
              </label>
              <textarea
                rows={2}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 focus:outline-none focus:border-[#d66872]"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                উৎস বা প্রসঙ্গের নাম
              </label>
              <input
                type="text"
                value={quoteSource}
                onChange={(e) => setQuoteSource(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 focus:outline-none focus:border-[#d66872]"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={() => renderCard()}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>পুনরায় আঁকুন</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d66872] hover:bg-[#c5555f] text-white text-xs font-semibold shadow-md transition-colors"
            >
              {downloadSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadSuccess ? 'ডাউনলোড সম্পন্ন!' : 'কার্ড ডাউনলোড করুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
