
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import clarity from '@microsoft/clarity'
import App from './App.tsx'
import './index.css'

// Initialize Microsoft Clarity
const projectId = "udp6047ffc";
clarity.init(projectId);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for this duration
      gcTime: 30 * 60 * 1000, // 30 minutes - cache persists for this duration
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Prevent refetch when component remounts
      retry: 1, // Only retry once on failure
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
