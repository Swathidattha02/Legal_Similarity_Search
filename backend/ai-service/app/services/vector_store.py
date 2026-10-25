"""
ChromaDB vector store wrapper.
Manages a single persistent collection for all indexed legal judgment chunks.
"""
import os
import chromadb
from typing import List
from app.models.schemas import TextChunk
from app.services.embedder import embed_texts, embed_single

_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "legal_judgments")

_client = None
_collection = None


def _get_collection():
    """Lazy-init the ChromaDB client and collection."""
    global _client, _collection
    if _collection is not None:
        return _collection

    os.makedirs(_PERSIST_DIR, exist_ok=True)
    _client = chromadb.PersistentClient(
        path=_PERSIST_DIR,
        settings=chromadb.Settings(anonymized_telemetry=False),
    )

    _collection = _client.get_or_create_collection(
        name=_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},  # use cosine distance
    )
    print(f"[vector_store] ChromaDB collection '{_COLLECTION_NAME}' ready ({_collection.count()} docs)")
    return _collection


def index_chunks(chunks: List[TextChunk], document_id: str) -> List[str]:
    """
    Embed and store a list of text chunks in ChromaDB.
    Returns the list of stored IDs.
    """
    if not chunks:
        return []

    collection = _get_collection()
    texts = [c.text for c in chunks]
    ids = [c.chunk_id for c in chunks]
    metadatas = [c.metadata for c in chunks]

    embeddings = embed_texts(texts)

    collection.upsert(
        ids=ids,
        embeddings=embeddings.tolist(),
        documents=texts,
        metadatas=metadatas,
    )
    return ids


def get_indexed_chunks() -> List[dict]:
    """Return all indexed chunk IDs, text, and metadata without changing the collection."""
    collection = _get_collection()
    if collection.count() == 0:
        return []

    records = collection.get(include=["documents", "metadatas"])
    chunks = []
    for chunk_id, text, metadata in zip(
        records.get("ids", []),
        records.get("documents", []),
        records.get("metadatas", []),
    ):
        if chunk_id is None or text is None:
            continue
        chunks.append({
            "id": chunk_id,
            "text": text,
            "metadata": metadata or {},
        })

    return sorted(chunks, key=lambda chunk: chunk["id"])


def semantic_search(query_text: str, top_k: int = 10) -> List[dict]:
    """
    Perform cosine-similarity search against the ChromaDB collection.
    Returns a list of result dicts with text, metadata, and distance.
    """
    collection = _get_collection()

    if collection.count() == 0:
        return []

    query_embedding = embed_single(query_text)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    output = []
    for chunk_id, text, meta, dist in zip(
        results["ids"][0],
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        output.append({
            "id": chunk_id,
            "text": text,
            "metadata": meta or {},
            "distance": dist,
            # Convert cosine distance [0,2] to similarity [0,1]
            "similarity": round(1 - dist / 2, 4),
        })

    return output
