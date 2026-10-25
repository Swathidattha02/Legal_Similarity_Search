"""
Research API router.
POST /api/v1/research/search    — hybrid retrieval by text query
POST /api/v1/research/summarize — RAG summary over retrieved cases
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import SearchRequest, SearchResponse, SummarizeRequest, SummarizeResponse
from app.services import retriever, rag

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    Perform hybrid (semantic + keyword) retrieval for the given legal query.
    Returns ranked results with similarity scores.
    """
    if not request.query_text or not request.query_text.strip():
        raise HTTPException(status_code=400, detail="query_text must not be empty")

    try:
        results = retriever.hybrid_search(
            query_text=request.query_text,
            top_k=request.top_k or 10,
        )
        return SearchResponse(success=True, results=results)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(exc)}")


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """
    Generate a source-grounded RAG summary for the query and retrieved cases.
    The LLM is explicitly instructed not to invent facts or citations.
    """
    if not request.cases:
        raise HTTPException(status_code=400, detail="At least one case is required for summarisation")

    try:
        summary = await rag.generate_summary(
            query_text=request.query_text,
            cases=request.cases,
        )
        return SummarizeResponse(success=True, ragSummary=summary)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Summarisation failed: {str(exc)}")
