"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { ReportSummary } from "@/components/report-summary"
import { ExportButtons } from "@/components/export-buttons"

export default function ReportsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }
    setIsAuthenticated(true)
    fetchTrends()
  }, [router])

  const fetchTrends = async () => {
    try {
      const response = await fetch("/api/reports/monthly-trends")
      const data = await response.json()
      setMonthlyTrends(data)
    } catch (error) {
      console.error("Failed to fetch trends:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-2">Business insights and performance metrics</p>
              </div>
            </div>

            <ReportSummary />

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Download reports in CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <ExportButtons />
              </CardContent>
            </Card>

            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Revenue & Orders Trend</CardTitle>
                    <CardDescription>Monthly revenue and order volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {monthlyTrends.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                          <YAxis stroke="var(--muted-foreground)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} />
                          <Line type="monotone" dataKey="orders" stroke="var(--chart-2)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Key Performance Indicators</CardTitle>
                      <CardDescription>Current business metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">Order Fulfillment Rate</span>
                          <span className="font-bold">94%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">Customer Retention</span>
                          <span className="font-bold">87%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">Inventory Accuracy</span>
                          <span className="font-bold">99%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Vendor Performance</span>
                          <span className="font-bold">96%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Business Health</CardTitle>
                      <CardDescription>Overall system status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">System Uptime</span>
                          <span className="font-bold text-green-600">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">Data Integrity</span>
                          <span className="font-bold text-green-600">100%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm">Active Users</span>
                          <span className="font-bold">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Last Backup</span>
                          <span className="font-bold">2 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
