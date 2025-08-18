import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

export const baseTempPath = '/tmp/codesphere';

export const writeTempFile = async (ext, content, customFileName = null) => {
  const id = uuid();
  const dir = path.join(baseTempPath, id);

  await fs.mkdir(dir, { recursive: true });

  const fileName = customFileName ?? `code.${ext}`;
  const filePath = path.join(dir, fileName);

  await fs.writeFile(filePath, content);
  await fs.chmod(filePath, 0o755); // make file executable

  return { id, dir, filePath, fileName };
};

export const removeTempDir = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(`Failed to delete temp directory ${dirPath}: ${err.message}`);
  }
};
