
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the app is running in standalone mode
    const checkStandalone = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                (window.navigator as any).standalone || 
                                document.referrer.includes('android-app://');
      setIsStandalone(isInStandaloneMode);
    };
    
    checkStandalone();

    const handler = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: "App installed successfully!",
        description: "Thanks for installing our app!",
        duration: 3000,
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [toast]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast({
            title: "Installation started",
            description: "Thanks for installing our app!",
            duration: 3000,
          });
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
      });
    } else {
      // Show alternative instructions for browsers that don't support installation
      toast({
        title: "Installation",
        description: "To install this app, open in Chrome browser menu > 'Add to Home screen'",
        duration: 5000,
      });
    }
  };

  // Don't show anything if already installed in standalone mode
  if (isStandalone) {
    return null;
  }

  // Don't show button if it's not installable
  if (!isInstallable) {
    return null;
  }

  // Fixed installation button/banner based on installability
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">Install What2Do Bangalore</h3>
          <p className="text-sm text-gray-600">Add to home screen for the best experience</p>
        </div>
        <Button onClick={handleInstallClick}>
          <Download className="h-4 w-4 mr-2" />
          Install
        </Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
