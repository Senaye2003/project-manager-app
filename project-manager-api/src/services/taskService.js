import {
    getAll,
    getMy,
    create,
    update,
    remove,
} from '../repositories/taskRepo.js';

export async function getAllTasks() {
    return await getAll();
}

export async function getMyTasks(id) {
    return await getMy(id);
}

export async function createTask(task) {
    return await create(task);
}

export async function updateTask(id, updates) {
    const updatedTask = await update(id, updates);
    if (updatedTask) return updatedTask;
    else {
        const error = new Error(`Cannot find task with id ${id}`);
        error.status = 404;
        throw error;
    }
}

export async function deleteTask(id) {
    const result = await remove(id);
    if (result) return;
    else {
        const error = new Error(`Cannot find task with id ${id}`);
        error.status = 404;
        throw error;
    }

}