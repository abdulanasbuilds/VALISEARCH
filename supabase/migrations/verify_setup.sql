-- VALISEARCH 2.0 - SUPABASE VERIFICATION QUERIES
-- Run these in Supabase SQL Editor to verify your setup

-- ============================================================
-- 1. CHECK ALL TABLES EXIST
-- ============================================================

SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected count: 25+ tables

-- ============================================================
-- 2. CHECK RLS IS ENABLED ON ALL TABLES
-- ============================================================

SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: All tables should have rowsecurity = true

-- ============================================================
-- 3. COUNT RLS POLICIES PER TABLE
-- ============================================================

SELECT 
  tablename,
  count(policyname) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC;

-- Expected: Each table should have at least 1 policy

-- ============================================================
-- 4. CHECK INDEXES
-- ============================================================

SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'
AND indexname NOT LIKE '%_seq'
ORDER BY tablename;

-- Expected: Multiple indexes for performance

-- ============================================================
-- 5. CHECK TRIGGERS
-- ============================================================

SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table;

-- Expected: 8+ triggers (user creation, updated_at, activity)

-- ============================================================
-- 6. CHECK EXTENSIONS
-- ============================================================

SELECT 
  extname,
  extversion
FROM pg_extension
WHERE extname IN ('vector', 'pgvector', 'uuid-ossp');

-- Expected: vector/pgvector enabled

-- ============================================================
-- 7. CHECK STORAGE BUCKETS
-- ============================================================

SELECT 
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets
ORDER BY name;

-- Expected: avatars, workspace-assets buckets

-- ============================================================
-- 8. CHECK REALTIME PUBLICATIONS
-- ============================================================

SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Expected: analysis, analysis_progress

-- ============================================================
-- 9. CHECK FUNCTIONS
-- ============================================================

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'handle_new_user',
  'update_updated_at',
  'log_activity',
  'match_knowledge_base',
  'get_avatar_url'
);

-- Expected: 5+ functions

-- ============================================================
-- 10. QUICK HEALTH CHECK
-- ============================================================

SELECT 
  'Tables' as check_type,
  count(*) as count
FROM information_schema.tables WHERE table_schema = 'public'
UNION ALL
SELECT 
  'RLS Policies',
  count(*) 
FROM pg_policies WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Indexes',
  count(*) 
FROM pg_indexes WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Triggers',
  count(*) 
FROM information_schema.triggers WHERE event_object_schema = 'public';

-- Expected output:
-- Tables: 25+
-- RLS Policies: 30+
-- Indexes: 30+
-- Triggers: 8+