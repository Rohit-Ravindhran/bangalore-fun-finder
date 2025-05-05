
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
      className="fixed bottom-6 right-6 z-20 rounded-full h-12 w-12 bg-w2d-teal shadow-lg flex items-center justify-center"
    >
      <RefreshCw className="h-5 w-5" />
    </Button>
  );
};

export default ShuffleButton;
