import "./App.css";
import { Route, Routes, Navigate, Link, Outlet, useNavigate } from "react-router-dom";

import { Login } from "./components/Login";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { Dashboard } from "./pages/dashboard";
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
        <h3>Project Manager</h3>

        <div className="navbar__links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/teams">Teams</Link>
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
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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