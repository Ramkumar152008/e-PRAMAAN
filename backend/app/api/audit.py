"""
Audit Trail API Router
e-BID PRAMAAN — CPCL
Append-only tamper-evident cryptographic ledger records.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import AuditRecord
from app.schemas.schemas import AuditRecordResponse, AuditRecordCreate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditRecordResponse])
def get_audit_trail(
    tenderId: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieves chronological tamper-evident audit logs with SHA-256 event hashes."""
    query = db.query(AuditRecord)
    if tenderId:
        query = query.filter(AuditRecord.evaluationId == tenderId)
    records = query.order_by(AuditRecord.createdAt.desc()).all()
    return records

@router.post("", response_model=AuditRecordResponse)
def create_custom_audit_entry(req: AuditRecordCreate, db: Session = Depends(get_db)):
    """Logs custom verified action into cryptographic audit ledger."""
    rec = AuditService.create_audit_record(
        db=db,
        actor=req.actor,
        actor_role=req.actorRole,
        action=req.action,
        decision=req.decision,
        reason=req.reason,
        target=req.target,
        evaluation_id=req.evaluationId,
        bidder=req.bidder,
        result=req.result,
        details=req.details,
        officer_id=req.officerId or "PO-1042",
        evidence_ref=req.evidenceRef
    )
    return rec
