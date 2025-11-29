
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const handleSuggestionClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfwejAJIbXP5oC3UdZUOoYM0AQLf4ZqjuPm4nRBKAsB_FdcBg/viewform?usp=header", "_blank");
  };

  return (
    <footer className="glass-floating border-t-0 p-8 mx-4 mb-4 md:mx-8 relative overflow-hidden">
      <div className="relative z-10">
        <div className="max-w-md mx-auto text-center">
          {/* Newsletter Section */}
          <div className="glass-floating p-4 mb-8 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">📅</span>
              <p className="text-sm font-semibold text-gray-700">Weekend plans every Friday</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Email or phone"
                className="flex-1 px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              />
              <Button className="glass-pill bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 hover:shadow-lg">
                Subscribe
              </Button>
            </div>
          </div>

          <p className="text-gray-700 mb-6 text-[15px] font-medium leading-relaxed">
            Happ'nin in Bangalore is your personal city guide to hidden and trending things to do – curated just for you.
          </p>
          
          <div className="mb-8 px-4 flex flex-col items-center">
            <p className="mb-4 text-sm font-medium text-gray-600">
              Have something to add to the list?
            </p>
            
            <Button 
              onClick={handleSuggestionClick}
              className="glass-pill text-sm w-auto flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 smooth-hover shadow-lg hover:shadow-xl border-0"
            >
              Submit an Activity <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <Link to="/about" className="glass-pill px-3 py-2 smooth-hover hover:text-orange-600">About</Link>
            <Link to="/contact" className="glass-pill px-3 py-2 smooth-hover hover:text-orange-600">Contact</Link>
            <Link to="/privacy" className="glass-pill px-3 py-2 smooth-hover hover:text-orange-600">Privacy</Link>
            <Link to="/terms" className="glass-pill px-3 py-2 smooth-hover hover:text-orange-600">Terms</Link>
            <Link to="/favorites" className="glass-pill px-3 py-2 smooth-hover hover:text-orange-600">Favorites</Link>
          </div>
          <p className="text-xs text-gray-500 mt-5 font-medium">
            © {new Date().getFullYear()} Happenings Bangalore
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
