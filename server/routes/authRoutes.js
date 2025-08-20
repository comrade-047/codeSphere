import express from "express";
import { login, register,forgotPassword,resetPassword, getLoggedInUser } from "../controllers/authControllers.js";
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.get('/me', protect, getLoggedInUser);

export default router;