import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, passwordHash } = await req.json()

  const client = await clientPromise
  const db = client.db("freelancerflow")

  // Check if user exists
  const existing = await db.collection("users").findOne({ email })
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  // Create user with free plan
  const user = await db.collection("users").insertOne({
    name,
    email,
    passwordHash,
    plan: "free",
    createdAt: new Date()
  })

  return NextResponse.json({ success: true, userId: user.insertedId })
}