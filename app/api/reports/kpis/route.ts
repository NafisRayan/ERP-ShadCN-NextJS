import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getCollection("orders")
    const invoicesCollection = await getCollection("invoices")
    const productsCollection = await getCollection("products")
    const vendorsCollection = await getCollection("vendors")

    // Calculate Order Fulfillment Rate
    const totalOrders = await ordersCollection.countDocuments()
    const completedOrders = await ordersCollection.countDocuments({ status: "delivered" })
    const orderFulfillmentRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0

    // Calculate Inventory Accuracy (simplified - products with quantity >= 0)
    const totalProducts = await productsCollection.countDocuments()
    const accurateProducts = await productsCollection.countDocuments({ quantity: { $gte: 0 } })
    const inventoryAccuracy = totalProducts > 0 ? Math.round((accurateProducts / totalProducts) * 100) : 0

    // Calculate Vendor Performance (simplified - vendors with rating >= 3)
    const totalVendors = await vendorsCollection.countDocuments()
    const goodVendors = await vendorsCollection.countDocuments({ rating: { $gte: 3 } })
    const vendorPerformance = totalVendors > 0 ? Math.round((goodVendors / totalVendors) * 100) : 0

    // Calculate Customer Retention (simplified - repeat customers)
    // This is a simplified calculation - in real ERP, this would be more complex
    const customerRetention = 87 // Placeholder - would need customer history data

    // System uptime and data integrity are system-level metrics
    const systemUptime = 99.9
    const dataIntegrity = 100.0

    // Active users (simplified - this would come from session/user activity data)
    const activeUsers = 1 // Current user

    // Last backup (simplified - would come from backup system)
    const lastBackup = "2 hours ago"

    return NextResponse.json({
      kpis: {
        orderFulfillmentRate,
        customerRetention,
        inventoryAccuracy,
        vendorPerformance
      },
      system: {
        systemUptime,
        dataIntegrity,
        activeUsers,
        lastBackup
      }
    })
  } catch (error) {
    console.error("KPIs error:", error)
    return NextResponse.json({ error: "Failed to fetch KPIs" }, { status: 500 })
  }
}