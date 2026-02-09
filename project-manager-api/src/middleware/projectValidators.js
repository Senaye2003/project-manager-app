import { param, query, body, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';
import { teamIdExist } from '../repositories/teamRepo.js';
import { userIdExist, findById as getUserById } from '../repositories/userRepo.js';
import { findByNameAndTeam, getById as getProjectById } from '../repositories/projectRepo.js';

export const validateProjectId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project id must be a positive integer'),
  handleValidationErrors,
];

const allowedSortFields = ['id', 'name', 'startDate', 'endDate'];
const allowedSortOrders = ['asc', 'desc'];
export const validateProjectQuery = [
  query('search').optional().isString().withMessage('search must be a string'),

  query('sortBy')
    .optional()
    .isIn(allowedSortFields)
    .withMessage(`sortBy must be one of: ${allowedSortFields.join(', ')}`),

  query('sortOrder')
    .optional()
    .isIn(allowedSortOrders)
    .withMessage(`sortOrder must be one of: ${allowedSortOrders.join(', ')}`),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be 0 or a positive integer'),

  handleValidationErrors,
];

export const validateCreateProject = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('name is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters')
    .custom(async (value, { req }) => {
    const teamId = req.body.teamId ? Number(req.body.teamId) : undefined;
    if (!teamId) return true; // teamId validation will catch missing team
    const existing = await findByNameAndTeam(value, teamId);
    if (existing) {
      throw new Error(`A project with name '${value}' already exists for team ${teamId}`);
    }
    return true;
  }),

  body('description')
    .exists({ checkFalsy: true })
    .withMessage('description is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('description must be at least 10 characters'),

    // Default to a valid ProjectStatus enum value if status is omitted
    body('status')
    .optional()
    .customSanitizer((value) => (value === undefined || value === null || value === '' ? 'TO_DO' : value))
    .trim()
    .escape()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .isIn(['TO_DO','IN_PROGRESS','UNDER_REVIEW','COMPLETE','CANCELLED'])
    .withMessage('status must be one of the allowed ProjectStatus values'),

    body('teamId')
    .exists({ checkFalsy: true })
    .withMessage('project must be assigned to a team')
    .bail()
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('teamId must be an integer')
    .custom(async (value) => {
      if (value && !(await teamIdExist(value))) {
        throw new Error(`teamId: ${value} does not correspond to an existing team`);
      }
      return true;
      }),

    body('projectManagerId')
    .exists({ checkFalsy: true })
    .withMessage('project must be assigned a manager')
    .bail()
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('projectManagerId must be an integer')
    .custom(async (value) => {
      if (value && !(await userIdExist(value))) {
        throw new Error(`projectManagerId: ${value} does not correspond to an existing user`);
      }
      // ensure the referenced user is a MANAGER
      const user = await getUserById(value);
      if (!user || user.role !== 'MANAGER') {
        throw new Error(`projectManagerId: ${value} must reference a user with role MANAGER`);
      }
      return true;
      }),
    
    body('startDate')
    .optional()
    .trim()
    .escape()
    .isISO8601()
    .withMessage('startDate must be in the format YYYY-MM-DD')
    .bail(),

  handleValidationErrors,
];

export const validateUpdateProject = [
    oneOf(
    [
      body('name').exists({ checkFalsy: true }),
      body('description').exists({ checkFalsy: true }),
      body('status').exists({ checkFalsy: true }),
      body('startDate').exists({ checkFalsy: true }),
      body('endDate').exists({ checkFalsy: true }),
      body('teamId').exists({ checkFalsy: true }),
      body('projectManagerId').exists({ checkFalsy: true }),
    ],
    {
      message:
        'At least one field (name, description, status, startDate, endDate, teamId, projectManagerId) must be provided',
    },
  ),

  body('name')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters'),

  body('description')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('description must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('description must be at least 10 characters'),

    body('status')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('status must be a string')
    .bail()
    .isIn(['TO_DO','IN_PROGRESS','UNDER_REVIEW','COMPLETE','CANCELLED'])
    .withMessage('status must be one of the allowed ProjectStatus values'),

    body('startDate')
    .optional()
    .trim()
    .escape()
    .isISO8601()
    .withMessage('startDate must be in the format YYYY-MM-DD')
    .bail(),

    body('endDate')
    .optional()
    .trim()
    .escape()
    .isISO8601()
    .withMessage('endDate must be in the format YYYY-MM-DD')
    .bail(),

    body('teamId')
    .optional()
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('teamId must be an integer')
    .custom(async (value) => {
      if (value && !(await teamIdExist(value))) {
        throw new Error(`teamId: ${value} does not correspond to an existing team`);
      }
      return true;
      }),

    body('projectManagerId')
    .optional()
    .trim()
    .escape()
    .toInt()
    .isInt()
    .withMessage('projectManagerId must be an integer')
    .custom(async (value) => {
      if (value && !(await userIdExist(value))) {
        throw new Error(`projectManagerId: ${value} does not correspond to an existing user`);
      }
      const user = await getUserById(value);
      if (!user || user.role !== 'MANAGER') {
        throw new Error(`projectManagerId: ${value} must reference a user with role MANAGER`);
      }
      return true;
      }),

    // Ensure updated name/team combination remains unique
    body().custom(async (_value, { req }) => {
      // Only run if name or teamId present in the update
      if (!req.body.name && !req.body.teamId) return true;

      const projectId = parseInt(req.params.id);
      const existing = await getProjectById(projectId);
      if (!existing) return true; // getProjectById service will error later if missing

      const newName = req.body.name ?? existing.name;
      const newTeamId = req.body.teamId ? Number(req.body.teamId) : existing.teamId;

      const conflict = await findByNameAndTeam(newName, newTeamId);
      if (conflict && conflict.id !== projectId) {
        throw new Error(`A project with name '${newName}' already exists for team ${newTeamId}`);
      }
      return true;
    }),

  handleValidationErrors,
];
