'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-terminal-dark text-terminal-fg flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-terminal-primary font-mono">
            GNOME Terminal 26.04 LTS
          </h1>
          <p className="text-xl text-terminal-fg/80 font-mono">
            Ubuntu Terminal Emulator Clone - Built with Next.js & React
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
          <div className="p-6 bg-terminal-light border-2 border-terminal-primary rounded-lg">
            <h2 className="text-2xl font-bold text-terminal-primary mb-2 font-mono">Features</h2>
            <ul className="text-left text-terminal-fg/80 space-y-2 font-mono text-sm">
              <li>✓ Full terminal emulation</li>
              <li>✓ Command execution</li>
              <li>✓ File system navigation</li>
              <li>✓ Multi-language support</li>
              <li>✓ Theme customization</li>
            </ul>
          </div>

          <div className="p-6 bg-terminal-light border-2 border-terminal-secondary rounded-lg">
            <h2 className="text-2xl font-bold text-terminal-secondary mb-2 font-mono">
              Technologies
            </h2>
            <ul className="text-left text-terminal-fg/80 space-y-2 font-mono text-sm">
              <li>→ TypeScript</li>
              <li>→ Next.js 14</li>
              <li>→ React 18</li>
              <li>→ Tailwind CSS</li>
              <li>→ PostgreSQL</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login">
            <Button className="bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold px-8 py-2">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              className="border-2 border-terminal-primary text-terminal-primary hover:bg-terminal-primary hover:text-black font-mono font-bold px-8 py-2"
            >
              Register
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-terminal-primary/30">
          <p className="text-terminal-fg/60 font-mono text-sm">
            user@ubuntu-terminal:~$ Welcome to GNOME Terminal Clone
          </p>
        </div>
      </div>
    </main>
  );
}
