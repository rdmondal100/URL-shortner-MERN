import URL from "../models/url.model.js"




const handleAllUrls = async (req, res) => {

  try {
    const allUrls = await URL.find({}).sort({createdAt:-1})
    console.log(allUrls)
    if (!allUrls) return res.status(400).json({ error: "No urls found" })
    res.status(200).json(allUrls)
  } catch (error) {
    res.status(500).json(error, "Internal Server Error")
  }
}

export default handleAllUrls