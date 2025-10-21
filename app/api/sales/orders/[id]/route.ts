import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ordersCollection = await getCollection("orders")
    const order = await ordersCollection.findOne({ _id: new ObjectId(params.id) })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to fetch order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const ordersCollection = await getCollection("orders")

    const updatedOrder = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updatedOrder },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ordersCollection = await getCollection("orders")
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
