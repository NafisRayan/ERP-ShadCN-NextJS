import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()

    // Fetch all collections
    const orders = await db.collection("orders").find({}).toArray()
    const purchaseOrders = await db.collection("purchaseOrders").find({}).toArray()
    const invoices = await db.collection("invoices").find({}).toArray()
    const employees = await db.collection("employees").find({}).toArray()
    const products = await db.collection("products").find({}).toArray()

    // Calculate metrics
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
    const totalExpenses = purchaseOrders.reduce((sum: number, po: any) => sum + (po.total || 0), 0)
    const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
    const paidInvoices = invoices.filter((inv: any) => inv.status === "paid").length
    const totalPayroll = employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0)
    const lowStockProducts = products.filter((p: any) => p.quantity <= p.reorderLevel).length

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses,
        profit: totalRevenue - totalExpenses,
        totalInvoiced,
        paidInvoices,
        pendingInvoices: invoices.length - paidInvoices,
        totalPayroll,
        activeEmployees: employees.filter((e: any) => e.status === "active").length,
        totalProducts: products.length,
        lowStockProducts,
      },
      orders: {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === "pending").length,
        completed: orders.filter((o: any) => o.status === "delivered").length,
      },
      purchaseOrders: {
        total: purchaseOrders.length,
        pending: purchaseOrders.filter((po: any) => po.status === "pending").length,
        received: purchaseOrders.filter((po: any) => po.status === "received").length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch report summary" }, { status: 500 })
  }
}
