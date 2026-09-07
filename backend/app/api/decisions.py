"""
Officer Decision API Router
e-BID PRAMAAN — CPCL
Records Procurement Officer qualification / disqualification determinations with digital signature hash.
"""

from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import OfficerDecision, Bidder
from app.schemas.schemas import DecisionCreate, DecisionResponse
from app.services.audit_service import AuditService

router = APIRouter(prefix="/decisions", tags=["Officer Decisions"])

@router.post("", response_model=DecisionResponse)
def record_decision(req: DecisionCreate, db: Session = Depends(get_db)):
    """
    Authorized Procurement Officer (PO-1042) records formal qualification / disqualification decision.
    Requires mandatory officer remarks. Generates cryptographic digital signature hash.
    """
    bidder = db.query(Bidder).filter(Bidder.id == req.bidderId).first()
    bidder_name = bidder.name if bidder else "Bidder Entity"

    now = datetime.now(timezone.utc)
    now_str = now.strftime("%Y-%m-%d %H:%M:%S")
    sig_hash = f"SIG-PO1042-{AuditService.generate_hash(f'{req.evaluationId}|{req.bidderId}|{req.action}|{now_str}')[:12].upper()}"
    decision_id = f"DEC-{int(now.timestamp())}"

    decision = OfficerDecision(
        id=decision_id,
        evaluationId=req.evaluationId,
        bidderId=req.bidderId,
        action=req.action,
        reasonRemarks=req.reasonRemarks,
        clarificationQuery=req.clarificationQuery,
        officerName=req.officerName or "Rajeshwar Rao",
        officerDesignation=req.officerDesignation or "Senior Procurement Officer",
        officerId=req.officerId or "PO-1042",
        timestamp=now_str,
        digitalSignatureHash=sig_hash
    )
    db.add(decision)

    AuditService.create_audit_record(
        db=db,
        actor=req.officerName or "Rajeshwar Rao",
        actor_role="Procurement Officer",
        action=f"Officer Determination Recorded: {req.action}",
        decision=req.action,
        reason=req.reasonRemarks,
        target=req.bidderId,
        evaluation_id=req.evaluationId,
        bidder=bidder_name,
        result=req.action,
        evidence_ref=sig_hash,
        officer_id=req.officerId or "PO-1042"
    )

    db.commit()
    db.refresh(decision)
    return decision

@router.get("/{bidder_id}", response_model=DecisionResponse)
def get_bidder_decision(bidder_id: str, db: Session = Depends(get_db)):
    """Retrieves recorded officer determination for a specific bidder."""
    dec = db.query(OfficerDecision).filter(OfficerDecision.bidderId == bidder_id).order_by(OfficerDecision.timestamp.desc()).first()
    if not dec:
        raise HTTPException(status_code=404, detail="No recorded decision found for this bidder")
    return dec
