import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Meetups: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Meetups</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-20" />
            <div className="relative bg-purple-100 p-6 rounded-full">
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Coming Soon!
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Meet new people in Bangalore
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-4 leading-relaxed">
            We're building a space where people in Bangalore can meet through shared activities and interests.
          </p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            From casual book clubs and coding sessions to hikes, language exchanges, and coffee meetups — you'll be able to discover and join small gatherings happening around the city.
          </p>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">
              What you'll be able to do
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Discover meetups happening near you
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Join small group activities and events
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Host your own meetup and invite others
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Connect with people who share your interests
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-6"
          >
            <Bell className="h-4 w-4 mr-2" />
            Stay tuned
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            Be the first to know when meetups go live.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetups;
