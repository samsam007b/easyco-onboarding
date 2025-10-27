-- =====================================================
-- GROUP SYSTEM FOR COLIVING
-- =====================================================
-- Allows searchers to search alone, create groups, or join groups
-- Groups can apply for properties together

-- =====================================================
-- GROUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,

  -- Group settings
  max_members INTEGER NOT NULL DEFAULT 4,
  is_open BOOLEAN DEFAULT TRUE, -- Can accept new members
  requires_approval BOOLEAN DEFAULT TRUE, -- Group creator must approve new members

  -- Group preferences (aggregated from members)
  budget_min DECIMAL,
  budget_max DECIMAL,
  preferred_cities TEXT[], -- Array of preferred cities
  move_in_date DATE,

  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_max_members CHECK (max_members >= 2 AND max_members <= 10),
  CONSTRAINT valid_budget CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);

-- =====================================================
-- GROUP MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Member status
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'left', 'removed')),

  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,

  -- Constraints
  UNIQUE(group_id, user_id)
);

-- =====================================================
-- GROUP INVITATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,

  -- Invitation types
  invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Direct invitation
  invite_code TEXT UNIQUE, -- Shareable code

  -- Invitation details
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  message TEXT,

  -- Expiration
  expires_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT has_invite_method CHECK (
    invited_user_id IS NOT NULL OR invite_code IS NOT NULL
  )
);

-- =====================================================
-- GROUP APPLICATIONS TABLE
-- =====================================================
-- When a group applies for a property together
CREATE TABLE IF NOT EXISTS public.group_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,

  -- Application status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'withdrawn')),

  -- Group application details
  message TEXT,
  combined_income DECIMAL,

  -- Review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(group_id, property_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_groups_created_by ON public.groups(created_by);
CREATE INDEX idx_groups_is_open ON public.groups(is_open);
CREATE INDEX idx_groups_created_at ON public.groups(created_at);

CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_status ON public.group_members(status);

CREATE INDEX idx_group_invitations_group_id ON public.group_invitations(group_id);
CREATE INDEX idx_group_invitations_invited_user_id ON public.group_invitations(invited_user_id);
CREATE INDEX idx_group_invitations_invite_code ON public.group_invitations(invite_code);
CREATE INDEX idx_group_invitations_status ON public.group_invitations(status);

CREATE INDEX idx_group_applications_group_id ON public.group_applications(group_id);
CREATE INDEX idx_group_applications_property_id ON public.group_applications(property_id);
CREATE INDEX idx_group_applications_status ON public.group_applications(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Groups: Anyone can view, only creator can delete
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups"
  ON public.groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

CREATE POLICY "Group creator can update group"
  ON public.groups FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creator can delete group"
  ON public.groups FOR DELETE
  USING (auth.uid() = created_by);

-- Group Members: Members can view, admins can manage
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view group members"
  ON public.group_members FOR SELECT
  USING (true);

CREATE POLICY "Users can add themselves to groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group admins and self can update member status"
  ON public.group_members FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role IN ('creator', 'admin')
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can remove themselves or admins can remove members"
  ON public.group_members FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role IN ('creator', 'admin')
      AND gm.status = 'active'
    )
  );

-- Group Invitations
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invitations"
  ON public.group_invitations FOR SELECT
  USING (
    auth.uid() = invited_user_id OR
    auth.uid() = invited_by OR
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_invitations.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Group members can create invitations"
  ON public.group_invitations FOR INSERT
  WITH CHECK (
    auth.uid() = invited_by AND
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_invitations.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can update their own invitation responses"
  ON public.group_invitations FOR UPDATE
  USING (auth.uid() = invited_user_id);

-- Group Applications
ALTER TABLE public.group_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members and property owners can view group applications"
  ON public.group_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_applications.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    ) OR
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = group_applications.property_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create applications"
  ON public.group_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_applications.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  );

CREATE POLICY "Property owners can update group applications"
  ON public.group_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = group_applications.property_id
      AND p.owner_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get active members count
CREATE OR REPLACE FUNCTION get_group_member_count(group_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.group_members
    WHERE group_id = group_uuid
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is in a group
CREATE OR REPLACE FUNCTION is_user_in_group(user_uuid UUID, group_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
    AND user_id = user_uuid
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    code := upper(substr(md5(random()::text), 1, 8));

    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.group_invitations WHERE invite_code = code
    ) INTO code_exists;

    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update group aggregated preferences
CREATE OR REPLACE FUNCTION update_group_preferences(group_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.groups g
  SET
    budget_min = (
      SELECT MIN(up.budget_min)
      FROM public.group_members gm
      JOIN public.user_profiles up ON gm.user_id = up.user_id
      WHERE gm.group_id = group_uuid AND gm.status = 'active'
    ),
    budget_max = (
      SELECT MAX(up.budget_max)
      FROM public.group_members gm
      JOIN public.user_profiles up ON gm.user_id = up.user_id
      WHERE gm.group_id = group_uuid AND gm.status = 'active'
    ),
    move_in_date = (
      SELECT MIN(up.move_in_date)
      FROM public.group_members gm
      JOIN public.user_profiles up ON gm.user_id = up.user_id
      WHERE gm.group_id = group_uuid AND gm.status = 'active'
    ),
    updated_at = NOW()
  WHERE g.id = group_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update group preferences when members change
CREATE OR REPLACE FUNCTION trigger_update_group_preferences()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_group_preferences(COALESCE(NEW.group_id, OLD.group_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_group_prefs_on_member_change
  AFTER INSERT OR UPDATE OR DELETE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_group_preferences();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_groups_timestamp
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_group_applications_timestamp
  BEFORE UPDATE ON public.group_applications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_timestamp();

-- =====================================================
-- NOTIFICATIONS FOR GROUPS
-- =====================================================

-- Notify when invited to group
CREATE OR REPLACE FUNCTION notify_group_invitation()
RETURNS TRIGGER AS $$
DECLARE
  group_name TEXT;
  inviter_name TEXT;
BEGIN
  -- Only notify for direct invitations (not invite codes)
  IF NEW.invited_user_id IS NOT NULL THEN
    -- Get group name
    SELECT name INTO group_name
    FROM public.groups
    WHERE id = NEW.group_id;

    -- Get inviter name
    SELECT full_name INTO inviter_name
    FROM public.users
    WHERE id = NEW.invited_by;

    -- Create notification
    PERFORM create_notification(
      NEW.invited_user_id,
      'group_invitation',
      'Group Invitation',
      inviter_name || ' invited you to join "' || group_name || '"',
      NEW.invited_by,
      NULL,
      NULL,
      '/groups/invitations/' || NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_invitation_created
  AFTER INSERT ON public.group_invitations
  FOR EACH ROW
  EXECUTE FUNCTION notify_group_invitation();

-- Notify group members when someone joins
CREATE OR REPLACE FUNCTION notify_group_member_joined()
RETURNS TRIGGER AS $$
DECLARE
  group_name TEXT;
  new_member_name TEXT;
  member_record RECORD;
BEGIN
  -- Only notify for active status
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Get group name
    SELECT name INTO group_name
    FROM public.groups
    WHERE id = NEW.group_id;

    -- Get new member name
    SELECT full_name INTO new_member_name
    FROM public.users
    WHERE id = NEW.user_id;

    -- Notify all other active members
    FOR member_record IN
      SELECT user_id
      FROM public.group_members
      WHERE group_id = NEW.group_id
      AND user_id != NEW.user_id
      AND status = 'active'
    LOOP
      PERFORM create_notification(
        member_record.user_id,
        'group_member_joined',
        'New Group Member',
        new_member_name || ' joined your group "' || group_name || '"',
        NEW.user_id,
        NULL,
        NULL,
        '/groups/' || NEW.group_id
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_member_status_changed
  AFTER INSERT OR UPDATE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION notify_group_member_joined();

-- =====================================================
-- INITIAL DATA / EXAMPLES
-- =====================================================
-- None needed for groups - users will create their own

COMMENT ON TABLE public.groups IS 'Groups of searchers looking for coliving together';
COMMENT ON TABLE public.group_members IS 'Members of each group with their roles';
COMMENT ON TABLE public.group_invitations IS 'Invitations to join groups';
COMMENT ON TABLE public.group_applications IS 'Group applications for properties';
