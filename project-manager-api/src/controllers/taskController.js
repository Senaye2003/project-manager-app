import {
    getAllTasks,
    getMyTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../services/taskService.js';

export async function getAllTasksHandler(req, res) {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
}

export async function getMyTasksHandler(req,res) {
    const myTasks = await getMyTasks(req.user.id);
    res.status(200).json(myTasks);
}

export async function createTaskHandler(req, res) {
    //3 required fields
    const task = {
        title: req.body.title,
        status: req.body.status,
        projectId: req.body.projectId,
    };
    //2 optional fields
    if (req.body.assignedTo){
        task.assignedTo = req.body.assignedTo;
    }
    if (req.body.dueDate){
        //convert dueDate to ISOstring so Prisma doesn't get mad (wants a full ISO8601)
        const date = new Date(req.body.dueDate);
        task.dueDate = date.toISOString();
    }
    let newTask = await createTask(task);
    res.status(201).json(newTask);
}

export async function updateTaskHandler(req, res) {
    const id = parseInt(req.params.id);
    const updates = {};
    if (req.body.status){
        updates.status = req.body.status;
    }
    if (req.body.dueDate){
        //convert dueDate to ISOstring so Prisma doesn't get mad (wants a full ISO8601)
        const date = new Date(req.body.dueDate);
        updates.dueDate = date.toISOString();
    }
    if (req.body.assignedTo){
        updates.assignedTo = parseInt(req.body.assignedTo);
    }

    const updatedTask = await updateTask(id, updates);
    res.status(200).json(updatedTask);
}

export async function deleteTaskHandler(req, res) {
    let id = parseInt(req.params.id);
    await deleteTask(id);
    res.status(204).send();
}