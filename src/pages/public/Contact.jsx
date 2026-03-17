function Contact() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-green-100 mb-4">
            Cricket Academy
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">Contact Us</h1>

          <p className="max-w-3xl mx-auto text-base md:text-xl text-white/90 leading-8">
            Get in touch with our Cricket Academy for admissions, coaching
            details, training schedules, registrations and support.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Side */}
          <div className="space-y-6">
            <div className="bg-white rounded-[30px] shadow-lg border border-gray-200 p-8">
              <p className="text-green-700 font-semibold uppercase tracking-wider mb-3">
                Contact Details
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Academy Contact Information
              </h2>

              <div className="space-y-5 text-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-xl">
                    📍
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-gray-600 leading-7">
                      Hyderabad Cricket Ground, Main Sports Road, Hyderabad
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-xl">
                    📞
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">
                    ✉️
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-gray-600 break-words">
                      cricketacademy@email.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">
                    ⏰
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Academy Timings</p>
                    <p className="text-gray-600">6:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[30px] shadow-lg border border-gray-200 p-8">
              <p className="text-green-700 font-semibold uppercase tracking-wider mb-3">
                Support
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why Contact Us?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <span className="text-green-700 text-lg">✔</span>
                  <p className="text-gray-700 leading-7">
                    Admission details for new students
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <span className="text-green-700 text-lg">✔</span>
                  <p className="text-gray-700 leading-7">
                    Coaching program information
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <span className="text-green-700 text-lg">✔</span>
                  <p className="text-gray-700 leading-7">
                    Match and training schedules
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <span className="text-green-700 text-lg">✔</span>
                  <p className="text-gray-700 leading-7">
                    Fee and registration support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="bg-white rounded-[30px] shadow-xl border border-gray-200 p-8 md:p-10">
            <p className="text-green-700 font-semibold uppercase tracking-wider mb-3">
              Send Message
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              We’d Love to Hear From You
            </h2>

            <p className="text-gray-600 leading-7 mb-8">
              Fill in your details and send your query. Our academy team will
              get back to you as soon as possible.
            </p>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom Highlight */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-slate-950 via-green-950 to-emerald-900 rounded-[32px] text-white p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-green-300">500+</h3>
              <p className="mt-2 text-white/85">Students Trained</p>
            </div>

            <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-green-300">10+</h3>
              <p className="mt-2 text-white/85">Professional Coaches</p>
            </div>

            <div className="bg-white/10 rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-green-300">8+</h3>
              <p className="mt-2 text-white/85">Years Experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;