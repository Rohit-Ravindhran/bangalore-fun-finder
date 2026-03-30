'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Compass, Users, Utensils, MapPin, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const leftItems = [
    { id: 'day-out', label: 'Day Out', icon: MapPin, path: '/day-out', comingSoon: true },
    { id: 'date-ideas', label: 'Date Ideas', icon: Heart, path: '/date-ideas', comingSoon: true },
  ];

  const rightItems = [
    { id: 'food', label: 'Food Spots', icon: Utensils, path: '/food', comingSoon: true },
    { id: 'meetups', label: 'Meetups', icon: Users, path: '/meetups', comingSoon: true },
  ];

  const NavButton = ({ item }: { item: typeof leftItems[0] }) => {
    const isActive = pathname === item.path;
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => router.push(item.path)}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full relative",
          isActive ? "text-orange-500" : "text-gray-500",
          item.comingSoon && "opacity-60"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive && "text-orange-500")} />
        <span className={cn(
          "text-[10px] mt-1 font-medium",
          isActive && "text-orange-500"
        )}>
          {item.label}
        </span>
        {item.comingSoon && (
          <span className="absolute -top-1 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full" />
        )}
      </button>
    );
  };

  const isExploreActive = pathname === '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}

        {/* Center floating Explore button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => router.push('/')}
            className="absolute -top-6 flex flex-col items-center"
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
              isExploreActive 
                ? "bg-gradient-to-br from-orange-500 to-pink-500 shadow-orange-200" 
                : "bg-white border-2 border-gray-200 hover:border-orange-300"
            )}>
              <Compass className={cn(
                "h-6 w-6 transition-colors",
                isExploreActive ? "text-white" : "text-orange-500"
              )} />
            </div>
            <span className={cn(
              "text-[10px] mt-1.5 font-semibold",
              isExploreActive ? "text-orange-500" : "text-gray-500"
            )}>
              Explore
            </span>
          </button>
        </div>

        {/* Right items */}
        {rightItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
