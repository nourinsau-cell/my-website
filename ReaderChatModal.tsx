import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, User, CheckCheck, Clock, Sparkles } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ReaderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetReaderName?: string;
  initialContext?: string; // e.g. "মন্তব্য: মেঘডুবি রাতের অয়ন আর নিলয়ের গল্পটা পড়ে..."
}

export const ReaderChatModal: React.FC<ReaderChatModalProps> = ({
  isOpen,
  onClose,
  targetReaderName = 'সহ-পাঠক',
  initialContext
}) => {
  const [myAuthorName, setMyAuthorName] = useState(() => {
    try {
      return localStorage.getItem('nishat_my_reader_name') || '';
    } catch {
      return '';
    }
  });

  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Storage key based on recipient
  const storageKey = `nishat_chat_${targetReaderName.trim().toLowerCase().replace(/\s+/g, '_')}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }

    // Default introductory message from that reader
    return [
      {
        id: 'msg-init-1',
        sender: targetReaderName,
        recipient: 'আপনি',
        text: `নমস্কার! নিশাত আহমেদ ভাইয়ের সাহিত্যের এই মায়াবী ভুবনে আপনাকে স্বাগতম। আপনার ভালো লাগা আর ভাবনা শেয়ার করতে পারেন।`,
        timestamp: 'আজ',
        isMe: false
      }
    ];
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([
          {
            id: 'msg-init-1',
            sender: targetReaderName,
            recipient: 'আপনি',
            text: `নমস্কার! নিশাত আহমেদ ভাইয়ের সাহিত্যের এই মায়াবী ভুবনে আপনাকে স্বাগতম। আপনার ভালো লাগা আর ভাবনা শেয়ার করতে পারেন।`,
            timestamp: 'আজ',
            isMe: false
          }
        ]);
      }
    } catch {
      // Ignore
    }
  }, [targetReaderName, storageKey]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const senderName = myAuthorName.trim() || 'নিভৃত পাঠক';

    try {
      localStorage.setItem('nishat_my_reader_name', senderName);
    } catch {
      // Ignore
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      recipient: targetReaderName,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    const currentText = messageText;
    setMessageText('');

    // Simulate friendly reciprocal message after 1.5 seconds if target reader is replying
    setTimeout(() => {
      const replies = [
        `ধন্যবাদ আপনার বার্তার জন্য! নিশাত ভাইয়ের লেখার এই গভীরতাটাই আমাকে সবচেয়ে বেশি টানে।`,
        `একদম ঠিক বলেছেন! বিশেষ করে অনুভূতির যে সূক্ষ্ম টানাপোড়েন উনি ফুটিয়ে তোলেন, তা বিরল।`,
        `আপনার সাথে কথা বলে ভীষণ ভালো লাগল। নিশাত আহমেদের আর কোন লেখাটি আপনার সবচেয়ে পছন্দের?`,
        `অসাধারণ ভাবনা! ভালোবাসার এই ভাষাটা হৃদয় ছুঁয়ে যায়।`,
        `হ্যাঁ, আমিও অধ্যায়টি পড়ে অনেকক্ষণ চুপচাপ বসে ছিলাম...`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: targetReaderName,
        recipient: senderName,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };

      setMessages((prev) => {
        const next = [...prev, replyMsg];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    }, 1500);
  };

  const quickPrompts = [
    'আপনার এই মন্তব্যটি খুব ভালো লেগেছে!',
    'নিশাত আহমেদের কোন উপন্যাসটি আপনার সবচেয়ে প্রিয়?',
    'আমিও একই অনুভূতির মধ্য দিয়ে গিয়েছি...',
    'লেখাটির সমাপ্তিটা কি আপনি আশা করেছিলেন?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#140c24] border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col h-[560px] max-h-[90vh] overflow-hidden text-neutral-100 font-ui">
        
        {/* Top Chat Header */}
        <div className="p-4 bg-[#1a0f30] border-b border-purple-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {targetReaderName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1a0f30] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-editorial text-base font-bold text-white leading-tight">
                  {targetReaderName}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/70 border border-purple-500/30 text-purple-300 font-sans">
                  পাঠক
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>অনলাইন আছেন · সাহিত্য বিনিময়</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors"
              title="চ্যাট বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sender Name Bar if not provided */}
        <div className="px-4 py-2 bg-[#170e2a] border-b border-purple-950 flex items-center justify-between text-xs text-purple-300">
          <span className="flex items-center gap-1.5 text-[11px]">
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span>আপনার নাম:</span>
          </span>
          <input
            type="text"
            value={myAuthorName}
            onChange={(e) => setMyAuthorName(e.target.value)}
            placeholder="আপনার নাম লিখুন..."
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800 text-white text-xs focus:outline-none focus:border-purple-400 w-36 sm:w-44 placeholder:text-neutral-500"
          />
        </div>

        {/* Context snippet if originating from a comment */}
        {initialContext && (
          <div className="px-4 py-2 bg-purple-950/40 border-b border-purple-900/40 text-[11px] text-purple-200 line-clamp-1 italic">
            রেফারেন্স: {initialContext}
          </div>
        )}

        {/* Message Thread List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-radial from-[#180e2d] to-[#120a20]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-[10px] text-purple-400 font-medium">
                  {msg.isMe ? 'আপনি' : msg.sender}
                </span>
                <span className="text-[9px] text-purple-500">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                  msg.isMe
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-tr-none'
                    : 'bg-[#21133b] border border-purple-800/80 text-purple-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.isMe && (
                <div className="flex items-center gap-0.5 text-[9px] text-purple-400 mt-0.5">
                  <CheckCheck className="w-3 h-3 text-purple-400" />
                  <span>পাঠানো হয়েছে</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Conversation Prompts */}
        <div className="px-3 py-2 bg-[#170e2a] border-t border-purple-950 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setMessageText(p)}
              className="px-2.5 py-1 rounded-full bg-purple-950/70 hover:bg-purple-900/60 border border-purple-800 text-[11px] text-purple-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-[#1a0f30] border-t border-purple-900/60 flex items-center gap-2"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`${targetReaderName} কে একটি বার্তা লিখুন...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-purple-950/70 border border-purple-700/60 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:border-purple-400"
          />

          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-40 text-white shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
            title="মেসেজ পাঠান"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
