import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, Link2, Loader2, Sparkles } from "lucide-react"

import AuthPanel from "../../components/AuthPanel"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { baseDomain } from "../../components/constants/baseDomain"
import { formatShortUrl } from "../../lib/linkMetrics"
import urlSchemaValidation from "../../schemaValidatino/urlSchemaValidation"
import { createShortUrl, getAllUrlsHistory, getUrlAnalytics } from "../../store/urlSlice"

const CreateLink = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.authData)
  const { currentShortUrl, errorMessage, isLoading } = useSelector((state) => state.urlData)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { url: "", customAlias: "" },
    resolver: zodResolver(urlSchemaValidation),
  })

  const aliasPreview = watch("customAlias")
  const previewAlias = useMemo(() => aliasPreview?.trim() || "your-alias", [aliasPreview])

  const handleCreateLink = async (values) => {
    const payload = { url: values.url.trim() }

    if (values.customAlias?.trim()) {
      payload.shortId = values.customAlias.trim()
    }

    try {
      const created = await dispatch(createShortUrl(payload)).unwrap()
      reset({ url: "", customAlias: "" })
      dispatch(getAllUrlsHistory())
      dispatch(getUrlAnalytics(created.shortId))
      navigate(`/links/${created.shortId}`)
    } catch {
      // Redux exposes the error message.
    }
  }

  if (!isAuthenticated) {
    return <AuthPanel />
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <Card className="border-border/70 bg-card/95">
        <CardContent className="p-5 sm:p-6">
          <div className="space-y-4">
            <Badge className="w-fit gap-2 rounded-md px-2.5 py-1" variant="secondary">
              <Sparkles className="h-3.5 w-3.5" />
              Create link
            </Badge>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Build a short link that is ready to share.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Add a destination, choose a clean alias when it matters, then review the link details and QR asset.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <InfoTile label="Alias preview" value={formatShortUrl(baseDomain, previewAlias)} />
              <InfoTile
                label="Latest link"
                value={currentShortUrl?.shortId ? formatShortUrl(baseDomain, currentShortUrl.shortId) : "None yet"}
              />
            </div>
            <Button className="rounded-md" onClick={() => navigate("/dashboard")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/95">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
          <CardTitle>Create short link</CardTitle>
          <CardDescription>Use a custom alias when the link will be shared publicly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
          <form className="space-y-4" onSubmit={handleSubmit(handleCreateLink)}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="url">Destination</label>
              <Input
                id="url"
                className="h-11 rounded-md bg-background/70"
                placeholder="https://example.com/product-launch"
                {...register("url")}
              />
              {errors.url?.message ? <p className="text-sm text-destructive">{errors.url.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="customAlias">Custom alias</label>
              <Input
                id="customAlias"
                className="h-11 rounded-md bg-background/70"
                placeholder="summer-launch"
                {...register("customAlias")}
              />
              {errors.customAlias?.message ? <p className="text-sm text-destructive">{errors.customAlias.message}</p> : null}
            </div>

            <div className="rounded-md border border-border bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
              Preview: <span className="font-medium text-foreground">{formatShortUrl(baseDomain, previewAlias)}</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="h-11 flex-1 rounded-md" disabled={isLoading} type="submit">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                Shorten
              </Button>
              <Button className="h-11 rounded-md" onClick={() => reset({ url: "", customAlias: "" })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>

          {errorMessage ? <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div> : null}
        </CardContent>
      </Card>
    </section>
  )
}

const InfoTile = ({ label, value }) => (
  <div className="min-w-0 rounded-md border border-border bg-background/70 p-4">
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
    <p className="mt-1 truncate text-sm font-semibold">{value}</p>
  </div>
)

export default CreateLink
