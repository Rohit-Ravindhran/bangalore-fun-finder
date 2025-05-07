
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const handleSuggestionClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfwejAJIbXP5oC3UdZUOoYM0AQLf4ZqjuPm4nRBKAsB_FdcBg/viewform?usp=header", "_blank");
  };

  return (
    <footer className="bg-white p-8 border-t">
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-600 mb-6 text-sm">
          What2Do in Bangalore is your personal city guide to hidden and trending things to do – curated just for you.
        </p>
        
        <div className="mb-8 px-4 flex flex-col items-center">
          <p className="mb-4 text-sm">
            Have something to add to the list?
          </p>
          
          <Button 
            variant="outline" 
            onClick={handleSuggestionClick}
            className="text-sm w-auto flex items-center px-6 py-5 rounded-full border-w2d-teal text-w2d-teal hover:bg-w2d-teal hover:text-white"
          >
            Submit an Activity <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center space-x-6 text-sm text-w2d-teal">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/favorites" className="hover:underline">Favorites</Link>
        </div>
        <p className="text-xs text-gray-500 mt-5">
          © {new Date().getFullYear()} What2Do Bangalore
        </p>
      </div>
    </footer>
  );
};

export default Footer;
