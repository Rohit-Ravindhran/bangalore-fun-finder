
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      toast({
        title: "Installation not available",
        description: "Your browser doesn't support app installation or the app is already installed.",
        duration: 3000,
      });
      return;
    }

    installPromptEvent.prompt();

    installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
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
      setInstallPromptEvent(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) {
    return (
      <div className="fixed bottom-24 right-6">
        <Button
          onClick={handleInstallClick}
          className="rounded-full h-12 w-12 bg-w2d-teal shadow-lg flex items-center justify-center"
          title="Install app"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
    );
  }

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
