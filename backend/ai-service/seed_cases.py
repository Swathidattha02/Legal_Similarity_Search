"""
Seed Landmark Indian Court Judgments into ChromaDB.
Run this script to index authentic Supreme Court judgments into the vector database:
    python seed_cases.py
"""
import sys
import os

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.seed_data import get_all_seed_cases
from app.services.preprocessor import chunk_text
from app.services.vector_store import index_chunks, _get_collection


def main():
    print("\n[*] Seeding Landmark Indian Court Judgments into ChromaDB...")
    collection = _get_collection()
    initial_count = collection.count()
    print(f"📊  Initial ChromaDB collection count: {initial_count}")

    cases = get_all_seed_cases()
    print(f"📚  Found {len(cases)} landmark cases to process.\n")

    total_chunks = 0
    for i, case in enumerate(cases, 1):
        doc_id = case["document_id"]
        title = case["case_title"]
        print(f"[{i}/{len(cases)}] Processing: {title}")

        chunks = chunk_text(case["text"], document_id=doc_id)
        # Augment chunk metadata with case title and year
        for chunk in chunks:
            chunk.metadata.update({
                "case_title": title,
                "court": case.get("court", "Supreme Court of India"),
                "year": case.get("year", 2020),
                "citation": case.get("citation", ""),
                "source_url": case.get("source_url", ""),
            })

        stored_ids = index_chunks(chunks, document_id=doc_id)
        total_chunks += len(stored_ids)
        print(f"     → Indexed {len(stored_ids)} chunks for '{doc_id}'")

    final_count = collection.count()
    print("\n[SUCCESS] Seeding complete!")
    print(f"[+] Total chunks indexed this session: {total_chunks}")
    print(f"[+] Total items in ChromaDB collection: {final_count}\n")


if __name__ == "__main__":
    main()
