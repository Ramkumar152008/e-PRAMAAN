"""
Comprehensive REST API Endpoint Tests
e-BID PRAMAAN — CPCL
Tests all FastAPI endpoints for Tenders, Bidders, Matching, Temporal, Compliance, Clarifications, Decisions, Audit, and Reporting.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.data.seed_data import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_api_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["platform"] == "e-BID PRAMAAN"
    assert "Chennai Petroleum Corporation Limited" in data["organization"]

def test_api_kpis(client):
    response = client.get("/api/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["activeTenders"] >= 4
    assert data["bidsUnderReview"] >= 10

def test_api_get_tenders(client):
    response = client.get("/api/tenders")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    tender_ids = [t["id"] for t in data]
    assert "C03H240087" in tender_ids
    assert "C13A250049" in tender_ids

def test_api_get_single_tender(client):
    response = client.get("/api/tenders/C03H240087")
    assert response.status_code == 200
    data = response.json()
    assert data["gemBidNo"] == "C03H240087"
    assert len(data["rules"]) > 0

def test_api_matching_compare(client):
    # Exact match test
    res_exact = client.post("/api/matching/compare", json={
        "type": "IDENTIFIER",
        "claimedValue": "33AABCA1234F1Z5",
        "referenceValue": "33AABCA1234F1Z5"
    })
    assert res_exact.status_code == 200
    assert res_exact.json()["isMatch"] is True
    assert res_exact.json()["status"] == "MATCHED"

    # Fuzzy match test
    res_fuzzy = client.post("/api/matching/compare", json={
        "type": "NAME",
        "claimedValue": "ABC Industries Pvt. Ltd.",
        "referenceValue": "ABC INDUSTRIES PRIVATE LIMITED"
    })
    assert res_fuzzy.status_code == 200
    assert res_fuzzy.json()["isMatch"] is True

def test_api_temporal_validate(client):
    res = client.post("/api/temporal/validate", json={
        "documentName": "ISO 9001 Certificate",
        "validUntil": "2027-12-31",
        "bidCutoffDate": "2026-08-10"
    })
    assert res.status_code == 200
    assert res.json()["isValidOnBidDate"] is True
    assert res.json()["status"] == "VALID AT BID DATE"

def test_api_compliance_analyze(client):
    res = client.post("/api/compliance/analyze", json={
        "tenderId": "C03H240087",
        "bidderId": "BID-ATC-001"
    })
    assert res.status_code == 200
    data = res.json()
    assert "complianceScore" in data
    assert "complianceMatrix" in data
    assert len(data["complianceMatrix"]) > 0

def test_api_reference_verify(client):
    res = client.post("/api/reference/verify", json={
        "bidderId": "BID-ATC-001"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["totalAdaptersChecked"] == 13
    assert data["verifiedCount"] > 0

def test_api_clarification_workflow(client):
    # 1. Dispatch Clarification
    res_send = client.post("/api/clarifications", json={
        "tenderId": "C03H240087",
        "tenderTitle": "Procurement of Tube, Radiant 1F3, 6IN",
        "bidderId": "BID-ABC-001",
        "bidderName": "ABC Industries Private Limited",
        "issueCategory": "Turnover Discrepancy",
        "officerQuery": "Please submit Audited Financial Statements for FY 2024-25 with UDIN reconciliation.",
        "sharedEvidence": [
            {
                "id": "SEV-01",
                "title": "MCA21 Form AOC-4 Filing",
                "sourceRegistry": "MCA21",
                "documentRef": "SRN-AOC4-99214",
                "type": "REGISTRY_RECORD",
                "date": "05-Sep-2026",
                "excerpt": "Turnover ₹8.7 Cr recorded",
                "selected": True
            }
        ]
    })
    assert res_send.status_code == 200
    clar = res_send.json()
    assert clar["status"] == "AWAITING_RESPONSE"
    clar_id = clar["id"]

    # 2. Vendor Submits Response
    res_vendor = client.post("/api/vendor-responses", json={
        "clarificationId": clar_id,
        "explanation": "Consolidated turnover is ₹12.1 Cr as per attached audited balance sheet and UDIN statement.",
        "documents": [
            {"name": "Audited_Financials_FY25.pdf", "size": "2.4 MB"}
        ]
    })
    assert res_vendor.status_code == 200

    # 3. AI Re-verification
    res_reverify = client.post("/api/reverification", json={
        "clarificationId": clar_id
    })
    assert res_reverify.status_code == 200
    assert res_reverify.json()["reVerificationResult"] == "RESOLVED"

def test_api_officer_decision_and_audit(client):
    # Record Decision
    res_dec = client.post("/api/decisions", json={
        "evaluationId": "C03H240087",
        "bidderId": "BID-ATC-001",
        "action": "QUALIFIED",
        "reasonRemarks": "All pre-qualification and technical requirements fully compliant.",
        "officerName": "Rajeshwar Rao",
        "officerDesignation": "Senior Procurement Officer",
        "officerId": "PO-1042"
    })
    assert res_dec.status_code == 200
    data = res_dec.json()
    assert data["action"] == "QUALIFIED"
    assert "SIG-PO1042-" in data["digitalSignatureHash"]

    # Audit Trail verification
    res_audit = client.get("/api/audit?tenderId=C03H240087")
    assert res_audit.status_code == 200
    logs = res_audit.json()
    assert len(logs) > 0
    assert any("PO-1042" in log["officerId"] for log in logs)

def test_api_compliance_report(client):
    res_rep = client.get("/api/reports/BID-ATC-001")
    assert res_rep.status_code == 200
    report = res_rep.json()
    assert report["platform"] == "e-BID PRAMAAN"
    assert report["organization"] == "Chennai Petroleum Corporation Limited (CPCL)"
    assert "clauseComplianceMatrix" in report
    assert "officerDetermination" in report
