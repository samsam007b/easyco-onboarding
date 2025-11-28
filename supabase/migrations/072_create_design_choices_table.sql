-- ============================================
-- DESIGN CHOICES TABLE
-- Store design system choices with feedback
-- ============================================

-- Create the design_choices table
CREATE TABLE IF NOT EXISTS public.design_choices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL, -- To group choices from same session
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if user is logged in

    -- Choice details
    choice_key TEXT NOT NULL, -- e.g., 'cards', 'buttons', 'shadows', 'badges', 'backgrounds'
    choice_title TEXT NOT NULL, -- e.g., 'Style de cartes'
    selected_version TEXT NOT NULL CHECK (selected_version IN ('v1', 'v2')),
    v1_label TEXT NOT NULL,
    v2_label TEXT NOT NULL,

    -- Feedback
    feedback TEXT, -- Free text feedback for this specific choice

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for upsert
ALTER TABLE public.design_choices ADD CONSTRAINT unique_session_choice
    UNIQUE (session_id, choice_key);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_design_choices_session_id ON public.design_choices(session_id);
CREATE INDEX IF NOT EXISTS idx_design_choices_user_id ON public.design_choices(user_id);
CREATE INDEX IF NOT EXISTS idx_design_choices_choice_key ON public.design_choices(choice_key);
CREATE INDEX IF NOT EXISTS idx_design_choices_created_at ON public.design_choices(created_at DESC);

-- Enable RLS
ALTER TABLE public.design_choices ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (anonymous or authenticated)
CREATE POLICY "Anyone can insert design choices"
    ON public.design_choices
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Anyone can read all choices (for analytics/viewing)
CREATE POLICY "Anyone can read design choices"
    ON public.design_choices
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Authenticated users can update their own choices
CREATE POLICY "Users can update their own design choices"
    ON public.design_choices
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Policy: Allow anonymous updates by session_id
CREATE POLICY "Anonymous can update by session_id"
    ON public.design_choices
    FOR UPDATE
    TO anon
    USING (user_id IS NULL)
    WITH CHECK (user_id IS NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_design_choices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_design_choices_updated_at
    BEFORE UPDATE ON public.design_choices
    FOR EACH ROW
    EXECUTE FUNCTION update_design_choices_updated_at();

-- Create a summary view for analytics
CREATE OR REPLACE VIEW public.design_choices_summary AS
SELECT
    choice_key,
    choice_title,
    selected_version,
    COUNT(*) as vote_count,
    COUNT(CASE WHEN feedback IS NOT NULL AND feedback != '' THEN 1 END) as feedback_count
FROM public.design_choices
GROUP BY choice_key, choice_title, selected_version
ORDER BY choice_key, selected_version;

-- Grant access to the view
GRANT SELECT ON public.design_choices_summary TO anon, authenticated;
