
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellPlus, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SubscribeSectionProps {
  className?: string;
}

const SubscribeSection: React.FC<SubscribeSectionProps> = ({ className = '' }) => {
  const [contact, setContact] = useState('');
  const { toast } = useToast();

  const handleContactSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      toast({
        title: "Subscribed!",
        description: "You'll receive weekend plans every Friday",
        duration: 2000,
      });
      setContact('');
    }
  };

  return (
    <div className={`sticky bottom-0 bg-w2d-teal text-white rounded-t-xl p-5 shadow-lg ${className}`}>
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <BellPlus className="h-5 w-5" />
            <span className="font-medium">Get weekend plans every Friday 🔔</span>
          </div>
          
          <form className="flex gap-2 w-full md:w-auto" onSubmit={handleContactSubscribe}>
            <Input 
              type="text" 
              placeholder="Email or phone number" 
              className="h-10 text-sm bg-white/20 border-0 placeholder:text-white/70 text-white focus-visible:ring-white/50"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              size="default" 
              className="h-10 bg-white text-w2d-teal hover:bg-white/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
        
        <div className="flex justify-end text-xs text-white/70">
          <Clock className="h-3 w-3 mr-1" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
