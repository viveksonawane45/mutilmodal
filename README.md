# DisasterScope

DisasterScope is a full-stack multimodal disaster management platform for live monitoring, research workflows, predictive analytics, and emergency response coordination.

## Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion, Three.js, Recharts, Leaflet
- Backend: FastAPI, REST, WebSockets, JWT, role-based access control
- AI: OpenAI-compatible LLM integration with LangChain-ready service boundaries and deterministic fallback responses
- Data: MySQL primary database, Redis cache and realtime fanout
- Deployment: Docker Compose, AWS ECS/Fargate reference notes, GitHub Actions CI

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Web: http://localhost:3000
- API: http://localhost:8000/docs

## Local Development

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend:

```bash
cd services/api
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Demo Roles

The backend exposes `/api/v1/auth/demo-token/{role}` for local demos. Supported roles are `researcher`, `emergency_manager`, and `admin`.

## Project Layout

```text
apps/web              Next.js application
services/api          FastAPI application
database/schema.sql   MySQL schema and seed data
deploy/aws            AWS deployment reference
docs                  Architecture and deployment guides
```

The two referenced PDFs are outside the readable workspace sandbox in this session, so the implementation follows the requirements provided in the prompt.
