import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Contact</h1>
        <p className="mt-4 text-gray-600">Have a question or need support? Send us a message and we’ll get back to you within 1–2 business days.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Reach us</h2>
            <p className="mt-3 text-gray-600">
              Email: <a className="text-indigo-600" href="mailto:support@freelancerflow.com">support@freelancerflow.com</a>
            </p>
            <p className="mt-2 text-gray-600">You can also visit our location or send inquiries through the form.</p>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Office</p>
                <p className="text-gray-600">123 Freelance Ave<br />Suite 100<br />Springfield, USA</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Hours</p>
                <p className="text-gray-600">Mon - Fri: 9am - 6pm</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
