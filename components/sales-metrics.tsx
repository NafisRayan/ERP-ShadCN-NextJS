"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SalesMetrics {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  deliveredOrders: number
}

interface SalesMetricsProps {
  refreshTrigger: number
}

export function SalesMetrics({ refreshTrigger }: SalesMetricsProps) {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/sales/orders")
        const orders = await response.json()

        const totalOrders = orders.length
        const pendingOrders = orders.filter((o: any) => o.status === "pending").length
        const deliveredOrders = orders.filter((o: any) => o.status === "delivered").length
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)

        setMetrics({
          totalOrders,
          pendingOrders,
          totalRevenue,
          deliveredOrders,
        })
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.deliveredOrders}</div>
        </CardContent>
      </Card>
    </div>
  )
}
