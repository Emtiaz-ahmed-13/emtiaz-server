<div align="center">

# emtiaz-server

**Portfolio backend** — a production-ready REST API that powers [emtiaz-client](https://github.com/Emtiaz-ahmed-13/emtiaz-client).

Express 4 + TypeScript + **Prisma 7** + PostgreSQL with JWT auth, Zod validation, modular feature architecture, SMTP-backed contact form, and a single-aggregator endpoint that delivers the entire portfolio in one round-trip.

[![Live API](https://img.shields.io/badge/API-emtiaz--server.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://emtiaz-server.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-emtiaz--client-1e293b?style=for-the-badge&logo=next.js&logoColor=white)](https://github.com/Emtiaz-ahmed-13/emtiaz-client)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](#license)

![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3-1e40af)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Related Repository](#related-repository)
- [License](#license)

---

## Overview

A real backend for what is normally a static portfolio. Every section on the frontend — profile, projects with case studies, skills, experience, education, achievements, contact — is served from this API, persisted in PostgreSQL, and managed through admin-only mutation endpoints.

Designed to be **production-shaped**: modular feature folders, Zod validation across body / query / params, centralised error handling, JWT access + refresh tokens, role-based access control, and Vercel-serverless-ready out of the box.

## Highlights

| Feature | Detail |
|---|---|
| **Modular architecture** | Each feature is a self-contained folder — `controller`, `services`, `validation`, `routes`, `interface`, `constant`. Adding a feature takes ~10 minutes from the existing template. |
| **Single aggregator endpoint** | `GET /api/v1/portfolio` returns the entire portfolio (profile + projects + skills + experiences + education + achievements) in one round-trip — minimises waterfall on the client. |
| **Type-safe validation** | Zod schemas in `*.validation.ts` for every mutation route — body, query, and params — wired through a shared `validateRequest` middleware. |
| **JWT auth + role guard** | `accessToken` + `refreshToken`, bcrypt password hashing, `ADMIN` / `USER` roles. The `auth(...roles)` middleware decodes + verifies in one step. |
| **Centralised error envelope** | `globalErrorHandler` maps `ZodError`, Prisma errors, JWT errors, and custom `ApiError` to a consistent `{ success, message, error }` shape. |
| **Contact form with SMTP** | `POST /api/v1/contact` persists the message and emails the admin via Nodemailer with a dark-themed HTML template. |
| **URL normalisation** | `urlSchema.ts` extracts plain URLs from markdown links (`[label](url)` → `url`) so the admin can paste links straight from GitHub or Notion. |
| **Image URL resolution** | `imageUrlHelpers.ts` rewrites ImgBB page links (`https://ibb.co/<id>`) to direct image URLs at storage time. |
| **Vercel serverless ready** | `vercel.json` + `api/index.ts` catch-all function. CORS allowlist covers localhost + `*.vercel.app` by default. |
| **Dockerised local Postgres** | `docker-compose up -d` spins up a Postgres 16 instance for development. |

## Tech Stack

| Layer | Choices |
|---|---|
| **Runtime** | Node.js 20 · Express 4 · TypeScript 5 |
| **Database** | PostgreSQL 16 (local via Docker, prod on [Neon](https://neon.tech)) |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` for serverless cold-start performance |
| **Auth** | `jsonwebtoken` (access + refresh) · `bcrypt` (configurable salt rounds) |
| **Validation** | Zod 3 (body / query / params) |
| **Email** | Nodemailer (Gmail App Password or any SMTP) |
| **Security** | CORS allowlist · cookie-parser · `express-rate-limit` available |
| **Tooling** | `ts-node-dev` for hot reload · `tsx` for seed script · ESLint |
| **Deployment** | Vercel serverless (Node.js runtime, single catch-all function) |

## Architecture

```
┌──── HTTP Request ────────────────────────────────────────────┐
│                                                              │
│   cors()          → allowlist + *.vercel.app                 │
│   cookieParser()                                             │
│   json() / urlencoded()                                      │
│         │                                                    │
│         ▼                                                    │
│   /api/v1/* router  ──→  feature route                       │
│         │                  │                                 │
│         │                  ├─ auth(roles?)         (if private)
│         │                  ├─ validateRequest(zod) (if mutation)
│         │                  ├─ controller                     │
│         │                  └─ services ─→ Prisma ─→ Postgres │
│         │                                                    │
│         ▼                                                    │
│   globalErrorHandler  ── handles ZodError / JWT / Prisma /   │
│                          ApiError / unknown                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Project Structure

```
emtiaz-server/
├── api/
│   └── index.ts                # Vercel serverless entry — re-exports Express app
├── prisma/
│   ├── schema.prisma           # Source of truth for the DB
│   └── seed.ts                 # Admin user + profile + projects + skills + ...
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── Auth/           # login / refresh / logout
│   │   │   ├── Profile/        # profile CRUD (admin)
│   │   │   ├── Project/        # projects + case study fields
│   │   │   ├── Skill/
│   │   │   ├── Experience/
│   │   │   ├── Education/
│   │   │   ├── Contact/        # public POST + admin list/read/delete
│   │   │   └── Portfolio/      # public aggregator
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verify + role guard
│   │   │   ├── validateRequest.ts  # Zod across body/query/params
│   │   │   └── globalErrorHandler.ts
│   │   ├── routes/             # Single mount point for all modules
│   │   ├── errors/             # ApiError class + error types
│   │   └── shared/             # prisma client singleton
│   ├── config/                 # env loader
│   ├── helpers/
│   │   ├── jwtHelpers.ts       # sign / verify
│   │   ├── paginationHelpers.ts
│   │   ├── slugHelpers.ts
│   │   ├── imageUrlHelpers.ts  # ImgBB page → direct
│   │   ├── paramsHelpers.ts
│   │   ├── urlSchema.ts        # Markdown link → plain URL
│   │   └── mailer.ts           # Nodemailer transporter + templates
│   ├── app.ts                  # Express app composition
│   └── server.ts               # http.listen wrapper (local dev)
├── docker-compose.yml          # Local Postgres 16
├── vercel.json                 # Serverless build + routing
├── API.md                      # Full endpoint reference
├── API-TESTING.md              # Step-by-step curl examples
├── prisma.config.ts            # Prisma 7 config
├── tsconfig.json
└── package.json
```

## Data Model

| Model | Purpose |
|---|---|
| `User` | Admin authentication (only the seeded admin exists by default) |
| `Profile` | Hero / about section content — single row |
| `Project` | Card content + case-study fields (`problem`, `approach`, `outcome`, `challenges`, `role`, `duration`, `features`, `screenshots`) |
| `Skill` | Grouped skills with proficiency (0-100) |
| `Experience` | Work / club / OSS roles with `current` flag |
| `Education` | Degrees / institutions |
| `Achievement` | Hackathons, contests, certifications — typed via `AchievementCategory` enum |
| `ContactMessage` | Persisted submissions from the contact form |

Full schema in [`prisma/schema.prisma`](./prisma/schema.prisma).

## API Reference

Detailed endpoint docs live in [`API.md`](./API.md) and worked curl examples in [`API-TESTING.md`](./API-TESTING.md).

### Public endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/api/v1/portfolio` | Aggregator — profile + projects + skills + experience + education + achievements |
| `GET` | `/api/v1/projects` | Paginated project list |
| `GET` | `/api/v1/projects/slug/:slug` | Single project case study |
| `POST` | `/api/v1/contact` | Submit contact form (saves to DB + emails admin) |

### Admin endpoints (require `Bearer <accessToken>`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Issue access + refresh tokens |
| `POST` | `/api/v1/auth/refresh-token` | Rotate access token |
| `POST` / `PATCH` / `DELETE` | `/api/v1/projects[...]` | Full project CRUD |
| `POST` / `PATCH` / `DELETE` | `/api/v1/skills[...]` · `/experiences[...]` · `/education[...]` · `/achievements[...]` | Section CRUD |
| `PATCH` | `/api/v1/profile` | Update hero / about content |
| `GET` / `DELETE` | `/api/v1/contact[...]` | Inbox view + cleanup |

All responses follow:

```json
{ "success": true, "message": "...", "data": { ... } }
```

## Getting Started

**Prerequisites:** Node 20+ · Docker · npm 10+

```bash
git clone git@github.com:Emtiaz-ahmed-13/emtiaz-server.git
cd emtiaz-server
npm install

cp .env.sample .env
# Edit DATABASE_URL, JWT secrets, ADMIN_*, SMTP_* (use a Gmail App Password)

docker compose up -d                  # Postgres 16 on localhost:5434
npx prisma db push                    # Create schema
npm run db:seed                       # Seed admin + portfolio content

npm run dev                           # ts-node-dev hot reload on :5001
```

Smoke test:

```bash
curl http://localhost:5001/api/v1/portfolio | jq '.data.projects[].title'
```

## Environment Variables

| Key | Required | Description |
|---|---|---|
| `NODE_ENV` | yes | `development` / `production` |
| `PORT` | yes | Local port (default `5001`) |
| `DATABASE_URL` | yes | Postgres connection string (Neon-compatible) |
| `JWT_SECRET` | yes | Access-token signing secret |
| `JWT_EXPIRES_IN` | yes | e.g. `1d` |
| `JWT_REFRESH_TOKEN_SECRET` | yes | Refresh-token signing secret |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | yes | e.g. `7d` |
| `JWT_RESET_PASS_TOKEN` | yes | Password-reset token secret |
| `JWT_RESET_PASS_TOKEN_EXPIRES_IN` | yes | e.g. `10m` |
| `ADMIN_EMAIL` | yes | Used by `db:seed` to create the admin user |
| `ADMIN_PASSWORD` | yes | Seed admin password |
| `ADMIN_NAME` | yes | Seed admin display name |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` | optional | Nodemailer config — Gmail App Password works out of the box |
| `CORS_ORIGINS` | optional | Comma-separated additional client origins (`*.vercel.app` is already allowed by default) |

A `.env.sample` is provided as a template.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | `ts-node-dev` hot-reload server on port `PORT` |
| `npm run build` | `prisma generate` + `tsc` → `dist/` |
| `npm run start` | Run compiled output (`node dist/server.js`) |
| `npm run db:migrate` | `prisma migrate dev` (creates a migration) |
| `npm run db:seed` | Wipes and reseeds the database (`tsx prisma/seed.ts`) |
| `npm run db:reset` | `prisma migrate reset` |

## Deployment

Hosted on **Vercel** as a single catch-all serverless function (`api/index.ts` re-exports the Express app, `vercel.json` routes `/(.*)` to it).

**Database:** Neon Postgres (Singapore region, free tier).

**Step-by-step:**

1. **Provision Postgres** — create a Neon (or Vercel Postgres / Supabase) project and grab the connection string.

2. **Set env vars on Vercel** for the `emtiaz-server` project — every key from the [Environment Variables](#environment-variables) table.

3. **Set `CORS_ORIGINS`** to your deployed frontend URL — e.g. `https://emtiaz-client.vercel.app`. `*.vercel.app` is already allowed by default, but be explicit if you use a custom domain.

4. **Push to `main`** — Vercel auto-builds. `vercel-build` runs `prisma generate`.

5. **Run migrations + seed against the cloud DB** (one-off, from your laptop):

   ```bash
   DATABASE_URL="<neon-connection-string>" npx prisma db push
   DATABASE_URL="<neon-connection-string>" npm run db:seed
   ```

6. **Verify:**

   ```bash
   curl https://emtiaz-server.vercel.app/api/v1/portfolio | jq '.data.projects[].title'
   ```

Live deployment: https://emtiaz-server.vercel.app

## Related Repository

| Repo | What | Live |
|---|---|---|
| [Emtiaz-ahmed-13/emtiaz-client](https://github.com/Emtiaz-ahmed-13/emtiaz-client) | Next.js 16 portfolio frontend that consumes this API | https://emtiaz-client.vercel.app |

## License

MIT © [Emtiaz Ahmed](https://github.com/Emtiaz-ahmed-13)
