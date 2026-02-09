import prisma from '../config/db.js';

export async function getAll(filter) {
  const conditions = {};

  if (filter.search) {
    conditions.OR = [
      { name: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
    ];
  }

  const projects = await prisma.project.findMany({
    where: conditions,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      teamId: true,
      projectManagerId: true,
    },
    orderBy: { [filter.sortBy]: filter.sortOrder },
    take: filter.limit,
    skip: filter.offset,
  });

  return projects;
}

export async function getById(id) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      startDate: true,
      endDate: true,
      teamId: true,
      projectManagerId: true,
    },
  });
  return project;
}

export async function create(project) {
  const newProject = await prisma.project.create({
    data: project,
  });
  return newProject;
}

export async function findByNameAndTeam(name, teamId) {
  return await prisma.project.findFirst({
    where: { name, teamId },
    select: { id: true, name: true, teamId: true },
  });
}

export async function update(id, updates) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updates,
    });
    return updatedProject;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedProject = await prisma.project.delete({
      where: { id },
    });
    return deletedProject;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
