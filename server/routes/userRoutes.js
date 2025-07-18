import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { getUserDetails, updateUserDetails } from "../controllers/userController.js";

const router = express.Router({mergeParams:true});

router.get('/',protect,getUserDetails);
router.put('/update',protect,updateUserDetails);

export default router;