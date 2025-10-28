import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const { id } = await params
    const ordersCollection = await getCollection("orders")

    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
