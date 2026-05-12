# VALISEARCH 2.0 — COMPLETE SYSTEM GUIDE

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [AI Agents](#ai-agents)
6. [Build & Run](#build--run)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Maintenance](#maintenance)

---

## 1. SYSTEM OVERVIEW

**ValiSearch 2.0** is an agentic startup intelligence platform that helps entrepreneurs validate their startup ideas using 12 parallel AI agents. All 12 agents complete in under 90 seconds.

**Version:** 2.0.0
**Build Status:** ✅ PASSING (0 errors, 30 routes)
**Git Status:** ✅ Pushed to main

---

## 2. FEATURES

### Core Features (27 total)

| # | Feature | Status |
|---|---------|--------|
| 1 | 12 AI Agents (parallel) | ✅ |
| 2 | Idea Validation (6 dimensions) | ✅ |
| 3 | Market Research (Jina/Serper) | ✅ |
| 4 | Competitor Intelligence | ✅ |
| 5 | Problem Prioritization (Reddit/HN) | ✅ |
| 6 | MVP Design | ✅ |
| 7 | Value Proposition | ✅ |
| 8 | Growth Planning | ✅ |
| 9 | Distribution Strategy | ✅ |
| 10 | Content Strategy | ✅ |
| 11 | Brand Development | ✅ |
| 12 | Scale Roadmap | ✅ |
| 13 | Multi-Project Workspaces | ✅ |
| 14 | Kanban Task Board | ✅ |
| 15 | AI Co-founder Chat | ✅ |
| 16 | Visual Flow Diagrams | ✅ |
| 17 | Startup Health Scores | ✅ |
| 18 | Version History | ✅ |
| 19 | Strategic Reports | ✅ |
| 20 | Market Insights | ✅ |
| 21 | Comparison Engine | ✅ |
| 22 | RAG Knowledge Base | ✅ |
| 23 | Credit System | ✅ |
| 24 | 4 Payment Gateways | ✅ |
| 25 | Real-time Collaboration | ✅ |
| 26 | Activity Logging | ✅ |
| 27 | Health Check API | ✅ |

---

## 3. TECH STACK

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Edge Functions | Supabase Edge Functions |
| Vector Search | pgvector |
| AI Gateway | OpenRouter |
| Web Search | Jina AI, Serper.dev |
| Background Jobs | Trigger.dev |
| Payments | Lemon Squeezy, Stripe, Flutterwave, Paystack |
| Deployment | Cloudflare Pages |

---

## 4. DATABASE SCHEMA

### Tables (23 total)

```
Core Tables:
├── profiles           — User accounts
├── credits            — Credit balance
├── credit_transactions — Credit history
├── ideas              — Startup ideas
├── analysis            — AI analysis results
├── analysis_progress  — Real-time progress
├── subscriptions       — Payment subscriptions
└── knowledge_base      — RAG vector store

Workspace Tables:
├── workspaces           — Multi-project
├── workspace_members     — Team collaboration
├── roadmaps            — Execution plans
├── milestones          — Roadmap items
├── tasks               — Kanban tasks
├── startup_versions    — Version snapshots
├── founder_notes       — Notes
├── startup_flows       — Visual flows
├── health_scores       — Health tracking
├── strategic_reports   — Investor reports
├── comparison_sessions — Competitor comparison
├── market_insights     — Market data
├── ai_chat_sessions    — Chat history
├── ai_chat_messages    — Chat messages
└── activity_logs       — Activity tracking
```

### Security
- RLS (Row Level Security): ✅ Enabled on ALL tables
- Extensions: ✅ pgvector installed

---

## 5. AI AGENTS

### 12 Agents Running in Parallel

| # | Agent | File | Purpose |
|---|-------|------|---------|
| 1 | Idea Validator | idea-validator.ts | Score idea on 6 dimensions |
| 2 | Market Researcher | market-researcher.ts | TAM/SAM/SOM research |
| 3 | Competitor Intel | competitor-intel.ts | Find real competitors |
| 4 | Problem Prioritizer | problem-prioritizer.ts | Validate pain points |
| 5 | Product Manager | product-manager.ts | MVP features + roadmap |
| 6 | Offer Architect | offer-architect.ts | Value prop + pricing |
| 7 | Growth Strategist | growth-strategist.ts | Growth channels |
| 8 | Distribution Planner | distribution-planner.ts | Launch strategy |
| 9 | Content Creator | content-creator.ts | Content hooks |
| 10 | Brand Namer | brand-namer.ts | Names + voice |
| 11 | Scale Architect | scale-architect.ts | $10K MRR roadmap |
| 12 | Synthesis | synthesis.ts | Final report (Claude) |

### Tools (10 total)
- jina.ts — Web search & URL reading
- openrouter.ts — AI model calls
- reddit.ts — Reddit API
- hackernews.ts — Hacker News
- rag.ts — Knowledge base
- langsmith.ts — Tracing (NEW)
- retry-graph.ts — Retry logic (NEW)
- serper.ts — Google search (NEW)
- firecrawl.ts — Web scraping (NEW)
- financial.ts — Market data (NEW)
- finnhub.ts — Financial signals (NEW)

---

## 6. BUILD & RUN

### Development
```bash
npm run dev
# Opens http://localhost:3000
```

### Production Build
```bash
npm run build
# Output: 30 routes, 0 errors
```

### TypeScript Check
```bash
npm run typecheck
# Must pass with 0 errors
```

---

## 7. DEPLOYMENT

### Cloudflare Pages (Recommended)

#### Step 1: Configure wrangler.toml
```toml
name = "valisearch"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
main = ".worker-next/index.mjs"
assets = { directory = ".worker-next/assets" }

[vars]
NEXT_PUBLIC_SUPABASE_URL = ""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = ""
NEXT_PUBLIC_APP_URL = "https://valisearch.pages.dev"
```

#### Step 2: Build and Deploy
```bash
npm run build
npx @cloudflare/next-on-pages
# OR use GitHub integration
```

#### Step 3: Set Secrets
```bash
wrangler secret put OPENROUTER_API_KEY
wrangler secret put JINA_API_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Supabase Setup

#### Step 1: Link Project
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

#### Step 2: Push Migrations
```bash
npx supabase db push
```

#### Step 3: Set Secrets
```bash
npx supabase secrets set OPENROUTER_API_KEY=your-key
npx supabase secrets set JINA_API_KEY=your-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

#### Step 4: Deploy Edge Functions
```bash
npx supabase functions deploy ping
npx supabase functions deploy rag
```

### Auth Configuration

In Supabase Dashboard:
1. **Authentication → Settings → SMTP**
   - Host: smtp.resend.com
   - Port: 587
   - Username: resend
   - Password: YOUR_RESEND_API_KEY

2. **Authentication → URL Configuration**
   - Site URL: https://your-domain.com
   - Redirect URLs:
     - https://your-domain.com/auth/callback
     - https://*.pages.dev/auth/callback
     - http://localhost:3000/auth/callback

---

## 8. TESTING

### Test Health Endpoint
```bash
curl https://your-domain.com/api/health
# Expected: {"status":"ok",...}
```

### Test Login
1. Go to /login
2. Try registering a new account
3. Check email for confirmation

### Test AI Analysis
1. Log in
2. Enter a startup idea
3. Click analyze
4. Watch 12 agents run in parallel

### Test Payment (Test Mode)
- Stripe: 4242 4242 4242 4242
- Flutterwave: 5531886652145650
- Paystack: 5060666666666666666

---

## 9. MAINTENANCE

### Regular Tasks

1. **Monitor Logs**
   - Supabase: Dashboard → Logs
   - Cloudflare: Workers & Pages → Functions → Logs

2. **Check Credits**
   - Free tier pauses after 7 days
   - Use regularly or upgrade

3. **Update Dependencies**
   ```bash
   npm update
   npm run build
   ```

4. **Backup Database**
   - Supabase provides automatic backups
   - For self-hosted, configure manual backups

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Project paused | Resume in Supabase dashboard |
| RLS errors | Check auth.uid() policies |
| Build fails | Check TypeScript errors |
| Webhook fails | Verify signature + URL |
| Edge timeout | Use Trigger.dev |

---

## QUICK START COMMANDS

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Deploy to Cloudflare
npm run cf:deploy

# Push Supabase migrations
npx supabase db push

# Deploy edge functions
npx supabase functions deploy --all

# Set secrets
npx supabase secrets set KEY=value
```

---

## FILES CREATED

| File | Purpose |
|------|---------|
| wrangler.toml | Cloudflare deployment config |
| trigger.config.ts | Trigger.dev config |
| agents/tools/*.ts | 10 AI tools |
| agents/agents/*.ts | 12 AI agents |
| public/_redirects | SPA fallback |
| public/_headers | Security headers |
| .env.example | All environment variables |

---

## GIT STATUS

```
Commits:
- aa6dd5f: Phase 2 - Add 6 new intelligence tools
- 4c4fdab: Phase 1 deployment fixes
- 53acb32: Storage configuration
- 8c740c8: Deployment guides

Status: All pushed to main
```

---

## SUPPORT

For issues:
1. Check /api/health endpoint
2. Review Supabase logs
3. Review Cloudflare logs
4. Check GitHub issues

---

*ValiSearch 2.0 - Agentic Startup Intelligence Platform*
*Built with Next.js 16, Supabase, and 12 AI Agents*