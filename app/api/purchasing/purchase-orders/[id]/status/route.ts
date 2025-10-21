import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const posCollection = await getCollection("purchase_orders")

    const result = await posCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update purchase order status:", error)
    return NextResponse.json({ error: "Failed to update purchase order status" }, { status: 500 })
  }
}
