import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { GarageProvider } from '@/context/GarageContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nandan Travels — Express Fleet & Vehicle Management System',
  description:
    'Nandan Travels commercial fleet management system for tracking vehicles, trip sheets, driver duty rosters, document locker, service logs, and e-challans.',
  keywords: [
    'Nandan Travels',
    'MP22 Fleet Management',
    'Vehicle Management System',
    'Commercial Fleet',
    'Trip Duty Logger',
    'Document Locker',
    'Service History Tracker',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nandan Travels',
  },
};

// Responsive Viewport Configuration for Mobile & Desktop
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
          <GarageProvider>{children}</GarageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
