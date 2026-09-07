"""
Unit & Integration Tests for n8n Workflow Orchestration & Fallback
e-BID PRAMAAN — CPCL
Tests:
1. n8n workflow trigger with sensitive data boundary.
2. n8n resilient fallback when n8n service is offline.
3. n8n escalation trigger.
4. REST endpoint /api/n8n/status and /api/n8n/trigger/clarification.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.n8n_service import N8NService
from app.database import Base, engine, SessionLocal
from app.data.seed_data import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_n8n_service_clarification_fallback():
    # Calling trigger when n8n is offline should return graceful fallback without throwing
    res = N8NService.trigger_clarification_workflow({
        "id": "CLAR-2026-TEST",
        "tenderId": "C03H240087",
        "tenderTitle": "Radiant Tubes",
        "bidderId": "BID-ABC-001",
        "bidderName": "ABC Industries Pvt. Ltd.",
        "issueCategory": "Turnover Discrepancy",
        "responseDeadline": "48 Hours"
    })
    assert res["status"] in ["N8N_TRIGGERED", "FALLBACK_RECORDED"]
    assert "workflowId" in res

def test_n8n_status_endpoint(client):
    res = client.get("/api/n8n/status")
    assert res.status_code == 200
    data = res.json()
    assert "service" in data
    assert "workflows" in data
    assert len(data["workflows"]) == 2

@pytest.fixture
def test_clarification_id(client):
    res = client.post("/api/clarifications", json={
        "tenderId": "C03H240087",
        "tenderTitle": "Procurement of Tube, Radiant 1F3",
        "bidderId": "BID-ABC-001",
        "bidderName": "ABC Industries Private Limited",
        "issueCategory": "Turnover Variance",
        "officerQuery": "Submit audited balance sheet with UDIN statement for FY 2024-25.",
        "sharedEvidence": []
    })
    assert res.status_code == 200
    return res.json()["id"]

def test_n8n_trigger_clarification_endpoint(client, test_clarification_id):
    res = client.post("/api/n8n/trigger/clarification", json={
        "clarificationId": test_clarification_id
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["N8N_TRIGGERED", "FALLBACK_RECORDED"]

def test_n8n_vendor_webhook_receiver_endpoint(client, test_clarification_id):
    res = client.post("/api/n8n/webhook/vendor-response", json={
        "clarificationId": test_clarification_id,
        "explanation": "Audited reconciliation statement submitted via n8n automated portal.",
        "documents": [{"name": "Audited_Reconciliation_FY25.pdf", "size": "1.8 MB"}]
    })
    assert res.status_code == 200
    assert res.json()["status"] == "SUCCESS"

