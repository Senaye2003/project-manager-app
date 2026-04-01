import "../styles/login.css";
import { login } from "../api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email address"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}