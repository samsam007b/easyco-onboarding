-- ============================================================================
-- DOCUMENT VAULT SYSTEM - Secure document storage
-- ============================================================================
-- Tables: property_documents, document_shares
-- Purpose: Store and share important property documents (lease, insurance, etc.)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PROPERTY_DOCUMENTS - Document storage
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,

  -- Document info
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'lease', 'insurance', 'inventory', 'rules', 'bills',
    'maintenance', 'contracts', 'receipts', 'other'
  )),

  -- File info
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  file_type TEXT, -- mime type: application/pdf, image/jpeg, etc.

  -- Security
  is_private BOOLEAN NOT NULL DEFAULT FALSE, -- Only visible to uploader if true
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE, -- Needs admin approval to view

  -- Expiration (for documents with validity period)
  expires_at DATE,

  -- Metadata
  tags TEXT[], -- searchable tags: ['loyer', 'electricité', 'assurance']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. DOCUMENT_SHARES - Share documents with specific users
-- ============================================================================
CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES property_documents(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Permissions
  can_download BOOLEAN NOT NULL DEFAULT TRUE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,

  -- Tracking
  shared_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique: one share per document per user
  UNIQUE(document_id, shared_with)
);

-- ============================================================================
-- 3. INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_property_documents_property ON property_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_property_documents_category ON property_documents(category);
CREATE INDEX IF NOT EXISTS idx_property_documents_uploaded_by ON property_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_property_documents_expires_at ON property_documents(expires_at);
CREATE INDEX IF NOT EXISTS idx_property_documents_tags ON property_documents USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_document_shares_document ON document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_user ON document_shares(shared_with);

-- ============================================================================
-- 4. RLS POLICIES - Row Level Security
-- ============================================================================

-- Property documents
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;

-- Users can see all non-private documents in their property
CREATE POLICY property_documents_select_policy ON property_documents
  FOR SELECT USING (
    (NOT is_private AND property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )) OR
    -- Or they uploaded it
    uploaded_by = auth.uid() OR
    -- Or it was explicitly shared with them
    id IN (
      SELECT document_id FROM document_shares WHERE shared_with = auth.uid()
    )
  );

-- Anyone in the property can upload documents
CREATE POLICY property_documents_insert_policy ON property_documents
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Only uploader can update/delete their documents
CREATE POLICY property_documents_update_policy ON property_documents
  FOR UPDATE USING (
    uploaded_by = auth.uid()
  );

CREATE POLICY property_documents_delete_policy ON property_documents
  FOR DELETE USING (
    uploaded_by = auth.uid()
  );

-- Document shares
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Users can see shares for documents they have access to
CREATE POLICY document_shares_select_policy ON document_shares
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM property_documents WHERE
        uploaded_by = auth.uid() OR
        shared_with = auth.uid()
    )
  );

-- Only document owner can share
CREATE POLICY document_shares_insert_policy ON document_shares
  FOR INSERT WITH CHECK (
    document_id IN (
      SELECT id FROM property_documents WHERE uploaded_by = auth.uid()
    )
  );

CREATE POLICY document_shares_delete_policy ON document_shares
  FOR DELETE USING (
    shared_by = auth.uid()
  );

-- ============================================================================
-- 5. FUNCTIONS for document management
-- ============================================================================

-- Function to get document stats for a property
CREATE OR REPLACE FUNCTION get_document_stats(p_property_id UUID)
RETURNS TABLE (
  total_documents INTEGER,
  total_size_bytes BIGINT,
  by_category JSONB,
  expiring_soon INTEGER,
  expired INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*)::INTEGER as total_docs,
      SUM(file_size)::BIGINT as total_bytes,
      jsonb_object_agg(
        category,
        COUNT(*)
      ) as cat_counts,
      COUNT(CASE WHEN expires_at BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 THEN 1 END)::INTEGER as expiring,
      COUNT(CASE WHEN expires_at < CURRENT_DATE THEN 1 END)::INTEGER as expired_count
    FROM property_documents
    WHERE property_id = p_property_id
  )
  SELECT
    total_docs,
    total_bytes,
    cat_counts,
    expiring,
    expired_count
  FROM stats;
END;
$$;

-- Function to search documents by title/description/tags
CREATE OR REPLACE FUNCTION search_documents(
  p_property_id UUID,
  p_query TEXT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pd.id,
    pd.title,
    pd.description,
    pd.category,
    pd.file_name,
    pd.created_at
  FROM property_documents pd
  WHERE pd.property_id = p_property_id
    AND (
      pd.title ILIKE '%' || p_query || '%' OR
      pd.description ILIKE '%' || p_query || '%' OR
      pd.tags && ARRAY[p_query] OR
      pd.file_name ILIKE '%' || p_query || '%'
    )
  ORDER BY pd.created_at DESC;
END;
$$;

-- ============================================================================
-- 6. TRIGGER for updated_at
-- ============================================================================
CREATE TRIGGER update_property_documents_updated_at
  BEFORE UPDATE ON property_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
DO $$
DECLARE
  doc_count INTEGER;
  share_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO doc_count FROM property_documents;
  SELECT COUNT(*) INTO share_count FROM document_shares;

  RAISE NOTICE '✅ Document Vault System Migration Complete!';
  RAISE NOTICE '   ├─ property_documents table created';
  RAISE NOTICE '   ├─ document_shares table created';
  RAISE NOTICE '   ├─ Smart functions created (get_document_stats, search_documents)';
  RAISE NOTICE '   ├─ RLS policies enabled';
  RAISE NOTICE '   └─ Current data: % documents, % shares',
    doc_count, share_count;
END $$;
