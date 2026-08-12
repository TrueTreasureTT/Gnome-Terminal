'use client';

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-error flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="border-2 border-terminal-error p-6 rounded">
          <h1 className="text-3xl font-bold mb-2 font-mono">ERROR</h1>
          <p className="text-terminal-error font-mono mb-4">{error.message || 'An unexpected error occurred'}</p>
          <div className="bg-black p-4 rounded text-terminal-error font-mono text-sm overflow-auto">
            <p>{error.digest && `Error ID: ${error.digest}`}</p>
          </div>
        </div>

        <button
          onClick={() => reset()}
          className="bg-terminal-primary hover:bg-terminal-secondary text-black font-mono font-bold px-6 py-2 rounded w-full"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
