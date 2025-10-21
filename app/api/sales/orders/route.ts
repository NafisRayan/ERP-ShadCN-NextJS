import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getCollection("orders")
    const orders = await ordersCollection.find({}).sort({ orderDate: -1 }).toArray()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, customerName, customerId, items, totalAmount, dueDate } = body

    if (!orderNumber || !customerName || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ordersCollection = await getCollection("orders")

    // Check if order number already exists
    const existingOrder = await ordersCollection.findOne({ orderNumber })
    if (existingOrder) {
      return NextResponse.json({ error: "Order number already exists" }, { status: 400 })
    }

    const newOrder = {
      orderNumber,
      customerId: customerId || "",
      customerName,
      items,
      totalAmount: Number(totalAmount) || 0,
      status: "pending",
      orderDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await ordersCollection.insertOne(newOrder)

    return NextResponse.json({ ...newOrder, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
