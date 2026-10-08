# Runtime clause detector: tries to use a fine-tuned HF model if available, otherwise falls back to keyword matching.
import os
try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    MODEL_DIR = os.getenv('CLAUSE_MODEL_DIR', 'clause_model')
    if os.path.isdir(MODEL_DIR):
        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    else:
        tokenizer = None
        model = None
except Exception:
    tokenizer = None
    model = None

CLAUSE_KEYWORDS = {
    "confidentiality": ["confidential", "non-disclosure", "nda"],
    "indemnity": ["indemnif", "hold harmless"],
    "termination": ["terminate", "termination", "expiry", "expire"],
    "payment": ["payment", "payable", "amount", "fee"],
    "governing_law": ["governed by", "jurisdiction", "governing law"],
}

def detect_clauses(text):
    # If model available, chunk into sentences and run classifier
    if model is not None:
        from nltk import sent_tokenize
        sents = sent_tokenize(text)
        inputs = tokenizer(sents, truncation=True, padding=True, return_tensors='pt')
        with torch.no_grad():
            logits = model(**inputs).logits
        preds = logits.argmax(dim=-1).tolist()
        labels = ['confidentiality','indemnity','termination','payment','governing_law']
        clauses = []
        for sent, p in zip(sents, preds):
            clauses.append({'clause_type': labels[p], 'text': sent})
        return clauses
    # fallback keyword matching
    lines = text.splitlines()
    clauses = []
    for i, line in enumerate(lines):
        l = line.lower()
        for clause, keys in CLAUSE_KEYWORDS.items():
            if any(k in l for k in keys):
                clauses.append({
                    "clause_type": clause,
                    "text": line,
                    "line_no": i
                })
    return clauses
