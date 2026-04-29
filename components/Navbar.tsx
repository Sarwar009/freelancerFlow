"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { LogIn, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Terms", path: "/terms" },
  ]

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 md:px-10 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FreelancerFlow
          </span>
          <span className="text-xs text-gray-500 group-hover:text-indigo-500 transition">
            Beta
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`relative px-3 py-1 rounded-full transition-all duration-300
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                  }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-gray-500 text-sm">Loading...</span>
          ) : session ? (
            <Link
              href="/dashboard"
              className="relative px-5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.03]"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link href="/login?demo=true"
                className='relative px-3 py-1 rounded-full transition-all hover:shadow-indigo-500/30 duration-300 hover:scale-[1.03] text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 font-medium'
              >
                Demo Login
              </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.03]"
            >
              <LogIn size={18} />
              Login
            </Link>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden p-2 rounded-lg border border-gray-200 bg-white shadow-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-6 flex flex-col gap-3 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3 py-1 rounded-full transition-all duration-300 text-center
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                  }`}
              >
                {link.name}
              </Link>
            )
          })}

          {session ? (
            <Link
              href="/dashboard"
              className="mt-2 text-center px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-2 flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  )
}