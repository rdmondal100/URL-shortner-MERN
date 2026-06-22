
import { nanoid } from 'nanoid'

import URL from "../models/url.model.js"
import { parseVisitorInfo } from "../utils/visitorInfo.js"

const aliasPattern = /^[a-zA-Z0-9][a-zA-Z0-9-_]{2,39}$/

const handleGenerateNewShortCode = async (req, res) => {
  try {
    const url = req.body?.url?.trim()
    const customAlias = req.body?.shortId?.trim() || req.body?.customAlias?.trim()

    if (!url) {
      return res.status(400).json({ error: "Url is required" })
    }

    let parsedUrl
    try {
      parsedUrl = new globalThis.URL(url)
    } catch {
      return res.status(400).json({ error: "Please enter a valid URL" })
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: "Only http and https URLs are supported" })
    }

    if (customAlias && !aliasPattern.test(customAlias)) {
      return res.status(400).json({
        error: "Custom alias must be 3-40 characters and use letters, numbers, hyphens, or underscores.",
      })
    }

    const shortId = customAlias || nanoid(8)
    const existing = await URL.findOne({ shortId })

    if (existing) {
      return res.status(409).json({
        error: customAlias
          ? "That custom alias is already taken"
          : "Unable to generate a unique short code, please try again",
      })
    }

    const newUrl = await URL.create({
      shortId,
      redirectURL: parsedUrl.toString(),
      visitHistory: [],
      owner: req.user?._id || null,
    })

    return res.status(201).json(newUrl)
  } catch (error) {
    return res.status(500).json({ error: "Failed to create short URL" })
  }
}

export default handleGenerateNewShortCode