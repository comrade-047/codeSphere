import express from "express";
import { getUserSubmissionForProblem } from "../controllers/submissionControllers.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get('/:problemId',protect, getUserSubmissionForProblem);


export default router;