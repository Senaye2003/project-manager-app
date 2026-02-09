import { body, oneOf, param } from "express-validator";
import { handleValidationErrors } from "./handleValidationErrors.js";
import { teamExist } from "../repositories/teamRepo.js";
import { userIdExist } from "../repositories/userRepo.js";

export const validateTeamId = [
    param('id')
        .isInt({ min: 1}).withMessage('Team Id must be a positive integer'),
    
    handleValidationErrors,
]
export const validateCreateTeam = [
    body('name')
    .exists({ checkFalsy: true }).withMessage('name is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3}).withMessage('Name must be at least 3 characters long'),
/*
    .custom(async(value)=>{
        if (!value) return true;
        const exist = await teamExist(value)
        if (exist){
            throw new Error('Duplicate team name exists')
        }
        return true;
    }),

    body('projects')
    .optional()
    .isArray().withMessage('Project must be an array of project IDs'),
    body('projects.*')
    .optional()
    .isInt({ min: 1 }).withMessage("Each project ID must be a positive integer"),

    body('members')
    .optional()
    .isArray().withMessage('Members must be an array of user IDs'),
    body('members.*')
    .optional()
    .isInt({ min: 1 }).withMessage("Each member ID must be a positive integer"),
*/
handleValidationErrors,
]

export const validateDeleteTeamMember = [
    param('userId')
        .isInt({ min: 1 }).withMessage('userId must be a positive integer')
        .bail()
        .custom(async (value) => {
            if (value && !(await userIdExist(value))) {
                throw new Error(`userId: ${value} does not correspond to an existing user`);
            }
            return true;
        }),
    handleValidationErrors,
]

export const validateUpdateTeam = [
    /*
    oneOf(
        [
            body('name').exists(),
            body('project').exists(),
            body('members').exists()
        ],
        {
            message: 'At least one field (name, project, members) is required'
        },
    ),
    */
    body('name')
    //.optional()
    .exists({ checkFalsy: true }).withMessage('Name is the only updateable field')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3}).withMessage('Name must be at elast 3 characters long')
 /*    
    .custom(async(value)=>{
        if (!value) return true;
        const exist = await teamExist(value)
        if (exist){
            throw new Error('Duplicate team name exists')
        }
        return true;
    }),
   
    body('project')
    .optional()
    .isArray().withMessage('Projects must be an array of project IDs'),
    body("projects.*")
    .optional()
    .isInt({ min: 1 }).withMessage("Each project ID must be a positive integer"),

    body('members')
    .optional()
    .isArray().withMessage('Members must be an array of user IDs'),
    body("members.*")
    .optional()
    .isInt({ min: 1 }).withMessage("Each member ID must be a positive integer"),
    */,
handleValidationErrors,
]

export const validateAddTeamMember = [
    body('userId')
        .exists({ checkFalsy: true }).withMessage('userId is required')
        .trim()
        .escape()
        .isInt({ min: 1 }).withMessage('userId must be a positive integer')
        .bail()
        .custom(async (value) => {
            if (value && !(await userIdExist(value))) {
                throw new Error(`userId: ${value} does not correspond to an existing user`);
            }
            return true;
        }),
    handleValidationErrors,
]