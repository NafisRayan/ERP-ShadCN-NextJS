"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"

interface Metrics {
  totalRevenue: number
  totalOrders: number
  totalInventoryValue: number
  totalEmployees: number
  pendingOrders: number
  lowStockItems: number
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/dashboard/metrics")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Icons.TrendingUp />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Icons.ArrowUpRight />
            <span>+20.1% from last month</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Icons.ShoppingCart />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-yellow-500">{metrics.pendingOrders} pending</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <Icons.Package />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalInventoryValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Icons.ArrowDownRight />
            <span>{metrics.lowStockItems} low stock items</span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          <Icons.Users />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Icons.ArrowUpRight />
            <span>+8 new hires</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
