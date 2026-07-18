'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Compass, Users, Utensils, BookOpen, Heart, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BOTTOM_NAV, ROUTES } from '@/constants';

/** Maps bottom-nav item ids to their icon (icons stay in the component). */
const NAV_ICONS: Record<string, LucideIcon> = {
  blog: BookOpen,
  'date-ideas': Heart,
  food: Utensils,
  meetups: Users,
};

type NavItem = { id: string; label: string; path: string };

const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const leftItems: readonly NavItem[] = BOTTOM_NAV.left;
  const rightItems: readonly NavItem[] = BOTTOM_NAV.right;

  const NavButton = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.path;
    const Icon = NAV_ICONS[item.id];

    return (
      <button
        onClick={() => router.push(item.path)}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full relative",
          isActive ? "text-[#FFD60A]" : "text-gray-500 dark:text-gray-500",
        )}
      >
        <Icon className={cn("h-5 w-5", isActive && "text-[#FFD60A]")} />
        <span className={cn(
          "text-[10px] mt-1 font-medium",
          isActive && "text-[#FFD60A]"
        )}>
          {item.label}
        </span>
      </button>
    );
  };

  const isExploreActive = pathname === ROUTES.home;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0D0D0F] border-t border-gray-200 dark:border-white/[0.06] z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}

        {/* Center floating Explore button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => router.push(BOTTOM_NAV.center.path)}
            className="absolute -top-6 flex flex-col items-center"
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
              isExploreActive
                ? "bg-gradient-to-br from-[#FFD60A] to-[#FFAA00] shadow-[0_0_24px_rgba(255,214,10,0.45)]"
                : "bg-white dark:bg-[#1A1A1C] border-2 border-[#FFD60A]/30 dark:border-[#FFD60A]/20 hover:border-[#FFD60A]/70 dark:hover:border-[#FFD60A]/50 shadow-md"
            )}>
              <Compass className={cn(
                "h-6 w-6 transition-colors",
                isExploreActive ? "text-black" : "text-[#FFD60A]"
              )} />
            </div>
            <span className={cn(
              "text-[10px] mt-1.5 font-semibold",
              isExploreActive ? "text-[#FFD60A]" : "text-gray-500 dark:text-gray-500"
            )}>
              {BOTTOM_NAV.center.label}
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
