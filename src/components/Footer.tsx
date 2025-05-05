
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-6 mt-6 border-t">
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-600 mb-4 text-sm">
          What2Do in Bangalore is your personal city guide to hidden and trending things to do – curated just for you.
        </p>
        <div className="flex justify-center space-x-4 text-xs text-w2d-teal">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} What2Do Bangalore
        </p>
      </div>
    </footer>
  );
};

export default Footer;
