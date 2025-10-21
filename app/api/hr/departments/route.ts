import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()
    const employees = await db.collection("employees").find({}).toArray()

    const departments = employees.reduce((acc: any, emp: any) => {
      const dept = emp.department || "Unassigned"
      if (!acc[dept]) {
        acc[dept] = { name: dept, count: 0, totalSalary: 0 }
      }
      acc[dept].count += 1
      acc[dept].totalSalary += emp.salary || 0
      return acc
    }, {})

    return NextResponse.json(Object.values(departments))
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}
