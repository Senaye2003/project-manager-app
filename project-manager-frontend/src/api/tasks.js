import { api } from "./client";

export const getAllTasks = async () => {
  const res = await api.get("/api/tasks");
  return res.data;
};

export const getMyTasks = async () => {
  const res = await api.get("/api/tasks/me");
  return res.data;
};

export const createTask = async (payload) => {
  const res = await api.post("/api/tasks", payload);
  return res.data;
};

export const updateTask = async (id, payload) => {
  const res = await api.patch(`/api/tasks/${id}`, payload);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
};