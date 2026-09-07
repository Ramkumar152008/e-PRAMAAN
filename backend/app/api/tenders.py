"""
Tenders API Router
e-BID PRAMAAN — CPCL
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Tender, TenderRequirement, Bidder
from app.schemas.schemas import TenderResponse, TenderCreate, BidderResponse

router = APIRouter(prefix="/tenders", tags=["Tenders"])

@router.get("", response_model=List[TenderResponse])
def get_tenders(db: Session = Depends(get_db)):
    """Retrieves all active CPCL petroleum procurement tenders."""
    tenders = db.query(Tender).all()
    results = []
    for t in tenders:
        reqs = db.query(TenderRequirement).filter(TenderRequirement.tenderId == t.id).all()
        rules_list = [
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
            for r in reqs
        ]
        t_dict = {
            "id": t.id,
            "gemBidNo": t.gemBidNo,
            "title": t.title,
            "ministry": t.ministry,
            "department": t.department,
            "location": t.location,
            "estimatedValue": t.estimatedValue,
            "publishDate": t.publishDate,
            "bidEndDate": t.bidEndDate,
            "submissionDeadline": t.submissionDeadline,
            "status": t.status,
            "stage": t.stage,
            "priority": t.priority,
            "tenderType": t.tenderType,
            "evaluationMethod": t.evaluationMethod,
            "category": t.category,
            "petroleumCategory": t.petroleumCategory,
            "bidsCount": t.bidsCount,
            "issuesCount": t.issuesCount,
            "isPrimaryDemo": t.isPrimaryDemo,
            "rawClauses": t.rawClauses or [],
            "rules": rules_list
        }
        results.append(TenderResponse(**t_dict))
    return results

@router.get("/{tender_id}", response_model=TenderResponse)
def get_tender(tender_id: str, db: Session = Depends(get_db)):
    """Retrieves a single tender by ID or GeM Bid Number."""
    t = db.query(Tender).filter((Tender.id == tender_id) | (Tender.gemBidNo == tender_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail=f"Tender with ID {tender_id} not found")

    reqs = db.query(TenderRequirement).filter(TenderRequirement.tenderId == t.id).all()
    rules_list = [
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
        for r in reqs
    ]
    return TenderResponse(
        id=t.id,
        gemBidNo=t.gemBidNo,
        title=t.title,
        ministry=t.ministry,
        department=t.department,
        location=t.location,
        estimatedValue=t.estimatedValue,
        publishDate=t.publishDate,
        bidEndDate=t.bidEndDate,
        submissionDeadline=t.submissionDeadline,
        status=t.status,
        stage=t.stage,
        priority=t.priority,
        tenderType=t.tenderType,
        evaluationMethod=t.evaluationMethod,
        category=t.category,
        petroleumCategory=t.petroleumCategory,
        bidsCount=t.bidsCount,
        issuesCount=t.issuesCount,
        isPrimaryDemo=t.isPrimaryDemo,
        rawClauses=t.rawClauses or [],
        rules=rules_list
    )

@router.get("/{tender_id}/requirements")
def get_tender_requirements(tender_id: str, db: Session = Depends(get_db)):
    """Retrieves structured compliance rules and clauses for a specific tender."""
    t = db.query(Tender).filter((Tender.id == tender_id) | (Tender.gemBidNo == tender_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tender not found")
    reqs = db.query(TenderRequirement).filter(TenderRequirement.tenderId == t.id).all()
    return reqs

@router.get("/{tender_id}/bids", response_model=List[BidderResponse])
def get_tender_bids(tender_id: str, db: Session = Depends(get_db)):
    """Retrieves all submitted bids and bidder dossiers for a tender."""
    bidders = db.query(Bidder).filter((Bidder.tenderId == tender_id) | (Bidder.tenderId == tender_id.split("/")[-1])).all()
    return bidders
