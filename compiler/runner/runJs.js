// --- runJs.js ---
import path from 'path';
import { writeTempFile, removeTempDir } from './utils.js';
import { spawn } from 'child_process';

const runJs = async (code, input = "") => {
  const { dir, filePath } = await writeTempFile('js', code);

  try {
    const output = await new Promise((resolve, reject) => {
      const child = spawn('node', [filePath], { cwd: dir });

      let stdout = '';
      let stderr = '';

      child.stdin.write(input);
      child.stdin.end();

      child.stdout.on('data', data => stdout += data.toString());
      child.stderr.on('data', data => stderr += data.toString());

      child.on('close', code => {
        if (code === 0) resolve(stdout);
        else reject(new Error(stderr || `Exited with code ${code}`));
      });
    });

    return output;
  } finally {
    await removeTempDir(dir);
  }
};

export default runJs;