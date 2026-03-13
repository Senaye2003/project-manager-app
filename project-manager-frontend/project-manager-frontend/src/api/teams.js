import { api } from "./client";

export const getAllTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

export const getTeam = async (id) => {
  const res = await api.get(`/teams/${id}`);
  return res.data;
};

export const createTeam = async (payload) => {
  const res = await api.post("/teams", payload);
  return res.data;
};

export const updateTeam = async (id, payload) => {
  const res = await api.put(`/teams/${id}`, payload);
  return res.data;
};

export const deleteTeam = async (id) => {
  const res = await api.delete(`/teams/${id}`);
  return res.data;
};

export const addTeamMember = async (teamId, payload) => {
  const res = await api.post(`/teams/${teamId}/members`, payload);
  return res.data;
};

export const removeTeamMember = async (teamId, userId) => {
  const res = await api.delete(`/teams/${teamId}/members/${userId}`);
  return res.data;
};