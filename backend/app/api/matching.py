"""
Matching & Comparison API Router
e-BID PRAMAAN — CPCL
Executes Exact, Fuzzy (Levenshtein/Token), or Semantic Cosine Similarity algorithms.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import MatchingRequest, MatchingResponse
from app.services.matching_service import MatchingService

router = APIRouter(prefix="/matching", tags=["Matching & Comparison"])

@router.post("/compare", response_model=MatchingResponse)
def compare_matching_values(req: MatchingRequest):
    """
    Compares submitted bidder claim against verified reference registry value:
    Supports:
    - IDENTIFIER (Exact alphanumeric matching for PAN, GSTIN, Udyam, CIN)
    - NAME / ADDRESS (Fuzzy token and Levenshtein distance ratio)
    - SEMANTIC_TEXT (TF-IDF vector cosine similarity for tender clauses & technical declarations)
    """
    default_thresh = 0.35 if req.type.upper() in ["SEMANTIC", "SEMANTIC_TEXT"] else 0.75
    res = MatchingService.compare_fields(
        match_type=req.type,
        claim=req.claimedValue,
        reference=req.referenceValue,
        threshold=req.threshold if req.threshold is not None else default_thresh
    )
    return MatchingResponse(**res)
