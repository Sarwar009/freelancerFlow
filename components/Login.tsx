"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Lock, Save, Eye, EyeOff } from "lucide-react"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"

interface UserProfile {
  name: string
  email: string
}

export default function Profile() {
  const { data: session, update } = useSession()

  const isDemoUser = session?.user?.email === "demo@demo.com"

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: ""
  })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Load session
  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || ""
      })
    }
  }, [session])

  // ---------------------------
  // UPDATE PROFILE
  // ---------------------------
  const updateProfile = async () => {
    if (!profile.name) {
      Swal.fire("Error", "Name is required", "error")
      return
    }

    // EMAIL BLOCK
    if (profile.email !== session?.user?.email) {
      Swal.fire("Not allowed", "Email cannot be changed", "error")
      return
    }

    // DEMO USER BLOCK
    if (isDemoUser) {
      Swal.fire(
        "Restricted",
        "Demo user cannot change name. Please create a real account.",
        "warning"
      )
      return
    }

    setProfileLoading(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name })
      })

      if (res.ok) {
        await update({ name: profile.name })
        Swal.fire("Success", "Profile updated successfully", "success")
      } else {
        Swal.fire("Error", "Failed to update profile", "error")
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error")
    }

    setProfileLoading(false)
  }

  // ---------------------------
  // CHANGE PASSWORD
  // ---------------------------
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Error", "All fields are required", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error")
      return
    }

    if (newPassword.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error")
      return
    }

    setPasswordLoading(true)

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      if (res.ok) {
        Swal.fire("Success", "Password changed successfully", "success")

        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await res.json()
        Swal.fire("Error", data.error || "Invalid current password", "error")
      }
    } catch {
      Swal.fire("Error", "Server error", "error")
    }

    setPasswordLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl"
    >
      <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>

      {/* PROFILE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User size={20} />
          Profile Information
        </h2>

        <div className="space-y-4">

          {/* NAME */}
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border p-3 rounded-lg"
            placeholder="Full Name"
          />

          {/* EMAIL (READ ONLY) */}
          <input
            value={profile.email}
            disabled
            className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />

          <button
            onClick={updateProfile}
            disabled={profileLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            {profileLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      {/* PASSWORD SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lock size={20} />
          Change Password
        </h2>

        <div className="space-y-4">

          {/* CURRENT */}
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border p-3 pr-10 rounded-lg"
              placeholder="Current Password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-3"
            >
              {showCurrentPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* NEW */}
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="New Password"
          />

          {/* CONFIRM */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Confirm Password"
          />

          <button
            onClick={changePassword}
            disabled={passwordLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Lock size={18} />
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}