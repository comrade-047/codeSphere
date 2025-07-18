import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import {runCode, submitCode} from "../controllers/judgeController.js"

const router = express.Router();

router.post('/run',protect,runCode);
router.post('/submit',protect,submitCode);

export default router;