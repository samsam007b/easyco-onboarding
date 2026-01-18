-- Property Alerts System
-- Allows searchers to create alerts for properties matching their criteria

-- Table for storing user property alerts
CREATE TABLE IF NOT EXISTS property_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,

  -- Search criteria (JSON for flexibility)
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Alert settings
  is_active BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  notification_frequency VARCHAR(50) DEFAULT 'instant', -- instant, daily, weekly

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_notified_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_frequency CHECK (notification_frequency IN ('instant', 'daily', 'weekly'))
);

-- Table for storing individual notifications
CREATE TABLE IF NOT EXISTS property_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES property_alerts(id) ON DELETE SET NULL,

  -- Notification details
  type VARCHAR(50) NOT NULL, -- new_property, price_drop, status_change
  title VARCHAR(255) NOT NULL,
  message TEXT,

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_notification_type CHECK (type IN ('new_property', 'price_drop', 'status_change', 'new_match'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_alerts_user_id ON property_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_property_alerts_active ON property_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_property_notifications_user_id ON property_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_property_notifications_unread ON property_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_property_notifications_created ON property_notifications(created_at DESC);

-- RLS Policies
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alerts
CREATE POLICY "Users can view own alerts"
  ON property_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts"
  ON property_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON property_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON property_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON property_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON property_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON property_notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_property_alerts_timestamp
  BEFORE UPDATE ON property_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_property_alerts_updated_at();

-- Function to create notification when new property matches alert criteria
CREATE OR REPLACE FUNCTION notify_matching_alerts()
RETURNS TRIGGER AS $$
DECLARE
  alert_record RECORD;
  criteria JSONB;
  matches BOOLEAN;
BEGIN
  -- Only process for new published properties
  IF NEW.status != 'published' THEN
    RETURN NEW;
  END IF;

  -- Loop through all active alerts
  FOR alert_record IN
    SELECT * FROM property_alerts
    WHERE is_active = true
    AND email_notifications = true
  LOOP
    criteria := alert_record.criteria;
    matches := true;

    -- Check city
    IF criteria ? 'city' AND criteria->>'city' != '' AND criteria->>'city' != NEW.city THEN
      matches := false;
    END IF;

    -- Check price range
    IF criteria ? 'minPrice' AND (criteria->>'minPrice')::numeric > NEW.monthly_rent THEN
      matches := false;
    END IF;

    IF criteria ? 'maxPrice' AND (criteria->>'maxPrice')::numeric < NEW.monthly_rent THEN
      matches := false;
    END IF;

    -- Check bedrooms
    IF criteria ? 'bedrooms' AND criteria->>'bedrooms' != 'null' AND (criteria->>'bedrooms')::integer != NEW.bedrooms THEN
      matches := false;
    END IF;

    -- Check property type
    IF criteria ? 'propertyType' AND criteria->>'propertyType' != 'all' AND criteria->>'propertyType' != NEW.property_type THEN
      matches := false;
    END IF;

    -- If all criteria match, create notification
    IF matches THEN
      INSERT INTO property_notifications (
        user_id,
        property_id,
        alert_id,
        type,
        title,
        message
      ) VALUES (
        alert_record.user_id,
        NEW.id,
        alert_record.id,
        'new_property',
        'Nouvelle propriété correspond à votre alerte',
        format('Une nouvelle propriété "%s" à %s correspond à vos critères de recherche.', NEW.title, NEW.city)
      );

      -- Update last_notified_at
      UPDATE property_alerts
      SET last_notified_at = NOW()
      WHERE id = alert_record.id;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check alerts when new property is created
CREATE TRIGGER check_property_alerts
  AFTER INSERT OR UPDATE OF status ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_matching_alerts();

-- Add some helpful comments
COMMENT ON TABLE property_alerts IS 'Stores user-defined alerts for property searches';
COMMENT ON TABLE property_notifications IS 'Stores individual notifications sent to users about matching properties';
COMMENT ON COLUMN property_alerts.criteria IS 'JSON object containing search criteria (city, price range, bedrooms, etc.)';
COMMENT ON COLUMN property_alerts.notification_frequency IS 'How often to send notifications: instant, daily, or weekly';
