import dotenv from 'dotenv';
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: resolve(__dirname, '.env') })

import express from 'express'
import urlRouter from "./routes/url.route.js"
import authRouter from "./routes/auth.route.js"
import connectToMongooDB from "./connectDb.js"
import cors from 'cors';

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.CORS_ORIGIN ,
  credentials: true
}))

app.use("/auth", authRouter)
app.use("/", urlRouter)


connectToMongooDB(process.env.MONGODB_URL)
  .then(() => {


    app.listen(PORT,"0.0.0.0", () => {
      console.log(`http://localhost:${PORT}`)
    })

  }).catch((error) => {
    console.error("Failed to connect with database", error)
  })

