import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">About FreelancerFlow</h1>
        <p className="mt-6 text-gray-600 leading-relaxed">
          FreelancerFlow is a lightweight freelance business workspace created for independents who want to focus on work, not admin.
          We believe freelancers deserve a clean, modern tool that helps them track clients, proposals, and income without unnecessary clutter.
        </p>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900">Our mission</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Provide freelancers with the tools they need to run their business confidently. We build simple software with smart defaults that let you track progress, close deals, and grow your income.
          </p>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">Why FreelancerFlow?</h3>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>Fast onboarding with email or social login.</li>
              <li>Unlimited clients and proposals on Pro plan.</li>
              <li>Built for modern freelancers who want simplicity.</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">Secure & Private</h3>
            <p className="mt-4 text-gray-600">
              Your data is stored securely in MongoDB and access is granted through authenticated sessions. We only store what is required to run the app.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
