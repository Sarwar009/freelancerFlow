"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Clients", icon: Users, path: "/dashboard/clients" },
    { name: "Proposals", icon: FileText, path: "/dashboard/proposals" },
    { name: "Billing", icon: CreditCard, path: "/dashboard/billing" },
    { name: "Profile", icon: User, path: "/dashboard/profile" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  // Prevent body scroll on mobile when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-lg border border-gray-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs md:relative md:inset-auto md:w-72 lg:w-80 bg-white shadow-xl p-6 flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              FreelancerFlow
            </span>
            <span className="text-xs text-gray-500 group-hover:text-indigo-500 transition">
              Beta
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 flex-1">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={i}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm transform hover:-translate-y-0.5"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : ""} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 mt-6 pt-4  left-0 w-full px-4 md:px-10 font-bold  absolute top-100">
          <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-gray-700 hover:text-indigo-600 transition"
        >
          <LogOut size={20} className="inline-block mr-2" />
          Logout
        </button>
        </div>
      </motion.div>
    </>
  );
}