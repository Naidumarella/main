import { useEffect, useState } from "react";

function Coaches() {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coaches, setCoaches] = useState([]);

  const defaultCoaches = [
    {
      name: "Rahul Sharma",
      email: "rahul@academy.com",
      password: "rahul123",
      role: "Batting Coach",
      time: "6 AM - 9 AM",
      exp: "10+ Years Experience",
      color: "from-green-500 to-green-700",
      specialization: "Top order batting, cover drives, match temperament",
      achievements: "Worked with 50+ district level players",
      phone: "9876543210",
    },
    {
      name: "Anil Kumar",
      email: "anil@academy.com",
      password: "anil123",
      role: "Bowling Coach",
      time: "7 AM - 10 AM",
      exp: "8+ Years Experience",
      color: "from-blue-500 to-blue-700",
      specialization: "Fast bowling, swing control, yorkers",
      achievements: "Trained 30+ competitive pace bowlers",
      phone: "9876501234",
    },
    {
      name: "Suresh Reddy",
      email: "suresh@academy.com",
      password: "suresh123",
      role: "Fielding Coach",
      time: "5 PM - 7 PM",
      exp: "7+ Years Experience",
      color: "from-orange-400 to-orange-600",
      specialization: "Ground fielding, catching, reflex drills",
      achievements: "Conducted 100+ fielding camps",
      phone: "9845012345",
    },
    {
      name: "Ramesh Patel",
      email: "ramesh@academy.com",
      password: "ramesh123",
      role: "Fitness Coach",
      time: "6 PM - 8 PM",
      exp: "6+ Years Experience",
      color: "from-purple-500 to-purple-700",
      specialization: "Strength, stamina, injury prevention",
      achievements: "Designed academy fitness plans",
      phone: "9811122233",
    },
    {
      name: "Kiran Verma",
      email: "kiran@academy.com",
      password: "kiran123",
      role: "Wicket Keeping Coach",
      time: "4 PM - 6 PM",
      exp: "9+ Years Experience",
      color: "from-red-500 to-red-700",
      specialization: "Glove work, stumpings, foot movement",
      achievements: "Produced 20+ wicket keepers",
      phone: "9888877766",
    },
  ];

  const colorOptions = [
    "from-green-500 to-green-700",
    "from-blue-500 to-blue-700",
    "from-orange-400 to-orange-600",
    "from-purple-500 to-purple-700",
    "from-red-500 to-red-700",
    "from-cyan-500 to-cyan-700",
    "from-pink-500 to-pink-700",
    "from-indigo-500 to-indigo-700",
  ];

  useEffect(() => {
    const storedCoaches = JSON.parse(localStorage.getItem("coaches"));

    if (storedCoaches && storedCoaches.length > 0) {
      const updatedCoaches = storedCoaches.map((coach, index) => ({
        ...coach,
        exp: coach.exp || "5+ Years Experience",
        color: coach.color || colorOptions[index % colorOptions.length],
        specialization:
          coach.specialization || "Professional cricket coaching and player development",
        achievements:
          coach.achievements || "Guiding academy players with structured training",
        phone: coach.phone || "9876543210",
      }));

      setCoaches(updatedCoaches);
    } else {
      localStorage.setItem("coaches", JSON.stringify(defaultCoaches));
      setCoaches(defaultCoaches);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-14 px-6 md:px-10">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <p className="text-green-700 font-semibold tracking-wide uppercase text-sm mb-3">
          Meet Our Experts
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Our Coaches
        </h2>

        <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-base md:text-lg">
          Learn from experienced cricket professionals who guide players in
          batting, bowling, fielding, fitness, and match preparation.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {coaches.map((coach, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
          >
            <div className={`h-2 bg-gradient-to-r ${coach.color}`}></div>

            <div className="p-7">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${coach.color} text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-6 group-hover:scale-105 transition`}
              >
                {coach.name?.charAt(0) || "C"}
              </div>

              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                {coach.name}
              </h3>

              <p className="text-green-700 font-semibold mt-2 text-lg">
                {coach.role}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-full text-sm font-medium">
                  ⭐ {coach.exp}
                </span>

                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                  ⏰ {coach.time}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="bg-gray-50 rounded-2xl p-4 border">
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Specialization
                  </p>
                  <p className="text-gray-700">{coach.specialization}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border">
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Achievement
                  </p>
                  <p className="text-gray-700">{coach.achievements}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCoach(coach)}
                className="mt-7 w-full bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-2xl font-semibold text-lg transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCoach && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-[fadeIn_.2s_ease-in-out]">
            <button
              onClick={() => setSelectedCoach(null)}
              className="absolute top-4 right-5 text-gray-500 hover:text-black text-3xl z-10"
            >
              ×
            </button>

            <div className={`h-3 bg-gradient-to-r ${selectedCoach.color}`}></div>

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${selectedCoach.color} text-white flex items-center justify-center text-4xl font-bold shadow-lg`}
                >
                  {selectedCoach.name?.charAt(0) || "C"}
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {selectedCoach.name}
                  </h3>
                  <p className="text-green-700 font-semibold text-lg mt-2">
                    {selectedCoach.role}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Experience
                  </p>
                  <p className="text-gray-800">{selectedCoach.exp}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Training Time
                  </p>
                  <p className="text-gray-800">{selectedCoach.time}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border md:col-span-2">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Specialization
                  </p>
                  <p className="text-gray-800">{selectedCoach.specialization}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border md:col-span-2">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Achievement
                  </p>
                  <p className="text-gray-800">{selectedCoach.achievements}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Phone
                  </p>
                  <p className="text-gray-800">{selectedCoach.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    Email
                  </p>
                  <p className="text-gray-800 break-all">{selectedCoach.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCoach(null)}
                className="mt-8 w-full bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-2xl font-semibold text-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coaches;