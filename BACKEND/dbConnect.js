import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const MONGO_URI = process.env.MONGO_URI
// console.log(MONGO_URI)

const dbConnect = async () =>{

    try{

        await mongoose.connect(MONGO_URI)
        console.log("Sucessfully Connected to Database")

    }

    catch(error){

        console.log("Error Connecting to Database");
        

    }

}

export default dbConnect;