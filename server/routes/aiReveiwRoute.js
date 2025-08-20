import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const userId = req.user._id;
  const { code, language } = req.body;

  const user = await User.findOne(userId);

  if (!user) return res.status(400).json({ message: "User not found" });
  if (!code || !language)
    return res.status(400).json({ message: "Missing fields are required" });

  if (user.role !== "admin") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUsed = user.aiUsage.lastUsed || new Date(0);

    const isSameDay = lastUsed >= today;

    if (isSameDay) {
      if (user.aiUsage.count >= 5) {
        return res.status(429).json({
          message: " Daily AI usage limit (5) reached. Try again tomorrow.",
        });
      }
    }
    user.aiUsage.count += 1;
  } else {
    user.aiUsage.count = 1;
  }
  user.aiUsage.lastUsed = new Date();
  await user.save();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
                You're a senior software engineer.

                Compare the following ${language} code with an optimized version. 
                - Output ONLY the improved code (if any) and a short comparison in bullet points.
                - Focus on SOLID principles, performance, readability, and modern best practices.
                - Do NOT include unnecessary theory, background, or explanations.
                - Be as brief and practical as possible.
                Here is the code: ${code}
                `
    });

    //   console.log(response.text);

    return res.status(200).json({ review: response.text });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while fetching AI review", err });
  }
});

export default router;
