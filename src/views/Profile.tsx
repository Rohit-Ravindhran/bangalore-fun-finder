'use client'

import React from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { 
  ArrowLeft, User, Sparkles, Bell, Heart, Info, Mail, Shield, FileText, 
  ChevronRight, MapPin, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Profile: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    { label: 'My Favorites', icon: Heart, path: '/favorites', color: 'bg-pink-50 text-pink-600' },
    { label: 'Share App', icon: Share2, action: () => {
      if (navigator.share) {
        navigator.share({ title: "Happ'nin Bangalore", url: window.location.origin });
      }
    }, color: 'bg-blue-50 text-blue-600' },
  ];

  const menuItems = [
    { label: 'About Us', icon: Info, path: '/about', color: 'text-blue-500' },
    { label: 'Contact Us', icon: Mail, path: '/contact', color: 'text-green-500' },
    { label: 'Privacy Policy', icon: Shield, path: '/privacy', color: 'text-purple-500' },
    { label: 'Terms & Conditions', icon: FileText, path: '/terms', color: 'text-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Profile</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Guest User</h2>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> Bangalore
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return action.path ? (
                <Link
                  key={action.label}
                  href={action.path}
                  className={`${action.color} rounded-xl p-4 flex items-center gap-3`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{action.label}</span>
                </Link>
              ) : (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={`${action.color} rounded-xl p-4 flex items-center gap-3`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Sign In Coming Soon</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Save favorites across devices and get personalized recommendations.
            </p>
            <Button 
              size="sm"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs"
            >
              <Bell className="h-3 w-3 mr-1.5" />
            Stay tuned
            </Button>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 ${
                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Happ'nin Bangalore v1.0.0
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
