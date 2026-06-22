import jwt from "jsonwebtoken"

import User from "../models/user.model.js"

const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || ""

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const token = authorization.slice(7)
    const secret = process.env.JWT_SECRET || "dev-secret-change-me"
    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.userId).select("_id name email createdAt")

    if (!user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: "Authentication required" })
  }
}

export default requireAuth