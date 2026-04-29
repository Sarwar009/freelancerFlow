import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>

        <section className="mt-8 space-y-8 text-gray-600">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance</h2>
            <p className="mt-3 leading-relaxed">
              By using FreelancerFlow, you agree to these Terms &amp; Conditions. Please read them carefully.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">2. Account</h2>
            <p className="mt-3 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account details. You consent to our collection and use of your information in accordance with the Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">3. Pricing and Billing</h2>
            <p className="mt-3 leading-relaxed">
              Pricing details are available on the Billing page. Free plan limits apply as described, and Pro plan charges will be billed via Stripe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">4. Termination</h2>
            <p className="mt-3 leading-relaxed">
              We may suspend or terminate your access for violations of these terms or misuse of the platform.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
