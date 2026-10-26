// Smart Copyright Attribution & Content Protection
// Ensures text cannot be raw-scraped; copying attaches full author citation, source, and copyright notice.

export function setupCopyrightProtection(onToastMessage?: (msg: string) => void) {
  const handleCopy = (e: ClipboardEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    // Allow brief search copies (under 15 chars) without alteration
    if (selectedText.length < 15) return;

    e.preventDefault();

    const currentUrl = window.location.href;
    const attribution = `\n\n— উদ্ধৃতি: নিশাত আহমেদ (Nishat Ahmed)\nকপিরাইট © নিশাত আহমেদ — সর্বস্বত্ব সংরক্ষিত।\nউৎস: ${currentUrl}\n(অনুমতি ব্যতীত বাণিজ্যিক ব্যবহার ও হুবহু অনুলিপি নিষিদ্ধ)`;

    const enrichedText = `“${selectedText}”${attribution}`;

    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', enrichedText);
      e.clipboardData.setData('text/html', `<blockquote style="font-style:italic;">${selectedText}</blockquote><p>— <strong>নিশাত আহমেদ (Nishat Ahmed)</strong><br><small>কপিরাইট © নিশাত আহমেদ | <a href="${currentUrl}">মূল লেখার উৎস</a></small></p>`);
    }

    if (onToastMessage) {
      onToastMessage('কপিরাইট উদ্ধৃতি সহ সংরক্ষিত: লেখাটি নিশাত আহমেদের উৎস ও কপিরাইট সহ কপি হয়েছে।');
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    // Only intercept context menu if clicking inside story reader prose text
    const target = e.target as HTMLElement;
    if (target && target.closest('.font-literary')) {
      // Don't fully block, but trigger attribution warning if text selected
      const sel = window.getSelection()?.toString();
      if (sel && sel.length > 20 && onToastMessage) {
        onToastMessage('সতর্কবার্তা: নিশাত আহমেদের সাহিত্যকর্ম কপিরাইট দ্বারা সংরক্ষিত। উদ্ধৃতি হিসেবে ব্যবহার করুন।');
      }
    }
  };

  document.addEventListener('copy', handleCopy);
  document.addEventListener('contextmenu', handleContextMenu);

  return () => {
    document.removeEventListener('copy', handleCopy);
    document.removeEventListener('contextmenu', handleContextMenu);
  };
}
