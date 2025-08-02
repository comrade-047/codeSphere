import Submission from "../models/submission.js";

export const getUserSubmissionForProblem = async(req, res) => {
    // console.log("hit submission", req);
    const userId =  req.user?.id;
    const problemId = req.params.problemId;

    if(!userId || !problemId) return res.status(400).json("Missing fields");

    try{
        const submissions = await Submission.find({
            user : userId,
            problem : problemId
        }).sort({createdAt : -1});

        return res.status(200).json({
            submissions
        });
    }
    catch(err){
        return res.status(500).json("Error while fetching submissions",err);
    }
};

export const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        // Ensure the user requesting is the one who made the submission
        if (submission.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "User not authorized" });
        }
        return res.status(200).json(submission);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching submission", error: err.message });
    }
};