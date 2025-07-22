import runCpp from './runner/runCpp.js';
import runJava from './runner/runJava.js';
import runJs from './runner/runJs.js';
import runPython from './runner/runPython.js';

const languageRunners = {
  cpp: runCpp,
  java: runJava,
  javascript: runJs,
  python: runPython
};

export const runLanguages = async ({ language, code, input }) => {
  const run = languageRunners[language];
  if (!run) throw new Error("Unsupported language");

  const result = await run(code, input);
  return result;
};
