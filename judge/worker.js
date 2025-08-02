import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import { redisConnection, resultRedisClient } from './config/redisConfig.js';
import { runInIsolatedContainer } from './dockerRunner.js';

import Submission from './models/submission.js';
import TestCase from './models/testCase.js';
import Problem from './models/problem.js';
import User from './models/user.js';

dotenv.config();
connectDB();
resultRedisClient.on('connect', () => console.log('Judge Worker connected to Redis for results.'));

const submissionWorker = new Worker('submission-queue', async (job) => {
  const { submissionId, code, language, problemId, userId } = job.data;
  // console.log(`[Processing Submit] Job ${job.id} for submission ${submissionId}`);

  try {
    const testCases = await TestCase.find({ problem: problemId });
    let finalVerdict = 'Accepted';
    let finalResults = [];
    let finalError = null;

    for (const tc of testCases) {
      const result = await runInIsolatedContainer(language, code, tc.input);
      const passed = result.verdict === 'Accepted' && result.output.trim() === tc.output.trim();
      finalResults.push({ input: tc.input, expectedOutput: tc.output, actualOutput: result.output, passed, error: result.error });
      if (!passed) {
        finalVerdict = result.verdict === 'Accepted' ? 'Wrong Answer' : result.verdict;
        finalError = result.error;
        break; 
      }
    }

    await Submission.findByIdAndUpdate(submissionId, { verdict: finalVerdict, testResults: finalResults });

    if (finalVerdict === 'Accepted') {
      const problem = await Problem.findById(problemId);
      const user = await User.findById(userId);
      problem.submissions = (await Submission.countDocuments({ problem: problemId }));
      problem.successfulSubmissions = (await Submission.countDocuments({ problem: problemId, verdict: 'Accepted' }));
      problem.acceptanceRate = (problem.successfulSubmissions / problem.submissions) * 100;
      await problem.save();
      if (user && !user.problemsSolved.includes(problemId)) {
        user.problemsSolved.push(problemId);
        await user.save();
      }
    }
    // console.log(`[Finished Submit] Job ${job.id} with verdict: ${finalVerdict}`);
  } catch (err) {
    // console.error(`[Submit System Error] Job ${job.id} failed. Error: ${err.message}`);
    await Submission.findByIdAndUpdate(submissionId, { verdict: 'Runtime Error', error: 'The judge encountered a system error.' });
  }
}, { connection: redisConnection, concurrency: 5 });

// console.log("Submission worker started. Waiting for jobs on 'submission-queue'...");

const runWorker = new Worker('run-queue', async (job) => {
  const { runId, code, language, input } = job.data;
  console.log(`[Processing Run] Job ${job.id} for runId ${runId}`);

  try {
    const result = await runInIsolatedContainer(language, code, input);

    await resultRedisClient.set(`run-result:${runId}`, JSON.stringify(result), 'EX', 300);

    // console.log(`[Finished Run] Job ${job.id} for runId ${runId}`);
  } catch (err) {
    console.error(`[Run System Error] Job ${job.id} failed. Error: ${err.message}`);

    await resultRedisClient.set(`run-result:${runId}`, JSON.stringify({
      verdict: 'Runtime Error',
      error: 'The judge encountered a system error.'
    }), 'EX', 300);
  }
}, { connection: redisConnection, concurrency: 10 }); 


