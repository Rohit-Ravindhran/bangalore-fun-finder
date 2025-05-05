
import React, { useState } from 'react';
import { Menu, Search, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SideMenu from './SideMenu';

interface HeaderProps {
  toggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-4 bg-w2d-cream sticky top-0 z-10 shadow-sm">
        <div className="text-2xl font-nunito font-bold text-primary">
          What2Do <span className="text-w2d-teal">Bangalore 🎈</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            className="text-primary"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className="text-primary"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      
      {showSearch && (
        <div className="px-4 py-2 bg-white shadow-md">
          <input 
            type="text" 
            placeholder="Search activities..." 
            className="w-full p-2 border rounded-lg"
            autoFocus
          />
        </div>
      )}

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
