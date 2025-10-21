import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"

function convertToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(",")
  const csvRows = data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(","))
  return [csvHeaders, ...csvRows].join("\n")
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type") || "orders"

    const db = await connectDB()
    let data: any[] = []
    let headers: string[] = []

    switch (reportType) {
      case "orders":
        data = await db.collection("orders").find({}).toArray()
        headers = ["_id", "customerName", "total", "status", "createdAt"]
        break
      case "invoices":
        data = await db.collection("invoices").find({}).toArray()
        headers = ["_id", "invoiceNumber", "total", "status", "dueDate"]
        break
      case "employees":
        data = await db.collection("employees").find({}).toArray()
        headers = ["_id", "name", "email", "department", "position", "salary", "status"]
        break
      case "products":
        data = await db.collection("products").find({}).toArray()
        headers = ["_id", "name", "sku", "quantity", "price", "category"]
        break
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    const csv = convertToCSV(data, headers)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${reportType}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}
