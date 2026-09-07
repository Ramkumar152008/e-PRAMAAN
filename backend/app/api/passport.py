"""
Bidder Compliance Passport API Router
e-BID PRAMAAN — CPCL
Generates reusable statutory compliance passports with tender validity checks.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Bidder, Tender
from app.services.passport_service import PassportService

router = APIRouter(prefix="/bidders", tags=["Bidder Compliance Passport"])

@router.get("/{bidder_id}/passport")
def get_bidder_compliance_passport(
    bidder_id: str,
    tenderId: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retrieves full standardized Bidder Compliance Passport with verified statutory credentials.
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    tender_dict = None
    if tenderId or bidder.tenderId:
        target_tid = tenderId or bidder.tenderId
        t = db.query(Tender).filter((Tender.id == target_tid) | (Tender.gemBidNo == target_tid)).first()
        if t:
            tender_dict = {
                "id": t.id,
                "gemBidNo": t.gemBidNo,
                "title": t.title,
                "bidEndDate": t.bidEndDate or "2026-08-10"
            }

    bidder_dict = {
        "id": bidder.id,
        "name": bidder.name,
        "cin": bidder.cin,
        "pan": bidder.pan,
        "gstin": bidder.gstin,
        "udyamNo": bidder.udyamNo,
        "claimedTurnover": bidder.claimedTurnover,
        "verifiedTurnover": bidder.verifiedTurnover,
        "claimedAddress": bidder.claimedAddress,
        "verifiedAddress": bidder.verifiedAddress,
        "oemAuth": bidder.oemAuth or {},
        "riskProfile": bidder.riskProfile or {}
    }

    passport = PassportService.generate_bidder_passport(bidder=bidder_dict, tender=tender_dict)
    return passport
