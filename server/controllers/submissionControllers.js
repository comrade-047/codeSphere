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