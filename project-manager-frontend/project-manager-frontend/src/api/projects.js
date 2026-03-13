import { api } from "./client";

export const getAllProjects = async() => {
    const res = await api.get('/projects')
    return res.data
} 

export const getProject = async(id) => {
    const res = await api.get(`/projects/${id}`)
    return res.data
}

export const createProject = async(payload) => {
    const res = await api.post('/projects', payload)
    return res.data
}

export const updateProject = async(id, payload) => {
    const res = await api.patch(`/projects/${id}`, payload)
    return res.data
}

export const deleteProject = async(id) => {
    const res = await api.delete(`/projects/${id}`)
    return res.data
}