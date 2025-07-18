import Submission from "../models/submission.js";
import User from "../models/user.js";

export  const getUserDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    //  Find the user
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    //  Get all submissions by the user
    const submissions = await Submission.find({ user: user._id })
      .populate("problem", "title slug")
      .sort({ createdAt: -1 });

    //  Build a map of attempted problems
    const problemStatusMap = new Map();

    submissions.forEach((sub) => {
      const slug = sub.problem.slug;

      // if problem is not yet in the map, add it
      if (!problemStatusMap.has(slug)) {
        problemStatusMap.set(slug, {
          _id: sub.problem._id,
          title: sub.problem.title,
          slug: slug,
          status: sub.verdict === "Accepted" ? "Solved" : "Unsolved",
        });
      } else {
        // If problem already in map and this time it is solved, mark as Solved
        const existing = problemStatusMap.get(slug);
        if (sub.verdict === "Accepted") {
          existing.status = "Solved";
        }
      }
    });

    const attemptedProblems = Array.from(problemStatusMap.values());

    // Send everything back
    return res.status(200).json({
      user,
      submissions,
      attemptedProblems,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateUserDetails = async (req, res) => {
  const { username } = req.params;
  const updates = req.body; 

  if (!username) {
    return res.status(400).json({ message: "Username missing in URL" });
  }

  try {
    // Find the user by username and update with new data
    const updatedUser = await User.findOneAndUpdate(
      { username },
      updates,
      { new: true } // returns the updated user
    ).select("-password"); // do not send password in response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Send updated profile back
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




