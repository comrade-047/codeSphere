import express from "express";
import { addProblem, getAllProblems, getProblemBySlug } from "../controllers/problemControllers.js";
import { isAdmin, protect } from "../Middleware/authMiddleware.js";

const router = express.Router();
// not protected this route so that anyone can see problem statement but has to login iff they want to submit
router.get('/',getAllProblems);
router.get('/:slug',getProblemBySlug);

router.post('/' ,protect ,isAdmin ,addProblem);

export default router;