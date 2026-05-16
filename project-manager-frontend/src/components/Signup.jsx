import "../styles/login.css";
import { signup } from "../api/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DEVELOPER");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      localStorage.setItem("token", response.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Project Manager</h1>
        <p className="login-subtitle">Create your account</p>

        <form className="login-form" onSubmit={handleSignup}>
          <input
            className="login-input"
            type="text"
            placeholder="Full name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="login-input"
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="login-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="DEVELOPER">Developer</option>
            <option value="MANAGER">Manager</option>
          </select>

          <button className="btn login-btn" type="submit">
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}