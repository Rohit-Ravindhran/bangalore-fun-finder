
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
      <header className="flex items-center justify-between py-1 px-5 md:px-10 bg-[#FFF8F0] sticky top-0 z-40 shadow-sm border-b border-amber-100">
        <div className="flex items-center gap-2 text-2xl md:text-3xl font-caveat font-bold text-[#323232]">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 text-sm md:text-base font-bold">W2D</span>
          </div>
          <span className="hidden sm:block">What2Do</span>
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleSearch}
                  className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-white border-none shadow-sm hover:bg-amber-50 hover:shadow-md transition-all"
                >
                  <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search activities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleToggleMenu} 
                  className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-white border-none shadow-sm hover:bg-amber-50 hover:shadow-md transition-all"
                >
                  <Menu className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
