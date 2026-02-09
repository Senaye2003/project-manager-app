import express from 'express';
import {
  signupUser,
  loginUser,
  getUsers,
  getMe,
  updateRole,
  deleteUser,
  updateCurrentUserInfoHandler
} from '../controllers/userController.js';

import { authorizeRole } from '../middleware/authorizeRole.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Public routes
router.post('/auth/signup', signupUser);
router.post('/auth/login', loginUser);

// Protected routes (manager-only)
router.get('/users', authenticate, authorizeRole('MANAGER'), getUsers);
router.patch('/users/:id/role', authenticate, authorizeRole('MANAGER'), updateRole);
router.delete('/users/:id', authenticate, authorizeRole('MANAGER'), deleteUser);

// Protected (any logged-in user)
router.get('/users/me', authenticate, getMe);
router.patch('/users/me', authenticate, updateCurrentUserInfoHandler);

export default router;