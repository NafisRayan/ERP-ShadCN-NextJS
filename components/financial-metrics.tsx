"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react"

interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  profit: number
  pendingInvoices: number
  overdueInvoices: number
}

interface FinancialMetricsProps {
  refreshTrigger: number
}

export function FinancialMetrics({ refreshTrigger }: FinancialMetricsProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/financial/reports")
        const data = await response.json()
        setMetrics(data)
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const cards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      subtitle: "Income generated",
      icon: TrendingUp,
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-500",
    },
    {
      title: "Total Expenses",
      value: `$${metrics.totalExpenses.toLocaleString()}`,
      subtitle: "Operating costs",
      icon: TrendingDown,
      iconBg: "bg-red-500/10 dark:bg-red-500/20",
      iconColor: "text-red-600 dark:text-red-500",
    },
    {
      title: "Profit",
      value: `$${metrics.profit.toLocaleString()}`,
      subtitle: metrics.profit >= 0 ? "Net positive" : "Net negative",
      icon: metrics.profit >= 0 ? TrendingUp : TrendingDown,
      iconBg: metrics.profit >= 0 ? "bg-blue-500/10 dark:bg-blue-500/20" : "bg-red-500/10 dark:bg-red-500/20",
      iconColor: metrics.profit >= 0 ? "text-blue-600 dark:text-blue-500" : "text-red-600 dark:text-red-500",
    },
    {
      title: "Pending",
      value: `$${metrics.pendingInvoices.toLocaleString()}`,
      subtitle: "Awaiting payment",
      icon: Clock,
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-500",
    },
    {
      title: "Overdue",
      value: `$${metrics.overdueInvoices.toLocaleString()}`,
      subtitle: "Past due date",
      icon: AlertCircle,
      iconBg: "bg-red-500/10 dark:bg-red-500/20",
      iconColor: "text-red-600 dark:text-red-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
