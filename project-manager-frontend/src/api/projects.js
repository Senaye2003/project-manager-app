import { api } from "./client";

export const getAllProjects = async () => {
  const res = await api.get("/api/projects");
  return res.data;
};

export const getProject = async (id) => {
  const res = await api.get(`/api/projects/${id}`);
  return res.data;
};

export const createProject = async (payload) => {
  const res = await api.post("/api/projects", payload);
  return res.data;
};

export const updateProject = async (id, payload) => {
  const res = await api.patch(`/api/projects/${id}`, payload);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/api/projects/${id}`);
  return res.data;
};