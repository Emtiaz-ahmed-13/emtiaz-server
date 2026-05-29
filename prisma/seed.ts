import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "emtiaz2060@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Emtiaz Ahmed";

  // Wipe all portfolio data
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.profile.create({
    data: {
      headline: "Full Stack Engineer",
      bio: "I ship reliable full-stack products with TypeScript, React, Node.js, and PostgreSQL: clear APIs, durable data models, and polished user flows.",
      location: "Bangladesh",
      email: adminEmail,
      avatarUrl: "https://i.ibb.co/wFmx4Rjp/pp2.jpg",
      githubUrl: "https://github.com/Emtiaz-ahmed-13",
      linkedinUrl: "https://www.linkedin.com/in/emtiaz-ahmed-2892871a2/",
      websiteUrl: "https://emtiaz-client.vercel.app/",
      available: true,
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: "TypeScript", category: "LANGUAGE", level: 90, order: 1 },
      { name: "JavaScript", category: "LANGUAGE", level: 90, order: 2 },
      { name: "React", category: "FRAMEWORK", level: 85, order: 3 },
      { name: "Next.js", category: "FRAMEWORK", level: 85, order: 4 },
      { name: "Node.js", category: "FRAMEWORK", level: 90, order: 5 },
      { name: "NestJS", category: "FRAMEWORK", level: 85, order: 6 },
      { name: "Express.js", category: "FRAMEWORK", level: 85, order: 7 },
      { name: "PostgreSQL", category: "DATABASE", level: 85, order: 8 },
      { name: "Prisma", category: "TOOL", level: 90, order: 9 },
      { name: "Docker", category: "TOOL", level: 80, order: 10 },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "PurrfectHub",
        slug: "purrfecthub",
        shortDesc: "Adoption platform connecting cat lovers with feline companions",
        description:
          "PurrfectHub is a modern, feature-rich platform designed to connect cat lovers with their future feline companions. The product handles listings, adoption applications, donation flows, and an admin dashboard for shelter management.",
        techStack: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "Tailwind CSS"],
        imageUrl: "https://i.ibb.co/8D7CfD5Q/pro.jpg",
        liveUrl: "https://purrfecthub-client.vercel.app/",
        githubUrl: "https://github.com/Emtiaz-ahmed-13/purrfecthub_client",
        featured: true,
        published: true,
        order: 1,
        role: "Full Stack Engineer",
        duration: "6 weeks",
        problem:
          "Cat shelters and individual rescuers in Bangladesh had no central platform to list adoptable cats. The few attempts that existed used fragmented Facebook posts and Google Sheets — making it nearly impossible for potential adopters to discover, filter, or formally apply for a cat. There was no audit trail for applications and no donation channel for shelters.",
        approach:
          "I designed the product as a two-sided marketplace with a clean separation between adopter, shelter, and admin journeys. The frontend uses Next.js App Router with server components for fast initial render of the listing pages, while the backend is a typed REST API with role-based authorization. I chose PostgreSQL for transactional safety on adoption applications and donations, and Prisma to keep migrations explicit and review-friendly. Image hosting uses ImgBB to avoid object storage cost early on.",
        outcome:
          "Shipped a fully working v1 in 6 weeks with adopter onboarding, listing creation, structured adoption applications, donation tracking, and an admin dashboard with approval workflow. The site is deployed on Vercel + a managed Postgres instance, with sub-200ms TTFB on cached listing pages and 95+ Lighthouse score on the homepage.",
        challenges:
          "The hardest piece was the application workflow — turning a multi-step form into a clean state machine (draft → submitted → in-review → approved/rejected) while keeping the UX feel like a simple form. I solved it with a finite-state column on the application table and a transition validator in the service layer.",
        features: [
          "Browse and filter cats by breed, age, location, and adoption status",
          "Multi-step adoption application with auto-save draft",
          "Shelter dashboard with application approval queue",
          "Donation flow with transaction history",
          "Admin moderation panel for listings and users",
          "Role-based access control (adopter / shelter / admin)",
          "Image upload with progress and validation",
          "Email notifications on application status change",
        ],
        screenshots: [
          "https://i.ibb.co/8D7CfD5Q/pro.jpg",
          "https://i.ibb.co/bRX9mrWp/Screenshot-2026-05-29-at-3-25-42-PM.png",
          "https://i.ibb.co/QFZzB1f5/Screenshot-2026-05-29-at-3-26-13-PM.png",
        ],
      },
      {
        title: "SkillSync",
        slug: "skillsync",
        shortDesc: "Collaboration hub for freelancers and clients with escrow and Kanban workflow",
        description:
          "SkillSync is a professional collaboration platform that connects freelancers with clients and removes the friction from running a project end-to-end. It bundles milestone tracking, protected escrow payments, real-time chat, a Kanban board, and time tracking into one cohesive product.",
        techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma", "Socket.io"],
        imageUrl: "https://i.ibb.co/fYtLZFBN/Screenshot-2026-05-28-at-2-41-14-PM.png",
        liveUrl: "https://skillsync-client.vercel.app/",
        githubUrl: "https://github.com/Emtiaz-ahmed-13/skillsync_client",
        featured: true,
        published: true,
        order: 2,
        role: "Full Stack Engineer · Designer",
        duration: "8 weeks",
        problem:
          "Freelancers and clients in emerging markets juggle 4-5 disconnected tools — WhatsApp for chat, Trello for tasks, manual invoices for payment, and a shared doc for milestones. The result: missed deadlines, payment disputes, and a loss of trust. There was no opinionated tool that wrapped the entire engagement in one workflow with money held safely until milestones were verified.",
        approach:
          "I modeled the domain around three core entities: Project, Milestone, and Escrow. Each milestone has a payment locked in escrow that only releases when the client approves the deliverable — turning trust into a code path. The Kanban board is built on top of @dnd-kit with optimistic updates, and the chat uses Socket.io for low-latency messaging. Auth uses JWT with refresh rotation. The whole frontend is type-safe end-to-end with a shared types package between client and server.",
        outcome:
          "Delivered a polished MVP with end-to-end engagement flow — onboarding, project creation, milestone setup, escrow funding, deliverable submission, approval, and payout. The Kanban achieves 60fps drag interactions on 100+ tasks, and the chat has sub-100ms message latency on the hosted Socket.io server. Live deployment runs on Vercel + Railway with zero-downtime deploys.",
        challenges:
          "Building the escrow state machine correctly was non-trivial — there are ~9 valid transitions and partial-refund edge cases. I drew the full state diagram on paper before writing any code, then encoded it as a `MilestoneStatus` enum with explicit guards in the service layer. Race conditions on simultaneous approval/dispute clicks were solved with row-level optimistic locking in Postgres.",
        features: [
          "Project workspace with role-based access (client / freelancer)",
          "Milestone-based escrow with explicit release approval",
          "Real-time chat with read receipts and typing indicators",
          "Kanban board with smooth drag-and-drop on 100+ tasks",
          "Time tracking with built-in timer and timesheet export",
          "Activity feed with filterable event timeline",
          "Notification center for milestone, message, and payment events",
          "Dark mode with persisted preference",
        ],
        screenshots: [
          "https://i.ibb.co/fYtLZFBN/Screenshot-2026-05-28-at-2-41-14-PM.png",
        ],
      },
      {
        title: "TradeNest",
        slug: "tradenest",
        shortDesc: "Production-grade e-commerce backend API built with NestJS",
        description:
          "TradeNest is a fully-typed e-commerce backend API designed to be the engine behind any storefront. It ships with auth, catalog, cart, orders, inventory, payments, and a complete observability layer — built to be deployed as a containerized service.",
        techStack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Docker", "Swagger", "Better Auth"],
        imageUrl: null,
        liveUrl: null,
        githubUrl: "https://github.com/Emtiaz-ahmed-13/tradenest_frontend",
        featured: true,
        published: true,
        order: 3,
        role: "Backend Engineer",
        duration: "4 weeks",
        problem:
          "Most open-source e-commerce backends are either too tightly coupled to a frontend (Medusa, Saleor) or too unopinionated to use as a starting point. I wanted a clean, modular API surface that could power a Next.js storefront, a mobile app, or a Telegram bot — without dragging along framework-specific assumptions. It also had to be production-quality: observable, rate-limited, documented, and easy to deploy.",
        approach:
          "I built it on NestJS for the dependency-injection + modular structure, then added the layers a real production API needs: global validation pipes for input safety, response interceptors for consistent envelope, Helmet for security headers, @nestjs/throttler for rate limits, and a centralized exception filter that maps everything to a typed error response. Auth is handled by Better Auth with role-based access. Redis backs both the rate limiter and a future cache layer. Docker Compose orchestrates Postgres + Redis + the API with health checks so `docker compose up` gives you a running stack in one command.",
        outcome:
          "Delivered a documented, production-ready API with 40+ endpoints across auth, products, categories, carts, orders, and admin. Swagger/OpenAPI docs are auto-generated and live at `/docs`. The Docker stack starts in under 8 seconds locally with health checks confirming readiness. Code is structured for easy extension — adding a new resource takes ~10 minutes following the existing module template.",
        challenges:
          "Designing the response envelope to be consistent across success, validation error, business error, and unexpected error — without leaking stack traces in production — required building a custom exception filter and a response interceptor that work together. I also had to think carefully about how the rate limiter, validation, and auth guards compose in the request lifecycle.",
        features: [
          "Modular NestJS architecture — Auth, Products, Categories, Cart, Orders, Users",
          "Role-based access control with Better Auth",
          "Auto-generated Swagger/OpenAPI documentation",
          "Global validation with class-validator + class-transformer",
          "Centralized exception handling with consistent error envelope",
          "Response interceptors for uniform success responses",
          "Rate limiting with @nestjs/throttler and Redis backend",
          "Helmet, CORS, and security headers configured",
          "Dockerized with Postgres + Redis health checks",
          "Environment-based config with validation on startup",
        ],
        screenshots: [],
      },
      {
        title: "EduMentor AI",
        slug: "edumentor-ai",
        shortDesc:
          "AI-powered learning platform — led a 4-person team end-to-end on the MERN stack",
        description:
          "EduMentor AI is an intelligent education platform that helps students learn faster through AI-driven tutoring, personalised study plans, and progress tracking. Built with the MERN stack (MongoDB · Express · React · Node.js) in a clean modular architecture — designed for scale from day one. Frontend repo: github.com/Emtiaz-ahmed-13/edumentor_ai_client · Backend repo: github.com/Emtiaz-ahmed-13/edumentor_ai_server",
        techStack: [
          "React 18",
          "Vite",
          "Tailwind CSS",
          "shadcn/ui",
          "Node.js",
          "Express.js",
          "MongoDB",
          "Mongoose",
          "JWT",
          "bcrypt",
        ],
        imageUrl:
          "https://i.ibb.co/HDLLdDpR/Screenshot-2026-05-28-at-11-01-38-PM.png",
        liveUrl: "https://edumentor-ai-client.vercel.app/",
        githubUrl: "https://github.com/Emtiaz-ahmed-13/edumentor_ai_client",
        featured: true,
        published: true,
        order: 4,
        role: "Team Lead · Full Stack Engineer",
        duration: "6 weeks · 4-person team",
        problem:
          "Students working through free educational content hit two consistent walls — information overload (too many topics, no clear path) and isolation (no one to ask when stuck at 2 AM). Existing solutions are either expensive 1:1 tutoring or generic chatbots that don't remember context or track your weak spots. We set out to build an AI mentor that adapts to each learner — explains concepts, generates quizzes, and tracks progress — while staying affordable for students in emerging markets.",
        approach:
          "I led a 4-engineer team (2 frontend, 2 backend) and split the work along clear module boundaries — each engineer owned 1–2 features end-to-end (Auth, User, Tutor, Quiz). We standardised on a strict Module Pattern on the backend (controller / service / route / model per feature) so people could ship in parallel without merge conflicts.\n\nMy direct responsibilities as lead: system architecture, API contract design (shared Postman collection committed to the repo as the source of truth), JWT auth flow with access + refresh token rotation, PR review across both repos, and the Vercel deployment pipeline for client + server. I set the engineering rituals — daily 15-min async Discord stand-ups, a written 'definition of done' for PRs (lint pass + manual test + screenshot), and pair-programming sessions for the trickier auth and CORS work.\n\nWe let the frontend start integrating against the Postman contract before the backend was 'finished' — that overlap cut total delivery time by roughly 30%.",
        outcome:
          "Shipped a deployed MVP in 6 weeks with full authentication, user profiles, AI tutoring chat, and quiz generation. The team merged 100+ PRs across both repos with zero production rollbacks. Backend exposes 20+ documented endpoints (Postman collection lives in the repo) with consistent response envelopes and a single global error handler. Code is structured so a teammate can scaffold a new feature module in ~30 minutes using the existing template — onboarding the 4th engineer who joined late took half a day, not a week.",
        challenges:
          "The hardest part wasn't the code — it was coordinating four engineers with different schedules, skill levels, and time zones. Three concrete things I had to solve as lead:\n\n1) **Merge conflict hell** in week 2 — fixed by enforcing strict module boundaries (one engineer = one feature folder) and a 'PR-per-module' policy.\n\n2) **A nasty CORS deadlock** between client (Vercel) and server (Vercel) — debugged across 3 environments, pinned it to a missing `credentials: true` plus an exact origin allowlist, then documented the fix so the team internalised it.\n\n3) **Uneven contribution** — addressed by pairing the more experienced engineers with the juniors on the harder modules (auth refresh, error handler) so knowledge actually transferred instead of bottlenecking on me.",
        features: [
          "MERN stack (MongoDB · Express · React · Node) with strict Module Pattern",
          "Modular architecture — Auth and User as self-contained features (controller / service / route / model)",
          "JWT authentication with access + refresh token rotation",
          "Password hashing with bcrypt (configurable salt rounds)",
          "Centralised global error handler with consistent response envelope",
          "Standardised `sendResponse` helper for every endpoint",
          "Postman collection committed to the repo as the team API contract",
          "CORS-hardened API ready for multi-origin frontends",
          "Environment-based config with startup validation",
          "Vercel deployment for both client and server (separate projects)",
          "Team-led delivery — 4 engineers shipping in parallel, 100+ PRs, zero rollbacks",
        ],
        screenshots: [
          "https://i.ibb.co/HDLLdDpR/Screenshot-2026-05-28-at-11-01-38-PM.png",
        ],
      },
      {
        title: "Nebula Chat",
        slug: "nebula-chat",
        shortDesc:
          "Secure, self-destructing private chat rooms with end-to-end encryption",
        description:
          "Nebula Chat is a privacy-first messaging platform for ephemeral conversations. Rooms self-destruct after a chosen duration (5 min to 1 hour), messages are end-to-end encrypted, and nothing is stored permanently. Built on Next.js 16 App Router with Elysia.js API routes, Upstash Redis for ephemeral storage, and WebSocket for real-time delivery — designed so a sensitive conversation leaves no permanent trace on the server or the client.",
        techStack: [
          "Next.js 16",
          "TypeScript",
          "Tailwind CSS",
          "Elysia.js",
          "Upstash Redis",
          "WebSockets",
          "Bun",
        ],
        imageUrl:
          "https://i.ibb.co/j9mRq8tz/Screenshot-2026-05-29-at-12-41-13-AM.png",
        liveUrl: "https://nebula-gamma-teal.vercel.app/",
        githubUrl: "https://github.com/Emtiaz-ahmed-13/nebula",
        featured: true,
        published: true,
        order: 5,
        role: "Full Stack Engineer",
        duration: "2 weeks",
        problem:
          "Mainstream chat apps store every message indefinitely — even 'disappearing' messages typically sit on a server until a timer runs out. For genuinely sensitive conversations (legal, medical, journalistic, personal) people fall back to in-person meetings or fragile workarounds. There was no zero-friction tool that combined three properties: end-to-end encryption, true ephemeral storage (TTL at the database level, not just on the UI), and a one-click shareable room link that worked on any device with no install.",
        approach:
          "I built Nebula on Next.js 16 App Router so the marketing surface and the chat UI live in the same codebase, then dropped Elysia.js inside `/api` for typed, high-performance request handling. The core trick is Upstash Redis with native key TTL — every message and every room is stored with an expiration aligned to the room duration, so deletion is enforced by the database itself, not by a cron job that might be skipped. Real-time delivery uses WebSocket connections multiplexed per room. Auth is intentionally minimal: token-based with HTTP-only secure cookies scoped to the room, so there is no account, no email, no profile to leak. Rate limiting and input sanitisation are layered in to keep the public surface safe.",
        outcome:
          "Shipped a deployed product on Vercel with 5-minute to 1-hour room durations, real-time messaging at sub-100ms perceived latency, and provable ephemeral storage (Redis TTL guarantees keys are evicted server-side when the room expires). The whole flow — create room → share link → chat → auto-destruct — works in under 10 seconds on first load, on mobile and desktop, with zero account creation friction. Codebase is ~97% TypeScript and structured so each feature (rooms, messages, auth, proxy) is its own module.",
        challenges:
          "The hardest piece was making the self-destruct guarantee actually hold under WebSocket reconnects and tab refreshes. I had to align three independent timers — the Redis TTL, the WebSocket session lifecycle, and the client-side countdown — so a client that reconnects 1 second before expiry doesn't accidentally extend the room. The fix was to treat Redis TTL as the single source of truth: every reconnect re-reads the remaining TTL from the server, the WebSocket layer never extends it, and the client UI is purely a mirror of what the server says. The second challenge was rate-limiting room creation without hurting legitimate users — solved with a per-IP token bucket backed by Redis.",
        features: [
          "Self-destructing rooms with 5/10/15/30/60-minute durations",
          "End-to-end encrypted messages — server never sees plaintext",
          "True ephemeral storage backed by Upstash Redis TTL",
          "Real-time messaging over WebSockets with auto-reconnect",
          "Shareable one-click room links with auto-extraction from pasted URLs",
          "Capped at 2 participants per room for genuine 1:1 privacy",
          "No accounts, no email, no profile — token-based session in HTTP-only cookies",
          "Rate limiting and input sanitisation on every public endpoint",
          "Responsive UI built with Tailwind CSS — works on mobile and desktop",
          "Deployed on Vercel with Upstash Redis as the only backing service",
        ],
        screenshots: [
          "https://i.ibb.co/j9mRq8tz/Screenshot-2026-05-29-at-12-41-13-AM.png",
        ],
      },
    ],
  });

  await prisma.education.createMany({
    data: [
      {
        institution: "BRAC University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        description:
          "Studying Computer Science with focus on data structures, algorithms, operating systems, and software engineering. Actively building real-world projects alongside coursework to bridge theory and practice. Engaged in self-directed learning around backend architecture and distributed systems.",
        startDate: new Date("2023-09-01"),
        endDate: null,
        current: true,
        order: 1,
      },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        company: "Independent · Self-employed",
        position: "Full Stack Engineer",
        location: "Dhaka, Bangladesh",
        description:
          "Designing and shipping production-grade full-stack web apps end-to-end. Owned the full surface area — product scoping, system architecture, backend (Node.js, Express, NestJS, PostgreSQL, Prisma, MongoDB), frontend (Next.js, React, TypeScript, Tailwind), and Docker- / Vercel-based deployment.\n\nNotable builds:\n• PurrfectHub — adoption platform with multi-step applications.\n• SkillSync — freelancer ↔ client collaboration hub with escrow + Kanban.\n• TradeNest — production-grade e-commerce backend API with Swagger docs, rate limiting, and security hardening.\n• EduMentor AI — led a 4-engineer team on a MERN-stack learning platform; owned architecture, API contract, JWT auth flow, PR review, and the Vercel pipeline. Shipped MVP in 6 weeks with 100+ PRs across two repos and zero production rollbacks.",
        startDate: new Date("2024-01-01"),
        endDate: null,
        current: true,
        order: 1,
      },
      {
        company: "Self-Directed Learning",
        position: "Backend & Distributed Systems",
        location: "Remote",
        description:
          "Currently deep-diving into NestJS, microservices architecture, message brokers (Redis Streams, RabbitMQ), event-driven patterns, and distributed system fundamentals. Building small experimental services to internalize patterns before applying them in client work.",
        startDate: new Date("2025-01-01"),
        endDate: null,
        current: true,
        order: 2,
      },
      {
        company: "Open Source · GitHub",
        position: "Contributor",
        location: "Remote",
        description:
          "Active on GitHub building and maintaining personal open-source repositories. Engaging with the JavaScript/TypeScript ecosystem through issues, discussions, and small PRs to upstream projects I use.",
        startDate: new Date("2024-06-01"),
        endDate: null,
        current: true,
        order: 3,
      },
      {
        company: "BRAC University Computer Club (BUCC)",
        position: "General Member",
        location: "BRAC University, Dhaka",
        description:
          "Active member of BUCC — BRAC University's computer science and technology club. Participating in workshops, programming contests, and community-building events organised by the club.",
        startDate: new Date("2025-01-01"),
        endDate: null,
        current: true,
        order: 4,
      },
      {
        company: "BRAC University Chess Club",
        position: "Senior Executive",
        location: "BRAC University, Dhaka",
        description:
          "Senior Executive of the BRAC University Chess Club — helping organise tournaments, training sessions, and inter-university chess events. Sharpening strategic thinking through regular play and competitive participation.",
        startDate: new Date("2025-01-01"),
        endDate: null,
        current: true,
        order: 5,
      },
    ],
  });

  await prisma.achievement.createMany({
    data: [
      {
        title: "Bit Battles Final Round 2025",
        organizer: "BRAC University Computer Club × Phitron",
        category: "CONTEST",
        date: new Date("2025-07-18"),
        location: "BRAC University, Dhaka",
        rank: "Position 121",
        team: "Team bracu_kiloFight (with Ayhan Arash Tasin and Niloy)",
        description:
          "Competitive programming finals hosted at BRAC University, organised by the BRAC University Computer Club and powered by Phitron. Competed as Team bracu_kiloFight with Ayhan Arash Tasin and Niloy — solved 2 of the contest set, one submission hit a loop limit error that taught us a real lesson for the next round.\n\nA personal highlight was finally getting a photo with Abdur Rakib bhaiya — and a big thanks to Lotifur Shabbir bhaiya for organising. The gifts were top-notch.",
        imageUrl: "https://i.ibb.co/357NGhJ0/bits.jpg",
        images: [
          "https://i.ibb.co/357NGhJ0/bits.jpg",
          "https://i.ibb.co/Z1k3Gc4c/gift.jpg",
          "https://i.ibb.co/ccyj758y/bitsbattle.jpg",
        ],
        order: 1,
      },
      {
        title: "Web Dev Hackathon 2025",
        organizer: "North South University × Programming Hero",
        category: "HACKATHON",
        date: new Date("2025-05-01"),
        location: "North South University, Dhaka",
        description:
          "My very first hackathon — a fast-paced web development sprint hosted at North South University, powered by Programming Hero. Built a working product end-to-end under real time pressure.\n\nSpecial mention to Mir Hussain bhaiya for the early advice that turned 'সেই frontend না পারা ছেলেটা' into someone who ships. An unforgettable first.",
        imageUrl: "https://i.ibb.co/gL1S5cNZ/hackethon1.jpg",
        images: [
          "https://i.ibb.co/gL1S5cNZ/hackethon1.jpg",
          "https://i.ibb.co/zWNKPpKm/hackethon2.jpg",
        ],
        order: 2,
      },
      {
        title: "HackerRank SQL (Intermediate) Certificate",
        organizer: "HackerRank",
        category: "CERTIFICATE",
        date: new Date("2024-12-01"),
        description:
          "Verified SQL proficiency at the Intermediate level — joins, subqueries, window functions, complex aggregations, and query optimization. Skills applied directly in production work with PostgreSQL + Prisma on every project I ship.",
        imageUrl: "https://i.ibb.co/tpVfKHhH/sql.jpg",
        images: ["https://i.ibb.co/tpVfKHhH/sql.jpg"],
        order: 3,
      },
      {
        title: "Programming Hero — Level 2 (Web Development)",
        organizer: "Programming Hero",
        category: "COURSE",
        date: new Date("2024-10-01"),
        description:
          "Completed the 3+ month intensive Level 2 Web Development course while balancing university academics and tight deadlines. Built multiple full-stack projects, deepened understanding of modern React, Node.js, and backend architecture. Acknowledging room to grow further in frontend — actively working on it.",
        imageUrl: "https://i.ibb.co/hJnptxrt/ph.jpg",
        images: ["https://i.ibb.co/hJnptxrt/ph.jpg"],
        order: 4,
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Shipping PurrfectHub's MVP in 6 weeks",
        slug: "shipping-purrfecthub-mvp-in-6-weeks",
        excerpt:
          "How I designed a two-sided adoption marketplace with Next.js, Prisma, and a finite-state application flow — and the trade-offs that made the timeline possible.",
        content:
          "## Why a state machine\n\nAdoption applications are deceptively complex — they look like a form, but they're really a workflow: draft → submitted → in-review → approved/rejected, with side-effects on each transition (emails, status fan-out, audit log).\n\nInstead of scattering `if (status === ...)` checks across the codebase, I modelled the lifecycle as an explicit finite-state column in Postgres plus a transition validator in the service layer. Every transition has to go through one function. That made the UI trivial: each state simply renders the next legal action.\n\n## What I'd do differently\n\nNext time I'd reach for Inngest (or a small Postgres-backed queue) for the email side-effects sooner. Doing them synchronously in the request handler was fine at MVP scale, but it'll be the first thing to bite at higher volume.",
        coverUrl: "https://i.ibb.co/8D7CfD5Q/pro.jpg",
        tags: ["Next.js", "Prisma", "Architecture"],
        readMinutes: 7,
        publishedAt: new Date("2026-05-12"),
        status: "PUBLISHED",
        featured: true,
        order: 1,
      },
      {
        title: "Building Nebula: real-time chat without a database",
        slug: "building-nebula-realtime-chat-without-a-database",
        excerpt:
          "Storing every message in Redis with native TTL means deletion is enforced by the store itself, not a flaky cron job. Why the simplest answer is usually the right one.",
        content:
          "## The setup\n\nNebula is an ephemeral group chat — every room has a duration, and when the timer runs out the room and every message in it disappear. No accounts, no DM history, no profile.\n\nThe entire data layer is **Redis** with TTL. Each message is a key whose expiration matches the room's expiration. There is no `DELETE` query, no cron job, no 'sweeper' process. Deletion is a property of the storage engine.\n\n## Why this matters\n\nThe more I build, the more I trust mechanisms over policies. A cron job that's *supposed to* delete data after N days will eventually be paused, mis-configured, or skipped. A Redis key with TTL just stops existing. The system can't get the deletion wrong, even by accident.",
        coverUrl: null,
        tags: ["Redis", "WebSockets", "Privacy"],
        readMinutes: 5,
        publishedAt: new Date("2026-04-28"),
        status: "PUBLISHED",
        featured: false,
        order: 2,
      },
      {
        title: "TypeScript patterns I wish I knew earlier",
        slug: "typescript-patterns-i-wish-i-knew-earlier",
        excerpt:
          "Discriminated unions, branded types, and the underrated `satisfies` operator — small ideas that quietly make a codebase easier to refactor years later.",
        content:
          "## 1. Discriminated unions over optional fields\n\nWhen a value can be in one of N states, model it as a union with a literal `kind` tag, not an object with optional fields. The compiler will then *force* you to handle every case in a `switch`, and adding a new state turns a runtime bug into a compile error.\n\n## 2. `satisfies` over `as`\n\n`as` lies; `satisfies` verifies. Use `as` only when you genuinely know better than the compiler (and add a comment saying why).\n\n## 3. Branded types for ids\n\nA `string` and a `UserId` are the same at runtime but you don't want to mix them. A tiny `type UserId = string & { __brand: 'UserId' }` catches an entire class of bugs at the type level.",
        coverUrl: null,
        tags: ["TypeScript", "Patterns"],
        readMinutes: 6,
        publishedAt: new Date("2026-04-09"),
        status: "PUBLISHED",
        featured: false,
        order: 3,
      },
    ],
  });

  console.log("Database reset and seeded successfully.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
