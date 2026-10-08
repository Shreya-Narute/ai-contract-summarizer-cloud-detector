# Lazy-loaded summarization pipeline.
#
# The HuggingFace model (~1 GB) is downloaded and loaded on the FIRST call to
# chunked_summarize(), not at import time.  This prevents the backend and
# Celery worker from blocking or crashing during startup if the model is
# unavailable (no internet, slow network, disk full, etc.).
#
# After the first successful load the pipeline object is cached in
# _summarizer_cache so subsequent calls reuse it without reloading.

_summarizer_cache = None   # None  → not yet attempted
_summarizer_tried = False  # True  → load was attempted (success or failure)


def _get_summarizer():
    """Return the cached pipeline, loading it on first call. Returns None on failure."""
    global _summarizer_cache, _summarizer_tried
    if _summarizer_tried:
        return _summarizer_cache
    _summarizer_tried = True
    try:
        from transformers import pipeline
        _summarizer_cache = pipeline(
            "summarization",
            model="sshleifer/distilbart-cnn-12-6",
        )
    except Exception:
        _summarizer_cache = None
    return _summarizer_cache


def chunked_summarize(text: str, max_chunk: int = 1000) -> str:
    if not text:
        return ""

    summarizer = _get_summarizer()

    if summarizer is None:
        # Fallback: return first 3 paragraphs as an extractive summary.
        parts = text.split("\n\n")
        return "\n\n".join(parts[:3])

    chunks = [text[i:i + max_chunk] for i in range(0, len(text), max_chunk)]
    results = []
    for chunk in chunks:
        try:
            res = summarizer(
                chunk,
                max_length=120,
                min_length=30,
                do_sample=False,
            )[0]["summary_text"]
        except Exception:
            res = chunk[:400]
        results.append(res)

    return "\n\n".join(results)
