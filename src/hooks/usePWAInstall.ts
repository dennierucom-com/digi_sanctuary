import { useState, useEffect, useRef } from 'react';

// The beforeinstallprompt event is not formally in the TS DOM lib yet
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      // Update UI to show the install button
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt.current = null;
      setIsInstallable(false);
      setIsInstalled(true);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt.current) {
      return;
    }
    
    // Show the install prompt
    await deferredPrompt.current.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.current.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt.current = null;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  return { isInstallable, promptInstall, isInstalled };
};
