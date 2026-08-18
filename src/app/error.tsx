'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    console.error('[CRITICAL_SYSTEM_ERROR]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className="max-w-2xl w-full border border-red-900/80 rounded-lg overflow-hidden bg-black/95 shadow-2xl shadow-red-950/40">
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-red-900/40">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-zinc-700 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-zinc-700 inline-block"></span>
          </div>
          <span className="text-xs text-red-400 font-sans font-medium tracking-wide">
            systemd: process exit error (exit code 1)
          </span>
          <div className="w-12"></div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-red-400 text-sm">$ systemctl status shell-process.service</p>
            <h1 className="text-2xl font-bold text-red-500 tracking-tight">
              [FATAL] UNHANDLED RUNTIME EXCEPTION
            </h1>
          </div>

          <div className="bg-red-950/20 border border-red-900/50 p-4 rounded text-sm space-y-2 text-red-300 overflow-x-auto">
            <p className="font-semibold text-red-400">
              &gt; {error.message || 'An unexpected fault interrupted process execution.'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500/80">
                Digest ID: <span className="underline">{error.digest}</span>
              </p>
            )}
            <p className="text-xs text-zinc-500 pt-2 border-t border-red-900/30">
              System stack dumped. Use 'reset' to reload the application context or navigate home.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 bg-red-600 hover:bg-red-500 text-black font-bold py-2.5 px-4 rounded transition-colors text-sm"
            >
              $ systemctl restart
            </button>
            <Link
              href="/"
              className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold py-2.5 px-4 rounded transition-colors text-center text-sm"
            >
              $ cd /home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
