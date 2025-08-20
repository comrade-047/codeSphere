import jwt from "jsonwebtoken";
import User from "../models/user.js";

// for securing the routes like dashboard, submit etc.
export const protect = async(req, res, next) => {

    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message : "Not authorized , no token"});
        }
        let token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(401).json({message : "Not authorized ,user not found"});
        }
        req.user = user;
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