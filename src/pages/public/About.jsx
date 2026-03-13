function About() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-green-700 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          About Our Cricket Academy
        </h1>

        <p className="max-w-3xl mx-auto text-lg">
          Our academy trains young cricketers to become professional players
          through structured coaching, match practice and fitness programs.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Building Future Cricket Stars
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Cricket Academy is dedicated to developing talented players through
            professional coaching programs. Our training focuses on batting,
            bowling, fielding, fitness and match strategies.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Our experienced coaches guide students with modern training
            techniques and match simulations to improve confidence and
            performance.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80"
          alt="Cricket Training"
          className="rounded-xl shadow-lg w-full h-[350px] object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Training Programs
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">
              🏏 Batting Coaching
            </h3>
            <p className="text-gray-600">
              Improve batting techniques, shot selection and match confidence.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">
              🎯 Bowling Training
            </h3>
            <p className="text-gray-600">
              Learn pace, spin bowling and improve line and length accuracy.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-semibold mb-3">
              🤾 Fielding Practice
            </h3>
            <p className="text-gray-600">
              Advanced drills for catching, throwing and ground fielding.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-700 text-white py-14 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="mt-2">Students Trained</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">10+</h3>
            <p className="mt-2">Professional Coaches</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">8+</h3>
            <p className="mt-2">Years Experience</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">50+</h3>
            <p className="mt-2">Tournament Wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;