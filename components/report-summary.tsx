"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Package, Users } from "lucide-react"

interface ReportSummary {
  summary: {
    totalRevenue: number
    totalExpenses: number
    profit: number
    totalInvoiced: number
    paidInvoices: number
    pendingInvoices: number
    totalPayroll: number
    activeEmployees: number
    totalProducts: number
    lowStockProducts: number
  }
  orders: {
    total: number
    pending: number
    completed: number
  }
  purchaseOrders: {
    total: number
    pending: number
    received: number
  }
}

export function ReportSummary() {
  const [data, setData] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/summary")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch report summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading report...</div>
  if (!data) return null

  const profitMargin =
    data.summary.totalRevenue > 0 ? ((data.summary.profit / data.summary.totalRevenue) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data.summary.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">From {data.orders.total} orders</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(data.summary.profit / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Margin: {profitMargin}%</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.summary.lowStockProducts} low stock</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.activeEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Payroll: ${(data.summary.totalPayroll / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sales Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total</span>
              <span className="font-bold">{data.orders.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-bold text-yellow-600">{data.orders.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold text-green-600">{data.orders.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Invoiced</span>
              <span className="font-bold">${(data.summary.totalInvoiced / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Paid</span>
              <span className="font-bold text-green-600">{data.summary.paidInvoices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-bold text-red-600">{data.summary.pendingInvoices}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total</span>
              <span className="font-bold">{data.purchaseOrders.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-bold text-yellow-600">{data.purchaseOrders.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Received</span>
              <span className="font-bold text-green-600">{data.purchaseOrders.received}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
