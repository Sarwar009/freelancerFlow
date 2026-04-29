import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Our Location</h1>
        <p className="mt-4 text-gray-600">
          Our team is distributed across the world, but our headquarters is based in Springfield.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Headquarters</h2>
            <p className="mt-4 text-gray-600">
              123 Freelance Ave<br />Suite 100<br />Springfield, USA
            </p>
            <p className="mt-4 text-gray-600">We operate remotely but love meeting customers locally and globally.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Map</h2>
            <div className="mt-4 w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
              <iframe
                title="Office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192148868315!2d-122.41941548468137!3d37.77492927975919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064fdf0100b%3A0x20d3c57dafa9d2e8!2sSan+Francisco%2C+CA%2C+USA!5e0!3m2!1sen!2sin!4v1696386744102!5m2!1sen!2sin"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
