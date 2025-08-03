import Contest from "../models/contest.js";
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import { submissionQueue } from "../config/queueConfig.js";


export const createContest = async (req, res) => {

  const { title, slug, description, startTime, endTime, problems } = req.body;

  if (!title || !slug || !startTime || !endTime || !problems) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newContest = new Contest({ title, slug, description, startTime, endTime, problems, createdBy: req.user.id });
    await newContest.save();
    return res.status(201).json(newContest);
  } catch (err) {
    return res.status(500).json({ message: 'Server Error: failed to create contest' });
  }
};

export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: -1 }).select("-problems");
    return res.status(200).json({ contests });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch contests" });
  }
};

export const getContestDetails = async (req, res) => {
  // console.log('hit getcontestDetails');
  try {
    const contest = await Contest.findOne({ slug: req.params.slug }).populate('problems.problem');
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const now = new Date();
    if (now < contest.startTime) {

      const contestInfo = contest.toObject();
      delete contestInfo.problems;
      return res.status(200).json({ contest: contestInfo, problemsVisible: false });
    }

    return res.status(200).json({ contest, problemsVisible: true });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching contest details" });
  }
};


export const registerForContest = async (req, res) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug });
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    if (contest.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already registered for this contest" });
    }

    contest.participants.push(req.user.id);
    await contest.save();
    return res.status(200).json({ message: "Successfully registered for the contest" });
  } catch (err) {
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const submitToContest = async (req, res) => {
  const { language, code, problemId } = req.body;
  try {
    const contest = await Contest.findOne({ slug: req.params.slug });
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const now = new Date();
    if (now < contest.startTime || now > contest.endTime) {
      return res.status(403).json({ message: "Contest is not active" });
    }
    if (!contest.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "You are not registered for this contest" });
    }

    const newSubmission = new Submission({
      user: req.user.id,
      problem: problemId,
      contest: contest._id, // Link the submission to the contest
      languages: language,
      code,
      verdict: 'Pending',
    });
    await newSubmission.save();

    await submissionQueue.add('submission-job', {
      submissionId: newSubmission._id,
      code,
      language,
      problemId: problemId,
      userId: req.user.id,
      contestId: contest._id,
      contestStartTime: contest.startTime,
    });

    return res.status(202).json({
      message: "Submission received and is being processed.",
      submissionId: newSubmission._id,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error during submission" });
  }
};

export const getContestLeaderboard = async (req, res) => {
    try {
        const contest = await Contest.findOne({ slug: req.params.slug });
        if (!contest) return res.status(404).json({ message: "Contest not found" });

        const acceptedSubmissions = await Submission.find({
            contest: contest._id,
            verdict: 'Accepted'
        }).populate('user', 'username').sort({ createdAt: 1 });

        const leaderboard = {};

        for (const sub of acceptedSubmissions) {
            const userId = sub.user._id.toString();
            const problemId = sub.problem.toString();

            if (!leaderboard[userId]) {
                leaderboard[userId] = {
                    username: sub.user.username,
                    score: 0,
                    penalty: 0,
                    solvedProblems: new Set(),
                };
            }

            if (!leaderboard[userId].solvedProblems.has(problemId)) {
                const problemInContest = contest.problems.find(p => p.problem.toString() === problemId);
                const points = problemInContest ? problemInContest.points : 100;
                
                const timeTaken = (sub.createdAt - contest.startTime) / (1000 * 60); // in minutes

                leaderboard[userId].score += points;
                leaderboard[userId].penalty += Math.round(timeTaken);
                leaderboard[userId].solvedProblems.add(problemId);
            }
        }

        const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score; 
            }
            return a.penalty - b.penalty; 
        });

        return res.status(200).json(sortedLeaderboard);
    } catch (err) {
        return res.status(500).json({ message: "Error generating leaderboard" });
    }
};