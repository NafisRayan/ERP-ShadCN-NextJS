import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const productsCollection = await getCollection("products")
    const ordersCollection = await getCollection("orders")
    const purchaseOrdersCollection = await getCollection("purchaseOrders")

    // Count low stock items
    const lowStockItems = await productsCollection.countDocuments({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    })

    // Count pending orders
    const pendingOrders = await ordersCollection.countDocuments({ status: "pending" })

    // Count pending purchase orders
    const pendingPurchaseOrders = await purchaseOrdersCollection.countDocuments({ status: "draft" })

    return NextResponse.json({
      lowStockItems,
      pendingOrders,
      pendingPurchaseOrders,
    })
  } catch (error) {
    console.error("Dashboard alerts error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}