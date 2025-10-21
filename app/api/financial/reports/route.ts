import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const invoicesCollection = await getCollection("invoices")
    const ordersCollection = await getCollection("orders")
    const posCollection = await getCollection("purchase_orders")

    // Get all invoices
    const invoices = await invoicesCollection.find({}).toArray()
    const orders = await ordersCollection.find({}).toArray()
    const pos = await posCollection.find({}).toArray()

    // Calculate financial metrics
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === "paid")
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)

    const totalExpenses = pos
      .filter((po: any) => po.status === "received")
      .reduce((sum: number, po: any) => sum + (po.totalAmount || 0), 0)

    const pendingInvoices = invoices
      .filter((inv: any) => inv.status === "sent")
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)

    const overdueInvoices = invoices
      .filter((inv: any) => inv.status === "overdue")
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)

    const profit = totalRevenue - totalExpenses

    return NextResponse.json({
      totalRevenue,
      totalExpenses,
      profit,
      pendingInvoices,
      overdueInvoices,
      invoiceCount: invoices.length,
      paidInvoiceCount: invoices.filter((inv: any) => inv.status === "paid").length,
      overdueInvoiceCount: invoices.filter((inv: any) => inv.status === "overdue").length,
    })
  } catch (error) {
    console.error("Failed to fetch financial reports:", error)
    return NextResponse.json({ error: "Failed to fetch financial reports" }, { status: 500 })
  }
}
