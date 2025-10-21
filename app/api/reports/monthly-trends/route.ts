import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()
    const orders = await db.collection("orders").find({}).toArray()
    const invoices = await db.collection("invoices").find({}).toArray()

    // Group by month
    const monthlyData: any = {}

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, orders: 0, invoices: 0 }
      }
      monthlyData[monthKey].revenue += order.total || 0
      monthlyData[monthKey].orders += 1
    })

    invoices.forEach((invoice: any) => {
      const date = new Date(invoice.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, orders: 0, invoices: 0 }
      }
      monthlyData[monthKey].invoices += 1
    })

    const trends = Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month))

    return NextResponse.json(trends)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 })
  }
}
