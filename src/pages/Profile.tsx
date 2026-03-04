import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Sparkles, Bell, Crown, Heart, Info, Mail, Shield, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // TODO: Replace with actual auth check
  const isSignedIn = false;
  const userName = isSignedIn ? 'User Name' : 'Mysterious Explorer';
  const userSubtitle = isSignedIn ? 'Welcome back!' : 'Lurking in the shadows... for now';

  const menuItems = [
    { label: 'Favorites', icon: Heart, path: '/favorites', color: 'text-pink-500' },
    { label: 'About Us', icon: Info, path: '/about', color: 'text-blue-500' },
    { label: 'Contact Us', icon: Mail, path: '/contact', color: 'text-green-500' },
    { label: 'Privacy Policy', icon: Shield, path: '/privacy', color: 'text-purple-500' },
    { label: 'Terms & Conditions', icon: FileText, path: '/terms', color: 'text-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-900">Profile</h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* User Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
            {/* Avatar */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="relative bg-gradient-to-br from-orange-100 to-pink-100 p-5 rounded-full">
                <User className="h-10 w-10 text-orange-500" />
              </div>
              {!isSignedIn && (
                <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500" />
              )}
            </div>

            {/* Name & Status */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">{userName}</h2>
            <p className="text-sm text-gray-500 mb-4">{userSubtitle}</p>

            {!isSignedIn && (
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                Ghost Mode Activated
              </div>
            )}
          </div>

          {/* Coming Soon Features */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h3 className="font-semibold text-gray-900">Coming Soon</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Sign in to save your adventures across devices
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Earn badges as you explore Bangalore
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">✓</span>
                Get personalized recommendations
              </li>
            </ul>
            <Button 
              className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              onClick={() => {}}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify me when ready
            </Button>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                    index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Happ'nin Bangalore - Your city, your adventures
            </p>
            <p className="text-xs text-gray-300 mt-1">
              © {new Date().getFullYear()} Happenings
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
