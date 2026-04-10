'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ActivityGrid from '@/components/ActivityGrid';
import { useActivitiesBySection } from '@/hooks/useActivities';
import { useToast } from '@/components/ui/use-toast';

const DateIdeas: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());

  // Try date-specific section first, fall back to 'all'
  const { data: activities = [], isLoading } = useActivitiesBySection('date');

  const handleLike = (id: string) => {
    setLikedActivities(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: 'Removed from favorites', duration: 1500 });
      } else {
        next.add(id);
        toast({ title: 'Added to favorites', duration: 1500 });
      }
      return next;
    });
  };

  const handleShare = async (id: string) => {
    const activity = activities.find((a) => a.id === id);
    const url = `${window.location.origin}/activity/${activity?.slug ?? id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Date Ideas in Bangalore', url });
      } else {
        navigator.clipboard.writeText(url);
        toast({ title: 'Link copied!', duration: 1500 });
      }
    } catch {
      // share cancelled
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 [transform:translateZ(0)]">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">Date Ideas</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Curated spots &amp; experiences perfect for a date in Bangalore.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No date ideas found. Check back soon!</p>
          </div>
        ) : (
          <ActivityGrid
            activities={activities}
            onLike={handleLike}
            likedActivities={likedActivities}
            onShare={handleShare}
            columns={2}
            sectionType="Date Ideas"
          />
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default DateIdeas;
