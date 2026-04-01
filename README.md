# Aurevia — Pension & Financial Management Platform

A secure, multi-tenant pension and financial management web application built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router)             |
| Language   | TypeScript                          |
| Styling    | Tailwind CSS + inline styles        |
| UI Libs    | react-icons, framer-motion          |
| Backend    | Supabase (Auth, PostgreSQL, Storage)|
| Auth       | Supabase Auth (email/password + SSO)|
| Database   | PostgreSQL with Row Level Security  |

---

## Project Structure

```
aurevia/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles + fonts
│   ├── auth/
│   │   └── login/page.tsx      # Auth page (login + register)
│   └── dashboard/
│       ├── user/page.tsx       # Member dashboard
│       ├── admin/page.tsx      # Admin dashboard
│       └── compliance/page.tsx # Compliance dashboard
│
├── components/
│   ├── pages/                  # Full page components
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ComplianceDashboard.jsx
│   ├── ui/                     # Reusable UI primitives
│   │   ├── StatusBadge.tsx
│   │   ├── MetricCard.tsx
│   │   ├── Modal.tsx
│   │   └── FormField.tsx
│   └── layout/                 # Layout components
│       ├── Sidebar.tsx
│       └── Topbar.tsx
│
├── lib/
│   ├── utils.ts                # Formatters, helpers, constants
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       ├── server.ts           # Server Supabase client
│       ├── middleware.ts       # Auth middleware helper
│       └── queries.ts          # All DB query functions
│
├── hooks/
│   ├── useAuth.ts              # Auth state hook
│   ├── useContributions.ts     # Contributions data hook
│   └── useWithdrawals.ts       # Withdrawals data hook
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── middleware.ts               # Next.js route protection
├── supabase-schema.sql         # Full DB schema + RLS policies
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd aurevia
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase-schema.sql`
3. Go to **Storage** → create a bucket named `kyc-documents` (set to private)
4. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages & Routes

| Route                   | Page                  | Access            |
|-------------------------|-----------------------|-------------------|
| `/`                     | Landing page          | Public            |
| `/auth/login`           | Login / Register      | Public            |
| `/dashboard/user`       | Member Dashboard      | `user` role       |
| `/dashboard/admin`      | Admin Dashboard       | `admin` role      |
| `/dashboard/compliance` | Compliance Dashboard  | `compliance_officer` role |

---

## Roles

| Role                | Permissions                                      |
|---------------------|--------------------------------------------------|
| `user`              | View own dashboard, contributions, withdrawals, KYC status |
| `admin`             | Approve/reject contributions & withdrawals, manage users    |
| `compliance_officer`| Review KYC, flag transactions, view audit trail             |
| `super_admin`       | Full access across all organizations                        |

---

## Key Features

- **Multi-tenant architecture** — strict RLS tenant isolation by `organization_id`
- **KYC workflow** — document upload → pending → compliance review → approved/rejected
- **Contribution tracking** — admin-managed entries with approval workflow
- **Withdrawal lifecycle** — member request → admin approval gate with rejection reasons
- **Immutable audit logs** — every action recorded; no UPDATE/DELETE allowed on audit table
- **Role-based access control** — enforced at both middleware and database (RLS) levels
- **Supabase Auth** — email/password with JWT session management

---

## Deployment (Vercel)

```bash
npm run build
```

Then deploy to Vercel and add all environment variables in the Vercel dashboard.

---

## License

Private — All rights reserved.
