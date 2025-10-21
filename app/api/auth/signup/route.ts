import { getCollection } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const usersCollection = await getCollection("users")
    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: "employee",
      department: "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    const token = jwt.sign(
      { userId: result.insertedId, email, role: "employee" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: { ...userWithoutPassword, _id: result.insertedId },
      token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
