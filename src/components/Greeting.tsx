import { useEffect, useState } from 'react';

import { useUserProfile } from '@/hooks/useUserProfile';

export default function Greeting() {
  const { user, profile, isLoading } = useUserProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
      return 'Great morning to go for a run! 🏃‍♂️🌤️';
    } else if (hour >= 11 && hour < 14) {
      return 'Midday motivation — perfect time for a quick run ☀️';
    } else if (hour >= 14 && hour < 16) {
      return 'Afternoon run? Stay hydrated and strong 💦💪';
    } else if (hour >= 16 && hour < 19) {
      return 'Evening vibes — ideal for a cool run 🌇';
    } else if (hour >= 19 && hour < 22) {
      return 'Winding down? A short run can still count 🏃‍♀️🌙';
    } else {
      return 'Late night? Rest is also part of training 😴🛌';
    }
  };

  const displayName =
    profile?.firstName || profile?.fullName || user?.email?.split('@')[0] || 'User';
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-8">
      <h1 className="mb-1 text-2xl font-bold">
        {getTimeGreeting()}, {displayName}! 🔥
      </h1>
      <p className="text-white text-sm">{currentDate}</p>
    </div>
  );
}
