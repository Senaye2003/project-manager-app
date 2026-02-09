import prisma from '../config/db.js';

export function findAll() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, updatedAt: true },
  });
}

export function findById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true
    }
  });
}

export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data) {
  return prisma.user.create({ data });
}

export function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true
    }
  });
}

export async function updateUserInfo(id, data) {
  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true },
    });
    return updated;
  } catch (err) {
    if (err.code === 'P2002') {
      const error = new Error('Email has already been used');
      error.status = 409;
      throw error;
    }
    if (err.code === 'P2025') {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    throw err;
  }
}

export function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
    select: { id: true }
  });
}

export async function userExist(name) {
    const idx = await prisma.user.findFirst({
        where: { name }
    });
    return !!idx;
}

export async function userIdExist(id) {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    if (Number.isNaN(userId)) return false;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    return !!user;
}