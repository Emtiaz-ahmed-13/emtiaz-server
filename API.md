# Portfolio API

Base URL: `http://localhost:5001/api/v1`

## Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio` | Full portfolio (profile, projects, skills, experience, education) |
| GET | `/profile` | About / profile |
| GET | `/projects` | Published projects (`?featured=true`, `?page=1&limit=10`) |
| GET | `/projects/slug/:slug` | Single project by slug |
| GET | `/projects/:id` | Single project by id |
| GET | `/skills` | Skills (`?category=FRAMEWORK`) |
| GET | `/experiences` | Work experience |
| GET | `/education` | Education |
| POST | `/contact` | Send contact message |
| POST | `/auth/login` | Admin login |
| POST | `/auth/register` | Create admin user |

## Admin (Header: `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Current user |
| PATCH | `/profile` | Update profile |
| GET | `/projects/admin/all` | All projects (draft + published) |
| POST | `/projects` | Create project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST/PATCH/DELETE | `/skills/:id` | Skill CRUD |
| POST/PATCH/DELETE | `/experiences/:id` | Experience CRUD |
| POST/PATCH/DELETE | `/education/:id` | Education CRUD |
| GET | `/contact` | List messages |
| GET | `/contact/stats` | Dashboard stats |
| PATCH | `/contact/:id/read` | Mark read/unread |
| DELETE | `/contact/:id` | Delete message |

## Setup

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Default admin: `admin@emtiaz.dev` / `Admin@123`
