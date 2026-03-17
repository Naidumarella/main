import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tournament() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    tournamentName: "",
    location: "",
    startDate: "",
    endDate: "",
    category: "",
    status: "Upcoming",
    entryFee: "",
    cashPrize: "",
    description: "",
  });

  const loadTournaments = () => {
    const storedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];
    setTournaments(storedTournaments);
  };

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");
    const adminData = JSON.parse(localStorage.getItem("adminData"));

    if (!isAdminLoggedIn || userRole !== "admin" || adminData?.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    loadTournaments();
  }, [navigate]);

  const syncTournaments = (updatedTournaments) => {
    setTournaments(updatedTournaments);
    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
  };

  const resetForm = () => {
    setFormData({
      tournamentName: "",
      location: "",
      startDate: "",
      endDate: "",
      category: "",
      status: "Upcoming",
      entryFee: "",
      cashPrize: "",
      description: "",
    });
    setEditingId(null);
    setError("");
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "entryFee" || name === "cashPrize") {
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTournament = () => {
    setError("");

    const tournamentName = formData.tournamentName.trim();
    const location = formData.location.trim();
    const startDate = formData.startDate;
    const endDate = formData.endDate;
    const category = formData.category.trim();
    const status = formData.status.trim() || "Upcoming";
    const entryFee = Number(formData.entryFee || 0);
    const cashPrize = Number(formData.cashPrize || 0);
    const description = formData.description.trim();

    if (!tournamentName || !location || !startDate || !endDate || !category) {
      setError("Please fill all required fields.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date should not be before start date.");
      return;
    }

    if (editingId) {
      const updatedTournaments = tournaments.map((item) =>
        item.id === editingId
          ? {
              ...item,
              tournamentName,
              location,
              startDate,
              endDate,
              category,
              status,
              entryFee,
              cashPrize,
              description,
            }
          : item
      );

      syncTournaments(updatedTournaments);
    } else {
      const newTournament = {
        id: Date.now(),
        tournamentName,
        location,
        startDate,
        endDate,
        category,
        status,
        entryFee,
        cashPrize,
        description,
      };

      const updatedTournaments = [...tournaments, newTournament];
      syncTournaments(updatedTournaments);
    }

    closeForm();
  };

  const editTournament = (tournament) => {
    setEditingId(tournament.id);
    setFormData({
      tournamentName: tournament.tournamentName || "",
      location: tournament.location || "",
      startDate: tournament.startDate || "",
      endDate: tournament.endDate || "",
      category: tournament.category || "",
      status: tournament.status || "Upcoming",
      entryFee: tournament.entryFee?.toString() || "",
      cashPrize: tournament.cashPrize?.toString() || "",
      description: tournament.description || "",
    });
    setError("");
    setShowForm(true);
  };

  const deleteTournament = (id) => {
    const ok = window.confirm("Delete this tournament?");
    if (!ok) return;

    const updatedTournaments = tournaments.filter((item) => item.id !== id);
    syncTournaments(updatedTournaments);
  };

  const filteredTournaments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tournaments;

    return tournaments.filter((item) => {
      return (
        item.tournamentName?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
      );
    });
  }, [tournaments, search]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 bg-slate-950 text-white flex-col shadow-2xl">
          <div className="px-6 py-7 border-b border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
              Cricket Academy
            </p>
            <h2 className="text-3xl font-bold mt-3">Tournament Panel</h2>
            <p className="text-slate-400 text-sm mt-2 leading-6">
              Add, edit and manage academy tournaments.
            </p>
          </div>

          <div className="flex-1 px-4 py-5">
            <div className="rounded-2xl bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Tournament Summary
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="font-semibold">{tournaments.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Upcoming</span>
                  <span className="font-semibold">
                    {
                      tournaments.filter((item) => item.status === "Upcoming")
                        .length
                    }
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Open</span>
                  <span className="font-semibold">
                    {tournaments.filter((item) => item.status === "Open").length}
                  </span>
                </p>
              </div>
            </div>
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
                Tournament Menu
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={openAddForm}
                  className="bg-green-700 text-white rounded-2xl px-4 py-3 text-sm font-semibold"
                >
                  Add Tournament
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white rounded-2xl px-4 py-3 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-8 rounded-[28px] bg-white border border-gray-200 shadow-sm px-4 md:px-6 py-5 md:py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700 mb-2">
                Tournament Management
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
                Tournament Dashboard
              </h1>
              <p className="text-gray-600 mt-3 max-w-3xl text-base leading-7">
                Create and manage tournaments for players and coaches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
                <p className="text-gray-500">Total Tournaments</p>
                <h3 className="text-2xl font-bold mt-2">{tournaments.length}</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">
                <p className="text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold mt-2">
                  {tournaments.filter((item) => item.status === "Upcoming").length}
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-gray-500">Open / Active</p>
                <h3 className="text-2xl font-bold mt-2">
                  {tournaments.filter((item) =>
                    ["Open", "Active"].includes(item.status)
                  ).length}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-4 md:p-6 lg:p-7 min-h-[520px]">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  Manage Tournaments
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name, location, category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-2xl px-4 py-3 w-full xl:w-[340px] outline-none focus:border-green-600"
                  />

                  <button
                    onClick={openAddForm}
                    className="bg-green-700 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold"
                  >
                    Add Tournament
                  </button>
                </div>
              </div>

              {filteredTournaments.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-600">
                  No tournaments found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTournaments.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm"
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-lg break-words">
                            {item.tournamentName}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Location: {item.location}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Date: {item.startDate} to {item.endDate}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Category: {item.category}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Entry Fee: ₹{item.entryFee || 0}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Cash Prize: ₹{item.cashPrize || 0}
                          </p>
                          <p className="text-gray-600 mt-1 break-words">
                            Status: {item.status}
                          </p>
                          <p className="text-gray-700 mt-2 break-words">
                            {item.description || "No description available."}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                          <button
                            onClick={() => editTournament(item)}
                            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteTournament(item.id)}
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
            </div>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-3 md:px-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-[28px] shadow-2xl p-4 md:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeForm}
              className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {editingId ? "Edit Tournament" : "Add New Tournament"}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="tournamentName"
                placeholder="Tournament Name"
                value={formData.tournamentName}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="text"
                name="category"
                placeholder="Category (Ex: U-14 / U-16 / U-19 / Bowler / All)"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Open">Open</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="text"
                inputMode="numeric"
                name="entryFee"
                placeholder="Entry Fee"
                value={formData.entryFee}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <input
                type="text"
                inputMode="numeric"
                name="cashPrize"
                placeholder="Cash Prize"
                value={formData.cashPrize}
                onChange={handleChange}
                className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-green-600"
              />

              <div className="md:col-span-2">
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="border border-gray-300 rounded-2xl px-4 py-3 w-full outline-none focus:border-green-600 resize-none"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                onClick={saveTournament}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
              >
                {editingId ? "Update Tournament" : "Save Tournament"}
              </button>

              <button
                onClick={closeForm}
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
}

export default Tournament;