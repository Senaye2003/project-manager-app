import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findAll,
  findById,
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserInfo
} from '../repositories/userRepo.js';

export async function signup(name, email, password, role = 'DEVELOPER') {
  if (!name || !email || !password) throw new Error('All fields are required.');

  const existing = await findByEmail(email);
  if (existing) throw new Error('Email already registered.');

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await createUser({
    name,
    email,
    password: hashed,
    role,
  });

  return newUser;
}

export async function login(email, password) {
  const user = await findByEmail(email);
  if (!user) throw new Error('Invalid credentials.');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials.');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
}

export function getAllUsers() {
  return findAll();
}

export function getUserById(id) {
  return findById(id);
}

export async function updateUserRole(id, role) {
  const user = await findById(id);
  if (!user) {
    const error = new Error('Cannot find user');
    error.status = 404;
    throw error;
  }

  return updateUser(id, { role });
}

export async function removeUser(id) {
  const user = await findById(id);
  if (!user) {
    const error = new Error('Cannot find user');
    error.status = 404;
    throw error;
  }

  return deleteUser(id);
}

export async function updateCurrentUserInfo(userId, data) {
  const updates = {};

  // EMAIL UPDATE — must be unique except for yourself
  if (data.email) {
    const existing = await findByEmail(data.email);

    if (existing && existing.id !== userId) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    updates.email = data.email;
  }

  // PASSWORD UPDATE
  if (data.password) {
    updates.password = await bcrypt.hash(data.password, 10);
  }

  // NAME UPDATE (optional but allowed)
  if (data.name) {
    updates.name = data.name;
  }

  if (Object.keys(updates).length === 0) {
    const err = new Error("No valid fields to update");
    err.status = 400;
    throw err;
  }

  return updateUser(userId, updates);
}
