# Project Manager API

Express + Prisma backend for the [Project Manager](../README.md) app. See the root README for the full project overview, screenshots, and deployment instructions.

## Quick start

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL
npx prisma migrate dev      # apply schema
npm run dev                 # http://localhost:8080
```

API docs (Swagger UI): http://localhost:8080/api-docs

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload and `.env` loading |
| `npm start` | Production server (env vars must already be set) |
| `npm run build` | Generates the Prisma client |
| `npm run migrate:deploy` | Applies migrations in production |

## Project layout

```
src/
├── routes/         HTTP routing per resource
├── controllers/    request/response shaping
├── middleware/     auth, validators, role gates
├── services/       business logic, error mapping
├── repositories/   Prisma queries
├── config/db.js    PrismaClient singleton
└── server.js       app entry point
```

The pattern is **route → controller → service → repository**. Validation lives in middleware so controllers stay thin and the same checks apply across handlers.
