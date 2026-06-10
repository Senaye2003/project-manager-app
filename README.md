# Project Manager API
 
A REST API for managing teams, projects, and tasks. Built with Express 5, Prisma, and PostgreSQL.

**Live demo →** https://project-manager-app-lilac.vercel.app
**API →** https://project-manager-app-bmlb.onrender.com

![Project Manager — Projects page](./docs/screenshot.png)

## Try it without signing up

The database is pre-seeded with four users — log in with any of them to skip signup. The `MANAGER` accounts can create and manage projects/teams/tasks; the `DEVELOPER` accounts are read-only on most endpoints.

| Role | Email | Password |
| --- | --- | --- |
| Manager | `alice@test.com` | `alice1234` |
| Manager | `diana@pm.com` | `diana1234` |
| Developer | `bob@example.com` | `bob1234` |
| Developer | `charlie@demo.com` | `charlie1234` |

The free-tier backend on Render sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up — subsequent requests are fast.

## Features

## Features
 
- JWT authentication with bcrypt password hashing
- Two user roles: managers and developers
- Teams with members, projects tied to teams, tasks assigned to users
- Task and project statuses (to do, in progress, under review, complete, cancelled)
- Request validation with express-validator
- API docs with Swagger UI
- Request logging with morgan

## Tech stack

**Frontend** — React 19, Vite, React Router 7, Axios, hand-rolled CSS design system (Inter typeface, custom properties for color/spacing/radius)

**Backend** — Node.js, Express 5, Prisma ORM, express-validator, bcrypt, jsonwebtoken

**Database** — PostgreSQL (managed via Neon)

**Hosting** — Vercel (frontend), Render (backend), Neon (database)

**Tooling** — ESLint, Prettier, Redocly CLI for the OpenAPI spec, supertest

## Data model
 
- **User** — email, hashed password, role (MANAGER or DEVELOPER)
- **Team** — has members and projects
- **Project** — belongs to a team, has a project manager and tasks
- **Task** — belongs to a project, can be assigned to a user, has a status and due date
- **TeamMember** — join table between users and teams
## Run it locally
 
You need Node 20+ and Postgres.
 
```bash
git clone https://github.com/Senaye2003/project-manager-api.git
cd project-manager-api
npm install
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run dev
```
 
The API runs at http://localhost:3000. Swagger docs are served from the running server.
 
## Author
 
Senaye Weldeberhan — [@Senaye2003](https://github.com/Senaye2003)



