
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
      <header className="flex items-center justify-between py-3 px-5 bg-[#FFF8F0] sticky top-0 z-40 shadow-sm border-b border-amber-100">
        <div className="text-2xl font-nunito font-bold text-[#323232]">
          {/* App name removed from header */}
        </div>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleSearch}
                  className="h-8 w-8 rounded-full bg-white border-none shadow-sm hover:bg-amber-50 hover:shadow-md transition-all"
                >
                  <Search className="h-4 w-4 text-primary" />
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
                  className="h-8 w-8 rounded-full bg-white border-none shadow-sm hover:bg-amber-50 hover:shadow-md transition-all"
                >
                  <Menu className="h-4 w-4 text-primary" />
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
