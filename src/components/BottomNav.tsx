import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, Utensils, Globe, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass, path: '/' },
    { id: 'dates', label: 'Dates', icon: Heart, path: '/date-plans' },
    { id: 'meetups', label: 'Meetups', icon: Users, path: '/meetups', comingSoon: true },
    { id: 'food', label: 'Food', icon: Utensils, path: '/food', comingSoon: true },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', comingSoon: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative",
                isActive ? "text-orange-500" : "text-gray-500",
                item.comingSoon && "opacity-50"
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
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
