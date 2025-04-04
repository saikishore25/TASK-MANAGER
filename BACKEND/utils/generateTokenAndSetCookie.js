import jwt from "jsonwebtoken";


const generateTokenAndSetCookie = async (res, payload) => {
    
    const SECRET_KEY = process.env.JWT_SECRET;
    
    try{
        const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        console.log(token)
        res.cookie("authToken", token, {
            
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "Strict", // Prevent CSRF,
            maxAge: 3600000
        
        });
        return token;
    } 

    catch(error){

        throw new Error(`JWT generation failed: ${error.message}`);
    }

};

export default generateTokenAndSetCookie;
