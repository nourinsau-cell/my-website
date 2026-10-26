export interface ReaderProfile {
  id: string;
  name: string;
  isPseudonym: boolean; // ছদ্মনাম (Pen Name)
  pseudonymTitle?: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
  monthlyGoal: number; // Monthly reading goal (number of chapters/stories)
  monthlyCompleted: number; // Chapters read this month
  readChapters: string[]; // List of read chapter keys
  bookmarks: string[]; // List of bookmarked story IDs
  giftsSent: {
    id: string;
    amount: number;
    currency: 'BDT' | 'INR' | 'USD';
    giftName: string;
    date: string;
  }[];
}

const STORAGE_KEY = 'nishat_reader_profile_v2';

export const AVATAR_OPTIONS = [
  { id: 'rain_lover', label: 'বৃষ্টিপ্রেমী পাঠক', emoji: '🌧️', bg: 'from-blue-600 to-indigo-800' },
  { id: 'night_owl', label: 'নিশাচর কবি', emoji: '🌙', bg: 'from-purple-700 to-slate-900' },
  { id: 'coffee_book', label: 'কফি ও পাণ্ডুলিপি', emoji: '☕', bg: 'from-amber-700 to-stone-900' },
  { id: 'feather_pen', label: 'ময়ূরপঙ্খী কলম', emoji: '🪶', bg: 'from-teal-600 to-cyan-900' },
  { id: 'rose_petal', label: 'গোলাপের মলাট', emoji: '🌹', bg: 'from-rose-600 to-pink-900' },
  { id: 'solitary_tree', label: 'নির্জন পথিক', emoji: '🌲', bg: 'from-emerald-700 to-neutral-900' }
];

export const getStoredProfile = (): ReaderProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveProfile = (profile: ReaderProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('reader_profile_updated'));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
};

export const clearProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('reader_profile_updated'));
};

export const recordChapterRead = (chapterKey: string): void => {
  const profile = getStoredProfile();
  if (!profile) return;
  if (!profile.readChapters.includes(chapterKey)) {
    profile.readChapters.push(chapterKey);
    profile.monthlyCompleted = (profile.monthlyCompleted || 0) + 1;
    saveProfile(profile);
  }
};

export const updateMonthlyGoal = (goalNumber: number): void => {
  const profile = getStoredProfile();
  if (!profile) return;
  profile.monthlyGoal = Math.max(1, goalNumber);
  saveProfile(profile);
};
