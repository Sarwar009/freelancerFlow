import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import type { Db } from "mongodb"

const DEMO_EMAIL = "demo@freelancerflow.com"
const DEMO_PASSWORD = "123456"

// Ensure a demo user exists and seed sample clients/proposals for the demo account.
export async function ensureDemoSeedData() {
  const client = await clientPromise
  const db = client.db("freelancerflow")

  const existingUser = await db.collection("users").findOne({ email: DEMO_EMAIL })

  let demoUserId
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
    const result = await db.collection("users").insertOne({
      name: "Demo User",
      email: DEMO_EMAIL,
      passwordHash,
      plan: "pro",
      stripeCustomerId: null,
      createdAt: new Date(),
    })
    demoUserId = result.insertedId
  } else {
    demoUserId = existingUser._id
    if (existingUser.plan !== "pro") {
      await db.collection("users").updateOne(
        { _id: existingUser._id },
        { $set: { plan: "pro" } }
      )
    }
    if (!existingUser.passwordHash) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
      await db.collection("users").updateOne(
        { _id: existingUser._id },
        { $set: { passwordHash } }
      )
    }
  }

  await seedDemoClients(db, demoUserId)
  await seedDemoProposals(db, demoUserId)
}

async function seedDemoClients(db: Db, demoUserId: any) {
  const exists = await db.collection("clients").findOne({ userId: demoUserId })
  if (exists) return

  const clientDocs = [
    {
      userId: demoUserId,
      name: "Acme Creative",
      email: "hello@acmecreative.com",
      company: "Acme Creative",
      phone: "(555) 123-4567",
      notes: "Prefer Monday check-ins and prefers PDF proposals.",
      createdAt: new Date(),
    },
    {
      userId: demoUserId,
      name: "Brightside Media",
      email: "team@brightsidemedia.com",
      company: "Brightside Media",
      phone: "(555) 987-6543",
      notes: "Long-term client with repeat work on brand strategy.",
      createdAt: new Date(),
    },
    {
      userId: demoUserId,
      name: "Luma Labs",
      email: "contact@lumalabs.io",
      company: "Luma Labs",
      phone: "(555) 246-8101",
      notes: "Interested in a quarterly retainer package.",
      createdAt: new Date(),
    },
  ]

  await db.collection("clients").insertMany(clientDocs)
}

async function seedDemoProposals(db: Db, demoUserId: any) {
  const exists = await db.collection("proposals").findOne({ userId: demoUserId })
  if (exists) return

  const proposals = [
    {
      userId: demoUserId,
      title: "Website redesign for Acme Creative",
      clientName: "Acme Creative",
      budget: 4200,
      status: "sent",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      notes: "Includes homepage refresh, mobile optimization, and CMS setup.",
    },
    {
      userId: demoUserId,
      title: "Social media suite for Brightside Media",
      clientName: "Brightside Media",
      budget: 2800,
      status: "closed",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      notes: "Campaign planning, creative assets, and reporting.",
    },
    {
      userId: demoUserId,
      title: "Quarterly product launch support for Luma Labs",
      clientName: "Luma Labs",
      budget: 5200,
      status: "draft",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: "Draft includes launch strategy, copy, and email sequence.",
    },
  ]

  await db.collection("proposals").insertMany(proposals)
}
