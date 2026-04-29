"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch {
      alert("An error occurred. Please try again.")
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center"
      >
        <CheckCircle size={48} className="text-green-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-600">Thank you for contacting us. We&apos;ll get back to you within 1-2 business days.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-3xl shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-900">Send a message</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            type="text"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            type="email"
            placeholder="Your email"
            required
          />
        </div>

        <div>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            rows={5}
            placeholder="How can we help?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              <Send size={18} />
              Send message
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}