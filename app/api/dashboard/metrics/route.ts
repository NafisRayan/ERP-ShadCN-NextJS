import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getCollection("orders")
    const productsCollection = await getCollection("products")
    const employeesCollection = await getCollection("employees")
    const invoicesCollection = await getCollection("invoices")

    // Fetch metrics
    const totalOrders = await ordersCollection.countDocuments()
    const totalEmployees = await employeesCollection.countDocuments()
    const totalProducts = await productsCollection.countDocuments()

    // Calculate revenue from invoices
    const invoices = await invoicesCollection.find({ status: "paid" }).toArray()
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

    // Calculate inventory value
    const products = await productsCollection.find({}).toArray()
    const totalInventoryValue = products.reduce((sum, prod) => sum + (prod.quantity * prod.cost || 0), 0)

    // Count pending orders
    const pendingOrders = await ordersCollection.countDocuments({ status: "pending" })

    // Count low stock items
    const lowStockItems = await productsCollection.countDocuments({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    })

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      totalEmployees,
      pendingOrders,
      lowStockItems,
      totalProducts,
    })
  } catch (error) {
    console.error("Dashboard metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
