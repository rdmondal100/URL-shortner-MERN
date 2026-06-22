export const formatShortUrl = (baseDomain, shortId) => `${baseDomain}${shortId}`

export const formatDayKey = (date) => date.toISOString().slice(0, 10)

export const buildRecentDays = (count = 14) => {
  const days = []

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - index)
    days.push({
      key: formatDayKey(date),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    })
  }

  return days
}

export const getClickCount = (link) => link?.clicks ?? link?.visitHistory?.length ?? link?.timestamps?.length ?? 0

export const getVisitHistory = (link) => link?.timestamps || link?.visitHistory || []

export const pickTopEntries = (values = [], field, limit = 4) => {
  const counts = values.reduce((accumulator, entry) => {
    const label = entry?.[field] || "Other"
    accumulator[label] = (accumulator[label] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }))
}

export const buildDailyClicks = (visitHistory = [], days = 14) => {
  const grouped = visitHistory.reduce((accumulator, entry) => {
    const day = formatDayKey(new Date(entry.timestamp))
    accumulator[day] = (accumulator[day] || 0) + 1
    return accumulator
  }, {})

  return buildRecentDays(days).map((day) => ({
    label: day.label,
    clicks: grouped[day.key] || 0,
  }))
}

export const getWorkspaceMetrics = (links = []) => {
  const totalLinks = links.length
  const totalClicks = links.reduce((sum, item) => sum + getClickCount(item), 0)
  const averageClicks = totalLinks ? (totalClicks / totalLinks).toFixed(1) : "0.0"
  const topLink = [...links].sort((left, right) => getClickCount(right) - getClickCount(left))[0] || null
  const newestLink = [...links].sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))[0] || null

  return { totalLinks, totalClicks, averageClicks, topLink, newestLink }
}

export const getQrCodeUrl = (value) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=16&data=${encodeURIComponent(value)}`

export const downloadQrCode = async (qrCodeUrl, fileName = "qr-code.png") => {
  if (!qrCodeUrl) return

  const response = await fetch(qrCodeUrl)
  if (!response.ok) {
    throw new Error("Unable to download QR code")
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
