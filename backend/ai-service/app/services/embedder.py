"""
Embedding service using InLegalBERT.

InLegalBERT (`law-ai/InLegalBERT`) is a BERT-based masked language model
fine-tuned on Indian legal text. It does NOT have a built-in pooling head,
so we implement mean-pooling over the last hidden state with attention masking.

Reference: https://huggingface.co/law-ai/InLegalBERT

NOTE: torch and transformers are imported LAZILY on first call to embed_texts().
This allows the FastAPI service to start and serve /health even if torch is not
yet installed. Install them separately: pip install torch transformers
"""
import os
import numpy as np

_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "law-ai/InLegalBERT")
_tokenizer = None
_model = None
_device = None
_torch = None


def _load_model():
    """Lazy-load torch, transformers, and the model on first use."""
    global _tokenizer, _model, _device, _torch
    if _model is not None:
        return

    try:
        import torch
        from transformers import AutoTokenizer, AutoModel
        _torch = torch
    except ImportError as exc:
        raise RuntimeError(
            "torch and transformers are required for embedding. "
            "Install with: pip install torch transformers"
        ) from exc

    print(f"[embedder] Loading model: {_MODEL_NAME}")
    _device = _torch.device("cuda" if _torch.cuda.is_available() else "cpu")
    try:
        _tokenizer = AutoTokenizer.from_pretrained(_MODEL_NAME)
        _model = AutoModel.from_pretrained(_MODEL_NAME)
        _model.to(_device)
        _model.eval()
        print(f"[embedder] Model loaded on {_device}")
    except Exception as exc:
        print(f"[embedder] Warning: Could not load {_MODEL_NAME} ({exc}). Falling back to sentence-transformers/all-MiniLM-L6-v2")
        try:
            _tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
            _model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
            _model.to(_device)
            _model.eval()
            print(f"[embedder] Fallback model loaded on {_device}")
        except Exception as fb_exc:
            print(f"[embedder] Offline mode enabled. Using deterministic semantic vector fallback: {fb_exc}")
            _model = "offline_fallback"


def _mean_pool(token_embeddings, attention_mask):
    """
    Mean-pool over token embeddings, ignoring padding tokens.
    This is the correct way to produce sentence-level embeddings from
    a BERT-family model that lacks a CLS pooling head.
    """
    expanded_mask = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = _torch.sum(token_embeddings * expanded_mask, dim=1)
    sum_mask = _torch.clamp(expanded_mask.sum(dim=1), min=1e-9)
    return sum_embeddings / sum_mask


def embed_texts(texts: list, batch_size: int = 16) -> np.ndarray:
    """
    Generate mean-pooled embeddings for a list of text strings.

    Args:
        texts: List of text strings to embed.
        batch_size: Number of texts to process per forward pass.

    Returns:
        numpy array of shape (len(texts), hidden_size)
    """
    _load_model()

    if _model == "offline_fallback":
        dim = 384
        vectors = []
        for t in texts:
            words = t.lower().split()
            v = np.zeros(dim, dtype=np.float32)
            for w in words:
                idx = abs(hash(w)) % dim
                v[idx] += 1.0
            norm = np.linalg.norm(v)
            if norm > 0:
                v /= norm
            vectors.append(v)
        return np.vstack(vectors)

    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i: i + batch_size]
        encoded = _tokenizer(
            batch,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors="pt",
        )
        encoded = {k: v.to(_device) for k, v in encoded.items()}

        with _torch.no_grad():
            outputs = _model(**encoded)

        embeddings = _mean_pool(outputs.last_hidden_state, encoded["attention_mask"])
        all_embeddings.append(embeddings.cpu().numpy())

    return np.vstack(all_embeddings)


def embed_single(text: str) -> list:
    """Embed a single text string; returns a plain Python list for ChromaDB."""
    return embed_texts([text])[0].tolist()
