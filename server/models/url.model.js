
import mongoose from "mongoose"


const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  visitHistory: [
    {
      timestamp: { type: Number },
      platform: { type: String },
      os: { type: String },
      deviceType: { type: String },
      browser: { type: String },
      referrer: { type: String },
      ipAddress: { type: String },
    },
  ],

}, { timestamps: true })


const URL = mongoose.model("url", urlSchema)

export default URL