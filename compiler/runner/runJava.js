import path from 'path';
import { writeTempFile, removeTempDir } from '../utils.js';
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
    // Compile using javac
    await execFileAsync('javac', [filePath], { cwd: dir });

    // Execute compiled class
    const output = await new Promise((resolve, reject) => {
      const child = spawn('java', [className], { cwd: dir });

      let stdout = '';
      let stderr = '';

      child.stdin.write(input);
      child.stdin.end();

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: stdout });
        } else {
          const cleanStderr = stderr
            .replaceAll(filePath, 'Main.java')
            .replaceAll(dir, '')
            .trim();

          reject({
            success: false,
            error: {
              message: cleanStderr || `Exited with code ${code}`,
              exitCode: code,
              signal: null,
            },
          });
        }
      });
    });

    return output;
  } catch (err) {
    // Handle compile-time error
    const stderr = err.stderr || err.message || "";
    const cleaned = stderr
      .replaceAll(filePath, 'Main.java')
      .replaceAll(dir, '')
      .trim();

    return {
      success: false,
      error: {
        message: cleaned || 'Compilation error',
        exitCode: err.exitCode ?? null,
        signal: err.signal ?? null,
      },
    };
  } finally {
    await removeTempDir(dir);
  }
};

export default runJava;
