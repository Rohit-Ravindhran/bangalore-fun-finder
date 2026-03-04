import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles, Bell, Rocket, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Network: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Network</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-20" />
            <div className="relative bg-blue-100 p-6 rounded-full">
              <Globe className="h-12 w-12 text-blue-500" />
            </div>
            <Handshake className="absolute -top-2 -right-2 h-6 w-6 text-blue-600 animate-pulse" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Rocket className="h-4 w-4" />
            Coming Soon!
          </div>

          {/* Fun Headline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            LinkedIn, But Make It Fun 🔗
          </h2>

          {/* Curious Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Networking doesn't have to be awkward elevator pitches. We're building a space where you can
            <span className="font-semibold text-blue-600"> find co-founders, mentors, and that one person 
            who knows someone at your dream company</span>. All without the cringe!
          </p>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              The blueprint
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                Connect with people who actually reply to DMs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                Find founders, freelancers & folks in your industry
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                Skill swaps - teach what you know, learn what you don't
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                "Coffee chat" matching that doesn't feel forced
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6"
            onClick={() => {}}
          >
            <Bell className="h-4 w-4 mr-2" />
            Join the waitlist
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            Early access coming soon. Your network is your net worth 💎
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Network;
