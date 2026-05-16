# Project Manager

A full-stack project management app for teams to plan projects, assign tasks, and manage membership. Built end-to-end with production-style architecture: layered backend, JWT auth with role-based authorization, OpenAPI-documented REST API, Postgres on a managed host, and a custom design-system frontend.

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

- Email/password authentication with hashed credentials (bcrypt) and JWT-based sessions
- Role-based access control: `MANAGER` (full CRUD) and `DEVELOPER` (read-mostly)
- CRUD for teams, projects, and tasks with the relationships you'd expect (a project belongs to a team and a project manager; a task belongs to a project and an optional assignee)
- Server-side validation with structured error responses
- Atomic operations where it matters — e.g. team deletion clears membership rows in a Prisma transaction before dropping the team, so foreign-key constraints don't half-succeed
- OpenAPI 3 spec with Swagger UI mounted at `/api-docs`
- Responsive UI with a token-based design system, status badges, empty states, and active-route navigation

## Tech stack

**Frontend** — React 19, Vite, React Router 7, Axios, hand-rolled CSS design system (Inter typeface, custom properties for color/spacing/radius)

**Backend** — Node.js, Express 5, Prisma ORM, express-validator, bcrypt, jsonwebtoken

**Database** — PostgreSQL (managed via Neon)

**Hosting** — Vercel (frontend), Render (backend), Neon (database)

**Tooling** — ESLint, Prettier, Redocly CLI for the OpenAPI spec, supertest

## Architecture

```
project-manager-app/
├── project-manager-api/                Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma               data model + relations
│   │   ├── migrations/                 generated migrations
│   │   └── seed.js                     demo data for first deploy
│   ├── documents/                      modular OpenAPI 3 spec
│   ├── public/bundled.yaml             built spec served at /api-docs
│   └── src/
│       ├── routes/                     HTTP routing per resource
│       ├── controllers/                request/response shaping
│       ├── middleware/                 authenticate, authorizeRole, validators
│       ├── services/                   business logic and error mapping
│       ├── repositories/               Prisma data access
│       ├── config/db.js                PrismaClient singleton
│       └── server.js                   app entry point, CORS, error handler
└── project-manager-frontend/           React + Vite frontend
    └── src/
        ├── api/                        axios clients per resource
        ├── components/                 Login, Signup
        ├── layouts/                    ProtectedRoute
        ├── pages/                      Dashboard, Projects, Tasks, Teams
        ├── styles/                     page-specific CSS
        ├── App.css                     component styles + design tokens
        └── index.css                   CSS custom properties (colors, spacing)
```

The backend follows a strict **route → controller → service → repository** layering. Each concern has exactly one home: routing in `routes/`, HTTP shaping in `controllers/`, validation in `middleware/`, business rules in `services/`, Prisma queries in `repositories/`. Controllers stay small. Business logic can be reused across multiple endpoints. Data access can be swapped without rewriting the world.

## Engineering notes

A few decisions worth calling out:

**Validation lives in middleware, not in controllers.** Using express-validator declaratively means the same rules apply across handlers and a single `handleValidationErrors` middleware produces consistent `400` shapes. Controllers see only validated input.

**Team membership is enforced in the data layer with foreign keys, not in app code.** The `team_members` table is a join with `ON DELETE RESTRICT` on `team_id`. Naively deleting a team would fail with a Postgres error. The repository wraps team deletion in a `prisma.$transaction` that clears memberships first and then drops the team — atomic, idempotent on partial failures.

**CORS is environment-driven.** The API reads `FRONTEND_URL` as a comma-separated list at boot and rejects everything else. Local development falls back to `http://localhost:5173`. Production allows only the deployed Vercel origin. Requests with no origin (curl, server-to-server, health checks) are always permitted.

**Secrets stay out of source.** `.env` is gitignored; both apps have `.env.example` files documenting required variables. JWT secrets are generated per environment with `crypto.randomBytes(48).toString('hex')` and injected by the host.

**The signup endpoint auto-issues a JWT.** The client doesn't need to make two calls (signup + login) to onboard a user — the response includes an `accessToken` so the form can redirect straight to the dashboard.

**The frontend design system uses CSS custom properties, not a CSS-in-JS library or Tailwind.** Colors, spacing, radii, and shadows are declared once in `index.css` as design tokens. Every component reads from them. Changing the theme is a one-place edit.

**Auto-managed Prisma client.** A `postinstall` hook regenerates the client on every fresh install, so Render builds never deploy a stale schema. Migrations apply via `prisma migrate deploy` in the build command.

## Highlighted code paths

If you're skimming the source, the most worthwhile places to look are:

- [`src/middleware/authenticate.js`](./project-manager-api/src/middleware/authenticate.js) — JWT verification middleware
- [`src/middleware/authorizeRole.js`](./project-manager-api/src/middleware/authorizeRole.js) — variadic role guard
- [`src/middleware/projectValidators.js`](./project-manager-api/src/middleware/projectValidators.js) — declarative validation with custom rules (e.g. enforcing that a referenced `projectManagerId` actually exists and has the `MANAGER` role)
- [`src/repositories/teamRepo.js`](./project-manager-api/src/repositories/teamRepo.js) — the transactional `remove` that handles the FK constraint
- [`src/controllers/teamController.js`](./project-manager-api/src/controllers/teamController.js) — `createTeamHandler` auto-adds the creator as a member so the same user can immediately update or delete the team they just made
- [`prisma/schema.prisma`](./project-manager-api/prisma/schema.prisma) — data model and relations

## Getting started locally

### Prerequisites

- Node.js **20.6+** (for native `--env-file` support in the dev script)
- PostgreSQL running locally, or a free Neon dev branch
- npm

### 1. Clone and install

```bash
git clone https://github.com/Senaye2003/project-manager-app.git
cd project-manager-app
(cd project-manager-api && npm install)
(cd project-manager-frontend && npm install)
```

### 2. Configure environment

```bash
cp project-manager-api/.env.example project-manager-api/.env
cp project-manager-frontend/.env.example project-manager-frontend/.env
```

Fill in `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `FRONTEND_URL` in the API `.env`. Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Apply migrations and (optionally) seed

```bash
cd project-manager-api
npx prisma migrate dev
node prisma/seed.js   # optional: populate with demo data
```

### 4. Run both servers

```bash
# terminal 1
cd project-manager-api && npm run dev

# terminal 2
cd project-manager-frontend && npm run dev
```

Frontend at `http://localhost:5173`, API at `http://localhost:8080`, Swagger UI at `http://localhost:8080/api-docs`.

## API reference

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Create an account; returns `accessToken` | none |
| POST | `/api/auth/login` | Exchange credentials for a JWT | none |
| GET | `/api/users/me` | Current user profile | any user |
| PATCH | `/api/users/me` | Update name/email/password | any user |
| GET | `/api/users` | List all users | manager |
| PATCH | `/api/users/:id/role` | Promote/demote a user | manager |
| GET | `/api/teams` | List teams with members and project counts | any user |
| POST | `/api/teams` | Create a team (creator becomes a member) | manager |
| PUT | `/api/teams/:id` | Update a team | manager |
| DELETE | `/api/teams/:id` | Delete a team (clears memberships in a transaction) | manager |
| POST | `/api/teams/:id/members` | Add a member | manager |
| DELETE | `/api/teams/:id/members/:userId` | Remove a member | manager |
| GET | `/api/projects` | List projects with optional `search`, `sortBy`, `limit`, `offset` | any user |
| POST | `/api/projects` | Create a project | manager |
| PATCH | `/api/projects/:id` | Update a project | manager |
| DELETE | `/api/projects/:id` | Delete a project (cascades to tasks) | manager |
| GET | `/api/tasks` | List all tasks | any user |
| GET | `/api/tasks/me` | Tasks assigned to the current user | any user |
| POST | `/api/tasks` | Create a task | manager |
| PATCH | `/api/tasks/:id` | Update a task | manager |
| DELETE | `/api/tasks/:id` | Delete a task | manager |

Full request/response schemas live in the OpenAPI spec at [`project-manager-api/documents/openapi.yaml`](./project-manager-api/documents/openapi.yaml) and render interactively at `/api-docs` on the running server.

## Deployment

The app is designed to deploy as two independent services plus a managed Postgres.

| Layer | Service | Notes |
| --- | --- | --- |
| Frontend | Vercel | Auto-detects Vite. `VITE_API_URL` points at the Render backend. |
| Backend | Render | Build runs `prisma generate && prisma migrate deploy`. Free tier sleeps after 15 min. |
| Database | Neon | Free tier, branchable, autosuspend. Region matched with Render for sub-ms latency. |

Total infrastructure cost: $0/month at portfolio scale.

## Roadmap

Honest list of what's not in the current build:

- **Task assignee picker** — the form takes a user ID; should be a dropdown of team members
- **Kanban board view** — drag tasks between status columns, instead of the flat list
- **Persist team descriptions** — schema currently has no `description` column on `teams`
- **Integration test suite** — supertest is installed but no tests are written yet; would gate every push through CI
- **Soft delete with audit trail** — currently a hard delete; a real product would keep history
- **Email notifications** on task assignment / status change
- **Pagination UI** on long lists (server already supports `limit`/`offset`)
- **Frontend error banners** on Tasks and Teams pages (Projects already has them)

## License

MIT
