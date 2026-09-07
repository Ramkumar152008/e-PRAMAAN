"""
Statutory Procurement Knowledge Corpus
e-BID PRAMAAN — CPCL / GeM Procurement
Contains verified statutory procurement clauses, manuals, and policy rules for RAG retrieval.
Sources:
1. General Financial Rules (GFR) 2017 (Ministry of Finance)
2. Manual for Procurement of Goods 2024 (Department of Expenditure)
3. Public Procurement (Preference to Make in India) Order, DPIIT
4. GeM Incident Management & Verification Policy
5. CPCL Purchase Procedures & Materials Manual
"""

from typing import List, Dict, Any

STATUTORY_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "KB-GFR-144-01",
        "document": "General Financial Rules (GFR) 2017",
        "document_name": "General Financial Rules 2017 (Amended)",
        "document_type": "STATUTORY_RULE",
        "authority": "Ministry of Finance, Department of Expenditure",
        "section": "Rule 144(xi)",
        "clause": "Rule 144(xi) - Land Border Clause",
        "page": 42,
        "source": "Government of India Official Gazette",
        "version": "2024-Update",
        "effective_date": "2020-07-23",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Restrictions on Procurement from Land Border Sharing Nations",
        "content": (
            "Any bidder from a country which shares a land border with India will be eligible to bid in any procurement "
            "whether of goods, services or works only if the bidder is registered with the Competent Authority (DPIIT). "
            "Bidder must provide a statutory self-declaration confirming compliance with Rule 144(xi). False declaration "
            "constitutes a ground for immediate disqualification and debarment under Rule 175."
        ),
        "keywords": ["land border", "rule 144", "dpiit registration", "competent authority", "foreign bidder", "statutory declaration"],
        "applicableClauses": ["CPCL Clause 5.2", "GeM GTC Clause 4"]
    },
    {
        "id": "KB-GFR-153-02",
        "document": "General Financial Rules (GFR) 2017",
        "document_name": "General Financial Rules 2017 & PPP-MSE Order 2012",
        "document_type": "POLICY_ORDER",
        "authority": "Ministry of Finance & Ministry of MSME",
        "section": "Rule 153 & PPP-MSE Order 2012",
        "clause": "Rule 153 - Micro & Small Enterprise Policy",
        "page": 48,
        "source": "Ministry of MSME Policy Gazette",
        "version": "2023-Revised",
        "effective_date": "2012-03-23",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Public Procurement Policy for Micro and Small Enterprises (MSEs)",
        "content": (
            "Under the Public Procurement Policy for MSEs Order 2012, registered MSEs (holding valid Udyam Registration) "
            "are eligible for exemption from payment of Earnest Money Deposit (EMD) / Bid Security and waiver from prior "
            "turnover and prior experience criteria, subject to meeting technical and quality specifications. "
            "Enterprise classification must be active in manufacturing/services relevant to the tender NIC code."
        ),
        "keywords": ["msme", "mse", "udyam", "emd exemption", "turnover exemption", "prior experience waiver", "rule 153", "ppp-mse"],
        "applicableClauses": ["CPCL Clause 3.1", "Tender Clause 2.2"]
    },
    {
        "id": "KB-GFR-170-03",
        "document": "General Financial Rules (GFR) 2017",
        "document_name": "General Financial Rules 2017",
        "document_type": "STATUTORY_RULE",
        "authority": "Ministry of Finance, Department of Expenditure",
        "section": "Rule 170",
        "clause": "Rule 170 - Bid Security / EMD",
        "page": 54,
        "source": "Ministry of Finance Standard Bidding Procedures",
        "version": "2017.1",
        "effective_date": "2017-04-01",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Bid Security / Earnest Money Deposit (EMD) Compliance",
        "content": (
            "To safeguard against a bidder withdrawing or altering its bid during the period of bid validity, "
            "Bid Security / EMD must be submitted in the prescribed format (Bank Guarantee, Demand Draft, or Online Transfer) "
            "prior to the bid closing date and time. Bidders claiming MSE/Startup exemption must submit valid statutory "
            "certificates active as on the statutory bid submission deadline."
        ),
        "keywords": ["emd", "bid security", "bank guarantee", "exemption", "bid cutoff", "rule 170"],
        "applicableClauses": ["CPCL Clause 3.1", "Tender Clause 2.1"]
    },
    {
        "id": "KB-MPG-PQC-04",
        "document": "Manual for Procurement of Goods 2024",
        "document_name": "Manual for Procurement of Goods (Ministry of Finance)",
        "document_type": "PROCUREMENT_MANUAL",
        "authority": "Department of Expenditure, Procurement Policy Division",
        "section": "Chapter 5 — Pre-Qualification Criteria (PQC)",
        "clause": "Para 5.1.2 - Audited Financials & UDIN",
        "page": 78,
        "source": "DoE Procurement Policy Division Official Manual",
        "version": "2024-Edition",
        "effective_date": "2024-01-15",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Financial Turnover & Audited Statement Verification (UDIN Mandatory)",
        "content": (
            "Average Annual Financial Turnover during the last 3 financial years must meet the threshold specified in the NIT. "
            "Turnover must be evidenced by Audited Balance Sheets or CA Certificates bearing a valid Unique Document Identification "
            "Number (UDIN) issued by ICAI. Declared turnover must be cross-verified against statutory Form AOC-4 filings available "
            "in the MCA21 registry. Where discrepancies exceed materiality thresholds, a formal clarification notice must be dispatched."
        ),
        "keywords": ["turnover", "pqc", "audited balance sheet", "ca certificate", "udin", "mca21", "aoc-4", "financial threshold"],
        "applicableClauses": ["CPCL Clause 3.1", "Tender Clause 1.1"]
    },
    {
        "id": "KB-MPG-OEM-05",
        "document": "Manual for Procurement of Goods 2024",
        "document_name": "Manual for Procurement of Goods (Ministry of Finance)",
        "document_type": "PROCUREMENT_MANUAL",
        "authority": "Department of Expenditure, Procurement Policy Division",
        "section": "Chapter 5, Para 5.3.4",
        "clause": "Para 5.3.4 - Manufacturer Authorization Protocol",
        "page": 82,
        "source": "DoE Procurement Policy Division Official Manual",
        "version": "2024-Edition",
        "effective_date": "2024-01-15",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Manufacturer Authorization Form (MAF) & OEM Backing Standards",
        "content": (
            "When a non-manufacturer / dealer bids against an OEM requirement, a specific Manufacturer Authorization Form (MAF) "
            "issued by the parent OEM is mandatory. The MAF must explicitly guarantee back-to-back technical support, genuine "
            "spares supply, and comprehensive warranty backing for the equipment/materials tendered. Where an Indian subsidiary "
            "submits a global parent MAF, parent-subsidiary corporate linkage undertaking and board resolution must be verified."
        ),
        "keywords": ["oem authorization", "maf", "manufacturer", "subsidiary", "warranty backing", "dealer mandate", "genuine spares"],
        "applicableClauses": ["CPCL Clause 2.1", "CPCL Clause 1.1"]
    },
    {
        "id": "KB-MII-DPIIT-06",
        "document": "Public Procurement (Preference to Make in India) Order 2017",
        "document_name": "Public Procurement (Preference to Make in India) Order",
        "document_type": "STATUTORY_ORDER",
        "authority": "DPIIT, Ministry of Commerce & Industry",
        "section": "Order No. P-45021/2/2017-PP (BE-II)",
        "clause": "Para 3 - Local Content Calculation",
        "page": 12,
        "source": "DPIIT Central Public Procurement Notification",
        "version": "2020-Revision",
        "effective_date": "2020-09-16",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Local Content Thresholds and Class-I Supplier Preference",
        "content": (
            "Under the Make in India procurement policy: (a) 'Class-I Local Supplier' means a supplier whose goods offer at least "
            "50% local content. (b) 'Class-II Local Supplier' means local content between 20% and 50%. Only Class-I local suppliers "
            "are eligible for purchase preference in CPCL / PSU petroleum tenders. Local content declarations must be accompanied by "
            "a Cost Accountant / Statutory Auditor certificate for tenders exceeding ₹10 Crores."
        ),
        "keywords": ["make in india", "local content", "class-i local supplier", "domestic value addition", "dpiit", "purchase preference"],
        "applicableClauses": ["CPCL Clause 5.1", "Tender Clause 2.1"]
    },
    {
        "id": "KB-CPCL-TEMP-07",
        "document": "CPCL Works & Materials Procurement Manual 2025",
        "document_name": "CPCL Purchase Procedures & Manual",
        "document_type": "INTERNAL_PROCEDURE",
        "authority": "Chennai Petroleum Corporation Limited (M&C Department)",
        "section": "Section 4 — Temporal Compliance & Document Validity",
        "clause": "Section 4.3 - Bid Submission Cutoff Rule",
        "page": 31,
        "source": "CPCL Materials & Contracts Operating Manual",
        "version": "2025.2",
        "effective_date": "2025-01-01",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Statutory Bid Cut-off Date Principle for Document Validity",
        "content": (
            "All statutory registrations (GSTIN, PAN, Udyam), quality accreditations (ISO 9001, PESO/ATEX, API 5L), and OEM "
            "authorization letters must be active and legally valid as on the statutory Bid Submission Cutoff Date. Documents "
            "issued subsequent to the bid cutoff date (post-dated evidence) cannot be accepted to establish pre-bid eligibility. "
            "Certificates expiring before the bid submission cutoff date must be flagged as EXPIRED AT BID DATE."
        ),
        "keywords": ["temporal compliance", "bid cutoff date", "valid on bid date", "post-dated", "expired certificate", "iso 9001", "peso"],
        "applicableClauses": ["CPCL Clause 2.2", "CPCL Clause 1.1", "Tender Clause 4.1"]
    },
    {
        "id": "KB-CPCL-DEB-08",
        "document": "CPCL Vendor Holiday Listing & Debarment Guidelines",
        "document_name": "CPCL & MoPNG Holiday Listing Guidelines",
        "document_type": "STATUTORY_POLICY",
        "authority": "Chennai Petroleum Corporation Limited & MoPNG",
        "section": "Chapter 9 — Integrity & Watchlist Protocol",
        "clause": "Chapter 9.1 - Debarment Registry",
        "page": 65,
        "source": "MoPNG Central PSU Debarment Policy",
        "version": "2023.1",
        "effective_date": "2023-06-01",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Debarment, Blacklisting, and Holiday Listing Verification",
        "content": (
            "CPCL maintains an active alignment with the Central Public Procurement Portal (CPPP) and Ministry of Petroleum & "
            "Natural Gas (MoPNG) centralized debarment registers. An entity, its directors, or sister concerns placed under Holiday "
            "Listing or Debarment by CPCL, IOCL, ONGC, GAIL, HPCL, or BPCL are disqualified from techno-commercial qualification. "
            "Verification against the centralized CPPP Debarment Registry is mandatory for every evaluated bidder."
        ),
        "keywords": ["debarment", "blacklisting", "holiday listing", "mopng", "cppp", "integrity pact", "disqualification"],
        "applicableClauses": ["CPCL Clause 5.2", "Tender Clause 5.2"]
    },
    {
        "id": "KB-CPCL-SPEC-09",
        "document": "CPCL Technical Standards — Refinery Tube Specification",
        "document_name": "CPCL Specification MS-RAD-6IN-1F3",
        "document_type": "TECHNICAL_STANDARD",
        "authority": "CPCL Engineering & Technical Services Department",
        "section": "Spec MS-RAD-6IN-1F3 & QAP Stage-III",
        "clause": "Spec Clause 3.2 - Furnace Tubes",
        "page": 18,
        "source": "CPCL Engineering Standards Archive",
        "version": "Rev-04",
        "effective_date": "2024-05-10",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Refinery Radiant Tubes Material Standards & TPI Clearance",
        "content": (
            "Procurement of 6-inch Radiant Tubes for Refinery Furnace 1F3 requires adherence to ASTM A312 TP304H/TP347H standards, "
            "solution annealing certification, 100% radiographic examination, and stage-wise Third Party Inspection (TPI) by "
            "approved agencies (Lloyd's Register, BVQI, DNV, TUV). Non-destructive testing (NDT) reports and Quality Assurance "
            "Plan (QAP) Stage-III approval must be submitted prior to dispatch."
        ),
        "keywords": ["radiant tube", "1f3", "furnace", "tpi", "qap", "astm a312", "tp347h", "refinery piping", "inspection"],
        "applicableClauses": ["CPCL Clause 6.1", "CPCL Material Spec MS-RAD-6IN-1F3"]
    },
    {
        "id": "KB-GEM-CLAR-10",
        "document": "GeM Procurement Guidelines & Incident Management Policy",
        "document_name": "GeM General Terms & Conditions (GTC)",
        "document_type": "PLATFORM_POLICY",
        "authority": "Government e-Marketplace (GeM), Ministry of Commerce",
        "section": "Para 14 — Clarification Protocols & Strict Human Authority",
        "clause": "Para 14.2 - Clarification Grounding",
        "page": 90,
        "source": "Government e-Marketplace (GeM) Portal Policy",
        "version": "GTC-v4.0",
        "effective_date": "2024-02-01",
        "sourceCategory": "PRIMARY_SOURCE",
        "title": "Clarification Closed-Loop Protocol & Final Officer Jurisdiction",
        "content": (
            "Clarifications sought from bidders must strictly relate to ambiguities or minor documentation gaps in submitted bids. "
            "Clarifications must NEVER permit any alteration in bid price, substantive commercial terms, or post-bid qualification "
            "criteria relaxation. Automated AI systems are strictly advisory and decision-support mechanisms; final evaluation, "
            "qualification, and disqualification decisions remain exclusively within the statutory authority of the designated "
            "Procurement Officer."
        ),
        "keywords": ["clarification", "gem policy", "closed loop", "no price change", "human authority", "procurement officer", "re-verification"],
        "applicableClauses": ["GeM Clause 14", "CPCL Clarification Procedure"]
    }
]
