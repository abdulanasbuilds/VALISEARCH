# CONTEXT.md — ValiSearch 2.0 Master Context

## READ THIS ENTIRE FILE BEFORE DOING ANYTHING.
## This file governs every single decision in this codebase.

---

## What Is ValiSearch

ValiSearch is an agentic startup intelligence platform.

A user types a startup idea in plain text. Twelve specialized
AI agents run in parallel — 3 search the live web for real data,
8 perform deep analytical reasoning, 1 synthesizes everything
into a final report. The result looks like a professional
research briefing, not a chatbot response.

Every statistic cites a source. Every competitor is real.
Every recommendation is specific to THIS idea, not generic advice.

Product position: The only startup intelligence platform built
for founders in Africa, Southeast Asia, and Latin America who
cannot afford $140-$500/month tools. Priced at $0-$79/month.

---

## Who Builds This

Abdul Anas — solo founder, final-year student, Kumasi Academy
Ghana. Builds entirely via AI coding agents. Non-technical.
Handle: @abdulanasbuilds (Twitter, GitHub, TikTok, YouTube)

Constraints that affect every decision:
- Primary device: Samsung S20 FE (mobile), laptop weekends only
- Zero budget until revenue exists
- Lemon Squeezy only for payments (no Ghana card required)
- WASSCE exam June 2026 — build schedule must accommodate this

---

## Tech Stack — NEVER DEVIATE FROM THIS

### Frontend
- Next.js 15 (App Router ONLY — never Pages Router)
- TypeScript 5 (strict mode — zero `any` types)
- Tailwind CSS v4
- shadcn/ui (component library)
- Zustand 4 (UI state only: modals, tabs, sidebar)
- TanStack Query v5 (ALL server state)
- react-hook-form + zod (ALL forms)
- Sonner (ALL toast notifications)
- Lucide React (ALL icons)
- Recharts (ALL charts)
- @dnd-kit (Kanban drag-and-drop)
- date-fns (date formatting)
- next-mdx-remote + gray-matter (blog)

### Backend
- Supabase (database + auth + edge functions + storage + realtime)
- @supabase/ssr (Next.js App Router integration — required)
- Supabase pgvector (RAG knowledge base)
- Supabase Edge Functions in Deno (ALL secret key usage)

### AI
- OpenRouter (model gateway — all AI calls via this)
- Jina Reader API (r.jina.ai — free URL to markdown)
- Jina Search API (s.jina.ai — free web search)
- Reddit JSON API (free, no key)
- HackerNews Algolia API (free, no key)

### Background Jobs
- Trigger.dev v3 (long-running analysis — no timeout limits)

### Payments
- Lemon Squeezy (no ID verification — works from Ghana)

### Deployment
- Cloudflare Pages (free hosting, no commercial restriction)
- GitHub (source control, Cloudflare auto-deploys on push)

### Email
- Resend (3,000 free/month transactional email)

### Analytics + Monitoring
- PostHog (free 1M events/month — user behavior)
- Sentry (free 5k errors/month — production errors)

### Rate Limiting
- Upstash Redis (free 10k req/day — prevent API abuse)

---

## The Critical Security Rule

ALLOWED in browser / Next.js src files:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  NEXT_PUBLIC_APP_URL
  NEXT_PUBLIC_LS_STORE_URL
  NEXT_PUBLIC_LS_PRO_VARIANT_ID
  NEXT_PUBLIC_LS_PREMIUM_VARIANT_ID

FORBIDDEN in any src/ file (Edge Functions / Trigger.dev only):
  OPENROUTER_API_KEY
  JINA_API_KEY
  SERPER_API_KEY
  LS_WEBHOOK_SECRET
  SUPABASE_SERVICE_ROLE_KEY
  RESEND_API_KEY
  TRIGGER_SECRET_KEY
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN

If a variable does not start with NEXT_PUBLIC_ it must
NEVER appear in any file inside app/, components/, lib/, hooks/.

---

## Supabase Auth — Critical Patterns

ALWAYS on server: supabase.auth.getUser()
NEVER on server: supabase.auth.getSession()
Session lives in HTTP-only cookies via @supabase/ssr middleware.

Server client creation:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
const cookieStore = await cookies()
```

Browser client creation:
```typescript
import { createBrowserClient } from '@supabase/ssr'
```

Middleware (root middleware.ts) must run on ALL app routes
to refresh expired auth tokens before they expire.

---

## Architecture Rules

### 1. Server Components by Default
Every component is RSC unless it needs interactivity.
Add "use client" ONLY when required.

### 2. Agent Layer is Isolated
ALL AI logic lives in /agents/ directory.
ALL AI calls go through Supabase Edge Functions or
Trigger.dev background jobs.
NEVER call AI APIs from components or pages.

### 3. Parallel Data Fetching Always
```typescript
const [a, b] = await Promise.all([fetchA(), fetchB()])
// Never: const a = await fetchA(); const b = await fetchB()
```

### 4. Named Exports Only
Exception: Next.js page.tsx files require default exports.

### 5. File Length Limit
No file longer than 200 lines.
Split into smaller focused files.

### 6. Error Handling Required
Every async function has try/catch.
Every catch block logs and returns typed fallback.
Never let errors propagate to the user as raw messages.

### 7. Background Jobs for Long Operations
Any operation > 30 seconds uses Trigger.dev.
The 12-agent analysis ALWAYS runs as a Trigger.dev task.
Never run it directly in a Next.js Route Handler.

### 8. TypeScript Strictness
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```
Zero build errors. Zero TypeScript errors. Non-negotiable.

### 9. Error Boundaries
Every route segment has an error.tsx file.
Every Suspense boundary has a loading.tsx file.
Root ErrorBoundary in app/layout.tsx.

### 10. RLS on Everything
Every database table has Row Level Security enabled.
Policy pattern: auth.uid() = user_id on all user data.
Credits table: service_role only for writes (Edge Function).

---

## Design System — ENFORCE STRICTLY

Theme: Light only. No dark mode. No toggle.

### Colors
```
Page background:  #F9FAFB (gray-50, warm)
Card surface:     #FFFFFF
Primary:          #1B4FFF (electric blue)
Primary hover:    #1240CC
Primary light:    #EEF2FF
Text heading:     #0C0D0E
Text body:        #1A1D23
Text muted:       #52565E
Text placeholder: #9CA3AF
Border default:   #E5E7EB
Border strong:    #D1D5DB
Score 70+:        #16A34A (green)
Score 40-69:      #D97706 (amber)
Score 0-39:       #DC2626 (red)
```

### Typography
Font: Inter (Google Fonts — weights 400,500,600,700,800)
Mono: JetBrains Mono (code blocks only)

Scale:
```
Display: 48px / weight 800 / tracking -0.02em
H1:      36px / weight 700 / tracking -0.01em
H2:      28px / weight 700
H3:      22px / weight 600
H4:      18px / weight 600
Body:    16px / weight 400 / leading 1.7
Small:   14px / weight 400 / leading 1.6
Tiny:    12px / weight 500
Label:   11px / weight 600 / tracking 0.06em / uppercase
```

### Component Patterns
```
Card:        bg-white border border-gray-200 rounded-xl shadow-sm p-6
Feature:     rounded-2xl p-8
Modal:       bg-white rounded-2xl shadow-xl border border-gray-200
             max-w-[440px] p-8
Input:       bg-white border border-gray-300 rounded-lg px-3 py-2.5
             text-sm focus:ring-2 focus:ring-blue-500/20
             focus:border-blue-500 transition-colors
Btn primary: bg-[#1B4FFF] text-white rounded-lg px-4 py-2.5
             text-sm font-semibold hover:bg-[#1240CC] transition-colors
Btn ghost:   border border-gray-300 bg-white rounded-lg
             hover:bg-gray-50 transition-colors
Min target:  44px height on all interactive elements
```

### ABSOLUTE PROHIBITIONS
- NO dark theme or backgrounds
- NO AI-generated images or illustrations
- NO emoji in any UI element
- NO gradient backgrounds
- NO floating 3D shapes, blobs, or decorative elements
- NO lorem ipsum text anywhere
- NO placeholder.com or picsum images
- NO `any` TypeScript type
- NO direct AI API calls from browser
- NO secret keys in src/ files

---

## Complete User Journey

### Path A — New visitor, not logged in
1. Lands on / (landing page)
2. Types startup idea in textarea
3. Clicks "Validate my idea free"
4. AuthGateModal appears (overlay, not redirect)
5. Signs up with email + password
6. Idea stored in localStorage key: valisearch_pending_idea
7. Confirmation email sent
8. User clicks email link
9. AuthCallback reads pending idea from localStorage
10. If found: navigates to /workspace/new, runs analysis
11. If not found: navigates to /workspace
12. Analysis completes, appears as first card in workspace

### Path B — Returning user, not logged in
1. Types idea on landing page
2. AuthGateModal shows "Sign in" tab
3. Signs in, idea resumes via localStorage

### Path C — Logged in user
1. Types idea, clicks Validate
2. Goes straight to analysis (no auth gate)
3. Redirected to /workspace after completion

### Path D — Opens past analysis
1. In /workspace, clicks any past analysis card
2. Full dashboard opens at /workspace/[id]
3. Navigates all sections
4. Back button returns to /workspace

### Path E — Direct /workspace visit (not logged in)
1. Redirected to /login with returnUrl=/workspace
2. After login, returned to /workspace

---

## Agentic Architecture

```
User types idea
      |
      v
API Route Handler (/api/analyze)
      |
      v
TRIGGER.DEV BACKGROUND JOB (no timeout)
      |
      +-- TOOL LAYER
      |   +-- Jina Reader  (URL to markdown)
      |   +-- Jina Search  (web search, 5 results)
      |   +-- Reddit API   (complaint signals, free)
      |   +-- HN Algolia   (demand signals, free)
      |   +-- OpenRouter   (model routing)
      |
      +-- DUAL MODEL CONTROLLER
      |   +-- Gemini Flash  (fast, cheap, parallel tasks)
      |   +-- Claude Sonnet (deep reasoning, synthesis)
      |
      +-- 12 AGENTS (parallel via Promise.allSettled)
      |   +-- Agent 1:  Idea Validator
      |   +-- Agent 2:  Market Researcher (web search)
      |   +-- Agent 3:  Competitor Intel (web search)
      |   +-- Agent 4:  Problem Prioritizer (Reddit+HN)
      |   +-- Agent 5:  Product Manager
      |   +-- Agent 6:  Offer Architect
      |   +-- Agent 7:  Growth Strategist
      |   +-- Agent 8:  Distribution Planner
      |   +-- Agent 9:  Content Creator
      |   +-- Agent 10: Brand Namer
      |   +-- Agent 11: Scale Architect
      |   +-- SYNTHESIS AGENT (Claude always, runs last)
      |
      v
SUPABASE (save result_json to analysis table)
      |
      v
WORKSPACE (user sees completed analysis)
```

All 11 analytical agents run in parallel via Promise.allSettled().
Synthesis agent (Agent 12) runs AFTER all 11 complete.
Each agent has typed fallback — one failure never kills analysis.

---

## Agent Summary

```
Agent 1:  Idea Validator       — scores idea on 6 dimensions
Agent 2:  Market Researcher    — TAM/SAM/SOM with Jina Search
Agent 3:  Competitor Intel     — real competitors via web search
Agent 4:  Problem Prioritizer  — Reddit + HN complaint signals
Agent 5:  Product Manager      — MVP features + kanban tasks
Agent 6:  Offer Architect      — headline, ICP, pricing tiers
Agent 7:  Growth Strategist    — channels, 4-week calendar
Agent 8:  Distribution Planner — launch strategy, partnerships
Agent 9:  Content Creator      — 10 hooks, content system
Agent 10: Brand Namer          — 5 names, brand voice, colors
Agent 11: Scale Architect      — 4-phase roadmap to $10K MRR
Agent 12: Synthesis            — ALWAYS Claude Sonnet, combines all
```

Research agents (2, 3, 4): Use Jina Search + Reddit + HN
Reasoning agents (1, 5-11): Pure AI analysis
Synthesis agent (12): Cross-references all outputs, flags contradictions

---

## Complete File Structure

```
valisearch/
+-- app/
|   +-- (public)/
|   |   +-- page.tsx              # / landing page
|   |   +-- pricing/page.tsx
|   |   +-- blog/page.tsx
|   |   +-- blog/[slug]/page.tsx
|   |   +-- about/page.tsx
|   |   +-- changelog/page.tsx
|   |   +-- terms/page.tsx
|   |   +-- privacy/page.tsx
|   +-- (auth)/
|   |   +-- login/page.tsx
|   |   +-- register/page.tsx
|   |   +-- forgot-password/page.tsx
|   |   +-- auth/callback/route.ts
|   +-- (app)/
|   |   +-- layout.tsx            # App shell with sidebar
|   |   +-- onboarding/page.tsx
|   |   +-- workspace/page.tsx
|   |   +-- workspace/new/page.tsx
|   |   +-- workspace/[id]/page.tsx
|   |   +-- settings/
|   |       +-- page.tsx
|   |       +-- billing/page.tsx
|   +-- api/
|   |   +-- analyze/route.ts      # Triggers Trigger.dev job
|   |   +-- webhook/ls/route.ts   # Lemon Squeezy webhook
|   |   +-- webhook/trigger/route.ts
|   +-- layout.tsx                # Root layout
|   +-- error.tsx
|   +-- not-found.tsx
|   +-- globals.css
+-- agents/
|   +-- orchestrator.ts
|   +-- agents/
|   |   +-- idea-validator.ts
|   |   +-- market-researcher.ts
|   |   +-- competitor-intel.ts
|   |   +-- problem-prioritizer.ts
|   |   +-- product-manager.ts
|   |   +-- offer-architect.ts
|   |   +-- growth-strategist.ts
|   |   +-- distribution-planner.ts
|   |   +-- content-creator.ts
|   |   +-- brand-namer.ts
|   |   +-- scale-architect.ts
|   |   +-- synthesis.ts
|   +-- tools/
|   |   +-- jina.ts               # readUrl() + searchWeb()
|   |   +-- openrouter.ts         # callModel() + routing
|   |   +-- reddit.ts
|   |   +-- hackernews.ts
|   +-- types/
|       +-- analysis.ts
+-- components/
|   +-- ui/                       # shadcn/ui
|   +-- layout/
|   |   +-- PublicNavbar.tsx
|   |   +-- AppNavbar.tsx
|   |   +-- Footer.tsx
|   |   +-- AppSidebar.tsx
|   +-- auth/
|   |   +-- AuthGateModal.tsx
|   |   +-- LoginForm.tsx
|   |   +-- RegisterForm.tsx
|   +-- workspace/
|   |   +-- AnalysisCard.tsx
|   |   +-- EmptyWorkspace.tsx
|   |   +-- IdeaInputBox.tsx
|   +-- analysis/
|   |   +-- AnalysisProgress.tsx
|   |   +-- AgentStatusCard.tsx
|   |   +-- sections/
|   |       +-- OverviewSection.tsx
|   |       +-- ValidationSection.tsx
|   |       +-- MarketSection.tsx
|   |       +-- ProblemSection.tsx
|   |       +-- OfferSection.tsx
|   |       +-- CompetitorSection.tsx
|   |       +-- GrowthSection.tsx
|   |       +-- DistributionSection.tsx
|   |       +-- ContentSection.tsx
|   |       +-- BrandSection.tsx
|   |       +-- ScaleSection.tsx
|   |       +-- ProductSection.tsx
|   |       +-- SynthesisSection.tsx
|   +-- landing/
|   |   +-- HeroSection.tsx
|   |   +-- HowItWorks.tsx
|   |   +-- FeatureGrid.tsx
|   |   +-- DashboardMockup.tsx
|   |   +-- PricingCards.tsx
|   +-- shared/
|       +-- ScoreBadge.tsx
|       +-- CopyButton.tsx
|       +-- SourceCitation.tsx
|       +-- ConfidenceBadge.tsx
|       +-- SectionSkeleton.tsx
+-- lib/
|   +-- supabase/
|   |   +-- client.ts
|   |   +-- server.ts
|   |   +-- middleware.ts
|   +-- validations/
|   |   +-- auth.ts
|   |   +-- idea.ts
|   +-- utils.ts
|   +-- constants.ts
|   +-- analytics.ts
+-- hooks/
|   +-- useAnalysis.ts
|   +-- useCredits.ts
|   +-- useUser.ts
+-- types/
|   +-- database.ts
|   +-- index.ts
+-- content/
|   +-- blog/posts/              # .mdx blog files
+-- triggers/
|   +-- analyze.ts               # Trigger.dev task definition
+-- supabase/
|   +-- functions/
|   |   +-- analyze-proxy/index.ts
|   +-- migrations/
|       +-- 001_initial.sql
+-- public/
|   +-- _redirects
|   +-- _headers
|   +-- manifest.json
|   +-- robots.txt
|   +-- sitemap.xml
|   +-- icons/
|       +-- icon-192.png
|       +-- icon-512.png
+-- opencode/
|   +-- agents/
|       +-- reviewer.md
|       +-- security.md
|       +-- planner.md
+-- CONTEXT.md
+-- AGENTS.md
+-- PLAN.md
+-- RULES.md
+-- SKILLS.md
+-- middleware.ts
+-- next.config.ts
+-- tailwind.config.ts
+-- tsconfig.json
+-- trigger.config.ts
+-- .env.local                    # NEVER commit
+-- .env.example                  # ALWAYS commit
+-- .gitignore
```

---

## Database Schema

```sql
-- Profiles (auto-created on signup via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credits system
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  balance INTEGER DEFAULT 6,
  lifetime_used INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transaction history
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  analysis_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas submitted
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  idea_text TEXT NOT NULL,
  title TEXT,
  category TEXT,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysis results
CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  analysis_type TEXT DEFAULT 'full',
  overall_score INTEGER,
  result_json JSONB,
  agent_logs JSONB,
  data_sources JSONB,
  credits_used INTEGER DEFAULT 2,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analysis progress (real-time updates)
CREATE TABLE analysis_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analysis(id),
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  ls_customer_id TEXT,
  ls_subscription_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RAG knowledge base
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(1536),
  source TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Auto-trigger: new user creates profile + credits
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email) VALUES (NEW.id, NEW.email);
  INSERT INTO credits (user_id, balance) VALUES (NEW.id, 6);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

Full schema: supabase/migrations/001_initial.sql

Key rules:
- RLS on ALL tables
- credits: service_role writes only (never from browser)
- analysis: service_role insert only (Trigger.dev task)
- knowledge_base: pgvector(1536) for RAG embeddings

---

## Credit and Pricing System

```
Plan         Credits    Cost
Free         6          $0/month     (3 full analyses)
Pro          100        $29/month    (50 full analyses)
Premium      unlimited  $79/month    (no limit)

Analysis Type      Credits Used
Quick (3 agents)   1
Full (12 agents)   2
Deep + web         3  (Pro+ only)
```

---

## Model Routing

```
Context              Model
Development          google/gemini-flash-1.5 (free tier)
Production (free)    google/gemini-2.5-flash (paid)
Production (pro)     anthropic/claude-sonnet-4-6
Production (premium) anthropic/claude-sonnet-4-6 + web search
Synthesis (always)   anthropic/claude-sonnet-4-6
Fallback (any)       Mock data (never fail analysis)
```

---

## Route Map

```
PUBLIC (no login):
  /                Landing page
  /pricing         Pricing comparison
  /blog            Blog list
  /blog/[slug]     Individual blog post
  /about           About + story
  /changelog       Product updates
  /terms           Terms of service
  /privacy         Privacy policy

AUTH:
  /login           Sign in
  /register        Create account
  /auth/callback   Email confirmation handler
  /forgot-password Password reset

ONBOARDING (first-time only):
  /onboarding      3-step welcome flow

APP (requires login):
  /workspace               All analyses
  /workspace/new           Start new analysis
  /workspace/[id]          View specific analysis
  /settings                Account settings
  /settings/billing        Plan and payment
```

---

## Feature Checklist

### Authentication
- Email + password signup
- Confirmation email (Resend)
- Login with email/password
- Password reset flow
- Auth gate modal (idea preserved in localStorage)
- Session persistence via @supabase/ssr

### Idea Input
- Textarea with character counter (max 2000)
- Minimum 20 characters validation
- Quick analysis (3 agents, 1 credit)
- Full analysis (12 agents, 2 credits)

### Analysis Engine
- 12 parallel AI agents via Trigger.dev background job
- Fallback to mock data if AI fails
- Credit check before running
- Save result to Supabase database
- Real-time progress via Supabase Realtime

### Workspace
- List all past analyses (newest first)
- Score badge per analysis card
- Idea title truncated
- Date and time stamp
- Click to open full analysis

### Dashboard (per analysis)
- Section 1: Overview (score + quick stats)
- Section 2: Validation Score (6 dimensions)
- Section 3: Market Intelligence (TAM/SAM/SOM)
- Section 4: Problem Landscape (scored table)
- Section 5: Offer Builder (landing page format)
- Section 6: Competitive Intelligence (real competitors)
- Section 7: Growth Playbook (4-week plan)
- Section 8: Distribution Plan (channels + partnerships)
- Section 9: Content Engine (hooks + formats)
- Section 10: Brand Options (5 names + voice)
- Section 11: Scale Roadmap (4 phases to $10K MRR)
- Section 12: Product Plan (MVP features + kanban)
- Section 13: Synthesis (cross-referenced insights)
- Sidebar navigation between sections
- Copy section as text

### Credit System
- Credit balance visible in navbar
- Upgrade modal when credits = 0
- Lemon Squeezy checkout integration
- Webhook updates credits after payment

---

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Must pass zero errors
npm run typecheck     # npx tsc --noEmit
npm run lint          # ESLint

npx supabase start    # Local Supabase
npx supabase db push  # Push migrations
npx supabase gen types # Regenerate TypeScript types

git add .
git commit -m "type: description"
git push origin main  # Triggers Cloudflare deploy
```

---

## Commit Message Format

```
feat:     new feature
fix:      bug fix
security: security hardening
perf:     performance improvement
refactor: code cleanup
docs:     documentation update
chore:    config or tooling
test:     tests added or fixed
```

---

## What NOT to Do

1. Never suggest Vite, CRA, or Pages Router
2. Never put AI logic in components or pages
3. Never call AI APIs directly from the browser
4. Never use `any` TypeScript type
5. Never skip error handling on async operations
6. Never ignore TypeScript errors
7. Never use default exports except for page.tsx files
8. Never store secrets in .env files committed to Git
9. Never write components longer than 200 lines
10. Never mix server and client Supabase clients
11. Never use getSession() on the server
12. Never run long AI operations in Route Handlers (use Trigger.dev)
