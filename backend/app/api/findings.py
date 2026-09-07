"""
Findings & Explainable AI (XAI) API Router
e-BID PRAMAAN — CPCL
Exposes explainable compliance discrepancy findings.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Bidder, ComplianceFinding

router = APIRouter(prefix="/findings", tags=["Findings & XAI"])

@router.get("")
def get_all_findings(db: Session = Depends(get_db)):
    """Retrieves all open discrepancies requiring procurement officer review across active tenders."""
    findings = db.query(ComplianceFinding).all()
    if not findings:
        # Return primary demo finding
        return [
            {
                "id": "FND-FIN-01",
                "findingId": "FND-FIN-01",
                "tenderId": "C03H240087",
                "bidderId": "BID-ABC-001",
                "requirement": "Financial Turnover Threshold (>= ₹10 Cr Average for 3 FYs)",
                "rule": "CPCL-FIN-001: Minimum ₹10.00 Cr Average Annual Turnover",
                "claim": "Claimed Turnover: ₹12.00 Crore (Declared in CA Certificate)",
                "submittedDocument": "Audited_Turnover_Statement_FY24-25.pdf",
                "verificationSource": "MCA21 Form AOC-4 Statutory Financial Filing",
                "comparison": "Declared ₹12.00 Cr vs Official Registry Filing ₹8.70 Cr (-27.5% Deficit below ₹10 Cr)",
                "finding": "Turnover Discrepancy: Statutory Form AOC-4 shows ₹8.7 Cr which is below the mandatory ₹10 Cr threshold.",
                "whyItMatters": "Mandatory financial eligibility criteria under CPCL Tender Clause 3.1. Requires clarification notice.",
                "evidence": "MCA21 SRN-AOC4-2025-99214 & CA Turnover Certificate (Page 3)",
                "confidence": 98.0,
                "risk": "HIGH",
                "recommendedAction": "Dispatch Clarification Notice requesting FY 2024-25 Audited Statements and UDIN reconciliation.",
                "status": "OPEN"
            }
        ]
    return findings

@router.get("/{bidder_id}")
def get_bidder_findings(bidder_id: str, db: Session = Depends(get_db)):
    """Retrieves explainable AI findings for a specific bidder."""
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")
    
    findings = db.query(ComplianceFinding).filter(ComplianceFinding.bidderId == bidder_id).all()
    if not findings and bidder.findings:
        return bidder.findings
    return findings
