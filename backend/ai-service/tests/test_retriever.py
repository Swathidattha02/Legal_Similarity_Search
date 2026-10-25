import unittest
from unittest.mock import patch

from app.models.schemas import CaseResult
from app.services import retriever, vector_store


def chunk(chunk_id, document_id, text, similarity=None, **metadata):
    result = {
        "id": chunk_id,
        "text": text,
        "metadata": {"document_id": document_id, **metadata},
    }
    if similarity is not None:
        result["similarity"] = similarity
    return result


class RetrieverTests(unittest.TestCase):
    def test_bm25_can_retrieve_outside_semantic_candidates(self):
        semantic = [chunk("semantic-1", "case-a", "unrelated dense candidate", 0.9)]
        corpus = [
            semantic[0],
            chunk("keyword-1", "case-b", "exact section 138 negotiable instrument keyword"),
        ]

        with patch.object(retriever, "semantic_search", return_value=semantic), patch.object(
            retriever, "get_indexed_chunks", return_value=corpus
        ):
            results = retriever.hybrid_search("section 138 negotiable instrument", top_k=5)

        self.assertEqual({"case-a", "case-b"}, {result.caseId for result in results})
        case_b = next(result for result in results if result.caseId == "case-b")
        self.assertIn("exact section 138", case_b.matchedChunks[0])

    def test_rrf_fuses_same_chunk_without_overwriting_sibling_chunks(self):
        first = chunk("case-a_chunk_0", "case-a", "passage one", 0.8, case_title="Case A")
        second = chunk("case-a_chunk_1", "case-a", "passage two", 0.7, section_type="statutes")
        fused = retriever._rrf_fuse([first, second], [second, first])

        by_id = {item["id"]: item for item in fused}
        self.assertEqual(2, len(by_id))
        self.assertGreater(
            by_id[first["id"]]["rrf_score"],
            0.6 / (retriever.RRF_K + 1),
        )
        self.assertEqual("Case A", by_id[first["id"]]["metadata"]["case_title"])
        self.assertEqual("passage two", by_id[second["id"]]["text"])

    def test_case_order_uses_best_fused_score_and_preserves_passages_metadata(self):
        fused = [
            chunk("case-a_chunk_0", "case-a", "dense winner but lower fusion", 0.99,
                  case_title="Case A", court="Court A"),
            chunk("case-b_chunk_0", "case-b", "top fused passage", 0.4,
                  case_title="Case B", citation="Citation B"),
            chunk("case-b_chunk_1", "case-b", "supporting passage", 0.3,
                  section_type="statutes"),
        ]
        fused[0]["rrf_score"] = 0.01
        fused[1]["rrf_score"] = 0.03
        fused[2]["rrf_score"] = 0.02

        cases = retriever._group_by_case(fused)

        self.assertEqual(["case-b", "case-a"], [case.caseId for case in cases])
        self.assertEqual("Citation B", cases[0].citation)
        self.assertEqual(
            ["top fused passage", "supporting passage"],
            cases[0].matchedChunks,
        )
        self.assertEqual(0.4, cases[0].similarityScore)
        self.assertNotIn("rankingScore", cases[0].model_dump())

    def test_duplicate_passages_and_missing_metadata_are_handled_deterministically(self):
        fused = [
            {"id": "same-1", "text": "duplicate passage", "metadata": {}, "rrf_score": 0.02},
            {"id": "same-2", "text": "duplicate passage", "metadata": {}, "rrf_score": 0.01},
        ]

        cases = retriever._group_by_case(fused)

        self.assertEqual(2, len(cases))
        self.assertEqual(["same-1", "same-2"], [case.caseId for case in cases])
        self.assertEqual([["duplicate passage"], ["duplicate passage"]],
                         [case.matchedChunks for case in cases])

    def test_bm25_ignores_nonmatching_records_and_breaks_ties_by_id(self):
        corpus = [
            chunk("z", "case-z", "section 42 legal rule"),
            chunk("a", "case-a", "section 42 legal rule"),
            chunk("none", "case-none", "privacy constitutional doctrine"),
        ]

        results = retriever._bm25_search("section 42", corpus, top_k=10)

        self.assertEqual(["a", "z"], [item["id"] for item in results])

    def test_duplicate_chunk_ids_do_not_consume_fusion_ranks(self):
        duplicated = chunk("same", "case-a", "same passage", 0.9)
        next_item = chunk("next", "case-b", "next passage", 0.8)

        fused = retriever._rrf_fuse([duplicated, duplicated, next_item], [])

        self.assertEqual(["same", "next"], [item["id"] for item in fused])
        self.assertAlmostEqual(0.6 / (retriever.RRF_K + 2), fused[1]["rrf_score"])

    def test_vector_store_helpers_preserve_chroma_ids_without_mutation(self):
        class FakeCollection:
            def count(self):
                return 2

            def get(self, include):
                return {
                    "ids": ["b", "a"],
                    "documents": ["passage b", "passage a"],
                    "metadatas": [{"document_id": "case-b"}, None],
                }

            def query(self, **_kwargs):
                return {
                    "ids": [["b"]],
                    "documents": [["passage b"]],
                    "metadatas": [[{"document_id": "case-b"}]],
                    "distances": [[0.2]],
                }

        with patch.object(vector_store, "_get_collection", return_value=FakeCollection()), patch.object(
            vector_store, "embed_single", return_value=[0.0]
        ):
            indexed = vector_store.get_indexed_chunks()
            semantic = vector_store.semantic_search("query", top_k=1)

        self.assertEqual(["a", "b"], [record["id"] for record in indexed])
        self.assertEqual({}, indexed[0]["metadata"])
        self.assertEqual("b", semantic[0]["id"])
        self.assertEqual("passage b", semantic[0]["text"])

    def test_empty_retrieval_uses_existing_seed_fallback(self):
        fallback = [CaseResult(caseId="seed", caseTitle="Seed", similarityScore=0.55)]
        with patch.object(retriever, "semantic_search", return_value=[]), patch.object(
            retriever, "get_indexed_chunks", return_value=[]
        ), patch.object(retriever, "_search_seed_cases", return_value=fallback) as seed_search:
            results = retriever.hybrid_search("unindexed query", top_k=1)

        self.assertEqual(fallback, results)
        seed_search.assert_called_once_with("unindexed query", top_k=1)


if __name__ == "__main__":
    unittest.main()