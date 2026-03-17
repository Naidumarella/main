import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function PlayerDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("attendance");
  const [players, setPlayers] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerAttendanceRecords, setPlayerAttendanceRecords] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("playerData");
    navigate("/login", { replace: true });
  };

  const loadDashboardData = () => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedAttendance =
      JSON.parse(localStorage.getItem("playerAttendanceRecords")) || [];
    const storedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    setPlayers(storedPlayers);
    setPlayerAttendanceRecords(storedAttendance);
    setTournaments(storedTournaments);

    const storedPlayerData = JSON.parse(localStorage.getItem("playerData"));

    if (storedPlayerData?.playerId) {
      const freshPlayer = storedPlayers.find(
        (player) => player.playerId === storedPlayerData.playerId
      );

      setPlayerInfo(freshPlayer || storedPlayerData);

      if (freshPlayer) {
        localStorage.setItem("playerData", JSON.stringify(freshPlayer));
      }
      return;
    }

    const byEmail = storedPlayers.find(
      (player) => player.email?.toLowerCase() === userEmail?.toLowerCase()
    );

    if (byEmail) {
      setPlayerInfo(byEmail);
      localStorage.setItem("playerData", JSON.stringify(byEmail));
    } else {
      setPlayerInfo(null);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "player" || !userEmail) {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 800);

    return () => clearInterval(interval);
  }, [userEmail, navigate]);

  const assignedCoachNames = useMemo(() => {
    if (!playerInfo?.assignedCoachDetails?.length) return [];
    return playerInfo.assignedCoachDetails.map((coach) => coach.name);
  }, [playerInfo]);

  const myAttendanceRecords = useMemo(() => {
    if (!playerInfo?.playerId) return [];
    return playerAttendanceRecords.filter(
      (item) => item.playerId === playerInfo.playerId
    );
  }, [playerInfo, playerAttendanceRecords]);

  const eligibleTournaments = useMemo(() => {
    if (!playerInfo) return tournaments;

    return tournaments.filter((item) => {
      if (!item.category || item.category.trim() === "") return true;

      const tournamentCategory = item.category.toLowerCase();
      const playerCategory = playerInfo.ageCategory?.toLowerCase() || "";
      const playerRole = playerInfo.playerRole?.toLowerCase() || "";

      return (
        tournamentCategory.includes(playerCategory) ||
        tournamentCategory.includes(playerRole) ||
        tournamentCategory === "all"
      );
    });
  }, [tournaments, playerInfo]);

  const liveAttendanceStats = useMemo(() => {
    const present = myAttendanceRecords.filter(
      (item) => item.status === "Present"
    ).length;

    const absent = myAttendanceRecords.filter(
      (item) => item.status === "Absent"
    ).length;

    const total = myAttendanceRecords.length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      total,
      percentage,
    };
  }, [myAttendanceRecords]);

  const monthlyAttendance = useMemo(() => {
    const grouped = {};

    myAttendanceRecords.forEach((item) => {
      const dateObj = new Date(item.date);
      const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
      const monthLabel = dateObj
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();

      if (!grouped[key]) {
        grouped[key] = {
          key,
          monthLabel,
          fullMonth: dateObj.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          }),
          presentDays: 0,
          workingDays: 0,
        };
      }

      grouped[key].workingDays += 1;

      if (item.status === "Present") {
        grouped[key].presentDays += 1;
      }
    });

    return Object.values(grouped)
      .map((item) => ({
        ...item,
        percentage: item.workingDays
          ? Math.round((item.presentDays / item.workingDays) * 100)
          : 0,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [myAttendanceRecords]);

  const dailyAttendance = useMemo(() => {
    return [...myAttendanceRecords]
      .map((item, index) => ({
        id: index + 1,
        rawDate: item.date,
        date: new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        session: item.session || "Morning",
        status: item.status,
      }))
      .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [myAttendanceRecords]);

  const sidebarItems = [
    { key: "profile", label: "My Profile", icon: "👤" },
    { key: "attendance", label: "Attendance", icon: "📅" },
    { key: "performance", label: "Performance", icon: "📈" },
    { key: "coach", label: "My Coaches", icon: "🧑‍🏫" },
    { key: "tournament", label: "Tournament", icon: "🏆" },
  ];

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-6">My Profile</h3>

          {playerInfo ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-6 bg-white border rounded-2xl p-6">
                <img
                  src={
                    playerInfo.profilePhoto ||
                    "https://via.placeholder.com/140x140.png?text=Player"
                  }
                  alt="Player"
                  className="w-32 h-32 rounded-3xl object-cover border shadow-sm"
                />

                <div className="min-w-0">
                  <h4 className="text-2xl font-bold text-slate-900">
                    {playerInfo.fullName || "-"}
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Player ID: {playerInfo.playerId || "-"}
                  </p>
                  <p className="text-gray-600">
                    Role: {playerInfo.playerRole || "-"}
                  </p>
                  <p className="text-gray-600">
                    Category: {playerInfo.ageCategory || "-"}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Email</p>
                  <h4 className="text-xl font-bold mt-1 break-words">
                    {playerInfo.email || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.phone || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Age</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.age || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Gender</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.gender || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Batting Style</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.battingStyle || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Bowling Style</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.bowlingStyle || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Parent Name</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.parentName || "-"}
                  </h4>
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-gray-500 text-sm">Parent Contact</p>
                  <h4 className="text-xl font-bold mt-1">
                    {playerInfo.parentPhone || "-"}
                  </h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border rounded-xl p-4 text-red-600">
              Player details not found. Please logout and login again.
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border rounded-xl p-4">
                <p className="text-gray-600">Present</p>
                <h4 className="text-3xl font-bold text-green-700 mt-2">
                  {liveAttendanceStats.present}
                </h4>
              </div>

              <div className="bg-red-50 border rounded-xl p-4">
                <p className="text-gray-600">Absent</p>
                <h4 className="text-3xl font-bold text-red-600 mt-2">
                  {liveAttendanceStats.absent}
                </h4>
              </div>
            </div>

            <div className="bg-blue-50 border rounded-xl p-4 mt-4">
              <p className="text-gray-600">Attendance Percentage</p>
              <h4 className="text-3xl font-bold text-blue-700 mt-2">
                {liveAttendanceStats.percentage}%
              </h4>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <h4 className="text-xl font-bold mb-4">Monthly Attendance</h4>

            {monthlyAttendance.length === 0 ? (
              <div className="text-gray-500">No monthly attendance found.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {monthlyAttendance.map((item) => (
                  <div
                    key={item.key}
                    className="border rounded-2xl p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl border-2 border-indigo-500 text-indigo-600 flex flex-col items-center justify-center font-bold">
                          <span className="text-xs">📅</span>
                          <span className="text-sm">{item.monthLabel}</span>
                        </div>

                        <div>
                          <p className="text-lg">
                            <span className="font-bold">{item.presentDays}</span>{" "}
                            Present Days
                          </p>
                          <p className="text-lg">
                            <span className="font-bold">{item.workingDays}</span>{" "}
                            Working Days
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <h3 className="text-4xl font-bold text-blue-900">
                          {item.percentage}
                          <span className="text-2xl">%</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <h4 className="text-xl font-bold mb-4">Everyday Attendance</h4>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 text-blue-900 text-lg font-bold">
                      Date
                    </th>
                    <th className="py-3 px-4 text-blue-900 text-lg font-bold">
                      Session
                    </th>
                    <th className="py-3 px-4 text-blue-900 text-lg font-bold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        No daily attendance records found.
                      </td>
                    </tr>
                  ) : (
                    dailyAttendance.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.session}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "performance") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Performance Report</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Batting</p>
              <p className="text-gray-600">
                {["Batsman", "Wicket Keeper", "All Rounder"].includes(
                  playerInfo?.playerRole
                )
                  ? "Shot selection and timing improving with regular practice."
                  : "Batting development can be monitored with future sessions."}
              </p>
            </div>
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Bowling</p>
              <p className="text-gray-600">
                {["Bowler", "All Rounder"].includes(playerInfo?.playerRole)
                  ? "Accuracy and consistency improving week by week."
                  : "Bowling metrics will improve based on role-specific practice."}
              </p>
            </div>
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Discipline</p>
              <p className="text-gray-600">
                Current attendance: {liveAttendanceStats.percentage}%. Better
                attendance helps improve overall performance.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "coach") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Coach Information</h3>
          {playerInfo?.assignedCoachDetails?.length ? (
            <div className="space-y-4">
              {playerInfo.assignedCoachDetails.map((coach, index) => (
                <div key={index} className="bg-yellow-50 border rounded-xl p-5">
                  <p className="font-semibold">{coach.name}</p>
                  <p className="text-gray-600 mt-2">{coach.role}</p>
                  <p className="text-gray-600 mt-1">{coach.email}</p>
                  <p className="text-gray-600 mt-1">
                    Training Time: {coach.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-600">
              No coach info available.
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "tournament") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Tournament Updates</h3>

          {eligibleTournaments.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-600">
              No tournaments available right now.
            </div>
          ) : (
            <div className="space-y-4">
              {eligibleTournaments.map((item) => (
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
                    Status: {item.status || "Upcoming"}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {item.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          )}
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
            <h2 className="text-3xl font-bold mt-3">Player Panel</h2>
            <p className="text-slate-400 text-sm mt-2 leading-6">
              View attendance, coach details, performance and tournament info.
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
                Player Menu
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
                Player Control Panel
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Player Dashboard
              </h1>
              <p className="text-gray-600 mt-3 max-w-3xl text-base leading-7">
                Welcome, {playerInfo?.fullName || userName || "Player"}.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
                <p className="text-gray-500">Player Name</p>
                <h3 className="text-2xl font-bold mt-2">
                  {playerInfo?.fullName || "-"}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">
                <p className="text-gray-500">Attendance</p>
                <h3 className="text-2xl font-bold mt-2">
                  {liveAttendanceStats.percentage}%
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-gray-500">Role</p>
                <h3 className="text-2xl font-bold mt-2">
                  {playerInfo?.playerRole || "-"}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">
                <p className="text-gray-500">Coaches</p>
                <h3 className="text-2xl font-bold mt-2">
                  {assignedCoachNames.length}
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

export default PlayerDashboard;