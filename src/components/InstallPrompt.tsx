
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
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

    // Check if installation was previously dismissed
    const wasDismissed = localStorage.getItem('dismissedInstall');
    if (wasDismissed) {
      setDismissedPrompt(true);
    }

    const handler = (e: Event) => {
      console.log('beforeinstallprompt event triggered');
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
      console.log('No install prompt available');
      // Show alternative instructions for browsers that don't support installation
      toast({
        title: "Installation",
        description: "To install this app, open in Chrome browser menu > 'Add to Home screen'",
        duration: 5000,
      });
    }
  };

  const handleDismiss = () => {
    setDismissedPrompt(true);
    localStorage.setItem('dismissedInstall', 'true');
  };

  // Don't show anything if already installed in standalone mode or if dismissed
  if (isStandalone || dismissedPrompt) {
    return null;
  }

  // Show floating button if it's installable
  if (isInstallable) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <div className="bg-white rounded-full shadow-lg p-1 flex items-center animate-pulse-glow">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleInstallClick}
                  className="rounded-full bg-gradient-to-r from-w2d-yellow to-w2d-peach hover:from-w2d-yellow hover:to-w2d-peach/90 text-primary flex gap-1 items-center px-4 py-2 shadow-md"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  <span>📲 Add to phone</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs max-w-52">Install this app on your device for faster access and offline use</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 ml-1 rounded-full"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
