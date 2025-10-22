"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, DollarSign } from "lucide-react"

interface HRMetrics {
  totalEmployees: number
  activeEmployees: number
  onLeave: number
  totalPayroll: number
  averageSalary: number
}

export function HRMetrics() {
  const [metrics, setMetrics] = useState<HRMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/hr/payroll")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch HR metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!metrics) return null

  const cards = [
    {
      title: "Total Employees",
      value: metrics.totalEmployees.toString(),
      subtitle: `${metrics.activeEmployees} active`,
      icon: Users,
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-500",
    },
    {
      title: "Active",
      value: metrics.activeEmployees.toString(),
      subtitle: "Currently working",
      icon: UserCheck,
      iconBg: "bg-green-500/10 dark:bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-500",
    },
    {
      title: "On Leave",
      value: metrics.onLeave.toString(),
      subtitle: "Temporary absence",
      icon: Clock,
      iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-500",
    },
    {
      title: "Total Payroll",
      value: `$${(metrics.totalPayroll / 1000).toFixed(0)}K`,
      subtitle: `Avg: $${(metrics.averageSalary / 1000).toFixed(0)}K`,
      icon: DollarSign,
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
