
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className="flex items-center justify-between py-4 px-4 bg-w2d-cream sticky top-0 z-10">
      <div className="text-2xl font-nunito font-bold text-primary">
        What2Do
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu} 
        className="text-primary"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;
