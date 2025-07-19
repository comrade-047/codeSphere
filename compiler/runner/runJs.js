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

      child.stdout.on('data', data => {
        stdout += data.toString();
      });

      child.stderr.on('data', data => {
        stderr += data.toString();
      });

      child.on('error', (err) => {
        reject({
          success: false,
          error: {
            message: `Failed to start process: ${err.message}`,
            exitCode: null,
            signal: null,
          },
        });
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: stdout });
        } else {
          // Clean up error message
          const cleanStderr = stderr
            .replaceAll(filePath, 'code.js')
            .replaceAll(dir, '')
            .replace(/\/?code(\.js)?/g, 'code.js')
            .split('\n')
            .filter(line => !line.includes('node:internal') && !line.trim().startsWith('at '))
            .join('\n')
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
    if (err?.error?.message) {
      return {
        success: false,
        error: {
          message: err.error.message,
          exitCode: err.error.exitCode ?? null,
          signal: err.error.signal ?? null,
        },
      };
    }

    return {
      success: false,
      error: {
        message: 'Unknown error',
        exitCode: null,
        signal: null,
      },
    };
  } finally {
    await removeTempDir(dir);
  }
};

export default runJs;
