# VALISEARCH 2.0 - COMPREHENSIVE SYSTEM REPORT

## Table of Contents
1. [App Overview](#app-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Pages & Routes](#pages--routes)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [AI Agents](#ai-agents)
8. [Payment Integration](#payment-integration)
9. [Deployment Guides](#deployment-guides)

---

## APP OVERVIEW

**Name:** ValiSearch 2.0  
**Tagline:** Agentic Startup Intelligence Platform  
**Version:** 2.0.0  
**Built:** 2026  
**Founder:** Abdul Anas  
**Tech Stack:**
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui
- Supabase (DB, Auth, Edge Functions, Realtime)
- OpenRouter (AI model gateway)
- Jina AI (web search)

**Key Constraints:**
- Light theme only (no dark mode)
- No emojis in UI
- No gradients
- Zero `any` types
- No AI calls from browser (all via Edge Functions)
- All secrets in Edge Functions only

---

## ARCHITECTURE

### System Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     VALISEARCH 2.0                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Browser   │───▶│  Next.js 16  │───▶│  Supabase   │    │
│  │   (Client)  │    │   (Server)   │    │  (Backend)  │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                  │                  │           │
│         │           ┌──────┴──────┐          │           │
│         │           │             │          │           │
│         │     ┌─────▼─────┐  ┌─────▼─────┐    │           │
│         │     │  API      │  │ Edge     │    │           │
│         │     │  Routes   │  │Functions │    │           │
│         │     └───────────┘  └──────────┘    │           │
│         │                                    │           │
│         │     ┌─────────────────────────┐   │           │
│         │     │     12 AI AGENTS        │   │           │
│         │     │  (Promise.allSettled)   │   │           │
│         │     └─────────────────────────┘   │           │
│         │                                    │           │
│         ▼                                    ▼           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   EXTERNAL APIS                      │ │
│  │  OpenRouter │ Jina AI │ Stripe │ Lemon Squeezy │    │ │
│  │  Paystack  │ Flutterwave │ Resend                 │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Execution Flow
1. User submits startup idea
2. API creates analysis record in database
3. 12 AI agents run in parallel (Promise.allSettled)
4. All 12 complete → Synthesis agent runs
5. Results stored in analysis.result_json
6. Dashboard renders 13 sections

---

## FEATURES

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **12 AI Agents** | Parallel agents for startup validation | ✅ |
| **Idea Validation** | Score idea across 6 dimensions | ✅ |
| **Market Research** | Research market size & trends | ✅ |
| **Competitor Analysis** | Find and analyze competitors | ✅ |
| **Problem Validation** | Validate pain points via Reddit/HN | ✅ |
| **MVP Design** | Product manager agent | ✅ |
| **Value Proposition** | Offer architect agent | ✅ |
| **Growth Planning** | Growth strategist agent | ✅ |
| **Distribution Strategy** | Distribution planner agent | ✅ |
| **Content Strategy** | Content creator agent | ✅ |
| **Brand Development** | Brand namer agent | ✅ |
| **Scale Roadmap** | Scale architect agent | ✅ |
| **Multi-Project** | Multiple workspaces | ✅ |
| **Kanban Board** | Task management | ✅ |
| **AI Co-founder** | Chat with AI about your startup | ✅ |
| **Visual Flows** | Flow diagram builder | ✅ |
| **Health Scores** | Startup health tracking | ✅ |
| **Version History** | Track changes over time | ✅ |
| **Strategic Reports** | Generate investor materials | ✅ |
| **Market Insights** | Real-time market data | ✅ |
| **Comparison Engine** | Compare with competitors | ✅ |
| **RAG Knowledge Base** | Private knowledge base | ✅ |
| **4 Payment Gateways** | LS, Stripe, Flutterwave, Paystack | ✅ |
| **Credit System** | Pay-per-analysis | ✅ |

---

## PAGES & ROUTES

### Total: 40 Routes

#### Public Pages (8)
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page |
| `/about` | `app/about/page.tsx` | About page |
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post |
| `/changelog` | `app/changelog/page.tsx` | Version history |
| `/pricing` | `app/pricing/page.tsx` | Pricing page |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |

#### Auth Pages (6)
| Route | File | Description |
|-------|------|-------------|
| `/login` | `app/login/page.tsx` | Login form |
| `/register` | `app/register/page.tsx` | Registration form |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password reset |
| `/onboarding` | `app/onboarding/page.tsx` | New user setup |
| `/auth/callback` | `app/auth/callback/route.ts` | Auth callback |

#### Workspace Pages (3)
| Route | File | Description |
|-------|------|-------------|
| `/workspace` | `app/workspace/page.tsx` | Workspace list |
| `/workspace/[id]` | `app/workspace/[id]/page.tsx` | Workspace detail |
| `/workspace/new` | `app/workspace/new/page.tsx` | Create workspace |

#### Dashboard Pages (5)
| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Main dashboard |
| `/dashboard/tasks` | `app/(app)/dashboard/tasks/page.tsx` | Kanban board |
| `/dashboard/chat` | `app/(app)/dashboard/chat/page.tsx` | AI co-founder |
| `/dashboard/flows` | `app/(app)/dashboard/flows/page.tsx` | Flow diagrams |
| `/dashboard/health` | `app/(app)/dashboard/health/page.tsx` | Health scores |

#### Settings Pages (2)
| Route | File | Description |
|-------|------|-------------|
| `/settings` | `app/settings/page.tsx` | User settings |
| `/settings/billing` | `app/settings/billing/page.tsx` | Billing & subscription |

#### API Routes (21)
| Route | File | Methods |
|-------|------|---------|
| `/api/analyze` | `app/api/analyze/route.ts` | POST |
| `/api/chat` | `app/api/chat/route.ts` | POST |
| `/api/checkout` | `app/api/checkout/route.ts` | POST |
| `/api/compare` | `app/api/compare/route.ts` | POST |
| `/api/health` | `app/api/health/route.ts` | GET, HEAD |
| `/api/market-insights` | `app/api/market-insights/route.ts` | GET |
| `/api/workspaces` | `app/api/workspaces/route.ts` | GET, POST |
| `/api/workspaces/[id]` | `app/api/workspaces/[id]/route.ts` | GET, PUT, DELETE |
| `/api/workspaces/[id]/tasks` | `app/api/workspaces/[id]/tasks/route.ts` | GET, POST |
| `/api/workspaces/[id]/tasks/[taskId]` | `app/api/workspaces/[id]/tasks/[taskId]/route.ts` | PUT, DELETE |
| `/api/workspaces/[id]/flows` | `app/api/workspaces/[id]/flows/route.ts` | GET, POST |
| `/api/workspaces/[id]/flows/[flowId]` | `app/api/workspaces/[id]/flows/[flowId]/route.ts` | PUT, DELETE |
| `/api/workspaces/[id]/health` | `app/api/workspaces/[id]/health/route.ts` | GET, POST |
| `/api/workspaces/[id]/roadmap` | `app/api/workspaces/[id]/roadmap/route.ts` | GET, POST |
| `/api/workspaces/[id]/versions` | `app/api/workspaces/[id]/versions/route.ts` | GET, POST |
| `/api/workspaces/[id]/members` | `app/api/workspaces/[id]/members/route.ts` | GET, POST |
| `/api/workspaces/[id]/reports` | `app/api/workspaces/[id]/reports/route.ts` | POST |
| `/api/webhook/stripe` | `app/api/webhook/stripe/route.ts` | POST |
| `/api/webhook/ls` | `app/api/webhook/ls/route.ts` | POST |
| `/api/webhook/paystack` | `app/api/webhook/paystack/route.ts` | POST |
| `/api/webhook/flutterwave` | `app/api/webhook/flutterwave/route.ts` | POST |

---

## DATABASE SCHEMA

### Tables (25+)

#### Core Tables (Phase 0-4)
```sql
-- Users and Auth
profiles (id, email, full_name, avatar_url, created_at)

-- Credit System
credits (id, user_id, balance, created_at, updated_at)
credit_transactions (id, user_id, amount, type, description, created_at)

-- Ideas and Analysis
ideas (id, user_id, title, description, status, created_at)
analysis (id, idea_id, result_json, status, created_at, completed_at)
analysis_progress (id, analysis_id, agent, status, progress, started_at, completed_at)

-- Subscriptions
subscriptions (id, user_id, gateway, status, plan, stripe_subscription_id, ls_subscription_id, created_at, current_period_end)

-- Knowledge Base
knowledge_base (id, user_id, title, content, embedding, created_at)
```

#### Expansion Tables (Phase 7)
```sql
-- Workspaces
workspaces (id, user_id, name, description, industry, created_at, updated_at)
workspace_members (id, workspace_id, user_id, role, created_at)

-- Roadmap
roadmaps (id, workspace_id, title, created_at, updated_at)
milestones (id, roadmap_id, title, description, target_date, status, order_index)

-- Tasks (Kanban)
tasks (id, workspace_id, title, description, status, priority, due_date, order_index, created_at, updated_at)

-- Version History
startup_versions (id, workspace_id, version, snapshot_json, created_at)

-- Notes
founder_notes (id, workspace_id, title, content, created_at, updated_at)

-- Visual Flows
startup_flows (id, workspace_id, name, flow_data_json, created_at, updated_at)

-- Health Scores
health_scores (id, workspace_id, score, metrics_json, created_at)

-- Reports
strategic_reports (id, workspace_id, type, title, content_json, created_at)

-- Comparison
comparison_sessions (id, user_id, competitor_name, analysis_json, created_at)

-- Market Insights
market_insights (id, workspace_id, insight_type, data_json, created_at)

-- AI Chat
ai_chat_sessions (id, workspace_id, title, created_at)
ai_chat_messages (id, session_id, role, content, created_at)

-- Activity
activity_logs (id, workspace_id, user_id, action, data_json, created_at)
```

---

## AI AGENTS

### Agent Architecture
```typescript
// 3 agents search the live web for real data
- Market Researcher Agent
- Competitor Intel Agent  
- Problem Prioritizer Agent

// 8 agents perform deep analytical reasoning
- Idea Validator Agent
- Product Manager Agent
- Offer Architect Agent
- Growth Strategist Agent
- Distribution Planner Agent
- Content Creator Agent
- Brand Namer Agent
- Scale Architect Agent

// 1 agent synthesizes everything into a final report
- Synthesis Agent (always Claude Sonnet)
```

### Agent Outputs (TypeScript Interfaces)
```typescript
interface IdeaValidatorOutput {
  clarity: number;      // 0-100
  feasibility: number;
  marketFit: number;
  scalability: number;
  timing: number;
  differentiation: number;
  summary: string;
  strengths: string[];
  concerns: string[];
}

interface MarketResearcherOutput {
  marketSize: string;
  growthRate: string;
  keyTrends: string[];
  opportunities: string[];
  threats: string[];
}

interface CompetitorIntelOutput {
  competitors: Competitor[];
  marketPosition: string;
  gaps: string[];
}

interface ProductManagerOutput {
  mvpFeatures: Feature[];
  roadmap: Phase[];
  technicalRequirements: string[];
}

interface SynthesisOutput {
  overallScore: number;      // 0-100
  verdict: 'strong' | 'weak' | 'mixed';
  executiveSummary: string;
  topStrengths: string[];
  topRisks: string[];
  nextSteps: string[];
}
```

---

## PAYMENT INTEGRATION

### 4 Payment Gateways

| Gateway | Purpose | Webhook |
|---------|---------|---------|
| Lemon Squeezy | International payments | `/api/webhook/ls` |
| Stripe | International cards | `/api/webhook/stripe` |
| Flutterwave | Africa (cards, mobile) | `/api/webhook/flutterwave` |
| Paystack | Nigeria (cards, bank) | `/api/webhook/paystack` |

### Checkout Flow
```typescript
POST /api/checkout
{
  gateway: 'stripe' | 'ls' | 'flutterwave' | 'paystack',
  plan: 'pro' | 'premium',
  userId: 'user-uuid'
}
```

---

## DEPLOYMENT GUIDES

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deploy to Vercel](#deploy-to-vercel)
3. [Deploy to Cloudflare](#deploy-to-cloudflare)
4. [Deploy to Coolify (VPS)](#deploy-to-coolify-vps)
5. [Post-Deployment Checklist](#post-deployment-checklist)
6. [Testing Guide](#testing-guide)

---

## PREREQUISITES

Before deploying, ensure you have:

1. **Supabase Project Ready**
   - Create project at https://supabase.com
   - Get Project URL, anon key, service role key

2. **API Keys Ready**
   - OpenRouter API key (https://openrouter.ai)
   - Jina AI API key (https://jina.ai)
   - Payment gateway keys (Stripe, Lemon Squeezy, etc.)

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=anon-key
   SUPABASE_SERVICE_ROLE_KEY=service-role-key
   OPENROUTER_API_KEY=your-key
   JINA_API_KEY=your-key
   ```

---

## DEPLOY TO VERCEL

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub
4. Select your VALISEARCH repo

### Step 3: Configure Environment
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=anon-key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
3. Add secret variables (for Edge Functions):
   ```
   SUPABASE_SERVICE_ROLE_KEY=service-role-key
   OPENROUTER_API_KEY=your-key
   JINA_API_KEY=your-key
   ```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build (2-5 minutes)
3. Get your URL: `https://valisearch.vercel.app`

### Step 5: Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push database migrations
npx supabase db push

# Set Edge Function secrets
npx supabase secrets set OPENROUTER_API_KEY=your-key
npx supabase secrets set JINA_API_KEY=your-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

### Step 6: Verify Deployment
- Visit your Vercel URL
- Try logging in
- Run a test analysis
- Check `/api/health` returns 200

---

## DEPLOY TO CLOUDFLARE (MAIN PLATFORM)

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Configure wrangler.toml
Create `wrangler.toml` in project root:
```toml
name = "valisearch"
compatibility_date = "2024-07-01"
compatibility_flags = ["nodejs_compat"]

[vars]
NEXT_PUBLIC_SUPABASE_URL = "https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon-key"
NEXT_PUBLIC_APP_URL = "https://your-app.pages.dev"

[env.production]
vars = { NEXT_PUBLIC_APP_URL = "https://your-domain.com" }

[env.staging]
vars = { NEXT_PUBLIC_APP_URL = "https://staging.your-domain.com" }

# Secrets (set via CLI, not in file)
# wrangler secret put OPENROUTER_API_KEY
# wrangler secret put JINA_API_KEY
# wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Set Secrets
```bash
wrangler secret put OPENROUTER_API_KEY
# Enter your API key when prompted

wrangler secret put JINA_API_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Step 4: Build with Cloudflare Adapter
Install the adapter:
```bash
npm install @cloudflare/next-on-pages
```

Update `next.config.ts`:
```typescript
import { createNextjsAdapter } from '@cloudflare/next-on-pages/config'

const nextConfig = {
  // your existing config
}

export default createNextjsAdapter(nextConfig)
```

Update `package.json`:
```json
{
  "scripts": {
    "build": "next build",
    "deploy": "npm run build && npx @cloudflare/next-on-pages"
  }
}
```

### Step 5: Deploy
```bash
npm run deploy
```

Or via GitHub integration:
1. Go to Cloudflare Dashboard
2. Create new Pages project
3. Connect GitHub repo
4. Build command: `npm run build`
5. Output directory: `.next`

### Step 6: Configure Supabase
```bash
# Link to project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push

# Set secrets
npx supabase secrets set OPENROUTER_API_KEY=your-key
npx supabase secrets set JINA_API_KEY=your-key
```

### Step 7: Add Custom Domain (Optional)
1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Custom domains"
3. Add your domain
4. Update DNS at your registrar

### Step 8: Test
- Visit your Cloudflare URL
- Check `/api/health`
- Test login and analysis

---

## DEPLOY TO COOLIFY (VPS)

### Step 1: Prepare Server
1. Get a VPS (Ubuntu 20.04+) with at least 2GB RAM
2. Install Coolify via:
```bash
# SSH into your server
ssh root@your-server-ip

# Run Coolify installer
curl -fsSL https://get.coolify.io | bash
```

### Step 2: Access Coolify
1. Visit `https://your-server-ip:8000`
2. Create admin account
3. Configure your first project

### Step 3: Add Git Repository
1. Click "Create New Resource"
2. Select "Git Repository"
3. Enter:
   - Repository: `https://github.com/abdulanasbuilds/VALISEARCH`
   - Branch: `main`
   - Build Pack: `npm` (or auto-detect)

### Step 4: Configure Environment
In Coolify resource settings:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
SUPABASE_SERVICE_ROLE_KEY=service-role-key
OPENROUTER_API_KEY=your-key
JINA_API_KEY=your-key
```

### Step 5: Configure Build
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: `3000`

### Step 6: Deploy
1. Click "Deploy"
2. Watch logs for errors
3. Get your URL from Coolify

### Step 7: Setup Database
Since Supabase is external:
1. Keep using Supabase cloud
2. Or deploy Supabase self-hosted on Coolify (advanced)

### Step 8: Configure Domain
1. In Coolify resource → Domain
2. Add your domain
3. Configure DNS at registrar

### Step 9: Test
- Visit your deployed URL
- Test all features
- Check logs for errors

---

## POST-DEPLOYMENT CHECKLIST

### Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set
- [ ] NEXT_PUBLIC_APP_URL set
- [ ] SUPABASE_SERVICE_ROLE_KEY set (in Edge Functions)
- [ ] OPENROUTER_API_KEY set
- [ ] JINA_API_KEY set
- [ ] Payment gateway secrets set

### Database
- [ ] All migrations applied (`npx supabase db push`)
- [ ] RLS policies enabled on all tables
- [ ] Supabase project is not paused

### Functionality
- [ ] Login/Register works
- [ ] AI analysis runs successfully
- [ ] Dashboard loads
- [ ] Payments process correctly
- [ ] Webhooks receive events

### Monitoring
- [ ] Health check returns 200: `/api/health`
- [ ] No critical errors in logs
- [ ] Edge Functions deployed

---

## TESTING GUIDE

### 1. Health Check
```bash
curl https://your-domain.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### 2. Login Flow
1. Visit `/login`
2. Try registering a new account
3. Verify email (if email auth enabled)
4. Check redirect to dashboard

### 3. AI Analysis Test
1. Go to dashboard
2. Enter a startup idea: "AI-powered meal planning app"
3. Click analyze
4. Wait for 12 agents to complete
5. Verify 13 sections appear in results

### 4. Payment Test
1. Go to `/pricing`
2. Select a gateway
3. Use test card:
   - Stripe: `4242 4242 4242 4242`
   - Flutterwave: `5531886652145650`
   - Paystack: `5060666666666666666`
4. Verify credit added to account

### 5. Webhook Test
```bash
# Test Stripe webhook
curl -X POST https://your-domain.com/api/webhook/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test-signature" \
  -d '{"type":"checkout.session.completed","data":{"object":{"id":"test"}}}'
```

### 6. API Tests
```bash
# Test workspaces API
curl -H "Authorization: Bearer YOUR_JWT" \
  https://your-domain.com/api/workspaces

# Test chat API
curl -X POST -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"workspaceId":"xxx","message":"Hello AI"}' \
  https://your-domain.com/api/chat
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Project is paused"
**Solution:** In Supabase dashboard, click "Resume project" or upgrade to paid tier.

### Issue: "Connection refused"
**Solution:** Check Supabase project URL is correct and project is not paused.

### Issue: "RLS policy denied"
**Solution:** Verify RLS policies allow the operation or user is authenticated.

### Issue: "Edge Function not found"
**Solution:** Deploy edge functions with `npx supabase functions deploy`.

### Issue: "Build failed on deployment"
**Solution:** Check build logs, ensure all dependencies are in package.json.

### Issue: "Webhooks not working"
**Solution:** Verify webhook URL is publicly accessible and signed correctly.

---

## SUPPORT

For issues or questions:
- Check `/api/health` for system status
- Review Supabase logs: Dashboard → Logs
- Review Edge Function logs: Dashboard → Edge Functions → Logs

---

## QUICK START COMMANDS

```bash
# Development
npm run dev

# Build
npm run build

# TypeScript check
npm run typecheck

# Lint
npm run lint

# Deploy to Vercel
vercel deploy --prod

# Deploy to Cloudflare
npm run deploy

# Push Supabase migrations
npx supabase db push

# Set Supabase secrets
npx supabase secrets set OPENROUTER_API_KEY=your-key
```

---

*Last Updated: May 2026*
*Version: 2.0.0*
*ValiSearch - Agentic Startup Intelligence Platform*