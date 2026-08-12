import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-fg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-terminal-primary font-mono mb-2">GNOME Terminal</h1>
          <p className="text-terminal-fg/60 font-mono text-sm">User Authentication System</p>
        </div>
        {children}
      </div>
    </div>
  );
}
