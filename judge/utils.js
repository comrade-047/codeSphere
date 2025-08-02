import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

/**
 * Create a temp directory and write a code file.
 * 
 * @param {string} ext - Language extension (e.g., 'java', 'cpp', 'py')
 * @param {string} content - Code to save in the file
 * @param {string|null} customFileName - Optional full filename like 'Main.java'
 */
export const writeTempFile = async (ext, content, customFileName = null) => {
  const id = uuid();
  const dir = `/tmp/${id}`;

  // Use custom file name if provided, else fallback
  const fileName = customFileName ?? `code.${ext}`;
  const filePath = path.join(dir, fileName);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content);

  return { id, dir, filePath, fileName };
};

export const removeTempDir = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Failed to delete ${dirPath}: ${err.message}`);
  }
};

