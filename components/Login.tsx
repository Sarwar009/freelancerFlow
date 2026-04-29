"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Globe } from "lucide-react"

export default function Login({ demo }: { demo: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [email, setEmail] = useState(demo ? "demo@gmail.com" : "")
  const [password, setPassword] = useState(demo ? "demo123" : "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (res?.ok) router.push("/dashboard")
    else alert("Invalid credentials")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">Login to access your dashboard.</p>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Globe className="text-black" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Github className="text-black" />
              Continue with GitHub
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3"
              type="email"
              required
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}