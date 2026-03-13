function Contact() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-700 text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Get in touch with our Cricket Academy for admissions, coaching details,
          training schedules, and support.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Academy Contact Details
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">📍 Address:</span> Hyderabad Cricket Ground,
                Main Sports Road, Hyderabad
              </p>
              <p>
                <span className="font-semibold">📞 Phone:</span> +91 9876543210
              </p>
              <p>
                <span className="font-semibold">✉ Email:</span> cricketacademy@email.com
              </p>
              <p>
                <span className="font-semibold">⏰ Timings:</span> 6:00 AM - 8:00 PM
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Contact Us?
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li>✔ Admission details for new students</li>
              <li>✔ Coaching program information</li>
              <li>✔ Match and training schedules</li>
              <li>✔ Fee and registration support</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Send a Message
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-lg text-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;