
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

interface SubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribePopup: React.FC<SubscribePopupProps> = ({ isOpen, onClose }) => {
  const [contact, setContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (!isOpen) return null;

  const validateContact = (value: string) => {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simple phone regex (at least 10 digits)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContact(contact)) {
      toast({
        title: "Invalid format",
        description: "Please enter a valid email or phone number",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send this to an API
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button 
          className="absolute top-3 right-3 text-gray-400" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        {isSubmitted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold mb-2">Thank you!</h3>
            <p>You've successfully subscribed to our updates.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2">Never Miss a Fun Activity!</h3>
            <p className="text-gray-600 mb-4">Subscribe to our weekly updates for the best things happening in Bangalore.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Enter your email or phone number" 
                  className="w-full p-3 border rounded-lg"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Subscribe Now</Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribePopup;
