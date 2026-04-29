# DisasterScope Architecture

## Services

- Auth Service: JWT issuance, password verification hooks, RBAC checks.
- Data Ingestion Service: normalizes IoT, weather, social, satellite, and government feeds into disaster events and sensor readings.
- Analytics Service: computes risk scores, trend summaries, impact estimates, and chart-ready aggregates.
- AI/ML Service: wraps LLM summarization, LangChain-ready agent routing, anomaly detection, prediction, and resource recommendations.
- Notification Service: emits role-aware alerts over REST and WebSockets.

## Runtime Flow

1. External data arrives through ingestion adapters.
2. Sensor and event records are persisted in MySQL.
3. High-frequency telemetry is cached in Redis and pushed over WebSockets.
4. Analytics endpoints prepare operational dashboards and map layers.
5. AI services combine live context with project, event, and resource data to generate explanations and recommendations.

## Security

- JWT bearer authentication.
- Role-based access for researcher, emergency manager, and admin paths.
- API rate limiting middleware.
- Environment-based secrets.
- MySQL-ready schema with audit timestamps.

## Frontend

The web app is a dashboard-first Next.js UI with:

- Role-aware authentication screen.
- Research home dashboard.
- Project management workspace with methodology, team, data collection, and timeline tabs.
- Analysis dashboard with AI insights, charts, map overlays, and export actions.
- Reports and publications workflow with QA checklist.
- Sidebar AI assistant using the backend chat endpoint.
- WebSocket client for live metrics and notifications.
