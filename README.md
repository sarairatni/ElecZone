# ElecZone

ElecZone is a multi-service web app with:
- **Front-end:** Next.js (React + TypeScript)
- **Backend API:** Node.js + Express (TypeScript) with **Prisma**
- **AI service:** Python service (LangChain/ChromaDB + related ML/LLM tooling)
- **Database:** Postgres (configured via `DATABASE_URL` / `DIRECT_URL`)

The repo also includes Docker Compose to run the front-end and backend locally.

---

## Repo structure

- `front-end/` — Next.js app (UI)
- `backend/` — Express + TypeScript API (Prisma, JWT, etc.)
- `ai-service/` — Python AI/LLM service (separate Python deps)
- `docker-compose.yml` — Compose file to run services
- `app.py` — Python script to test/connect to Postgres and query `Product`
- `generate_products.py` — script for generating product data (seed/content generation)

---

## Prerequisites

- Node.js + npm (for `front-end/` and `backend/`)
- Python 3.10+ (recommended) for Python scripts/services
- Docker + Docker Compose (recommended for running services together)

---

## Quick start (Docker)

From the repo root:

```bash
docker compose up --build
```

Expected ports:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

> Note: `docker-compose.yml` currently contains credentials/keys in environment variables. Consider moving these into a `.env` file and using Compose `env_file:` (and avoid committing secrets).

---

## Running locally without Docker

### 1) Backend (Express + TypeScript + Prisma)

```bash
cd backend
npm install
npm run dev
```

Common scripts:
- `npm run dev` — dev server (ts-node/nodemon)
- `npm run build` — compile TypeScript
- `npm start` — run compiled output (`dist/index.js`)

If Prisma is used, you’ll typically also need (depending on your setup):
```bash
npx prisma generate
npx prisma migrate dev
```

### 2) Front-end (Next.js)

```bash
cd front-end
npm install
npm run dev
```

Then open:
- `http://localhost:3000`

The front-end expects an API URL via:
- `NEXT_PUBLIC_API_URL` (example: `http://localhost:5001`)

### 3) Python scripts / AI service

Root Python deps (for scripts like `app.py`):

```bash
pip install -r requirements.txt
python app.py
```

AI service deps:

```bash
cd ai-service
pip install -r requirements.txt
# then run the service entrypoint you use (uvicorn/app) if present in this folder
```

---

## Environment variables

You will likely need (varies by service):

### Backend
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`

### Front-end
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

You can manage these with local `.env` files (recommended) rather than hard-coding them in Compose.

---

## Security note (important)

If this repository is public: rotate any database passwords/JWT secrets/API keys that were committed, and move secrets to environment variables that are **not** committed (e.g., `.env` added to `.gitignore`, GitHub Actions secrets, or secret managers).

---

## Contributing

1. Create a branch
2. Make changes with clear commits
3. Open a pull request describing what you changed and why

---

## License

Add a license if you plan to share or distribute this project (e.g., MIT, Apache-2.0, etc.).
