"""
Controlled Compliance Investigation Assistant API Router
e-BID PRAMAAN — CPCL
Exposes conversational decision-support queries with strict tool permission enforcement.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Tender, Bidder, ComplianceFinding
from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/assistant", tags=["Investigation Assistant"])

@router.post("/query")
def ask_assistant(
    question: str = Body(..., embed=True),
    tenderId: str = Body(..., embed=True),
    bidderId: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Executes a controlled inquiry through the Investigation Assistant.
    Evaluates grounded knowledge, tender clauses, and bidder evidence.
    Enforces that AI does not execute final qualification/rejection decisions.
    """
    tender = db.query(Tender).filter((Tender.id == tenderId) | (Tender.gemBidNo == tenderId)).first()
    bidder = db.query(Bidder).filter(Bidder.id == bidderId).first()

    if not tender or not bidder:
        raise HTTPException(status_code=404, detail="Tender or Bidder not found")

    findings = db.query(ComplianceFinding).filter(ComplianceFinding.bidderId == bidderId).all()
    findings_list = [
        {
            "id": f.id,
            "requirement": f.requirement,
            "finding": f.finding,
            "claim": f.claim,
            "verificationSource": f.verificationSource,
            "whyItMatters": f.whyItMatters,
            "risk": f.risk,
            "recommendedAction": f.recommendedAction
        }
        for f in findings
    ]

    tender_dict = {
        "id": tender.id,
        "gemBidNo": tender.gemBidNo,
        "title": tender.title,
        "bidEndDate": tender.bidEndDate or "2026-08-10",
        "rawClauses": tender.rawClauses or []
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
        "oemAuth": bidder.oemAuth or {},
        "riskProfile": bidder.riskProfile or {},
        "certificates": bidder.temporalCompliance or []
    }

    response = AssistantService.process_query(
        question=question,
        tender=tender_dict,
        bidder=bidder_dict,
        findings=findings_list
    )

    return response

@router.post("/execute-tool")
def execute_assistant_tool(
    toolName: str = Body(..., embed=True),
    params: Dict[str, Any] = Body(default_factory=dict, embed=True),
    tenderId: Optional[str] = Body(None, embed=True),
    bidderId: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    """
    Executes a single permitted assistant tool through the authorization permission gate.
    """
    context = {}
    if tenderId:
        t = db.query(Tender).filter((Tender.id == tenderId) | (Tender.gemBidNo == tenderId)).first()
        if t:
            context["tender"] = {"id": t.id, "rawClauses": t.rawClauses or []}
    if bidderId:
        b = db.query(Bidder).filter(Bidder.id == bidderId).first()
        if b:
            context["bidder"] = {
                "id": b.id, "name": b.name, "cin": b.cin, "pan": b.pan,
                "gstin": b.gstin, "udyamNo": b.udyamNo, "claimedTurnover": b.claimedTurnover,
                "verifiedTurnover": b.verifiedTurnover, "oemAuth": b.oemAuth or {}
            }

    res = AssistantService.execute_tool(tool_name=toolName, params=params, context=context)
    return res
