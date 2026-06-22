import URL from "../models/url.model.js"




const handleAllUrls = async (req, res) => {

  try {
    const query = req.user?._id ? { owner: req.user._id } : {}
    const allUrls = await URL.find(query).sort({createdAt:-1}).lean()
    const normalized = allUrls.map((item) => ({
      ...item,
      clicks: item.visitHistory?.length ?? 0,
    }))
    res.status(200).json(normalized)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export default handleAllUrls