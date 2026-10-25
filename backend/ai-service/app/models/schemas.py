"""Pydantic request/response schemas for all API endpoints."""
from pydantic import BaseModel, Field
from typing import Optional, List


# ── Search ──────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query_text: str = Field(..., min_length=3, max_length=5000)
    top_k: Optional[int] = Field(10, ge=1, le=50)


class CaseResult(BaseModel):
    caseId: str
    caseTitle: str
    court: Optional[str] = None
    year: Optional[int] = None
    citation: Optional[str] = None
    sourceUrl: Optional[str] = None
    similarityScore: float
    matchedChunks: List[str] = []
    summary: Optional[str] = None
    relevanceExplanation: Optional[str] = None
    statutes: List[str] = []


class SearchResponse(BaseModel):
    success: bool
    results: List[CaseResult] = []


# ── Summarise ────────────────────────────────────────────────────────────────

class SummarizeRequest(BaseModel):
    query_text: str = Field(..., min_length=3, max_length=5000)
    cases: List[CaseResult]


class SummarizeResponse(BaseModel):
    success: bool
    ragSummary: str


# ── Index ────────────────────────────────────────────────────────────────────

class IndexResponse(BaseModel):
    success: bool
    document_id: str
    chroma_ids: List[str]


# ── Chunk (internal) ─────────────────────────────────────────────────────────

class TextChunk(BaseModel):
    chunk_id: str
    document_id: str
    text: str
    chunk_index: int
    section_type: Optional[str] = None   # facts / arguments / ruling / statute / general
    metadata: dict = {}
