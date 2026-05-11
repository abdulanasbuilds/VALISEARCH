-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table for RAG
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_vector vector(768),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_vector 
ON knowledge_base 
USING ivfflat (content_vector vector_cosine_ops)
WITH (lists = 100);

-- Index for source type filtering
CREATE INDEX IF NOT EXISTS idx_knowledge_base_source 
ON knowledge_base(source_type);

-- RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge base is readable by everyone"
  ON knowledge_base FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Knowledge base is insertable by service role"
  ON knowledge_base FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_base_updated_at
    BEFORE UPDATE ON knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();