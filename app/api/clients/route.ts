import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("freelancerflow")

  const user = await db.collection("users").findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const clients = await db.collection("clients").find({ userId: user._id }).toArray()
  return NextResponse.json(clients)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const mongoClient = await clientPromise
  const db = mongoClient.db("freelancerflow")

  const user = await db.collection("users").findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Check plan limits
  if (user.plan === "free") {
    const count = await db.collection("clients").countDocuments({ userId: user._id })
    if (count >= 5) {
      return NextResponse.json({ error: "Free plan client limit reached" }, { status: 403 })
    }
  }

  const result = await db.collection("clients").insertOne({
    ...body,
    userId: user._id,
    createdAt: new Date()
  })

  return NextResponse.json(result)
}

