import { findTeam, findTeambyId, createTeam, updateTeam, deleteTeam, addMember, removeMember } from "../services/teamService.js";
import { teamExist } from "../repositories/teamRepo.js";

export async function getAllTeamsHandler(req, res){
    const teams = await findTeam();
    res.status(200).json(teams);
}

export async function getTeamByIdHandler(req, res){
    const teamId = parseInt(req.params.id);
    const team = await findTeambyId(teamId);
    res.status(200).json(team)

}

export async function createTeamHandler(req, res, next){
    try{
        const data = {
            name: req.body.name,
            /*
            members: req.body.members,
            projects: req.body.projects */
        };
        const exists = await teamExist(data.name)
        if (exists){
            const err = new Error("Duplicate team name exists")
            err.status = 409;
            return next(err);
        }
        let newTeam = await createTeam(data);
        res.status(201).json(newTeam);
    } catch(error){
        next(error);
    }
}

export async function addMemberHandler(req, res) {
    const teamId = parseInt(req.params.id, 10);
    const userId = req.body.userId ? parseInt(req.body.userId, 10) : null;
    const membership = await addMember(teamId, userId);
    res.status(201).json(membership);
}

export async function removeMemberHandler(req, res) {
    const teamId = parseInt(req.params.id, 10);
    const userId = parseInt(req.params.userId, 10);
    await removeMember(teamId, userId);
    res.status(204).send();
}

export async function updateTeamHandler(req, res, next){
    try{
        const id = parseInt(req.params.id, 10)
        const updates = {}
        if (req.body.name) updates.name = req.body.name;
        /*
        if (req.body.members) updates.members = req.body.members;
        if (req.body.projects) updates.projects = req.body.projects;
        */
       if (updates.name){
        const exist = await teamExist(updates.name);
        if (exist){
            const err = new Error("Duplicate team name exists")
            err.status = 409;
            return next(err);
       } 
    }
    const updatedTeam = await updateTeam(id, updates)
    res.status(200).json(updatedTeam);
    } catch (error){
        next(error)
    }
}

export async function deleteTeamHandler(req, res) {
    const id = parseInt(req.params.id)
    await deleteTeam(id)
    res.status(204).send();
}