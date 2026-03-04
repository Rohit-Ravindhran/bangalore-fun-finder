import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Sparkles, Bell, PartyPopper } from 'lucide-react';
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
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PartyPopper className="h-4 w-4" />
            Coming Soon!
          </div>

          {/* Fun Headline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Squad Goals Loading... 🎯
          </h2>

          {/* Curious Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Tired of scrolling through boring group chats? We're building something 
            <span className="font-semibold text-purple-600"> actually fun</span>. 
            Think book clubs that actually read, hiking groups that don't bail, 
            and coding meetups with free pizza. 🍕
          </p>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              What's cooking?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Find your tribe based on vibes, not just interests
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                RSVP and actually show up (we'll remind you, nicely)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Host your own meetup and become the main character
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                No awkward silences - we'll give you conversation starters
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-6"
            onClick={() => {}}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notify me when it's ready
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            Be the first to know. No spam, pinky promise 🤙
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Meetups;
