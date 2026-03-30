'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Utensils, Sparkles, Bell, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Food: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Food</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-amber-200 rounded-full animate-ping opacity-20" />
            <div className="relative bg-amber-100 p-6 rounded-full">
              <Utensils className="h-12 w-12 text-amber-500" />
            </div>
            <ChefHat className="absolute -top-2 -right-2 h-6 w-6 text-amber-600 animate-bounce" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Coming Soon!
          </div>

          {/* Fun Headline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Food Spots
          </h2>

          {/* Curious Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Discover great places to eat around Bangalore — from popular cafés and breweries to local favourites and hidden food spots.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            We're building a curated guide to help you quickly find where to eat, what to try, and where to go next.
          </p>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              On the menu
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✓</span>
                Hidden gems only locals know about
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✓</span>
                "Worth the drive" spots for weekend food trips
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✓</span>
                Late night munchies? We've mapped them all
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">✓</span>
                Food crawl routes - because one spot is never enough
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-6"
            onClick={() => {}}
          >
            <Bell className="h-4 w-4 mr-2" />
            Stay tuned
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            First dibs on food discoveries. Zero spam, 100% flavor 🌶️
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Food;
