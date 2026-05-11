-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  source_type_filter text DEFAULT null
)
RETURNS TABLE (
  id uuid,
  source_type text,
  source_name text,
  source_url text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.source_type,
    kb.source_name,
    kb.source_url,
    kb.title,
    kb.content,
    kb.metadata,
    1 - (kb.content_vector <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE
    kb.content_vector IS NOT NULL
    AND (1 - (kb.content_vector <=> query_embedding)) >= match_threshold
    AND (source_type_filter IS NULL OR kb.source_type = source_type_filter)
  ORDER BY kb.content_vector <=> query_embedding
  LIMIT match_count;
END;
$$;