"""
FastAPI AI service entry point.
Exposes: /health, /api/v1/documents/*, /api/v1/research/*
"""
from dotenv import load_dotenv
load_dotenv()  # must be first before any other imports that read env vars

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, documents, research

app = FastAPI(
    title="Legal Research AI Service",
    description=(
        "PDF extraction, OCR, legal text embeddings, "
        "hybrid retrieval, and RAG summarisation for the "
        "AI Legal Case Similarity Platform."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS — allow only the Express backend in production
allowed_origins = [
    os.getenv("EXPRESS_BACKEND_URL", "http://localhost:5000"),
    "http://localhost:5173",  # Vite dev server (for direct testing)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers
app.include_router(health.router)
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(research.router, prefix="/api/v1/research", tags=["research"])


@app.on_event("startup")
async def startup_event():
    port = os.getenv("PORT", 8000)
    print(f"\n[AI Service] FastAPI started. Docs: http://localhost:{port}/docs\n")
