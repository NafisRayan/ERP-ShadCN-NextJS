import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getCollection("orders")
    const invoicesCollection = await getCollection("invoices")

    // Get last 6 months of data
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const orders = await ordersCollection.find({ orderDate: { $gte: sixMonthsAgo } }).toArray()

    const invoices = await invoicesCollection.find({ issueDate: { $gte: sixMonthsAgo } }).toArray()

    // Group by month
    const monthlyData: Record<string, { revenue: number; orders: number }> = {}
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    months.forEach((month, idx) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - idx))
      const monthKey = date.toLocaleString("default", { month: "short" })
      monthlyData[monthKey] = { revenue: 0, orders: 0 }
    })

    // Aggregate invoice data
    invoices.forEach((inv: any) => {
      const month = new Date(inv.issueDate).toLocaleString("default", { month: "short" })
      if (monthlyData[month]) {
        monthlyData[month].revenue += inv.total || 0
      }
    })

    // Aggregate order data
    orders.forEach((order: any) => {
      const month = new Date(order.orderDate).toLocaleString("default", { month: "short" })
      if (monthlyData[month]) {
        monthlyData[month].orders += 1
      }
    })

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Chart data error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
