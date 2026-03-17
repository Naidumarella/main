import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function ParentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("attendance");
  const [players, setPlayers] = useState([]);
  const [playerAttendanceRecords, setPlayerAttendanceRecords] = useState([]);

  const [paymentMobile, setPaymentMobile] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");

  const parentData = JSON.parse(localStorage.getItem("parentData")) || null;
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("parentData");
    navigate("/login", { replace: true });
  };

  const loadData = () => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedAttendance =
      JSON.parse(localStorage.getItem("playerAttendanceRecords")) || [];

    setPlayers(storedPlayers);
    setPlayerAttendanceRecords(storedAttendance);
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "parent") {
      navigate("/login", { replace: true });
      return;
    }

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 800);

    return () => clearInterval(interval);
  }, [navigate]);

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
  };

  const syncFeePayments = (updatedPayments) => {
    localStorage.setItem("feePayments", JSON.stringify(updatedPayments));
  };

  const linkedChild = useMemo(() => {
    if (!parentData) return null;

    return players.find(
      (player) =>
        player.playerId === parentData.childPlayerId ||
        player.parentEmail === parentData.email ||
        player.parentPhone === parentData.phone
    );
  }, [parentData, players]);

  useEffect(() => {
    if (linkedChild) {
      setPaymentMobile(linkedChild.parentPhone || parentData?.phone || "");
      setPaymentEmail(linkedChild.parentEmail || parentData?.email || "");
    }
  }, [linkedChild, parentData]);

  const linkedChildAttendanceRecords = useMemo(() => {
    if (!linkedChild) return [];
    return playerAttendanceRecords.filter(
      (item) => item.playerId === linkedChild.playerId
    );
  }, [linkedChild, playerAttendanceRecords]);

  const monthlyAttendance = useMemo(() => {
    if (!linkedChildAttendanceRecords.length) return [];

    const grouped = {};

    linkedChildAttendanceRecords.forEach((item) => {
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
  }, [linkedChildAttendanceRecords]);

  const dailyAttendance = useMemo(() => {
    return [...linkedChildAttendanceRecords]
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
  }, [linkedChildAttendanceRecords]);

  const liveAttendanceStats = useMemo(() => {
    const present = linkedChildAttendanceRecords.filter(
      (item) => item.status === "Present"
    ).length;

    const absent = linkedChildAttendanceRecords.filter(
      (item) => item.status === "Absent"
    ).length;

    const total = linkedChildAttendanceRecords.length;
    const percentage = total ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      total,
      percentage,
    };
  }, [linkedChildAttendanceRecords]);

  const payFee = () => {
    if (!linkedChild) return;

    const today = new Date();
    const monthName = today.toLocaleString("en-US", { month: "long" });
    const feeAmount =
      linkedChild?.fee?.monthlyFee || linkedChild?.fee?.amount || 2500;

    const updatedPlayers = players.map((player) =>
      player.playerId === linkedChild.playerId
        ? {
            ...player,
            parentEmail: paymentEmail || player.parentEmail,
            parentPhone: paymentMobile || player.parentPhone,
            fee: {
              ...player.fee,
              paid: true,
              month: monthName,
              amount: feeAmount,
              paidAmount: feeAmount,
              dueAmount: 0,
              status: "Paid",
              lastPaidOn: today.toLocaleDateString(),
            },
          }
        : player
    );

    syncPlayers(updatedPlayers);

    const oldPayments = JSON.parse(localStorage.getItem("feePayments")) || [];

    const alreadyExists = oldPayments.find(
      (item) =>
        item.playerId === linkedChild.playerId &&
        item.month?.toLowerCase() === monthName.toLowerCase()
    );

    let updatedPayments = [];

    if (alreadyExists) {
      updatedPayments = oldPayments.map((item) =>
        item.playerId === linkedChild.playerId &&
        item.month?.toLowerCase() === monthName.toLowerCase()
          ? {
              ...item,
              playerName: linkedChild.fullName,
              amount: feeAmount,
              paymentStatus: "Paid",
              paymentMobile,
              paymentEmail,
            }
          : item
      );
    } else {
      updatedPayments = [
        ...oldPayments,
        {
          id: Date.now(),
          playerId: linkedChild.playerId,
          playerName: linkedChild.fullName,
          month: monthName,
          amount: feeAmount,
          paymentStatus: "Paid",
          paymentMobile,
          paymentEmail,
        },
      ];
    }

    syncFeePayments(updatedPayments);
    loadData();
  };

  const sidebarItems = [
    { key: "profile", label: "My Profile", icon: "👤" },
    { key: "attendance", label: "Attendance", icon: "📅" },
    { key: "fees", label: "Fees", icon: "💳" },
    { key: "coach", label: "Coach Info", icon: "🧑‍🏫" },
    { key: "performance", label: "Performance", icon: "📈" },
  ];

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">My Profile</h3>

          <div className="mb-6 flex flex-col items-center md:items-start">
            <img
              src={
                parentData?.profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Parent"
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-lg"
            />
            <p className="mt-3 text-gray-600 font-medium">Parent Photo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Parent Name</p>
              <h4 className="text-xl font-bold mt-1">
                {parentData?.fullName || "-"}
              </h4>
            </div>

            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Email</p>
              <h4 className="text-xl font-bold mt-1 break-words">
                {parentData?.email || "-"}
              </h4>
            </div>

            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Phone</p>
              <h4 className="text-xl font-bold mt-1">
                {parentData?.phone || "-"}
              </h4>
            </div>

            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Relation</p>
              <h4 className="text-xl font-bold mt-1">
                {parentData?.relation || "-"}
              </h4>
            </div>

            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Child Name</p>
              <h4 className="text-xl font-bold mt-1">
                {linkedChild?.fullName || parentData?.childName || "-"}
              </h4>
            </div>

            <div className="bg-white border rounded-2xl p-4">
              <p className="text-gray-500 text-sm">Child Player ID</p>
              <h4 className="text-xl font-bold mt-1">
                {linkedChild?.playerId || parentData?.childPlayerId || "-"}
              </h4>
            </div>
          </div>
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

    if (activeTab === "fees") {
      return (
        <div>
          <div className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">
              Confirm Payment
            </h3>

            <div className="grid md:grid-cols-[220px_30px_1fr] gap-y-6 gap-x-4 items-center">
              <p className="text-gray-700 text-lg">Student Name</p>
              <p className="text-gray-500 text-lg">:</p>
              <p className="font-semibold text-slate-900 text-xl break-words">
                {linkedChild?.fullName || parentData?.childName || "-"}
              </p>

              <p className="text-gray-700 text-lg">Father / Parent Name</p>
              <p className="text-gray-500 text-lg">:</p>
              <p className="font-semibold text-slate-900 text-xl break-words">
                {linkedChild?.parentName || parentData?.fullName || "-"}
              </p>

              <p className="text-gray-700 text-lg">Phone Number</p>
              <p className="text-gray-500 text-lg">:</p>
              <p className="font-semibold text-slate-900 text-xl">
                {linkedChild?.parentPhone || parentData?.phone || "-"}
              </p>

              <p className="text-gray-700 text-lg">Amount</p>
              <p className="text-gray-500 text-lg">:</p>
              <p className="font-semibold text-slate-900 text-xl">
                ₹{linkedChild?.fee?.monthlyFee || 0}
              </p>

              <label className="text-gray-700 text-lg font-medium">
                Payment Mobile Number
              </label>
              <p className="text-gray-500 text-lg">:</p>
              <input
                type="text"
                value={paymentMobile}
                onChange={(e) => setPaymentMobile(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payment mobile number"
              />

              <label className="text-gray-700 text-lg font-medium">
                Payment Email
              </label>
              <p className="text-gray-500 text-lg">:</p>
              <input
                type="email"
                value={paymentEmail}
                onChange={(e) => setPaymentEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payment email"
              />
            </div>

            <div className="mt-10 flex justify-center">
              {linkedChild?.fee?.paid ? (
                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-semibold">
                  Fee Already Paid
                </div>
              ) : (
                <button
                  onClick={payFee}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow"
                >
                  Pay Now
                </button>
              )}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <p className="text-gray-600">Fee Status</p>
                <h4 className="text-2xl font-bold text-green-700 mt-2">
                  {linkedChild?.fee?.status || "Pending"}
                </h4>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-gray-600">Last Paid On</p>
                <h4 className="text-2xl font-bold text-blue-700 mt-2">
                  {linkedChild?.fee?.lastPaidOn || "-"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "coach") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Coach Information</h3>
          {linkedChild?.assignedCoachDetails?.length ? (
            <div className="space-y-4">
              {linkedChild.assignedCoachDetails.map((coach, index) => (
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

    if (activeTab === "performance") {
      return (
        <div>
          <h3 className="text-2xl font-bold mb-4">Performance Report</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Batting</p>
              <p className="text-gray-600">
                Consistent improvement in shot timing.
              </p>
            </div>
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="font-semibold">Discipline</p>
              <p className="text-gray-600">
                Very regular and active in training.
              </p>
            </div>
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
            <h2 className="text-3xl font-bold mt-3">Parent Panel</h2>
            <p className="text-slate-400 text-sm mt-2 leading-6">
              View child attendance, fee details and coach information.
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
                Parent Menu
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
                Parent Control Panel
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                Parent Dashboard
              </h1>
              <p className="text-gray-600 mt-3 max-w-3xl text-base leading-7">
                Welcome, {parentData?.fullName || userName || "Parent"}.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
                <p className="text-gray-500">Child Name</p>
                <h3 className="text-2xl font-bold mt-2">
                  {linkedChild?.fullName || parentData?.childName || "-"}
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
                  {linkedChild?.playerRole || "-"}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">
                <p className="text-gray-500">Fee Status</p>
                <h3 className="text-2xl font-bold mt-2">
                  {linkedChild?.fee?.status || "Pending"}
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

export default ParentDashboard;