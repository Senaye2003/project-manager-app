import { findTeambyId, isAMember } from "../services/teamService.js";

export async function authorizeTeamMembership(req, res, next) {
  try {
    const teamId = parseInt(req.params.teamId || req.params.id);
    const userId = req.user?.id;

    if (!teamId) {
        const err = new Error('Team Id is required');
        err.status = 400;
        throw err;
    }
    if (!userId) {
        const err = new Error('User Authentication is Required');
        err.status = 401;
        throw err;
    }
    const team = await findTeambyId(teamId);
    await isAMember(teamId, userId);

    req.team = team
    next()
  } catch (err){
    next(err)
  }
}
