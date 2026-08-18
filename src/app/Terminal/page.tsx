'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  path: string;
}

const INITIAL_FS: Record<string, string> = {
  'about.txt': 'GNOME Terminal Clone v3.14.02 LTS\nBuilt with Next.js App Router, TypeScript, and Tailwind CSS.\nAuthor: Terminal Clone Team',
  'system.log': '[INFO] System booted successfully.\n[INFO] Session initialized for user@ubuntu.\n[WARN] Sudo privilege escalation disabled for guest session.',
  'welcome.sh': '#!/bin/bash\necho "Welcome to the web terminal emulator!"',
};

export default function TerminalPage(): JSX.Element {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init-1',
      command: 'neofetch',
      path: '~',
      output: (
        <div className="text-xs sm:text-sm font-mono space-y-1 text-terminal-primary">
          <p className="font-bold text-terminal-secondary">
            user@gnome-terminal
          </p>
          <p>-------------------</p>
          <p><span className="font-bold text-zinc-400">OS:</span> Ubuntu 26.04 LTS x86_64</p>
          <p><span className="font-bold text-zinc-400">Host:</span> Web-Terminal Container v3.14.02</p>
          <p><span className="font-bold text-zinc-400">Kernel:</span> 6.8.0-42-generic</p>
          <p><span className="font-bold text-zinc-400">Uptime:</span> 13 mins</p>
          <p><span className="font-bold text-zinc-400">Shell:</span> bash 5.2.21</p>
          <p><span className="font-bold text-zinc-400">Terminal:</span> gnome-terminal-emulator</p>
          <p className="pt-2 text-zinc-400">Type <span className="text-terminal-primary font-bold">'help'</span> to view available commands.</p>
        </div>
      ),
    },
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch']);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [currentPath, setCurrentPath] = useState('~');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommandExecution = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    const entryId = Math.random().toString(36).substring(2, 9);

    if (!trimmed) {
      setHistory((prev) => [
        ...prev,
        { id: entryId, command: '', output: null, path: currentPath },
      ]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    const args = trimmed.split(' ');
    const mainCmd = args[0].toLowerCase();
    const cmdArgs = args.slice(1);

    let resultOutput: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        resultOutput = (
          <div className="space-y-1 text-sm text-zinc-300 font-mono">
            <p className="text-terminal-primary font-bold">Available Commands:</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">help</span> - Display system help and command reference</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">clear</span> - Clear terminal screen buffer</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">ls</span> - List files in current directory</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">cat [file]</span> - Output content of specified file</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">echo [txt]</span> - Print string to standard output</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">whoami</span> - Display active shell username</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">date</span> - Print system date and time</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">pwd</span> - Output current working directory</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">neofetch</span> - Show system configuration overview</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">sudo</span> - Run command with elevated privileges</p>
            <p><span className="text-terminal-secondary w-24 inline-block font-bold">exit</span> - Terminate shell session and return home</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'ls':
        resultOutput = (
          <div className="flex flex-wrap gap-4 text-sm font-mono">
            {Object.keys(INITIAL_FS).map((filename) => (
              <span key={filename} className="text-terminal-primary font-semibold">
                {filename}
              </span>
            ))}
            <span className="text-terminal-info font-bold">projects/</span>
            <span className="text-terminal-info font-bold">downloads/</span>
          </div>
        );
        break;

      case 'cat':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">cat: missing operand file target</p>;
        } else if (INITIAL_FS[cmdArgs[0]]) {
          resultOutput = <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">{INITIAL_FS[cmdArgs[0]]}</pre>;
        } else {
          resultOutput = <p className="text-terminal-error">cat: {cmdArgs[0]}: No such file or directory</p>;
        }
        break;

      case 'echo':
        resultOutput = <p className="text-zinc-200">{cmdArgs.join(' ')}</p>;
        break;

      case 'whoami':
        resultOutput = <p className="text-terminal-primary font-bold">user@gnome-terminal</p>;
        break;

      case 'pwd':
        resultOutput = <p className="text-zinc-300">/home/user{currentPath === '~' ? '' : `/${currentPath}`}</p>;
        break;

      case 'date':
        resultOutput = <p className="text-zinc-300">{new Date().toString()}</p>;
        break;

      case 'neofetch':
        resultOutput = (
          <div className="text-xs sm:text-sm font-mono space-y-1 text-terminal-primary">
            <p className="font-bold text-terminal-secondary">user@gnome-terminal</p>
            <p>-------------------</p>
            <p><span className="font-bold text-zinc-400">OS:</span> Ubuntu 26.04 LTS x86_64</p>
            <p><span className="font-bold text-zinc-400">Host:</span> Web-Terminal Container v3.14.02</p>
            <p><span className="font-bold text-zinc-400">Kernel:</span> 6.8.0-42-generic</p>
            <p><span className="font-bold text-zinc-400">Shell:</span> bash 5.2.21</p>
          </div>
        );
        break;

      case 'sudo':
        resultOutput = (
          <p className="text-terminal-error font-mono">
            [sudo] password for user: <br />
            user is not in the sudoers file. This incident will be reported.
          </p>
        );
        break;

      case 'exit':
        router.push('/');
        return;

      default:
        resultOutput = (
          <p className="text-terminal-error">
            bash: {mainCmd}: command not found. Type 'help' for available options.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: entryId,
        command: trimmed,
        output: resultOutput,
        path: currentPath,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandExecution(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyPointer === -1 ? cmdHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIndex);
      setInput(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextIndex = historyPointer + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryPointer(-1);
        setInput('');
      } else {
        setHistoryPointer(nextIndex);
        setInput(cmdHistory[nextIndex] || '');
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="min-h-screen bg-black text-terminal-fg flex flex-col justify-between p-2 sm:p-4 font-mono select-none cursor-text"
    >
      <div className="w-full max-w-6xl mx-auto border border-terminal-primary/40 rounded-lg overflow-hidden bg-terminal-dark shadow-2xl flex flex-col flex-1 min-h-[90vh]">
        {/* GNOME Header Window Control Bar */}
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-terminal-primary/20 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); router.push('/'); }}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
              title="Close Session"
            />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-xs text-zinc-400 font-sans font-medium tracking-wide">
            user@gnome-terminal: {currentPath}
          </span>
          <div className="text-xs text-zinc-500 font-mono">bash</div>
        </div>

        {/* Terminal Output Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 font-mono text-sm">
          {history.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-terminal-primary font-bold">user@gnome-terminal:{entry.path}$</span>
                <span className="text-zinc-100">{entry.command}</span>
              </div>
              {entry.output && <div className="pl-2 pt-1">{entry.output}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-terminal-primary font-bold whitespace-nowrap">
              user@gnome-terminal:{currentPath}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-sm p-0 focus:ring-0 focus:border-none"
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
