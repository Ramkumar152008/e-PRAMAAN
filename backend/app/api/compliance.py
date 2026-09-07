"""
Compliance Analysis API Router
e-BID PRAMAAN — CPCL
Runs tender-specific compliance rule engine and calculates multi-factor risk scores.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Tender, Bidder
from app.services.rule_engine import ComplianceRuleEngine
from app.services.risk_engine import RiskScoringEngine
from app.services.confidence_service import EvidenceConfidenceService

router = APIRouter(prefix="/compliance", tags=["Compliance"])


@router.post("/analyze")
def analyze_compliance(
    tenderId: str = Body(..., embed=True),
    bidderId: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Evaluates bidder documents and evidence against all rules of the selected CPCL tender.
    Returns compliance matrix and transparent weighted risk breakdown.
    """
    tender = db.query(Tender).filter((Tender.id == tenderId) | (Tender.gemBidNo == tenderId)).first()
    bidder = db.query(Bidder).filter(Bidder.id == bidderId).first()

    if not tender or not bidder:
        raise HTTPException(status_code=404, detail="Tender or Bidder not found")

    tender_dict = {
        "id": tender.id,
        "gemBidNo": tender.gemBidNo,
        "bidEndDate": tender.bidEndDate or "2026-08-10",
        "rules": [
            {
                "id": r.requirementId,
                "metric": r.metric,
                "minimumValue": r.minimumValue,
                "operator": r.operator,
                "mandatory": r.mandatory,
                "description": r.description or r.requirementName,
                "referenceClause": r.clauseReference,
                "category": r.category
            }
            for r in tender.requirements
        ]
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
        "certificates": bidder.temporalCompliance or [],
        "extractedFields": bidder.documents or []
    }

    matrix = ComplianceRuleEngine.evaluate_bidder_against_tender(tender_dict, bidder_dict)
    risk_profile = RiskScoringEngine.calculate_bidder_risk(matrix, bidder_dict.get("certificates", []), bidder_dict)
    confidence_breakdown = EvidenceConfidenceService.calculate_confidence_breakdown(
        bidder=bidder_dict,
        documents=bidder.documents or [],
        matrix=matrix,
        temporal_checks=bidder_dict.get("certificates", [])
    )

    return {
        "tenderId": tender.gemBidNo,
        "bidderId": bidder.id,
        "complianceScore": risk_profile["complianceScore"],
        "overallRisk": risk_profile["overallRisk"],
        "aiRecommendation": risk_profile["aiRecommendation"],
        "summary": risk_profile["summary"],
        "topIssues": risk_profile["topIssues"],
        "complianceMatrix": matrix,
        "riskProfile": risk_profile,
        "confidenceBreakdown": confidence_breakdown
    }

