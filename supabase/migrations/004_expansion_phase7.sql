-- ValiSearch 2.0 Expansion - Phase 7 Database Schema
-- Run: npx supabase db push

-- ============================================================
-- WORKSPACES (Multi-project support)
-- ============================================================

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  stage TEXT NOT NULL DEFAULT 'idea',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WORKSPACE MEMBERS (Collaboration)
-- ============================================================

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- ============================================================
-- ROADMAPS
-- ============================================================

CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_phase TEXT DEFAULT 'idea',
  completion_percentage INTEGER DEFAULT 0,
  launch_readiness INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MILESTONES
-- ============================================================

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  completion_percentage INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TASKS (Kanban)
-- ============================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'product',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  phase TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STARTUP VERSIONS (Iteration)
-- ============================================================

CREATE TABLE startup_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  idea_text TEXT NOT NULL,
  changes_summary TEXT,
  pivot_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FOUNDER NOTES
-- ============================================================

CREATE TABLE founder_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'strategic',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STARTUP FLOWS (Visual)
-- ============================================================

CREATE TABLE startup_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  flow_type TEXT DEFAULT 'user_journey',
  nodes JSONB DEFAULT '[]',
  connections JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HEALTH SCORES (History)
-- ============================================================

CREATE TABLE health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
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

-- ============================================================
-- STRATEGIC REPORTS (Investor Prep)
-- ============================================================

CREATE TABLE strategic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMPARISON SESSIONS
-- ============================================================

CREATE TABLE comparison_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workspace_ids UUID[] NOT NULL,
  comparison_type TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MARKET INSIGHTS
-- ============================================================

CREATE TABLE market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  trends JSONB DEFAULT '[]',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AI CHAT (Cofounder conversations)
-- ============================================================

CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_archived ON workspaces(is_archived);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_roadmaps_workspace ON roadmaps(workspace_id);
CREATE INDEX idx_milestones_roadmap ON milestones(roadmap_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_roadmap ON tasks(roadmap_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_startup_versions_workspace ON startup_versions(workspace_id);
CREATE INDEX idx_founder_notes_workspace ON founder_notes(workspace_id);
CREATE INDEX idx_startup_flows_workspace ON startup_flows(workspace_id);
CREATE INDEX idx_health_scores_workspace ON health_scores(workspace_id);
CREATE INDEX idx_strategic_reports_workspace ON strategic_reports(workspace_id);
CREATE INDEX idx_comparison_sessions_user ON comparison_sessions(user_id);
CREATE INDEX idx_market_insights_category ON market_insights(category);
CREATE INDEX idx_ai_chat_sessions_workspace ON ai_chat_sessions(workspace_id);
CREATE INDEX idx_ai_chat_messages_session ON ai_chat_messages(session_id);
CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

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

-- Workspace RLS policies
CREATE POLICY "Workspace owner has full access" ON workspaces
  FOR ALL USING (owner_id = (SELECT id FROM auth.users() WHERE id = auth.uid()));

CREATE POLICY "Workspace members can view" ON workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))
  );

-- Workspace members policies
CREATE POLICY "Members can manage workspace members" ON workspace_members
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))
  );

-- Roadmaps policies
CREATE POLICY "Workspace members can manage roadmaps" ON roadmaps
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))
  );

-- Tasks policies
CREATE POLICY "Workspace members can manage tasks" ON tasks
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))
  );

-- Other tables follow same pattern
CREATE POLICY "Full access for workspace members" ON milestones FOR ALL USING (roadmap_id IN (SELECT id FROM roadmaps WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))));
CREATE POLICY "Full access for workspace members" ON startup_versions FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON founder_notes FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON startup_flows FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON health_scores FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON strategic_reports FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON ai_chat_sessions FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));
CREATE POLICY "Full access for workspace members" ON ai_chat_messages FOR ALL USING (session_id IN (SELECT id FROM ai_chat_sessions WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()))));
CREATE POLICY "Full access for workspace members" ON activity_logs FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = (SELECT id FROM auth.users() WHERE id = auth.uid())));

-- Comparison sessions and market insights are public reads
CREATE POLICY "Anyone can read market insights" ON market_insights FOR SELECT USING (true);
CREATE POLICY "Users can manage their comparisons" ON comparison_sessions FOR ALL USING (user_id = (SELECT id FROM auth.users() WHERE id = auth.uid()));

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER startup_flows_updated_at BEFORE UPDATE ON startup_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER founder_notes_updated_at BEFORE UPDATE ON founder_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ACTIVITY LOG TRIGGER
-- ============================================================

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