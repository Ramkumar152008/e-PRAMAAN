"""
RAG Procurement Knowledge Retrieval & Hallucination Guard Engine
e-BID PRAMAAN — CPCL
Performs grounded retrieval over statutory procurement manuals, GFR 2017, and CPCL tender clauses.
"""

from typing import Dict, Any, List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.knowledge.procurement_corpus import STATUTORY_KNOWLEDGE_BASE

class RAGService:
    @classmethod
    def search_knowledge_base(
        cls,
        query: str,
        tender_clauses: Optional[List[str]] = None,
        top_k: int = 3,
        threshold: float = 0.22
    ) -> Dict[str, Any]:
        """
        Grounded semantic search across statutory corpus and active tender clauses.
        Enforces Hallucination Guard: if similarity is below threshold, returns refusal with officer review recommendation.
        """
        if not query or len(query.strip()) < 3:
            return {
                "grounded": False,
                "confidence": 0.0,
                "answer": "Please provide a valid procurement compliance question.",
                "citations": [],
                "officerReviewRequired": True
            }

        # Build corpus texts
        corpus = []
        metadata = []

        for item in STATUTORY_KNOWLEDGE_BASE:
            text = f"{item['title']} {item['content']} {' '.join(item['keywords'])} {item['document']} {item['section']}"
            corpus.append(text)
            metadata.append({
                "id": item["id"],
                "document": item["document"],
                "authority": item["authority"],
                "section": item["section"],
                "page": item["page"],
                "title": item["title"],
                "snippet": item["content"][:280] + "...",
                "applicableClauses": item["applicableClauses"],
                "type": "STATUTORY_MANUAL"
            })

        # Add tender clauses if provided
        if tender_clauses:
            for idx, tc in enumerate(tender_clauses):
                corpus.append(tc)
                metadata.append({
                    "id": f"TENDER-CLAUSE-{idx+1}",
                    "document": "Active CPCL Tender Specifications",
                    "authority": "CPCL Materials & Contracts (M&C) Department",
                    "section": f"Clause Excerpt {idx+1}",
                    "page": 1,
                    "title": f"Tender Clause {idx+1}",
                    "snippet": tc,
                    "applicableClauses": [f"Clause {idx+1}"],
                    "type": "TENDER_SPECIFICATION"
                })

        # Vectorize using TF-IDF with unigrams + bigrams
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
            tfidf_matrix = vectorizer.fit_transform(corpus)
            query_vec = vectorizer.transform([query])
            similarities = cosine_similarity(query_vec, tfidf_matrix)[0]
        except Exception:
            return {
                "grounded": False,
                "confidence": 0.0,
                "answer": "Unable to index knowledge base. Deterministic officer review required.",
                "citations": [],
                "officerReviewRequired": True
            }

        ranked_indices = similarities.argsort()[::-1]
        top_matches = []

        for idx in ranked_indices:
            score = float(similarities[idx])
            if score >= threshold:
                match_meta = metadata[idx].copy()
                match_meta["relevanceScore"] = round(score, 4)
                top_matches.append(match_meta)
                if len(top_matches) >= top_k:
                    break

        # Hallucination Guard Check
        if not top_matches or top_matches[0]["relevanceScore"] < threshold:
            return {
                "grounded": False,
                "confidence": 0.0,
                "answer": (
                    "Insufficient verified evidence to provide a grounded answer. "
                    "The query does not match verified clauses in GFR 2017, Manual for Procurement of Goods, "
                    "or CPCL tender criteria. Officer review required."
                ),
                "citations": [],
                "officerReviewRequired": True
            }

        # Query term coverage verification
        query_words = [w.strip(".,;:?!'\"()[]") for w in query.lower().split() if len(w) > 3 and w not in ["what", "which", "where", "under", "with", "this", "that", "from", "have", "been", "does", "about"]]
        top_match = top_matches[0]
        match_text = (top_match["snippet"] + " " + top_match["title"] + " " + top_match["section"] + " " + top_match["document"]).lower()
        matched_query_words = [w for w in query_words if w in match_text]
        if len(query_words) >= 3 and len(matched_query_words) < 2:
            return {
                "grounded": False,
                "confidence": 0.0,
                "answer": (
                    "Insufficient verified evidence to provide a grounded answer. "
                    "The query does not match verified clauses in GFR 2017, Manual for Procurement of Goods, "
                    "or CPCL tender criteria. Officer review required."
                ),
                "citations": [],
                "officerReviewRequired": True
            }

        confidence = min(99.0, max(75.0, round(top_match["relevanceScore"] * 100 + 40, 1)))

        # Grounded structured answer formulation
        answer = (
            f"Based on {top_match['document']} ({top_match['section']}):\n\n"
            f"{top_match['snippet']}\n\n"
            f"Applicable Enforcement: This requirement governs {', '.join(top_match['applicableClauses'])}. "
            f"Compliance must be verified against official reference registers and statutory bid cutoff deadlines."
        )

        return {
            "grounded": True,
            "confidence": confidence,
            "answer": answer,
            "citations": top_matches,
            "officerReviewRequired": False
        }

    @classmethod
    def explain_finding(
        cls,
        finding: Dict[str, Any],
        tender: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generates a grounded explanation for a specific discrepancy finding,
        linking tender clause, statutory authority, evidence difference, and next officer action.
        """
        req = finding.get("requirement", "")
        fnd_text = finding.get("finding", "")
        claim = finding.get("claim", "")
        source = finding.get("verificationSource", "")
        why = finding.get("whyItMatters", "")

        query = f"{req} {fnd_text} {why}"
        tender_clauses = tender.get("rawClauses", []) if tender else []

        rag_result = cls.search_knowledge_base(query, tender_clauses=tender_clauses, top_k=2)

        return {
            "findingId": finding.get("id") or finding.get("findingId", "FND-01"),
            "requirement": req,
            "issueSummary": fnd_text,
            "bidderClaim": claim,
            "statutoryVerificationSource": source,
            "whyItMatters": why,
            "groundedExplanation": rag_result["answer"],
            "citations": rag_result["citations"],
            "confidence": rag_result["confidence"],
            "recommendedNextAction": finding.get("recommendedAction", "Dispatch formal clarification notice."),
            "officerAuthorityNote": "AI explanation provided for decision support. Procurement Officer retains sole statutory authority."
        }
