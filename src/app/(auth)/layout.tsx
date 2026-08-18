import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-black text-terminal-fg flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className="max-w-md w-full border border-terminal-primary/40 rounded-lg overflow-hidden bg-terminal-dark shadow-2xl shadow-terminal-primary/10">
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-terminal-primary/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer inline-block transition-colors"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer inline-block transition-colors"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer inline-block transition-colors"></span>
          </div>
          <span className="text-xs text-zinc-400 font-sans font-medium tracking-wide">
            user@gnome-terminal: ~ (auth)
          </span>
          <div className="w-12"></div>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-terminal-primary tracking-tight mb-1">
              GNOME Terminal
            </h1>
            <p className="text-terminal-fg/60 text-xs">
              Authentication & System Access v3.14.02
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
