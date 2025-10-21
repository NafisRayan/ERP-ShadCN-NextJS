import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const productsCollection = await getCollection("products")
    const products = await productsCollection.find({}).toArray()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sku, name, description, category, price, cost, quantity, reorderLevel, supplier } = body

    if (!sku || !name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const productsCollection = await getCollection("products")

    // Check if SKU already exists
    const existingSku = await productsCollection.findOne({ sku })
    if (existingSku) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
    }

    const newProduct = {
      sku,
      name,
      description: description || "",
      category,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      quantity: Number(quantity) || 0,
      reorderLevel: Number(reorderLevel) || 0,
      supplier: supplier || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(newProduct)

    return NextResponse.json({ ...newProduct, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
