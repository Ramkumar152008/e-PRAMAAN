"""
Initial CPCL Demo Dataset Seeder
e-BID PRAMAAN — CPCL
Seeds the 4 CPCL Tenders and Bidders into SQLAlchemy / Database
"""

import copy
from sqlalchemy.orm import Session
from app.models.entities import Tender, TenderRequirement, Bidder, Document, Clarification, AuditRecord

CPCL_TENDERS = [
    {
        "id": "C03H240087",
        "gemBidNo": "C03H240087",
        "title": "Procurement of Tube, Radiant 1F3, 6IN",
        "ministry": "Ministry of Petroleum & Natural Gas",
        "department": "M&C Department / Materials",
        "location": "CPCL Manali, Chennai",
        "estimatedValue": 18.5,
        "publishDate": "2026-06-15",
        "bidEndDate": "2026-08-10",
        "submissionDeadline": "2026-08-10T15:00:00+05:30",
        "status": "UNDER_VERIFICATION",
        "stage": "Techno-Commercial Evaluation",
        "priority": "HIGH",
        "tenderType": "Open National Tender",
        "evaluationMethod": "Material Code Wise L1",
        "category": "Refinery Tubes & Piping",
        "petroleumCategory": "Refinery Tubes & Piping",
        "bidsCount": 4,
        "issuesCount": 2,
        "isPrimaryDemo": True,
        "rawClauses": [
            "Clause 1.1 (Bid Completeness): Submission of Bidder Information, Technical Compliance Sheet, Deviation Sheet, Specification Sheet, QAP, and Bank Details.",
            "Clause 2.1 (Pre-Qualification - OEM): Bidder must be an OEM or OEM Authorized Agency with valid Manufacturer Authorization Form (MAF).",
            "Clause 2.2 (ISO Accreditation): Valid ISO 9001:2015 certification active on statutory bid submission date (10-Aug-2026).",
            "Clause 3.1 (EMD Requirement): Submission of EMD of ₹3,70,000 or valid MSE / Udyam registration for exemption applicability.",
            "Clause 4.1 (Statutory - GST & PAN): Valid and active PAN and regular GSTIN registration with verified filing records.",
            "Clause 5.1 (Policy - Make in India): Class-I Local Supplier preference (minimum 50% local content declaration required).",
            "Clause 5.2 (Land Border & Debarment): Compliance with Rule 144(xi) Land Border Declaration and Non-Debarment certificate.",
            "Clause 6.1 (Technical Compliance): Adherence to CPCL Material Spec MS-RAD-6IN-1F3, QAP Stage-III, and Third Party Inspection (TPI) clearance."
        ],
        "requirements": [
            {
                "requirementId": "CPCL-FIN-001",
                "clauseReference": "Tender Clause 3.1",
                "requirementName": "Financial Turnover Threshold",
                "category": "FINANCIAL",
                "mandatory": True,
                "metric": "Average Annual Financial Turnover",
                "minimumValue": ">= ₹10.00 Cr",
                "operator": ">=",
                "description": "Average Annual Financial Turnover during the last 3 financial years must be at least ₹10.00 Crore."
            },
            {
                "requirementId": "CPCL-PQ-001",
                "clauseReference": "Tender Clause 2.1",
                "requirementName": "OEM / OEM Authorized Agency",
                "category": "OEM",
                "mandatory": True,
                "metric": "OEM / OEM Authorized Agency",
                "minimumValue": "Authorized",
                "operator": "==",
                "description": "Bidder must be an OEM or OEM Authorized Agency with verifiable authorization token."
            },
            {
                "requirementId": "CPCL-ISO-002",
                "clauseReference": "Tender Clause 2.2",
                "requirementName": "ISO 9001 Quality Certificate",
                "category": "TEMPORAL",
                "mandatory": True,
                "metric": "ISO 9001 Quality Certificate",
                "minimumValue": "Valid on Bid Date",
                "operator": "VALID_ON_DATE",
                "description": "Valid ISO 9001:2015 certificate active on statutory bid submission date (10-Aug-2026)."
            },
            {
                "requirementId": "CPCL-EMD-003",
                "clauseReference": "Tender Clause 3.1",
                "requirementName": "Earnest Money Deposit (EMD)",
                "category": "FINANCIAL",
                "mandatory": True,
                "metric": "Earnest Money Deposit (EMD)",
                "minimumValue": "₹3,70,000 / MSE Exemption",
                "operator": "==",
                "description": "Submission of ₹3.7 Lakh EMD or valid Udyam certificate for exemption."
            },
            {
                "requirementId": "CPCL-STAT-004",
                "clauseReference": "Tender Clause 4.1",
                "requirementName": "GST Registration (GSTIN)",
                "category": "REGISTRATION",
                "mandatory": True,
                "metric": "GST Registration (GSTIN)",
                "minimumValue": "Active",
                "operator": "==",
                "description": "Valid active GST registration verified against GSTN reference records."
            },
            {
                "requirementId": "CPCL-STAT-005",
                "clauseReference": "Tender Clause 4.1",
                "requirementName": "Corporate PAN Verification",
                "category": "REGISTRATION",
                "mandatory": True,
                "metric": "Corporate PAN Verification",
                "minimumValue": "Active",
                "operator": "==",
                "description": "Valid Corporate PAN issued by Income Tax Department in matching entity name."
            },
            {
                "requirementId": "CPCL-MII-006",
                "clauseReference": "Tender Clause 5.1",
                "requirementName": "Make in India Local Content",
                "category": "LOCAL_CONTENT",
                "mandatory": True,
                "metric": "Make in India Local Content",
                "minimumValue": ">= 50%",
                "operator": ">=",
                "description": "Class-I Local Supplier with minimum 50% domestic value addition certificate."
            },
            {
                "requirementId": "CPCL-DEB-008",
                "clauseReference": "Tender Clause 5.2",
                "requirementName": "Non-Debarment / Holiday Listing Check",
                "category": "DEBARMENT",
                "mandatory": True,
                "metric": "Non-Debarment / Holiday Listing Check",
                "minimumValue": "Clean Record",
                "operator": "NON_BLACKLISTED",
                "description": "Bidder must not be under active debarment or holiday listing by CPCL / MoPNG."
            }
        ]
    },
    {
        "id": "C13A250049",
        "gemBidNo": "C13A250049",
        "title": "Pipe Fittings (CS)",
        "ministry": "Ministry of Petroleum & Natural Gas",
        "department": "M&C / Materials",
        "location": "CPCL Manali, Chennai",
        "estimatedValue": 6.8,
        "publishDate": "2026-07-02",
        "bidEndDate": "2026-08-20",
        "submissionDeadline": "2026-08-20T14:30:00+05:30",
        "status": "UNDER_EVALUATION",
        "stage": "Compliance Verification",
        "priority": "MEDIUM",
        "tenderType": "National Competitive Bidding (NCB)",
        "evaluationMethod": "Overall Item-wise L1",
        "category": "Pipe Fittings & Flanges",
        "petroleumCategory": "Pipe Fittings & Flanges",
        "bidsCount": 6,
        "issuesCount": 1,
        "isPrimaryDemo": False,
        "rawClauses": [
            "Clause 2.1 (Make in India): Mandatory Class-I Local Supplier status with minimum 50% domestic value addition certificate.",
            "Clause 2.2 (MSE Benefits): Valid MSE / Udyam registration for exemption from prior turnover and experience criteria.",
            "Clause 3.1 (Statutory Filings): Active GSTIN registration and 100% matched GSTR-3B return verification.",
            "Clause 3.2 (PAN & Tax Returns): Valid PAN card with submitted Income Tax Returns for last 3 Assessment Years."
        ],
        "requirements": [
            {
                "requirementId": "CPCL-MII-101",
                "clauseReference": "Tender Clause 2.1",
                "requirementName": "Make in India Local Content",
                "category": "LOCAL_CONTENT",
                "mandatory": True,
                "metric": "Make in India Local Content",
                "minimumValue": ">= 50%",
                "operator": ">=",
                "description": "Class-I Local Supplier certificate showing >= 50% local manufacturing content."
            },
            {
                "requirementId": "CPCL-STAT-103",
                "clauseReference": "Tender Clause 3.1",
                "requirementName": "GST Registration & Filings",
                "category": "REGISTRATION",
                "mandatory": True,
                "metric": "GST Registration & Active Filings",
                "minimumValue": "Active",
                "operator": "==",
                "description": "Active Regular GSTIN with verified GSTR-3B filing consistency."
            }
        ]
    },
    {
        "id": "C18B250074",
        "gemBidNo": "C18B250074",
        "title": "Procurement of Atlas Copco Compressor Spares for Manali Refinery",
        "ministry": "Ministry of Petroleum & Natural Gas",
        "department": "M&C Department – Materials",
        "location": "CPCL Manali, Chennai",
        "estimatedValue": 12.4,
        "publishDate": "2026-07-10",
        "bidEndDate": "2026-08-18",
        "submissionDeadline": "2026-08-18T16:00:00+05:30",
        "status": "REVIEW_REQUIRED",
        "stage": "Bid Verification",
        "priority": "HIGH",
        "tenderType": "Domestic Nomination Tender",
        "evaluationMethod": "Item-wise L1",
        "category": "Compressor Spares & Machinery",
        "petroleumCategory": "Compressor Spares & Machinery",
        "bidsCount": 3,
        "issuesCount": 1,
        "isPrimaryDemo": False,
        "rawClauses": [
            "Clause 1.1 (Proprietary Eligibility): Nomination tender restricted to OEM M/s Atlas Copco Airpower or 100% authorized Indian subsidiary.",
            "Clause 2.1 (OEM Authorization Token): Verified OEM authorization token and parent manufacturing backing for genuine compressor parts."
        ],
        "requirements": [
            {
                "requirementId": "CPCL-PROP-201",
                "clauseReference": "Tender Clause 1.1",
                "requirementName": "Proprietary OEM Eligibility",
                "category": "OEM",
                "mandatory": True,
                "metric": "Proprietary OEM Eligibility",
                "minimumValue": "Atlas Copco / Authorized Subsidiary",
                "operator": "==",
                "description": "Nomination tender strictly restricted to proprietary OEM or authorized Indian entity."
            }
        ]
    },
    {
        "id": "C21B240011",
        "gemBidNo": "C21B240011",
        "title": "CPCL Explosion Proof CCTV Cameras",
        "ministry": "Ministry of Petroleum & Natural Gas",
        "department": "M&C / Materials",
        "location": "CPCL Manali, Chennai",
        "estimatedValue": 4.2,
        "publishDate": "2026-07-15",
        "bidEndDate": "2026-08-25",
        "submissionDeadline": "2026-08-25T15:00:00+05:30",
        "status": "UNDER_EVALUATION",
        "stage": "Compliance Verification",
        "priority": "HIGH",
        "tenderType": "Two-Cover Techno-Commercial Tender",
        "evaluationMethod": "Comprehensive Package L1",
        "category": "Surveillance & Industrial Safety",
        "petroleumCategory": "Surveillance & Industrial Safety",
        "bidsCount": 5,
        "issuesCount": 3,
        "isPrimaryDemo": False,
        "rawClauses": [
            "Clause 1.1 (Flameproof Accreditation): Valid PESO (Petroleum & Explosives Safety Org) / ATEX Zone-1 Gas Group IIA/IIB/IIC certificate.",
            "Clause 2.1 (EMD Deposit): EMD of ₹1,50,000 via BG / online transfer or MSE exemption certificate."
        ],
        "requirements": [
            {
                "requirementId": "CPCL-EX-301",
                "clauseReference": "Tender Clause 1.1",
                "requirementName": "PESO / ATEX Flameproof Certificate",
                "category": "SAFETY",
                "mandatory": True,
                "metric": "PESO / ATEX Flameproof Certificate",
                "minimumValue": "Valid Zone-1 Ex-d",
                "operator": "VALID_ON_DATE",
                "description": "Active PESO or ATEX certification for hazardous refinery hydrocarbon environment."
            }
        ]
    }
]

CPCL_BIDDERS = [
    {
        "id": "BID-ATC-001",
        "tenderId": "C03H240087",
        "name": "Atlas Copco (India) Private Limited",
        "cin": "U27100MH1960PLC011649",
        "pan": "AAACA1234F",
        "gstin": "27AAACA1234F1Z8",
        "udyamNo": "UDYAM-MH-26-0012489",
        "claimedAddress": "Sveanagar, Dapodi, Pune, Maharashtra - 411012",
        "verifiedAddress": "Sveanagar, Dapodi, Pune, Maharashtra - 411012",
        "claimedTurnover": 84.5,
        "verifiedTurnover": 84.5,
        "claimedExperienceYears": 12.0,
        "verifiedExperienceYears": 12.0,
        "bidSubmissionDate": "2026-08-10",
        "turnoverBreakdown": [
            {"year": "FY 2023-24", "claimed": 78.2, "verified": 78.2},
            {"year": "FY 2024-25", "claimed": 84.5, "verified": 84.5},
            {"year": "FY 2025-26", "claimed": 91.0, "verified": 91.0}
        ],
        "oemAuth": {
            "oemName": "Atlas Copco Airpower n.v., Belgium",
            "authCode": "MAF-CPCL-2026-9921",
            "issuedTo": "Atlas Copco (India) Private Limited",
            "validTill": "2028-12-31",
            "verifiedDirectly": True,
            "qrVerified": True,
            "notes": "Direct Operating Subsidiary with back-to-back OEM warranty"
        },
        "riskProfile": {
            "complianceScore": 100.0,
            "evidenceConfidence": 98.0,
            "financialRisk": 10.0,
            "documentRisk": 10.0,
            "eligibilityRisk": 10.0,
            "temporalRisk": 10.0,
            "overallRisk": "LOW",
            "aiRecommendation": "CLEARED",
            "summary": "All 9 CPCL compliance requirements verified. OEM manufacturer authorization fully validated.",
            "topIssues": []
        },
        "status": "VERIFIED"
    },
    {
        "id": "BID-ABC-001",
        "tenderId": "C03H240087",
        "name": "ABC Industries Private Limited",
        "cin": "U72900KA2018PTC112345",
        "pan": "AABCA1234F",
        "gstin": "33AABCA1234F1Z5",
        "udyamNo": "UDYAM-TN-02-0019284",
        "claimedAddress": "Plot 14, Guindy Industrial Estate, Chennai - 600032",
        "verifiedAddress": "Plot 42, Electronic City Phase 1, Bengaluru - 560100",
        "claimedTurnover": 12.0,
        "verifiedTurnover": 8.7,
        "claimedExperienceYears": 7.0,
        "verifiedExperienceYears": 3.8,
        "bidSubmissionDate": "2026-08-10",
        "turnoverBreakdown": [
            {"year": "FY 2023-24", "claimed": 11.5, "verified": 8.2},
            {"year": "FY 2024-25", "claimed": 12.0, "verified": 8.7},
            {"year": "FY 2025-26", "claimed": 12.5, "verified": 9.1}
        ],
        "riskProfile": {
            "complianceScore": 84.0,
            "evidenceConfidence": 88.0,
            "financialRisk": 75.0,
            "documentRisk": 40.0,
            "eligibilityRisk": 45.0,
            "temporalRisk": 10.0,
            "overallRisk": "HIGH",
            "aiRecommendation": "REQUIRES_VERIFICATION",
            "summary": "Officer Action Required: Declared average turnover (₹12.0 Cr) differs from MCA21 filing (₹8.7 Cr). Clarification required.",
            "topIssues": [
                "Financial Turnover Discrepancy: Declared ₹12.0 Cr vs MCA21 Form AOC-4 ₹8.7 Cr"
            ]
        },
        "status": "REQUIRES_VERIFICATION"
    }
]

def seed_database(db: Session, force: bool = False):
    """Populates database with CPCL Tenders and Bidders idempotently."""
    if force:
        db.query(TenderRequirement).delete()
        db.query(Document).delete()
        db.query(Clarification).delete()
        db.query(Bidder).delete()
        db.query(Tender).delete()
        db.commit()

    for t_item in CPCL_TENDERS:
        t_data = copy.deepcopy(t_item)
        reqs = t_data.pop("requirements", [])
        existing_tender = db.query(Tender).filter(Tender.id == t_data["id"]).first()
        if not existing_tender:
            tender = Tender(**t_data)
            db.add(tender)
            db.flush()
        else:
            tender = existing_tender

        for r_data in reqs:
            req_id = f"REQ-{r_data['requirementId']}"
            existing_req = db.query(TenderRequirement).filter(TenderRequirement.id == req_id).first()
            if not existing_req:
                req = TenderRequirement(
                    id=req_id,
                    tenderId=tender.id,
                    **r_data
                )
                db.add(req)

    for b_item in CPCL_BIDDERS:
        b_data = copy.deepcopy(b_item)
        existing_bidder = db.query(Bidder).filter(Bidder.id == b_data["id"]).first()
        if not existing_bidder:
            bidder = Bidder(**b_data)
            db.add(bidder)

    # Initial audit record
    existing_audit = db.query(AuditRecord).filter(AuditRecord.id == "AUD-SYSTEM-INIT").first()
    if not existing_audit:
        audit_init = AuditRecord(
            id="AUD-SYSTEM-INIT",
            timestamp="2026-09-05 10:00:00",
            officerId="SYSTEM",
            evaluationId="C03H240087",
            bidder="SYSTEM_SEED",
            actor="System Initializer",
            actorRole="ADMIN",
            action="SYSTEM_INITIALIZATION",
            decision="INITIALIZED",
            reason="Pre-seeded CPCL Tenders and Controlled Verification Registries.",
            target="SYSTEM_REGISTRY",
            result="SUCCESS",
            eventHash="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            hash="sha256:4a8c91d2e0f872b65103a8904712ec3105ab6719cd288231aa492147810fed01",
            details="Pre-seeded 4 CPCL Tenders and Bidders into e-BID PRAMAAN DB."
        )
        db.add(audit_init)

    db.commit()

