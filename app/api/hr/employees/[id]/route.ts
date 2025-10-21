import { connectDB } from "@/lib/db"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(params.id) })
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const db = await connectDB()

    const result = await db
      .collection("employees")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { ...data, salary: Number(data.salary), updatedAt: new Date() } },
      )

    if (result.matchedCount === 0) return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const result = await db.collection("employees").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}
