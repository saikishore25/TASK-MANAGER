
import express from "express"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"


export const signUp = async (req, res)=>{

    try{

        const {username, email, password} = req.body;
        // console.log(username, email, password)
        const avatarURL = `https://api.dicebear.com/8.x/bottts/svg?seed=${username}`;


        if(!username || !email || !password){

            return res.json({message: "Details Not Sufficient"})

        }

        const userexists = await userModel.findOne({email});

        // console.log(userexists)

        if(userexists){

            console.log("User Already Exists")
            return res.status(409).json({message:"User Already Exists"})

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({

            username,
            email,
            password:hashedPassword,
            avatar:avatarURL

        })

        const token = await generateTokenAndSetCookie(res, {email})
        
        // console.log("User Created Sucessfully")
        return res.status(201).json({message:"User Created Sucessfully", user: user.username, userID: user._id, userAvatar: user.avatar})

    }

    catch(error){
        
        console.log("Internal Server Error", error)
        res.status(500).json({message:"Internal Server Error"})
    }

}



export const Login = async (req, res) => {
    
    try{

        const {email, password } = req.body;
        console.log(email, password)
        if(!email || !password){

            return res.json({message: "Details Not Sufficient"})

        }

        const user = await userModel.findOne({ email });

        if(!user){

            console.log("User Doesn't Exist");
            return res.status(409).json({ message: "User Doesn't Exist" });
        }

        
        const isPasswordMatching = await bcrypt.compare(password, user.password);

        if(!isPasswordMatching){

            console.log("Incorrect Password");
            return res.status(409).json({ message: "Incorrect Password" });
        }
        
        const token = await generateTokenAndSetCookie(res,{email})
        // console.log(token);
        // console.log(req.cookies.authToken)
        console.log("Login Successfully");
        return res.status(201).json({ message: "Login Successfully", user:user.username, userID: user._id, userAvatar:user.avatar });

    } 
    
    catch(error){

        console.log("Internal Server Error", error);
        res.status(500).json({ message: "Internal Server Error" });

    }

};
  

export const Logout = async (req, res) => {
  
    try{
        
        res.clearCookie("authToken", {
            
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",

        });

        console.log("Logout Successful");
        return res.status(200).json({ message: "Logout Successful", logout:true });
    } 
    
    catch(error){

        console.log("Internal Server Error", error);
        res.status(500).json({ message: "Internal Server Error", logout:false });
    }
    
};

export const checkAuth = async (req, res)=>{
    
    try{
        
        console.log("Checking User Authentication...")
        const user = await userModel.findOne({email:req.user.email});
        // console.log("User Found:", user)

        res.status(200).json({message:"User is Authenticated", isAuthenticated: true, user:user.username});
        
    }

    catch(error){
         
        console.log("Internal Server Error", error);
        res.status(500).json({message:"Server Error"})

    }
  
}
