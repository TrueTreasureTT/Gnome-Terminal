'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-black text-terminal-fg flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className="max-w-4xl w-full border border-terminal-primary/40 rounded-lg overflow-hidden bg-terminal-dark shadow-2xl shadow-terminal-primary/10">
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-terminal-primary/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer inline-block transition-colors" />
          </div>
          <span className="text-xs text-zinc-400 font-sans font-medium tracking-wide">
            user@gnome-terminal: ~ (welcome)
          </span>
          <div className="w-12" />
        </div>

        <div className="p-6 md:p-10 space-y-8">
          <div className="space-y-3">
            <p className="text-terminal-primary text-sm">$ neofetch --release</p>
            <h1 className="text-4xl md:text-6xl font-bold text-terminal-primary tracking-tight terminal-glow">
              GNOME Terminal 26.04 LTS
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Ubuntu Terminal Emulator Clone — Built with Next.js &amp; React
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-black/80 border border-terminal-primary/40 rounded-md">
              <h2 className="text-lg font-bold text-terminal-primary mb-3 flex items-center gap-2">
                <span>[FEATURES]</span>
              </h2>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-terminal-primary">✓</span> Full shell emulation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-primary">✓</span> Command execution &amp; history
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-primary">✓</span> Virtual file system navigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-primary">✓</span> Custom theme &amp; font styling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-primary">✓</span> Persistent session state
                </li>
              </ul>
            </div>

            <div className="p-5 bg-black/80 border border-terminal-secondary/40 rounded-md">
              <h2 className="text-lg font-bold text-terminal-secondary mb-3 flex items-center gap-2">
                <span>[TECH_STACK]</span>
              </h2>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-terminal-secondary">→</span> TypeScript &amp; React
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-secondary">→</span> Next.js (App Router)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-secondary">→</span> Tailwind CSS &amp; Shadcn UI
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-secondary">→</span> NextAuth.js Authentication
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terminal-secondary">→</span> PostgreSQL Database
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/terminal" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold px-8 py-2.5 transition-colors">
                $ launch --terminal
              </Button>
            </Link>
            <Link href="/login" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-terminal-primary text-terminal-primary hover:bg-terminal-primary hover:text-black font-mono font-bold px-8 py-2.5 transition-colors"
              >
                $ login
              </Button>
            </Link>
            <Link href="/register" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-terminal-secondary text-terminal-secondary hover:bg-terminal-secondary hover:text-black font-mono font-bold px-8 py-2.5 transition-colors"
              >
                $ useradd
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-terminal-primary/20 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
            <p>user@ubuntu-terminal:~$ Welcome to GNOME Terminal Clone</p>
            <p className="flex items-center gap-1">
              System Status: <span className="text-terminal-primary">● ONLINE</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
