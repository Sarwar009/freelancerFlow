import "./globals.css"
import Providers from "../components/Providers"
import { ensureDemoSeedData } from "@/lib/seed"

export const metadata = {
  title: "FreelancerFlow",
  description: "Client & Proposal Tracker",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ensure demo account and sample dashboard data exist on first load.
  // This keeps the app ready for a demo user without manual seeding.
  try {
    await ensureDemoSeedData()
  } catch (error) {
    console.error("Demo seed initialization failed:", error)
  }

  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans min-h-screen overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}