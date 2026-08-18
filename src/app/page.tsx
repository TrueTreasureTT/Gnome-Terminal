'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { writeServerFile } from '../actions/fs'; // Import Server Action

// ... existing state & interfaces ...

export default function TerminalPage(): JSX.Element {
  // ... existing hooks ...

  // Example: Persisting content when redirection ('>' or '>>') is executed
  const handleCommandExecution = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    const entryId = Math.random().toString(36).substring(2, 9);
    const displayPath = getDisplayPath(currentPath);

    // Parsing redirection '>'
    if (trimmed.includes('>')) {
      const parts = trimmed.split('>');
      const rawText = parts[0].trim().replace(/^echo\s+/, ''); // basic echo strip
      const targetFileName = parts[1].trim();

      const fullVirtualPath = [...currentPath, targetFileName].join('/');

      // Call Server Action to write to disk asynchronously
      const result = await writeServerFile(fullVirtualPath, rawText);

      const resultOutput = result.success ? (
        <p className="text-zinc-400 text-xs font-mono">
          [ VFS &amp; Server Disk Updated: '{targetFileName}' ]
        </p>
      ) : (
        <p className="text-red-400 text-xs font-mono">
          [ Disk Sync Error: {result.message} ]
        </p>
      );

      setHistory((prev) => [
        ...prev,
        { id: entryId, command: trimmed, output: resultOutput, path: displayPath },
      ]);
      return;
    }

    // ... handle other commands (cd, pwd, clear, etc.) ...
  };

  return (
    // ... terminal layout JSX ...
    null
  );
}
