import Docker from 'dockerode';
import { PassThrough } from 'stream';
import { writeTempFile, removeTempDir } from './utils.js';

const docker = new Docker();

const languageConfigs = {
  cpp: {
    extension: 'cpp',
    image: 'gcc:latest',
    compileCmd: (fileName) => ['g++', fileName, '-o', 'code'],
    runCmd: () => ['./code']
  },
  python: {
    extension: 'py',
    image: 'python:3.9-slim',
    compileCmd: null, 
    runCmd: (fileName) => ['python', fileName]
  },
  javascript: {
    extension: 'js',
    image: 'node:20-alpine',
    compileCmd: null,
    runCmd: (fileName) => ['node', fileName]
  },
  java: {
    extension: 'java',
    image: 'openjdk:17',
    customFileName: 'Main.java',
    compileCmd: (fileName) => ['javac', fileName],
    runCmd: () => ['java', 'Main']
  },
};


const executeInContainer = (container, command, input) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exec = await container.exec({
        Cmd: command,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false, 
      });

      const stream = await exec.start({ hijack: true, stdin: true });

      stream.write(input);
      stream.end();

      
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      container.modem.demuxStream(stream, stdout, stderr);
      
      
      let output = '';
      let errorOutput = '';
      
      stdout.on('data', chunk => output += chunk.toString('utf-8'));
      stderr.on('data', chunk => errorOutput += chunk.toString('utf-8'));

      stream.on('end', () => {
        exec.inspect((err, data) => {
          if (err) return reject(err);
          // if (data.ExitCode !== 0) {
          //   console.log(`DEBUG: Command [${command.join(' ')}] finished with Exit Code: ${data.ExitCode}. Stderr: ${errorOutput}`);
          // }
          resolve({ output, error: errorOutput, exitCode: data.ExitCode });
        });
      });
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

export const runAllTestCasesInContainer = async (language, code, testCases) => {
  const langConfig = languageConfigs[language];
  if (!langConfig) {
    return { verdict: 'Runtime Error', error: 'Unsupported language specified' };
  }

  const { dir, fileName } = await writeTempFile(langConfig.extension, code, langConfig.customFileName);
  let container;

  try {
    container = await docker.createContainer({
      Image: langConfig.image,
      // This command keeps the container alive, preventing the race condition
      Cmd: ['tail', '-f', '/dev/null'],
      Tty: false,
      HostConfig: {
        Binds: [`${dir}:/app`],
        Memory: 256 * 1024 * 1024,
        CpuPeriod: 100000,
        CpuQuota: 50000,
      },
      WorkingDir: '/app',
    });
    await container.start();

    if (langConfig.compileCmd) {
      const compileResult = await executeInContainer(container, langConfig.compileCmd(fileName), '');
      if (compileResult.exitCode !== 0) {
        return { verdict: 'Compilation Error', output: '', error: compileResult.error };
      }
    }

    let finalVerdict = "Accepted";
    const finalResults = [];

    // --- EXECUTE FOR EACH TEST CASE ---
    for (const tc of testCases) {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Time Limit Exceeded")), 2000)
      );
      const runPromise = executeInContainer(
        container,
        langConfig.runCmd(fileName),
        tc.input
      );

      let runResult;
      try {
        runResult = await Promise.race([runPromise, timeoutPromise]);
      } catch (err) {
        // This catches the Time Limit Exceeded error
        finalVerdict = "Time Limit Exceeded";
        finalResults.push({
          ...tc,
          actualOutput: "",
          passed: false,
          error: "Time Limit Exceeded",
        });
        break; // Stop processing further test cases
      }

      const passed =
        runResult.exitCode === 0 &&
        runResult.output.trim() === tc.output.trim();
      finalResults.push({
        ...tc,
        actualOutput: runResult.output.trim(),
        passed,
        error: runResult.error,
      });

      if (!passed) {
        finalVerdict =
          runResult.exitCode !== 0 ? "Runtime Error" : "Wrong Answer";
        break; // Stop processing further test cases
      }
    }

    return { finalVerdict, finalResults };
  } catch (err) {
    // console.error(`[CRITICAL] An unexpected error occurred in dockerRunner:`, err);

    if (err.message === 'Time Limit Exceeded') {
      return { verdict: 'Time Limit Exceeded', output: '', error: 'Execution exceeded the 2-second time limit.' };
    }
    return { verdict: 'Runtime Error', output: '', error: `A judge system error occurred: ${err.message}` };
  } finally {
    // Crucial: Stop and remove the long-running container to clean up resources
    if (container) {
      try { await container.stop(); } catch (e) { /* ignore */ }
      try { await container.remove(); } catch (e) { /* ignore */ }
    }
    await removeTempDir(dir);
  }
};

export const runSingleInputInContainer = async (language, code, input) => {
  const langConfig = languageConfigs[language];
  if (!langConfig) return { verdict: 'Runtime Error', error: 'Unsupported language' };

  const { dir, fileName } = await writeTempFile(langConfig.extension, code, langConfig.customFileName);
  let container;

  try {
    container = await docker.createContainer({ Image: langConfig.image, Cmd: ['tail', '-f', '/dev/null'], Tty: false, HostConfig: { Binds: [`${dir}:/app`], Memory: 256 * 1024 * 1024, CpuPeriod: 100000, CpuQuota: 50000 }, WorkingDir: '/app' });
    await container.start();

    if (langConfig.compileCmd) {
      const compileResult = await executeInContainer(container, langConfig.compileCmd(fileName), '');
      if (compileResult.exitCode !== 0) {
        return { verdict: 'Compilation Error', output: '', error: compileResult.error };
      }
    }

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Time Limit Exceeded')), 2000));
    const runPromise = executeInContainer(container, langConfig.runCmd(fileName), input);

    const runResult = await Promise.race([runPromise, timeoutPromise]);

    // For a 'run' job, we only care about the exit code.
    if (runResult.exitCode !== 0) {
      return { verdict: 'Runtime Error', output: runResult.output, error: runResult.error };
    }

    // If exit code is 0, it's always 'Accepted' for a run job, regardless of output.
    return { verdict: 'Accepted', output: runResult.output, error: runResult.error };

  } catch (err) {
    if (err.message === 'Time Limit Exceeded') {
      return { verdict: 'Time Limit Exceeded', output: '', error: 'Execution took too long.' };
    }
    console.error(`[CRITICAL] An unexpected error occurred in dockerRunner:`, err);
    throw err;
  } finally {
    if (container) {
      try { await container.stop(); } catch (e) {}
      try { await container.remove(); } catch (e) {}
    }
    await removeTempDir(dir);
  }
};