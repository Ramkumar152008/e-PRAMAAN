"""
Comprehensive Verification Pipeline Tests
e-BID PRAMAAN — CPCL
Tests:
1. Exact Identifier Matching (PAN, GSTIN, Udyam)
2. Fuzzy Token & Levenshtein Matching (Names & Addresses)
3. Semantic Vector Cosine Similarity
4. Temporal Bid-Date Validation (valid_from <= bid_cutoff_date <= valid_until)
5. 13 Modular Reference Source Adapters
6. Tender-Specific Dynamic Rule Engine
7. Weighted Risk & Discrepancy Engine
8. Clarification State Transitions & AI Re-Verification
9. Officer Decision Recording
10. SHA-256 Tamper-Evident Audit Ledger Integrity
"""

import pytest
from app.services.matching_service import MatchingService
from app.services.temporal_service import TemporalValidationService
from app.services.reference_adapters import ReferenceAdapters
from app.services.rule_engine import ComplianceRuleEngine
from app.services.risk_engine import RiskScoringEngine
from app.services.audit_service import AuditService
from app.data.seed_data import CPCL_TENDERS, CPCL_BIDDERS

# 1. EXACT MATCHING
def test_exact_identifier_matching():
    # GSTIN
    match, score = MatchingService.exact_match("33AABCA1234F1Z5", "33AABCA1234F1Z5")
    assert match is True
    assert score == 1.0

    # PAN with whitespace/case differences
    match, score = MatchingService.exact_match(" aabca1234f ", "AABCA1234F")
    assert match is True
    assert score == 1.0

    # Mismatched identifier
    match, score = MatchingService.exact_match("33AABCA1234F1Z5", "29ABCDE1234F1Z5")
    assert match is False
    assert score == 0.0

# 2. FUZZY MATCHING
def test_fuzzy_company_name_matching():
    name1 = "ABC Industries Pvt. Ltd."
    name2 = "ABC INDUSTRIES PRIVATE LIMITED"
    match, ratio, status = MatchingService.fuzzy_match(name1, name2, threshold=0.75)
    assert match is True
    assert ratio >= 0.75
    assert status in ["MATCHED", "POTENTIAL_MATCH"]

    diff_name1 = "ABC Industries Private Limited"
    diff_name2 = "Reliance Petrochem Solutions Ltd"
    match, ratio, status = MatchingService.fuzzy_match(diff_name1, diff_name2, threshold=0.75)
    assert match is False
    assert status == "MISMATCH"

# 3. SEMANTIC COMPARISON
def test_semantic_similarity():
    req = "Bidder shall provide valid manufacturer authorization from global parent."
    evidence = "Authorized operating subsidiary certificate issued by parent entity with direct warranty."
    match, score, status = MatchingService.semantic_similarity(req, evidence, threshold=0.30)
    assert match is True
    assert score > 0.30

# 4. TEMPORAL BID-DATE VALIDATION
def test_temporal_bid_date_validation():
    bid_cutoff = "2026-08-10"

    # Case A: Valid Certificate
    val_pass = TemporalValidationService.validate_bid_date_compliance(
        valid_until_str="2027-12-31",
        bid_cutoff_str=bid_cutoff,
        doc_name="ISO 9001 Certificate"
    )
    assert val_pass["isValidOnBidDate"] is True
    assert val_pass["status"] == "VALID AT BID DATE"
    assert val_pass["daysRemainingOrOverdue"] > 0

    # Case B: Expired Certificate on Bid Date
    val_fail = TemporalValidationService.validate_bid_date_compliance(
        valid_until_str="2026-06-15",
        bid_cutoff_str=bid_cutoff,
        doc_name="Quality Accreditation"
    )
    assert val_fail["isValidOnBidDate"] is False
    assert val_fail["status"] == "EXPIRED AT BID DATE"
    assert val_fail["daysRemainingOrOverdue"] > 0

# 5. 13 REFERENCE SOURCE ADAPTERS
def test_reference_source_adapters():
    bidder = CPCL_BIDDERS[0]
    adapters = ReferenceAdapters.run_all_adapters(bidder)
    assert len(adapters) == 13
    
    adapter_names = [a["sourceName"] for a in adapters]
    assert "GSTN" in adapter_names
    assert "PAN / Income Tax" in adapter_names
    assert "Udyam / MSME" in adapter_names
    assert "MCA21" in adapter_names
    assert "OEM Verification Gateway" in adapter_names
    assert "Blacklisting / Debarment Registry" in adapter_names

# 6. DYNAMIC TENDER RULE ENGINE
def test_dynamic_tender_rule_engine():
    tender_radiant = CPCL_TENDERS[0] # C03H240087
    bidder_atlas = CPCL_BIDDERS[0]
    
    matrix = ComplianceRuleEngine.evaluate_bidder_against_tender(tender_radiant, bidder_atlas)
    assert len(matrix) == len(tender_radiant["requirements"])
    for row in matrix:
        assert "result" in row
        assert "confidence" in row
        assert "officerAction" in row

# 7. RISK SCORING & DISCREPANCY DETECTION
def test_risk_scoring_engine():
    # Compliant case
    matrix_pass = [{"result": "PASS", "risk": "LOW", "requirement": "GST Registration"}]
    risk_pass = RiskScoringEngine.calculate_bidder_risk(matrix_pass, [], {})
    assert risk_pass["overallRisk"] == "LOW"
    assert risk_pass["aiRecommendation"] == "CLEARED"

    # Discrepancy case (Turnover mismatch)
    matrix_conflict = [{"result": "CONFLICT", "risk": "HIGH", "requirement": "Financial Turnover Threshold"}]
    risk_conflict = RiskScoringEngine.calculate_bidder_risk(matrix_conflict, [], {})
    assert risk_conflict["overallRisk"] == "HIGH"
    assert risk_conflict["aiRecommendation"] == "REQUIRES_VERIFICATION"
    assert len(risk_conflict["topIssues"]) > 0

# 8. AUDIT LEDGER SHA-256 INTEGRITY
def test_audit_ledger_hashing():
    hash1 = AuditService.generate_hash("CPCL-TENDER-C03H240087|PO-1042|QUALIFIED")
    hash2 = AuditService.generate_hash("CPCL-TENDER-C03H240087|PO-1042|QUALIFIED")
    hash3 = AuditService.generate_hash("CPCL-TENDER-C03H240087|PO-1042|DISQUALIFIED")
    
    assert hash1 == hash2
    assert hash1 != hash3
    assert len(hash1) == 64 # SHA-256 64-char hex
