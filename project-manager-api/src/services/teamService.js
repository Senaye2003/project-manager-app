import { getTeams, getTeambyId, create, update, remove, isMember, createMember, deleteMember } from "../repositories/teamRepo.js";

export async function findTeam(){
    return await getTeams();
}

export async function findTeambyId(id){
    const team = await getTeambyId(id);
    if (team) return team;
    else {
        const error = new Error(`Cannot find team with id ${id}`)
        error.status = 404
        throw error;
    }
}

export async function createTeam(data){
    return await create(data);
}

export async function updateTeam(id, updates){
    const updatedPost = await update(id, updates);
    if (updatedPost) return updatedPost;
    else {
        const err = new Error(`Cannot find team with id ${id}`);
        err.status = 404;
        throw err;
    }
}

export async function deleteTeam(id){
    try{
        const deleted = await remove(id);
        if (deleted) return deleted
        const err = new Error(`Cannot find team with id ${id}`)
        err.status = 404;
        throw err;
    } catch (error){
        if (error.code === 'P2003') {
      const err = new Error(
        `Cannot delete team ${id}: there are projects still associated with this team`
      );
      err.status = 409;
      throw err;
    }
    }
    
}

export async function isAMember(teamId, userId) {
    const teamMember = await isMember(teamId, userId)
    if(teamMember) return teamMember
    else{
        const error = new Error(`User ${userId} is not a member of Team ${teamId}`)
        error.status = 403;
        throw error;
    }
}

export async function addMember(teamId, userId) {
    const already = await isMember(teamId, userId);
    if (already) {
        const err = new Error(`User ${userId} is already a member of Team ${teamId}`);
        err.status = 409;
        throw err;
    }

    return await createMember(teamId, userId);
}

export async function removeMember(teamId, userId) {
    const exists = await isMember(teamId, userId);
    if (!exists) {
        const err = new Error(`User ${userId} is not a member of Team ${teamId}`);
        err.status = 404;
        throw err;
    }

    const deleted = await deleteMember(teamId, userId);
    if (deleted) return deleted;
    else {
        const err = new Error(`Cannot remove membership for user ${userId} in team ${teamId}`);
        err.status = 404;
        throw err;
    }
}