
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
    <div className={`bg-white text-primary rounded-lg p-4 shadow-sm ${className}`}>
      <form className="flex flex-col md:flex-row items-center justify-between gap-3" onSubmit={handleContactSubscribe}>
        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
          <BellPlus className="h-4 w-4 text-amber-600" />
          <span className="font-medium">Weekend plans every Friday</span>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <Input 
            type="text" 
            placeholder="Email or phone" 
            className="h-9 text-xs border-amber-100 focus-visible:ring-amber-400"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            size="sm"
            className="h-9 bg-amber-500 hover:bg-amber-600 text-white text-xs px-3"
          >
            Subscribe
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeSection;
