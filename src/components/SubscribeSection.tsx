
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { subscribeUser } from '@/services/activityService';

interface SubscribeSectionProps {
  className?: string;
}

const SubscribeSection: React.FC<SubscribeSectionProps> = ({ className = '' }) => {
  const [contact, setContact] = useState('');
  const { toast } = useToast();

  const handleContactSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact) return;

    try {
      await subscribeUser(contact);

      toast({
        title: "Subscribed!",
        description: "You'll receive weekend plans every Friday",
        duration: 2000,
      });

      setContact('');
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`glass-card text-primary p-6 ${className}`}>
      <form className="flex flex-col md:flex-row items-center justify-between gap-4" onSubmit={handleContactSubscribe}>
        <div className="flex items-center gap-3 text-sm whitespace-nowrap">
          <div className="glass-button w-8 h-8 flex items-center justify-center p-1">
            <BellPlus className="h-4 w-4 text-amber-600" />
          </div>
          <span className="font-semibold text-gray-700">Weekend plans every Friday</span>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <Input 
            type="text" 
            placeholder="Email or phone" 
            className="glass-subtle h-10 text-sm border-white/30 focus-visible:ring-amber-400/50 placeholder:text-gray-500 font-medium"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            size="sm"
            className="glass-button h-10 bg-amber-500/80 hover:bg-amber-600/90 text-white text-sm px-4 font-semibold border-amber-400/50 hover:scale-105 transition-all duration-300"
          >
            Subscribe
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeSection;
