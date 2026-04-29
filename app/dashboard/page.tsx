"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, FileText, CheckCircle, DollarSign } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({ clients: 0, proposals: 0, closedDeals: 0, totalIncome: 0 })

  async function loadStats() {
    const res = await fetch("/api/analytics")
    const data = await res.json()
    setStats(data)
  }

  useEffect(() => {
    const fetchStats = async () => {
      await loadStats()
    }
    fetchStats()
  }, [])

  const cards = [
    { title: "Total Clients", value: stats.clients, icon: Users, color: "bg-blue-500" },
    { title: "Total Proposals", value: stats.proposals, icon: FileText, color: "bg-green-500" },
    { title: "Closed Deals", value: stats.closedDeals, icon: CheckCircle, color: "bg-purple-500" },
    { title: "Total Income", value: `$${stats.totalIncome}`, icon: DollarSign, color: "bg-yellow-500" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow h-32 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg shrink-0`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Activity feed coming soon...</p>
      </motion.div>
    </motion.div>
  )
}