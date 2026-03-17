import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Coaches from "./pages/public/Coaches";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Tournament from "./pages/admin/Tournament";
import CoachDashboard from "./pages/coach/CoachDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";
import PlayerDashboard from "./pages/player/PlayerDashboard";
import PlayerRegister from "./pages/player/PlayerRegister";

function Layout() {
  const location = useLocation();

  const dashboardRoutes = [
    "/admin",
    "/tournaments",
    "/coach",
    "/parent",
    "/player",
    "/player-register",
  ];

  const isDashboard = dashboardRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tournaments" element={<Tournament />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/player" element={<PlayerDashboard />} />
          <Route path="/player-register" element={<PlayerRegister />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;