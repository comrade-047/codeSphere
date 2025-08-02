import problem from "../models/problem.js";
import submission from "../models/submission.js";
import { submissionQueue, runQueue } from "../config/queueConfig.js";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../config/redisConfig.js";

export const runCode = async (req, res) => {
  const { slug, language, code, input } = req.body;

  if (!slug || !language || !code || input === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const runId = uuidv4();

    await runQueue.add("run-job", {
      runId,
      code,
      language,
      input,
    });

    return res.status(202).json({
      message: "Code is being executed.",
      runId: runId,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getRunStatus = async (req, res) => {
  // console.log("hit get status");
  const { runId } = req.params;
  try {
    const result = await redisClient.get(`run-result:${runId}`);
    if (result) {
      return res
        .status(200)
        .json({ status: "completed", ...JSON.parse(result) });
    } else {
      return res.status(200).json({ status: "processing" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching run status" });
  }
};

export const submitCode = async (req, res) => {
  // console.log("hit sumbit");
  const { slug, language, code } = req.body;
  const username = req.user.username;

  if (!slug || !language || !code) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundProblem = await problem.findOne({ slug });
    if (!foundProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newSubmission = new submission({
      user: user._id,
      problem: foundProblem._id,
      languages: language,
      code,
      verdict: "Pending",
    });

    await newSubmission.save();

    await submissionQueue.add("submission-job", {
      submissionId: newSubmission._id,
      code,
      language,
      problemId: foundProblem._id,
      userId: user._id,
    });

    return res.status(202).json({
      message: "Submission received and is being processed.",
      submissionId: newSubmission._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


