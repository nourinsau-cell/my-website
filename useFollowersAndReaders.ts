import { useState, useEffect } from 'react';

export function useFollowersAndReaders() {
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nishat_is_following') === 'true';
    } catch {
      return false;
    }
  });

  const baseFollowers = 14280;
  const [followerCount, setFollowerCount] = useState<number>(() => {
    try {
      const storedCount = localStorage.getItem('nishat_follower_count');
      if (storedCount) return parseInt(storedCount, 10);
    } catch {
      // Ignore
    }
    return baseFollowers + (isFollowing ? 1 : 0);
  });

  const [totalReaders, setTotalReaders] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('nishat_total_readers');
      return stored ? parseInt(stored, 10) : 98450;
    } catch {
      return 98450;
    }
  });

  const [activeReadersNow, setActiveReadersNow] = useState<number>(342);
  const [followToast, setFollowToast] = useState<string | null>(null);

  // Slight gentle fluctuation for currently reading number to simulate live readers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReadersNow((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(280, Math.min(420, prev + delta));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleFollow = () => {
    const nextState = !isFollowing;
    const newCount = nextState ? followerCount + 1 : followerCount - 1;
    setIsFollowing(nextState);
    setFollowerCount(newCount);

    try {
      localStorage.setItem('nishat_is_following', String(nextState));
      localStorage.setItem('nishat_follower_count', String(newCount));
    } catch {
      // Ignore
    }

    if (nextState) {
      setFollowToast('ধন্যবাদ! আপনি নিশাত আহমেদকে অনুসরণ করছেন · You are now following');
    } else {
      setFollowToast('অনুসরণ প্রত্যাহার করা হয়েছে · Unfollowed');
    }

    setTimeout(() => {
      setFollowToast(null);
    }, 3000);
  };

  const recordStoryRead = () => {
    setTotalReaders((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('nishat_total_readers', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return {
    isFollowing,
    followerCount,
    totalReaders,
    activeReadersNow,
    followToast,
    toggleFollow,
    recordStoryRead
  };
}
