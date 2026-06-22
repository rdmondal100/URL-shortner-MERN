import URL from "../models/url.model.js"
import { parseVisitorInfo } from "../utils/visitorInfo.js"



const handleShortIdandRedirect = async (req, res) => {
  try {
    const shortId = req.params.shortId
    const visitorInfo = parseVisitorInfo(req)
    const entry = await URL.findOneAndUpdate(
      {
        shortId
      }
      ,
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
            platform: visitorInfo.platform,
            os: visitorInfo.platform,
            deviceType: visitorInfo.deviceType,
            browser: visitorInfo.browser,
            referrer: visitorInfo.referrer,
            ipAddress: visitorInfo.ipAddress,
          }
        }
      },
      {
        new: true
      }
    )
    if (!entry) {
      return res.status(404).json({ error: "Short url not found" })
    }

    res.redirect(entry.redirectURL)
  } catch (error) {
    res.status(500).json({error: "Internal server error"})
  }
}

export default handleShortIdandRedirect