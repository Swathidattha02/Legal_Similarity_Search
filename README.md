# AI Legal Case Similarity & Intelligent Legal Research Platform

A full-stack AI-assisted legal research web application for finding similar Indian court judgments.

---

## Architecture

```
React (Vite) ── port 5173
    ↓ REST
Express.js   ── port 5000
    ↓ HTTP
FastAPI      ── port 8000
    ↓
PyMuPDF / Tesseract  (PDF extraction & OCR)
InLegalBERT          (mean-pooled embeddings)
ChromaDB             (vector search)
BM25                 (keyword search)
RRF fusion           (hybrid ranking)
OpenAI GPT-3.5       (RAG summaries)
    ↓
MongoDB ── port 27017  (users, sessions, saved cases)
```

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | ≥ 18 | `node --version` |
| Python | 3.11 | Use `python`, not `python3`, on Windows |
| MongoDB | Any | Local or Atlas |
| Tesseract OCR | ≥ 5 | [Windows installer](https://github.com/UB-Mannheim/tesseract/wiki) |
| Poppler | Any | Required by pdf2image for OCR — [Windows](https://github.com/oschwartz10612/poppler-windows/releases) |

---

## Setup

### 1. Clone / open repository

```
Legal_Similarity_Search/
├── frontend/       ← React + Vite
├── backend/        ← Express API
└── backend/ai-service/  ← FastAPI AI service
```

### 2. Configure environment variables

Copy each `.env.example` to `.env` and fill in real values:

```bash
# Express backend
copy backend\.env.example backend\.env

# FastAPI AI service
copy backend\ai-service\.env.example backend\ai-service\.env

# Frontend
copy frontend\.env.example frontend\.env
```

Required values to set:
- `backend/.env` → `JWT_SECRET` (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- `backend/.env` → `MONGO_URI` (your MongoDB connection string)
- `backend/ai-service/.env` → `OPENAI_API_KEY`
- `backend/ai-service/.env` → `TESSERACT_CMD` (path to tesseract.exe)

### 3. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Express backend
cd ..\backend
npm install

# Python AI service (activate venv first)
cd ai-service
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

> **Note**: `transformers` + `torch` are installed separately in Phase 6 because of their size.

---

## Running the Application

Open **three terminals**:

**Terminal 1 — React frontend**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

**Terminal 2 — Express backend**
```bash
cd backend
npm run dev
# → http://localhost:5000
# Health: http://localhost:5000/health
```

**Terminal 3 — FastAPI AI service**
```bash
cd backend\ai-service
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
# → http://localhost:8000
# Health: http://localhost:8000/health
# API docs: http://localhost:8000/docs
```

---

## API Reference

### Express Backend (`localhost:5000`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Service health check |
| POST | `/api/v1/auth/register` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login, get JWT |
| GET | `/api/v1/auth/me` | JWT | Get current user |
| PUT | `/api/v1/auth/profile` | JWT | Update profile |
| POST | `/api/v1/research` | JWT | Start research session |
| GET | `/api/v1/research` | JWT | List research sessions |
| GET | `/api/v1/research/:id` | JWT | Get session with results |
| GET | `/api/v1/history` | JWT | Search history |
| DELETE | `/api/v1/history` | JWT | Clear history |
| GET | `/api/v1/saved-cases` | JWT | List saved cases |
| POST | `/api/v1/saved-cases` | JWT | Save a case |
| DELETE | `/api/v1/saved-cases/:id` | JWT | Remove saved case |
| PATCH | `/api/v1/saved-cases/:id/notes` | JWT | Update case notes |
| POST | `/api/v1/documents` | JWT | Upload PDF |
| GET | `/api/v1/documents` | JWT | List documents |
| GET | `/api/v1/documents/:id` | JWT | Get document details |

### FastAPI AI Service (`localhost:8000`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health |
| POST | `/api/v1/documents/extract` | Extract + index PDF |
| POST | `/api/v1/documents/index` | Index pre-extracted text |
| POST | `/api/v1/research/search` | Hybrid retrieval |
| POST | `/api/v1/research/summarize` | RAG summary |

---

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Repository inspection | ✅ Complete | Clean slate confirmed |
| 2 — Project foundation | ✅ Complete | Express, FastAPI, Vite scaffolded |
| 3 — Frontend UI | ✅ Complete | 9 responsive pages, AppShell, legal UI components |
| 4 — Auth & backend APIs | ✅ Complete | JWT auth, Mongoose models, research sessions, saved cases |
| 5 — PDF processing | ✅ Complete | PyMuPDF text extraction & OCR fallback pipeline |
| 6 — AI retrieval | ✅ Complete | InLegalBERT + ChromaDB vector store + BM25 RRF fusion |
| 7 — RAG summaries | ✅ Complete | Source-grounded RAG + judicial precedent synthesis |
| 8 — Integration & tests | ✅ Complete | End-to-end integration test suite passed 10/10 |
| 9 — Final docs & launch | ✅ Complete | Multi-service launcher, root package.json, documentation |

---

## Security Notes

- Passwords are hashed with bcrypt (12 rounds).
- JWT tokens are signed with a secret key stored in `.env`.
- Uploaded PDFs are renamed with UUIDs to prevent path traversal.
- CORS is restricted to the configured frontend origin.
- `.env` files are in `.gitignore` — never committed.
- The OpenAI API key is server-side only — never sent to the frontend.

---

## Disclaimer

This platform is a research-assistance tool. It does not predict judicial outcomes and does not constitute legal advice. Retrieved judgments and generated summaries should be independently verified.
