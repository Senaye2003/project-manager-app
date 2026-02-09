import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../repositories/projectRepo.js';

export async function getAllProjects(filter) {
  return await getAll(filter);
}

export async function getProjectById(id) {
  let result = await getById(id);
  if (result) return result;
  else {
    const error = new Error(`Cannot find project with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function createProject(data) {
  return await create(data);
}

export async function updateProject(id, data) {
  const updatedProject = await update(id, data);
  if (updatedProject) return updatedProject;
  else {
    const error = new Error(`Cannot find project with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function deleteProject(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Cannot find project with id ${id}`);
    error.status = 404;
    throw error;
  }
}
