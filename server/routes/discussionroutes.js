import express from "express";
import { createPostInThread, createThread, getThreads, getThreadsWithPosts } from "../controllers/discussionControllers.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get('/', getThreads);
router.post('/', protect, createThread);
router.get('/:threadId', protect, getThreadsWithPosts);
router.post('/:threadId/posts', protect, createPostInThread);

export default router;