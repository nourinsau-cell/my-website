import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Feather, Heart, Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareWhatsApp: (text: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onShareWhatsApp
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'স্বাগতম। আমি নিশাত আহমেদের সাহিত্য নিকেতনের "সাহিত্য সহকারী"। গল্প, কবিতা, বিরহের অনুভূতি কিংবা না-বলা ভালোবাসার কোনো কথা জানতে চান? বলুন, আপনার মনের ভাব কীভাবে সাজিয়ে তুলব?',
      timestamp: 'এইমাত্র'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'বৃষ্টির রাতের জন্য দুটি রোমান্টিক লাইন লিখে দাও',
    'মেঘডুবি রাত উপন্যাসের অয়ন ও নিলয়ের সম্পর্কের গভীরতা কী?',
    'বিরহ এবং অপেক্ষার মাঝে পার্থক্যের একটি সাহিত্যিক সংজ্ঞা দাও',
    'হোয়াটসঅ্যাপ স্ট্যাটাসের জন্য একটি ছোট আবেগী উক্তি দাও'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'এইমাত্র'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'কিছু অনুভূতি শব্দের বন্ধন পেরিয়ে মৌনতায় বিলীন হয়ে যায়...',
        timestamp: 'এইমাত্র'
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: 'বৃষ্টির রাতে শব্দেরা যখন কথা বলতে চায়, তখন প্রতিটি অনুভূতিই এক একটি না-বলা প্রেমের গল্প হয়ে ওঠে।',
        timestamp: 'এইমাত্র'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] bg-[#120a1f] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100 font-ui">
        
        {/* Top Header */}
        <div className="p-4 border-b border-purple-900/50 bg-[#180e2a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-editorial text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>সাহিত্য সহকারী</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200 font-sans">
                  AI Companion
                </span>
              </h3>
              <p className="text-[11px] text-purple-300/70">
                নিশাত আহমেদের সাহিত্য দর্শন ও শব্দের জাদুকর
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-br-xs'
                      : 'bg-[#1e1333] border border-purple-500/20 text-purple-100 rounded-bl-xs font-literary shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Assistant message action strip (WhatsApp share / Copy) */}
                {!isUser && (
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-purple-400 px-1">
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="hover:text-purple-200 flex items-center gap-1 transition-colors"
                      title="কপি করুন"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => onShareWhatsApp(m.text)}
                      className="hover:text-emerald-400 flex items-center gap-1 text-emerald-400/90 transition-colors"
                      title="হোয়াটসঅ্যাপে শেয়ার করুন"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>হোয়াটসঅ্যাপে দিন</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-300 italic p-3 bg-purple-950/40 rounded-xl max-w-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>শব্দ মালা সাজানো হচ্ছে...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#160d24] border-t border-purple-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] text-purple-400 shrink-0 font-medium">পরামর্শ:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/40 whitespace-nowrap text-[11px] transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#180e2a] border-t border-purple-900/60 flex items-center gap-2">
          <input
            type="text"
            placeholder="আপনার প্রশ্ন বা অনুভূতির কথা লিখুন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={loading}
            className="flex-grow bg-[#10071c] border border-purple-700/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-purple-100 placeholder-purple-400/60 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white disabled:opacity-40 transition-transform active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
