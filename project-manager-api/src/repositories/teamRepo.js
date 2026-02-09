import prisma from '../config/db.js';

export async function getTeams(){
    return await prisma.team.findMany({
        select: {
            id: true,
            name: true,
            projects: {
                select: {
                    id: true,
                    name: true, 
                }
            },
            members: {
                select: { 
                    user: {
                        select: {
                            id: true, 
                            name: true,
                        }
                    }
                }
            },
            createdAt: true
        }
    })
}

export async function getTeambyId(id){
    return await prisma.team.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            projects: {
                select: {
                    id: true,
                }
            },
            members: {
                select: { 
                    user: {
                        select: {
                            id: true, 
                            name: true,
                        }
                    }
                }
            },
            createdAt: true
        }
    })
}

export async function create(data){
    return await prisma.team.create({
        data: data, 
    })
}

export async function update(id, updates){
    try{
        return await prisma.team.update({
            where: { id },
            data: updates,
        })
    } catch (error) {
        if (error.code ==='P2025') return null;
        throw error;
    }
}

export async function remove(id){
    try {
        const deletedTeam = await prisma.team.delete({
            where: { id }
        })
        return deletedTeam;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}

export async function isMember(teamId, userId) {
    const member = await prisma.teamMember.findUnique({
        where: {
            teamId_userId: {
                teamId: teamId,
                userId: userId
            }, 
        },
    });
    return !!member;
}

export async function createMember(teamId, userId) {
    const tId = typeof teamId === 'string' ? parseInt(teamId) : teamId;
    const uId = typeof userId === 'string' ? parseInt(userId) : userId;
    return await prisma.teamMember.create({ data: { teamId: tId, userId: uId } });
}

export async function deleteMember(teamId, userId) {
    const tId = typeof teamId === 'string' ? parseInt(teamId) : teamId;
    const uId = typeof userId === 'string' ? parseInt(userId) : userId;
    try {
        const deleted = await prisma.teamMember.delete({
            where: { teamId_userId: { teamId: tId, userId: uId } },
        });
        return deleted;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}

export async function teamExist(name) {
    const idx = await prisma.team.findFirst({
        where: { name }
    });
    return !!idx;
}

export async function teamIdExist(id) {
    const teamId = typeof id === 'string' ? parseInt(id) : id;
    if (Number.isNaN(teamId)) return false;

    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { id: true },
    });
    return !!team;
}