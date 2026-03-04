import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const DateIdeas: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Date Ideas</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-pink-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Date Ideas</h2>
          <p className="text-gray-500 mb-8">
            Curated date plans for every mood - romantic dinners, adventure dates, and everything in between.
          </p>

          {/* Coming Soon Card */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <h3 className="font-semibold text-gray-900">Coming Soon</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We're putting together the best date experiences in Bangalore. Get notified when we launch!
            </p>
            <Button 
              className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl"
            >
              <Bell className="h-4 w-4 mr-2" />
              Stay tuned
            </Button>
          </div>

          {/* Preview Items */}
          <div className="mt-8 space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">What to expect</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {['Romantic Dinners', 'Rooftop Cafes', 'Adventure Dates', 'Cozy Corners'].map((item) => (
                <div key={item} className="bg-white rounded-xl p-3 border border-gray-100">
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DateIdeas;
