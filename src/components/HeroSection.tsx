
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { subscribeUser } from '@/services/activityService';
import { categories } from '@/data/mockData';

interface HeroSectionProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategories: Set<string>;
  onSelectAll: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  selectedCategories,
  onSelectAll
}) => {
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

  const allSelected = selectedCategories.size === 0;

  // Format the date in the required format
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  return (
    <div className="hero-section">
      <h1 className="brand-name">happenings bangalore</h1>
      <h2 className="tagline">what-to-do bangalore</h2>
      <p className="descriptor">Curated with love from trusted local communities</p>
      
      <div className="subscribe-box">
        <p className="subscribe-title">Get weekend plans every Friday</p>
        
        <form className="flex gap-2" onSubmit={handleContactSubscribe}>
          <Input
            type="text"
            placeholder="Email or phone number"
            className="border-amber-200 focus-visible:ring-amber-500"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Subscribe
          </Button>
        </form>
      </div>
      
      <div className="timestamp">
        <Clock className="h-3 w-3 mr-1" />
        <span>Activities last updated: {formattedTime} – {formattedDate}</span>
      </div>
      
      <div className="overflow-x-auto no-scrollbar">
        <div className="category-container">
          <button
            onClick={onSelectAll}
            className={`category-button ${allSelected ? 'active' : ''}`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`category-button ${selectedCategories.has(category.id) ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
