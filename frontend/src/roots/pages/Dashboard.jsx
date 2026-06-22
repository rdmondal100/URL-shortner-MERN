import { useSelector } from "react-redux"

import AuthPanel from "../../components/AuthPanel"
import DashboardPanel from "../../components/DashboardPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

const Dashboard = () => {
  const { isAuthenticated, bootstrapStatus } = useSelector((state) => state.authData)

  if (bootstrapStatus === "loading") {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl border-border/80 bg-card/95 text-center backdrop-blur">
          <CardHeader>
            <CardTitle>Restoring your session</CardTitle>
            <CardDescription>Checking your account before loading the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return isAuthenticated ? <DashboardPanel /> : <AuthPanel />
}

export default Dashboard
