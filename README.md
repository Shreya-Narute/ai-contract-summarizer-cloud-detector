# ContractAI — AI Contract Summarizer & Clause Detector

A full-stack AI-powered contract analysis platform. Upload any PDF or DOCX contract and get an instant summary, clause breakdown, and generated contract documents.

## Features

- **Contract Upload & Analysis** — Upload PDF or DOCX; extract and display full text
- **AI Summarization** — Extractive summarization of contract text
- **Clause Detection** — Automatically identifies termination, payment, confidentiality, and governing-law clauses
- **Contract Generation** — Generate filled Rental, Affidavit, and Service Agreement contracts from templates (downloads as DOCX)
- **Async Jobs** — Long analysis tasks dispatched via Celery + Redis
- **Contract History** — All uploaded contracts saved per user in PostgreSQL
- **JWT Authentication** — Register/login with secure token-based auth
- **Professional UI** — Modern React frontend with landing page, dashboard, and responsive design

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   React     │────▶│  FastAPI     │────▶│  PostgreSQL    │
│  (nginx)    │     │  Backend     │     │  (contracts DB)│
└─────────────┘     └──────┬───────┘     └────────────────┘
                           │
                    ┌──────▼───────┐     ┌────────────────┐
                    │    Redis     │────▶│ Celery Worker  │
                    │   (broker)   │     │ (async tasks)  │
                    └──────────────┘     └────────────────┘
```

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, React Router v6, Axios |
| Backend | FastAPI, Python 3.11, SQLAlchemy, PyJWT, passlib |
| Database | PostgreSQL 15 |
| Cache/Queue | Redis 7 |
| Worker | Celery 5 |
| Container | Docker, Docker Compose |
| Web server | nginx (production frontend) |

## Local Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-contract-summarizer-cloud-detector.git
cd ai-contract-summarizer-cloud-detector

# 2. Copy the environment template
cp .env.example .env
# Edit .env if you want to change defaults (not required for local dev)

# 3. Build and start all services
docker compose up -d --build

# 4. Wait ~60 seconds for services to start, then open:
#    Frontend:  http://localhost:3000
#    API docs:  http://localhost:8000/docs
```

### First run

1. Go to **http://localhost:8000/docs**
2. Use `POST /auth/signup` to create an account
3. Go to **http://localhost:3000** and log in

## Environment Variables

Copy `.env.example` to `.env` and fill in values. See `.env.example` for descriptions.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (use a long random string) |
| `ALLOWED_ORIGINS` | Production | Comma-separated frontend URLs for CORS |
| `REACT_APP_API_URL` | Production | Public backend URL (build-time arg) |

Generate a strong JWT secret:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs backend --tail=50
docker compose logs celery_worker --tail=50
docker compose logs frontend --tail=20

# Stop services (keeps data)
docker compose stop

# Rebuild after code changes
docker compose build backend frontend
docker compose up -d backend frontend
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/files/upload` | Yes | Upload + analyze contract |
| GET | `/files/history` | Yes | List user's contracts |
| POST | `/generate/` | Yes | Generate contract DOCX |
| POST | `/jobs/submit` | Yes | Submit async analysis job |
| GET | `/jobs/status/{id}` | Yes | Poll job status |

## Deployment

This application is deployment-ready for [Railway](https://railway.app).

See `.env.example` for all required environment variables.

For production:
1. Set `JWT_SECRET` to a strong random value
2. Set `ALLOWED_ORIGINS` to your frontend URL
3. Set `REACT_APP_API_URL` to your backend URL at build time

## License

MIT
