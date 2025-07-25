import User from "../models/user.js"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// console.log(process.env.JWT_SECRET);
const generatetoken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn : '1d'});
}

// for registering the user
export const register = async(req, res) => {
    // console.log("hit register endpoint");
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message : "All fields are required"});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already exist"});
        }

        const user = await User.create({
            username,
            email,
            password
        });

        return res.status(201).json({
            _id : user._id,
            user,
            token : generatetoken(user._id)
        })
    }
    catch(err){
        return res.status(500).json({ message: 'Error registering user',error:err.message });
    }
}

// for login of user
export const login = async(req, res) => {
    const {username, password} = req.body;
    // console.log(username, password);
    if(!username || !password){
        return res.status(400).json({message : "All fields are required"});
    }

    try{
        const user = await User.findOne({username}).select("+password");
        // console.log(user);
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message : "Invalid Credentials"});
        }
        // console.log(await user.comparePassword(password));
        return res.status(200).json({
            _id : user._id,
            user,
            token : generatetoken(user._id)
        });
    }
    catch(err){
        return res.status(500).json({message : "Error while logging " , error : err.message});
    }
}


export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // console.log(email);
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const html = `
            <p>Hello,</p>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 30 minutes.</p>
            <p>If you didn’t request this, you can ignore this email.</p>
            <br />
            <p>Regards,<br />CodeSphere Team</p>
        `;

        await sendEmail({
            to : email,
            subject : "Password Reset Request",
            html
        })

        return res.status(200).json({ message: "Reset link sent to your email." });
    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "Failed to send reset link." });
    }
};


export const resetPassword = async (req, res) => {
    // console.log("hit resetPassword");
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
    return res.status(400).json({ message: "Token and new password are required." });

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
    console.error("Reset error:", err);
        return res.status(500).json({ message: "Server error during password reset." });
    }
};