"""
Documents API router.
POST /api/v1/documents/extract  — extract text from an uploaded PDF
POST /api/v1/documents/index    — index a document into ChromaDB
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os

from app.services import pdf_extractor, preprocessor, vector_store
from app.models.schemas import IndexResponse

router = APIRouter()


@router.post("/extract")
async def extract_document(
    file: UploadFile = File(...),
    document_id: str = Form(...),
):
    """
    Accepts a PDF upload, extracts text (with OCR fallback for scanned PDFs),
    preprocesses and chunks the text, and indexes it into ChromaDB.
    Returns extraction metadata and ChromaDB document IDs.
    """
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    # Save to a temp file — we need a path for PyMuPDF and Tesseract
    suffix = ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # 1. Extract text
        extraction_result = pdf_extractor.extract(tmp_path)

        if not extraction_result["text"].strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract any text from the PDF. The file may be corrupt or image-only without OCR support configured.",
            )

        # 2. Clean and chunk
        chunks = preprocessor.chunk_text(extraction_result["text"], document_id=document_id)

        # 3. Index into ChromaDB
        chroma_ids = vector_store.index_chunks(chunks, document_id=document_id)

        return JSONResponse({
            "success": True,
            "documentId": document_id,
            "extractionMethod": extraction_result["method"],
            "pageCount": extraction_result["page_count"],
            "wordCount": extraction_result["word_count"],
            "chunkCount": len(chunks),
            "chromaDocumentIds": chroma_ids,
            "extractedText": extraction_result["text"],
        })

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(exc)}")
    finally:
        # Always clean up the temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.post("/index", response_model=IndexResponse)
async def index_document(document_id: str, text: str):
    """
    Index pre-extracted text into ChromaDB.
    Used by the dataset ingestion pipeline.
    """
    try:
        chunks = preprocessor.chunk_text(text, document_id=document_id)
        chroma_ids = vector_store.index_chunks(chunks, document_id=document_id)
        return IndexResponse(success=True, document_id=document_id, chroma_ids=chroma_ids)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
