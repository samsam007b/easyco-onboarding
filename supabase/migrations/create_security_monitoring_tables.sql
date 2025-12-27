-- ============================================
-- EASYCO SECURITY MONITORING SYSTEM
-- Centre de Commandement de Sécurité & Observabilité
-- ============================================

-- Table pour les erreurs et exceptions capturées
CREATE TABLE IF NOT EXISTS security_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Informations sur l'erreur
  error_type TEXT NOT NULL, -- 'exception', 'validation', 'auth', 'database', 'api'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  stack_trace TEXT,
  error_code TEXT,

  -- Contexte de l'erreur
  route TEXT,
  method TEXT,
  status_code INTEGER,
  user_id UUID,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Métadonnées
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  notes TEXT,

  -- Index pour recherche rapide
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(message, '') || ' ' || COALESCE(route, '') || ' ' || COALESCE(error_code, ''))
  ) STORED
);

-- Table pour les événements de sécurité
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Type d'événement
  event_type TEXT NOT NULL, -- 'auth_failure', 'brute_force', 'sql_injection', 'xss', 'csrf', 'rate_limit', 'suspicious_activity'
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),

  -- Détails de l'événement
  description TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  route TEXT,
  method TEXT,
  payload JSONB,

  -- Géolocalisation (si disponible)
  country TEXT,
  city TEXT,

  -- Actions prises
  action_taken TEXT, -- 'blocked', 'flagged', 'rate_limited', 'none'
  blocked BOOLEAN DEFAULT FALSE,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- Table pour l'audit des routes et endpoints
CREATE TABLE IF NOT EXISTS route_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Informations sur la route
  route TEXT NOT NULL,
  method TEXT NOT NULL,

  -- Métriques de performance
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,

  -- Utilisateur
  user_id UUID,
  user_type TEXT,

  -- Request details
  ip_address INET,
  user_agent TEXT,
  referer TEXT,

  -- Response details
  response_size_bytes INTEGER,
  error_occurred BOOLEAN DEFAULT FALSE,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- Table pour les vulnérabilités détectées
CREATE TABLE IF NOT EXISTS security_vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Type de vulnérabilité
  vulnerability_type TEXT NOT NULL, -- 'dependency', 'code', 'configuration', 'authentication', 'data_exposure'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Détails
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_component TEXT,
  cve_id TEXT, -- CVE identifier si applicable
  cvss_score NUMERIC(3, 1), -- Score CVSS (0.0 - 10.0)

  -- Recommandations
  remediation TEXT,
  fix_complexity TEXT CHECK (fix_complexity IN ('low', 'medium', 'high')),

  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'accepted_risk', 'false_positive')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,

  -- Métadonnées
  metadata JSONB DEFAULT '{}',

  -- Index pour recherche rapide
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(cve_id, ''))
  ) STORED
);

-- Table pour les métriques de performance et monitoring
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Type de métrique
  metric_type TEXT NOT NULL, -- 'web_vitals', 'api_latency', 'database_query', 'memory', 'cpu'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT, -- 'ms', 'bytes', 'percent', etc.

  -- Contexte
  route TEXT,
  user_id UUID,
  session_id TEXT,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- Table pour le score de sécurité global
CREATE TABLE IF NOT EXISTS security_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Score global (0-100)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),

  -- Scores par catégorie
  authentication_score INTEGER,
  authorization_score INTEGER,
  data_protection_score INTEGER,
  vulnerability_score INTEGER,
  monitoring_score INTEGER,
  compliance_score INTEGER,

  -- Détails
  critical_issues INTEGER DEFAULT 0,
  high_issues INTEGER DEFAULT 0,
  medium_issues INTEGER DEFAULT 0,
  low_issues INTEGER DEFAULT 0,

  -- Recommandations
  top_recommendations JSONB DEFAULT '[]',

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- Table pour les alertes intelligentes
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Type d'alerte
  alert_type TEXT NOT NULL, -- 'anomaly', 'threshold', 'pattern', 'prediction'
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),

  -- Détails
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Source
  source_table TEXT, -- Table d'origine de l'alerte
  source_id UUID, -- ID de l'événement source

  -- Actions
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,

  -- Notification
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_channels TEXT[], -- ['email', 'slack', 'sms']

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- Table pour les configuration de sécurité
CREATE TABLE IF NOT EXISTS security_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Configuration
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,

  -- Audit
  updated_by UUID,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- INDEXES pour performance optimale
-- ============================================

-- Security Errors
CREATE INDEX idx_security_errors_created_at ON security_errors(created_at DESC);
CREATE INDEX idx_security_errors_severity ON security_errors(severity);
CREATE INDEX idx_security_errors_type ON security_errors(error_type);
CREATE INDEX idx_security_errors_route ON security_errors(route);
CREATE INDEX idx_security_errors_user_id ON security_errors(user_id);
CREATE INDEX idx_security_errors_resolved ON security_errors(resolved);
CREATE INDEX idx_security_errors_search ON security_errors USING GIN(search_vector);

-- Security Events
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_ip ON security_events(ip_address);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_blocked ON security_events(blocked);

-- Route Analytics
CREATE INDEX idx_route_analytics_created_at ON route_analytics(created_at DESC);
CREATE INDEX idx_route_analytics_route ON route_analytics(route);
CREATE INDEX idx_route_analytics_method ON route_analytics(method);
CREATE INDEX idx_route_analytics_status ON route_analytics(status_code);
CREATE INDEX idx_route_analytics_user_id ON route_analytics(user_id);
CREATE INDEX idx_route_analytics_error ON route_analytics(error_occurred);

-- Performance Metrics
CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at DESC);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_route ON performance_metrics(route);

-- Vulnerabilities
CREATE INDEX idx_vulnerabilities_created_at ON security_vulnerabilities(created_at DESC);
CREATE INDEX idx_vulnerabilities_severity ON security_vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON security_vulnerabilities(status);
CREATE INDEX idx_vulnerabilities_type ON security_vulnerabilities(vulnerability_type);
CREATE INDEX idx_vulnerabilities_search ON security_vulnerabilities USING GIN(search_vector);

-- Security Score
CREATE INDEX idx_security_score_calculated_at ON security_score_history(calculated_at DESC);

-- Alerts
CREATE INDEX idx_security_alerts_created_at ON security_alerts(created_at DESC);
CREATE INDEX idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX idx_security_alerts_type ON security_alerts(alert_type);
CREATE INDEX idx_security_alerts_acknowledged ON security_alerts(acknowledged);

-- ============================================
-- FUNCTIONS pour automatisation
-- ============================================

-- Fonction pour calculer le score de sécurité
CREATE OR REPLACE FUNCTION calculate_security_score()
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 100;
  v_critical_count INTEGER;
  v_high_count INTEGER;
  v_medium_count INTEGER;
  v_unresolved_vulns INTEGER;
  v_recent_incidents INTEGER;
BEGIN
  -- Compter les erreurs critiques des dernières 24h
  SELECT COUNT(*) INTO v_critical_count
  FROM security_errors
  WHERE severity = 'critical'
    AND created_at > NOW() - INTERVAL '24 hours'
    AND NOT resolved;

  -- Compter les erreurs high des dernières 24h
  SELECT COUNT(*) INTO v_high_count
  FROM security_errors
  WHERE severity = 'high'
    AND created_at > NOW() - INTERVAL '24 hours'
    AND NOT resolved;

  -- Compter les erreurs medium des dernières 7 jours
  SELECT COUNT(*) INTO v_medium_count
  FROM security_errors
  WHERE severity = 'medium'
    AND created_at > NOW() - INTERVAL '7 days'
    AND NOT resolved;

  -- Compter les vulnérabilités non résolues
  SELECT COUNT(*) INTO v_unresolved_vulns
  FROM security_vulnerabilities
  WHERE status IN ('open', 'in_progress');

  -- Compter les incidents de sécurité récents
  SELECT COUNT(*) INTO v_recent_incidents
  FROM security_events
  WHERE severity = 'critical'
    AND created_at > NOW() - INTERVAL '24 hours';

  -- Calculer le score (déduction basée sur la gravité)
  v_score := v_score - (v_critical_count * 20); -- -20 points par erreur critique
  v_score := v_score - (v_high_count * 10);     -- -10 points par erreur high
  v_score := v_score - (v_medium_count * 2);    -- -2 points par erreur medium
  v_score := v_score - (v_unresolved_vulns * 5); -- -5 points par vulnérabilité
  v_score := v_score - (v_recent_incidents * 15); -- -15 points par incident critique

  -- S'assurer que le score reste entre 0 et 100
  IF v_score < 0 THEN
    v_score := 0;
  END IF;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour détecter les anomalies (patterns suspects)
CREATE OR REPLACE FUNCTION detect_security_anomalies()
RETURNS TABLE(
  anomaly_type TEXT,
  description TEXT,
  severity TEXT,
  metadata JSONB
) AS $$
BEGIN
  -- Détecter les tentatives de brute force (5+ échecs auth en 5 min de la même IP)
  RETURN QUERY
  SELECT
    'brute_force'::TEXT as anomaly_type,
    'Multiple failed authentication attempts detected from ' || ip_address::TEXT as description,
    'critical'::TEXT as severity,
    jsonb_build_object(
      'ip_address', ip_address,
      'attempt_count', COUNT(*),
      'time_window', '5 minutes'
    ) as metadata
  FROM security_events
  WHERE event_type = 'auth_failure'
    AND created_at > NOW() - INTERVAL '5 minutes'
  GROUP BY ip_address
  HAVING COUNT(*) >= 5;

  -- Détecter les routes avec taux d'erreur élevé (>30% en 1h)
  RETURN QUERY
  SELECT
    'high_error_rate'::TEXT as anomaly_type,
    'High error rate detected on route ' || route as description,
    'warning'::TEXT as severity,
    jsonb_build_object(
      'route', route,
      'total_requests', COUNT(*),
      'error_count', SUM(CASE WHEN error_occurred THEN 1 ELSE 0 END),
      'error_rate', ROUND((SUM(CASE WHEN error_occurred THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 2)
    ) as metadata
  FROM route_analytics
  WHERE created_at > NOW() - INTERVAL '1 hour'
  GROUP BY route
  HAVING (SUM(CASE WHEN error_occurred THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) > 0.3;

  -- Détecter les pics de latence anormaux (>2000ms en moyenne sur 10 min)
  RETURN QUERY
  SELECT
    'high_latency'::TEXT as anomaly_type,
    'Abnormally high response times detected on route ' || route as description,
    'warning'::TEXT as severity,
    jsonb_build_object(
      'route', route,
      'avg_response_time', AVG(response_time_ms),
      'max_response_time', MAX(response_time_ms),
      'request_count', COUNT(*)
    ) as metadata
  FROM route_analytics
  WHERE created_at > NOW() - INTERVAL '10 minutes'
    AND response_time_ms IS NOT NULL
  GROUP BY route
  HAVING AVG(response_time_ms) > 2000;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS pour mise à jour automatique
-- ============================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_vulnerabilities_updated_at
  BEFORE UPDATE ON security_vulnerabilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_config_updated_at
  BEFORE UPDATE ON security_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE security_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_config ENABLE ROW LEVEL SECURITY;

-- Policies : Seuls les admins peuvent accéder
CREATE POLICY "Admin access only" ON security_errors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON security_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON route_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON security_vulnerabilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON performance_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON security_score_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON security_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin access only" ON security_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insérer les configurations par défaut
INSERT INTO security_config (config_key, config_value, description) VALUES
  ('rate_limits', '{"api": 100, "auth": 5, "search": 20}'::jsonb, 'Rate limiting configuration per endpoint type'),
  ('alert_thresholds', '{"critical_errors": 5, "high_errors": 10, "failed_auths": 5}'::jsonb, 'Thresholds for triggering security alerts'),
  ('monitoring_enabled', '{"errors": true, "performance": true, "security": true}'::jsonb, 'Toggle monitoring features'),
  ('notification_settings', '{"email": true, "slack": false, "sms": false}'::jsonb, 'Notification channel settings')
ON CONFLICT (config_key) DO NOTHING;

-- Calculer et enregistrer le score initial
INSERT INTO security_score_history (
  overall_score,
  authentication_score,
  authorization_score,
  data_protection_score,
  vulnerability_score,
  monitoring_score,
  compliance_score
) VALUES (
  100, 95, 90, 85, 100, 80, 90
);

COMMENT ON TABLE security_errors IS 'Toutes les erreurs et exceptions capturées par l''application';
COMMENT ON TABLE security_events IS 'Événements de sécurité et tentatives d''intrusion';
COMMENT ON TABLE route_analytics IS 'Analytics détaillées de chaque requête API';
COMMENT ON TABLE security_vulnerabilities IS 'Vulnérabilités détectées et leur statut';
COMMENT ON TABLE performance_metrics IS 'Métriques de performance de l''application';
COMMENT ON TABLE security_score_history IS 'Historique du score de sécurité global';
COMMENT ON TABLE security_alerts IS 'Alertes intelligentes générées par le système';
COMMENT ON TABLE security_config IS 'Configuration du système de monitoring';
