const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken")
require('dotenv').config();


//signup
exports.signup = async(req,res) => {
    try{
        const {name,email,password,role} = req.body;
        const existingUser =  await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already exists',

            });
        }
        //secure Pwd
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing password',
            })
        }


        //create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User created successfully",
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered please try again later",
        })
    }
}

//login
exports.login = async(req,res) => {
    try{
        //data fetch
        const {email,password} = req.body;
        //validate
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details",
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered",
            })
        }
        
        //creating data for jwt
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify pwd and generate jwt token
        //bcrypt.compare used for comparing pwds  
        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                                expiresIn:"2h",
            })
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true//for securit from client side
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully",
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure",
        })
    }
}