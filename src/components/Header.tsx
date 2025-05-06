
import React, { useState } from 'react';
import { Menu, Search, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SideMenu from './SideMenu';

interface HeaderProps {
  toggleMenu?: () => void;
  toggleSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between py-4 px-4 bg-w2d-cream sticky top-0 z-10 shadow-sm">
        <div className="text-2xl font-nunito font-bold text-primary">
          What2Do <span className="text-w2d-teal">Bangalore</span>
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
            onClick={handleToggleMenu} 
            className="text-primary"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
