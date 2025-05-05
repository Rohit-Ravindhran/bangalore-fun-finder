
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

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
      return;
    }

    installPromptEvent.prompt();

    installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPromptEvent(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">Install What2Do</h3>
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
