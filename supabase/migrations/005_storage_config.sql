-- ValiSearch 2.0 - Storage Configuration
-- Run: npx supabase db push

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create workspace assets bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workspace-assets',
  'workspace-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Avatars: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars: Anyone can view public avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Workspace assets: Workspace members can upload
CREATE POLICY "Workspace members can upload assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'workspace-assets'
    AND auth.role() = 'authenticated'
  );

-- Workspace assets: Workspace members can view
CREATE POLICY "Workspace members can view assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'workspace-assets');

-- Workspace assets: Workspace members can delete
CREATE POLICY "Workspace members can delete assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'workspace-assets'
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- STORAGE FUNCTIONS
-- ============================================================

-- Get public URL for avatar
CREATE OR REPLACE FUNCTION get_avatar_url(user_id TEXT)
RETURNS TEXT AS $$
  SELECT 
    CASE 
      WHEN (SELECT avatar_url FROM profiles WHERE id = user_id::uuid) IS NOT NULL 
      THEN (SELECT avatar_url FROM profiles WHERE id = user_id::uuid)
      ELSE NULL
    END;
$$ LANGUAGE sql SECURITY DEFINER;