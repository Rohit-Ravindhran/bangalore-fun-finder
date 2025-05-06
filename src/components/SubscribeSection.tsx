
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
    <div className={`bg-white rounded-xl p-4 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-sm">
          <BellPlus className="h-4 w-4 text-w2d-teal" />
          <span>Enter your email or phone to get weekend plans every Friday 🔔</span>
        </div>
        
        <form className="flex gap-2" onSubmit={handleContactSubscribe}>
          <Input 
            type="text" 
            placeholder="Email or phone number" 
            className="h-8 text-sm"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            size="sm" 
            className="h-8 bg-w2d-teal"
          >
            Submit
          </Button>
        </form>
      </div>
      
      <div className="flex justify-end text-xs text-gray-600">
        <Clock className="h-3 w-3 mr-1" />
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SubscribeSection;
