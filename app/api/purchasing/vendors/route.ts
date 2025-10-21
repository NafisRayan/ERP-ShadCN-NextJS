import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const vendorsCollection = await getCollection("vendors")
    const vendors = await vendorsCollection.find({}).toArray()
    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Failed to fetch vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, city, country, paymentTerms, rating } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const vendorsCollection = await getCollection("vendors")

    // Check if vendor already exists
    const existingVendor = await vendorsCollection.findOne({ email })
    if (existingVendor) {
      return NextResponse.json({ error: "Vendor already exists" }, { status: 400 })
    }

    const newVendor = {
      name,
      email,
      phone: phone || "",
      address: address || "",
      city: city || "",
      country: country || "",
      paymentTerms: paymentTerms || "Net 30",
      rating: Number(rating) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await vendorsCollection.insertOne(newVendor)

    return NextResponse.json({ ...newVendor, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
