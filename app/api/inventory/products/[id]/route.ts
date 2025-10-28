import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const productsCollection = await getCollection("products")
    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const body = await request.json()
    const productsCollection = await getCollection("products")

    const updatedProduct = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedProduct },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const productsCollection = await getCollection("products")
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
