import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("playerData");
  localStorage.removeItem("parentData");
  navigate("/login", { replace: true });
};

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 flex items-center justify-center text-white text-xl shadow-lg">
            🏏
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Cricket Academy
            </h1>
            <p className="text-sm text-gray-500">
              Train Hard • Play Smart
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[17px] font-medium text-gray-700">
          <Link to="/" className="hover:text-green-700 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-green-700 transition">
            About
          </Link>
          <Link to="/coaches" className="hover:text-green-700 transition">
            Coaches
          </Link>
          <Link to="/gallery" className="hover:text-green-700 transition">
            Gallery
          </Link>
          <Link to="/contact" className="hover:text-green-700 transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {userName ? (
            <>
              <p className="hidden md:block text-green-700 font-semibold">
                Welcome, {userName}
              </p>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-700 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;