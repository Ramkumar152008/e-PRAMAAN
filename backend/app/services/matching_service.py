"""
Matching & Comparison Engine
e-BID PRAMAAN — CPCL
Implements Exact Matching, Token/Fuzzy Normalization with Indian Corporate Suffix Expansion, and Procurement Domain Semantic Similarity.
"""

import re
from typing import Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Indian Corporate Legal Form Normalization Dictionary
CORPORATE_SYNONYMS = {
    r"\bpvt\.?\s*ltd\.?\b": "private limited",
    r"\bpvt\b": "private",
    r"\bltd\.?\b": "limited",
    r"\bco\.?\b": "company",
    r"\bcorp\.?\b": "corporation",
    r"\binc\.?\b": "incorporated",
    r"\bllp\b": "limited liability partnership",
    r"\bopc\b": "one person company"
}

# Procurement & Statutory Domain Ontology Clusters
DOMAIN_CLUSTERS = {
    "oem_authorization": ["oem", "manufacturer", "parent", "subsidiary", "authorization", "authorized", "maf", "distributor", "warranty", "mandate"],
    "financial_turnover": ["turnover", "revenue", "financials", "audited", "balance", "aoc4", "ca", "udin", "receipts"],
    "quality_standards": ["iso", "accreditation", "certificate", "certification", "valid", "active", "quality", "standard", "peso", "atex"],
    "local_content": ["local", "content", "domestic", "value", "addition", "make in india", "class-i", "class 1", "mii", "dpiit"],
    "statutory_tax": ["gst", "gstin", "pan", "tax", "cbdt", "income tax", "returns", "gstr3b", "regular", "filing"]
}

def normalize_text(text: str) -> str:
    """Normalizes string: expands abbreviations, removes punctuation, lowercases."""
    if not text:
        return ""
    text = text.lower().strip()
    for pattern, replacement in CORPORATE_SYNONYMS.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def levenshtein_distance(s1: str, s2: str) -> int:
    """Calculates Levenshtein edit distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def fuzzy_ratio(s1: str, s2: str) -> float:
    """Calculates fuzzy similarity ratio between 0.0 and 1.0."""
    norm1 = normalize_text(s1)
    norm2 = normalize_text(s2)
    if not norm1 and not norm2:
        return 1.0
    if not norm1 or not norm2:
        return 0.0
    if norm1 == norm2:
        return 1.0
    
    tokens1 = " ".join(sorted(norm1.split()))
    tokens2 = " ".join(sorted(norm2.split()))
    if tokens1 == tokens2:
        return 0.98

    max_len = max(len(norm1), len(norm2))
    dist = levenshtein_distance(norm1, norm2)
    char_sim = max(0.0, 1.0 - (dist / max_len))

    set1, set2 = set(norm1.split()), set(norm2.split())
    jaccard = len(set1 & set2) / max(1, len(set1 | set2))

    return round((char_sim * 0.4) + (jaccard * 0.6), 4)

class MatchingService:
    @classmethod
    def exact_match(cls, val1: str, val2: str) -> Tuple[bool, float]:
        """Exact case-insensitive alphanumeric matching for statutory identifiers."""
        clean1 = re.sub(r"[\s\-_]", "", str(val1).upper())
        clean2 = re.sub(r"[\s\-_]", "", str(val2).upper())
        is_match = (clean1 == clean2) and (len(clean1) > 0)
        return is_match, 1.0 if is_match else 0.0

    @classmethod
    def fuzzy_match(cls, val1: str, val2: str, threshold: float = 0.75) -> Tuple[bool, float, str]:
        """Token & Levenshtein similarity comparison for legal names and addresses."""
        ratio = fuzzy_ratio(str(val1), str(val2))
        is_match = ratio >= threshold
        if ratio >= 0.90:
            status = "MATCHED"
        elif ratio >= threshold:
            status = "POTENTIAL_MATCH"
        else:
            status = "MISMATCH"
        return is_match, ratio, status

    @classmethod
    def semantic_similarity(cls, text1: str, text2: str, threshold: float = 0.25) -> Tuple[bool, float, str]:
        """Domain ontology-aware semantic similarity for procurement clauses and certificates."""
        if not text1 or not text2:
            return False, 0.0, "MISMATCH"
        
        norm1 = normalize_text(text1)
        norm2 = normalize_text(text2)

        if norm1 == norm2:
            return True, 1.0, "MATCHED"

        words1 = set(norm1.split())
        words2 = set(norm2.split())

        # 1. Stem matching
        stems1 = {w[:5] for w in words1 if len(w) > 3}
        stems2 = {w[:5] for w in words2 if len(w) > 3}
        stem_overlap = len(stems1 & stems2) / max(1, min(len(stems1), len(stems2)))

        # 2. Domain ontology cluster alignment
        cluster_scores = []
        for cluster, terms in DOMAIN_CLUSTERS.items():
            cluster_terms = set(terms)
            overlap1 = len(words1 & cluster_terms) or len(stems1 & {t[:5] for t in terms})
            overlap2 = len(words2 & cluster_terms) or len(stems2 & {t[:5] for t in terms})
            if overlap1 > 0 and overlap2 > 0:
                cluster_scores.append(min(overlap1, overlap2) / max(overlap1, overlap2))

        domain_align = max(cluster_scores) if cluster_scores else 0.0

        # 3. TF-IDF Cosine similarity
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2)).fit_transform([norm1, norm2])
            tfidf_sim = float(cosine_similarity(vectorizer.toarray())[0][1])
        except Exception:
            tfidf_sim = 0.0

        # Weighted final semantic score
        combined_score = round(max(tfidf_sim, stem_overlap * 0.7, domain_align * 0.85, (stem_overlap * 0.5) + (domain_align * 0.5)), 4)
        is_match = combined_score >= threshold
        status = "MATCHED" if combined_score >= 0.70 else "POTENTIAL_MATCH" if combined_score >= threshold else "MISMATCH"

        return is_match, combined_score, status

    @classmethod
    def compare_fields(cls, match_type: str, claim: str, reference: str, threshold: float = 0.75) -> Dict[str, Any]:
        """Unified matching pipeline dispatcher."""
        norm_claim = normalize_text(claim)
        norm_ref = normalize_text(reference)

        if match_type.upper() == "IDENTIFIER":
            is_match, score = cls.exact_match(claim, reference)
            status = "MATCHED" if is_match else "CONFLICT"
            details = "Deterministic exact alphanumeric match on official identifier." if is_match else "Identifier value differs from reference registry."
        elif match_type.upper() in ["NAME", "ADDRESS"]:
            is_match, score, status = cls.fuzzy_match(claim, reference, threshold)
            details = f"Fuzzy token similarity score: {round(score * 100, 1)}%. Legal entity tokens aligned." if is_match else f"Low token alignment ({round(score * 100, 1)}%). Officer review required."
        else: # SEMANTIC
            is_match, score, status = cls.semantic_similarity(claim, reference, threshold or 0.25)
            details = f"Semantic similarity: {round(score * 100, 1)}%. Technical meaning aligns with clause." if is_match else "Semantic variance detected. Officer verification required."

        return {
            "matchType": match_type.upper(),
            "score": round(score, 4),
            "isMatch": is_match,
            "status": status,
            "details": details,
            "normalizedClaim": norm_claim,
            "normalizedReference": norm_ref
        }
