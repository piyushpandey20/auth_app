const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.auth = (req,res,next) => {
    try{
        //token extract
        const token = req.cookies.token ||  req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing",
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode
        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token ",
        })
    }
}


exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.json(401).json({
                success:false,
                message:"This is a protected route for students",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.json(401).json({
                success:false,
                message:"This is a protected route for admin",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}