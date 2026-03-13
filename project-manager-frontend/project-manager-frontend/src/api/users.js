import { api } from "./client";

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateMe = async (payload) => {
  const res = await api.patch("/users/me", payload);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUserRole = async (id, payload) => {
  const res = await api.patch(`/users/${id}/role`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
