import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Tasks";
import { Teams } from "./pages/Teams";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="10" y="10" width="44" height="50" rx="6" fill="#334155"/>
            <rect x="22" y="4" width="20" height="10" rx="2" fill="#475569"/>
            <rect x="16" y="22" width="8" height="8" rx="1.5" fill="#22c55e"/>
            <rect x="28" y="24" width="20" height="4" rx="1" fill="#94a3b8"/>
            <rect x="16" y="34" width="8" height="8" rx="1.5" fill="#22c55e"/>
            <rect x="28" y="36" width="16" height="4" rx="1" fill="#94a3b8"/>
            <rect x="16" y="46" width="8" height="8" rx="1.5" fill="none" stroke="#64748b" stroke-width="1.6"/>
            <rect x="28" y="48" width="18" height="4" rx="1" fill="#64748b"/>
          </svg>
          Project Manager
        </h3>

        <div className="navbar__links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/teams">Teams</NavLink>
        </div>

        <button className="btn btn--danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/teams" element={<Teams />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;