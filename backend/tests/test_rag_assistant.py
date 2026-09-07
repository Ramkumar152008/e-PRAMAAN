"""
Unit & Integration Tests for RAG & Controlled Investigation Assistant
e-BID PRAMAAN — CPCL
Tests:
1. RAG knowledge search across statutory corpus (GFR 2017, MPG, CPCL rules).
2. RAG Hallucination Guard (refuses queries without verified statutory backing).
3. RAG explain finding with grounded clause citations.
4. Assistant tool execution via authorized allowlist.
5. Assistant prohibition on final qualification / rejection decisions.
6. Assistant conversational multi-intent queries.
"""

import pytest
from app.services.rag_service import RAGService
from app.services.assistant_service import AssistantService, ALLOWED_TOOLS, PROHIBITED_ACTIONS
from app.data.seed_data import CPCL_TENDERS, CPCL_BIDDERS

# 1. RAG SEARCH
def test_rag_statutory_knowledge_search():
    # Query related to MSE EMD exemption
    res = RAGService.search_knowledge_base("Are MSEs exempt from EMD deposit under GFR?")
    assert res["grounded"] is True
    assert res["confidence"] >= 70.0
    assert len(res["citations"]) > 0
    assert any("MSE" in c["title"] or "153" in c["section"] or "170" in c["section"] for c in res["citations"])

def test_rag_turnover_pqc_search():
    res = RAGService.search_knowledge_base("What is the UDIN requirement for audited turnover?")
    assert res["grounded"] is True
    assert "UDIN" in res["answer"]
    assert any("MPG" in c["id"] or "PQC" in c["id"] for c in res["citations"])

# 2. RAG HALLUCINATION GUARD
def test_rag_hallucination_guard_on_gibberish():
    res = RAGService.search_knowledge_base("xyz randomly invented quantum cooking policy 998822")
    assert res["grounded"] is False
    assert res["confidence"] == 0.0
    assert "Insufficient verified evidence" in res["answer"]
    assert res["officerReviewRequired"] is True

# 3. RAG EXPLAIN FINDING
def test_rag_explain_finding():
    sample_finding = {
        "id": "FND-FIN-01",
        "requirement": "Financial Turnover Threshold (>= ₹10 Cr)",
        "finding": "Declared ₹12 Cr vs Official Registry Filing ₹8.7 Cr",
        "claim": "Claimed ₹12.0 Cr",
        "verificationSource": "MCA21 Form AOC-4",
        "whyItMatters": "Mandatory financial eligibility criteria under CPCL Tender Clause 3.1.",
        "recommendedAction": "Dispatch Clarification Notice"
    }
    explanation = RAGService.explain_finding(finding=sample_finding, tender={"rawClauses": CPCL_TENDERS[0]["rawClauses"]})
    assert explanation["findingId"] == "FND-FIN-01"
    assert "groundedExplanation" in explanation
    assert len(explanation["citations"]) > 0
    assert "Procurement Officer retains sole statutory authority" in explanation["officerAuthorityNote"]

# 4. ASSISTANT TOOL PERMISSION ALLOWLIST
def test_assistant_tool_permissions():
    context = {"tender": CPCL_TENDERS[0], "bidder": CPCL_BIDDERS[0]}
    
    # Allowed tool
    res_allowed = AssistantService.execute_tool("retrieve_bidder_evidence", {}, context)
    assert res_allowed["success"] is True
    assert res_allowed["result"]["gstin"] == CPCL_BIDDERS[0]["gstin"]

    # Prohibited action (AI must NEVER decide to reject/qualify)
    res_reject = AssistantService.execute_tool("reject_bidder", {}, context)
    assert res_reject["success"] is False
    assert res_reject["error"] == "STATUTORY_VIOLATION"
    assert "strictly PROHIBITED" in res_reject["message"]

    res_qualify = AssistantService.execute_tool("qualify_bidder", {}, context)
    assert res_qualify["success"] is False
    assert res_qualify["error"] == "STATUTORY_VIOLATION"

    res_modify = AssistantService.execute_tool("modify_threshold", {}, context)
    assert res_modify["success"] is False
    assert res_modify["error"] == "STATUTORY_VIOLATION"

# 5. ASSISTANT CONVERSATIONAL QUERY
def test_assistant_process_query_why_flagged():
    tender = CPCL_TENDERS[0]
    bidder_abc = CPCL_BIDDERS[1] # ABC Industries (high risk / turnover discrepancy)
    
    ans = AssistantService.process_query(
        question="Why was this bidder flagged for review?",
        tender=tender,
        bidder=bidder_abc
    )
    assert "query" in ans
    assert len(ans["usedTools"]) > 0
    assert "Turnover Discrepancy" in ans["answer"] or "Discrepancy" in ans["answer"]
    assert len(ans["suggestedActions"]) > 0
    assert "Procurement Officer" in ans["governanceWarning"]

def test_assistant_process_query_temporal_check():
    tender = CPCL_TENDERS[0]
    bidder = CPCL_BIDDERS[0]
    ans = AssistantService.process_query(
        question="Check whether bidder certificates were valid on bid cutoff date",
        tender=tender,
        bidder=bidder
    )
    assert "Temporal Compliance Analysis" in ans["answer"]
    assert "2026-08-10" in ans["answer"]
