import express from "express";
import { getSubmissionById, getUserSubmissionForProblem } from "../controllers/submissionControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/:problemId',protect, getUserSubmissionForProblem);
router.get('/status/:submissionId',protect, getSubmissionById);

export default router;