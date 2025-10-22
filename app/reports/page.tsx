"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Business insights and performance metrics
            </p>
          </div>

          <ReportSummary />

          <Card>
            <CardHeader className="pb-3">
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

            <TabsContent value="trends" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Revenue & Orders Trend</CardTitle>
                  <CardDescription>Monthly revenue and order volume</CardDescription>
                </CardHeader>
                <CardContent>
                    {monthlyTrends.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          />
                          <YAxis 
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
                              color: "hsl(var(--popover-foreground))",
                            }}
                            itemStyle={{
                              color: "hsl(var(--popover-foreground))",
                            }}
                            labelStyle={{ 
                              color: "hsl(var(--popover-foreground))",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                          <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} />
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

            <TabsContent value="analysis" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader>
                      <CardTitle>Key Performance Indicators</CardTitle>
                      <CardDescription>Current business metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-muted-foreground">Order Fulfillment Rate</span>
                          <span className="font-bold">94%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-muted-foreground">Customer Retention</span>
                          <span className="font-bold">87%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-muted-foreground">Inventory Accuracy</span>
                          <span className="font-bold">99%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Vendor Performance</span>
                          <span className="font-bold">96%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Business Health</CardTitle>
                    <CardDescription>Overall system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm">System Uptime</span>
                        <span className="font-bold text-green-600 dark:text-green-500">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm">Data Integrity</span>
                        <span className="font-bold text-green-600 dark:text-green-500">100%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
