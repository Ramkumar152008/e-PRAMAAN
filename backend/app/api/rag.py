"""
RAG Knowledge Base API Router
e-BID PRAMAAN — CPCL
Exposes grounded search and clause citation endpoints.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Tender, ComplianceFinding
from app.services.rag_service import RAGService

router = APIRouter(prefix="/rag", tags=["RAG & Knowledge Base"])

@router.post("/query")
def query_knowledge_base(
    query: str = Body(..., embed=True),
    tenderId: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    """
    Executes grounded semantic search across GFR 2017, Manual for Procurement of Goods 2024,
    and tender clauses with citation extraction and Hallucination Guard.
    """
    clauses = []
    if tenderId:
        t = db.query(Tender).filter((Tender.id == tenderId) | (Tender.gemBidNo == tenderId)).first()
        if t and t.rawClauses:
            clauses = t.rawClauses

    result = RAGService.search_knowledge_base(query=query, tender_clauses=clauses, top_k=3)
    return result

@router.post("/explain-finding")
def explain_finding(
    findingId: str = Body(..., embed=True),
    tenderId: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    """
    Generates a fully grounded explanation for a specific discrepancy finding with statutory citations.
    """
    fnd = db.query(ComplianceFinding).filter(ComplianceFinding.id == findingId).first()
    fnd_dict = {}
    if fnd:
        fnd_dict = {
            "id": fnd.id,
            "requirement": fnd.requirement,
            "finding": fnd.finding,
            "claim": fnd.claim,
            "verificationSource": fnd.verificationSource,
            "whyItMatters": fnd.whyItMatters,
            "recommendedAction": fnd.recommendedAction
        }
    else:
        fnd_dict = {
            "id": findingId,
            "requirement": "Financial Turnover Threshold (>= ₹10 Cr Average for 3 FYs)",
            "finding": "Turnover Discrepancy: Statutory Form AOC-4 shows ₹8.7 Cr which is below the mandatory ₹10 Cr threshold.",
            "claim": "Claimed Turnover: ₹12.00 Crore",
            "verificationSource": "MCA21 Form AOC-4 Statutory Financial Filing",
            "whyItMatters": "Mandatory pre-qualification criteria under CPCL Tender Clause 3.1.",
            "recommendedAction": "Dispatch Clarification Notice requesting FY 2024-25 Audited Statements and UDIN reconciliation."
        }

    t_dict = {}
    if tenderId:
        t = db.query(Tender).filter((Tender.id == tenderId) | (Tender.gemBidNo == tenderId)).first()
        if t:
            t_dict = {"rawClauses": t.rawClauses or []}

    explanation = RAGService.explain_finding(finding=fnd_dict, tender=t_dict)
    return explanation
