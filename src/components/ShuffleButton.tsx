
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ShuffleButtonProps {
  onShuffle: () => void;
}

const ShuffleButton: React.FC<ShuffleButtonProps> = ({ onShuffle }) => {
  return (
    <Button 
      onClick={onShuffle}
      className="glass-pill h-12 w-12 bg-gradient-to-r from-orange-500/80 to-pink-500/70 hover:from-orange-400/90 hover:to-pink-400/80 premium-shadow border border-white/15 flex items-center justify-center text-white smooth-hover soft-glow"
    >
      <RefreshCw className="h-5 w-5" />
    </Button>
  );
};

export default ShuffleButton;
