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
  path: string[];
  content: string;
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
              content: 'GNOME Terminal Clone v3.14.02 LTS\nBuilt with Next.js App Router, TypeScript, and Tailwind CSS.\nAuthor: Terminal Clone Team',
            },
            'system.log': {
              type: 'file',
              content: '[INFO] System booted successfully.\n[INFO] Session initialized for user@ubuntu.',
            },
            projects: {
              type: 'directory',
              children: {
                'readme.md': {
                  type: 'file',
                  content: '# Projects Directory\nContains web projects and shell experiments.',
                },
              },
            },
            downloads: {
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
  const router = useRouter();

  // Hierarchical Virtual File System Tree
  const [fileSystem, setFileSystem] = useState<FSNode>(INITIAL_FS);
  const [currentPath, setCurrentPath] = useState<string[]>(HOME_PATH);

  // Nano Editor State
  const [nanoFile, setNanoFile] = useState<NanoState | null>(null);
  const [nanoNotification, setNanoNotification] = useState<string | null>(null);

  // Command Stream State
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
          <p><span className="font-bold text-zinc-400">VFS:</span> Hierarchical Tree (Directory Navigation Enabled)</p>
          <p className="pt-2 text-zinc-400">Type <span className="text-terminal-primary font-bold">'help'</span> for available commands.</p>
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

  // --- VFS TREE HELPER FUNCTIONS ---
  const resolvePath = (basePath: string[], target: string): string[] => {
    if (!target || target === '~') return [...HOME_PATH];
    let workingTarget = target;
    if (workingTarget.startsWith('~')) {
      workingTarget = workingTarget.replace(/^~\/?/, 'home/user/');
    }

    const segments = workingTarget.split('/').filter(Boolean);
    const stack = workingTarget.startsWith('/') ? [] : [...basePath];

    for (const seg of segments) {
      if (seg === '.') continue;
      if (seg === '..') {
        if (stack.length > 0) stack.pop();
      } else {
        stack.push(seg);
      }
    }
    return stack;
  };

  const getDisplayPath = (path: string[]): string => {
    const fullPathStr = '/' + path.join('/');
    const homePathStr = '/' + HOME_PATH.join('/');
    if (fullPathStr === homePathStr) return '~';
    if (fullPathStr.startsWith(homePathStr + '/')) {
      return '~' + fullPathStr.slice(homePathStr.length);
    }
    return fullPathStr || '/';
  };

  const getNode = (root: FSNode, path: string[]): FSNode | null => {
    let current = root;
    for (const segment of path) {
      if (current.type !== 'directory' || !current.children || !current.children[segment]) {
        return null;
      }
      current = current.children[segment];
    }
    return current;
  };

  const addNode = (root: FSNode, parentPath: string[], name: string, node: FSNode): FSNode => {
    const copy: FSNode = JSON.parse(JSON.stringify(root));
    let current = copy;
    for (const segment of parentPath) {
      if (!current.children) current.children = {};
      current = current.children[segment];
    }
    if (!current.children) current.children = {};
    current.children[name] = node;
    return copy;
  };

  const removeNode = (root: FSNode, parentPath: string[], name: string): FSNode => {
    const copy: FSNode = JSON.parse(JSON.stringify(root));
    let current = copy;
    for (const segment of parentPath) {
      current = current.children![segment];
    }
    if (current.children) {
      delete current.children[name];
    }
    return copy;
  };

  // --- NANO CONTROLS ---
  const handleNanoSave = () => {
    if (!nanoFile) return;
    setFileSystem((prevFs) =>
      addNode(prevFs, nanoFile.path, nanoFile.name, {
        type: 'file',
        content: nanoFile.content,
      })
    );
    setNanoNotification(`[ Wrote ${nanoFile.content.split('\n').length} lines to ${nanoFile.name} ]`);
    setTimeout(() => setNanoNotification(null), 2500);
  };

  const handleNanoExit = () => {
    if (!nanoFile) return;
    const fileName = nanoFile.name;
    setNanoFile(null);
    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: `nano ${fileName}`,
        output: <p className="text-zinc-400 text-xs">[ Closed nano editor session ]</p>,
        path: getDisplayPath(currentPath),
      },
    ]);
  };

  // --- COMMAND INTERPRETER ---
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

    // Redirection check
    let executionCmd = trimmed;
    let redirectTargetStr: string | null = null;
    let isAppend = false;

    if (trimmed.includes('>>')) {
      const parts = trimmed.split('>>');
      executionCmd = parts[0].trim();
      redirectTargetStr = parts[1].trim();
      isAppend = true;
    } else if (trimmed.includes('>')) {
      const parts = trimmed.split('>');
      executionCmd = parts[0].trim();
      redirectTargetStr = parts[1].trim();
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
            <p className="text-terminal-primary font-bold">Directory & File Commands:</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">cd [dir]</span> - Change directory (~, .., /path)</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">mkdir [dir]</span> - Create a new directory</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">rmdir [dir]</span> - Remove an empty directory</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">pwd</span> - Print full working directory path</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">ls [path]</span> - List directory contents</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">cat [file]</span> - Output contents of a file</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">nano [file]</span> - Open file editor</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">clear</span> - Clear screen buffer</p>
            <p><span className="text-terminal-secondary w-28 inline-block font-bold">exit</span> - Return to landing page</p>
          </div>
        );
        break;

      case 'cd':
        if (!cmdArgs[0] || cmdArgs[0] === '~') {
          setCurrentPath([...HOME_PATH]);
        } else {
          const targetPath = resolvePath(currentPath, cmdArgs[0]);
          const targetNode = getNode(fileSystem, targetPath);

          if (!targetNode) {
            resultOutput = <p className="text-terminal-error">bash: cd: {cmdArgs[0]}: No such file or directory</p>;
          } else if (targetNode.type !== 'directory') {
            resultOutput = <p className="text-terminal-error">bash: cd: {cmdArgs[0]}: Not a directory</p>;
          } else {
            setCurrentPath(targetPath);
          }
        }
        break;

      case 'mkdir':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">mkdir: missing operand</p>;
        } else {
          const targetPath = resolvePath(currentPath, cmdArgs[0]);
          const dirName = targetPath[targetPath.length - 1];
          const parentPath = targetPath.slice(0, -1);
          const parentNode = getNode(fileSystem, parentPath);

          if (!parentNode || parentNode.type !== 'directory') {
            resultOutput = <p className="text-terminal-error">mkdir: cannot create directory '{cmdArgs[0]}': No such file or directory</p>;
          } else if (parentNode.children && parentNode.children[dirName]) {
            resultOutput = <p className="text-terminal-error">mkdir: cannot create directory '{cmdArgs[0]}': File exists</p>;
          } else {
            setFileSystem((prev) => addNode(prev, parentPath, dirName, { type: 'directory', children: {} }));
          }
        }
        break;

      case 'rmdir':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">rmdir: missing operand</p>;
        } else {
          const targetPath = resolvePath(currentPath, cmdArgs[0]);
          const targetNode = getNode(fileSystem, targetPath);
          const dirName = targetPath[targetPath.length - 1];
          const parentPath = targetPath.slice(0, -1);

          if (!targetNode) {
            resultOutput = <p className="text-terminal-error">rmdir: failed to remove '{cmdArgs[0]}': No such file or directory</p>;
          } else if (targetNode.type !== 'directory') {
            resultOutput = <p className="text-terminal-error">rmdir: failed to remove '{cmdArgs[0]}': Not a directory</p>;
          } else if (targetNode.children && Object.keys(targetNode.children).length > 0) {
            resultOutput = <p className="text-terminal-error">rmdir: failed to remove '{cmdArgs[0]}': Directory not empty</p>;
          } else {
            setFileSystem((prev) => removeNode(prev, parentPath, dirName));
          }
        }
        break;

      case 'pwd':
        rawTextOutput = '/' + currentPath.join('/');
        resultOutput = <p className="text-zinc-300">{rawTextOutput}</p>;
        break;

      case 'ls': {
        const targetPath = cmdArgs[0] ? resolvePath(currentPath, cmdArgs[0]) : currentPath;
        const targetNode = getNode(fileSystem, targetPath);

        if (!targetNode) {
          resultOutput = <p className="text-terminal-error">ls: cannot access '{cmdArgs[0]}': No such file or directory</p>;
        } else if (targetNode.type === 'file') {
          resultOutput = <p className="text-terminal-primary">{cmdArgs[0]}</p>;
        } else if (targetNode.children) {
          const items = Object.entries(targetNode.children);
          resultOutput = items.length === 0 ? (
            <p className="text-zinc-600 text-xs italic">[ empty directory ]</p>
          ) : (
            <div className="flex flex-wrap gap-4 text-sm font-mono">
              {items.map(([name, node]) => (
                <span
                  key={name}
                  className={node.type === 'directory' ? 'text-terminal-info font-bold' : 'text-terminal-primary'}
                >
                  {name}{node.type === 'directory' ? '/' : ''}
                </span>
              ))}
            </div>
          );
        }
        break;
      }

      case 'cat':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">cat: missing file operand</p>;
        } else {
          const filePath = resolvePath(currentPath, cmdArgs[0]);
          const fileNode = getNode(fileSystem, filePath);

          if (!fileNode) {
            resultOutput = <p className="text-terminal-error">cat: {cmdArgs[0]}: No such file or directory</p>;
          } else if (fileNode.type === 'directory') {
            resultOutput = <p className="text-terminal-error">cat: {cmdArgs[0]}: Is a directory</p>;
          } else {
            rawTextOutput = fileNode.content || '';
            resultOutput = <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap">{rawTextOutput}</pre>;
          }
        }
        break;

      case 'nano':
        if (!cmdArgs[0]) {
          resultOutput = <p className="text-terminal-error">nano: filename parameter required</p>;
        } else {
          const filePath = resolvePath(currentPath, cmdArgs[0]);
          const fileName = filePath[filePath.length - 1];
          const parentPath = filePath.slice(0, -1);
          const existingNode = getNode(fileSystem, filePath);

          if (existingNode && existingNode.type === 'directory') {
            resultOutput = <p className="text-terminal-error">nano: '{cmdArgs[0]}' is a directory</p>;
          } else {
            setNanoFile({
              name: fileName,
              path: parentPath,
              content: existingNode?.content || '',
            });
            return;
          }
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

      case 'exit':
        router.push('/');
        return;

      default:
        resultOutput = <p className="text-terminal-error">bash: {mainCmd}: command not found. Type 'help'.</p>;
    }

    // Process output redirection
    if (redirectTargetStr && rawTextOutput !== null) {
      const targetFilePath = resolvePath(currentPath, redirectTargetStr);
      const fileName = targetFilePath[targetFilePath.length - 1];
      const parentPath = targetFilePath.slice(0, -1);
      const existingFile = getNode(fileSystem, targetFilePath);

      const existingContent = existingFile?.content || '';
      const updatedContent = isAppend
        ? existingContent ? `${existingContent}\n${rawTextOutput}` : rawTextOutput
        : rawTextOutput;

      setFileSystem((prev) =>
        addNode(prev, parentPath, fileName, {
          type: 'file',
          content: updatedContent,
        })
      );

      resultOutput = (
        <p className="text-zinc-400 text-xs font-mono">
          [ Output written to '{redirectTargetStr}' ]
        </p>
      );
    }

    setHistory((prev) => [
      ...prev,
      { id: entryId, command: trimmed, output: resultOutput, path: displayPath },
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

  if (nanoFile) {
    return (
      <div className="min-h-screen bg-black text-zinc-200 flex flex-col p-2 sm:p-4 font-mono select-none">
        <div className="w-full max-w-6xl mx-auto border border-zinc-700 bg-black flex flex-col flex-1 min-h-[90vh] rounded-lg overflow-hidden">
          <div className="bg-zinc-200 text-black px-4 py-1 flex justify-between items-center font-bold text-xs font-mono">
            <span>GNU nano 7.2</span>
            <span>File: {nanoFile.name}</span>
            <span>{nanoNotification || 'Editing'}</span>
          </div>

          <textarea
            value={nanoFile.content}
            onChange={(e) => setNanoFile({ ...nanoFile, content: e.target.value })}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key.toLowerCase() === 'o') { e.preventDefault(); handleNanoSave(); }
              if (e.ctrlKey && e.key.toLowerCase() === 'x') { e.preventDefault(); handleNanoExit(); }
            }}
            className="flex-1 bg-black text-terminal-primary p-4 outline-none font-mono text-sm resize-none border-none focus:ring-0 leading-relaxed"
            spellCheck={false}
            autoFocus
          />

          <div className="bg-zinc-900 border-t border-zinc-800 p-3 text-xs font-mono space-y-2">
            <div className="flex flex-wrap gap-3">
              <button onClick={handleNanoSave} className="bg-terminal-primary text-black font-bold px-3 py-1.5 rounded">^O WriteOut</button>
              <button onClick={handleNanoExit} className="bg-zinc-800 text-zinc-200 font-bold px-3 py-1.5 rounded">^X Exit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
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
            user@gnome-terminal: {getDisplayPath(currentPath)}
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
              user@gnome-terminal:{getDisplayPath(currentPath)}$
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
