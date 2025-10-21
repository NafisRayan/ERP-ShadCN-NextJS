import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, reason } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const productsCollection = await getCollection("products")
    const stockMovesCollection = await getCollection("stock_moves")

    // Update product quantity
    const product = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $inc: { quantity }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    if (!product.value) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Log stock movement
    await stockMovesCollection.insertOne({
      productId: new ObjectId(productId),
      productName: product.value.name,
      quantity,
      reason: reason || "Manual adjustment",
      createdAt: new Date(),
    })

    return NextResponse.json(product.value)
  } catch (error) {
    console.error("Failed to adjust stock:", error)
    return NextResponse.json({ error: "Failed to adjust stock" }, { status: 500 })
  }
}
