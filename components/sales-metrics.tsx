"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Clock, DollarSign, CheckCircle } from "lucide-react"

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const cards = [
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      subtitle: "All time orders",
      icon: ShoppingCart,
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-500",
    },
    {
      title: "Pending",
      value: metrics.pendingOrders.toString(),
      subtitle: "Awaiting processing",
      icon: Clock,
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-500",
    },
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      subtitle: "Sales revenue",
      icon: DollarSign,
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-500",
    },
    {
      title: "Delivered",
      value: metrics.deliveredOrders.toString(),
      subtitle: "Completed orders",
      icon: CheckCircle,
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-full p-2 ${card.iconBg}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
