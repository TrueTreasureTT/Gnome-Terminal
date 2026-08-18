import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home(): JSX.Element {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-zinc-300 flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className="max-w-4xl w-full border border-green-500/40 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl shadow-green-500/10">
        {/* GNOME Header Bar */}
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-green-500/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer inline-block transition-colors" />
          </div>
          <span className="text-xs text-zinc-400 font-sans font-medium tracking-wide">
            user@gnome-terminal: ~ (index.tsx)
          </span>
          <div className="w-12" />
        </div>

        {/* Main Landing Workspace */}
        <div className="p-6 md:p-10 space-y-8">
          <div className="space-y-3">
            <p className="text-green-400 text-sm">$ neofetch --release</p>
            <h1 className="text-4xl md:text-6xl font-bold text-green-400 tracking-tight">
              GNOME Terminal 26.04 LTS
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Ubuntu Web Terminal Emulator — Built with Next.js Pages Router
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-black/80 border border-green-500/40 rounded-md">
              <h2 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span>[FEATURES]</span>
              </h2>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> VFS Directory Navigation (`cd`, `mkdir`, `rmdir`)</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Built-in GNU Nano File Editor</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> File Redirection (`&gt;` and `&gt;&gt;`)</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Interactive Shell &amp; Execution Buffer</li>
              </ul>
            </div>

            <div className="p-5 bg-black/80 border border-emerald-500/40 rounded-md">
              <h2 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <span>[ROUTER_STATUS]</span>
              </h2>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> Route: <code className="text-green-400">/pages/index.tsx</code></li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> Router Hook: <code className="text-green-400">next/router</code></li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">→</span> Active Path: <code className="text-green-400">{router.pathname}</code></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => router.push('/terminal')}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-mono font-bold px-8 py-3 rounded transition-colors"
            >
              $ launch --terminal
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
