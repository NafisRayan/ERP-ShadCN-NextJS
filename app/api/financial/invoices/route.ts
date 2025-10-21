import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const invoicesCollection = await getCollection("invoices")
    const invoices = await invoicesCollection.find({}).sort({ issueDate: -1 }).toArray()
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Failed to fetch invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceNumber, orderId, customerId, customerName, amount, tax, dueDate } = body

    if (!invoiceNumber || !customerName || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const invoicesCollection = await getCollection("invoices")

    // Check if invoice number already exists
    const existingInvoice = await invoicesCollection.findOne({ invoiceNumber })
    if (existingInvoice) {
      return NextResponse.json({ error: "Invoice number already exists" }, { status: 400 })
    }

    const taxAmount = Number(tax) || 0
    const totalAmount = Number(amount) + taxAmount

    const newInvoice = {
      invoiceNumber,
      orderId: orderId || "",
      customerId: customerId || "",
      customerName,
      amount: Number(amount),
      tax: taxAmount,
      total: totalAmount,
      status: "draft",
      issueDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await invoicesCollection.insertOne(newInvoice)

    return NextResponse.json({ ...newInvoice, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
