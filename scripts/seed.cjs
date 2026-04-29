const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("Missing MONGODB_URI environment variable")
  process.exit(1)
}

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("freelancerflow")

  const demoEmail = "demo@freelancerflow.com"
  const demoPassword = "123456"

  const existingUser = await db.collection("users").findOne({ email: demoEmail })
  let demoUserId

  if (!existingUser) {
    const passwordHash = await bcrypt.hash(demoPassword, 10)
    const result = await db.collection("users").insertOne({
      name: "Demo User",
      email: demoEmail,
      passwordHash,
      plan: "pro",
      createdAt: new Date(),
    })
    demoUserId = result.insertedId
    console.log("Created demo user:", demoEmail)
  } else {
    demoUserId = existingUser._id
    if (!existingUser.passwordHash) {
      const passwordHash = await bcrypt.hash(demoPassword, 10)
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { passwordHash } })
      console.log("Updated demo user password hash")
    }
    if (existingUser.plan !== "pro") {
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { plan: "pro" } })
      console.log("Upgraded demo user to Pro plan")
    }
  }

  const clientExists = await db.collection("clients").findOne({ userId: demoUserId })
  if (!clientExists) {
    await db.collection("clients").insertMany([
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
    ])
    console.log("Added demo clients")
  }

  const proposalExists = await db.collection("proposals").findOne({ userId: demoUserId })
  if (!proposalExists) {
    await db.collection("proposals").insertMany([
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
    ])
    console.log("Added demo proposals")
  }

  await client.close()
  console.log("Seeding complete. Use demo@freelancerflow.com / 123456")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
