import mongoose from "mongoose"

const connectToMongooDB = async (url) => { 
  return mongoose.connect(url)
}

export default connectToMongooDB