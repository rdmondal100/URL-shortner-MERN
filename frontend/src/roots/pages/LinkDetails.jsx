import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowLeft, Check, Copy, Download, ExternalLink, MousePointerClick, QrCode, ShieldCheck, Trash2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import Loader from "../../components/Loader"
import ErrorPopUp from "../../components/ErrorPopUp"
import timeAgo from "../../utils/timesAgo"
import { baseDomain } from "../../components/constants/baseDomain"
import { deleteShortUrl, getAllUrlsHistory, getUrlAnalytics } from "../../store/urlSlice"
import {
  buildDailyClicks,
  downloadQrCode,
  formatShortUrl,
  getClickCount,
  getQrCodeUrl,
  getVisitHistory,
  pickTopEntries,
} from "../../lib/linkMetrics"

const LinkDetails = () => {
  const { shortId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [copied, setCopied] = useState("")
  const [isDownloadingQr, setIsDownloadingQr] = useState(false)
  const { urlDetails, analyticsData, analyticsStatus, analyticsError, isSubmitting } = useSelector((state) => state.urlData)
  const { user } = useSelector((state) => state.authData)

  useEffect(() => {
    if (shortId) {
      dispatch(getUrlAnalytics(shortId))
      dispatch(getAllUrlsHistory())
    }
  }, [dispatch, shortId])

  const selectedLink = useMemo(() => {
    const historyMatch = urlDetails.find((item) => item.shortId === shortId)
    if (analyticsData?.shortId === shortId) {
      return { ...historyMatch, ...analyticsData }
    }
    return historyMatch || analyticsData || null
  }, [analyticsData, shortId, urlDetails])

  const visitHistory = getVisitHistory(selectedLink)
  const dailyClicks = useMemo(() => buildDailyClicks(visitHistory), [visitHistory])
  const deviceBreakdown = useMemo(() => pickTopEntries(visitHistory, "deviceType"), [visitHistory])
  const browserBreakdown = useMemo(() => pickTopEntries(visitHistory, "browser"), [visitHistory])
  const platformBreakdown = useMemo(() => pickTopEntries(visitHistory, "platform"), [visitHistory])
  const originBreakdown = useMemo(() => pickTopEntries(visitHistory, "referrer"), [visitHistory])

  const shortUrl = selectedLink?.shortId ? formatShortUrl(baseDomain, selectedLink.shortId) : ""
  const clickCount = getClickCount(selectedLink)
  const qrCodeUrl = shortUrl ? getQrCodeUrl(shortUrl) : ""

  const copyToClipboard = async (value) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(value)
    window.setTimeout(() => setCopied(""), 1500)
  }

  const handleDelete = async () => {
    if (!selectedLink?.shortId) return
    const confirmed = window.confirm("Delete this short link and its analytics history?")
    if (!confirmed) return

    try {
      await dispatch(deleteShortUrl(selectedLink.shortId)).unwrap()
      navigate("/")
    } catch {
      // Redux exposes the error message on the dashboard state.
    }
  }

  const handleDownloadQr = async () => {
    if (!qrCodeUrl) return

    try {
      setIsDownloadingQr(true)
      await downloadQrCode(qrCodeUrl, `${selectedLink?.shortId || "link"}-qr.png`)
    } finally {
      setIsDownloadingQr(false)
    }
  }

  if (analyticsStatus === "loading" && !selectedLink) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl border-border/80 bg-card/95 text-center">
          <CardHeader>
            <CardTitle>Loading analytics</CardTitle>
            <CardDescription>Fetching link details and charts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Loader />
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      {analyticsError ? <ErrorPopUp /> : null}

      <Card className="border-border/70 bg-card/95">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-md px-2.5 py-1" variant="secondary">Link details</Badge>
                <Badge className="rounded-md px-2.5 py-1" variant="outline">{selectedLink?.shortId || shortId}</Badge>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Performance, sharing, and visit history.</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  This view is built for the moment after a link is live: copy it, scan it, inspect activity, and decide what to do next.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-md" onClick={() => navigate("/")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button className="rounded-md" onClick={() => copyToClipboard(shortUrl)}>
                  {copied === shortUrl ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied === shortUrl ? "Copied" : "Copy"}
                </Button>
                <Button asChild className="rounded-md" variant="secondary">
                  <a href={shortUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </a>
                </Button>
                <Button className="rounded-md" disabled={isSubmitting} onClick={handleDelete} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Owner</p>
              <p className="mt-1 font-semibold">{user?.name || user?.email || "Workspace account"}</p>
              <p className="mt-1 max-w-[260px] truncate text-sm text-muted-foreground">{user?.email || "Signed in"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Shareable link</CardTitle>
            <CardDescription>Clean URL, source destination, and scan-ready QR.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-[1fr_180px]">
            <div className="min-w-0 rounded-md border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Short URL</p>
              <a className="mt-1 block truncate text-lg font-semibold text-primary hover:underline" href={shortUrl} rel="noreferrer" target="_blank">
                {shortUrl || "Unavailable"}
              </a>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">Destination</p>
              <a className="mt-1 block truncate text-sm text-muted-foreground hover:text-primary hover:underline" href={selectedLink?.redirectURL} rel="noreferrer" target="_blank">
                {selectedLink?.redirectURL || "Unknown"}
              </a>
            </div>
            <div className="space-y-2">
              <div className="rounded-md border border-border bg-white p-3">
                {qrCodeUrl ? <img alt={`QR code for ${shortUrl}`} className="aspect-square w-full" src={qrCodeUrl} /> : null}
              </div>
              <Button className="w-full rounded-md" disabled={!qrCodeUrl || isDownloadingQr} onClick={handleDownloadQr} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {isDownloadingQr ? "Downloading" : "Download QR"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Snapshot</CardTitle>
            <CardDescription>The high-signal details at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0 sm:grid-cols-2 sm:p-6 sm:pt-0">
            <MetricCard title="Clicks" value={clickCount} icon={MousePointerClick} />
            <MetricCard title="Created" value={selectedLink?.createdAt ? timeAgo(selectedLink.createdAt) : "Recently"} icon={ShieldCheck} />
            <MetricCard title="Alias" value={selectedLink?.shortId || shortId} icon={ExternalLink} />
            <MetricCard title="QR asset" value={qrCodeUrl ? "Ready" : "Unavailable"} icon={QrCode} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Click trend</CardTitle>
            <CardDescription>Daily clicks for the last two weeks.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyClicks} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="detailClickGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#detailClickGradient)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <CardTitle>Audience breakdown</CardTitle>
            <CardDescription>Device click mix with supporting platform, browser, and referrer data.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-0 sm:p-6 sm:pt-0">
            <DevicePieChart data={deviceBreakdown} />
            <div className="grid gap-3 sm:grid-cols-3">
              <CompactChart title="Platform" data={platformBreakdown} />
              <CompactChart title="Browser" data={browserBreakdown} />
              <CompactChart title="Origin" data={originBreakdown} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/95">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
          <CardTitle>Recent visits</CardTitle>
          <CardDescription>Latest click events captured for this short link.</CardDescription>
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
                  <tr className="border-t border-border bg-background/60" key={`${shortId}-visit-${index}`}>
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

const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="min-w-0 rounded-md border border-border bg-background/70 p-4">
    <div className="flex items-center gap-3">
      <div className="rounded-md bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
        <p className="mt-1 truncate text-lg font-semibold">{value}</p>
      </div>
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

const DevicePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="rounded-md border border-border bg-background/70 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Clicks by device</p>
          <p className="mt-1 text-2xl font-semibold">{total}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total captured device clicks for this link.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {data.length ? data.map((entry, index) => (
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/70 px-3 py-2" key={entry.label}>
                <span className="inline-flex min-w-0 items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }} />
                  <span className="truncate">{entry.label}</span>
                </span>
                <span className="text-sm font-semibold">{entry.value}</span>
              </div>
            )) : (
              <div className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground sm:col-span-2">
                No device data yet.
              </div>
            )}
          </div>
        </div>
        <div className="h-64 flex-1">
          {data.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius="48%"
                  nameKey="label"
                  outerRadius="82%"
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.label} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
              No data
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkDetails
