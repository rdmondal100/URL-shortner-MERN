import URL from "../models/url.model.js";


const handleAnalytics = async(req,res)=>{

  try {
    const shortId = req.params.shortId
    // console.log(req.params)
    console.log("get the short id:",shortId)
    const result = await URL.findOne({shortId})
    console.log("result is : ")
    console.log(result.visitHistory)
    if(!result){
      console.error(`No URL found for shortId: ${shortId}`);

      return res.status(404).json({error:"Short URL not found"})
    }
    res.status(200).json({
      clicks:result.visitHistory.length,
      timestams:result.visitHistory
    })
  } catch (error) {
    res.status(500).json({error:"Failed to get the visit history"})
  }

}


export default handleAnalytics