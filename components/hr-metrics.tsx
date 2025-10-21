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

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeEmployees}</div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            On Leave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.onLeave}</div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(metrics.totalPayroll / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground mt-1">Avg: ${(metrics.averageSalary / 1000).toFixed(0)}K</p>
        </CardContent>
      </Card>
    </div>
  )
}
