'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isInstallModalOpen: boolean;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  installApp: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  dismissBanner: () => void;
  isBannerDismissed: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

const BANNER_STORAGE_KEY = 'nandan_pwa_banner_dismissed';

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(true); // Default true until checked

  // Initialize PWA detection, service worker, and events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Read banner dismissed state
    try {
      const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
      setIsBannerDismissed(dismissed === 'true');
    } catch {
      setIsBannerDismissed(false);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.addEventListener('statechange', () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[PWA] New content is available; please refresh.');
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[PWA] ServiceWorker registration failed: ', err);
          });
      });
    }

    // Handle beforeinstallprompt event (Chrome, Edge, Samsung Internet, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
      try {
        localStorage.setItem(BANNER_STORAGE_KEY, 'true');
      } catch {}
      console.log('[PWA] App successfully installed on device!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const openInstallModal = useCallback(() => {
    setIsInstallModalOpen(true);
  }, []);

  const closeInstallModal = useCallback(() => {
    setIsInstallModalOpen(false);
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    } catch {}
  }, []);

  const installApp = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) {
      // If no native prompt available (e.g. iOS or already installed or unsupported desktop)
      openInstallModal();
      return 'unavailable';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setIsInstallModalOpen(false);
      }
      return choice.outcome;
    } catch (err) {
      console.error('[PWA] Error prompting installation:', err);
      openInstallModal();
      return 'unavailable';
    }
  }, [deferredPrompt, openInstallModal]);

  const canInstall = !isInstalled && !isStandalone && (!!deferredPrompt || isIOS);

  return (
    <PWAContext.Provider
      value={{
        canInstall,
        isInstalled,
        isStandalone,
        isIOS,
        isInstallModalOpen,
        openInstallModal,
        closeInstallModal,
        installApp,
        dismissBanner,
        isBannerDismissed,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
