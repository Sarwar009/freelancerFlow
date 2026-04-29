import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">FreelancerFlow</h3>
          <p className="text-gray-600 text-sm">
            A simple tool to manage clients, proposals, and revenue for freelancers. Built with Next.js, Tailwind, and MongoDB.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/about" className="hover:text-indigo-600 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-600 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/location" className="hover:text-indigo-600 transition">
                Location
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-indigo-600 transition">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">Support</h4>
          <p className="text-sm text-gray-600">Need help? Reach out at</p>
          <a href="mailto:support@freelancerflow.com" className="text-indigo-600 hover:text-indigo-700 text-sm">
            support@freelancerflow.com
          </a>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} FreelancerFlow. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Built with ♥ in 2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
