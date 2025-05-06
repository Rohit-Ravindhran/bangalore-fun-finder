
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white z-50 p-4 shadow-xl transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-nunito font-bold text-2xl text-primary">What2Do</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors"
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/favorites" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors flex items-center gap-2"
                onClick={onClose}
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors"
                onClick={onClose}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors"
                onClick={onClose}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="block py-2 text-primary hover:text-w2d-teal transition-colors"
                onClick={onClose}
              >
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <div className="text-sm text-gray-500">
            <p className="mb-4">What2Do in Bangalore is your personal city guide to hidden and trending things to do – curated just for you.</p>
            <p>© {new Date().getFullYear()} What2Do</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
