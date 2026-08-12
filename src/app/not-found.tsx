import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-fg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold text-terminal-error font-mono">404</h1>
          <h2 className="text-3xl font-bold text-terminal-primary font-mono">Page Not Found</h2>
        </div>

        <div className="bg-terminal-light border-2 border-terminal-error p-6 rounded font-mono">
          <p className="text-terminal-fg mb-4">user@ubuntu-terminal:~$ ls -la /this/path</p>
          <p className="text-terminal-error">bash: ls: cannot access '/this/path': No such file or directory</p>
        </div>

        <p className="text-terminal-fg/80 font-mono">The page you are looking for does not exist or has been removed.</p>

        <Link href="/">
          <Button className="bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold px-8 py-2 w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
