# ApplyVibe — Smart Job Application Tracker

> Track every application. Learn what works. Land better, faster.

A full-stack, **free-first, open-source** job application tracker built with Next.js, Auth.js, Prisma, and Neon PostgreSQL. No Supabase, no proprietary lock-in.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom green palette |
| UI Components | Radix UI + custom shadcn-style components |
| Auth | **Auth.js v5** (Credentials provider, JWT sessions) |
| ORM | **Prisma** |
| Database | **Neon PostgreSQL** (free tier) |
| Hosting | **Vercel Hobby** (free) |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |

**All core dependencies are open-source. Hosting is free.**

## Features

- 11-stage application pipeline (Saved → Applied → OA → Screen → Interviews → Offer/Rejected)
- Kanban board with drag-and-drop stage changes
- Analytics: response rate, interview conversion, rejection patterns, source performance
- Smart insights engine (auto-generated observations from your data)
- Full CRUD for applications with 20+ fields
- Dark/light mode with a forest green brand palette
- Follow-up reminders and overdue alerts
- Reflection tracker per application
- Secure auth with bcrypt-hashed passwords and JWT sessions

## Getting Started

### 1. Clone

```bash
git clone https://github.com/your-username/ApplyVibe.git
cd ApplyVibe
npm install
```

### 2. Set up Neon PostgreSQL (free)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the **Connection string** from the dashboard

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your-secret"   # generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel (free)

1. Push to GitHub
2. Import to Vercel
3. Add all 4 env variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy — Vercel auto-runs `prisma generate` in the build

## Color Palette

The UI uses a custom forest green palette:

| Token | Hex | Use |
|-------|-----|-----|
| `forest-900` | `#143601` | Dark mode background |
| `forest-800` | `#1a4301` | Dark mode cards |
| `forest-700` | `#245501` | Dark borders, accents |
| `forest-600` | `#538d22` | **Primary (light mode)** |
| `forest-500` | `#73a942` | **Primary (dark mode)** |
| `forest-400` | `#aad576` | Accent, highlights |

## Database Schema

```
User        → applications, reminders
Application → events (stage history), reflection, reminders
```

Full schema in `prisma/schema.prisma`.

## Resume Description

**ApplyVibe — Smart Job Application Tracker**
Built a full-stack, open-source job application management platform enabling users to track applications, manage follow-ups, and analyze job-search performance with real-time dashboards. Developed with Next.js 16, TypeScript, Tailwind CSS, Auth.js v5, Prisma ORM, and Neon PostgreSQL. Features secure credential authentication with bcrypt, Row-level data isolation via user-scoped Prisma queries, drag-and-drop Kanban board (dnd-kit), and an insights engine that surfaces actionable patterns from application data.
