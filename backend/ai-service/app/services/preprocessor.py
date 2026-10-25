"""
Text preprocessing and chunking service.
Cleans extracted legal text and splits it into overlapping chunks
suitable for embedding and retrieval.
"""
import re
import uuid
from typing import List
from app.models.schemas import TextChunk


# Target chunk sizes (in tokens, approximated by word count)
CHUNK_SIZE_WORDS = 200
CHUNK_OVERLAP_WORDS = 40

# Regex patterns for legal section detection
SECTION_PATTERNS = {
    "facts": re.compile(r"\b(facts?\s+of\s+the\s+case|statement\s+of\s+facts?)\b", re.I),
    "arguments": re.compile(r"\b(arguments?\s+of|submissions?\s+of|contended\s+that)\b", re.I),
    "ruling": re.compile(r"\b(held\s+(that)?|order[edly]|judgment|disposed\s+of)\b", re.I),
    "statutes": re.compile(r"\b(section\s+\d+|article\s+\d+|act,?\s+\d{4})\b", re.I),
}


def clean_text(text: str) -> str:
    """Remove boilerplate noise from extracted legal text."""
    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Remove form-feed characters from PDF extraction
    text = text.replace("\x0c", "\n")
    # Normalize whitespace inside lines
    text = "\n".join(" ".join(line.split()) for line in text.split("\n"))
    return text.strip()


def detect_section(text_fragment: str) -> str:
    """Heuristically detect the legal section type of a chunk."""
    for section_type, pattern in SECTION_PATTERNS.items():
        if pattern.search(text_fragment):
            return section_type
    return "general"


def chunk_text(text: str, document_id: str) -> List[TextChunk]:
    """
    Clean and split text into overlapping chunks.
    Each chunk retains the document_id and a detected section type.
    """
    cleaned = clean_text(text)
    words = cleaned.split()

    if not words:
        return []

    chunks: List[TextChunk] = []
    step = CHUNK_SIZE_WORDS - CHUNK_OVERLAP_WORDS
    index = 0

    for start in range(0, len(words), step):
        chunk_words = words[start: start + CHUNK_SIZE_WORDS]
        if not chunk_words:
            break

        chunk_text_str = " ".join(chunk_words)
        section_type = detect_section(chunk_text_str)
        chunk_id = f"{document_id}_chunk_{index}"

        chunks.append(
            TextChunk(
                chunk_id=chunk_id,
                document_id=document_id,
                text=chunk_text_str,
                chunk_index=index,
                section_type=section_type,
                metadata={
                    "document_id": document_id,
                    "chunk_index": index,
                    "section_type": section_type,
                    "word_count": len(chunk_words),
                },
            )
        )
        index += 1

    return chunks
