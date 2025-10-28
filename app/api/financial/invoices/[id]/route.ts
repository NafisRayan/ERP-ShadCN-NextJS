import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const invoicesCollection = await getCollection("invoices")
    const invoice = await invoicesCollection.findOne({ _id: new ObjectId(id) })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Failed to fetch invoice:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const body = await request.json()
    const invoicesCollection = await getCollection("invoices")

    const updatedInvoice = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await invoicesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedInvoice },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Failed to update invoice:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const invoicesCollection = await getCollection("invoices")
    const result = await invoicesCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
