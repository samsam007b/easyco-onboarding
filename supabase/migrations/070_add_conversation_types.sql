-- ============================================================================
-- ADD CONVERSATION TYPES TO MESSAGING SYSTEM
-- ============================================================================
-- Purpose: Distinguish different types of conversations:
-- 1. residence_group - Official residence group chat (auto-created)
-- 2. residence_owner - Residence members <-> property owner
-- 3. private_residents - 1-to-1 between residents
-- 4. private_resident_owner - 1-to-1 resident <-> owner
-- 5. candidate_inquiry - Candidate <-> resident(s) about moving in
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ADD conversation_type COLUMN
-- ============================================================================

-- Add conversation_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations'
    AND column_name = 'conversation_type'
  ) THEN
    ALTER TABLE conversations ADD COLUMN conversation_type TEXT NOT NULL DEFAULT 'private_residents'
    CHECK (conversation_type IN (
      'residence_group',
      'residence_owner',
      'private_residents',
      'private_resident_owner',
      'candidate_inquiry'
    ));
    RAISE NOTICE '✅ Added conversation_type column';
  END IF;
END $$;

-- Add is_official flag for system-created conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations'
    AND column_name = 'is_official'
  ) THEN
    ALTER TABLE conversations ADD COLUMN is_official BOOLEAN DEFAULT FALSE;
    RAISE NOTICE '✅ Added is_official column';
  END IF;
END $$;

-- Add metadata JSONB column for extra conversation info
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations'
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE conversations ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE '✅ Added metadata column';
  END IF;
END $$;

-- ============================================================================
-- 2. CREATE FUNCTION TO AUTO-CREATE RESIDENCE GROUP CHAT
-- ============================================================================

CREATE OR REPLACE FUNCTION create_residence_group_chat(p_property_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_member RECORD;
BEGIN
  -- Check if residence group chat already exists for this property
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE property_id = p_property_id
    AND conversation_type = 'residence_group'
    AND is_official = TRUE
  LIMIT 1;

  -- If doesn't exist, create it
  IF v_conversation_id IS NULL THEN
    -- Create the conversation
    INSERT INTO conversations (
      property_id,
      conversation_type,
      is_official,
      subject,
      metadata
    ) VALUES (
      p_property_id,
      'residence_group',
      TRUE,
      'Discussion de la résidence',
      jsonb_build_object('description', 'Canal officiel de communication de la résidence')
    )
    RETURNING id INTO v_conversation_id;

    -- Add all active property members as participants
    FOR v_member IN
      SELECT user_id
      FROM property_members
      WHERE property_id = p_property_id
        AND status = 'active'
    LOOP
      INSERT INTO conversation_participants (
        conversation_id,
        user_id
      ) VALUES (
        v_conversation_id,
        v_member.user_id
      )
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END LOOP;

    RAISE NOTICE '✅ Created residence group chat for property %', p_property_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CREATE FUNCTION TO GET OR CREATE RESIDENCE-OWNER CHAT
-- ============================================================================

CREATE OR REPLACE FUNCTION get_or_create_residence_owner_chat(p_property_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_owner_id UUID;
  v_member RECORD;
BEGIN
  -- Get property owner
  SELECT owner_id INTO v_owner_id
  FROM properties
  WHERE id = p_property_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Property has no owner';
  END IF;

  -- Check if chat already exists
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE property_id = p_property_id
    AND conversation_type = 'residence_owner'
    AND is_official = TRUE
  LIMIT 1;

  -- If doesn't exist, create it
  IF v_conversation_id IS NULL THEN
    -- Create the conversation
    INSERT INTO conversations (
      property_id,
      conversation_type,
      is_official,
      subject,
      metadata
    ) VALUES (
      p_property_id,
      'residence_owner',
      TRUE,
      'Résidence ↔ Propriétaire',
      jsonb_build_object('description', 'Canal officiel avec le propriétaire')
    )
    RETURNING id INTO v_conversation_id;

    -- Add owner
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (v_conversation_id, v_owner_id)
    ON CONFLICT DO NOTHING;

    -- Add all active property members
    FOR v_member IN
      SELECT user_id
      FROM property_members
      WHERE property_id = p_property_id
        AND status = 'active'
    LOOP
      INSERT INTO conversation_participants (
        conversation_id,
        user_id
      ) VALUES (
        v_conversation_id,
        v_member.user_id
      )
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END LOOP;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. CREATE TRIGGER TO AUTO-ADD NEW MEMBERS TO OFFICIAL CHATS
-- ============================================================================

CREATE OR REPLACE FUNCTION add_member_to_official_chats()
RETURNS TRIGGER AS $$
DECLARE
  v_conv RECORD;
BEGIN
  -- Only for active members
  IF NEW.status = 'active' THEN
    -- Add to all official conversations for this property
    FOR v_conv IN
      SELECT id
      FROM conversations
      WHERE property_id = NEW.property_id
        AND is_official = TRUE
        AND conversation_type IN ('residence_group', 'residence_owner')
    LOOP
      INSERT INTO conversation_participants (
        conversation_id,
        user_id
      ) VALUES (
        v_conv.id,
        NEW.user_id
      )
      ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_property_member_added ON property_members;
CREATE TRIGGER on_property_member_added
  AFTER INSERT ON property_members
  FOR EACH ROW
  EXECUTE FUNCTION add_member_to_official_chats();

-- ============================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(conversation_type);
CREATE INDEX IF NOT EXISTS idx_conversations_official ON conversations(is_official);
CREATE INDEX IF NOT EXISTS idx_conversations_property_type ON conversations(property_id, conversation_type);

COMMIT;

-- ============================================================================
-- 6. CREATE INITIAL RESIDENCE GROUP CHATS FOR EXISTING PROPERTIES
-- ============================================================================

-- This will create residence group chats for all existing properties
DO $$
DECLARE
  v_property RECORD;
BEGIN
  FOR v_property IN
    SELECT DISTINCT p.id
    FROM properties p
    WHERE EXISTS (
      SELECT 1 FROM property_members pm
      WHERE pm.property_id = p.id
        AND pm.status = 'active'
    )
  LOOP
    BEGIN
      PERFORM create_residence_group_chat(v_property.id);
      PERFORM get_or_create_residence_owner_chat(v_property.id);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not create chats for property %: %', v_property.id, SQLERRM;
    END;
  END LOOP;
END $$;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Conversation types system created!';
  RAISE NOTICE '   - Added conversation_type, is_official, metadata columns';
  RAISE NOTICE '   - Created auto-create functions for official chats';
  RAISE NOTICE '   - Added trigger to auto-add new members';
  RAISE NOTICE '   - Created initial residence chats for existing properties';
END $$;
