import runCpp from './runCpp.js';
import runJava from './runJava.js';
import runJs from './runJs.js';
import runPython from './runPython.js';

const languageRunners = {
  cpp: runCpp,
  java: runJava,
  javascript: runJs,
  python: runPython
};

export const runCode = async ({ language, code, input }) => {
  const run = languageRunners[language];
  if (!run) throw new Error("Unsupported language");

  const result = await run(code, input);
  return result;
};
