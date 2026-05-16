import express from 'express';
import { getAllTeamsHandler, getTeamByIdHandler, createTeamHandler, updateTeamHandler, deleteTeamHandler, addMemberHandler, removeMemberHandler } from '../controllers/teamController.js';
import { validateCreateTeam, validateUpdateTeam, validateTeamId, validateAddTeamMember, validateDeleteTeamMember } from '../middleware/teamValidators.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Note: authorizeTeamMembership was removed from PUT/DELETE/members routes —
// any MANAGER can now manage any team. Re-introduce it if you need per-team
// scoping later (and remember to backfill membership rows for existing teams).

router.get('/', authenticate, getAllTeamsHandler);
router.get('/:id', validateTeamId, authenticate, getTeamByIdHandler)
router.post('/',
    authenticate,
    authorizeRole("MANAGER"),
    validateCreateTeam, createTeamHandler)
router.put('/:id',
    authenticate,
    validateTeamId,
    authorizeRole('MANAGER'),
    validateUpdateTeam, updateTeamHandler)
router.delete('/:id',
    authenticate,
    validateTeamId,
    authorizeRole('MANAGER'),
    deleteTeamHandler)

// Add a member to a team
router.post('/:id/members',
    authenticate,
    validateTeamId,
    authorizeRole('MANAGER'),
    validateAddTeamMember,
    addMemberHandler,
);

// Remove a member from a team
router.delete('/:id/members/:userId',
    authenticate,
    validateTeamId,
    authorizeRole('MANAGER'),
    validateDeleteTeamMember,
    removeMemberHandler,
);

export default router;