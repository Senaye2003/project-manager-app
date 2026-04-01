import { api } from "./client";

export const signup = async (payload) => {
  const res = await api.post("/api/auth/signup", payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};