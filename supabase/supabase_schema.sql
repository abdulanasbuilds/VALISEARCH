-- ============================================================
-- VALISEARCH 2.0 - UNIFIED DATABASE SCHEMA SETUP
-- Run this script in the Supabase SQL Editor to initialize your DB!
-- WARNING: This will drop existing public tables and create a fresh layout.
-- ============================================================

-- 1. Clean out any existing half-built structures
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.ai_chat_messages CASCADE;
DROP TABLE IF EXISTS public.ai_chat_sessions CASCADE;
DROP TABLE IF EXISTS public.market_insights CASCADE;
DROP TABLE IF EXISTS public.comparison_sessions CASCADE;
DROP TABLE IF EXISTS public.strategic_reports CASCADE;
DROP TABLE IF EXISTS public.health_scores CASCADE;
DROP TABLE IF EXISTS public.startup_flows CASCADE;
DROP TABLE IF EXISTS public.founder_notes CASCADE;
DROP TABLE IF EXISTS public.startup_versions CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.roadmaps CASCADE;
DROP TABLE IF EXISTS public.workspace_members CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;
DROP TABLE IF EXISTS public.knowledge_base CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.analysis_progress CASCADE;
DROP TABLE IF EXISTS public.analysis CASCADE;
DROP TABLE IF EXISTS public.ideas CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.credits CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- ============================================================
-- 3. CREATE TABLES (PRISTINE FRESH STATE)
-- ============================================================

-- Profiles Table (holds user detail mappings)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credits Table (tracks user AI credits balance)
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 6,
  lifetime_used INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit Transaction History
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  analysis_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ideas Table
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  idea_text TEXT NOT NULL,
  title TEXT,
  category TEXT,
  word_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analysis Table (holds LLM analysis reports)
CREATE TABLE public.analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  analysis_type TEXT NOT NULL DEFAULT 'full',
  overall_score INTEGER,
  result_json JSONB,
  agent_logs JSONB,
  data_sources JSONB,
  credits_used INTEGER NOT NULL DEFAULT 2,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analysis Progress (tracks each agent state in real-time)
CREATE TABLE public.analysis_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.analysis(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Subscriptions Table (for Lemon Squeezy integration)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  ls_customer_id TEXT,
  ls_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RAG Knowledge Base Table (for vector similarity search)
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL DEFAULT 'web',
  source_name TEXT NOT NULL DEFAULT 'rag_entry',
  source_url TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_vector vector(768),
  embedding vector(1536),
  source TEXT,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspaces (multi-project startup support)
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  stage TEXT NOT NULL DEFAULT 'idea',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace Members Table
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Roadmaps Table
CREATE TABLE public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_phase TEXT DEFAULT 'idea',
  completion_percentage INTEGER DEFAULT 0,
  launch_readiness INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Milestones Table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  completion_percentage INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks Table (Kanban Board)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'product',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  phase TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Startup Iteration Versions
CREATE TABLE public.startup_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  idea_text TEXT NOT NULL,
  changes_summary TEXT,
  pivot_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Founder Strategic Notes
CREATE TABLE public.founder_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'strategic',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Startup Flows (Interactive user journeys / logic boards)
CREATE TABLE public.startup_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  flow_type TEXT DEFAULT 'user_journey',
  nodes JSONB DEFAULT '[]',
  connections JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Health Scores History
CREATE TABLE public.health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  validation_strength INTEGER,
  differentiation INTEGER,
  monetization_readiness INTEGER,
  technical_feasibility INTEGER,
  market_opportunity INTEGER,
  execution_progress INTEGER,
  overall_score INTEGER,
  risks JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strategic Investor Pitch Reports
CREATE TABLE public.strategic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Comparison Sessions
CREATE TABLE public.comparison_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace_ids UUID[] NOT NULL,
  comparison_type TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Market Trends & Insights
CREATE TABLE public.market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  trends JSONB DEFAULT '[]',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Cofounder Chat Sessions
CREATE TABLE public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace Activity Logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. CREATE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_idea_id ON analysis(idea_id);
CREATE INDEX IF NOT EXISTS idx_analysis_status ON analysis(status);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_progress_analysis_id ON analysis_progress(analysis_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ls_customer_id ON subscriptions(ls_customer_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

-- Expansion Indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_archived ON workspaces(is_archived);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_workspace ON roadmaps(workspace_id);
CREATE INDEX IF NOT EXISTS idx_milestones_roadmap ON milestones(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_roadmap ON tasks(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_startup_versions_workspace ON startup_versions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_founder_notes_workspace ON founder_notes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_startup_flows_workspace ON startup_flows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_workspace ON health_scores(workspace_id);
CREATE INDEX IF NOT EXISTS idx_strategic_reports_workspace ON strategic_reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_comparison_sessions_user ON comparison_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_market_insights_category ON market_insights(category);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_workspace ON ai_chat_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON activity_logs(workspace_id);

-- Vector Indexes (Lists = 100 for cosine ops query optimizations)
CREATE INDEX IF NOT EXISTS idx_knowledge_base_vector 
ON knowledge_base 
USING ivfflat (content_vector vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_source 
ON knowledge_base(source_type);

-- ============================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Profiles
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Credits
CREATE POLICY "Users can read own credits" ON credits FOR SELECT USING (auth.uid() = user_id);

-- Credit transactions
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Ideas
CREATE POLICY "Users can read own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Analysis
CREATE POLICY "Users can read own analysis" ON analysis FOR SELECT USING (auth.uid() = user_id);

-- Analysis progress
CREATE POLICY "Users can read own analysis progress" ON analysis_progress FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM analysis
    WHERE analysis.id = analysis_progress.analysis_id
    AND analysis.user_id = auth.uid()
  )
);

-- Subscriptions
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Knowledge base RAG
CREATE POLICY "Anyone can read knowledge base" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Knowledge base is insertable by service role" ON knowledge_base FOR INSERT TO service_role WITH CHECK (true);

-- Workspaces
CREATE POLICY "Workspace owner has full access" ON workspaces
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Workspace members can view" ON workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Workspace members
CREATE POLICY "Members can manage workspace members" ON workspace_members
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- Roadmaps
CREATE POLICY "Workspace members can manage roadmaps" ON roadmaps
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Milestones
CREATE POLICY "Full access for workspace members" ON milestones FOR ALL USING (
  roadmap_id IN (
    SELECT id FROM roadmaps WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  )
);

-- Tasks
CREATE POLICY "Workspace members can manage tasks" ON tasks
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Startup Versions
CREATE POLICY "Full access for workspace members" ON startup_versions FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Founder Notes
CREATE POLICY "Full access for workspace members" ON founder_notes FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Startup Flows
CREATE POLICY "Full access for workspace members" ON startup_flows FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Health Scores
CREATE POLICY "Full access for workspace members" ON health_scores FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Strategic Reports
CREATE POLICY "Full access for workspace members" ON strategic_reports FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Chat Sessions & Messages
CREATE POLICY "Full access for workspace members" ON ai_chat_sessions FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

CREATE POLICY "Full access for workspace members" ON ai_chat_messages FOR ALL USING (
  session_id IN (
    SELECT id FROM ai_chat_sessions WHERE workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  )
);

-- Activity Logs
CREATE POLICY "Full access for workspace members" ON activity_logs FOR ALL USING (
  workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Market insights & Comparisons
CREATE POLICY "Anyone can read market insights" ON market_insights FOR SELECT USING (true);
CREATE POLICY "Users can manage their comparisons" ON comparison_sessions FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- 7. FUNCTIONS, PROCEDURES & TRIGGERS
-- ============================================================

-- Function: update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind updated_at Triggers
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_credits_updated_at BEFORE UPDATE ON credits FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER startup_flows_updated_at BEFORE UPDATE ON startup_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER founder_notes_updated_at BEFORE UPDATE ON founder_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: log_activity (Activity logger trigger)
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
BEGIN
  SELECT id INTO current_user_id FROM auth.users() WHERE id = auth.uid();
  IF current_user_id IS NOT NULL THEN
    INSERT INTO activity_logs (workspace_id, user_id, action, entity_type, entity_id)
    VALUES (
      COALESCE(NEW.workspace_id, OLD.workspace_id),
      current_user_id,
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_activity AFTER INSERT OR UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER tasks_activity AFTER INSERT OR UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER milestones_activity AFTER INSERT OR UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================
-- 8. ROBUST USER SIGNUP TRIGGER (EXCEPTION SAFE)
-- ============================================================

-- Function: handle_new_user (Auto-create profile + credit records on GoTrue Auth registration)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_credits INTEGER := 6;
BEGIN
    -- Insert user record into public.profiles
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

    -- Insert user record into public.credits
    INSERT INTO public.credits (user_id, balance)
    VALUES (NEW.id, default_credits)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Capture error details gracefully in database system log and allow signups to complete safely
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind SignUp Trigger to auth.users AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 9. STORAGE BUCKETS CONFIGURATION
-- ============================================================

-- avatars Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- workspace-assets Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workspace-assets',
  'workspace-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- STORAGE OBJECTS POLICIES
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Workspace members can upload assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'workspace-assets' AND auth.role() = 'authenticated'
);

CREATE POLICY "Workspace members can view assets" ON storage.objects FOR SELECT USING (bucket_id = 'workspace-assets');

CREATE POLICY "Workspace members can delete assets" ON storage.objects FOR DELETE USING (
  bucket_id = 'workspace-assets' AND auth.role() = 'authenticated'
);

-- Storage Helper Function
CREATE OR REPLACE FUNCTION get_avatar_url(user_id TEXT)
RETURNS TEXT AS $$
  SELECT 
    CASE 
      WHEN (SELECT avatar_url FROM public.profiles WHERE id = user_id::uuid) IS NOT NULL 
      THEN (SELECT avatar_url FROM public.profiles WHERE id = user_id::uuid)
      ELSE NULL
    END;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 10. REALTIME ENABLEMENT
-- ============================================================

-- Enable Realtime for progressive analysis tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis;
