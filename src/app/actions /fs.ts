'use server';

import fs from 'fs/promises';
import path from 'path';

export interface FSNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FSNode>;
}

const STORAGE_ROOT = path.join(process.cwd(), 'vfs_storage');

/**
 * Recursively scans a server directory and builds an FSNode tree structure.
 */
async function buildTreeFromDisk(dirPath: string): Promise<Record<string, FSNode>> {
  const children: Record<string, FSNode> = {};

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        children[entry.name] = {
          type: 'directory',
          children: await buildTreeFromDisk(fullPath),
        };
      } else if (entry.isFile()) {
        const content = await fs.readFile(fullPath, 'utf-8');
        children[entry.name] = {
          type: 'file',
          content,
        };
      }
    }
  } catch (error) {
    console.error(`Error reading directory at ${dirPath}:`, error);
  }

  return children;
}

/**
 * Server Action to load and format initial filesystem state.
 */
export async function loadServerFS(): Promise<FSNode> {
  // Ensure sandbox root exists on disk
  try {
    await fs.mkdir(STORAGE_ROOT, { recursive: true });
  } catch (err) {
    // Ignore error if directory exists
  }

  const diskTree = await buildTreeFromDisk(STORAGE_ROOT);

  // Return base FS structure populated with disk contents inside /home/user/
  return {
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
                content: 'GNOME Terminal Clone v3.14.02 LTS\nDisk-backed Virtual File System.',
              },
              ...diskTree,
            },
          },
        },
      },
    },
  };
}
