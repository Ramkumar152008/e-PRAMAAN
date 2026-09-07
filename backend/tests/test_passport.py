"""
Unit & Integration Tests for Bidder Compliance Passport & Multi-Factor Confidence
e-BID PRAMAAN — CPCL
Tests:
1. Bidder Compliance Passport aggregation.
2. Tender-specific applicability checks in passport.
3. 6-Factor Evidence Confidence calculation.
4. /api/bidders/{id}/passport REST endpoint.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.passport_service import PassportService
from app.services.confidence_service import EvidenceConfidenceService
from app.data.seed_data import CPCL_TENDERS, CPCL_BIDDERS

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_passport_generation():
    bidder = CPCL_BIDDERS[0]
    tender = CPCL_TENDERS[0]
    
    passport = PassportService.generate_bidder_passport(bidder=bidder, tender=tender)
    assert passport["bidderId"] == bidder["id"]
    assert passport["gstin"] == bidder["gstin"]
    assert len(passport["statutoryCredentials"]) == 13
    assert passport["totalVerifiedCredentials"] > 0
    assert "governanceNotice" in passport

def test_evidence_confidence_breakdown():
    bidder = CPCL_BIDDERS[0]
    conf = EvidenceConfidenceService.calculate_confidence_breakdown(bidder=bidder)
    assert "overallConfidence" in conf
    assert conf["overallConfidence"] >= 70.0
    assert "ocrQuality" in conf["breakdown"]
    assert "fieldExtraction" in conf["breakdown"]
    assert "referenceVerification" in conf["breakdown"]
    assert "entityResolution" in conf["breakdown"]
    assert "temporalStatus" in conf["breakdown"]
    assert "documentIntegrity" in conf["breakdown"]
    assert conf["breakdown"]["documentIntegrity"] == "VALID"

def test_passport_endpoint(client):
    res = client.get("/api/bidders/BID-ATC-001/passport?tenderId=C03H240087")
    assert res.status_code == 200
    data = res.json()
    assert data["bidderId"] == "BID-ATC-001"
    assert "statutoryCredentials" in data
    assert len(data["statutoryCredentials"]) >= 10
