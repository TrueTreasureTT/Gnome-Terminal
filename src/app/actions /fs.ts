'use server';

import fs from 'fs/promises';
import path from 'path';

// Define a root directory on the server disk to store virtual files safely
const STORAGE_ROOT = path.join(process.cwd(), 'vfs_storage');

export async function writeServerFile(
  relativePath: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Sanitize input path to prevent directory traversal attacks (e.g., ../../../etc/passwd)
    const sanitizedPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    const absolutePath = path.join(STORAGE_ROOT, sanitizedPath);

    // Ensure target path remains within the sandbox directory
    if (!absolutePath.startsWith(STORAGE_ROOT)) {
      return { success: false, message: 'Permission denied: Cannot write outside sandbox.' };
    }

    // 2. Ensure parent directories exist on physical disk
    const parentDir = path.dirname(absolutePath);
    await fs.mkdir(parentDir, { recursive: true });

    // 3. Write file to server disk
    await fs.writeFile(absolutePath, content, 'utf-8');

    return { success: true, message: `Saved to disk: ${sanitizedPath}` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Disk write failed' };
  }
}
