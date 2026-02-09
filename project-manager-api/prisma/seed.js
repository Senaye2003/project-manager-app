import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

try {
    await prisma.teamMember.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();

  const teamA = await prisma.team.create({
    data: { name: "Alpha", createdAt: new Date() },
  });
  const teamB = await prisma.team.create({
    data: { name: "Beta", createdAt: new Date() },
  });

  const usersData = [
    {
      email: "alice@test.com",
      password: await bcrypt.hash("alice1234", 10),
      name: "Alice Test",
      role: "MANAGER",
    },
    {
      email: "bob@example.com",
      password: await bcrypt.hash("bob1234", 10),
      name: "Bob Example",
      role: "DEVELOPER",
    },
    {
      email: "charlie@demo.com",
      password: await bcrypt.hash("charlie1234", 10),
      name: "Charlie Demo",
      role: "DEVELOPER",
    },
    {
      email: "diana@pm.com",
      password: await bcrypt.hash("diana1234", 10),
      name: "Diana PM",
      role: "MANAGER",
    },
  ];

  const users = await Promise.all(
    usersData.map((u) => prisma.user.create({ data: u })),
  );

  const managers = users.filter((u) => u.role === "MANAGER");
  const devs = users.filter((u) => u.role === "DEVELOPER");
  
  if (managers.length === 0) throw new Error("Seed requires at least one MANAGER");

  await prisma.teamMember.createMany({
    data: [
      { teamId: teamA.id, userId: managers[0].id },
      { teamId: teamA.id, userId: devs[0].id },
      { teamId: teamA.id, userId: devs[1].id },
      { teamId: teamB.id, userId: managers[1]?.id ?? managers[0].id },
      { teamId: teamB.id, userId: devs[0].id },
    ],
    skipDuplicates: true,
  });

  const proj1 = await prisma.project.create({
    data: {
      name: "Alpha Onboarding Portal",
      description: "Build the team onboarding portal and workflow.",
      status: "IN_PROGRESS", // ProjectStatus enum
      startDate: new Date(),
      teamId: teamA.id,
      projectManagerId: managers[0].id,
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      name: "Beta Analytics",
      description: "Revamp reporting pipelines and dashboards.",
      status: "TO_DO",
      startDate: new Date(),
      teamId: teamB.id,
      projectManagerId: (managers[1]?.id ?? managers[0].id),
    },
  })

  await prisma.task.createMany({
    data: [
      {
        title: "Scaffold project structure",
        status: "IN_PROGRESS",
        projectId: proj1.id,
        assignedTo: devs[0]?.id ?? null,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Auth flow ",
        status: "TO_DO",
        projectId: proj1.id,
        assignedTo: devs[1]?.id ?? null,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Job audit",
        status: "TO_DO",
        projectId: proj2.id,
        assignedTo: devs[0]?.id ?? null,
      },
      {
        title: "Dashboard Design",
        status: "UNDER_REVIEW",
        projectId: proj2.id,
        assignedTo: null,
      },
    ],
  });

  console.log('Seed completed successfully!');
} catch (error) {
  console.error('Seed failed:', error);
} finally {
  await prisma.$disconnect();
}
