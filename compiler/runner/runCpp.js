// --- runCpp.js ---
import path from 'path';
import { writeTempFile, removeTempDir } from './utils.js';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execFileAsync = promisify(execFile);

const runCpp = async (code, input = "") => {
  const { dir, filePath } = await writeTempFile("cpp", code);
  const binaryPath = path.join(dir, 'code');

  try {
    await execFileAsync('g++', [filePath, '-o', binaryPath]);

    const output = await new Promise((resolve, reject) => {
      const child = spawn(binaryPath, [], { cwd: dir });

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
  } catch(err){
    throw new Error(`Runtime Error: ${err.message}`);
  }
  finally {
    await removeTempDir(dir);
  }
};

export default runCpp;



