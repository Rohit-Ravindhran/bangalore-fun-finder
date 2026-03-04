import React from 'react';
import { Heart, Utensils, Users, Briefcase, Car, Globe, Sparkles, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExploreItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  iconColor: string;
  comingSoon?: boolean;
}

const exploreItems: ExploreItem[] = [
  { id: 'outings', label: 'Day Out', icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
  { id: 'dates', label: 'Date Ideas', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-50', iconColor: 'text-pink-500' },
  { id: 'food', label: 'Food Spots', icon: Utensils, color: 'text-amber-500', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
  { id: 'meetups', label: 'Meetups', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  { id: 'people', label: 'Meet People', icon: Globe, color: 'text-blue-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
  { id: 'jobs', label: 'City Jobs', icon: Briefcase, color: 'text-slate-500', bgColor: 'bg-slate-50', iconColor: 'text-slate-500', comingSoon: true },
  { id: 'rides', label: 'Ride Deals', icon: Car, color: 'text-teal-500', bgColor: 'bg-teal-50', iconColor: 'text-teal-500', comingSoon: true },
];

interface QuickExploreProps {
  onItemClick?: (id: string) => void;
}

const QuickExplore: React.FC<QuickExploreProps> = ({ onItemClick }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-gray-900">Explore Bangalore</h2>
        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
          <Sparkles className="h-3 w-3" />
          Coming Soon
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {exploreItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => !item.comingSoon && onItemClick?.(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[72px] py-3 px-2 rounded-xl transition-all",
                item.bgColor,
                item.comingSoon ? "opacity-60 cursor-default" : "hover:shadow-md active:scale-95"
              )}
            >
              <Icon className={cn("h-6 w-6 mb-1", item.iconColor)} />
              <span className="text-[10px] font-medium text-gray-700 whitespace-nowrap">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[8px] text-gray-400 mt-0.5">Soon</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickExplore;
