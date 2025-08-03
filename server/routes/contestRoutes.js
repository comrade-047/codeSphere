import express from "express";
import { protect, isAdmin } from "../Middleware/authMiddleware.js";
import {
  createContest,
  getAllContests,
  getContestDetails,
  registerForContest,
  getContestLeaderboard,
  submitToContest,
} from "../controllers/contestController.js";

const router = express.Router();

router.post('/', protect, isAdmin, createContest);

router.get('/', getAllContests);
router.get('/:slug', protect, getContestDetails);
router.get('/:slug/leaderboard', protect, getContestLeaderboard);
router.post('/:slug/register', protect, registerForContest);
router.post('/:slug/submit', protect, submitToContest);

export default router;