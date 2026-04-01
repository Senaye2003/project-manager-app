import { api } from "./client";

export const getAllTeams = async () => {
  const res = await api.get("/api/teams");
  return res.data;
};

export const getTeam = async (id) => {
  const res = await api.get(`/api/teams/${id}`);
  return res.data;
};

export const createTeam = async (payload) => {
  const res = await api.post("/api/teams", payload);
  return res.data;
};

export const updateTeam = async (id, payload) => {
  const res = await api.put(`/api/teams/${id}`, payload);
  return res.data;
};

export const deleteTeam = async (id) => {
  const res = await api.delete(`/api/teams/${id}`);
  return res.data;
};

export const addTeamMember = async (teamId, payload) => {
  const res = await api.post(`/api/teams/${teamId}/members`, payload);
  return res.data;
};

export const removeTeamMember = async (teamId, userId) => {
  const res = await api.delete(`/api/teams/${teamId}/members/${userId}`);
  return res.data;
};