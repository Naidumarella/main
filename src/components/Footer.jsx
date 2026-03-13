function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-green-950 text-white mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-green-400">Cricket Academy</h2>
          <p className="mt-3 text-gray-300">
            Train Hard • Play Smart • Become a Champion.
          </p>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            Professional coaching academy with connected dashboards for players,
            coaches, parents and admin management.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>About</li>
            <li>Coaches</li>
            <li>Gallery</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-gray-300">📍 Hyderabad Cricket Ground</p>
          <p className="text-gray-300 mt-2">📞 +91 9876543210</p>
          <p className="text-gray-300 mt-2">✉ cricketacademy@email.com</p>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-gray-400 text-sm">
        © 2026 Cricket Academy Management System. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;