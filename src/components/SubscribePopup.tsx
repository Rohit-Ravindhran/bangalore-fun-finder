
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribePopup: React.FC<SubscribePopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [subscribeType, setSubscribeType] = useState<'email' | 'whatsapp'>('email');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            
            <div className="flex mb-4">
              <button 
                className={`flex-1 py-2 text-center ${subscribeType === 'email' ? 'bg-w2d-teal text-white font-medium' : 'bg-gray-100'}`}
                onClick={() => setSubscribeType('email')}
              >
                Email
              </button>
              <button 
                className={`flex-1 py-2 text-center ${subscribeType === 'whatsapp' ? 'bg-w2d-teal text-white font-medium' : 'bg-gray-100'}`}
                onClick={() => setSubscribeType('whatsapp')}
              >
                WhatsApp
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {subscribeType === 'email' ? (
                <div className="mb-4">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full p-3 border rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <input 
                    type="tel" 
                    placeholder="WhatsApp number" 
                    className="w-full p-3 border rounded-lg"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </div>
              )}
              
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
