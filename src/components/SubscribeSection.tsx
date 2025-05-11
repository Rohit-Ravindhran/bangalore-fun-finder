
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
    <div className={`bg-white/90 text-primary rounded-xl p-5 shadow-sm border-0 ${className}`}>
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <BellPlus className="h-5 w-5 text-w2d-teal" />
            <span className="font-medium text-sm">Get weekend plans every Friday 🔔</span>
          </div>
          
          <form className="flex gap-2 w-full md:w-auto" onSubmit={handleContactSubscribe}>
            <Input 
              type="text" 
              placeholder="Email or phone number" 
              className="h-10 text-sm border-gray-200 focus-visible:ring-w2d-teal"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              size="default" 
              className="h-10 bg-w2d-teal text-white hover:bg-w2d-teal/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
