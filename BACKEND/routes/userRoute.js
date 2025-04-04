import express from "express"
const router = express.Router();
import authenticateJWT from "../middlewares/authenticateJWT.js"
import { Login, signUp, Logout, checkAuth } from "../controllers/userController.js";


router.post("/signup", signUp)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/check-auth", authenticateJWT, checkAuth);

export default router;