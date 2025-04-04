import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/userRoute.js"
import taskRoutes from "./routes/taskRoute.js"
import teamRoutes from "./routes/teamRoute.js"
import dbConnect from "./dbConnect.js"
import authenticateJWT from "./middlewares/authenticateJWT.js"
import path from "path";

const app = express()
const PORT = process.env.PORT || 4001

dbConnect()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173", 
      "https://task-manager-frontend-orcin-delta.vercel.app"
    ],
    credentials:true
}))

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res)=>{

    res.json({message:"All Clear"});

})


app.use("/auth", userRoutes)
app.use("/task", taskRoutes) 
app.use("/team", teamRoutes)

app.listen(PORT, ()=>{

    console.log(`Listening on Port: ${PORT}`);

})