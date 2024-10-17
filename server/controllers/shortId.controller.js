import URL from "../models/url.model.js"



const handleShortIdandRedirect = async (req, res) => {
  try {
    const shortId = req.params.shortId
    console.log(req.params)
    console.log(shortId)
    const entry = await URL.findOneAndUpdate(
      {
        shortId
      }
      ,
      {
        $push: {
          visitHistory: {
            timestamp: Date.now()
          }
        }
      },
      {
        new: true
      }
    )
    console.log(entry)
    if (!entry) {
      console.log("NO URL found for : ", shortId)
      return res.status(404).json({ error: "Short url not found" })
    }

    console.log(`Redirecting to : ${entry.redirectURL}`)
    res.redirect(entry.redirectURL)
  } catch (error) {
    console.log(`Error during shortId redirection: ${error}`)
    res.status(500).json({error: "Internal server error"})
  }
}

export default handleShortIdandRedirect