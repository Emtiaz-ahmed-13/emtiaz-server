# emtiaz-server

Portfolio backend — **Express 4** · **TypeScript** · **Prisma 7** · **PostgreSQL** · **JWT auth** · **Zod validation** · **Nodemailer**.

Powers [emtiaz-client](https://github.com/Emtiaz-ahmed-13/emtiaz-client). Public read endpoints + admin-only mutations.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js · Express 4 · TypeScript |
| DB | PostgreSQL via Prisma 7 (with `@prisma/adapter-pg`) |
| Auth | JWT (access + refresh) · bcrypt · role-based access |
| Validation | Zod (body / query / params) |
| Email | Nodemailer (SMTP) for contact-form admin notifications |
| Docker | `docker-compose.yml` for local Postgres |
| Deploy | Vercel serverless (Node runtime, single catch-all function) |

## Modules

`Auth`, `Profile`, `Project`, `Skill`, `Experience`, `Education`, `Achievement`, `Contact`, `Portfolio` (aggregator)

## Local Setup

```bash
git clone git@github.com:Emtiaz-ahmed-13/emtiaz-server.git
cd emtiaz-server
npm install
cp .env.sample .env

# Start Postgres locally
docker compose up -d

# Push schema + seed
npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

Backend will be on http://localhost:5001 — public portfolio at `GET /api/v1/portfolio`.

## Environment Variables

| Key | Description |
|---|---|
| `PORT` | Local port (default `5001`) |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Auth secrets |
| `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token TTLs |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed admin user |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` | Nodemailer SMTP config (Gmail app password works) |
| `CORS_ORIGINS` | Comma-separated extra origins (e.g. your prod client URL) |

## Scripts

```bash
npm run dev          # ts-node-dev hot reload
npm run build        # prisma generate + tsc → dist/
npm run start        # node dist/server.js
npm run db:migrate   # prisma migrate dev
npm run db:seed      # tsx prisma/seed.ts
npm run db:reset     # prisma migrate reset
```

## API

Full reference in [`API.md`](./API.md) and [`API-TESTING.md`](./API-TESTING.md).

Public endpoints (no auth):

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1/portfolio` | Everything in one shot (profile + projects + skills + experiences + education + achievements) |
| `GET` | `/api/v1/projects` | Project list |
| `GET` | `/api/v1/projects/slug/:slug` | Project case study |
| `POST` | `/api/v1/contact` | Contact form (also emails admin) |

Admin endpoints require a Bearer JWT from `POST /api/v1/auth/login`.

## Deployment (Vercel)

This repo includes `vercel.json` + `api/index.ts` (single catch-all serverless function). Steps:

1. Provision a Postgres database (Neon, Vercel Postgres, or Supabase).
2. Add the database connection string and all other env vars (`JWT_SECRET`, SMTP, etc.) in the Vercel project's "Environment Variables".
3. Add the deployed client URL to `CORS_ORIGINS`.
4. Push to `main` — Vercel auto-deploys, runs `prisma generate && prisma migrate deploy` (via `vercel-build`).
5. Manually run a one-off seed against the cloud DB:
   ```bash
   DATABASE_URL="<cloud-url>" npm run db:seed
   ```
