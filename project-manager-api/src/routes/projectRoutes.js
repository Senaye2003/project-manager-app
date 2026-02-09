import express from 'express';
import {
  validateProjectId,
  validateProjectQuery,
  validateCreateProject,
  validateUpdateProject,
} from '../middleware/projectValidators.js';

import {
  getAllProjectsHandler,
  getProjectByIdHandler,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const router = express.Router();

router.get('/projects', authenticate, validateProjectQuery, getAllProjectsHandler);

router.get('/projects/:id', authenticate, validateProjectId, getProjectByIdHandler);

router.post('/projects', authenticate, authorizeRole('MANAGER'), validateCreateProject, createProjectHandler);

router.put('/projects/:id', authenticate, authorizeRole('MANAGER'), validateProjectId, validateUpdateProject, updateProjectHandler);

router.delete('/projects/:id', authenticate, authorizeRole('MANAGER'), validateProjectId, deleteProjectHandler);

export default router;
