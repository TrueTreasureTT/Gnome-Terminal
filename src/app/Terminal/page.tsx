'use client';

import React, { useState, useEffect } from 'react';
import { loadServerFS, FSNode } from '../actions/fs';

const HOME_PATH = ['home', 'user'];

export default function TerminalPage(): JSX.Element {
  const [fileSystem, setFileSystem] = useState<FSNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load disk filesystem structure on component mount
  useEffect(() => {
    async function initFS() {
      try {
        const initialTree = await loadServerFS();
        setFileSystem(initialTree);
      } catch (err) {
        console.error('Failed to load server FS:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initFS();
  }, []);

  if (isLoading || !fileSystem) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <p className="animate-pulse">$ Mounting server filesystem...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-4 font-mono">
      <div className="border border-green-500/40 p-4 rounded bg-zinc-950">
        <p className="text-green-400">$ tree /home/user</p>
        <pre className="text-xs text-zinc-300 mt-2">
          {JSON.stringify(fileSystem.children?.home?.children?.user?.children, null, 2)}
        </pre>
      </div>
    </div>
  );
}
