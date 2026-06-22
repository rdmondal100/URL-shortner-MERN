import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Filter,
  Link2,
  QrCode,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { deleteShortUrl, getAllUrlsHistory, getUrlAnalytics } from "../store/urlSlice"
import { baseDomain } from "./constants/baseDomain"
import timeAgo from "../utils/timesAgo"
import {
  buildDailyClicks,
  downloadQrCode,
  formatShortUrl,
  getClickCount,
  getQrCodeUrl,
  getVisitHistory,
  getWorkspaceMetrics,
  pickTopEntries,
} from "../lib/linkMetrics"

const sortOptions = {
  newest: "Newest",
  clicks: "Most clicked",
  alias: "Alias A-Z",
}

const DashboardPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    urlDetails,
    currentShortUrl,
    analyticsData,
    analyticsStatus,
    isSubmitting,
  } = useSelector((state) => state.urlData)
  const [copiedValue, setCopiedValue] = useState("")
  const [selectedShortId, setSelectedShortId] = useState("")
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isDownloadingQr, setIsDownloadingQr] = useState(false)

  useEffect(() => {
    dispatch(getAllUrlsHistory())
  }, [dispatch])

  useEffect(() => {
    if (!selectedShortId && currentShortUrl?.shortId) {
      setSelectedShortId(currentShortUrl.shortId)
    }
  }, [currentShortUrl, selectedShortId])

  useEffect(() => {
    if (!selectedShortId && urlDetails[0]?.shortId) {
      setSelectedShortId(urlDetails[0].shortId)
    }
  }, [urlDetails, selectedShortId])

  useEffect(() => {
    if (selectedShortId) {
      dispatch(getUrlAnalytics(selectedShortId))
    }
  }, [dispatch, selectedShortId])

  const selectedLink = useMemo(
    () => urlDetails.find((item) => item.shortId === selectedShortId) || currentShortUrl || urlDetails[0] || null,
    [currentShortUrl, selectedShortId, urlDetails]
  )

  const analyticsSource = analyticsData?.shortId === selectedShortId ? analyticsData : null
  const mergedSelectedLink = selectedLink && analyticsSource ? { ...selectedLink, ...analyticsSource } : selectedLink
  const visitHistory = getVisitHistory(mergedSelectedLink)
  const overview = useMemo(() => getWorkspaceMetrics(urlDetails), [urlDetails])

  const dailyClicks = useMemo(() => buildDailyClicks(visitHistory), [visitHistory])
  const deviceBreakdown = useMemo(() => pickTopEntries(visitHistory, "deviceType"), [visitHistory])
  const platformBreakdown = useMemo(() => pickTopEntries(visitHistory, "platform"), [visitHistory])
  const browserBreakdown = useMemo(() => pickTopEntries(visitHistory, "browser"), [visitHistory])
  const originBreakdown = useMemo(() => pickTopEntries(visitHistory, "referrer"), [visitHistory])

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const searched = normalizedQuery
      ? urlDetails.filter((item) => {
          const shortUrl = formatShortUrl(baseDomain, item.shortId).toLowerCase()
          return (
            shortUrl.includes(normalizedQuery) ||
            item.shortId?.toLowerCase().includes(normalizedQuery) ||
            item.redirectURL?.toLowerCase().includes(normalizedQuery)
          )
        })
      : urlDetails

    return [...searched].sort((left, right) => {
      if (sortBy === "clicks") return getClickCount(right) - getClickCount(left)
      if (sortBy === "alias") return left.shortId.localeCompare(right.shortId)
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
    })
  }, [query, sortBy, urlDetails])

  const copyToClipboard = async (value) => {
    await navigator.clipboard.writeText(value)
    setCopiedValue(value)
    window.setTimeout(() => setCopiedValue(""), 1400)
  }

  const handleDelete = async (shortId) => {
    const confirmed = window.confirm("Delete this short link and its analytics history?")
    if (!confirmed) return

    try {
      await dispatch(deleteShortUrl(shortId)).unwrap()
      const nextLink = urlDetails.find((item) => item.shortId !== shortId)
      setSelectedShortId(nextLink?.shortId || "")
    } catch {
      // Redux exposes the error message.
    }
  }

  const selectedShortUrl = mergedSelectedLink ? formatShortUrl(baseDomain, mergedSelectedLink.shortId) : ""
  const qrCodeUrl = selectedShortUrl ? getQrCodeUrl(selectedShortUrl) : ""

  const handleDownloadQr = async () => {
    if (!qrCodeUrl || !mergedSelectedLink?.shortId) return

    try {
      setIsDownloadingQr(true)
      await downloadQrCode(qrCodeUrl, `${mergedSelectedLink.shortId}-qr.png`)
    } finally {
      setIsDownloadingQr(false)
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="border-border/70 bg-card/95">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge className="w-fit gap-2 rounded-md px-2.5 py-1" variant="secondary">
                <Link2 className="h-3.5 w-3.5" />
                Dashboard
              </Badge>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Good links, fast decisions.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Inspect performance, copy QR assets, and keep your link inventory tidy from one focused dashboard.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-md" onClick={() => navigate("/create-link")}>
                <Link2 className="mr-2 h-4 w-4" />
                New link
              </Button>
              <Button asChild className="rounded-md" variant="outline">
                <a href="#links">
                  <Search className="mr-2 h-4 w-4" />
                  Browse
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile title="Links" value={overview.totalLinks} hint="Total owned" />
            <StatTile title="Clicks" value={overview.totalClicks} hint="All time" />
            <StatTile title="Average" value={overview.averageClicks} hint="Clicks per link" />
            <StatTile
              title="Top link"
              value={overview.topLink ? overview.topLink.shortId : "None"}
              hint={overview.topLink ? `${getClickCount(overview.topLink)} clicks` : "Create one"}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>Selected link</CardTitle>
                <CardDescription>Share, inspect, and manage the active short URL.</CardDescription>
              </div>
              {analyticsStatus === "loading" ? <Badge variant="secondary">Refreshing analytics</Badge> : <Badge variant="outline">Ready</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
            {mergedSelectedLink ? (
              <>
                <div className="rounded-md border border-border bg-background/70 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Short URL</p>
                      <a className="mt-1 block truncate text-lg font-semibold text-primary hover:underline" href={selectedShortUrl} rel="noreferrer" target="_blank">
                        {selectedShortUrl}
                      </a>
                      <a className="mt-2 block truncate text-sm text-muted-foreground hover:text-primary hover:underline" href={mergedSelectedLink.redirectURL} rel="noreferrer" target="_blank">
                        {mergedSelectedLink.redirectURL}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <IconButton label={copiedValue === selectedShortUrl ? "Copied" : "Copy"} onClick={() => copyToClipboard(selectedShortUrl)}>
                        {copiedValue === selectedShortUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </IconButton>
                      <IconButton label="Open" onClick={() => window.open(selectedShortUrl, "_blank", "noopener,noreferrer")}>
                        <ExternalLink className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Details" onClick={() => navigate(`/links/${mergedSelectedLink.shortId}`)}>
                        <ArrowUpRight className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniTile label="Clicks" value={getClickCount(mergedSelectedLink)} />
                  <MiniTile label="Created" value={timeAgo(mergedSelectedLink.createdAt)} />
                  <MiniTile label="Alias" value={mergedSelectedLink.shortId} />
                </div>
              </>
            ) : (
              <EmptyState title="No link selected" description="Create a link or choose one from your inventory." />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>QR handoff</CardTitle>
            <CardDescription>Useful for print, events, and mobile-first sharing.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            {selectedShortUrl ? (
              <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
                <div className="rounded-md border border-border bg-white p-3">
                  <img alt={`QR code for ${selectedShortUrl}`} className="aspect-square w-full" src={qrCodeUrl} />
                </div>
                <div className="space-y-3">
                  <div className="rounded-md bg-muted/30 p-3 text-sm">
                    <p className="font-medium">Scan-ready asset</p>
                    <p className="mt-1 text-muted-foreground">The QR code points to the currently selected short URL.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="rounded-md" disabled={isDownloadingQr} onClick={handleDownloadQr} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloadingQr ? "Downloading" : "Download"}
                    </Button>
                    <Button className="rounded-md" onClick={() => copyToClipboard(selectedShortUrl)} variant="secondary">
                      <QrCode className="mr-2 h-4 w-4" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="No QR yet" description="Create a link to generate a QR handoff." />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Click trend</CardTitle>
            <CardDescription>Recent clicks for the selected link.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyClicks} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="clickGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.26} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#clickGradient)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Audience mix</CardTitle>
            <CardDescription>Where selected-link clicks come from.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 sm:p-6 sm:pt-0">
            <CompactChart title="Platform" data={platformBreakdown} />
            <CompactChart title="Device" data={deviceBreakdown} />
            <CompactChart title="Browser" data={browserBreakdown} />
            <CompactChart title="Origin" data={originBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card id="links" className="border-border/70 bg-card/95">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <CardTitle>Link inventory</CardTitle>
              <CardDescription>Search, sort, open details, copy, or remove links.</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="h-10 min-w-[260px] rounded-md pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Search links" value={query} />
              </div>
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select className="h-10 bg-transparent text-sm outline-none" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {filteredLinks.length ? (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-muted/35 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Link</th>
                    <th className="px-4 py-3 text-left font-medium">Destination</th>
                    <th className="px-4 py-3 text-left font-medium">Clicks</th>
                    <th className="px-4 py-3 text-left font-medium">Created</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((item) => {
                    const shortUrl = formatShortUrl(baseDomain, item.shortId)
                    const isSelected = selectedShortId === item.shortId

                    return (
                      <tr className={`border-t border-border ${isSelected ? "bg-primary/[0.05]" : "bg-background/60"}`} key={item._id || item.shortId}>
                        <td className="px-4 py-3">
                          <button className="max-w-[220px] truncate font-medium text-primary hover:underline" onClick={() => setSelectedShortId(item.shortId)} type="button">
                            {shortUrl}
                          </button>
                          <div className="mt-1 flex gap-2">
                            <Badge className="rounded-md" variant={isSelected ? "default" : "outline"}>{item.shortId}</Badge>
                            {item.shortId === currentShortUrl?.shortId ? <Badge className="rounded-md" variant="secondary">Latest</Badge> : null}
                          </div>
                        </td>
                        <td className="max-w-[260px] truncate px-4 py-3 text-muted-foreground">{item.redirectURL}</td>
                        <td className="px-4 py-3 font-medium">{getClickCount(item)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{timeAgo(item.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <IconButton label="Copy" onClick={() => copyToClipboard(shortUrl)} variant="outline">
                              {copiedValue === shortUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </IconButton>
                            <IconButton label="Open details" onClick={() => navigate(`/links/${item.shortId}`)} variant="outline">
                              <ArrowUpRight className="h-4 w-4" />
                            </IconButton>
                            <IconButton label="Delete" onClick={() => handleDelete(item.shortId)} variant="outline" disabled={isSubmitting}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={query ? "No matching links" : "No links yet"}
              description={query ? "Try another destination, alias, or short URL." : "Create your first short link to start tracking clicks."}
            />
          )}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/95">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
          <CardTitle>Recent visits</CardTitle>
          <CardDescription>Latest captured events for the selected link.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/35 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-left font-medium">Platform</th>
                  <th className="px-4 py-3 text-left font-medium">Device</th>
                  <th className="px-4 py-3 text-left font-medium">Browser</th>
                  <th className="px-4 py-3 text-left font-medium">Origin</th>
                </tr>
              </thead>
              <tbody>
                {visitHistory.length ? visitHistory.slice(-10).reverse().map((visit, index) => (
                  <tr className="border-t border-border bg-background/60" key={`${selectedShortId}-visit-${index}`}>
                    <td className="px-4 py-3 text-muted-foreground">{timeAgo(visit.timestamp)}</td>
                    <td className="px-4 py-3">{visit.platform || visit.os || "Other"}</td>
                    <td className="px-4 py-3">{visit.deviceType || "Desktop"}</td>
                    <td className="px-4 py-3">{visit.browser || "Other"}</td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-muted-foreground">{visit.referrer || "Direct"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan="5">No visits recorded for this link yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

const StatTile = ({ title, value, hint }) => (
  <div className="min-w-0 rounded-md border border-border bg-background/70 p-3">
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
    <p className="mt-1 truncate text-2xl font-semibold">{value}</p>
    <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
  </div>
)

const MiniTile = ({ label, value }) => (
  <div className="min-w-0 rounded-md border border-border bg-background/70 p-3">
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
    <p className="mt-1 truncate text-sm font-semibold">{value}</p>
  </div>
)

const IconButton = ({ children, label, onClick, variant = "outline", disabled = false }) => (
  <Button className="rounded-md" disabled={disabled} onClick={onClick} size="sm" type="button" variant={variant}>
    {children}
    <span className="sr-only">{label}</span>
  </Button>
)

const EmptyState = ({ title, description }) => (
  <div className="flex min-h-[180px] items-center justify-center rounded-md border border-dashed border-border bg-muted/15 p-6 text-center">
    <div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
)

const CompactChart = ({ title, data }) => (
  <div className="rounded-md border border-border bg-background/70 p-3">
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
    <div className="mt-3 h-32">
      {data.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis type="category" dataKey="label" width={68} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
      )}
    </div>
  </div>
)

export default DashboardPanel
