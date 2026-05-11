# PLAN.md — ValiSearch 2.0 Build Plan

## Current Status
Phase: Phase 2 — Agent Engine
Last updated: 2026-05-11

---

## Phase 0 — Project Foundation (Weekend 1)
Status: COMPLETED

### 0.1 — Repository Setup
- [x] Create GitHub repository
- [x] Initialize Next.js 15 with TypeScript + Tailwind
- [x] Configure tsconfig.json strict mode
- [x] Configure eslint
- [x] Setup shadcn/ui
- [x] Create CONTEXT.md, PLAN.md, AGENTS.md, SKILLS.md, RULES.md
- [ ] Push to GitHub

### 0.2 — Supabase Setup
- [ ] Create Supabase project (region: eu-west-2)
- [x] Run initial migration (001_initial.sql)
- [ ] Enable pgvector extension
- [ ] Configure Auth SMTP with Resend
- [ ] Set Edge Function secrets
- [x] Generate TypeScript types

### 0.3 — Environment Configuration
- [x] Create .env.local with public keys
- [x] Create .env.example (commit this)
- [x] Configure proxy.ts for Supabase SSR (Next.js 16)
- [x] Setup lib/supabase/client.ts
- [x] Setup lib/supabase/server.ts
- [x] Setup lib/supabase/middleware.ts

### 0.4 — Foundation Code
- [x] Create agents/types/analysis.ts (all TypeScript interfaces)
- [x] Create lib/constants.ts (app constants)
- [x] Create lib/utils.ts (cn, formatScore, sanitizeIdea)
- [x] Create lib/validations/auth.ts (zod schemas)
- [x] Create lib/validations/idea.ts (zod schema)

### 0.5 — Deployment Configuration
- [x] Create public/_redirects
- [x] Create public/_headers
- [ ] Connect Cloudflare Pages to GitHub
- [x] Verify first deployment

**Milestone: Empty Next.js app deploys to Cloudflare with zero errors** (COMPLETED)

---

## Phase 1 — Authentication & Core Shell (Weekend 2)
Status: COMPLETED

### 1.1 — Supabase Auth Integration
- [x] proxy.ts — session refresh + auth redirect
- [x] app/(auth)/login/page.tsx
- [x] app/(auth)/register/page.tsx
- [x] app/(auth)/forgot-password/page.tsx
- [x] app/(auth)/auth/callback/page.tsx
- [x] components/auth/AuthGateModal.tsx
- [x] components/auth/LoginForm.tsx
- [x] components/auth/RegisterForm.tsx

### 1.2 — Layout Components
- [x] components/layout/PublicNavbar.tsx
- [x] components/layout/AppNavbar.tsx
- [x] components/layout/Footer.tsx
- [x] components/layout/AppSidebar.tsx
- [x] app/(public)/layout.tsx (public layout with navbar/footer)
- [x] app/(app)/layout.tsx (app layout with sidebar)
- [x] app/layout.tsx (root layout with Inter font)
- [x] app/error.tsx (root error boundary)
- [x] app/not-found.tsx

### 1.3 — Landing Page
- [x] components/landing/HeroSection.tsx (idea textarea + auth gate trigger)
- [x] components/landing/HowItWorks.tsx
- [x] components/landing/FeatureGrid.tsx
- [x] components/landing/DashboardMockup.tsx (HTML/CSS only)
- [x] components/landing/PricingCards.tsx
- [x] app/(public)/page.tsx

### 1.4 — Onboarding
- [x] app/(app)/onboarding/page.tsx (3-step welcome flow)

**Milestone: User can sign up, confirm email, log in, see landing page** (COMPLETED)

---

## Phase 2 — Agent Engine (Weekend 3-4)
Status: IN PROGRESS

### 2.1 — Agent Tools Layer
- [x] agents/tools/openrouter.ts (callModel + model routing)
- [x] agents/tools/jina.ts (readUrl + searchWeb)
- [x] agents/tools/reddit.ts (getRedditSignals)
- [x] agents/tools/hackernews.ts (getHNSignals)

### 2.2 — Individual Agents
- [x] Agent 1: agents/agents/idea-validator.ts
- [x] Agent 2: agents/agents/market-researcher.ts (web search)
- [x] Agent 3: agents/agents/competitor-intel.ts (web search)
- [x] Agent 4: agents/agents/problem-prioritizer.ts (Reddit+HN)
- [x] Agent 5: agents/agents/product-manager.ts
- [x] Agent 6: agents/agents/offer-architect.ts
- [x] Agent 7: agents/agents/growth-strategist.ts
- [x] Agent 8: agents/agents/distribution-planner.ts
- [x] Agent 9: agents/agents/content-creator.ts
- [x] Agent 10: agents/agents/brand-namer.ts
- [x] Agent 11: agents/agents/scale-architect.ts
- [x] Agent 12: agents/agents/synthesis.ts (Claude always)

### 2.3 — Orchestrator
- [x] agents/orchestrator.ts (Promise.allSettled for 11, then synthesis)
- [x] Score calculation logic
- [x] Fallback mock data per agent

### 2.4 — Trigger.dev Task
- [ ] trigger.config.ts
- [ ] triggers/analyze.ts (background job definition) - created but excluded from build
- [x] app/api/analyze/route.ts (triggers the job)
- [ ] app/api/webhook/trigger/route.ts (receives completion)

### 2.5 — Edge Function (proxy)
- [ ] supabase/functions/analyze-proxy/index.ts - created but excluded from build
- [x] JWT validation (via app/api/analyze)
- [x] Credit check and deduction (via app/api/analyze)

**Milestone: Full 12-agent analysis runs in < 90 seconds** (IN PROGRESS)

---

## Phase 3 — Dashboard (Weekend 5)
Status: COMPLETE

### 3.1 — Workspace Page
- [x] app/(app)/workspace/page.tsx (analysis list)
- [x] components/workspace/AnalysisCard.tsx
- [x] components/workspace/EmptyWorkspace.tsx
- [x] components/workspace/IdeaInputBox.tsx

### 3.2 — Analysis Progress Page
- [x] app/(app)/workspace/new/page.tsx
- [x] components/analysis/AnalysisProgress.tsx
- [x] components/analysis/AgentStatusCard.tsx
- [x] Real-time updates via Supabase Realtime
- [x] Auto-navigate on completion

### 3.3 — Analysis Dashboard Sections
- [x] app/(app)/workspace/[id]/page.tsx
- [x] components/analysis/sections/OverviewSection.tsx
- [x] components/analysis/sections/ValidationSection.tsx
- [x] components/analysis/sections/MarketSection.tsx
- [x] components/analysis/sections/ProblemSection.tsx
- [x] components/analysis/sections/OfferSection.tsx
- [x] components/analysis/sections/CompetitorSection.tsx
- [x] components/analysis/sections/GrowthSection.tsx
- [x] components/analysis/sections/DistributionSection.tsx
- [x] components/analysis/sections/ContentSection.tsx
- [x] components/analysis/sections/BrandSection.tsx
- [x] components/analysis/sections/ScaleSection.tsx
- [x] components/analysis/sections/ProductSection.tsx
- [x] components/analysis/sections/SynthesisSection.tsx

### 3.4 — Shared Components
- [x] components/shared/ScoreBadge.tsx
- [x] components/shared/CopyButton.tsx
- [x] components/shared/SourceCitation.tsx
- [x] components/shared/ConfidenceBadge.tsx
- [x] components/shared/SectionSkeleton.tsx

**Milestone: Full analysis report renders all 13 sections** ✅

---

## Phase 4 — Monetization (Weekend 6)
Status: COMPLETE

### 4.1 — Lemon Squeezy Integration
- [x] Create LS account and products (Pro $29, Premium $79)
- [x] app/api/webhook/ls/route.ts (webhook handler)
- [x] Credit update after payment
- [x] app/(app)/settings/billing/page.tsx

### 4.2 — Pricing Page
- [x] app/(public)/pricing/page.tsx (3 plan cards + FAQ)

### 4.3 — Credit System UI
- [x] Credit badge in AppNavbar
- [x] Upgrade modal when credits = 0
- [x] Credit history in billing page

**Milestone: User can pay $29 and get Pro access** ✅

---

## Phase 5 — Content & Launch (Weekend 7)
Status: NOT STARTED

### 5.1 — Blog System
- [ ] app/(public)/blog/page.tsx (list)
- [ ] app/(public)/blog/[slug]/page.tsx (MDX post)
- [ ] First 3 posts written

### 5.2 — Supporting Pages
- [ ] app/(public)/about/page.tsx
- [ ] app/(public)/changelog/page.tsx
- [ ] app/(public)/terms/page.tsx
- [ ] app/(public)/privacy/page.tsx
- [ ] app/(app)/settings/page.tsx

### 5.3 — SEO + PWA
- [ ] Open Graph meta tags in layout.tsx
- [ ] public/sitemap.xml
- [ ] public/robots.txt
- [ ] public/manifest.json
- [ ] public/icons/icon-192.png + icon-512.png

**Milestone: ValiSearch is live and publicly announced**

---

## Phase 6 — RAG Knowledge Base (Month 2)
Status: NOT STARTED

### 6.1 — Data Collection
- [ ] Collect Indie Hackers interviews (public)
- [ ] Collect HN Show HN posts via Algolia API
- [ ] Download Product Hunt data (GraphQL API)
- [ ] Collect World Bank open data
- [ ] Process and clean all data

### 6.2 — Vector Indexing
- [ ] Enable pgvector in Supabase
- [ ] Generate embeddings via Gemini API
- [ ] Index all collected data into knowledge_base table

### 6.3 — Agent Integration
- [ ] Add RAG retrieval to Market Researcher agent
- [ ] Add RAG retrieval to Competitor Intel agent
- [ ] Add RAG retrieval to Problem Prioritizer agent
- [ ] Show retrieved sources in UI with citations

**Milestone: Reports cite real case studies and market data**

---

## Current Blockers
None — starting from scratch.

## Next Action
Initialize Next.js 15 project with all dependencies.
Run Phase 0 initialization commands.
