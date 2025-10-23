"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { DashboardCharts } from "@/components/dashboard-charts"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

interface AlertData {
  lowStockItems: number
  pendingOrders: number
  pendingPurchaseOrders: number
}

interface Activity {
  action: string
  time: string
  type: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState<AlertData | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setIsAuthenticated(true)
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchDashboardData = async () => {
      try {
        const [alertsResponse, activityResponse] = await Promise.all([
          fetch("/api/dashboard/alerts"),
          fetch("/api/dashboard/recent-activity")
        ])

        const alertsData = await alertsResponse.json()
        const activityData = await activityResponse.json()

        setAlerts(alertsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Here's your business overview for today
            </p>
          </div>

          <DashboardMetrics />

          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : (
              <>
                <Alert className="border-yellow-500/50 bg-yellow-500/10 dark:bg-yellow-500/5">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <AlertTitle className="text-yellow-700 dark:text-yellow-400">
                    Low Stock Alert
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700 dark:text-yellow-400/90">
                    {alerts?.lowStockItems || 0} items are running low on stock. Review inventory levels.
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/5">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  <AlertTitle className="text-blue-700 dark:text-blue-400">
                    Pending Approvals
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-400/90">
                    {alerts?.pendingPurchaseOrders || 0} purchase orders are pending approval.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>

          <DashboardCharts />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="w-fit capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity to display
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
