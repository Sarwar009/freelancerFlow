import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

async function authorizeUser(session: any) {
  if (!session?.user?.email) return null
  const client = await clientPromise
  const db = client.db("freelancerflow")
  return await db.collection("users").findOne({ email: session.user.email })
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
  }

  const user = await authorizeUser(session)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const clientDoc = await (await clientPromise)
    .db("freelancerflow")
    .collection("clients")
    .findOne({ _id: new ObjectId(id), userId: user._id })

  if (!clientDoc) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json(clientDoc)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 })
  }

  const body = await req.json()
  const updates = { ...body, updatedAt: new Date() }
  delete updates._id
  delete updates.userId

  const user = await authorizeUser(session)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const result = await (await clientPromise)
    .db("freelancerflow")
    .collection("clients")
    .updateOne(
      { _id: new ObjectId(id), userId: user._id },
      { $set: updates }
    )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params;

  const client = await clientPromise
  const db = client.db("freelancerflow")

  const user = await db.collection("users").findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Ensure the client belongs to the user
  const clientDoc = await db.collection("clients").findOne({ _id: new ObjectId(id), userId: user._id })
  if (!clientDoc) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  await db.collection("clients").deleteOne({
    _id: new ObjectId(id)
  })

  return NextResponse.json({ success: true })
}