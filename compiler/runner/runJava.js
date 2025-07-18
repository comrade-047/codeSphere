import path from 'path';
import { writeTempFile, removeTempDir } from './utils.js';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const normalizeJavaCode = (code) => {
  return code.replace(/public\s+class\s+\w+/, 'public class Main');
};

const runJava = async (code, input = "") => {
  code = normalizeJavaCode(code);

  const fileName = 'Main.java';
  const { dir, filePath } = await writeTempFile('java', code, fileName);
  const className = 'Main';

  try {
    await execFileAsync('javac', [filePath], { cwd: dir });

    const output = await new Promise((resolve, reject) => {
      const child = spawn('java', [className], { cwd: dir });

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

export default runJava;
