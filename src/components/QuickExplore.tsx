'use client';

import React from 'react';
import { Heart, Utensils, Users, Briefcase, Car, Globe, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ExploreItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  comingSoon?: boolean;
}

const exploreItems: ExploreItem[] = [
  { id: 'outings', label: 'Day Out', icon: Sun, href: '/day-out' },
  { id: 'dates', label: 'Date Ideas', icon: Heart, href: '/date-ideas' },
  { id: 'food', label: 'Food Spots', icon: Utensils, href: '/food' },
  { id: 'meetups', label: 'Meetups', icon: Users, href: '/meetups' },
  { id: 'people', label: 'Meet People', icon: Globe, comingSoon: true },
  { id: 'jobs', label: 'City Jobs', icon: Briefcase, comingSoon: true },
  { id: 'rides', label: 'Ride Deals', icon: Car, comingSoon: true },
];

interface QuickExploreProps {
  onItemClick?: (id: string) => void;
}

const QuickExplore: React.FC<QuickExploreProps> = ({ onItemClick }) => {
  const router = useRouter();

  const handleClick = (item: ExploreItem) => {
    if (item.comingSoon) return;
    if (item.href) {
      router.push(item.href);
    } else {
      onItemClick?.(item.id);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Explore</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {exploreItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[68px] py-2.5 px-2 rounded-xl transition-all border",
                item.comingSoon
                  ? "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-50 cursor-default"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:scale-95"
              )}
            >
              <Icon className="h-5 w-5 mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[8px] text-gray-400 dark:text-gray-600 mt-0.5">Soon</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickExplore;
