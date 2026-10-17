import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { GarageProvider } from '@/context/GarageContext';
import { PWAProvider } from '@/context/PWAContext';
import { InstallAppBanner } from '@/components/common/InstallAppBanner';
import { InstallAppModal } from '@/components/modals/InstallAppModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WebRajya My Garage — Vehicle Management System',
  description:
    'WebRajya My Garage vehicle management system for tracking vehicles, document locker, service logs, insurance, challans, and expiry reminders.',
  keywords: [
    'WebRajya',
    'My Garage',
    'Vehicle Management System',
    'Document Locker',
    'Service History Tracker',
    'Insurance & Reminders',
    'Challans',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'My Garage',
  },
};

// Responsive Viewport Configuration for Mobile & Desktop
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#08192E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <ToastProvider>
          <PWAProvider>
            <GarageProvider>
              {children}
              <InstallAppBanner />
              <InstallAppModal />
            </GarageProvider>
          </PWAProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

