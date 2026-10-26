import React, { useState, useEffect } from 'react';
import {
  ReaderProfile,
  getStoredProfile,
  saveProfile,
  clearProfile,
  AVATAR_OPTIONS,
  updateMonthlyGoal
} from '../utils/readerAccount';
import { useLanguage } from '../utils/languageContext';
import {
  User,
  Mail,
  Target,
  Award,
  BookOpen,
  Heart,
  Edit3,
  Check,
  X,
  Sparkles,
  Bookmark,
  LogOut,
  FolderHeart
} from 'lucide-react';

interface ReaderFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStory?: (storyId: string) => void;
}

export const ReaderFolderModal: React.FC<ReaderFolderModalProps> = ({
  isOpen,
  onClose,
  onSelectStory
}) => {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<ReaderProfile | null>(null);

  // Form State for creating/editing account
  const [name, setName] = useState('');
  const [isPseudonym, setIsPseudonym] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [monthlyGoalInput, setMonthlyGoalInput] = useState(10);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  useEffect(() => {
    const load = () => {
      const p = getStoredProfile();
      setProfile(p);
      if (p) {
        setName(p.name);
        setIsPseudonym(p.isPseudonym);
        setEmail(p.email);
        setSelectedAvatar(p.avatar);
        setMonthlyGoalInput(p.monthlyGoal || 10);
      }
    };
    load();
    window.addEventListener('reader_profile_updated', load);
    return () => window.removeEventListener('reader_profile_updated', load);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateOrUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newProfile: ReaderProfile = {
      id: profile ? profile.id : `reader_${Date.now()}`,
      name: name.trim(),
      isPseudonym,
      email: email.trim(),
      avatar: selectedAvatar,
      joinedAt: profile ? profile.joinedAt : new Date().toLocaleDateString('bn-BD'),
      monthlyGoal: monthlyGoalInput || 10,
      monthlyCompleted: profile ? profile.monthlyCompleted : 0,
      readChapters: profile ? profile.readChapters : [],
      bookmarks: profile ? profile.bookmarks : [],
      giftsSent: profile ? profile.giftsSent : []
    };

    saveProfile(newProfile);
    setProfile(newProfile);
    setSavedSuccessMsg('আপনার পাঠক প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleUpdateGoal = () => {
    updateMonthlyGoal(monthlyGoalInput);
    setIsEditingGoal(false);
  };

  const handleLogout = () => {
    clearProfile();
    setProfile(null);
    setName('');
    setEmail('');
  };

  // Progress calculation for Monthly Goal
  const goal = profile?.monthlyGoal || 10;
  const completed = profile?.monthlyCompleted || 0;
  const progressPercent = Math.min(100, Math.round((completed / goal) * 100));

  // Circular SVG ring math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const currentAvatarObj =
    AVATAR_OPTIONS.find((a) => a.id === (profile?.avatar || selectedAvatar)) || AVATAR_OPTIONS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#140e1d] text-[#ede6da] border border-amber-400/30 shadow-2xl p-6 sm:p-8 font-ui">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-amber-400">
              {profile ? 'পাঠক ফোল্ডার · Reader Profile' : 'নতুন পাঠক অ্যাকাউন্ট খুলুন'}
            </h2>
            <p className="text-xs text-neutral-400">
              {profile
                ? 'আপনার ব্যক্তিগত পড়ার লক্ষ্য, পছন্দের বই ও অর্জনের ডায়েরি'
                : 'নিজের নাম বা ছদ্মনাম এবং শুধু ইমেইল দিয়ে সহজেই প্রোফাইল তৈরি করুন'}
            </p>
          </div>
        </div>

        {savedSuccessMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* IF PROFILE EXISTS: SHOW READER DASHBOARD WITH GOAL RING */}
        {profile ? (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentAvatarObj.bg} flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0`}
              >
                {currentAvatarObj.emoji}
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white font-editorial">
                    {profile.name}
                  </h3>
                  {profile.isPseudonym && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                      ছদ্মনাম / Pen Name
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  {profile.email}
                </p>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  যোগদানের তারিখ: {profile.joinedAt}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-900/40 hover:text-rose-300 text-xs text-neutral-300 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>

            {/* Monthly Reading Goal Progress Ring Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-400/10 via-purple-900/20 to-black/40 border border-amber-400/30 flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Ring */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="text-white/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="url(#goldGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#facc15" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold font-editorial text-amber-300">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    সম্পন্ন
                  </span>
                </div>
              </div>

              {/* Goal Details & Controls */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">
                    মাসিক পড়ার লক্ষ্য (Monthly Reading Goal)
                  </span>
                </div>

                <p className="text-xs text-neutral-300">
                  এই মাসে আপনি <strong className="text-amber-400">{completed}</strong> টি পর্ব
                  পড়েছেন, লক্ষ্য <strong className="text-white">{goal}</strong> টি পর্ব।
                </p>

                {isEditingGoal ? (
                  <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={monthlyGoalInput}
                      onChange={(e) => setMonthlyGoalInput(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 rounded-lg bg-black/60 border border-amber-400/50 text-white text-sm text-center focus:outline-none"
                    />
                    <button
                      onClick={handleUpdateGoal}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
                    >
                      সেভ
                    </button>
                    <button
                      onClick={() => setIsEditingGoal(false)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-neutral-300 text-xs"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingGoal(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline mt-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>লক্ষ্য পরিবর্তন করুন</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reading Achievements Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold text-amber-400 font-editorial">
                  {profile.readChapters.length}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">মোট পঠিত পর্ব</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold text-purple-300 font-editorial">
                  {profile.bookmarks.length}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">বুকমার্ক বই</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold text-rose-400 font-editorial">
                  {profile.giftsSent.length}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">উপহার প্রেরিত</div>
              </div>
            </div>
          </div>
        ) : (
          /* REGISTRATION / LOGIN FORM - JUST NAME & EMAIL NEEDED */
          <form onSubmit={handleCreateOrUpdateProfile} className="space-y-5">
            {/* Real Name or Pen Name Toggle */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">
                  নামের ধরণ (Name Type)
                </span>
                <span className="text-[11px] text-neutral-400">
                  {isPseudonym ? 'গোপন ছদ্মনামে একাউন্ট তৈরি' : 'আসল নামে একাউন্ট তৈরি'}
                </span>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPseudonym(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    !isPseudonym ? 'bg-amber-400 text-black shadow' : 'text-neutral-400'
                  }`}
                >
                  আসল নাম
                </button>
                <button
                  type="button"
                  onClick={() => setIsPseudonym(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isPseudonym ? 'bg-purple-600 text-white shadow' : 'text-neutral-400'
                  }`}
                >
                  ছদ্মনাম
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {isPseudonym ? 'আপনার ছদ্মনাম (Pen Name)' : 'আপনার নাম (Your Name)'} *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder={
                    isPseudonym ? 'যেমন: নীল অপ্সরী, মেঘদূত, রাতের যাযাবর' : 'আপনার পুরো নাম লিখুন'
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Email Address - "just mail address lagbe" */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                ইমেইল এড্রেস (Email Address) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com (শুধু ইমেইল প্রয়োজন)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                কোনো জটিল পাসওয়ার্ডের ঝামেলা নেই, কেবল আপনার ইমেইল দিয়ে সহজেই অ্যাকাউন্ট চালু হবে।
              </p>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                পছন্দের প্রতিকৃতি (Avatar) নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                      selectedAvatar === av.id
                        ? 'border-amber-400 bg-amber-400/20 shadow-md scale-105'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[10px] text-neutral-300 text-center truncate w-full">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Monthly Reading Goal */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                মাসিক পড়ার লক্ষ্য (Monthly Reading Goal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={monthlyGoalInput}
                  onChange={(e) => setMonthlyGoalInput(parseInt(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-sm font-bold text-amber-300 px-3 py-1 rounded-lg bg-black/40 border border-white/10 shrink-0">
                  {monthlyGoalInput} টি পর্ব
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>প্রোফাইল তৈরি সম্পন্ন করুন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
