"""
n8n Workflow Webhooks & Orchestration API Router
e-BID PRAMAAN — CPCL
Receives external workflow triggers, vendor webhook responses, and escalation events.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Clarification, Bidder, AuditRecord
from app.services.n8n_service import N8NService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/n8n", tags=["n8n Workflow Orchestration"])

@router.get("/status")
def get_n8n_status():
    """Checks whether the external n8n workflow engine is online and active."""
    is_online = N8NService.is_n8n_available()
    return {
        "service": "n8n Workflow Automation Engine",
        "status": "ONLINE" if is_online else "OFFLINE_FALLBACK_ACTIVE",
        "isOnline": is_online,
        "workflows": [
            {"id": "n8n-clarification-01", "name": "Clarification Dispatch & Vendor Notification", "status": "ACTIVE"},
            {"id": "n8n-escalation-02", "name": "Clarification Deadline Escalation Monitor", "status": "ACTIVE"}
        ],
        "message": "FastAPI internal compliance engine operates independently with resilient fallback."
    }

@router.post("/trigger/clarification")
def trigger_clarification_n8n(
    clarificationId: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Triggers n8n notification sequence when officer creates a clarification.
    """
    clar = db.query(Clarification).filter(Clarification.id == clarificationId).first()
    if not clar:
        raise HTTPException(status_code=404, detail="Clarification not found")

    clar_dict = {
        "id": clar.id,
        "tenderId": clar.tenderId,
        "tenderTitle": clar.tenderTitle,
        "bidderId": clar.bidderId,
        "bidderName": clar.bidderName,
        "issueCategory": clar.issueCategory,
        "responseDeadline": clar.responseDeadline,
        "officerId": clar.officerId,
        "sharedEvidence": clar.sharedEvidence or []
    }

    res = N8NService.trigger_clarification_workflow(clar_dict)
    return res

@router.post("/webhook/vendor-response")
def receive_n8n_vendor_response_webhook(
    payload: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Webhook receiver endpoint called by n8n when vendor submits response or supporting docs.
    """
    clar_id = payload.get("clarificationId")
    if not clar_id:
        raise HTTPException(status_code=400, detail="Missing clarificationId in webhook payload")

    clar = db.query(Clarification).filter(Clarification.id == clar_id).first()
    if not clar:
        raise HTTPException(status_code=404, detail="Clarification record not found")

    now_str = datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M IST")
    clar.status = "RESPONSE_RECEIVED"
    clar.vendorExplanation = payload.get("explanation", "Vendor response received via n8n automated webhook.")
    clar.vendorResponseSubmittedAt = now_str
    clar.vendorSupportingDocs = payload.get("documents", [])

    AuditService.create_audit_record(
        db=db,
        actor="n8n Webhook Ingestion",
        actor_role="WORKFLOW_AUTOMATION",
        action=f"Vendor Webhook Intake ({clar_id})",
        decision="WEBHOOK_PROCESSED",
        reason=f"n8n forwarded vendor response with {len(payload.get('documents', []))} document(s).",
        target=clar_id,
        evaluation_id=clar.tenderId,
        bidder=clar.bidderName,
        result="SUCCESS",
        officer_id="PO-1042"
    )

    db.commit()
    return {"status": "SUCCESS", "message": "Webhook processed successfully", "clarificationId": clar_id}

@router.post("/trigger/escalation")
def trigger_escalation_n8n(
    clarificationId: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Triggers n8n deadline escalation workflow for pending clarification.
    """
    clar = db.query(Clarification).filter(Clarification.id == clarificationId).first()
    if not clar:
        raise HTTPException(status_code=404, detail="Clarification not found")

    clar_dict = {
        "id": clar.id,
        "tenderId": clar.tenderId,
        "bidderName": clar.bidderName,
        "issueCategory": clar.issueCategory,
        "responseDeadline": clar.responseDeadline
    }

    res = N8NService.trigger_escalation_workflow(clar_dict)
    return res
