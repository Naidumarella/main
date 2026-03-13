import { Link } from "react-router-dom";

function Home() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1920&q=80')",
      }}
    >

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">

        <div className="text-center text-white max-w-3xl">

          <h2 className="text-3xl md:text-4xl font-semibold">
            Welcome to
          </h2>

          <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mt-2">
           Cricket Academy
          </h1>

          <p className="mt-4 text-lg md:text-xl">
            Train with professional coaches and improve your cricket skills.
          </p>

          <div className="flex justify-center gap-6 mt-8">

            <Link
              to="/register"
              className="bg-green-700 hover:bg-green-600 px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Join Academy
            </Link>

            <Link
              to="/coaches"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Explore Coaches
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Home;

