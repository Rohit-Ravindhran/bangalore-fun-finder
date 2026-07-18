'use client'

import React, { useState, useEffect } from 'react';
import { Search, Settings, X, BookOpen } from 'lucide-react';
import { Input } from '@/ui-kit';
import { useRouter } from 'next/navigation';
import {
  BRAND,
  ROUTES,
  NAV_LABELS,
  HEADER_TAGS,
  HEADER_STRINGS,
} from '@/constants';

interface HeaderProps {
  toggleMenu?: () => void;
  toggleSearch?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  onSearchStateChange?: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleSearch,
  searchQuery = '',
  onSearchChange,
  showSearch = false,
  onSearchStateChange,
}) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const showCompactMode = isScrolled || isSearchFocused;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
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
    onSearchStateChange?.(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
    setSearchExpanded(false);
    onSearchChange?.('');
    onSearchStateChange?.(false);
  };

  return (
    <header className="bg-white dark:bg-[#0D0D0F] sticky top-0 z-40 border-b border-gray-100 dark:border-white/[0.06] [transform:translateZ(0)]">
      {/* Ambient top glow — visible in dark mode only */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD60A]/40 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Top row */}
        <div className="flex items-center justify-between py-3 gap-2">
          {/* Logo — hidden when search is expanded */}
          {!(showCompactMode && searchExpanded) && (
            <div
              className="flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              onClick={() => router.push(ROUTES.home)}
            >
              {/* Live dot */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD60A]" />
              </span>
              <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {BRAND.namePrimary}
              </span>
              <span className="text-xl md:text-2xl font-bold text-[#FFD60A]">
                {BRAND.nameSecondary}
              </span>
            </div>
          )}

          {/* Compact search — full width */}
          {showCompactMode && searchExpanded && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={HEADER_STRINGS.searchPlaceholder}
                  className="w-full h-10 pl-9 pr-8 text-sm rounded-full bg-gray-50 dark:bg-white/[0.06] border-gray-200 dark:border-white/10 dark:text-gray-100 dark:placeholder-gray-500"
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
            {/* Search icon in compact mode */}
            {showCompactMode && !searchExpanded && (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {/* Guide link */}
            {!searchExpanded && (
              <button
                onClick={() => router.push(ROUTES.blog)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-[#FFD60A]/10 hover:text-[#FFD60A] transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">{NAV_LABELS.guide}</span>
              </button>
            )}

            {/* Settings icon */}
            <button
              onClick={() => router.push(ROUTES.settings)}
              className="flex items-center justify-center p-2 rounded-full hover:bg-[#FFD60A]/10 transition-colors"
              aria-label={HEADER_STRINGS.settingsAriaLabel}
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Hero text + search — animated collapse */}
        <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${showCompactMode ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
          <div className="pb-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {HEADER_STRINGS.heroTitle}
            </h1>
            {/* Tag pills — replace plain text */}
            <div className="flex flex-wrap gap-1.5">
              {HEADER_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/[0.08] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Full-width search bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={HEADER_STRINGS.searchPlaceholder}
                className="w-full pl-10 pr-4 py-5 bg-gray-50 dark:bg-white/[0.05] border-gray-200 dark:border-white/[0.08] rounded-xl text-sm dark:text-gray-100 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-white/[0.08] focus:ring-2 focus:ring-[#FFD60A]/30"
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
