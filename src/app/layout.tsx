import './globals.css';
import React from 'react';

export const metadata = {
  title: 'GNOME Terminal Clone',
  description: 'Ubuntu Web Terminal Emulator with VFS Support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-300 font-mono antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
