# Retreivo

AI-powered lost and found platform.

## Quickstart

1. Ensure Docker is installed.
2. From the repo root:

```bash
docker compose up -d --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML Service: http://localhost:8000
- Postgres: localhost:5432 (db: retreivo, user: postgres)

Database URL used by backend (note URL-encoded `@`):

```
postgresql://postgres:9894guha@db:5432/retreivo
```

## Migrations

SQL files live under `retreivo-backend/migrations`. They auto-apply on first DB start via docker-compose volume mapping. To re-run manually, use `psql` against the container.


postgres start:
psql -U postgres -d postgres

for ml virtual environment:
python -m venv venv
venv\Scripts\Activate

