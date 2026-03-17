import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function CoachDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("attendance");
  const [players, setPlayers] = useState([]);
  const [coachInfo, setCoachInfo] = useState(null);
  const [tournaments, setTournaments] = useState([]);

  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  const loadDashboardData = () => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    setPlayers(storedPlayers);
    setTournaments(storedTournaments);

    const storedCoaches = JSON.parse(localStorage.getItem("coaches")) || [];
    const currentCoach = storedCoaches.find(
      (coach) => coach.email?.toLowerCase() === userEmail?.toLowerCase()
    );

    if (currentCoach) {
      setCoachInfo(currentCoach);
    } else {
      setCoachInfo(null);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "coach" || !userEmail) {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 800);

    return () => clearInterval(interval);
  }, [userEmail, navigate]);

  const syncPlayers = (updatedPlayers) => {
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    const playerData = JSON.parse(localStorage.getItem("playerData"));
    if (playerData) {
      const refreshed = updatedPlayers.find(
        (p) => p.playerId === playerData.playerId
      );
      if (refreshed) {
        localStorage.setItem("playerData", JSON.stringify(refreshed));
      }
    }

    loadDashboardData();
  };

  const assignedPlayers = useMemo(() => {
    return players.filter((player) =>
      player.assignedCoaches?.includes(userEmail)
    );
  }, [players, userEmail]);

  const markAttendance = (playerId, status) => {
    const today = new Date().toISOString().split("T")[0];
    const session = "Morning";

    const existingRecords =
      JSON.parse(localStorage.getItem("playerAttendanceRecords")) || [];

    const existingIndex = existingRecords.findIndex(
      (item) =>
        item.playerId === playerId &&
        item.date === today &&
        item.session === session
    );

    let updatedRecords = [];

    if (existingIndex >= 0) {
      updatedRecords = existingRecords.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              status: status === "present" ? "Present" : "Absent",
            }
          : item
      );
    } else {
      updatedRecords = [
        ...existingRecords,
        {
          playerId,
          date: today,
          status: status === "present" ? "Present" : "Absent",
          session,
        },
      ];
    }

    localStorage.setItem(
      "playerAttendanceRecords",
      JSON.stringify(updatedRecords)
    );

    const playerWiseRecords = updatedRecords.filter(
      (item) => item.playerId === playerId
    );

    const present = playerWiseRecords.filter(
      (item) => item.status === "Present"
    ).length;
    const absent = playerWiseRecords.filter(
      (item) => item.status === "Absent"
    ).length;
    const total = playerWiseRecords.length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    const updatedPlayers = players.map((player) => {
      if (player.playerId !== playerId) return player;

      return {
        ...player,
        attendance: {
          present,
          absent,
          total,
          percentage,
        },
      };
    });

    syncPlayers(updatedPlayers);
  };

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = useMemo(() => {
    const records =
      JSON.parse(localStorage.getItem("playerAttendanceRecords")) || [];

    return assignedPlayers.map((player) => {
      const todayRecord = records.find(
        (item) =>
          item.playerId === player.playerId &&
          item.date === today &&
          item.session === "Morning"
      );

      return {
        ...player,
        todayStatus: todayRecord?.status || "Not Marked",
      };
    });
  }, [assignedPlayers, today]);

  const totalPresent = assignedPlayers.reduce(
    (sum, p) => sum + (p.attendance?.present || 0),
    0
  );

  const totalAbsent = assignedPlayers.reduce(
    (sum, p) => sum + (p.attendance?.absent || 0),
    0
  );

  const averageAttendance = assignedPlayers.length
    ? Math.round(
        assignedPlayers.reduce(
          (sum, p) => sum + (p.attendance?.percentage || 0),
          0
        ) / assignedPlayers.length
      )
    : 0;

  const coachTournamentView = useMemo(() => {
    return tournaments.map((item) => {
      const eligiblePlayers = assignedPlayers.filter((player) => {
        if (!item.category || item.category.trim() === "") return true;

        const tournamentCategory = item.category.toLowerCase();
        const playerCategory = player.ageCategory?.toLowerCase() || "";
        const playerRole = player.playerRole?.toLowerCase() || "";

        return (
          tournamentCategory.includes(playerCategory) ||
          tournamentCategory.includes(playerRole) ||
          tournamentCategory === "all"
        );
      });

      return {
        ...item,
        eligibleCount: eligiblePlayers.length,
        eligiblePlayers,
      };
    });
  }, [tournaments, assignedPlayers]);

  const sidebarItems = [
    { key: "profile", label: "My Profile", icon: "👤" },
    { key: "attendance", label: "Attendance", icon: "📅" },
    { key: "performance", label: "Performance", icon: "📈" },
    { key: "training", label: "Training Plan", icon: "🏏" },
    { key: "tournaments", label: "Tournaments", icon: "🏆" },
    { key: "notes", label: "Match Notes", icon: "📝" },
  ];

  const renderPlayerPhoto = (player, size = "w-14 h-14") => {
    if (player?.profilePhoto) {
      return (
        <img
          src={player.profilePhoto}
          alt={player.fullName || "Player"}
          className={`${size} rounded-2xl object-cover border border-gray-200 shadow-sm`}
        />
      );
    }

    return (
      <div
        className={`${size} rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200 shadow-sm`}
      >
        {player?.fullName?.charAt(0)?.toUpperCase() || "P"}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">My Profile</h3>

          {coachInfo ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Coach Name</p>
                <h4 className="text-xl font-bold mt-1">
                  {coachInfo.name || "-"}
                </h4>
              </div>

              <div className="bg-white border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Email</p>
                <h4 className="text-xl font-bold mt-1 break-words">
                  {coachInfo.email || "-"}
                </h4>
              </div>

              <div className="bg-white border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Role</p>
                <h4 className="text-xl font-bold mt-1">
                  {coachInfo.role || "-"}
                </h4>
              </div>

              <div className="bg-white border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Training Time</p>
                <h4 className="text-xl font-bold mt-1">
                  {coachInfo.time || "-"}
                </h4>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border rounded-xl p-4 text-red-600">
              Coach details not found.
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "attendance") {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Attendance Details</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border rounded-xl p-4">
                <p className="text-gray-600">Assigned Players</p>
                <h4 className="text-3xl font-bold text-green-700 mt-2">
                  {assignedPlayers.length}
                </h4>
              </div>

              <div className="bg-blue-50 border rounded-xl p-4">
                <p className="text-gray-600">Average Attendance</p>
                <h4 className="text-3xl font-bold text-blue-700 mt-2">
                  {averageAttendance}%
                </h4>
              </div>

              <div className="bg-violet-50 border rounded-xl p-4">
                <p className="text-gray-600">Today</p>
                <h4 className="text-xl font-bold text-violet-700 mt-2">
                  {today}
                </h4>
              </div>
            </div>
          </div>

          {assignedPlayers.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-600">
              No players assigned yet.
            </div>
          ) : (
            <div className="space-y-4">
              {todayAttendance.map((player, index) => (
                <div key={index} className="bg-white border rounded-2xl p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {renderPlayerPhoto(player)}

                      <div>
                        <p className="font-semibold text-gray-900">
                          {player.fullName}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          ID: {player.playerId} • Role: {player.playerRole} •
                          Category: {player.ageCategory}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Present: {player.attendance?.present || 0} • Absent:{" "}
                          {player.attendance?.absent || 0} • Total:{" "}
                          {player.attendance?.total || 0} •{" "}
                          {player.attendance?.percentage || 0}%
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Today Status:{" "}
                          <span
                            className={`font-semibold ${
                              player.todayStatus === "Present"
                                ? "text-green-700"
                                : player.todayStatus === "Absent"
                                ? "text-red-700"
                                : "text-gray-500"
                            }`}
                          >
                            {player.todayStatus}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => markAttendance(player.playerId, "present")}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-white ${
                          player.todayStatus === "Present"
                            ? "bg-green-700"
                            : "bg-green-600 hover:bg-green-500"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(player.playerId, "absent")}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-white ${
                          player.todayStatus === "Absent"
                            ? "bg-red-700"
                            : "bg-red-600 hover:bg-red-500"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "performance") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Player Performance</h3>
          {assignedPlayers.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-600">
              No players assigned yet.
            </div>
          ) : (
            <div className="space-y-4">
              {assignedPlayers.map((player, index) => (
                <div key={index} className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    {renderPlayerPhoto(player)}

                    <div>
                      <p className="font-semibold">{player.fullName}</p>
                      <p className="text-gray-600">
                        Role: {player.playerRole} • Category: {player.ageCategory}
                      </p>
                      <p className="text-gray-600 mt-1">
                        Attendance: {player.attendance?.percentage || 0}%
                      </p>
                      <p className="text-gray-600 mt-1">
                        {player.attendance?.percentage >= 75
                          ? "Good consistency in training sessions."
                          : "Needs better regularity and session focus."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "training") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Training Plan</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="bg-gray-50 p-4 rounded-xl border">
              6:00 AM - Warm Up & Fitness
            </li>
            <li className="bg-gray-50 p-4 rounded-xl border">
              6:45 AM - Skill Session
            </li>
            <li className="bg-gray-50 p-4 rounded-xl border">
              7:30 AM - Practice Drills
            </li>
            <li className="bg-gray-50 p-4 rounded-xl border">
              8:15 AM - Match Simulation
            </li>
          </ul>
        </div>
      );
    }

    if (activeTab === "tournaments") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Tournament Updates</h3>

          {coachTournamentView.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-600">
              No tournaments available right now.
            </div>
          ) : (
            <div className="space-y-4">
              {coachTournamentView.map((item) => (
                <div key={item.id} className="bg-yellow-50 border rounded-xl p-5">
                  <p className="font-semibold text-lg">
                    {item.tournamentName || "Tournament"}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Location: {item.location || "-"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Date: {item.startDate || "-"} to {item.endDate || "-"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Category: {item.category || "All"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Entry Fee: ₹{item.entryFee || 0}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Cash Prize: ₹{item.cashPrize || 0}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Status: {item.status || "Upcoming"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Eligible Assigned Players: {item.eligibleCount}
                  </p>

                  <div className="mt-3">
                    <p className="font-medium text-slate-900">
                      Eligible Player Names:
                    </p>

                    {item.eligiblePlayers.length === 0 ? (
                      <p className="text-gray-600 mt-1">
                        No assigned players are eligible for this tournament.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {item.eligiblePlayers.map((player) => (
                          <div
                            key={player.playerId}
                            className="flex items-center gap-3 bg-white border border-yellow-200 rounded-2xl px-3 py-3"
                          >
                            {renderPlayerPhoto(player, "w-12 h-12")}
                            <div>
                              <p className="font-medium text-slate-900">
                                {player.fullName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {player.playerRole} • {player.ageCategory}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mt-3">
                    {item.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "notes") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Match Notes</h3>
          <div className="bg-yellow-50 border p-5 rounded-xl">
            <p className="text-gray-700">
              Coach-wise player progress, remarks and future improvement
              maintenance.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 bg-slate-950 text-white flex-col shadow-2xl">
          <div className="px-6 py-7 border-b border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
              Cricket Academy
            </p>
            <h2 className="text-3xl font-bold mt-3">Coach Panel</h2>
            <p className="text-slate-400 text-sm mt-2 leading-6">
              Manage player attendance, performance and coaching tasks.
            </p>
          </div>

          <div className="flex-1 px-4 py-5 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-slate-200 hover:bg-slate-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-2xl font-semibold"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="lg:hidden px-4 pt-4">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Coach Menu
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                      activeTab === item.key
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="col-span-2 bg-red-600 hover:bg-red-500 text-white rounded-2xl px-3 py-3 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-8 rounded-[28px] bg-white border border-gray-200 shadow-sm px-6 py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700 mb-2">
                Coach Control Panel
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Coach Dashboard
              </h1>
              <p className="text-gray-600 mt-3 max-w-3xl text-base leading-7">
                Welcome, {coachInfo?.name || userName || "Coach"}.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
                <p className="text-gray-500">Players Assigned</p>
                <h3 className="text-2xl font-bold mt-2">
                  {assignedPlayers.length}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">
                <p className="text-gray-500">Present Marks</p>
                <h3 className="text-2xl font-bold mt-2">{totalPresent}</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-gray-500">Absent Marks</p>
                <h3 className="text-2xl font-bold mt-2">{totalAbsent}</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">
                <p className="text-gray-500">Coach Role</p>
                <h3 className="text-2xl font-bold mt-2">
                  {coachInfo?.role || "Coach"}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-6 md:p-7 min-h-[520px]">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CoachDashboard;