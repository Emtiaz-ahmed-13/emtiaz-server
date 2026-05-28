# API Testing Guide (সব Request URL + Body)

**Base URL:** `http://localhost:5001/api/v1`  
**Admin Header (যেখানে লাগে):** `Authorization: Bearer <accessToken>`

Login করে token নিন:
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@emtiaz.dev","password":"Admin@123"}'
```

Response থেকে `data.accessToken` কপি করুন → `TOKEN` হিসেবে ব্যবহার করুন।

---

## 1. Auth

### 1.1 Register (Admin তৈরি)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/auth/register` |
| **Headers** | `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "name": "Emtiaz Ahmed",
  "email": "admin@emtiaz.dev",
  "password": "Admin@123"
}
```

---

### 1.2 Login
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/auth/login` |
| **Headers** | `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "email": "admin@emtiaz.dev",
  "password": "Admin@123"
}
```

---

### 1.3 Get Current User (Admin)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/auth/me` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 2. Portfolio (সব data একসাথে)

### 2.1 Full Portfolio
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/portfolio` |
| **Body** | ❌ None |

---

## 3. Profile

### 3.1 Get Profile
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/profile` |
| **Body** | ❌ None |

---

### 3.2 Update Profile (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/profile` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ সব field optional (যা change করবেন শুধু সেটা পাঠান) |

```json
{
  "headline": "Full Stack Developer",
  "bio": "I build modern web apps with TypeScript, React, Node.js and PostgreSQL.",
  "location": "Dhaka, Bangladesh",
  "email": "hello@emtiaz.dev",
  "phone": "+8801XXXXXXXXX",
  "resumeUrl": "https://example.com/resume.pdf",
  "avatarUrl": "https://example.com/avatar.jpg",
  "githubUrl": "https://github.com/emtiazahmed",
  "linkedinUrl": "https://linkedin.com/in/emtiazahmed",
  "twitterUrl": "https://twitter.com/emtiazahmed",
  "websiteUrl": "https://emtiaz.dev",
  "available": true
}
```

---

## 4. Projects

### 4.1 List Published Projects (Public)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/projects` |
| **Query (optional)** | `?page=1&limit=10&featured=true&published=true` |
| **Body** | ❌ None |

**Query params:**
| Param | Values | Example |
|-------|--------|---------|
| `page` | number string | `?page=1` |
| `limit` | number string | `?limit=10` |
| `featured` | `true` / `false` | `?featured=true` |
| `published` | `true` / `false` | `?published=false` |

**Example URLs:**
- `http://localhost:5001/api/v1/projects`
- `http://localhost:5001/api/v1/projects?page=1&limit=5`
- `http://localhost:5001/api/v1/projects?featured=true`

---

### 4.2 List All Projects — Admin (draft + published)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/projects/admin/all` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Query (optional)** | `?page=1&limit=10&published=false` |
| **Body** | ❌ None |

---

### 4.3 Get Project by Slug
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/projects/slug/portfolio-api` |
| **Body** | ❌ None |

`:slug` = project slug (যেমন seed-এ `portfolio-api`)

---

### 4.4 Get Project by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/projects/{PROJECT_UUID}` |
| **Body** | ❌ None |

**Example:** `http://localhost:5001/api/v1/projects/550e8400-e29b-41d4-a716-446655440000`

---

### 4.5 Create Project (Admin)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/projects` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "title": "E-Commerce App",
  "slug": "ecommerce-app",
  "description": "Full stack e-commerce application with cart, payment integration and admin dashboard.",
  "shortDesc": "Modern e-commerce platform",
  "techStack": ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
  "imageUrl": "https://example.com/project.png",
  "liveUrl": "https://demo.example.com",
  "githubUrl": "https://github.com/emtiazahmed/ecommerce",
  "featured": true,
  "published": true,
  "order": 2
}
```

**Note:** `slug` না দিলে `title` থেকে auto তৈরি হবে।

---

### 4.6 Update Project (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/projects/{PROJECT_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Partial (যা change করবেন) |

```json
{
  "title": "E-Commerce App v2",
  "published": false,
  "featured": true
}
```

---

### 4.7 Delete Project (Admin)
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5001/api/v1/projects/{PROJECT_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 5. Skills

### 5.1 List Skills
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/skills` |
| **Query (optional)** | `?category=FRAMEWORK` |
| **Body** | ❌ None |

**category values:** `LANGUAGE` | `FRAMEWORK` | `DATABASE` | `TOOL` | `OTHER`

**Example:** `http://localhost:5001/api/v1/skills?category=DATABASE`

---

### 5.2 Get Skill by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/skills/{SKILL_UUID}` |
| **Body** | ❌ None |

---

### 5.3 Create Skill (Admin)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/skills` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "name": "Next.js",
  "category": "FRAMEWORK",
  "level": 80,
  "order": 9
}
```

---

### 5.4 Update Skill (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/skills/{SKILL_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Partial |

```json
{
  "level": 90,
  "order": 1
}
```

---

### 5.5 Delete Skill (Admin)
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5001/api/v1/skills/{SKILL_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 6. Experience

### 6.1 List Experiences
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/experiences` |
| **Body** | ❌ None |

---

### 6.2 Get Experience by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/experiences/{EXPERIENCE_UUID}` |
| **Body** | ❌ None |

---

### 6.3 Create Experience (Admin)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/experiences` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "company": "Tech Company Ltd",
  "position": "Full Stack Developer",
  "description": "Built REST APIs and React dashboards for internal tools.",
  "location": "Dhaka, Bangladesh",
  "startDate": "2023-01-15T00:00:00.000Z",
  "endDate": null,
  "current": true,
  "order": 1
}
```

**Date formats (যেকোনো কাজ করবে):**
- ISO: `"2023-01-15T00:00:00.000Z"`
- Simple: `"2023-01-15"`

---

### 6.4 Update Experience (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/experiences/{EXPERIENCE_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Partial |

```json
{
  "position": "Senior Full Stack Developer",
  "current": true
}
```

---

### 6.5 Delete Experience (Admin)
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5001/api/v1/experiences/{EXPERIENCE_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 7. Education

### 7.1 List Education
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/education` |
| **Body** | ❌ None |

---

### 7.2 Get Education by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/education/{EDUCATION_UUID}` |
| **Body** | ❌ None |

---

### 7.3 Create Education (Admin)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/education` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "institution": "University of Dhaka",
  "degree": "Bachelor of Science",
  "field": "Computer Science",
  "description": "Focused on software engineering and databases.",
  "startDate": "2018-09-01",
  "endDate": "2022-06-30",
  "current": false,
  "order": 1
}
```

---

### 7.4 Update Education (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/education/{EDUCATION_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Partial |

```json
{
  "degree": "BSc in Computer Science",
  "current": false
}
```

---

### 7.5 Delete Education (Admin)
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5001/api/v1/education/{EDUCATION_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 8. Contact

### 8.1 Send Message (Public)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5001/api/v1/contact` |
| **Headers** | `Content-Type: application/json` |
| **Body** | ✅ Required |
| **Rate limit** | 10 requests / 15 min per IP |

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "Hi Emtiaz, I would like to discuss a full stack role with you."
}
```

**Note:** `subject` optional।

---

### 8.2 Dashboard Stats (Admin)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/contact/stats` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

### 8.3 List Messages (Admin)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/contact` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Query (optional)** | `?page=1&limit=10&read=false` |
| **Body** | ❌ None |

**Query params:**
| Param | Values |
|-------|--------|
| `page` | `1`, `2`, ... |
| `limit` | `10`, `20`, ... |
| `read` | `true` / `false` |

**Example:** `http://localhost:5001/api/v1/contact?page=1&limit=10&read=false`

---

### 8.4 Get Message by ID (Admin)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/api/v1/contact/{MESSAGE_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

### 8.5 Mark Read / Unread (Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `http://localhost:5001/api/v1/contact/{MESSAGE_UUID}/read` |
| **Headers** | `Authorization: Bearer TOKEN` + `Content-Type: application/json` |
| **Body** | ✅ Required |

```json
{
  "read": true
}
```

Unread করতে: `{ "read": false }`

---

### 8.6 Delete Message (Admin)
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `http://localhost:5001/api/v1/contact/{MESSAGE_UUID}` |
| **Headers** | `Authorization: Bearer TOKEN` |
| **Body** | ❌ None |

---

## 9. Health Check (root)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5001/` |
| **Body** | ❌ None |

---

## Quick Reference — Body আছে কিনা

| # | Method | URL | Body |
|---|--------|-----|------|
| 1 | POST | `/auth/register` | ✅ |
| 2 | POST | `/auth/login` | ✅ |
| 3 | GET | `/auth/me` | ❌ |
| 4 | GET | `/portfolio` | ❌ |
| 5 | GET | `/profile` | ❌ |
| 6 | PATCH | `/profile` | ✅ |
| 7 | GET | `/projects` | ❌ |
| 8 | GET | `/projects/admin/all` | ❌ |
| 9 | GET | `/projects/slug/:slug` | ❌ |
| 10 | GET | `/projects/:id` | ❌ |
| 11 | POST | `/projects` | ✅ |
| 12 | PATCH | `/projects/:id` | ✅ |
| 13 | DELETE | `/projects/:id` | ❌ |
| 14 | GET | `/skills` | ❌ |
| 15 | GET | `/skills/:id` | ❌ |
| 16 | POST | `/skills` | ✅ |
| 17 | PATCH | `/skills/:id` | ✅ |
| 18 | DELETE | `/skills/:id` | ❌ |
| 19 | GET | `/experiences` | ❌ |
| 20 | GET | `/experiences/:id` | ❌ |
| 21 | POST | `/experiences` | ✅ |
| 22 | PATCH | `/experiences/:id` | ✅ |
| 23 | DELETE | `/experiences/:id` | ❌ |
| 24 | GET | `/education` | ❌ |
| 25 | GET | `/education/:id` | ❌ |
| 26 | POST | `/education` | ✅ |
| 27 | PATCH | `/education/:id` | ✅ |
| 28 | DELETE | `/education/:id` | ❌ |
| 29 | POST | `/contact` | ✅ |
| 30 | GET | `/contact/stats` | ❌ |
| 31 | GET | `/contact` | ❌ |
| 32 | GET | `/contact/:id` | ❌ |
| 33 | PATCH | `/contact/:id/read` | ✅ |
| 34 | DELETE | `/contact/:id` | ❌ |

**`:id` / UUID** — আগে `GET /portfolio` বা list API থেকে real UUID নিন; example UUID দিয়ে test করলে 404 আসতে পারে।
