import { useState } from "react";

function PlayerRegister() {
  const [player, setPlayer] = useState({
    fullName: "",
    playerId: "",
    playerRole: "",
    ageCategory: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    monthlyFee: "",
  });

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = player.fullName.trim();
    const playerId = player.playerId.trim().toUpperCase();
    const playerRole = player.playerRole.trim();
    const ageCategory = player.ageCategory.trim();
    const parentName = player.parentName.trim();
    const parentEmail = player.parentEmail.trim().toLowerCase();
    const parentPhone = player.parentPhone.trim();
    const monthlyFee = Number(player.monthlyFee || 0);

    if (!fullName || !playerId || !playerRole || !ageCategory || !parentName) {
      alert("Required fields fill చేయాలి");
      return;
    }

    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];

    const exists = storedPlayers.some(
      (item) => item.playerId?.toLowerCase() === playerId.toLowerCase()
    );

    if (exists) {
      alert("Player ID already exists");
      return;
    }

    const newPlayer = {
      fullName,
      playerId,
      playerRole,
      ageCategory,
      parentName,
      parentEmail,
      parentPhone,
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

    const updatedPlayers = [...storedPlayers, newPlayer];
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    alert("Player registered successfully");

    setPlayer({
      fullName: "",
      playerId: "",
      playerRole: "",
      ageCategory: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      monthlyFee: "",
    });
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">Player Registration</h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 max-w-4xl"
      >
        <input
          name="fullName"
          value={player.fullName}
          placeholder="Player Name"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <input
          name="playerId"
          value={player.playerId}
          placeholder="Player ID"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <select
          name="playerRole"
          value={player.playerRole}
          className="border p-3 rounded-xl"
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All Rounder">All Rounder</option>
          <option value="Wicket Keeper">Wicket Keeper</option>
        </select>

        <input
          name="ageCategory"
          value={player.ageCategory}
          placeholder="Age Category"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <input
          name="parentName"
          value={player.parentName}
          placeholder="Parent Name"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <input
          name="parentEmail"
          value={player.parentEmail}
          placeholder="Parent Email"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <input
          name="parentPhone"
          value={player.parentPhone}
          placeholder="Parent Phone"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <input
          name="monthlyFee"
          value={player.monthlyFee}
          placeholder="Monthly Fee"
          className="border p-3 rounded-xl"
          onChange={handleChange}
        />

        <button className="col-span-2 bg-green-700 text-white p-3 rounded-xl font-semibold">
          Register Player
        </button>
      </form>
    </div>
  );
}

export default PlayerRegister;