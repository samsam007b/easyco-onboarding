-- ============================================
-- CREATE JSONB OBJECTS FROM EXISTING CORE ONBOARDING DATA
-- This script creates extended_personality, financial_info, and community_preferences
-- from individual column data that was saved during CORE onboarding
-- ============================================

-- Run this for your specific user (baudonsamuel@gmail.com)
-- Or change the email to match your account

DO $$
DECLARE
  v_user_id UUID;
  v_hobbies TEXT[];
  v_introvert_scale INTEGER;
  v_communication_style TEXT;
  v_conflict_resolution TEXT;
  v_income_range TEXT;
  v_occupation_status TEXT;
  v_employment_type TEXT;
  v_guarantor_available BOOLEAN;
  v_event_interest TEXT;
  v_shared_meals_interest BOOLEAN;
  v_open_to_meetups BOOLEAN;
  v_introvert_text TEXT;
BEGIN
  -- Get user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'sam7777jones@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found with email: sam7777jones@gmail.com';
    RETURN;
  END IF;

  RAISE NOTICE 'Found user_id: %', v_user_id;

  -- Fetch existing data from user_profiles
  SELECT
    hobbies,
    introvert_extrovert_scale,
    communication_style,
    conflict_tolerance,
    income_range,
    occupation_status,
    employment_type,
    guarantor_available,
    event_interest,
    shared_meals_interest,
    open_to_meetups
  INTO
    v_hobbies,
    v_introvert_scale,
    v_communication_style,
    v_conflict_resolution,
    v_income_range,
    v_occupation_status,
    v_employment_type,
    v_guarantor_available,
    v_event_interest,
    v_shared_meals_interest,
    v_open_to_meetups
  FROM user_profiles
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Current data loaded';
  RAISE NOTICE '  Hobbies count: %', array_length(v_hobbies, 1);
  RAISE NOTICE '  Introvert Scale: %', v_introvert_scale;
  RAISE NOTICE '  Communication: %', v_communication_style;
  RAISE NOTICE '  Income Range: %', v_income_range;
  RAISE NOTICE '  Occupation: %', v_occupation_status;
  RAISE NOTICE '  Event Interest: %', v_event_interest;

  -- Convert introvert_extrovert_scale to text
  IF v_introvert_scale IS NOT NULL THEN
    IF v_introvert_scale <= 3 THEN
      v_introvert_text := 'introvert';
    ELSIF v_introvert_scale <= 7 THEN
      v_introvert_text := 'ambivert';
    ELSE
      v_introvert_text := 'extrovert';
    END IF;
  END IF;

  -- 1. Create extended_personality JSONB
  IF v_hobbies IS NOT NULL OR v_introvert_scale IS NOT NULL OR v_communication_style IS NOT NULL THEN
    UPDATE user_profiles
    SET extended_personality = jsonb_build_object(
      'hobbies', COALESCE(v_hobbies, ARRAY[]::TEXT[]),
      'interests', ARRAY[]::TEXT[],
      'personalityTraits', COALESCE(
        (
          SELECT jsonb_agg(trait)
          FROM (
            SELECT jsonb_build_object(
              'type', 'social_energy',
              'scale', v_introvert_scale,
              'text', v_introvert_text
            ) AS trait
            WHERE v_introvert_scale IS NOT NULL
            UNION ALL
            SELECT jsonb_build_object(
              'type', 'communication',
              'value', v_communication_style
            ) AS trait
            WHERE v_communication_style IS NOT NULL
            UNION ALL
            SELECT jsonb_build_object(
              'type', 'conflict_resolution',
              'value', v_conflict_resolution
            ) AS trait
            WHERE v_conflict_resolution IS NOT NULL
          ) AS traits
        ),
        '[]'::jsonb
      )
    )
    WHERE user_id = v_user_id
    AND extended_personality IS NULL;

    IF FOUND THEN
      RAISE NOTICE 'Created extended_personality JSONB';
    ELSE
      RAISE NOTICE 'extended_personality already exists, skipped';
    END IF;
  END IF;

  -- 2. Create financial_info JSONB
  IF v_income_range IS NOT NULL OR v_occupation_status IS NOT NULL OR v_employment_type IS NOT NULL OR v_guarantor_available IS NOT NULL THEN
    UPDATE user_profiles
    SET financial_info = jsonb_build_object(
      'incomeRange', COALESCE(v_income_range, 'not-specified'),
      'hasGuarantor', COALESCE(v_guarantor_available, false),
      'employmentType', COALESCE(v_employment_type, v_occupation_status, 'not-specified')
    )
    WHERE user_id = v_user_id
    AND financial_info IS NULL;

    IF FOUND THEN
      RAISE NOTICE 'Created financial_info JSONB';
    ELSE
      RAISE NOTICE 'financial_info already exists, skipped';
    END IF;
  END IF;

  -- 3. Create community_preferences JSONB
  IF v_event_interest IS NOT NULL OR v_shared_meals_interest IS NOT NULL OR v_open_to_meetups IS NOT NULL THEN
    UPDATE user_profiles
    SET community_preferences = jsonb_build_object(
      'eventInterest', COALESCE(v_event_interest, 'medium'),
      'enjoySharedMeals', COALESCE(v_shared_meals_interest, false),
      'openToMeetups', COALESCE(v_open_to_meetups, false)
    )
    WHERE user_id = v_user_id
    AND community_preferences IS NULL;

    IF FOUND THEN
      RAISE NOTICE 'Created community_preferences JSONB';
    ELSE
      RAISE NOTICE 'community_preferences already exists, skipped';
    END IF;
  END IF;

  RAISE NOTICE ' ';
  RAISE NOTICE 'DONE! JSONB objects created from CORE onboarding data';
  RAISE NOTICE ' ';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Refresh the dashboard to see updated completion percentage';
  RAISE NOTICE '2. Check /api/profile/debug to verify the changes';
  RAISE NOTICE '3. Expected completion: 60-70 percent (was 33 percent)';

END $$;

-- Verify the result
SELECT
  user_id,
  CASE
    WHEN extended_personality IS NOT NULL THEN '✅'
    ELSE '❌'
  END AS "extended_personality",
  CASE
    WHEN financial_info IS NOT NULL THEN '✅'
    ELSE '❌'
  END AS "financial_info",
  CASE
    WHEN community_preferences IS NOT NULL THEN '✅'
    ELSE '❌'
  END AS "community_preferences"
FROM user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sam7777jones@gmail.com' LIMIT 1);
