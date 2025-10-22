"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowUpRight, ShoppingCart, Package, ArrowDownRight, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

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
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-28 mb-1" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: "+20.1% from last month",
      icon: TrendingUp,
      trend: "up",
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-500",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      change: `${metrics.pendingOrders} pending`,
      icon: ShoppingCart,
      trend: "neutral",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-500",
    },
    {
      title: "Inventory Value",
      value: `$${metrics.totalInventoryValue.toLocaleString()}`,
      change: `${metrics.lowStockItems} low stock items`,
      icon: Package,
      trend: "down",
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-500",
    },
    {
      title: "Active Employees",
      value: metrics.totalEmployees.toString(),
      change: "+8 new hires",
      icon: Users,
      trend: "up",
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={cn("rounded-full p-2", card.iconBg)}>
                <Icon className={cn("h-4 w-4", card.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {card.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-500" />}
                {card.trend === "down" && <ArrowDownRight className="h-3 w-3 text-orange-600 dark:text-orange-500" />}
                <span>{card.change}</span>
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
