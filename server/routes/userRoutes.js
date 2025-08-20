import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserDetails, updateUserDetails } from "../controllers/userController.js";
import { upload } from "../Middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";
const router = express.Router({mergeParams:true});

router.get('/',protect,getUserDetails);
router.put('/update',protect,updateUserDetails);


router.post('/upload', upload.single('image'), async (req, res) => {
    // console.log("Recieved file", req.file);
    try {
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'finTrack'
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});
export default router;