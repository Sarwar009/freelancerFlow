import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("freelancerflow")
    const contacts = db.collection("contacts")

    // Save contact message
    const result = await contacts.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      status: "unread"
    })

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // In a real application, you might want to send an email notification here
    // For now, we'll just save to database

    return NextResponse.json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}