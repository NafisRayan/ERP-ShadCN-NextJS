import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

interface Notification {
  title: string
  message: string
  type: string
}

export async function GET(request: NextRequest) {
  try {
    const productsCollection = await getCollection("products")
    const ordersCollection = await getCollection("orders")
    const purchaseOrdersCollection = await getCollection("purchaseOrders")

    // Get low stock items
    const lowStockProducts = await productsCollection
      .find({
        $expr: { $lte: ["$quantity", "$reorderLevel"] },
      })
      .limit(3)
      .toArray()

    // Get pending orders
    const pendingOrders = await ordersCollection
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    // Get pending purchase orders
    const pendingPurchaseOrders = await purchaseOrdersCollection
      .find({ status: "draft" })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    // Combine notifications
    const notifications: Notification[] = []

    // Add low stock notifications
    lowStockProducts.forEach((product: any) => {
      notifications.push({
        title: "Low stock alert",
        message: `${product.name} (${product.sku}) is below reorder level`,
        type: "warning"
      })
    })

    // Add pending order notifications
    pendingOrders.forEach((order: any) => {
      notifications.push({
        title: "Pending order",
        message: `Order ${order.orderNumber} from ${order.customerName} needs attention`,
        type: "info"
      })
    })

    // Add pending PO notifications
    pendingPurchaseOrders.forEach((po: any) => {
      notifications.push({
        title: "Pending approval",
        message: `Purchase order ${po.poNumber} awaits approval`,
        type: "info"
      })
    })

    // Take top 5 notifications
    const recentNotifications = notifications.slice(0, 5)

    return NextResponse.json({
      count: recentNotifications.length,
      notifications: recentNotifications
    })
  } catch (error) {
    console.error("Notifications error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}