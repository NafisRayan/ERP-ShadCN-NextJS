"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { DashboardCharts } from "@/components/dashboard-charts"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
              <p className="text-muted-foreground mt-2">Here's your business overview for today</p>
            </div>

            <DashboardMetrics />

            {/* Alerts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  12 items are running low on stock. Review inventory levels.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">5 purchase orders are pending approval.</AlertDescription>
              </Alert>
            </div>

            <DashboardCharts />

            {/* Recent Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Order #1234 confirmed", time: "2 hours ago", type: "order" },
                    { action: "Inventory updated for SKU-001", time: "4 hours ago", type: "inventory" },
                    { action: "Invoice #INV-567 sent to customer", time: "6 hours ago", type: "invoice" },
                    { action: "New employee John Doe added", time: "1 day ago", type: "hr" },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <div className="px-2 py-1 bg-muted/50 rounded text-xs font-medium capitalize">
                        {activity.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
