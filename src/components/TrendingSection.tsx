'use client'

import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Activity } from '@/components/ActivityCard';
import { useRouter } from 'next/navigation';
import ActivityImage from '@/components/ActivityImage';

interface TrendingSectionProps {
  activities: Activity[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ activities }) => {
  const router = useRouter();
  
  // Get top 4 activities for trending
  const trendingItems = activities.slice(0, 4);
  
  if (trendingItems.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-orange-500" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Trending in Bangalore</h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {trendingItems.map((activity, index) => (
          <button
            key={activity.id}
            onClick={() => router.push(`/activity/${activity.slug}`)}
            className="flex-shrink-0 w-[200px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="relative h-24 overflow-hidden">
              <ActivityImage
                src={activity.image}
                title={activity.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                #{index + 1}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 text-left">{activity.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">{activity.location}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
