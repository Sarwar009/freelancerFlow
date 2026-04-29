"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, User } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

interface Client {
  _id: string
  name: string
  email: string
  clientInfo?: string
}

const MySwal = withReactContent(Swal)

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [clientInfo, setClientInfo] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadClients() {
    const res = await fetch("/api/clients")
    const data = await res.json()
    setClients(data)
  }

  async function addClient() {
    if (!name.trim() || !email.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Required Fields Missing",
        text: "Please enter both Name and Email.",
      })
      return
    }
    setLoading(true)
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, clientInfo }),
    })
    setName("")
    setEmail("")
    setClientInfo("")
    await loadClients()
    setLoading(false)
    MySwal.fire({
      icon: "success",
      title: "Client Added",
      timer: 1200,
      showConfirmButton: false,
    })
  }

  async function deleteClient(id: string) {
    const result = await MySwal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This client will be deleted permanently!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    })

    if (result.isConfirmed) {
      await fetch(`/api/clients/${id}`, { method: "DELETE" })
      await loadClients()
      MySwal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  // Helper: truncate info to 150 words
  const truncateInfo = (info: string) => {
    const words = info.split(" ")
    if (words.length <= 150) return info
    return words.slice(0, 150).join(" ") + "..."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <span className="text-sm text-gray-500">{clients.length} clients</span>
      </div>

      {/* Add Client Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          Add New Client
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Client Name"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            type="email"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <input
            value={clientInfo}
            onChange={e => setClientInfo(e.target.value)}
            placeholder="Client Information (Optional)"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={addClient}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition transform hover:scale-105"
        >
          {loading ? "Adding..." : "Add Client"}
        </button>
      </motion.div>

      {/* Clients List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, i) => (
          <motion.div
            key={client._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all group flex flex-col h-56"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {client.name || <span className="text-red-500 italic">Required</span>}
              </h3>
              <button
                onClick={() => deleteClient(client._id)}
                className="text-red-500 p-1 rounded hover:bg-red-100 transition"
                aria-label="Delete Client"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Email */}
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">
              <span className="font-bold text-gray-800">Email: </span>
              {client.email || <span className="text-red-500 italic">Required</span>}
            </p>

            {/* Client Info */}
            {client.clientInfo && (
              <p className="text-gray-500 text-sm line-clamp-4 overflow-hidden">
                <span className="font-bold text-gray-800">Client Info: </span>
                {truncateInfo(client.clientInfo)}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* No Clients */}
      {clients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No clients yet. Add your first client above!</p>
        </motion.div>
      )}
    </motion.div>
  )
}