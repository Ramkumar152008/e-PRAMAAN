"""
Temporal Validation API Router
e-BID PRAMAAN — CPCL
Evaluates validity of statutory and quality certificates on statutory Bid Cut-off Date.
"""

from fastapi import APIRouter
from app.schemas.schemas import TemporalValidationRequest, TemporalValidationResponse
from app.services.temporal_service import TemporalValidationService

router = APIRouter(prefix="/temporal", tags=["Temporal Validation"])

@router.post("/validate", response_model=TemporalValidationResponse)
def validate_temporal_certificate(req: TemporalValidationRequest):
    """
    Validates: valid_from <= bid_cutoff_date <= valid_until
    Returns: VALID AT BID DATE, EXPIRED AT BID DATE, NOT YET VALID, MANUAL REVIEW REQUIRED
    """
    res = TemporalValidationService.validate_bid_date_compliance(
        valid_until_str=req.validUntil,
        bid_cutoff_str=req.bidCutoffDate,
        valid_from_str=req.validFrom,
        doc_name=req.documentName
    )
    return TemporalValidationResponse(**res)
