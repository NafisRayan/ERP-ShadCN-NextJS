import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendorsCollection = await getCollection("vendors")
    const vendor = await vendorsCollection.findOne({ _id: new ObjectId(params.id) })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error("Failed to fetch vendor:", error)
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const vendorsCollection = await getCollection("vendors")

    const updatedVendor = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await vendorsCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updatedVendor },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update vendor:", error)
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendorsCollection = await getCollection("vendors")
    const result = await vendorsCollection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete vendor:", error)
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 })
  }
}
