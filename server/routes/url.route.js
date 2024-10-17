import express from "express"

import handleGenerateNewShortCode from "../controllers/url.controller.js"
import handleShortIdandRedirect from "../controllers/shortId.controller.js"
import handleAnalytics from "../controllers/analytics.controller.js"
import handleAllUrls from "../controllers/allUrls.controller.js"

const router = express.Router()



router.route("/url").post(handleGenerateNewShortCode)
router.route("/allUrls").get(handleAllUrls)
router.route("/analytics/:shortId").get(handleAnalytics)
router.route("/:shortId").get(handleShortIdandRedirect)

export default router