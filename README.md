# Cosmic Watch

**A real-time Near-Earth Object (NEO) tracking dashboard** — live asteroid data, 3D visualisation, personal watchlists, and an AI-powered impact simulator.

Originally built as a hackathon project, Cosmic Watch is a production-ready full-stack application that pulls live data from [NASA's NeoWs API](https://api.nasa.gov/#NeoWS).

---

## Features

| Area | What it does |
|------|-------------|
| **Asteroid feed** | Live NEO feed filtered by date range, size, or risk level |
| **Risk scoring** | Proprietary score (0–100) based on diameter, velocity, and miss distance |
| **3D visualisation** | Three.js Solar System with real orbital mechanics |
| **Watchlist** | Save and annotate asteroids; persisted to MongoDB per user |
| **Impact simulator** | Physics-based impact scenario + optional AI narrative (OpenAI) |
| **Live chat** | Per-asteroid community discussion via Socket.io |
| **Auth** | JWT + httpOnly cookie; signup, login, protected routes |

---

## Tech Stack

**Frontend** — React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Three.js / `@react-three/fiber` · React Query · Socket.io client

**Backend** — Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs · Socket.io · OpenAI SDK

**DevOps** — Docker · Docker Compose · nginx

---

## Running the Project

### Option A — Docker (recommended, one command)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# 1. Clone
git clone https://github.com/Ritesh102472/nicerepo.git cosmic-watch
cd cosmic-watch

# 2. Set your secrets (optional but recommended)
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
export NASA_API_KEY=your_nasa_api_key   # free at https://api.nasa.gov
# export OPENAI_API_KEY=sk-...          # only needed for the AI impact feature

# 3. Start all services
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| Health check | http://localhost:5001/health |

Stop with `Ctrl+C`, then `docker compose down`.

---

### Option B — Local Development (no Docker)

**Prerequisites:** Node.js 18+, MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

```bash
# 1. Clone
git clone https://github.com/Ritesh102472/nicerepo.git cosmic-watch
cd cosmic-watch
```

**Backend**

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, and optionally NASA_API_KEY / OPENAI_API_KEY
npm install
npm run dev          # runs on http://localhost:5001
```

**Frontend** (new terminal)

```bash
cd frontend
npm install
npm run dev          # runs on http://localhost:8080
```

Open **http://localhost:8080**. The Vite dev server proxies all `/api` requests to the backend automatically — no extra config needed.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | *(dev warning)* | Secret for signing JWTs |
| `PORT` | No | `5001` | Server port |
| `NODE_ENV` | No | `development` | Set to `production` to enforce JWT_SECRET |
| `NASA_API_KEY` | No | `DEMO_KEY` | NASA NeoWs API key (rate-limited without one) |
| `OPENAI_API_KEY` | No | — | OpenAI key for the AI impact narrative feature |
| `FRONTEND_URL` | No | `http://localhost:8080` | CORS allowed origin |

> **Generate a strong JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Frontend (`frontend/.env`)

No required variables for local dev. Optional overrides:

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Dev-server proxy target (default: `http://localhost:5001`) |
| `VITE_NASA_API_KEY` | NASA key for the 3D Solar System component |
| `VITE_SOCKET_URL` | Socket.io server URL override |

---

## API Reference

All protected routes require `Authorization: Bearer <token>` or the `token` httpOnly cookie.

### Auth — `POST /api/user/signup`
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
// → 201 { "success": true, "token": "..." }
```

### Auth — `POST /api/user/login`
```json
{ "email": "jane@example.com", "password": "secret123" }
// → 200 { "success": true, "token": "..." }
```

### NEO feed — `GET /api/feed`
```
?start_date=2026-02-01&end_date=2026-02-28   # date-range mode
?page=0&size=20&risk_level=high              # browse mode
```

### Asteroid detail — `GET /api/lookup/:asteroidId`

### Public stats — `GET /api/stats` (no auth)

### Watchlist — `GET /POST /DELETE /api/watchlist`

Full collection available in [`Cosmic-Watch-API.postman_collection.json`](Cosmic-Watch-API.postman_collection.json).

---

## Project Structure

```
cosmic-watch/
├── backend/
│   └── src/
│       ├── controllers/     authController · neoController · watchlistController · hypotheticalController
│       ├── middleware/       auth · error · validation
│       ├── models/           User · Watchlist
│       ├── routes/           authRoutes · neoRoutes · watchlistRoutes
│       ├── services/         nasaService (NASA API proxy + risk scoring + cache)
│       ├── utils/            database
│       ├── __tests__/        nasaService.test · auth.test (Node built-in test runner)
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/       3d/ · dashboard/ · ui/ (shadcn)
│       ├── hooks/            useAsteroidFeed · useWatchlist · useAlertSettings · …
│       ├── pages/            Landing · Login · Dashboard · Explorer · AsteroidInspection · Documentation
│       ├── services/         auth · socket · nasa
│       ├── utils/            impactScenario · orbitalPhysics
│       ├── lib/              apiClient · mapBackendAsteroid
│       ├── test/             mapBackendAsteroid.test · impactScenario.test
│       └── types/            asteroid
├── docker-compose.yml
├── docker-compose.mongo.yml  # MongoDB only (for local dev without Docker frontend)
└── Cosmic-Watch-API.postman_collection.json
```

---

## Testing

```bash
# Backend (Node built-in test runner — no extra dependencies)
cd backend && npm test

# Frontend (Vitest)
cd frontend && npm test
```

Both suites run without a live database or API key.

---

## Deployment Notes

- Set `NODE_ENV=production` — the server enforces `JWT_SECRET` and stops with a clear error if it is missing.
- Set `FRONTEND_URL` to your actual domain so CORS is properly restricted.
- `DEMO_KEY` for NASA is heavily rate-limited (30 req/hour). Register a free key at https://api.nasa.gov.
- The in-memory Socket.io chat store is reset on restart — acceptable for a single-instance deployment.

---

## Known Limitations

- Chat history is in-memory; messages are lost when the server restarts.
- The 3D Solar System uses simplified Keplerian elements for asteroid positions (good enough for visualization, not precision tracking).
- No email verification on signup.

---

## Development Notes

See [`AI-LOG.md`](AI-LOG.md) for a transparent account of how AI tools (Claude, Lovable, Cursor, Copilot) were used during development.

---

## License

MIT
