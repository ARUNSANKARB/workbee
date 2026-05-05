import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token)
        {
            return res.status(404).json({ message: "Token not found" })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }
        if(user.isSuspended)
        {
            return res.status(403).json({message:"Account Suspended"})
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid Token"})
    }
}

export const authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            return res.status(403).json({message:"Access Denied"})
        }
        next();
    }
}
export default auth;

