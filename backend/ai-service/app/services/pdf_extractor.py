"""
PDF text extraction service.
Strategy:
  1. Try to extract text directly with PyMuPDF (fast, high quality for digital PDFs).
  2. If extracted text is below a threshold (likely scanned), fall back to Tesseract OCR.
"""
import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

# Allow overriding the Tesseract binary path via environment variable
tesseract_cmd = os.getenv("TESSERACT_CMD", "tesseract")
if tesseract_cmd != "tesseract":
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

# If extracted text has fewer characters per page than this, assume scanned
DIGITAL_CHARS_PER_PAGE_THRESHOLD = 100


def extract(pdf_path: str) -> dict:
    """
    Extract text from a PDF file.

    Returns a dict with keys:
      - text: str            — full extracted text
      - method: str          — 'digital' or 'ocr'
      - page_count: int
      - word_count: int
    """
    doc = fitz.open(pdf_path)
    page_count = len(doc)

    # Attempt digital extraction
    pages_text = []
    for page in doc:
        pages_text.append(page.get_text())
    doc.close()

    full_text = "\n".join(pages_text)
    avg_chars = len(full_text) / max(page_count, 1)

    if avg_chars >= DIGITAL_CHARS_PER_PAGE_THRESHOLD:
        return {
            "text": full_text,
            "method": "digital",
            "page_count": page_count,
            "word_count": len(full_text.split()),
        }

    # Fall back to OCR
    print(f"[pdf_extractor] Digital extraction weak ({avg_chars:.0f} chars/page) — using OCR")
    ocr_text = _ocr_extract(pdf_path, page_count)

    return {
        "text": ocr_text,
        "method": "ocr",
        "page_count": page_count,
        "word_count": len(ocr_text.split()),
    }


def _ocr_extract(pdf_path: str, page_count: int) -> str:
    """Convert PDF pages to images, then run Tesseract on each."""
    try:
        images = convert_from_path(pdf_path, dpi=300)
    except Exception as exc:
        raise RuntimeError(
            f"pdf2image failed to convert PDF for OCR. "
            f"Ensure Poppler is installed and on PATH. Detail: {exc}"
        )

    ocr_pages = []
    for i, img in enumerate(images):
        try:
            text = pytesseract.image_to_string(img, lang="eng")
            ocr_pages.append(text)
        except Exception as exc:
            print(f"[pdf_extractor] OCR failed on page {i + 1}: {exc}")
            ocr_pages.append("")

    return "\n".join(ocr_pages)
