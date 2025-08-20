import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {getRunStatus, runCode, submitCode} from "../controllers/judgeController.js"

const router = express.Router();

router.post('/run',protect,runCode);
router.post('/submit',protect,submitCode);
router.get('/run/status/:runId',protect, getRunStatus);

export default router;