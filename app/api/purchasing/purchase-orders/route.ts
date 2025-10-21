import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const posCollection = await getCollection("purchase_orders")
    const pos = await posCollection.find({}).sort({ orderDate: -1 }).toArray()
    return NextResponse.json(pos)
  } catch (error) {
    console.error("Failed to fetch purchase orders:", error)
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { poNumber, vendorId, vendorName, items, totalAmount, expectedDelivery } = body

    if (!poNumber || !vendorName || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const posCollection = await getCollection("purchase_orders")

    // Check if PO number already exists
    const existingPO = await posCollection.findOne({ poNumber })
    if (existingPO) {
      return NextResponse.json({ error: "PO number already exists" }, { status: 400 })
    }

    const newPO = {
      poNumber,
      vendorId: vendorId || "",
      vendorName,
      items,
      totalAmount: Number(totalAmount) || 0,
      status: "draft",
      orderDate: new Date(),
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await posCollection.insertOne(newPO)

    return NextResponse.json({ ...newPO, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create purchase order:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
