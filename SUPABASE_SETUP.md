# VALISEARCH - SUPABASE SETUP GUIDE

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com
2. Login to your account
3. Open your project "MY VALISEARCH"
4. Go to Project Settings > API
5. Copy:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon public** key (Project API keys section)
   - **service_role** key (DO NOT share, keep secret)

## Step 2: Update .env.local

Edit `.env.local` in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Run Database Migrations

In your project terminal, run:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations
npx supabase db push
```

## Step 4: Set Edge Function Secrets

```bash
# Set required secrets
npx supabase secrets set OPENROUTER_API_KEY=your-openrouter-key
npx supabase secrets set JINA_API_KEY=your-jina-key
npx supabase secrets set LEMON_SQUEEZY_SECRET=your-ls-secret
npx supabase secrets set STRIPE_SECRET_KEY=your-stripe-key
npx supabase secrets set STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
npx supabase secrets set FLUTTERWAVE_SECRET_KEY=your-fw-key
npx supabase secrets set PAYSTACK_SECRET_KEY=your-ps-key
```

## Step 5: Verify Database Tables

Run this SQL in Supabase SQL Editor to verify:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- profiles
- credits
- credit_transactions
- ideas
- analysis
- analysis_progress
- subscriptions
- knowledge_base
- workspaces
- workspace_members
- roadmaps
- milestones
- tasks
- startup_versions
- founder_notes
- startup_flows
- health_scores
- strategic_reports
- comparison_sessions
- market_insights
- ai_chat_sessions
- ai_chat_messages
- activity_logs

## Step 6: Verify RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have rowsecurity = true

## Step 7: Start Development Server

```bash
npm run dev
```

## Database Schema Overview

### Core Tables (Phase 0-4)
- profiles: User accounts
- credits: Credit system
- ideas: Startup ideas
- analysis: AI analysis results
- subscriptions: Payment subscriptions

### Expansion Tables (Phase 7)
- workspaces: Multi-project support
- workspace_members: Collaboration
- roadmaps: Execution planning
- tasks: Kanban board
- startup_versions: Version history
- startup_flows: Visual diagrams
- health_scores: Startup health
- strategic_reports: Investor materials
- ai_chat_sessions: AI co-founder
- market_insights: Market intelligence