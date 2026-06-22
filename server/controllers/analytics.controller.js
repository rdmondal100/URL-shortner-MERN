import URL from "../models/url.model.js";
import { summarizeVisits } from "../utils/visitorInfo.js";


const handleAnalytics = async(req,res)=>{

  try {
    const shortId = req.params.shortId
    const result = await URL.findOne({shortId, owner: req.user?._id || undefined})
    if(!result){
      return res.status(404).json({error:"Short URL not found"})
    }
    const visitSummary = summarizeVisits(result.visitHistory)
    res.status(200).json({
      clicks:result.visitHistory.length,
      timestamps:result.visitHistory,
      shortId: result.shortId,
      redirectURL: result.redirectURL,
      createdAt: result.createdAt,
      ...visitSummary,
    })
  } catch (error) {
    res.status(500).json({error:"Failed to get the visit history"})
  }

}


export default handleAnalytics