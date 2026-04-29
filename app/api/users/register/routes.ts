import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(req:Request){
  const body = await req.json()
  const client = await clientPromise
  const db = client.db("freelancerflow")

  const existing = await db.collection("users").findOne({ email: body.email })
  if(existing) return NextResponse.json({error:"User exists"},{status:400})

  await db.collection("users").insertOne({
    ...body,
    plan:"free",
    createdAt:new Date()
  })

  return NextResponse.json({success:true})
}