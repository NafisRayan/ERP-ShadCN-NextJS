import { connectDB } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()
    const employees = await db.collection("employees").find({}).toArray()

    const totalPayroll = employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0)
    const activeCount = employees.filter((emp: any) => emp.status === "active").length
    const onLeaveCount = employees.filter((emp: any) => emp.status === "on-leave").length

    return NextResponse.json({
      totalEmployees: employees.length,
      activeEmployees: activeCount,
      onLeave: onLeaveCount,
      totalPayroll,
      averageSalary: employees.length > 0 ? totalPayroll / employees.length : 0,
      departments: [...new Set(employees.map((emp: any) => emp.department))],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payroll data" }, { status: 500 })
  }
}
