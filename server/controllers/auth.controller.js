import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/user.model.js"

const tokenSecret = process.env.JWT_SECRET || "dev-secret-change-me"

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    tokenSecret,
    { expiresIn: "7d" }
  )

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
})

export const handleRegister = async (req, res) => {
  try {
    const name = req.body?.name?.trim() || ""
    const email = req.body?.email?.trim().toLowerCase()
    const password = req.body?.password || ""

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: "That email is already registered" })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash })
    const token = createToken(user)

    return res.status(201).json({ token, user: sanitizeUser(user) })
  } catch (error) {
    return res.status(500).json({ error: "Failed to register user" })
  }
}

export const handleLogin = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase()
    const password = req.body?.password || ""

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = createToken(user)
    return res.status(200).json({ token, user: sanitizeUser(user) })
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" })
  }
}

export const handleMe = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) })
}