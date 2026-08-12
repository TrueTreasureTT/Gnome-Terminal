import type { Metadata } from 'next';
import React from 'react';
import { Providers } from '@/components/providers/query-provider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'GNOME Terminal 26.04 LTS',
  description: 'Ubuntu Terminal Emulator Clone - Built with Next.js & React',
  keywords: ['terminal', 'ubuntu', 'gnome', 'emulator', 'cli'],
  authors: [{ name: 'Terminal Clone Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-terminal-dark text-terminal-fg font-mono">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
