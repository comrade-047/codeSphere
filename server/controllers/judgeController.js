import problem from "../models/problem.js";
import submission from "../models/submission.js";
import testCase from "../models/testCase.js";
import User from "../models/user.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const COMPILER_SERVICE_URL = process.env.COMPILER_SERVICE_URL;


export const runCode = async(req, res) => {
    // console.log("hit runCode",req.user?.username);
    const {slug, language, code, input} = req.body;

  if (!slug || !language || !code || input === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { data: result } = await axios.post(
      `${COMPILER_SERVICE_URL}/run`,
      { language, code, input }
    );
    // console.log(result);
    return res.status(200).json({ output: result });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const submitCode = async (req, res) => {
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

    const testCases = await testCase.find({ problem: foundProblem._id });

    let allPassed = true;
    let detailedResults = [];
    let failedTestCase = null;

    for (let i = 0; i < testCases.length; i++) {
      const input = testCases[i].input;
      const expectedOutput = testCases[i].output.trim();

      let actualOutput = "";
      let error = null;

      try {
        const { data: result } = await axios.post(
          `${COMPILER_SERVICE_URL}/run`,
          { language, code, input }
        );

        if (result.success) {
          actualOutput = result.output.trim();
        } else {
          error = result.error?.message || "Runtime error";
        }
      } catch (err) {
        actualOutput = "";
        error = err?.response?.data?.message || err.message || "Runtime error";
      }

      const passed = actualOutput === expectedOutput;
      if (!passed && failedTestCase === null) {
        failedTestCase = {
          testCase: i + 1,
          input,
          expectedOutput,
          actualOutput,
          error,
        };
        allPassed = false;
      }

      detailedResults.push({
        input,
        expectedOutput,
        actualOutput,
        passed,
        error,
      });

      if (!passed) break;
    }

    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    const newSubmission = new submission({
      user: user._id,
      problem: foundProblem._id,
      languages: language,
      code,
      verdict,
      testResults: detailedResults,
    });

    await newSubmission.save();

    foundProblem.submissions += 1;
    if (allPassed) foundProblem.successfulSubmissions += 1;
    foundProblem.acceptanceRate =
      (foundProblem.successfulSubmissions / foundProblem.submissions) * 100;
    await foundProblem.save();

    if (allPassed && !user.problemsSolved.includes(foundProblem._id)) {
      user.problemsSolved.push(foundProblem._id);
      await user.save();
    }

    if (!allPassed && failedTestCase) {
      return res.status(200).json({
        message: "Test case failed",
        verdict,
        ...failedTestCase,
        results: detailedResults,
      });
    }

    return res.status(200).json({
      message: "Submission evaluated",
      verdict,
      results: detailedResults,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


