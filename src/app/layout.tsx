import type { Metadata, Viewport } from 'next';
import { Ubuntu_Mono } from 'next/font/google';
import React from 'react';
import { Providers } from '@/components/providers/query-provider';
import '@/app/globals.css';

const ubuntuMono = Ubuntu_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu-mono',
});

export const metadata: Metadata = {
  title: 'GNOME Terminal 26.04 LTS',
  description: 'Ubuntu Terminal Emulator Clone - Built with Next.js & React',
  keywords: ['terminal', 'ubuntu', 'gnome', 'emulator', 'cli'],
  authors: [{ name: 'Terminal Clone Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0c0c',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className={ubuntuMono.variable} suppressHydrationWarning>
      <body className="bg-terminal-dark text-terminal-fg font-mono antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
