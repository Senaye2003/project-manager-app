import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Login } from "./components/Login";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { Dashboard } from "./pages/dashboard";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Tasks";
import { Teams } from "./pages/Teams";

function App() {
  return (
    <div className="app">
      <div className="navbar">
        <h3>Project Manager</h3>

        <div className="navbar__links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/teams">Teams</Link>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/teams" element={<Teams />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
