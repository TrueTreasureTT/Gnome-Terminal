'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'; // Fixed line 4 import for Pages Router

interface HistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  path: string;
}

interface FSNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FSNode>;
}

const HOME_PATH = ['home', 'user'];

const INITIAL_FS: FSNode = {
  type: 'directory',
  children: {
    home: {
      type: 'directory',
      children: {
        user: {
          type: 'directory',
          children: {
            'about.txt': {
              type: 'file',
              content: 'GNOME Terminal Clone v3.14.02 LTS\nBuilt with Next.js Pages Router & Tailwind CSS.',
            },
            projects: {
              type: 'directory',
              children: {},
            },
          },
        },
      },
    },
  },
};

export default function TerminalPage(): JSX.Element {
  const router = useRouter(); // Correctly bound to next/router

  const [fileSystem, setFileSystem] = useState<FSNode>(INITIAL_FS);
  const [currentPath, setCurrentPath] = useState<string[]>(HOME_PATH);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init-1',
      command: 'neofetch',
      path: '~',
      output: (
        <div className="text-xs sm:text-sm font-mono space-y-1 text-green-400">
          <p className="font-bold text-emerald-400">user@gnome-terminal</p>
          <p>-------------------</p>
          <p><span className="text-zinc-400 font-bold">OS:</span> Ubuntu 26.04 LTS x86_64</p>
          <p><span className="text-zinc-400 font-bold">Router:</span> Pages Router (next/router)</p>
          <p className="pt-2 text-zinc-400">Type <span className="text-green-400 font-bold">'help'</span> for options.</p>
        </div>
      ),
    },
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch']);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getDisplayPath = (path: string[]): string => {
    const fullPathStr = '/' + path.join('/');
    const homePathStr = '/' + HOME_PATH.join('/');
    if (fullPathStr === homePathStr) return '~';
    if (fullPathStr.startsWith(homePathStr + '/')) {
      return '~' + fullPathStr.slice(homePathStr.length);
    }
    return fullPathStr || '/';
  };

  const handleCommandExecution = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    const entryId = Math.random().toString(36).substring(2, 9);
    const displayPath = getDisplayPath(currentPath);

    if (!trimmed) {
      setHistory((prev) => [...prev, { id: entryId, command: '', output: null, path: displayPath }]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const args = trimmed.split(' ');
    const mainCmd = args[0].toLowerCase();
    let resultOutput: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        resultOutput = (
          <div className="space-y-1 text-sm text-zinc-300 font-mono">
            <p className="text-green-400 font-bold">Commands:</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">pwd</span> - Print working directory</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">clear</span> - Clear terminal buffer</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">exit</span> - Return to index landing page</p>
          </div>
        );
        break;

      case 'pwd':
        resultOutput = <p className="text-zinc-300">/{currentPath.join('/')}</p>;
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        router.push('/');
        return;

      default:
        resultOutput = <p className="text-red-400">bash: {mainCmd}: command not found. Type 'help'.</p>;
    }

    setHistory((prev) => [
      ...prev,
      { id: entryId, command: trimmed, output: resultOutput, path: displayPath },
    ]);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-screen bg-black text-zinc-200 flex flex-col justify-between p-2 sm:p-4 font-mono select-none cursor-text"
    >
      <div className="w-full max-w-6xl mx-auto border border-green-500/40 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl flex flex-col flex-1 min-h-[90vh]">
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-green-500/20">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/')} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-zinc-400 font-sans">{getDisplayPath(currentPath)}</span>
          <div className="text-xs text-zinc-500 font-mono">bash</div>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 font-mono text-sm">
          {history.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">user@gnome-terminal:{entry.path}$</span>
                <span className="text-zinc-100">{entry.command}</span>
              </div>
              {entry.output && <div className="pl-2 pt-1">{entry.output}</div>}
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <span className="text-green-400 font-bold whitespace-nowrap">
              user@gnome-terminal:{getDisplayPath(currentPath)}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommandExecution(input);
                  setInput('');
                }
              }}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-sm p-0 focus:ring-0"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
