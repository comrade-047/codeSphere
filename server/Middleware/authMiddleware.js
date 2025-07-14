import jwt from "jsonwebtoken";
import User from "../models/user.js";

// for securing the routes like dashboard, submit etc.
export const protect = async(req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch(error){
        res.status(401).json({message : "Not authorized, token failed"});
    }
}

//for securing the admin only routes
export const isAdmin = async(req, res, next) => {
    if(req.user && req.user.role === "admin") next();
    else{
        res.status(403).json({message : "Not authorized as admin"});
    }
}