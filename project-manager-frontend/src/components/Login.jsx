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
      if (password && email) {
        const response = await login({ email: email, password: password });
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit"> Login</button>
      </form>
    </div>
  );
}
