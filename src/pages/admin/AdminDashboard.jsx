import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const defaultCoaches = [
    {
      name: "Rahul Sharma",
      email: "rahul@academy.com",
      password: "rahul123",
      role: "Batting Coach",
      time: "6 AM - 9 AM",
    },
    {
      name: "Anil Kumar",
      email: "anil@academy.com",
      password: "anil123",
      role: "Bowling Coach",
      time: "7 AM - 10 AM",
    },
    {
      name: "Suresh Reddy",
      email: "suresh@academy.com",
      password: "suresh123",
      role: "Fielding Coach",
      time: "5 PM - 7 PM",
    },
    {
      name: "Ramesh Patel",
      email: "ramesh@academy.com",
      password: "ramesh123",
      role: "Fitness Coach",
      time: "6 PM - 8 PM",
    },
    {
      name: "Kiran Verma",
      email: "kiran@academy.com",
      password: "kiran123",
      role: "Wicket Keeping Coach",
      time: "4 PM - 6 PM",
    },
  ];

  const [coachList, setCoachList] = useState([]);
  const [players, setPlayers] = useState([]);
  const [parents, setParents] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [search, setSearch] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCoaches, setSelectedCoaches] = useState([]);

  const [showAddCoach, setShowAddCoach] = useState(false);
  const [coachError, setCoachError] = useState("");
  const [newCoach, setNewCoach] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    time: "",
  });

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerError, setPlayerError] = useState("");
  const [newPlayer, setNewPlayer] = useState({
    fullName: "",
    playerId: "",
    playerRole: "",
    ageCategory: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    monthlyFee: "",
  });

  const [coachAttendance, setCoachAttendance] = useState([]);
  const [playerAttendanceRecords, setPlayerAttendanceRecords] = useState([]);
  const [selectedCoachEmail, setSelectedCoachEmail] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  const [feePayments, setFeePayments] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");
    const adminData = JSON.parse(localStorage.getItem("adminData"));

    if (!isAdminLoggedIn || userRole !== "admin" || adminData?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    setPlayers(storedPlayers);
    if (storedPlayers[0]?.playerId) {
      setSelectedPlayerId(storedPlayers[0].playerId);
    }

    const storedParents = JSON.parse(localStorage.getItem("parents")) || [];
    setParents(storedParents);

    const storedCoaches = JSON.parse(localStorage.getItem("coaches"));
    const finalCoaches =
      storedCoaches && storedCoaches.length ? storedCoaches : defaultCoaches;

    setCoachList(finalCoaches);
    localStorage.setItem("coaches", JSON.stringify(finalCoaches));

    if (finalCoaches[0]?.email) {
      setSelectedCoachEmail(finalCoaches[0].email);
    }

    const storedCoachAttendance =
      JSON.parse(localStorage.getItem("coachAttendance")) || [];
    setCoachAttendance(storedCoachAttendance);

    const storedPlayerAttendanceRecords =
      JSON.parse(localStorage.getItem("playerAttendanceRecords")) || [];
    setPlayerAttendanceRecords(storedPlayerAttendanceRecords);

    const storedFeePayments =
      JSON.parse(localStorage.getItem("feePayments")) || [];
    setFeePayments(storedFeePayments);

    const storedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];
    setTournaments(storedTournaments);
  }, [navigate]);

  const syncPlayers = (updatedPlayers) => {
    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    const playerData = JSON.parse(localStorage.getItem("playerData"));
    if (playerData) {
      const refreshedLoggedPlayer = updatedPlayers.find(
        (p) => p.playerId === playerData.playerId
      );
      if (refreshedLoggedPlayer) {
        localStorage.setItem("playerData", JSON.stringify(refreshedLoggedPlayer));
      }
    }
  };

  const syncCoaches = (updatedCoaches) => {
    setCoachList(updatedCoaches);
    localStorage.setItem("coaches", JSON.stringify(updatedCoaches));
  };

  const syncCoachAttendance = (updatedAttendance) => {
    setCoachAttendance(updatedAttendance);
    localStorage.setItem("coachAttendance", JSON.stringify(updatedAttendance));
  };

  const syncPlayerAttendanceRecords = (updatedRecords) => {
    setPlayerAttendanceRecords(updatedRecords);
    localStorage.setItem(
      "playerAttendanceRecords",
      JSON.stringify(updatedRecords)
    );
  };

  const syncFeePayments = (updatedPayments) => {
    setFeePayments(updatedPayments);
    localStorage.setItem("feePayments", JSON.stringify(updatedPayments));
  };

  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;

    return players.filter((player) => {
      return (
        player.fullName?.toLowerCase().includes(q) ||
        player.playerId?.toLowerCase().includes(q) ||
        player.playerRole?.toLowerCase().includes(q) ||
        player.ageCategory?.toLowerCase().includes(q) ||
        player.parentName?.toLowerCase().includes(q)
      );
    });
  }, [players, search]);

  const filteredParents = useMemo(() => {
    const q = parentSearch.trim().toLowerCase();
    if (!q) return parents;

    return parents.filter((parent) => {
      return (
        parent.fullName?.toLowerCase().includes(q) ||
        parent.email?.toLowerCase().includes(q) ||
        parent.phone?.toLowerCase().includes(q) ||
        parent.childName?.toLowerCase().includes(q) ||
        parent.childPlayerId?.toLowerCase().includes(q)
      );
    });
  }, [parents, parentSearch]);

  const coachSummary = useMemo(() => {
    return coachList.map((coach) => ({
      ...coach,
      count: players.filter((player) =>
        player.assignedCoaches?.includes(coach.email)
      ).length,
    }));
  }, [players, coachList]);

  const totalFeesCollected = useMemo(() => {
    return feePayments
      .filter((item) => item.paymentStatus === "Paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [feePayments]);

  const totalPendingFees = useMemo(() => {
    return feePayments
      .filter((item) => item.paymentStatus === "Pending")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [feePayments]);

  const stats = [
    {
      title: "Total Players",
      value: players.length,
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      icon: "🏏",
    },
    {
      title: "Total Parents",
      value: parents.length,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      icon: "👨‍👩‍👦",
    },
    {
      title: "Total Coaches",
      value: coachList.length,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      icon: "🧑‍🏫",
    },
    {
      title: "Paid Fees",
      value: `₹${totalFeesCollected}`,
      color: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
      icon: "🏆",
    },
    {
      title: "Pending Fees",
      value: `₹${totalPendingFees}`,
      color: "from-rose-500 to-red-600",
      bg: "bg-rose-50",
      icon: "💰",
    },
  ];

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "players", label: "Player Management", icon: "🏏" },
    { key: "parents", label: "Parent Management", icon: "👨‍👩‍👦" },
    { key: "coaches", label: "Coach Management", icon: "🧑‍🏫" },
    { key: "playerAttendance", label: "Player Attendance", icon: "📅" },
    { key: "coachAttendance", label: "Coach Attendance", icon: "📝" },
    { key: "fees", label: "Fee Payment", icon: "💳" },
    { key: "tournaments", label: "Tournaments", icon: "🏆" },
  ];

  const renderPlayerPhoto = (player, size = "w-16 h-16") => {
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

  const renderParentPhoto = (parent, size = "w-16 h-16") => {
    if (parent?.profilePhoto) {
      return (
        <img
          src={parent.profilePhoto}
          alt={parent.fullName || "Parent"}
          className={`${size} rounded-2xl object-cover border border-gray-200 shadow-sm`}
        />
      );
    }

    return (
      <div
        className={`${size} rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold border border-violet-200 shadow-sm`}
      >
        {parent?.fullName?.charAt(0)?.toUpperCase() || "P"}
      </div>
    );
  };

  const openAssignPanel = (player) => {
    setSelectedPlayer(player);
    setSelectedCoaches(player.assignedCoaches || []);
  };

  const closeAssignPanel = () => {
    setSelectedPlayer(null);
    setSelectedCoaches([]);
  };

  const toggleCoach = (coachEmail) => {
    setSelectedCoaches((prev) =>
      prev.includes(coachEmail)
        ? prev.filter((email) => email !== coachEmail)
        : [...prev, coachEmail]
    );
  };

  const saveCoachAssignment = () => {
    if (!selectedPlayer) return;

    const assignedCoachDetails = coachList.filter((coach) =>
      selectedCoaches.includes(coach.email)
    );

    const updatedPlayers = players.map((player) =>
      player.playerId === selectedPlayer.playerId
        ? {
            ...player,
            assignedCoaches: selectedCoaches,
            assignedCoachDetails,
          }
        : player
    );

    syncPlayers(updatedPlayers);
    closeAssignPanel();
  };

  const deletePlayer = (playerId) => {
    const ok = window.confirm("Delete this player?");
    if (!ok) return;

    const updatedPlayers = players.filter(
      (player) => player.playerId !== playerId
    );
    syncPlayers(updatedPlayers);

    const updatedFees = feePayments.filter((item) => item.playerId !== playerId);
    syncFeePayments(updatedFees);

    const updatedAttendance = playerAttendanceRecords.filter(
      (item) => item.playerId !== playerId
    );
    syncPlayerAttendanceRecords(updatedAttendance);

    if (selectedPlayer?.playerId === playerId) closeAssignPanel();

    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(updatedPlayers[0]?.playerId || "");
    }
  };

  const addPlayer = () => {
    setPlayerError("");

    const fullName = newPlayer.fullName.trim();
    const playerId = newPlayer.playerId.trim().toUpperCase();
    const playerRole = newPlayer.playerRole.trim();
    const ageCategory = newPlayer.ageCategory.trim();
    const parentName = newPlayer.parentName.trim();
    const parentEmail = newPlayer.parentEmail.trim().toLowerCase();
    const parentPhone = newPlayer.parentPhone.trim();
    const monthlyFee = Number(newPlayer.monthlyFee || 0);

    if (!fullName || !playerId || !playerRole || !ageCategory || !parentName) {
      setPlayerError("Required player fields fill చేయాలి.");
      return;
    }

    const exists = players.some(
      (player) => player.playerId.toLowerCase() === playerId.toLowerCase()
    );

    if (exists) {
      setPlayerError("Player ID already exists.");
      return;
    }

    const playerData = {
      fullName,
      playerId,
      playerRole,
      ageCategory,
      parentName,
      parentEmail,
      parentPhone,
      profilePhoto: "",
      assignedCoaches: [],
      assignedCoachDetails: [],
      fee: {
        monthlyFee,
        month: "",
        amount: 0,
        paidAmount: 0,
        dueAmount: monthlyFee,
        paid: false,
        status: "Pending",
        lastPaidOn: "",
      },
      attendance: {
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0,
      },
    };

    const updatedPlayers = [...players, playerData];
    syncPlayers(updatedPlayers);

    if (!selectedPlayerId) {
      setSelectedPlayerId(playerId);
    }

    setNewPlayer({
      fullName: "",
      playerId: "",
      playerRole: "",
      ageCategory: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      monthlyFee: "",
    });
    setShowAddPlayer(false);
  };

  const addCoach = () => {
    setCoachError("");

    const name = newCoach.name.trim();
    const email = newCoach.email.trim().toLowerCase();
    const password = newCoach.password.trim();
    const role = newCoach.role.trim();
    const time = newCoach.time.trim();

    if (!name || !email || !password || !role || !time) {
      setCoachError("All coach fields are required.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setCoachError("Enter a valid email.");
      return;
    }

    const exists = coachList.some(
      (coach) => coach.email.toLowerCase() === email
    );
    if (exists) {
      setCoachError("Coach email already exists.");
      return;
    }

    const updatedCoaches = [...coachList, { name, email, password, role, time }];
    syncCoaches(updatedCoaches);

    setNewCoach({
      name: "",
      email: "",
      password: "",
      role: "",
      time: "",
    });
    setShowAddCoach(false);
  };

  const deleteCoach = (coachEmail) => {
    const ok = window.confirm("Delete this coach?");
    if (!ok) return;

    const updatedCoaches = coachList.filter(
      (coach) => coach.email !== coachEmail
    );
    syncCoaches(updatedCoaches);

    const updatedPlayers = players.map((player) => {
      const updatedAssignedCoaches =
        player.assignedCoaches?.filter((email) => email !== coachEmail) || [];

      const updatedAssignedCoachDetails =
        player.assignedCoachDetails?.filter(
          (coach) => coach.email !== coachEmail
        ) || [];

      return {
        ...player,
        assignedCoaches: updatedAssignedCoaches,
        assignedCoachDetails: updatedAssignedCoachDetails,
      };
    });

    syncPlayers(updatedPlayers);

    const updatedCoachAttendance = coachAttendance.filter(
      (item) => item.coachEmail !== coachEmail
    );
    syncCoachAttendance(updatedCoachAttendance);

    if (selectedCoachEmail === coachEmail) {
      setSelectedCoachEmail(updatedCoaches[0]?.email || "");
    }
  };

  const markCoachAttendance = (coachEmail, status) => {
    const existing = coachAttendance.find(
      (item) => item.coachEmail === coachEmail && item.date === today
    );

    let updatedRecords = [];

    if (existing) {
      updatedRecords = coachAttendance.map((item) =>
        item.coachEmail === coachEmail && item.date === today
          ? { ...item, status }
          : item
      );
    } else {
      updatedRecords = [
        ...coachAttendance,
        {
          coachEmail,
          date: today,
          status,
          session: "Morning",
        },
      ];
    }

    syncCoachAttendance(updatedRecords);
  };

  const monthShort = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", { month: "short" }).toUpperCase();

  const monthLong = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

  const getParentChild = (parent) => {
    return players.find(
      (player) =>
        player.playerId === parent.childPlayerId ||
        player.parentEmail === parent.email ||
        player.parentPhone === parent.phone
    );
  };

  const renderDashboardTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
            Recent Activities
          </h3>

          <div className="space-y-4">
            <div className="flex gap-4 items-start bg-green-50 border border-green-100 rounded-2xl p-4">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Player Registrations
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Total registered players: {players.length}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-violet-50 border border-violet-100 rounded-2xl p-4">
              <span className="text-xl">👨‍👩‍👦</span>
              <div>
                <p className="font-semibold text-gray-900">Parent Records</p>
                <p className="text-gray-600 text-sm mt-1">
                  Total registered parents: {parents.length}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <span className="text-xl">🧑‍🏫</span>
              <div>
                <p className="font-semibold text-gray-900">Coach Records</p>
                <p className="text-gray-600 text-sm mt-1">
                  Total active coaches: {coachList.length}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
              <span className="text-xl">💳</span>
              <div>
                <p className="font-semibold text-gray-900">Fee Collection</p>
                <p className="text-gray-600 text-sm mt-1">
                  Collected: ₹{totalFeesCollected} • Pending: ₹{totalPendingFees}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlayersTab = () => {
    return (
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Manage Players
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search by name, ID, role, parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-2xl px-4 py-3 w-full xl:w-[360px] outline-none focus:border-green-600"
            />

            <button
              onClick={() => {
                setPlayerError("");
                setShowAddPlayer(true);
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
            >
              Add Player
            </button>
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-600">
            No players found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlayers.map((player, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {renderPlayerPhoto(player)}

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-lg break-words">
                        {player.fullName}
                      </p>
                      <p className="text-gray-600 mt-1 text-sm md:text-base break-words">
                        ID: {player.playerId} • Role: {player.playerRole} • Category:{" "}
                        {player.ageCategory}
                      </p>
                      <p className="text-gray-600 mt-1 text-sm md:text-base break-words">
                        Fee: {player.fee?.status || "Pending"} • Monthly Fee ₹
                        {player.fee?.monthlyFee || 0}
                      </p>
                      <p className="text-gray-600 mt-1 text-sm md:text-base break-words">
                        Coaches:{" "}
                        {player.assignedCoachDetails?.length
                          ? player.assignedCoachDetails.map((c) => c.name).join(", ")
                          : "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <button
                      onClick={() => openAssignPanel(player)}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium"
                    >
                      Assign Coaches
                    </button>

                    <button
                      onClick={() => deletePlayer(player.playerId)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddPlayer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 md:px-4 z-50">
            <div className="bg-white w-full max-w-3xl rounded-[28px] shadow-2xl p-4 md:p-7 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddPlayer(false)}
                className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                Add New Player
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Player Name"
                  value={newPlayer.fullName}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, fullName: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Player ID"
                  value={newPlayer.playerId}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, playerId: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Role"
                  value={newPlayer.playerRole}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, playerRole: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Age Category"
                  value={newPlayer.ageCategory}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, ageCategory: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Parent Name"
                  value={newPlayer.parentName}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, parentName: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="email"
                  placeholder="Parent Email"
                  value={newPlayer.parentEmail}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, parentEmail: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Parent Phone"
                  value={newPlayer.parentPhone}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, parentPhone: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="number"
                  placeholder="Monthly Fee"
                  value={newPlayer.monthlyFee}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, monthlyFee: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              {playerError && (
                <p className="text-red-500 text-sm mt-4">{playerError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={addPlayer}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
                >
                  Save Player
                </button>

                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 md:px-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl p-4 md:p-7 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeAssignPanel}
                className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Assign Coaches
              </h3>
              <div className="flex items-center gap-3 mb-6">
                {renderPlayerPhoto(selectedPlayer, "w-14 h-14")}
                <p className="text-gray-600">
                  Player: <span className="font-semibold">{selectedPlayer.fullName}</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {coachList.map((coach, index) => {
                  const active = selectedCoaches.includes(coach.email);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleCoach(coach.email)}
                      className={`border rounded-2xl p-4 text-left transition ${
                        active
                          ? "bg-green-700 text-white border-green-700"
                          : "bg-gray-50 hover:border-green-600"
                      }`}
                    >
                      <p className="font-semibold">{coach.name}</p>
                      <p
                        className={`text-sm mt-1 ${
                          active ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        {coach.role}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          active ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        {coach.time}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={saveCoachAssignment}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
                >
                  Save Assignment
                </button>

                <button
                  onClick={closeAssignPanel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderParentsTab = () => {
    return (
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Manage Parents
          </h3>

          <input
            type="text"
            placeholder="Search by name, email, phone, child..."
            value={parentSearch}
            onChange={(e) => setParentSearch(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 w-full xl:w-[360px] outline-none focus:border-green-600"
          />
        </div>

        {filteredParents.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-600">
            No parents found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredParents.map((parent, index) => {
              const linkedChild = getParentChild(parent);

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {renderParentPhoto(parent)}

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-lg break-words">
                          {parent.fullName}
                        </p>
                        <p className="text-gray-600 mt-1 break-words">
                          Email: {parent.email || "-"}
                        </p>
                        <p className="text-gray-600 mt-1 break-words">
                          Phone: {parent.phone || "-"}
                        </p>
                        <p className="text-gray-600 mt-1 break-words">
                          Relation: {parent.relation || "-"}
                        </p>
                        <p className="text-gray-600 mt-1 break-words">
                          Child: {linkedChild?.fullName || parent.childName || "Not linked"}
                        </p>
                        <p className="text-gray-600 mt-1 break-words">
                          Child ID: {linkedChild?.playerId || parent.childPlayerId || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3 self-start">
                      <p className="text-sm text-violet-700 font-semibold">
                        Parent Account
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderCoachesTab = () => {
    return (
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Manage Coaches
          </h3>

          <button
            onClick={() => {
              setCoachError("");
              setShowAddCoach(true);
            }}
            className="bg-green-700 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Add Coach
          </button>
        </div>

        <div className="space-y-4">
          {coachSummary.map((coach, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 break-words">{coach.name}</p>
                  <p className="text-gray-600 mt-1 break-words">{coach.role}</p>
                  <p className="text-gray-600 mt-1 break-words">{coach.email}</p>
                  <p className="text-gray-600 mt-1 break-words">Timing: {coach.time}</p>
                  <p className="text-green-700 font-semibold mt-2">
                    Assigned Players: {coach.count}
                  </p>
                </div>

                <button
                  onClick={() => deleteCoach(coach.email)}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium"
                >
                  Remove Coach
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddCoach && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 md:px-4 z-50">
            <div className="bg-white w-full max-w-xl rounded-[28px] shadow-2xl p-4 md:p-7 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddCoach(false)}
                className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                Add New Coach
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Coach Name"
                  value={newCoach.name}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, name: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="email"
                  placeholder="Coach Email"
                  value={newCoach.email}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, email: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={newCoach.password}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, password: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  type="text"
                  placeholder="Role"
                  value={newCoach.role}
                  onChange={(e) =>
                    setNewCoach({ ...newCoach, role: e.target.value })
                  }
                  className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
                />

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Timing"
                    value={newCoach.time}
                    onChange={(e) =>
                      setNewCoach({ ...newCoach, time: e.target.value })
                    }
                    className="border border-gray-300 rounded-2xl px-4 py-3 w-full outline-none focus:border-green-600"
                  />
                </div>
              </div>

              {coachError && (
                <p className="text-red-500 text-sm mt-4">{coachError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  onClick={addCoach}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
                >
                  Save Coach
                </button>

                <button
                  onClick={() => setShowAddCoach(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPlayerAttendanceTab = () => {
    const todayPlayerPresentCount = playerAttendanceRecords.filter(
      (item) => item.date === today && item.status === "Present"
    ).length;

    const todayPlayerAbsentCount = playerAttendanceRecords.filter(
      (item) => item.date === today && item.status === "Absent"
    ).length;

    const overallPresent = playerAttendanceRecords.filter(
      (item) => item.status === "Present"
    ).length;

    const overallTotal = playerAttendanceRecords.length || 1;
    const overallPercentage = ((overallPresent / overallTotal) * 100).toFixed(2);

    const playerMonthlySummary = players.map((player) => {
      const playerRecords = playerAttendanceRecords.filter(
        (item) => item.playerId === player.playerId
      );

      const grouped = {};

      playerRecords.forEach((item) => {
        const key = monthLong(item.date);

        if (!grouped[key]) {
          grouped[key] = {
            monthKey: key,
            monthLabel: monthShort(item.date),
            presentDays: 0,
            workingDays: 0,
          };
        }

        grouped[key].workingDays += 1;
        if (item.status === "Present") {
          grouped[key].presentDays += 1;
        }
      });

      const monthCards = Object.values(grouped).map((m) => ({
        ...m,
        percentage:
          m.workingDays > 0
            ? ((m.presentDays / m.workingDays) * 100).toFixed(0)
            : 0,
      }));

      return {
        player,
        monthCards,
      };
    });

    const selectedPlayerData =
      playerMonthlySummary.find(
        (item) => item.player.playerId === selectedPlayerId
      ) || playerMonthlySummary[0];

    const selectedPlayerDailyRecords = selectedPlayerData
      ? playerAttendanceRecords
          .filter((item) => item.playerId === selectedPlayerData.player.playerId)
          .map((item, index) => ({
            id: index + 1,
            date: new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            session: item.session || "Morning",
            status: item.status,
            rawDate: item.date,
          }))
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
      : [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Player Attendance
          </h3>
          <p className="text-gray-600 font-medium">Date: {today}</p>
        </div>

        <div className="rounded-[26px] border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                Attendance
              </h4>
              <div className="mt-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-indigo-50 text-3xl md:text-4xl">
                👦
              </div>
            </div>

            <div className="text-left md:text-right">
              <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
                {overallPercentage}%
              </h2>
              <p className="mt-2 text-base md:text-lg text-slate-400">Percentage</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-[24px] p-5">
            <p className="text-gray-500">Today Present Players</p>
            <h4 className="text-3xl font-bold text-green-700 mt-2">
              {todayPlayerPresentCount}
            </h4>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-[24px] p-5">
            <p className="text-gray-500">Today Absent Players</p>
            <h4 className="text-3xl font-bold text-red-700 mt-2">
              {todayPlayerAbsentCount}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[26px] p-4 md:p-5 shadow-sm">
          <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
            View Player Attendance Details
          </h4>

          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 w-full md:w-[320px] outline-none focus:border-green-600"
          >
            {players.length === 0 ? (
              <option value="">No Players</option>
            ) : (
              players.map((player) => (
                <option key={player.playerId} value={player.playerId}>
                  {player.fullName}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedPlayerData && (
          <>
            <div className="rounded-[26px] border border-gray-200 bg-slate-50 p-4 md:p-5">
              <div className="flex items-center gap-4 mb-5">
                {renderPlayerPhoto(selectedPlayerData.player, "w-16 h-16")}
                <h4 className="text-lg md:text-xl font-bold text-slate-900 break-words">
                  {selectedPlayerData.player.fullName} - Monthly Attendance
                </h4>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {selectedPlayerData.monthCards.length === 0 ? (
                  <div className="text-gray-500">No monthly attendance found.</div>
                ) : (
                  selectedPlayerData.monthCards.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-300 rounded-2xl p-4 md:p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-14 w-14 rounded-xl border-2 border-indigo-500 text-indigo-600 flex flex-col items-center justify-center font-bold">
                            <span className="text-xs">📅</span>
                            <span className="text-sm">{item.monthLabel}</span>
                          </div>

                          <div>
                            <p className="text-base md:text-lg text-slate-900">
                              <span className="font-bold">{item.presentDays}</span>{" "}
                              Present Days
                            </p>
                            <p className="text-base md:text-lg text-slate-900">
                              <span className="font-bold">{item.workingDays}</span>{" "}
                              Working Days
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <h3 className="text-3xl md:text-4xl font-bold text-blue-900">
                            {item.percentage}
                            <span className="text-xl md:text-2xl">%</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[26px] p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                {renderPlayerPhoto(selectedPlayerData.player, "w-16 h-16")}
                <h4 className="text-lg md:text-xl font-bold text-slate-900 break-words">
                  {selectedPlayerData.player.fullName} - Everyday Attendance
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Date
                      </th>
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Session
                      </th>
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlayerDailyRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-gray-500 text-center"
                        >
                          No daily attendance records found.
                        </td>
                      </tr>
                    ) : (
                      selectedPlayerDailyRecords.map((record) => (
                        <tr key={record.id} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-slate-800">{record.date}</td>
                          <td className="py-3 px-4 text-slate-800">
                            {record.session}
                          </td>
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
          </>
        )}
      </div>
    );
  };

  const renderCoachAttendanceTab = () => {
    const todayCoachPresentCount = coachAttendance.filter(
      (item) => item.date === today && item.status === "Present"
    ).length;

    const todayCoachAbsentCount = coachAttendance.filter(
      (item) => item.date === today && item.status === "Absent"
    ).length;

    const overallPresent = coachAttendance.filter(
      (item) => item.status === "Present"
    ).length;

    const overallTotal = coachAttendance.length || 1;
    const overallPercentage = ((overallPresent / overallTotal) * 100).toFixed(2);

    const coachMonthlySummary = coachList.map((coach) => {
      const coachRecords = coachAttendance.filter(
        (item) => item.coachEmail === coach.email
      );

      const grouped = {};

      coachRecords.forEach((item) => {
        const key = monthLong(item.date);

        if (!grouped[key]) {
          grouped[key] = {
            monthKey: key,
            monthLabel: monthShort(item.date),
            presentDays: 0,
            workingDays: 0,
          };
        }

        grouped[key].workingDays += 1;
        if (item.status === "Present") {
          grouped[key].presentDays += 1;
        }
      });

      const monthCards = Object.values(grouped).map((m) => ({
        ...m,
        percentage:
          m.workingDays > 0
            ? ((m.presentDays / m.workingDays) * 100).toFixed(0)
            : 0,
      }));

      return {
        coach,
        monthCards,
      };
    });

    const selectedCoachData =
      coachMonthlySummary.find(
        (item) => item.coach.email === selectedCoachEmail
      ) || coachMonthlySummary[0];

    const selectedCoachDailyRecords = selectedCoachData
      ? coachAttendance
          .filter((item) => item.coachEmail === selectedCoachData.coach.email)
          .map((item, index) => ({
            id: index + 1,
            date: new Date(item.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            session: item.session || "Morning",
            status: item.status,
            rawDate: item.date,
          }))
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
      : [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Coach Attendance
          </h3>
          <p className="text-gray-600 font-medium">Date: {today}</p>
        </div>

        <div className="rounded-[26px] border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                Attendance
              </h4>
              <div className="mt-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-indigo-50 text-3xl md:text-4xl">
                👨‍🏫
              </div>
            </div>

            <div className="text-left md:text-right">
              <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
                {overallPercentage}%
              </h2>
              <p className="mt-2 text-base md:text-lg text-slate-400">Percentage</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-[24px] p-5">
            <p className="text-gray-500">Today Present Coaches</p>
            <h4 className="text-3xl font-bold text-green-700 mt-2">
              {todayCoachPresentCount}
            </h4>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-[24px] p-5">
            <p className="text-gray-500">Today Absent Coaches</p>
            <h4 className="text-3xl font-bold text-red-700 mt-2">
              {todayCoachAbsentCount}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[26px] p-4 md:p-5 shadow-sm">
          <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
            Admin Maintain Coach Attendance
          </h4>

          <div className="space-y-4">
            {coachList.map((coach, index) => {
              const todayStatus = coachAttendance.find(
                (item) => item.coachEmail === coach.email && item.date === today
              )?.status;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-lg break-words">
                      {coach.name}
                    </p>
                    <p className="text-gray-600 mt-1 break-words">{coach.role}</p>
                    <p className="text-gray-600 mt-1">
                      Today Status:{" "}
                      <span
                        className={`font-semibold ${
                          todayStatus === "Present"
                            ? "text-green-700"
                            : todayStatus === "Absent"
                            ? "text-red-700"
                            : "text-gray-500"
                        }`}
                      >
                        {todayStatus || "Not Marked"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <button
                      onClick={() => markCoachAttendance(coach.email, "Present")}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-white ${
                        todayStatus === "Present"
                          ? "bg-green-700"
                          : "bg-green-600 hover:bg-green-500"
                      }`}
                    >
                      Present
                    </button>

                    <button
                      onClick={() => markCoachAttendance(coach.email, "Absent")}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-white ${
                        todayStatus === "Absent"
                          ? "bg-red-700"
                          : "bg-red-600 hover:bg-red-500"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[26px] p-4 md:p-5 shadow-sm">
          <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
            View Coach Attendance Details
          </h4>

          <select
            value={selectedCoachEmail}
            onChange={(e) => setSelectedCoachEmail(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 w-full md:w-[320px] outline-none focus:border-green-600"
          >
            {coachList.map((coach) => (
              <option key={coach.email} value={coach.email}>
                {coach.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCoachData && (
          <>
            <div className="rounded-[26px] border border-gray-200 bg-slate-50 p-4 md:p-5">
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-5 break-words">
                {selectedCoachData.coach.name} - Monthly Attendance
              </h4>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {selectedCoachData.monthCards.length === 0 ? (
                  <div className="text-gray-500">No monthly attendance found.</div>
                ) : (
                  selectedCoachData.monthCards.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-300 rounded-2xl p-4 md:p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-14 w-14 rounded-xl border-2 border-indigo-500 text-indigo-600 flex flex-col items-center justify-center font-bold">
                            <span className="text-xs">📅</span>
                            <span className="text-sm">{item.monthLabel}</span>
                          </div>

                          <div>
                            <p className="text-base md:text-lg text-slate-900">
                              <span className="font-bold">{item.presentDays}</span>{" "}
                              Present Days
                            </p>
                            <p className="text-base md:text-lg text-slate-900">
                              <span className="font-bold">{item.workingDays}</span>{" "}
                              Working Days
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <h3 className="text-3xl md:text-4xl font-bold text-blue-900">
                            {item.percentage}
                            <span className="text-xl md:text-2xl">%</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[26px] p-4 md:p-5 shadow-sm">
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4 break-words">
                {selectedCoachData.coach.name} - Everyday Attendance
              </h4>

              <div className="overflow-x-auto">
                <table className="min-w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Date
                      </th>
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Session
                      </th>
                      <th className="py-3 px-4 text-blue-900 text-lg md:text-xl font-bold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCoachDailyRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-gray-500 text-center"
                        >
                          No daily attendance records found.
                        </td>
                      </tr>
                    ) : (
                      selectedCoachDailyRecords.map((record) => (
                        <tr key={record.id} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-slate-800">{record.date}</td>
                          <td className="py-3 px-4 text-slate-800">
                            {record.session}
                          </td>
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
          </>
        )}
      </div>
    );
  };

  const renderFeesTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Fee Payment
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-[24px] p-5">
            <p className="text-gray-500">Fees Collected</p>
            <h4 className="text-3xl font-bold text-green-700 mt-2">
              ₹{totalFeesCollected}
            </h4>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-[24px] p-5">
            <p className="text-gray-500">Pending Fees</p>
            <h4 className="text-3xl font-bold text-red-700 mt-2">
              ₹{totalPendingFees}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[26px] overflow-x-auto shadow-sm">
          <table className="min-w-full min-w-[640px]">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-3">Player Name</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {feePayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-5 text-gray-500 text-center"
                  >
                    No payment records found.
                  </td>
                </tr>
              ) : (
                feePayments.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="px-4 py-3">{item.playerName}</td>
                    <td className="px-4 py-3">{item.month}</td>
                    <td className="px-4 py-3">₹{item.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTournamentsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              Tournament Management
            </h3>
            <p className="text-gray-600 mt-2">
              Create, update and manage tournaments from a dedicated page.
            </p>
          </div>

          <button
            onClick={() => navigate("/tournaments")}
            className="bg-green-700 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold w-full sm:w-auto"
          >
            Open Tournament Page
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm">
            <p className="text-gray-500">Total Tournaments</p>
            <h4 className="text-3xl font-bold text-slate-900 mt-2">
              {tournaments.length}
            </h4>
          </div>

          <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm">
            <p className="text-gray-500">Upcoming</p>
            <h4 className="text-3xl font-bold text-blue-700 mt-2">
              {tournaments.filter((item) => item.status === "Upcoming").length}
            </h4>
          </div>

          <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm">
            <p className="text-gray-500">Open / Active</p>
            <h4 className="text-3xl font-bold text-green-700 mt-2">
              {
                tournaments.filter((item) =>
                  ["Open", "Active"].includes(item.status)
                ).length
              }
            </h4>
          </div>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-[24px] p-5">
            <p className="font-semibold text-slate-900">No tournaments yet</p>
            <p className="text-gray-600 mt-1">
              Click <span className="font-medium">Open Tournament Page</span> to add a tournament.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tournaments.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900 text-lg break-words">
                  {item.tournamentName}
                </p>
                <p className="text-gray-600 mt-1 break-words">
                  Location: {item.location || "-"}
                </p>
                <p className="text-gray-600 mt-1 break-words">
                  Date: {item.startDate || "-"} to {item.endDate || "-"}
                </p>
                <p className="text-gray-600 mt-1 break-words">
                  Category: {item.category || "All"}
                </p>
                <p className="text-gray-600 mt-1 break-words">
                  Status: {item.status || "Upcoming"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "dashboard") return renderDashboardTab();
    if (activeTab === "players") return renderPlayersTab();
    if (activeTab === "parents") return renderParentsTab();
    if (activeTab === "coaches") return renderCoachesTab();
    if (activeTab === "playerAttendance") return renderPlayerAttendanceTab();
    if (activeTab === "coachAttendance") return renderCoachAttendanceTab();
    if (activeTab === "fees") return renderFeesTab();
    if (activeTab === "tournaments") return renderTournamentsTab();
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static top-0 left-0 z-50 h-full w-72 bg-slate-950 text-white flex flex-col shadow-2xl transform transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="px-6 py-7 border-b border-slate-800 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
                Cricket Academy
              </p>
              <h2 className="text-3xl font-bold mt-3">Admin Panel</h2>
              <p className="text-slate-400 text-sm mt-2 leading-6">
                Manage players, parents, coaches, attendance and fee records.
              </p>
            </div>

            <button
              className="lg:hidden text-white text-2xl"
              onClick={() => setMobileSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setMobileSidebarOpen(false);
                }}
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
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Quick Summary
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-slate-400">Players</span>
                  <span className="font-semibold">{players.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Parents</span>
                  <span className="font-semibold">{parents.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Coaches</span>
                  <span className="font-semibold">{coachList.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Paid Fees</span>
                  <span className="font-semibold">₹{totalFeesCollected}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Pending</span>
                  <span className="font-semibold">₹{totalPendingFees}</span>
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6 md:mb-8 rounded-[28px] bg-white border border-gray-200 shadow-sm px-4 md:px-6 py-5 md:py-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden bg-slate-900 text-white px-4 py-3 rounded-2xl font-semibold"
                >
                  ☰
                </button>

                <div>
                  <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-green-700 mb-2">
                    Academy Control Panel
                  </p>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-3 max-w-3xl text-sm md:text-base leading-6 md:leading-7">
                    Manage players, parents, coaches, attendance and academy
                    operations from one premium dashboard.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-2xl font-semibold w-full sm:w-auto"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-4 md:gap-6 mb-8">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[28px] border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                  <div className="p-5 md:p-6">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${item.bg} flex items-center justify-center text-2xl md:text-3xl mb-5`}
                    >
                      {item.icon}
                    </div>
                    <p className="text-gray-500 text-base md:text-lg">{item.title}</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 break-words">
                      {item.value}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-4 md:p-6 lg:p-7 min-h-[520px]">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;