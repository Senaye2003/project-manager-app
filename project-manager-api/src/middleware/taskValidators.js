import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';
//import prisma for db hit to make sure user exists in validateCreateUser
import prisma from '../config/db.js';


const statusENUMS = ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETE', 'CANCELLED'];
export const validateCreateTask = [
    //require, min length 3, string
    body('title')
        .exists({ checkFalsy: true })
        .withMessage('title is required')
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('title must be a string')
        .bail()
        .isLength({ min: 3 })
        .withMessage('title must be at least 3 characters'),

    //required, must be oneof the ENUMS
    body('status')
        .exists({ values: 'falsy' })
        .withMessage('status is required')
        .bail()
        .isIn(statusENUMS)
        .withMessage('status must be one of: TO_DO, IN_PROGRESS, UNDER_REVIEW, COMPLETE, CANCELLED'),

    //required and positive integer
    body('projectId')
        .exists({ checkFalsy: true })
        .withMessage('projectId is required')
        .bail()
        .isInt({ min: 0 })
        .withMessage('projectId must be a positive integer')
        .toInt()
        .bail()
        .custom(async (value) => {
            const project = await prisma.project.findUnique({
                where: { id: value },
            });
            if (!project) {
                throw new Error(`projectId: ${value} does not correspond to a valid projectId`);
            }
        }),

    //check that assignedTo is a user that actually exists
    body('assignedTo')
        .optional()
        .isInt({ min: 0 })
        .withMessage('assignedTo must be a positive integer')
        .toInt()
        .bail()
        //check that user exists in db
        .custom(async (value) => {
            let user = await prisma.user.findUnique({
                where: { id: value }
            })

            if (!user){
                throw new Error('assignedTo: User with this id does not exist');
            }
            return;
        }),
    //check that dueDate is proper ISO8601 format YYYY-MM-DD
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('dueDate must be in the format YYYY-MM-DD'),

    handleValidationErrors,
];

export const validateTaskId = [
    param('id')
        .isInt({ min: 0 })
        .withMessage('Post id must be a positive integer'),
    handleValidationErrors,
];

export const validateUpdateTask = [
    //status must be oneof the ENUMS
    body('status')
        .optional()
        .isIn(statusENUMS)
        .withMessage('status must be one of: TO_DO, IN_PROGRESS, UNDER_REVIEW, COMPLETE, CANCELLED'),
    //check that assignedTo is a user that actually exists
    body('assignedTo')
        .optional()
        .isInt({ min: 0 })
        .withMessage('assignedTo must be a positive integer')
        .toInt()
        .bail()
        //check that user exists in db
        .custom(async (value) => {
            let user = await prisma.user.findUnique({
                where: { id: value }
            })

            if (!user){
                throw new Error('assignedTo: User with this id does not exist');
            }
            return;
        }),
    //check that dueDate is proper ISO8601 format YYYY-MM-DD
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('dueDate must be in the format YYYY-MM-DD'),
    
    handleValidationErrors,
]