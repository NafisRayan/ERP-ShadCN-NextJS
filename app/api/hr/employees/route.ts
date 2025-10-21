import { connectDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()
    const employees = await db.collection("employees").find({}).toArray()
    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = await connectDB()

    const employee = {
      ...data,
      salary: Number(data.salary),
      status: "active",
      createdAt: new Date(),
    }

    const result = await db.collection("employees").insertOne(employee)
    return NextResponse.json({ ...employee, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
