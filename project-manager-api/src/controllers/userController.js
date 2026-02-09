import {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUserRole,
  removeUser,
  updateCurrentUserInfo,
} from '../services/userService.js';

export async function signupUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const user = await signup(name, email, password, role);

    res.status(201).json({
      message: `User created with id ${user.id}`,
    });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);

    res.json({ accessToken: token });
  } catch (err) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Cannot find user' });
    }

    res.json(user);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message });
  }
}

export async function updateRole(req, res) {
  try {
    const updated = await updateUserRole(req.params.id, req.body.role);
    res.json(updated);
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message });
  }
}

export async function updateCurrentUserInfoHandler(req, res, next) {
  try {
    const userId = req.user.id;  
    const data = req.body;

    const updatedUser = await updateCurrentUserInfo(userId, data);

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res) {
  try {
    await removeUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ error: err.message });
  }
}