import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

    if (isAdminLoggedIn && userRole === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (userRole === "coach") {
      navigate("/coach", { replace: true });
      return;
    }

    if (userRole === "player") {
      navigate("/player", { replace: true });
      return;
    }

    if (userRole === "parent") {
      navigate("/parent", { replace: true });
      return;
    }

    setCheckingSession(false);
  }, [navigate]);

  const clearOldSession = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminData");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("playerData");
    localStorage.removeItem("parentData");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    if (!enteredEmail || !enteredPassword) {
      setError("Please enter email and password");
      return;
    }

    const adminCredentials = {
      email: "admin@academy.com",
      password: "admin123",
      name: "Academy Admin",
      role: "admin",
    };

    if (
      enteredEmail === adminCredentials.email &&
      enteredPassword === adminCredentials.password
    ) {
      clearOldSession();
      localStorage.setItem("adminData", JSON.stringify(adminCredentials));
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("userName", adminCredentials.name);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", adminCredentials.email);
      navigate("/admin", { replace: true });
      return;
    }

    const coaches = JSON.parse(localStorage.getItem("coaches")) || [];
    const coach = coaches.find(
      (user) =>
        user.email?.toLowerCase() === enteredEmail &&
        user.password === enteredPassword
    );

    if (coach) {
      clearOldSession();
      localStorage.setItem("userName", coach.name);
      localStorage.setItem("userRole", "coach");
      localStorage.setItem("userEmail", coach.email);
      navigate("/coach", { replace: true });
      return;
    }

    const players = JSON.parse(localStorage.getItem("players")) || [];
    const player = players.find(
      (user) =>
        user.email?.toLowerCase() === enteredEmail &&
        user.password === enteredPassword
    );

    if (player) {
      clearOldSession();
      localStorage.setItem("userName", player.fullName);
      localStorage.setItem("userRole", "player");
      localStorage.setItem("userEmail", player.email || enteredEmail);
      localStorage.setItem("playerData", JSON.stringify(player));
      navigate("/player", { replace: true });
      return;
    }

    const parents = JSON.parse(localStorage.getItem("parents")) || [];
    const parent = parents.find(
      (user) =>
        user.email?.toLowerCase() === enteredEmail &&
        user.password === enteredPassword
    );

    if (parent) {
      clearOldSession();
      localStorage.setItem("userName", parent.fullName);
      localStorage.setItem("userRole", "parent");
      localStorage.setItem("userEmail", parent.email);
      localStorage.setItem("parentData", JSON.stringify(parent));
      navigate("/parent", { replace: true });
      return;
    }

    setError("Invalid email or password");
  };

  if (checkingSession) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-700 to-emerald-500 text-white p-12">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            Cricket Academy
          </p>
          <h1 className="text-5xl font-bold leading-tight">Welcome Back</h1>
          <p className="mt-5 text-lg text-white/90 leading-relaxed">
            Login to access your dashboard, track players, manage coaching and
            stay connected with the academy.
          </p>

          <div className="mt-8 bg-white/10 rounded-2xl p-4 text-sm">
            <p className="font-semibold mb-2">Admin Demo Login</p>
            <p>Email: admin@academy.com</p>
            <p>Password: admin123</p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex items-center">
          <form onSubmit={handleLogin} className="w-full">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-4xl font-bold text-gray-900">Login</h2>
              <p className="text-gray-500 mt-2">
                Enter your credentials to continue
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium mt-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full mt-7 bg-green-700 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
            >
              Login
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-green-700 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;