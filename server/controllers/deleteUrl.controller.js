import URL from "../models/url.model.js"

const handleDeleteUrl = async (req, res) => {
  try {
    const { shortId } = req.params
    const deleted = await URL.findOneAndDelete({
      shortId,
      owner: req.user?._id,
    })

    if (!deleted) {
      return res.status(404).json({ error: "Short URL not found" })
    }

    return res.status(200).json({ shortId })
  } catch {
    return res.status(500).json({ error: "Failed to delete short URL" })
  }
}

export default handleDeleteUrl
