import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("player");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState("");
  const [errors, setErrors] = useState({});
  const [checkingSession, setCheckingSession] = useState(true);

  const playerId = useMemo(
    () => `CA-${Math.floor(1000 + Math.random() * 9000)}`,
    []
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    playerRole: "",
    battingStyle: "",
    bowlingStyle: "",
    profilePhoto: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    childName: "",
    childAge: "",
    childPlayerId: "",
    relation: "",
  });

  const inputClass =
    "w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-600";

  const coaches = {
    batting: {
      name: "Rahul Sharma",
      email: "rahul@academy.com",
      role: "Batting Coach",
      time: "6 AM - 9 AM",
    },
    bowling: {
      name: "Anil Kumar",
      email: "anil@academy.com",
      role: "Bowling Coach",
      time: "7 AM - 10 AM",
    },
    fielding: {
      name: "Suresh Reddy",
      email: "suresh@academy.com",
      role: "Fielding Coach",
      time: "5 PM - 7 PM",
    },
    fitness: {
      name: "Ramesh Patel",
      email: "ramesh@academy.com",
      role: "Fitness Coach",
      time: "6 PM - 8 PM",
    },
    wicket: {
      name: "Kiran Verma",
      email: "kiran@academy.com",
      role: "Wicket Keeping Coach",
      time: "4 PM - 6 PM",
    },
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "coach") return navigate("/coach", { replace: true });
    if (userRole === "player") return navigate("/player", { replace: true });
    if (userRole === "parent") return navigate("/parent", { replace: true });

    setCheckingSession(false);
  }, [navigate]);

  const getAgeCategory = (ageValue) => {
    const age = parseInt(ageValue, 10);

    if (isNaN(age)) return "";
    if (age <= 14) return "U-14";
    if (age >= 15 && age <= 16) return "U-16";
    if (age >= 17 && age <= 19) return "U-19";
    return "Not Included";
  };

  const ageCategory = getAgeCategory(form.age);

  const onlyNumbers = (value, max = 10) =>
    value.replace(/\D/g, "").slice(0, max);

  const gmailOk = (email) => /^[^\s@]+@gmail\.com$/.test(email);
  const phoneOk = (phone) => /^\d{10}$/.test(phone);

  const getAssignedCoachObjects = (playerRole) => {
    if (playerRole === "All Rounder") {
      return [
        coaches.batting,
        coaches.bowling,
        coaches.fielding,
        coaches.fitness,
        coaches.wicket,
      ];
    }
    if (playerRole === "Batsman") {
      return [coaches.batting, coaches.fielding, coaches.fitness];
    }
    if (playerRole === "Bowler") {
      return [coaches.bowling, coaches.fielding, coaches.fitness];
    }
    if (playerRole === "Wicket Keeper") {
      return [coaches.batting, coaches.fielding, coaches.wicket];
    }
    return [];
  };

  const setValue = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const autoFillParentData = (email, phone) => {
    const players = JSON.parse(localStorage.getItem("players")) || [];
    const matchedPlayer = players.find(
      (player) =>
        (email && player.parentEmail === email) ||
        (phone && player.parentPhone === phone)
    );

    if (matchedPlayer) {
      setForm((prev) => ({
        ...prev,
        fullName: matchedPlayer.parentName || prev.fullName,
        email: matchedPlayer.parentEmail || prev.email,
        phone: matchedPlayer.parentPhone || prev.phone,
        childName: matchedPlayer.fullName || prev.childName,
        childAge: matchedPlayer.age || prev.childAge,
        childPlayerId: matchedPlayer.playerId || prev.childPlayerId,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePhoto") {
      const file = files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("profilePhoto", reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (["phone", "parentPhone"].includes(name)) {
      setValue(name, onlyNumbers(value, 10));
      return;
    }

    if (["age", "childAge"].includes(name)) {
      setValue(name, onlyNumbers(value, 2));
      return;
    }

    setValue(name, value);
  };

  const selectRole = (selected) => {
    setForm((prev) => ({
      ...prev,
      playerRole: selected,
      battingStyle: "",
      bowlingStyle: "",
    }));

    setErrors((prev) => ({
      ...prev,
      playerRole: "",
      battingStyle: "",
      bowlingStyle: "",
    }));
  };

  const validateCommon = (err) => {
    if (!form.fullName.trim()) err.fullName = "Full name is required.";
    if (!gmailOk(form.email)) err.email = "Only @gmail.com is allowed.";
    if (!phoneOk(form.phone)) err.phone = "Phone must be 10 digits.";
    if (!form.password.trim()) err.password = "Password is required.";
  };

  const validatePlayer = (err) => {
    const age = parseInt(form.age, 10);

    if (isNaN(age)) {
      err.age = "Age is required.";
    } else if (age < 6) {
      err.age = "Age must be above 6 years.";
    } else if (age > 30) {
      err.age = "Age must not exceed 30 years.";
    }

    if (!form.gender) err.gender = "Select gender.";
    if (!form.playerRole) err.playerRole = "Select cricket role.";

    if (
      ["Batsman", "Wicket Keeper", "All Rounder"].includes(form.playerRole) &&
      !form.battingStyle
    ) {
      err.battingStyle = "Select batting style.";
    }

    if (
      ["Bowler", "All Rounder"].includes(form.playerRole) &&
      !form.bowlingStyle
    ) {
      err.bowlingStyle = "Select bowling style.";
    }

    if (!form.parentName.trim()) err.parentName = "Parent name is required.";
    if (!phoneOk(form.parentPhone)) {
      err.parentPhone = "Parent phone must be 10 digits.";
    }
    if (!gmailOk(form.parentEmail)) {
      err.parentEmail = "Parent email must end with @gmail.com.";
    }
  };

  const validateParent = (err) => {
    const age = parseInt(form.childAge, 10);

    if (!form.childName.trim()) err.childName = "Child name is required.";
    if (isNaN(age)) err.childAge = "Child age is required.";
    else if (age < 6) err.childAge = "Child age must be above 6 years.";
    else if (age > 30) err.childAge = "Child age must not exceed 30 years.";
    if (!form.relation) err.relation = "Select relation.";
  };

  const saveUser = () => {
    if (role === "player") {
      const players = JSON.parse(localStorage.getItem("players")) || [];
      const assignedCoachObjects = getAssignedCoachObjects(form.playerRole);

      const newPlayer = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "player",
        playerId,
        age: parseInt(form.age, 10),
        ageCategory,
        gender: form.gender,
        playerRole: form.playerRole,
        battingStyle: form.battingStyle,
        bowlingStyle: form.bowlingStyle,
        profilePhoto: form.profilePhoto || "",
        parentName: form.parentName,
        parentPhone: form.parentPhone,
        parentEmail: form.parentEmail,
        assignedCoaches: assignedCoachObjects.map((coach) => coach.email),
        assignedCoachDetails: assignedCoachObjects,
        attendance: {
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0,
        },
        fee: {
          monthlyFee: 2500,
          paid: false,
          paidAmount: 0,
          dueAmount: 2500,
          status: "Pending",
          lastPaidOn: "",
        },
      };

      localStorage.setItem("players", JSON.stringify([...players, newPlayer]));
      setPopup(`Player registered successfully. Player ID: ${playerId}`);
    }

    if (role === "parent") {
      const parents = JSON.parse(localStorage.getItem("parents")) || [];

      const newParent = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "parent",
        profilePhoto: form.profilePhoto || "",
        childName: form.childName,
        childAge: form.childAge,
        childPlayerId: form.childPlayerId,
        relation: form.relation,
      };

      localStorage.setItem("parents", JSON.stringify([...parents, newParent]));
      setPopup("Parent registered successfully and child linked.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};

    validateCommon(err);
    role === "player" ? validatePlayer(err) : validateParent(err);

    setErrors(err);
    if (Object.keys(err).length) return;

    saveUser();
  };

  const errorText = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-sm mt-2">{errors[name]}</p>
    ) : null;

  if (checkingSession) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-700 to-emerald-500 text-white p-12">
            <p className="uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Cricket Academy
            </p>
            <h1 className="text-5xl font-bold leading-tight">Create Account</h1>
            <p className="mt-5 text-lg text-white/90 leading-relaxed">
              Register players and parents with smart academy linking, coach
              assignments, attendance setup and fee tracking.
            </p>

            <div className="mt-10 space-y-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="font-semibold">Player Registration</p>
                <p className="text-sm text-white/80 mt-1">
                  Auto player ID, role mapping and coach assignment.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="font-semibold">Parent Linking</p>
                <p className="text-sm text-white/80 mt-1">
                  Connect parent and child details in one system.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="font-semibold">Smart Dashboard Flow</p>
                <p className="text-sm text-white/80 mt-1">
                  Attendance and fees connect automatically after registration.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 overflow-y-auto max-h-[95vh]">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900">Register</h2>
                <p className="text-gray-500 mt-2">
                  Fill the details to create your academy account
                </p>
              </div>

              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">
                  Register As
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setErrors({});
                    setPopup("");
                    setForm((prev) => ({
                      ...prev,
                      profilePhoto: "",
                    }));
                  }}
                  className={inputClass}
                >
                  <option value="player">Player / Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                  {errorText("fullName")}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => {
                      if (role === "parent") {
                        autoFillParentData(form.email, form.phone);
                      }
                    }}
                    placeholder="Enter email"
                    className={inputClass}
                  />
                  {errorText("email")}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => {
                      if (role === "parent") {
                        autoFillParentData(form.email, form.phone);
                      }
                    }}
                    placeholder="Enter 10 digit mobile number"
                    maxLength="10"
                    className={inputClass}
                  />
                  {errorText("phone")}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className={`${inputClass} pr-20`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errorText("password")}
                </div>
              </div>

              {role === "player" && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-green-700 mb-5">
                    Player Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Player ID
                      </label>
                      <input
                        value={playerId}
                        readOnly
                        className={`${inputClass} bg-gray-100`}
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        maxLength="2"
                        className={inputClass}
                      />
                      {errorText("age")}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Age Category
                      </label>
                      <input
                        value={ageCategory || "Auto generated after age input"}
                        readOnly
                        className={`${inputClass} bg-gray-100`}
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                      {errorText("gender")}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className={`${inputClass} bg-white file:mr-4 file:rounded-xl file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-white`}
                      />

                      {form.profilePhoto && (
                        <div className="mt-4 flex items-center gap-4">
                          <img
                            src={form.profilePhoto}
                            alt="Preview"
                            className="w-24 h-24 rounded-2xl object-cover border border-gray-300 shadow-sm"
                          />
                          <p className="text-sm text-gray-600">
                            Player photo preview
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-medium text-gray-700 mb-3">
                        Cricket Role
                      </label>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          "Batsman",
                          "Bowler",
                          "All Rounder",
                          "Wicket Keeper",
                        ].map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => selectRole(item)}
                            className={`border rounded-2xl p-4 text-left transition ${
                              form.playerRole === item
                                ? "bg-green-700 text-white border-green-700"
                                : "bg-white hover:border-green-600"
                            }`}
                          >
                            <p className="font-semibold">{item}</p>
                          </button>
                        ))}
                      </div>
                      {errorText("playerRole")}
                    </div>

                    {["Batsman", "Wicket Keeper", "All Rounder"].includes(
                      form.playerRole
                    ) && (
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Batting Style
                        </label>
                        <select
                          name="battingStyle"
                          value={form.battingStyle}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select batting style</option>
                          <option>Right Hand Bat</option>
                          <option>Left Hand Bat</option>
                        </select>
                        {errorText("battingStyle")}
                      </div>
                    )}

                    {["Bowler", "All Rounder"].includes(form.playerRole) && (
                      <div>
                        <label className="block font-medium text-gray-700 mb-2">
                          Bowling Style
                        </label>
                        <select
                          name="bowlingStyle"
                          value={form.bowlingStyle}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select bowling style</option>
                          <option>Right Arm Fast</option>
                          <option>Right Arm Medium</option>
                          <option>Left Arm Fast</option>
                          <option>Left Arm Spin</option>
                          <option>Off Spin</option>
                          <option>Leg Spin</option>
                        </select>
                        {errorText("bowlingStyle")}
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-green-700 mt-10 mb-5">
                    Parent Linking Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Parent Name
                      </label>
                      <input
                        name="parentName"
                        value={form.parentName}
                        onChange={handleChange}
                        placeholder="Enter parent name"
                        className={inputClass}
                      />
                      {errorText("parentName")}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Parent Phone
                      </label>
                      <input
                        name="parentPhone"
                        value={form.parentPhone}
                        onChange={handleChange}
                        placeholder="Enter 10 digit parent phone"
                        maxLength="10"
                        className={inputClass}
                      />
                      {errorText("parentPhone")}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-medium text-gray-700 mb-2">
                        Parent Email
                      </label>
                      <input
                        name="parentEmail"
                        value={form.parentEmail}
                        onChange={handleChange}
                        placeholder="Enter parent gmail"
                        className={inputClass}
                      />
                      {errorText("parentEmail")}
                    </div>
                  </div>
                </div>
              )}

              {role === "parent" && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-green-700 mb-5">
                    Parent Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5 mb-8">
                    <div className="md:col-span-2">
                      <label className="block font-medium text-gray-700 mb-2">
                        Parent Photo
                      </label>
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleChange}
                        className={`${inputClass} bg-white file:mr-4 file:rounded-xl file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-white`}
                      />

                      {form.profilePhoto && (
                        <div className="mt-4 flex items-center gap-4">
                          <img
                            src={form.profilePhoto}
                            alt="Parent Preview"
                            className="w-24 h-24 rounded-2xl object-cover border border-gray-300 shadow-sm"
                          />
                          <p className="text-sm text-gray-600">
                            Parent photo preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-green-700 mb-5">
                    Child / Player Linking Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Child Name
                      </label>
                      <input
                        name="childName"
                        value={form.childName}
                        onChange={handleChange}
                        placeholder="Enter child name"
                        className={inputClass}
                      />
                      {errorText("childName")}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Child Age
                      </label>
                      <input
                        name="childAge"
                        value={form.childAge}
                        onChange={handleChange}
                        placeholder="Enter child age"
                        maxLength="2"
                        className={inputClass}
                      />
                      {errorText("childAge")}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Child Player ID
                      </label>
                      <input
                        name="childPlayerId"
                        value={form.childPlayerId}
                        onChange={handleChange}
                        placeholder="Enter player ID if available"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">
                        Relation
                      </label>
                      <select
                        name="relation"
                        value={form.relation}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select relation</option>
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Guardian</option>
                      </select>
                      {errorText("relation")}
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full mt-8 bg-green-700 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition">
                Register
              </button>

              <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-700 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
            <button
              type="button"
              onClick={() => {
                setPopup("");
                navigate("/login", { replace: true });
              }}
              className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Registration Successful
            </h2>

            <p className="text-gray-700 leading-relaxed">{popup}</p>

            <button
              type="button"
              onClick={() => {
                setPopup("");
                navigate("/login", { replace: true });
              }}
              className="mt-6 w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;