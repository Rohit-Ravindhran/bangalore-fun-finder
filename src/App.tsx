
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load page components for better code splitting
const Index = lazy(() => import("./pages/Index"));
const ActivityDetail = lazy(() => import("./pages/ActivityDetail"));
const ActivityTable = lazy(() => import("./pages/ActivityTable"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const ActivityAddFromBMS = lazy(() => import("./pages/ActivityAddFromBMS"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Meetups = lazy(() => import("./pages/Meetups"));
const Food = lazy(() => import("./pages/Food"));
const Network = lazy(() => import("./pages/Network"));
const Profile = lazy(() => import("./pages/Profile"));
const DayOut = lazy(() => import("./pages/DayOut"));
const DateIdeas = lazy(() => import("./pages/DateIdeas"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="flex justify-center items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // 👇 Hide the Lovable badge on app load
  React.useEffect(() => {
    const badge = document.getElementById("lovable-badge");
    if (badge) {
      badge.style.display = "none";
    }
  }, []);

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/activities/table" element={<ActivityTable />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/bms-import" element={
                <ProtectedRoute>
                  <ActivityAddFromBMS />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/meetups" element={<Meetups />} />
              <Route path="/food" element={<Food />} />
              <Route path="/network" element={<Network />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/day-out" element={<DayOut />} />
              <Route path="/date-ideas" element={<DateIdeas />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default App;
