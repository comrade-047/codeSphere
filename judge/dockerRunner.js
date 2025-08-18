import { spawn, execFile as execFileCallback } from 'child_process';
import { promisify } from 'util';
import { writeTempFile, removeTempDir } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

const execFile = promisify(execFileCallback);

const languageConfigs = {
  cpp: {
    extension: 'cpp',
    compile: (filePath, outputPath) => ({ cmd: 'g++', args: [filePath, '-o', outputPath] }),
    run: (executablePath) => ({ cmd: executablePath, args: [] })
  },
  python: {
    extension: 'py',
    compile: null,
    run: (filePath) => ({ cmd: 'python3', args: [filePath] })
  },
  javascript: {
    extension: 'js',
    compile: null,
    run: (filePath) => ({ cmd: 'node', args: [filePath] })
  },
  java: {
    extension: 'java',
    customFileName: 'Main.java',
    compile: (filePath) => ({ cmd: 'javac', args: [filePath] }),
    run: (dir) => ({ cmd: 'java', args: ['Main'], cwd: dir }) // run in temp directory
  },
};

const executeCode = (command, args, options) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd: options.cwd || process.cwd() });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, options.timeout || 2000);

    child.stdout.on('data', (data) => stdout += data.toString());
    child.stderr.on('data', (data) => stderr += data.toString());

    child.on('error', (err) => {
      console.error('Execution spawn error:', err);
      clearTimeout(timer);
      resolve({ success: false, stdout: '', stderr: err.message, signal: null });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (timedOut) resolve({ success: false, stdout, stderr, signal: 'SIGTERM' });
      else resolve({ success: code === 0, stdout, stderr, signal });
    });

    if (options.input) {
      child.stdin.write(options.input);
      child.stdin.end();
    }
  });
};

export const runAllTestCasesInContainer = async (language, code, testCases) => {
  const langConfig = languageConfigs[language];
  if (!langConfig) throw new Error('Unsupported language');

  const { dir, filePath, fileName } = await writeTempFile(langConfig.extension, code, langConfig.customFileName);
  const executablePath = path.join(dir, 'executable');

  try {
    if (langConfig.compile) {
      const { cmd, args } = langConfig.compile(filePath, executablePath);
      try {
        await execFile(cmd, args, { cwd: dir, timeout: 5000 });
      } catch (error) {
        await removeTempDir(dir);
        return { finalVerdict: 'Compilation Error', finalResults: [{ error: error.stderr }] };
      }
      if(language === 'cpp'){
        await fs.chmod(executablePath,0o755);
      }
    }

    let finalVerdict = 'Accepted';
    const finalResults = [];

    for (const tc of testCases) {
      const runOptions = langConfig.run(language === 'java' ? dir : (langConfig.compile ? executablePath : filePath));
      const { cmd, args, cwd } = runOptions;

      const runResult = await executeCode(cmd, args, { cwd: cwd || dir, input: tc.input, timeout: 2000 });

      if (!runResult.success) {
        finalVerdict = runResult.signal === 'SIGTERM' ? 'Time Limit Exceeded' : 'Runtime Error';
        finalResults.push({ ...tc, actualOutput: runResult.stdout, passed: false, error: runResult.stderr });
        break;
      }

      const passed = runResult.stdout.trim() === tc.output.trim();
      finalResults.push({ ...tc, actualOutput: runResult.stdout.trim(), passed, error: runResult.stderr });

      if (!passed) finalVerdict = 'Wrong Answer';
      if (!passed) break;
    }

    return { finalVerdict, finalResults };
  } finally {
    await removeTempDir(dir);
  }
};

export const runSingleInputInContainer = async (language, code, input) => {
  const langConfig = languageConfigs[language];
  if (!langConfig) return { verdict: 'Runtime Error', error: 'Unsupported language' };

  const { dir, filePath, fileName } = await writeTempFile(langConfig.extension, code, langConfig.customFileName);
  const executablePath = path.join(dir, 'executable');

  try {
    if (langConfig.compile) {
      const { cmd, args } = langConfig.compile(filePath, executablePath);
      try {
        await execFile(cmd, args, { cwd: dir, timeout: 5000 });
      } catch (error) {
        return { verdict: 'Compilation Error', output: '', error: error.stderr };
      }
      if(language === 'cpp') await fs.chmod(executablePath, 0o755);
    }

    const runOptions = langConfig.run(language === 'java' ? dir : (langConfig.compile ? executablePath : filePath));
    const { cmd, args, cwd } = runOptions;

    const runResult = await executeCode(cmd, args, { cwd: cwd || dir, input, timeout: 2000 });

    if (!runResult.success) {
      if (runResult.signal === 'SIGTERM') return { verdict: 'Time Limit Exceeded', output: runResult.stdout, error: 'Execution timed out.' };
      return { verdict: 'Runtime Error', output: runResult.stdout, error: runResult.stderr };
    }

    return { verdict: 'Accepted', output: runResult.stdout, error: runResult.stderr };
  } finally {
    await removeTempDir(dir);
  }
};
