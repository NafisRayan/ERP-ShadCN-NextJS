import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const productsCollection = await getCollection("products")

    // Get all products
    const products = await productsCollection.find({}).toArray()

    // Calculate inventory status
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0

    products.forEach((product: any) => {
      if (product.quantity === 0) {
        outOfStock++
      } else if (product.quantity <= product.reorderLevel) {
        lowStock++
      } else {
        inStock++
      }
    })

    const total = products.length
    const inventoryData = [
      {
        name: "In Stock",
        value: total > 0 ? Math.round((inStock / total) * 100) : 0,
        fill: "hsl(var(--chart-1))",
        color: "bg-[hsl(var(--chart-1))]"
      },
      {
        name: "Low Stock",
        value: total > 0 ? Math.round((lowStock / total) * 100) : 0,
        fill: "hsl(var(--chart-2))",
        color: "bg-[hsl(var(--chart-2))]"
      },
      {
        name: "Out of Stock",
        value: total > 0 ? Math.round((outOfStock / total) * 100) : 0,
        fill: "hsl(var(--chart-3))",
        color: "bg-[hsl(var(--chart-3))]"
      },
    ]

    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error("Inventory status error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory status" }, { status: 500 })
  }
}