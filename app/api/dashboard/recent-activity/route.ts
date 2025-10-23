import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

interface Activity {
  action: string
  time: string
  type: string
  timestamp: Date
}

export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getCollection("orders")
    const productsCollection = await getCollection("products")
    const invoicesCollection = await getCollection("invoices")
    const employeesCollection = await getCollection("employees")

    // Get recent orders (last 5)
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get recent invoices (last 5)
    const recentInvoices = await invoicesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get recent employees (last 5)
    const recentEmployees = await employeesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get recent product updates (last 5)
    const recentProducts = await productsCollection
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray()

    // Combine and sort all activities
    const activities: Activity[] = []

    // Add order activities
    recentOrders.forEach((order: any) => {
      activities.push({
        action: `Order ${order.orderNumber} ${order.status}`,
        time: formatTimeAgo(order.createdAt),
        type: "order",
        timestamp: order.createdAt
      })
    })

    // Add invoice activities
    recentInvoices.forEach((invoice: any) => {
      activities.push({
        action: `Invoice ${invoice.invoiceNumber} sent to customer`,
        time: formatTimeAgo(invoice.createdAt),
        type: "invoice",
        timestamp: invoice.createdAt
      })
    })

    // Add employee activities
    recentEmployees.forEach((employee: any) => {
      activities.push({
        action: `New employee ${employee.firstName} ${employee.lastName} added`,
        time: formatTimeAgo(employee.createdAt),
        type: "hr",
        timestamp: employee.createdAt
      })
    })

    // Add product activities
    recentProducts.forEach((product: any) => {
      activities.push({
        action: `Inventory updated for ${product.sku}`,
        time: formatTimeAgo(product.updatedAt),
        type: "inventory",
        timestamp: product.updatedAt
      })
    })

    // Sort by timestamp and take top 4
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivities = activities.slice(0, 4)

    return NextResponse.json(recentActivities)
  } catch (error) {
    console.error("Recent activity error:", error)
    return NextResponse.json({ error: "Failed to fetch recent activity" }, { status: 500 })
  }
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const activityDate = new Date(date)
  const diffInMs = now.getTime() - activityDate.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return "Less than an hour ago"
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
}