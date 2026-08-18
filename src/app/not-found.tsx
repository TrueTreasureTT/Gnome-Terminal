import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen bg-black text-terminal-fg flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className="max-w-2xl w-full border border-terminal-primary/40 rounded-lg overflow-hidden bg-terminal-dark shadow-2xl shadow-terminal-primary/10">
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-terminal-primary/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer inline-block transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer inline-block transition-colors" />
          </div>
          <span className="text-xs text-zinc-400 font-sans font-medium tracking-wide">
            user@gnome-terminal: ~ (404_not_found)
          </span>
          <div className="w-12" />
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-terminal-primary text-sm">$ cd /requested-path</p>
            <h1 className="text-3xl font-bold text-terminal-error tracking-tight">
              404: COMMAND_NOT_FOUND
            </h1>
          </div>

          <div className="bg-black/90 border border-terminal-error/40 p-4 rounded text-sm space-y-2 text-terminal-error overflow-x-auto">
            <p className="font-semibold">
              bash: cd: /requested-path: No such file or directory
            </p>
            <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
              Process exited with status 127. Target directory or route does not exist on this system.
            </p>
          </div>

          <p className="text-zinc-400 text-sm">
            The resource you attempted to locate could not be resolved by the shell router.
          </p>

          <div className="pt-2">
            <Link href="/" className="block">
              <Button className="w-full bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold py-2.5 transition-colors">
                $ cd /home (Return Home)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
