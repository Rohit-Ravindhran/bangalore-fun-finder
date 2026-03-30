'use client'


import React, { useState, useEffect } from 'react';
import { Search, CircleUserRound, X, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  toggleMenu?: () => void;
  toggleSearch?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSearch, 
  searchQuery = '', 
  onSearchChange,
  showSearch = false 
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Treat as scrolled state when search is focused OR actually scrolled
  const showCompactMode = isScrolled || isSearchFocused;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      // Collapse search when scrolling back to top (only if not focused)
      if (!scrolled && !isSearchFocused) {
        setSearchExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchFocused]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
    setSearchExpanded(false);
    onSearchChange?.('');
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-100 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
      {/* Top row with logo and profile */}
      <div className="flex items-center justify-between py-3 gap-2">
        {/* Logo - hidden when search expanded */}
        {!(showCompactMode && searchExpanded) && (
          <div 
            className="flex items-center gap-1 cursor-pointer flex-shrink-0"
            onClick={() => router.push('/')}
          >
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              Happ'nin
            </span>
            <span className="text-xl md:text-2xl font-bold text-orange-500">
              Bangalore
            </span>
          </div>
        )}
        
        {/* Compact state: search expands full width */}
        {showCompactMode && searchExpanded && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search places, events, food..." 
                className="w-full h-10 pl-9 pr-8 text-sm rounded-full bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                autoFocus
              />
              <button
                onClick={handleSearchClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search icon - only show when compact and search not expanded */}
          {showCompactMode && !searchExpanded && (
            <button
              onClick={() => setSearchExpanded(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Blog link - hidden when search is expanded */}
          {!searchExpanded && (
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </button>
          )}

          {/* Profile icon - always visible */}
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center justify-center transition-transform hover:scale-105 p-1"
          >
            <CircleUserRound className="h-7 w-7 text-orange-500" fill="rgba(249, 115, 22, 0.15)" />
          </button>
        </div>
      </div>
      
      {/* Hero text and search - animated show/hide */}
      <div className={`overflow-hidden transition-all duration-200 ease-out ${showCompactMode ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
        <div className="pb-3">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            Discover things to do in Bangalore
          </h1>
          <p className="text-sm text-gray-500">
            Dates • Meetups • Food • Events • Friends
          </p>
        </div>
        
        {/* Full width search bar */}
        <div className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search places, events, food..." 
              className="w-full pl-10 pr-4 py-5 bg-gray-50 border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={handleSearchFocus}
            />
          </div>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
