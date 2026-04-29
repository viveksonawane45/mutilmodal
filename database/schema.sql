CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('researcher', 'emergency_manager', 'admin') NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  permissions JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  owner_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_projects_status (status)
);

CREATE TABLE IF NOT EXISTS disaster_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NULL,
  event_type ENUM('earthquake', 'flood', 'wildfire', 'hurricane') NOT NULL,
  name VARCHAR(255) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  radius_km DOUBLE NOT NULL DEFAULT 0,
  severity DOUBLE NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'monitoring',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_events_type_status (event_type, status),
  INDEX idx_events_location (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS sensor_data (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NULL,
  source_type ENUM('iot', 'weather', 'social', 'satellite', 'government') NOT NULL,
  metric_name VARCHAR(120) NOT NULL,
  metric_value DOUBLE NOT NULL,
  unit VARCHAR(32) NOT NULL,
  latitude DOUBLE NULL,
  longitude DOUBLE NULL,
  quality_score DOUBLE NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sensor_event FOREIGN KEY (event_id) REFERENCES disaster_events(id) ON DELETE SET NULL,
  INDEX idx_sensor_metric_time (metric_name, created_at),
  INDEX idx_sensor_source (source_type)
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  qa_status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_reports_status (qa_status)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  severity ENUM('info', 'watch', 'critical') NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_notifications_severity (severity),
  INDEX idx_notifications_unread (read_at)
);

CREATE TABLE IF NOT EXISTS chat_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_chat_user_time (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NULL,
  insight_type VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  explanation TEXT NOT NULL,
  confidence DOUBLE NOT NULL DEFAULT 0,
  recommended_actions JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_insights_event FOREIGN KEY (event_id) REFERENCES disaster_events(id) ON DELETE SET NULL,
  INDEX idx_insights_type (insight_type),
  INDEX idx_insights_confidence (confidence)
);

INSERT INTO users (email, full_name, role, hashed_password, permissions)
VALUES
  ('researcher@disasterscope.local', 'Demo Researcher', 'researcher', '$2b$12$demo', JSON_OBJECT('read', true)),
  ('manager@disasterscope.local', 'Demo Emergency Manager', 'emergency_manager', '$2b$12$demo', JSON_OBJECT('respond', true)),
  ('admin@disasterscope.local', 'Demo Admin', 'admin', '$2b$12$demo', JSON_OBJECT('admin', true))
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO projects (id, name, summary, status, owner_id)
VALUES
  (1, 'Regional Flood Resilience Study', 'Multimodal flood risk research and emergency response coordination.', 'active', 1),
  (2, 'Bay Seismic Cluster Assessment', 'Seismic event monitoring and impact radius modeling.', 'monitoring', 1)
ON DUPLICATE KEY UPDATE summary = VALUES(summary), status = VALUES(status);

INSERT INTO disaster_events (id, project_id, event_type, name, location_name, latitude, longitude, radius_km, severity, status)
VALUES
  (1, 1, 'flood', 'Mula-Mutha Flood Watch', 'Pune, India', 18.5204, 73.8567, 22, 82, 'active'),
  (2, 2, 'earthquake', 'Bay Seismic Cluster', 'San Francisco, USA', 37.7749, -122.4194, 36, 68, 'monitoring'),
  (3, 1, 'wildfire', 'Blue Mountains Fireline', 'NSW, Australia', -33.7000, 150.3000, 44, 75, 'active'),
  (4, 1, 'hurricane', 'Gulf Storm Delta', 'Gulf Coast, USA', 29.7604, -95.3698, 88, 71, 'monitoring')
ON DUPLICATE KEY UPDATE severity = VALUES(severity), status = VALUES(status);

INSERT INTO sensor_data (event_id, source_type, metric_name, metric_value, unit, latitude, longitude, quality_score)
VALUES
  (1, 'iot', 'water_level', 5.9, 'm', 18.5204, 73.8567, 0.94),
  (1, 'weather', 'rainfall_24h', 146.3, 'mm', 18.5204, 73.8567, 0.91),
  (1, 'social', 'road_closure_mentions', 318, 'count', 18.5204, 73.8567, 0.78),
  (2, 'government', 'magnitude', 3.8, 'Mw', 37.7749, -122.4194, 0.98),
  (3, 'satellite', 'hotspot_confidence', 0.86, 'ratio', -33.7000, 150.3000, 0.89);

INSERT INTO reports (project_id, title, body, qa_status)
VALUES
  (1, 'Regional Flood Resilience Situation Brief', 'AI-assisted brief covering risk, evidence, uncertainty, and recommended actions.', 'review');

INSERT INTO notifications (user_id, severity, title, body)
VALUES
  (2, 'critical', 'Flood risk increased', 'Pune sector C exceeded water-level acceleration threshold.'),
  (2, 'watch', 'Sensor drift detected', 'Two gauges require satellite validation.');

INSERT INTO ai_insights (event_id, insight_type, title, explanation, confidence, recommended_actions)
VALUES
  (1, 'prediction', 'Flood risk rising in Pune', 'Water-level acceleration, rainfall persistence, and social signals indicate elevated flood risk.', 0.91, JSON_ARRAY('Open west-side shelters', 'Stage rescue boats', 'Verify sensor drift'));
