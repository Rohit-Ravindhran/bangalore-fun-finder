
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleMenu?: () => void;
  toggleSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-white py-3 px-4 md:px-8 sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="h-10 w-10 hover:bg-gray-100 rounded-full"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          A Bangalore outing guide — shaped by a growing community.
        </p>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
