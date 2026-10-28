# 🚢 ShipMates

**The matchmaker platform connecting indie developers with content creators.**

General freelance platforms fail the creator economy — Upwork project success rates sit **below 3%**, because generic marketplaces don't understand creators' workflows, niches, or budgets. ShipMates fixes the matching problem with a vertical, persona-driven platform purpose-built for creator–developer collaboration.

> Goldman Sachs projects the creator economy to reach **$480B by 2027**, with **50M+ creators** — yet only ~4% earn over $100K. Most need affordable technical partners to turn their audience into products. ShipMates is the bridge.

---

## ✨ Features

### 🎭 Persona System
Pick your side on first visit — **Developer** or **Creator** (10 seeded demo profiles each). Your persona drives personalized match scores, role-based dashboards, and available actions. Persisted in `localStorage`, switchable anytime.

### 🎯 Smart Match Scoring
Every profile card shows a **0–100 match score** computed by a transparent, weighted algorithm (`src/lib/match.ts`):

| Factor | Weight (profile) | Weight (project) |
|---|---|---|
| Skill overlap | 50% | 60% |
| Niche fit | 20% | 15% |
| Budget alignment | 18% | 25% |
| Timezone proximity | 7% | — |
| Availability | 5% | — |

Scores are labeled **Strong match** (≥75), **Good match** (≥50), or **Possible fit**, and results are ranked by score — no more needle-in-a-haystack browsing.

### 📋 Two-Sided Workflow
- **Creators** post project briefs (title, description, skills, budget range, timeline) and review incoming applications.
- **Developers** browse Discover and Listings, send intros, and track applications.
- Mutual interest creates a **connection** with a status badge (`pending → accepted`) on both dashboards.

### 🖥️ Pages
| Page | What it does |
|---|---|
| **Landing** | Value prop, live platform stats, creator-economy market data, vertical-vs-generic comparison |
| **Discover** | Two-tab browsing (creators / developers) with search, filters, match-score ranking, profile popups |
| **Listings** | Project brief board — creators post, developers apply |
| **Dashboard** | Role-aware: connections, application tracking, my briefs + incoming applications, Top-3 recommendations |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **UI**: Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) + lucide-react icons
- **State**: [Zustand](https://zustand.docs.pmnd.rs) with `persist` middleware (persona + local actions)
- **Animation**: framer-motion
- **Database**: SQLite via [Prisma ORM](https://www.prisma.io)
- **Validation**: zod

## 🗄️ Data Model

```
Developer ──┬── Match ──── Creator ──┬── Project
            └── Application ─────────┘── Application
```

| Model | Purpose |
|---|---|
| `Developer` | Skills, niches served, hourly rate, availability, timezone, portfolio |
| `Creator` | Platform (YouTube / TikTok / Twitch / Newsletter / Podcast…), niche, audience size, budget range |
| `Project` | Brief posted by a creator: skills needed, budget, timeline, status |
| `Match` | Developer ↔ creator connection (initiated by either side) |
| `Application` | Developer → project brief application |

## 🔌 API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/developers` | GET, POST | List / create developer profiles |
| `/api/creators` | GET, POST | List / create creator profiles |
| `/api/projects` | GET, POST | List open briefs / publish a new brief |
| `/api/matches` | GET, POST, PATCH | Connections with match scores / send intro / accept |
| `/api/applications` | GET, POST, PATCH | Applications per project or developer / apply / decide |
| `/api/stats` | GET | Live platform counts for the landing page |

All write endpoints validate input and guard against duplicate connections/applications.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** (or Bun)
- npm / pnpm / bun

### 1. Install & configure

```bash
git clone https://github.com/<you>/shipmates.git
cd shipmates
npm install

# Point Prisma at the bundled SQLite file
cp .env.example .env
```

### 2. Set up the database

```bash
npx prisma generate   # generate the client
npm run db:push       # sync schema to SQLite
```

The repo ships with `db/custom.db` pre-seeded with demo data (10 developers, 10 creators, 9 project briefs, sample matches & applications) — **it works out of the box**.

To regenerate demo data from scratch:

```bash
npx tsx scripts/seed.ts
```

### 3. Run

```bash
npm run dev           # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

### Useful scripts

| Command | Action |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` / `npm start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:generate` | Regenerate Prisma client |

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma        # 5 models: Developer, Creator, Project, Match, Application
├── db/
│   └── custom.db            # Pre-seeded SQLite database
├── scripts/
│   └── seed.ts              # Demo data: 10 devs, 10 creators, 9 briefs
└── src/
    ├── app/
    │   ├── page.tsx         # Single-page app shell
    │   └── api/             # 6 REST route handlers
    ├── components/matchmaker/
    │   ├── landing.tsx      # Marketing page + market data
    │   ├── discover.tsx     # Browse + filter + match ranking
    │   ├── listings.tsx     # Project brief board
    │   ├── dashboard.tsx    # Role-aware dashboard
    │   ├── persona-dialog.tsx    # Developer/Creator onboarding
    │   └── ...              # profile / connect dialogs, header, footer
    └── lib/
        ├── match.ts         # Weighted scoring engine
        ├── store.ts         # Zustand store (persona, matches, applications)
        └── types.ts         # Shared TypeScript types
```

## 🗺️ Roadmap

- [ ] In-app chat between connected users
- [ ] LLM-generated "why you match" explanations on profile cards
- [ ] Real authentication (NextAuth) replacing the demo persona system
- [ ] Payments & escrow for booked collaborations
- [ ] Review & rating system after completed projects

## 🤝 Contributing

Issues and PRs are welcome. For large changes, open an issue first to discuss the approach.

## 📄 License

[MIT](LICENSE)
