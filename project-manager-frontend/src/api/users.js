import { api } from "./client";

export const getMe = async () => {
  const res = await api.get("/api/users/me");
  return res.data;
};

export const updateMe = async (payload) => {
  const res = await api.patch("/api/users/me", payload);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};

export const updateUserRole = async (id, payload) => {
  const res = await api.patch(`/api/users/${id}/role`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};