import User from "../models/user.js"
import jwt from "jsonwebtoken";

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