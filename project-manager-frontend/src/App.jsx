import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import { Login } from "./components/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { Dashboard } from "../pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Tasks";
import { Teams } from "./pages/Teams";

function App() {
  return (
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
  );
}

export default App;