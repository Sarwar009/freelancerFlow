"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="text-center mt-32 px-6">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold leading-tight"
      >
        Track Your Freelance <br />
        Clients & Proposals Easily
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mt-6 text-lg"
      >
        A simple SaaS tool for beginner freelancers to manage clients,
        proposals and income in one dashboard.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10"
      >
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Start Free
        </button>
      </motion.div>

    </section>
  )
}