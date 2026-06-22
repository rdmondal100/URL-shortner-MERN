const detectBrowser = (userAgent) => {
  const lowerUserAgent = userAgent.toLowerCase()

  if (lowerUserAgent.includes("edg/")) return "Edge"
  if (lowerUserAgent.includes("opr/") || lowerUserAgent.includes("opera")) return "Opera"
  if (lowerUserAgent.includes("firefox/")) return "Firefox"
  if (lowerUserAgent.includes("chrome/") && !lowerUserAgent.includes("edg/") && !lowerUserAgent.includes("opr/")) return "Chrome"
  if (lowerUserAgent.includes("safari/") && !lowerUserAgent.includes("chrome/")) return "Safari"
  if (lowerUserAgent.includes("bot") || lowerUserAgent.includes("crawl")) return "Bot"
  return "Other"
}

const detectPlatform = (userAgent) => {
  const lowerUserAgent = userAgent.toLowerCase()

  if (lowerUserAgent.includes("iphone")) return "iPhone"
  if (lowerUserAgent.includes("ipad")) return "iPad"
  if (lowerUserAgent.includes("android")) return lowerUserAgent.includes("mobile") ? "Android" : "Android Tablet"
  if (lowerUserAgent.includes("windows nt")) return "Windows"
  if (lowerUserAgent.includes("mac os x") || lowerUserAgent.includes("macintosh")) return "macOS"
  if (lowerUserAgent.includes("linux")) return "Linux"
  return "Other"
}

const detectDeviceType = (userAgent) => {
  const lowerUserAgent = userAgent.toLowerCase()

  if (lowerUserAgent.includes("bot") || lowerUserAgent.includes("crawl")) return "Bot"
  if (lowerUserAgent.includes("ipad") || lowerUserAgent.includes("tablet")) return "Tablet"
  if (lowerUserAgent.includes("mobi") || lowerUserAgent.includes("iphone") || lowerUserAgent.includes("android")) return "Mobile"
  return "Desktop"
}

export const parseVisitorInfo = (req) => {
  const userAgent = req.headers["user-agent"] || ""
  const forwardedFor = req.headers["x-forwarded-for"]
  const ipAddress = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(",")[0]?.trim() || req.ip || "unknown"

  return {
    userAgent,
    browser: detectBrowser(userAgent),
    platform: detectPlatform(userAgent),
    deviceType: detectDeviceType(userAgent),
    referrer: req.headers.referer || req.headers.referrer || "Direct",
    ipAddress,
  }
}

export const summarizeVisits = (visitHistory = []) => {
  const buildCounts = (field) => {
    return visitHistory.reduce((accumulator, visit) => {
      const key = visit[field] || "Other"
      accumulator[key] = (accumulator[key] || 0) + 1
      return accumulator
    }, {})
  }

  const toSeries = (counts) =>
    Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .map(([label, value]) => ({ label, value }))

  return {
    deviceSeries: toSeries(buildCounts("deviceType")),
    platformSeries: toSeries(buildCounts("platform")),
    browserSeries: toSeries(buildCounts("browser")),
    recentVisits: [...visitHistory].slice(-12).reverse(),
  }
}