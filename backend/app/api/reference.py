"""
Reference Verification API Router
e-BID PRAMAAN — CPCL
Executes 13 modular reference source adapters for controlled statutory registry verification.
"""

from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Bidder
from app.services.reference_adapters import ReferenceAdapters

router = APIRouter(prefix="/reference", tags=["Reference Adapters"])

@router.post("/verify")
def verify_reference_sources(
    bidderId: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Runs multi-source verification across 13 statutory registries:
    Udyam, GSTN, PAN, MCA21, EPFO, ESIC, Startup India, NSIC, OEM Gateway, DigiLocker, Make in India, BIS, Debarment.
    """
    bidder = db.query(Bidder).filter(Bidder.id == bidderId).first()
    if not bidder:
        raise HTTPException(status_code=404, detail=f"Bidder {bidderId} not found")

    bidder_dict = {
        "id": bidder.id,
        "name": bidder.name,
        "cin": bidder.cin,
        "pan": bidder.pan,
        "gstin": bidder.gstin,
        "udyamNo": bidder.udyamNo,
        "claimedTurnover": bidder.claimedTurnover,
        "verifiedTurnover": bidder.verifiedTurnover,
        "oemAuth": bidder.oemAuth or {}
    }

    records = ReferenceAdapters.run_all_adapters(bidder_dict)
    
    verified_count = sum(1 for r in records if r["result"] in ["VERIFIED", "CLEAR"])
    issues_count = sum(1 for r in records if r["result"] in ["POTENTIAL ISSUE", "REQUIRES REVIEW"])

    return {
        "bidderId": bidder.id,
        "totalAdaptersChecked": len(records),
        "verifiedCount": verified_count,
        "issuesCount": issues_count,
        "records": records
    }
