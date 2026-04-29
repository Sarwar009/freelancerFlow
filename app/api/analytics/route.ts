import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(){
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("freelancerflow")

  // Get user
  const user = await db.collection("users").findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Get counts for this user
  const clients = await db.collection("clients").countDocuments({ userId: user._id })
  const proposals = await db.collection("proposals").countDocuments({ userId: user._id })
  const closedDeals = await db.collection("proposals").countDocuments({ userId: user._id, status: "closed" })
  const incomeData = await db.collection("proposals").find({ userId: user._id, status: "closed" }).toArray()
  const totalIncome = incomeData.reduce((acc, p) => acc + Number(p.budget || 0), 0)

  return NextResponse.json({ clients, proposals, closedDeals, totalIncome })
}