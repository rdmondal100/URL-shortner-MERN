
import express from 'express'
import urlRouter from "./routes/url.route.js"
import connectToMongooDB from "./connectDb.js"
import cors from 'cors';

const app = express()


const PORT = 8001
app.use(express.json())
app.use(cors())
app.use("/", urlRouter)

connectToMongooDB("mongodb+srv://chittomondal100:75hzpETZOzdwfYz6@url.ylfmr.mongodb.net/?retryWrites=true&w=majority&appName=url")
  .then(() => {



    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
    })

  }).catch((error) => {
      console.log("Failed to connect with  database")
  })

