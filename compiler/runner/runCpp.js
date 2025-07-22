import path from 'path';
import { writeTempFile, removeTempDir } from '../utils.js';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const runCpp = async (code, input = "") => {
  const { dir, filePath } = await writeTempFile("cpp", code);
  const binaryPath = path.join(dir, 'code');

  try {
    // Compile the code
    await execFileAsync('g++', [filePath, '-o', binaryPath]);
    
    // Run the compiled binary
    const output = await new Promise((resolve, reject) => {
      const child = spawn(binaryPath, [], { cwd: dir });

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

      child.on('error', (err) => {
        reject({
          message: `Failed to start process: ${err.message}`,
          exitCode: null,
        });
      });

      child.on('close', (code, signal) => {
        if (code === 0) {
          resolve({ success: true, output: stdout });
        } else {
          const cleanStderr = stderr.replaceAll(filePath, 'code.cpp');
          reject({
            success: false,
            error: {
              message: cleanStderr || `Program exited with code ${code}`,
              exitCode: code,
              signal,
            },
          });
        }
      });
    });

    return output;
   } catch (err) {
    // Extract the actual compiler error from stderr if available
    let rawMessage = err.stderr || err.message || 'Unknown error';

    // Clean paths and unnecessary command noise
    const cleanMessage = rawMessage
      .replaceAll(filePath, 'code.cpp')    // Replace full file path
      .replaceAll(dir, '')                 // Replace temp dir
      .replace(/\/?code(\.cpp)?/g, 'code.cpp') // Normalize path variants
      .replace(/^Command failed:.*\n/, '') // Remove the 'Command failed' line
      .trim();

    return {
      success: false,
      error: {
        message: cleanMessage,
        exitCode: err.exitCode ?? null,
        signal: err.signal ?? null,
      },
    };
  }finally {
    await removeTempDir(dir);
  }
};

export default runCpp;



