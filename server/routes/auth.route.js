import express from "express"

import { handleLogin, handleMe, handleRegister } from "../controllers/auth.controller.js"
import requireAuth from "../middleware/auth.middleware.js"

const authRouter = express.Router()

authRouter.post("/register", handleRegister)
authRouter.post("/login", handleLogin)
authRouter.get("/me", requireAuth, handleMe)

export default authRouter