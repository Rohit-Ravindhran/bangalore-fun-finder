
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
    <div className={`bg-gradient-to-r from-amber-50 to-amber-100 text-primary rounded-xl p-6 shadow-md border-t-2 border-amber-200 ${className}`}>
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <BellPlus className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-base">Get weekend plans every Friday 🔔</span>
          </div>
          
          <form className="flex gap-2 w-full md:w-auto" onSubmit={handleContactSubscribe}>
            <Input 
              type="text" 
              placeholder="Email or phone number" 
              className="h-10 text-sm border-amber-200 focus-visible:ring-amber-500"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              size="default" 
              className="h-10 bg-amber-600 text-white hover:bg-amber-700"
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
