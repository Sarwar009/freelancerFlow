import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Your freelance business, organized.
            </h1>
            <p className="text-lg text-gray-600 mt-6 max-w-xl">
              Manage clients, proposals, and revenue from one place. FreelancerFlow helps you stay on top of your pipeline without the complexity.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 border border-indigo-200 px-8 py-4 rounded-xl text-indigo-600 hover:bg-indigo-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-10">
              <p className="text-gray-700 mb-4 font-semibold">What you get</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-indigo-600">•</span>
                  Track clients, proposals, invoices, and revenue.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-indigo-600">•</span>
                  Stay organized with easy status updates and reminders.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-indigo-600">•</span>
                  Simple pricing with a free starter plan.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Built for freelancers</h2>
          <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto">
            Everything you need to keep your freelance business moving forward — no clutter, no confusing tools.
          </p>

          <div className="grid gap-8 mt-12 md:grid-cols-3">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Client CRM</h3>
              <p className="text-gray-600">Store client details, contact info, and notes to keep relationships thriving.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Proposal Builder</h3>
              <p className="text-gray-600">Send proposals quickly and track statuses from sent to closed.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Analytics</h3>
              <p className="text-gray-600">See how your business is performing with clean stats and revenue summaries.</p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="mt-20 bg-indigo-600 rounded-3xl p-10 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold">Ready to level up your freelance workflow?</h2>
              <p className="mt-3 text-indigo-100 max-w-xl">
                Start today with a free plan — no credit card required.
              </p>
            </div>
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              Start Free
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}