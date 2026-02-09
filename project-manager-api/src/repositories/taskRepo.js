import prisma from '../config/db.js';

//currently returns assignedTo (id of user the task, should also return the name)
export async function getAll() {
    const tasks = await prisma.task.findMany({
        select: {
            id: true,
            projectId: true,
            title: true,
            status: true,
            assignedTo: true,
            dueDate: true,

            createdAt: true,
            updatedAt: true,
            //only return the name and id fields of the asignee
            assignee: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    })

    return tasks;
}

export async function getMy(id) {
    const userId = parseInt(id);
    const tasks = await prisma.task.findMany({
        where: { assignedTo: userId },
        select: {
            id: true,
            projectId: true,
            title: true,
            status: true,
            assignedTo: true,
            dueDate: true,

            createdAt: true,
            updatedAt: true,
            //only return the name and id fields of the asignee
            assignee: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    })

    return tasks;
}

export async function create(task) {
    const newTask = await prisma.task.create({
        data: task,
    });
    return newTask;
}

export async function update(id, updates) {
    try {
        const updatedTask = await prisma.task.update({
            where: { id },
            data: updates,
        });
        return updatedTask;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}

export async function remove(id) {
    try {
        const deletedTask = await prisma.task.delete({
            where: { id },
        });
        return deletedTask
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}