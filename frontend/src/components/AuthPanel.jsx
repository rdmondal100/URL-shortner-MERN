import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BarChart3, CheckCircle2, Link2, Loader2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react"
import z from "zod"

import { registerUser, loginUser, clearAuthError } from "../store/authSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"

const authSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const capabilities = [
  { icon: Link2, title: "Custom aliases", detail: "Readable campaign links instead of random strings." },
  { icon: BarChart3, title: "Analytics", detail: "Clicks, devices, browsers, referrers, and recent visits." },
  { icon: ShieldCheck, title: "Private workspace", detail: "Every user sees only their own links and history." },
]

const AuthPanel = () => {
  const dispatch = useDispatch()
  const { authStatus, authError } = useSelector((state) => state.authData)
  const [mode, setMode] = useState("login")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    resolver: zodResolver(authSchema),
  })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch, mode])

  const onSubmit = async (values) => {
    const payload = {
      email: values.email,
      password: values.password,
    }

    try {
      if (mode === "register") {
        payload.name = values.name || ""
        await dispatch(registerUser(payload)).unwrap()
      } else {
        await dispatch(loginUser(payload)).unwrap()
      }

      reset()
    } catch {
      // Error is exposed from Redux.
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <div className="flex flex-col justify-center rounded-lg border border-border bg-card/95 p-5 shadow-sm sm:p-8">
        <Badge className="w-fit rounded-md px-2.5 py-1" variant="secondary">Link intelligence workspace</Badge>
        <div className="mt-5 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Short links built for the way modern teams actually share.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Create clean URLs, ship them with QR codes, and understand what happens after every click from a focused workspace.
          </p>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {capabilities.map((item) => (
            <div className="rounded-md border border-border bg-background/70 p-4" key={item.title}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <h2 className="font-medium">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Authenticated dashboards</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Branded aliases</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Visit intelligence</span>
        </div>
      </div>

      <Card className="border-border/80 bg-card/95">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
          <Badge className="w-fit rounded-md px-2.5 py-1" variant="secondary">
            {mode === "login" ? "Welcome back" : "Create account"}
          </Badge>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Sign in" : "Start your workspace"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Open your dashboard with your email and password."
              : "Register once, then start creating and tracking links."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/35 p-1">
            <Button className="rounded-md" onClick={() => setMode("login")} type="button" variant={mode === "login" ? "default" : "ghost"}>
              Login
            </Button>
            <Button className="rounded-md" onClick={() => setMode("register")} type="button" variant={mode === "register" ? "default" : "ghost"}>
              Register
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {mode === "register" ? (
              <Field label="Full name" error={errors.name?.message} icon={UserRound} id="name">
                <Input id="name" className="h-11 rounded-md pl-10" placeholder="Your name" {...register("name")} />
              </Field>
            ) : null}

            <Field label="Email" error={errors.email?.message} icon={Mail} id="email">
              <Input id="email" className="h-11 rounded-md pl-10" placeholder="name@example.com" type="email" {...register("email")} />
            </Field>

            <Field label="Password" error={errors.password?.message} icon={Lock} id="password">
              <Input id="password" className="h-11 rounded-md pl-10" placeholder="Minimum 8 characters" type="password" {...register("password")} />
            </Field>

            {authError ? <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{authError}</div> : null}

            <Button className="h-11 w-full rounded-md" disabled={authStatus === "loading"} type="submit">
              {authStatus === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "register" ? "Create account" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

const Field = ({ children, error, icon: Icon, id, label }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium" htmlFor={id}>{label}</label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      {children}
    </div>
    {error ? <p className="text-sm text-destructive">{error}</p> : null}
  </div>
)

export default AuthPanel
