import express from "express"

import handleGenerateNewShortCode from "../controllers/url.controller.js"
import handleShortIdandRedirect from "../controllers/shortId.controller.js"
import handleAnalytics from "../controllers/analytics.controller.js"
import handleAllUrls from "../controllers/allUrls.controller.js"
import handleDeleteUrl from "../controllers/deleteUrl.controller.js"
import requireAuth from "../middleware/auth.middleware.js"

const router = express.Router()



router.route("/url").post(requireAuth, handleGenerateNewShortCode)
router.route("/url/:shortId").delete(requireAuth, handleDeleteUrl)
router.route("/allUrls").get(requireAuth, handleAllUrls)
router.route("/analytics/:shortId").get(requireAuth, handleAnalytics)
router.route("/:shortId").get(handleShortIdandRedirect)

export default router
