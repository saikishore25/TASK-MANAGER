import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken 
  // console.log("Token:", token);  // Log the token for debugging
  // console.log(process.env.JWT_SECRET)
  // console.log(req.headers)

  if(!token){
    
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    //   console.log("Decoded user:", req.user);  
      next();
  } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ message: 'Invalid token', error: err.message });
  }
};


export default authenticateJWT;