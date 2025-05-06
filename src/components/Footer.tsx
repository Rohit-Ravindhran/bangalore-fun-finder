
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const handleSuggestionClick = () => {
    // In a real app, this would link to a Google Form or internal form
    window.open("https://forms.gle/yourFormLink", "_blank");
  };

  return (
    <footer className="bg-white p-6 mt-6 border-t">
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-600 mb-4 text-sm">
          What2Do in Bangalore is your personal city guide to hidden and trending things to do – curated just for you.
        </p>
        
        <div className="mb-6 px-4 flex flex-col items-center">
          <p className="mb-3 text-sm">
            Have something to add to the list?
          </p>
          
          <Button 
            variant="outline" 
            onClick={handleSuggestionClick}
            className="text-sm w-auto flex items-center"
          >
            Submit an Activity <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex justify-center space-x-4 text-xs text-w2d-teal">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/favorites" className="hover:underline">Favorites</Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} What2Do Bangalore
        </p>
      </div>
    </footer>
  );
};

export default Footer;
