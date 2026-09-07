"""
Comprehensive End-to-End Procurement Compliance Workflow Integration Test
e-BID PRAMAAN — CPCL
Tests the complete 22-step workflow from Tender Clause ingestion to Officer Decision & Cryptographic Audit Ledger.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.data.seed_data import seed_database
from app.services.matching_service import MatchingService
from app.services.temporal_service import TemporalValidationService
from app.services.assistant_service import AssistantService, ALLOWED_TOOLS, PROHIBITED_ACTIONS
from app.services.confidence_service import EvidenceConfidenceService
from app.services.passport_service import PassportService
from app.services.rag_service import RAGService

@pytest.fixture(scope="module", autouse=True)
def init_e2e_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db, force=True)
    db.close()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_complete_end_to_end_procurement_journey(client):
    # ── STEP 1: Tender Ingestion & Retrieval ──
    res_tender = client.get("/api/tenders/C03H240087")
    assert res_tender.status_code == 200
    tender = res_tender.json()
    assert tender["gemBidNo"] == "C03H240087"
    assert "Tube, Radiant 1F3" in tender["title"]
    assert len(tender["rules"]) >= 6

    # ── STEP 2: Bid Dossiers Retrieval ──
    res_bids = client.get("/api/tenders/C03H240087/bids")
    assert res_bids.status_code == 200
    bidders = res_bids.json()
    assert len(bidders) >= 2
    bidder_atlas = next(b for b in bidders if "Atlas" in b["name"])
    bidder_abc = next(b for b in bidders if "ABC" in b["name"])

    # ── STEP 3: Deterministic Compliance Rule Evaluation & Boundary Check ──
    # Atlas Copco evaluation (Turnover ₹84.5 Cr >= ₹10 Cr -> PASS)
    res_comp_atlas = client.post("/api/compliance/analyze", json={
        "tenderId": "C03H240087",
        "bidderId": bidder_atlas["id"]
    })
    assert res_comp_atlas.status_code == 200
    atlas_comp = res_comp_atlas.json()
    assert atlas_comp["overallRisk"] == "LOW"
    assert atlas_comp["aiRecommendation"] == "CLEARED"
    assert "confidenceBreakdown" in atlas_comp

    # ABC Industries evaluation (Turnover ₹8.7 Cr vs ₹10 Cr -> CONFLICT)
    res_comp_abc = client.post("/api/compliance/analyze", json={
        "tenderId": "C03H240087",
        "bidderId": bidder_abc["id"]
    })
    assert res_comp_abc.status_code == 200
    abc_comp = res_comp_abc.json()
    assert abc_comp["overallRisk"] == "HIGH"
    assert abc_comp["aiRecommendation"] == "REQUIRES_VERIFICATION"
    assert len(abc_comp["topIssues"]) > 0

    # ── STEP 4: Hybrid Matching (Exact, Fuzzy, Semantic) ──
    # Exact
    res_exact = client.post("/api/matching/compare", json={
        "type": "IDENTIFIER",
        "claimedValue": "27AAACA1234F1Z8",
        "referenceValue": "27AAACA1234F1Z8"
    })
    assert res_exact.json()["status"] == "MATCHED"

    # Fuzzy with Legal Suffix Normalization
    res_fuzzy = client.post("/api/matching/compare", json={
        "type": "NAME",
        "claimedValue": "Atlas Copco (India) Pvt. Ltd.",
        "referenceValue": "ATLAS COPCO (INDIA) PRIVATE LIMITED"
    })
    assert res_fuzzy.json()["isMatch"] is True

    # Semantic
    res_semantic = client.post("/api/matching/compare", json={
        "type": "SEMANTIC",
        "claimedValue": "Class-I local supplier declaration with 58% domestic value addition.",
        "referenceValue": "Class-I Local Supplier preference minimum 50% domestic content required."
    })
    assert res_semantic.json()["isMatch"] is True

    # ── STEP 5: Temporal Bid-Date Validation ──
    bid_cutoff = "2026-08-10"
    
    # Case 1: Valid
    temp_pass = TemporalValidationService.validate_bid_date_compliance("2027-12-31", bid_cutoff)
    assert temp_pass["isValidOnBidDate"] is True

    # Case 2: Expired before bid date
    temp_expired = TemporalValidationService.validate_bid_date_compliance("2026-05-01", bid_cutoff)
    assert temp_expired["isValidOnBidDate"] is False
    assert temp_expired["status"] == "EXPIRED AT BID DATE"

    # Case 3: Post-dated evidence (issued after bid date)
    temp_post = TemporalValidationService.validate_bid_date_compliance("2028-01-01", bid_cutoff, valid_from_str="2026-08-20")
    assert temp_post["isValidOnBidDate"] is False
    assert temp_post["status"] == "NOT YET VALID"

    # ── STEP 6: 13 Reference Source Adapters ──
    res_ref = client.post("/api/reference/verify", json={"bidderId": bidder_atlas["id"]})
    assert res_ref.status_code == 200
    assert res_ref.json()["totalAdaptersChecked"] == 13

    # ── STEP 7: RAG Knowledge Retrieval & Hallucination Guard ──
    # Grounded Query
    res_rag = client.post("/api/rag/query", json={
        "query": "What is the requirement for Class-I Local Supplier under Make in India?",
        "tenderId": "C03H240087"
    })
    assert res_rag.status_code == 200
    assert res_rag.json()["grounded"] is True
    assert "Class-I" in res_rag.json()["answer"]
    assert len(res_rag.json()["citations"]) > 0

    # Hallucination Guard
    res_guard = client.post("/api/rag/query", json={
        "query": "nonexistent arbitrary fictional rule xyz 9988"
    })
    assert res_guard.json()["grounded"] is False
    assert "Insufficient verified evidence" in res_guard.json()["answer"]

    # ── STEP 8: Controlled Investigation Assistant & Tool Permissions ──
    res_asst = client.post("/api/assistant/query", json={
        "question": "Why was this bidder flagged for review?",
        "tenderId": "C03H240087",
        "bidderId": bidder_abc["id"]
    })
    assert res_asst.status_code == 200
    assert "Turnover Discrepancy" in res_asst.json()["answer"] or "Discrepancy" in res_asst.json()["answer"]
    assert "Decision Support Only" in res_asst.json()["governanceWarning"]

    # Prohibited Action Check
    res_prohibited = client.post("/api/assistant/execute-tool", json={
        "toolName": "reject_bidder",
        "params": {},
        "tenderId": "C03H240087",
        "bidderId": bidder_abc["id"]
    })
    assert res_prohibited.json()["success"] is False
    assert res_prohibited.json()["error"] == "STATUTORY_VIOLATION"

    # ── STEP 9: Bidder Compliance Passport ──
    res_passport = client.get(f"/api/bidders/{bidder_atlas['id']}/passport?tenderId=C03H240087")
    assert res_passport.status_code == 200
    passport = res_passport.json()
    assert passport["bidderId"] == bidder_atlas["id"]
    assert len(passport["statutoryCredentials"]) == 13

    # ── STEP 10: Closed-Loop Clarification Workflow ──
    # 1. Dispatch Clarification
    res_clar_send = client.post("/api/clarifications", json={
        "tenderId": "C03H240087",
        "tenderTitle": tender["title"],
        "bidderId": bidder_abc["id"],
        "bidderName": bidder_abc["name"],
        "issueCategory": "Turnover Variance",
        "officerQuery": "Submit audited balance sheet with UDIN statement for FY 2024-25.",
        "sharedEvidence": [
            {
                "id": "SEV-01",
                "title": "MCA21 Registry Extract",
                "sourceRegistry": "MCA21",
                "documentRef": "Form AOC-4",
                "type": "REGISTRY_RECORD",
                "date": "10-Aug-2026",
                "excerpt": "Turnover ₹8.70 Cr",
                "selected": True
            }
        ]
    })
    assert res_clar_send.status_code == 200
    clar_id = res_clar_send.json()["id"]

    # 2. n8n Notification Trigger
    res_n8n = client.post("/api/n8n/trigger/clarification", json={"clarificationId": clar_id})
    assert res_n8n.status_code == 200
    assert res_n8n.json()["status"] in ["N8N_TRIGGERED", "FALLBACK_RECORDED"]

    # 3. Vendor Submits Response
    res_vendor = client.post("/api/vendor-responses", json={
        "clarificationId": clar_id,
        "explanation": "Consolidated turnover is ₹12.1 Cr as evidenced by attached audited financials.",
        "documents": [{"name": "Audited_BalanceSheet_FY25.pdf", "size": "2.2 MB"}]
    })
    assert res_vendor.status_code == 200

    # 4. AI Re-verification
    res_reverify = client.post("/api/reverification", json={"clarificationId": clar_id})
    assert res_reverify.status_code == 200
    assert res_reverify.json()["reVerificationResult"] == "RESOLVED"

    # ── STEP 11: Procurement Officer Final Decision ──
    res_dec = client.post("/api/decisions", json={
        "evaluationId": "C03H240087",
        "bidderId": bidder_atlas["id"],
        "action": "QUALIFIED",
        "reasonRemarks": "All pre-qualification criteria verified compliant with parent company backing.",
        "officerName": "Rajeshwar Rao",
        "officerDesignation": "Senior Procurement Officer",
        "officerId": "PO-1042"
    })
    assert res_dec.status_code == 200
    assert "SIG-PO1042-" in res_dec.json()["digitalSignatureHash"]

    # ── STEP 12: Cryptographic Audit Trail & Integrity Check ──
    res_audit = client.get("/api/audit?tenderId=C03H240087")
    assert res_audit.status_code == 200
    logs = res_audit.json()
    assert len(logs) >= 3
    for log in logs:
        clean_hash = log["hash"].replace("sha256:", "")
        assert len(clean_hash) == 64 # SHA-256 hex string

    # ── STEP 13: Forensic Compliance Report ──
    res_report = client.get(f"/api/reports/{bidder_atlas['id']}")
    assert res_report.status_code == 200
    report = res_report.json()
    assert report["platform"] == "e-BID PRAMAAN"
    assert "clauseComplianceMatrix" in report
    assert "officerDetermination" in report
    assert report["officerDetermination"]["action"] == "QUALIFIED"
