import dotenv from 'dotenv';
dotenv.config({ path: '.env' })

import express from 'express'
import urlRouter from "./routes/url.route.js"
import connectToMongooDB from "./connectDb.js"
import cors from 'cors';

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// app.use(cors())

app.use("/", urlRouter)


connectToMongooDB(process.env.MONGODB_URL)
  .then(() => {


    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
    })

  }).catch((error) => {
    console.log("Failed to connect with  database")
  })

