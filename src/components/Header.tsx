
import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
      <header className="glass-header flex items-center justify-between py-2 px-4 md:px-8 sticky top-0 z-40 transition-all duration-300">
        <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-[#323232]">
          <div className="glass-pill w-8 h-8 md:w-9 md:h-9 flex items-center justify-center p-1 smooth-hover">
            <img 
              src="/lovable-uploads/6dacec0d-a286-4f09-ae43-9cb52365856b.png" 
              alt="H Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="hidden sm:block bg-gradient-to-r from-gray-800 via-orange-600 to-pink-600 bg-clip-text text-transparent">
            Happenings
          </span>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSearch}
                  className="glass-pill h-8 w-8 md:h-9 md:w-9 border-0 smooth-hover"
                >
                  <Search className="h-4.5 w-4.5 text-[#323232]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="glass-subtle">
                <p>Search activities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleToggleMenu} 
                  className="glass-pill h-8 w-8 md:h-9 md:w-9 border-0 smooth-hover"
                >
                  <Menu className="h-4.5 w-4.5 text-[#323232]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="glass-subtle">
                <p>Open menu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
