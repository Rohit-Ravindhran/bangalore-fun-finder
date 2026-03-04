
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <header className="bg-white px-4 md:px-8 sticky top-0 z-40 border-b border-gray-100">
      {/* Top row with logo */}
      <div className="flex items-center justify-between py-3">
        <div 
          className="flex items-center gap-1 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            Happ'nin
          </span>
          <span className="text-xl md:text-2xl font-bold text-orange-500">
            Bangalore
          </span>
        </div>
      </div>
      
      {/* Hero text */}
      <div className="pb-3">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">
          Discover things to do in Bangalore
        </h1>
        <p className="text-sm text-gray-500">
          Dates • Meetups • Food • Events • Friends
        </p>
      </div>
      
      {/* Search bar */}
      <div className="pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search places, events, food..." 
            className="pl-10 pr-4 py-5 bg-gray-50 border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onClick={toggleSearch}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
