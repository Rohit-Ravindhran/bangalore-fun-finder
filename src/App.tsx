
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityTable from "./pages/ActivityTable";
import Admin from "./pages/Admin";
import ActivityAddFromBMS from "./pages/ActivityAddFromBMS";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // 👇 Hide the Lovable badge on app load
  React.useEffect(() => {
    const badge = document.getElementById("lovable-badge");
    if (badge) {
      badge.style.display = "none";
    }
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/activities/table" element={<ActivityTable />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/bms-import" element={<ActivityAddFromBMS />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
