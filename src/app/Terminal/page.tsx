'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  path: string;
}

interface NanoState {
  name: string;
  content: string;
}

export default function TerminalPage(): JSX.Element {
  const router = useRouter();

  // Dynamic Virtual File System
  const [fileSystem, setFileSystem] = useState<Record<string, string>>({
    'about.txt': 'GNOME Terminal Clone v3.14.02 LTS\nBuilt with Next.js App Router, TypeScript, and Tailwind CSS.\nAuthor: Terminal Clone Team',
    'system.log': '[INFO] System booted successfully.\n[INFO] Session initialized for user@ubuntu.\n[WARN] Sudo privilege escalation disabled for guest session.',
    'welcome.sh': '#!/bin/bash\necho "Welcome to the web terminal emulator!"',
  });

  // Nano Editor State
  const [nanoFile, setNanoFile] = useState<NanoState | null>(null);
  const [nanoNotification, setNanoNotification] = useState<string | null>(null);

  // Terminal Stream State
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init-1',
      command: 'neofetch',
      path: '~',
      output: (
        <div className="text-xs sm:text-sm font-mono space-y-1 text-terminal-primary">
          <p className="font-bold text-terminal-secondary">user@gnome-terminal</p>
          <p>-------------------</p>
          <p><span className="font-bold text-zinc-400">OS:</span> Ubuntu 26.04 LTS x86_64</p>
          <p><span className="font-bold text-zinc-400">Host:</span> Web-Terminal Container v3.14.02</p>
          <p><span className="font-bold text-zinc-400">Features:</span> Nano File Editor, &gt; / &gt;&gt; Redirection</p>
          <p className="pt-2 text-zinc-400">Type <span className="text-terminal-primary font-bold">'help'</span> for available commands.</p>
        </div>
      ),
    },
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch']);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [currentPath] = useState('~');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleContainerClick = () => {
    if (!nanoFile) inputRef.current?.focus();
  };

  // --- NANO EDITOR CONTROLS ---
  const handleNanoSave = () => {
    if (!nanoFile) return;
    setFileSystem((prev) => ({
      ...prev,
      [nanoFile.name]: nanoFile.content,
    }));
    setNanoNotification(`[ Wrote ${nanoFile.content.split('\n').length} lines to ${nanoFile.name} ]`);
    setTimeout(() => setNanoNotification(null), 2500);
  };

  const handleNanoExit = () => {
    if (!nanoFile) return;
    const exitFileName = nanoFile.name;
    setNanoFile(null);
    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: `nano ${exitFileName}`,
        output: <p className="text-zinc-400 text-xs">[ Closed nano editor session ]</p>,
        path: currentPath,
      },
    ]);
  };

  const handleNanoKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + O: WriteOut / Save
    if (e.ctrlKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      handleNanoSave();
    }
    // Ctrl + X: Exit
    if (e.ctrlKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      handleNanoExit();
    }
  };

  // --- COMMAND INTERPRETER & REDIRECTION PARSER ---
  const handleCommandExecution = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    const entryId = Math.random().toString(36).substring(2, 9);

    if (!trimmed) {
      setHistory((prev) => [...prev, { id: entryId, command: '', output: null, path: currentPath }]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryPointer(-1);

    // Parse Output Redirection (> or >>)
    let executionCmd = trimmed;
    let redirectTarget: string | null = null;
    let isAppend = false;

    if (trimmed.includes('>>')) {
      const parts = trimmed.split('>>');
      executionCmd = parts[0].trim();
      redirectTarget = parts[1].trim();
      isAppend = true;
    } else if (trimmed.includes('>')) {
      const parts = trimmed.split('>');
      executionCmd = parts[0].trim();
      redirectTarget = parts[1].trim();
      isAppend = false;
    }

    const args = executionCmd.split(' ');
    const mainCmd = args[0].toLowerCase();
    const cmdArgs = args.slice(1);

    let resultOutput: React.ReactNode = null;
    let rawTextOutput: string | null = null;

    switch (mainCmd) {
      case 'help':
        resultOutput = (
          <div className="space-y-1 text-sm text-zinc-300 font-mono">
            <p className="text-terminal-primary font-bold">Available Commands:</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">nano [file]</span> - Open GNU nano file editor</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">cat [file]</span> - Display file contents</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">echo [text]</span> - Output string or redirect to file (&gt;, &gt;&gt;)</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">ls</span> - List files in current directory</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">clear</span> - Clear output buffer</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">pwd</span> - Print working directory</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">whoami</span> - Display shell identity</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">exit</span> - Terminate shell session</p>
          </div>
        );
        break;

      case 'nano':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">nano: filename parameter required</p>;
        } else {
          const fileName = cmdArgs[0];
          setNanoFile({
            name: fileName,
            content: fileSystem[fileName] || '',
          });
          return;
        }
        break;

      case 'ls':
        resultOutput = (
          <div className="flex flex-wrap gap-4 text-sm font-mono">
            {Object.keys(fileSystem).map((filename) => (
              <span key={filename} className="text-terminal-primary font-semibold">
                {filename}
              </span>
            ))}
          </div>
        );
        break;

      case 'cat':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">cat: missing file operand</p>;
        } else if (fileSystem[cmdArgs[0]] !== undefined) {
          rawTextOutput = fileSystem[cmdArgs[0]];
          resultOutput = <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">{rawTextOutput}</pre>;
        } else {
          resultOutput = <p className="text-terminal-error">cat: {cmdArgs[0]}: No such file or directory</p>;
        }
        break;

      case 'echo':
        rawTextOutput = cmdArgs.join(' ');
        resultOutput = <p className="text-zinc-200">{rawTextOutput}</p>;
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'pwd':
        rawTextOutput = `/home/user${currentPath === '~' ? '' : `/${currentPath}`}`;
        resultOutput = <p className="text-zinc-300">{rawTextOutput}</p>;
        break;

      case 'whoami':
        rawTextOutput = 'user@gnome-terminal';
        resultOutput = <p className="text-terminal-primary font-bold">{rawTextOutput}</p>;
        break;

      case 'exit':
        router.push('/');
        return;

      default:
        resultOutput = (
          <p className="text-terminal-error">
            bash: {mainCmd}: command not found. Type 'help' for options.
          </p>
        );
    }

    // Process Redirection write if target exists and raw text output was generated
    if (redirectTarget && rawTextOutput !== null) {
      setFileSystem((prev) => {
        const existing = prev[redirectTarget!] || '';
        const updated = isAppend
          ? existing ? `${existing}\n${rawTextOutput}` : rawTextOutput!
          : rawTextOutput!;
        return { ...prev, [redirectTarget!]: updated };
      });

      resultOutput = (
        <p className="text-zinc-400 text-xs font-mono">
          [ Output redirected to '{redirectTarget}' ({isAppend ? 'append' : 'overwrite'}) ]
        </p>
      );
    }

    setHistory((prev) => [
      ...prev,
      { id: entryId, command: trimmed, output: resultOutput, path: currentPath },
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

  // --- RENDER NANO INTERFACE OVERLAY ---
  if (nanoFile) {
    return (
      <div className="min-h-screen bg-black text-zinc-200 flex flex-col p-2 sm:p-4 font-mono select-none">
        <div className="w-full max-w-6xl mx-auto border border-zinc-700 bg-black flex flex-col flex-1 min-h-[90vh] rounded-lg overflow-hidden">
          {/* Nano Top Header */}
          <div className="bg-zinc-200 text-black px-4 py-1 flex justify-between items-center font-bold text-xs font-mono">
            <span>GNU nano 7.2</span>
            <span>File: {nanoFile.name}</span>
            <span>{nanoNotification || 'Editing'}</span>
          </div>

          {/* Textarea Editor Workspace */}
          <textarea
            value={nanoFile.content}
            onChange={(e) => setNanoFile({ ...nanoFile, content: e.target.value })}
            onKeyDown={handleNanoKeyDown}
            className="flex-1 bg-black text-terminal-primary p-4 outline-none font-mono text-sm resize-none border-none focus:ring-0 leading-relaxed"
            spellCheck={false}
            autoFocus
          />

          {/* Nano Keybindings Footer */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-3 text-xs font-mono space-y-2">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleNanoSave}
                className="bg-terminal-primary hover:bg-terminal-secondary text-black font-bold px-3 py-1.5 rounded transition-colors"
              >
                ^O WriteOut (Save)
              </button>
              <button
                onClick={handleNanoExit}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold px-3 py-1.5 rounded transition-colors"
              >
                ^X Exit
              </button>
            </div>
            <p className="text-zinc-500 text-[11px]">
              Keyboard Shortcuts: <span className="text-terminal-primary">Ctrl + O</span> to Save | <span className="text-terminal-primary">Ctrl + X</span> to Exit
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN TERMINAL VIEW ---
  return (
    <div
      onClick={handleContainerClick}
      className="min-h-screen bg-black text-terminal-fg flex flex-col justify-between p-2 sm:p-4 font-mono select-none cursor-text"
    >
      <div className="w-full max-w-6xl mx-auto border border-terminal-primary/40 rounded-lg overflow-hidden bg-terminal-dark shadow-2xl flex flex-col flex-1 min-h-[90vh]">
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
