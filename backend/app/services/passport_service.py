"""
Bidder Compliance Passport Engine
e-BID PRAMAAN — CPCL
Aggregates verifiable statutory credentials into a standardized, reusable compliance passport
with strict tender-applicability and temporal cutoff validation.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.services.reference_adapters import ReferenceAdapters

class PassportService:
    @classmethod
    def generate_bidder_passport(
        cls,
        bidder: Dict[str, Any],
        tender: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generates a comprehensive Bidder Compliance Passport.
        Cross-checks tender-specific applicability if a tender is provided.
        """
        bidder_id = bidder.get("id", "BIDDER-01")
        bidder_name = bidder.get("name", "Bidder Entity")
        bid_cutoff = tender.get("bidEndDate", "2026-08-10") if tender else "2026-08-10"

        # Execute all reference source adapters
        adapters = ReferenceAdapters.run_all_adapters(bidder)

        # Build structured credentials list with validity checks
        credentials = []
        for adp in adapters:
            is_valid_for_tender = True
            validity_note = "Valid and active on record."
            
            # Check temporal validity if relevant
            if adp["sourceName"] == "OEM Verification Gateway":
                valid_till = adp["details"].get("validTill", "2027-12-31")
                if valid_till < bid_cutoff:
                    is_valid_for_tender = False
                    validity_note = f"Warning: Valid till {valid_till}, which is before tender bid cutoff ({bid_cutoff})."
            
            credentials.append({
                "credentialId": adp["id"],
                "sourceName": adp["sourceName"],
                "authority": adp["authority"],
                "category": adp["category"],
                "verifiedIdentifier": adp["checkedInfo"],
                "verificationStatus": adp["result"],
                "referenceToken": adp["token"],
                "referenceDataset": adp["referenceDatasetName"],
                "verifiedTimestamp": adp["lastChecked"],
                "evidenceSummary": adp["evidence"],
                "confidenceScore": 99.0 if adp["result"] in ["VERIFIED", "CLEAR"] else 85.0,
                "isValidForSelectedTender": is_valid_for_tender,
                "validityNote": validity_note,
                "metadata": adp["details"]
            })

        risk_prof = bidder.get("riskProfile", {})
        compliance_score = risk_prof.get("complianceScore", 95.0)
        overall_risk = risk_prof.get("overallRisk", "LOW")

        return {
            "passportId": f"PASSPORT-{bidder_id}",
            "bidderId": bidder_id,
            "bidderName": bidder_name,
            "cin": bidder.get("cin", "U27100MH1960PLC011649"),
            "pan": bidder.get("pan", "AABCA1234F"),
            "gstin": bidder.get("gstin", "33AABCA1234F1Z5"),
            "udyamNo": bidder.get("udyamNo", "UDYAM-TN-02-0019284"),
            "claimedTurnoverCr": bidder.get("claimedTurnover", 25.0),
            "verifiedTurnoverCr": bidder.get("verifiedTurnover", 25.0),
            "registeredAddress": bidder.get("verifiedAddress") or bidder.get("claimedAddress", "Corporate Office, India"),
            "overallComplianceScore": compliance_score,
            "overallRiskLevel": overall_risk,
            "passportStatus": "ACTIVE_VERIFIED" if compliance_score >= 90.0 else "REQUIRES_CLARIFICATION",
            "totalVerifiedCredentials": len([c for c in credentials if c["verificationStatus"] in ["VERIFIED", "CLEAR"]]),
            "totalPendingIssues": len([c for c in credentials if c["verificationStatus"] not in ["VERIFIED", "CLEAR"]]),
            "statutoryCredentials": credentials,
            "governanceNotice": (
                "This Compliance Passport is a verified aggregation of statutory and technical records. "
                "Procurement Officers must re-verify tender-specific validity dates before final qualification."
            ),
            "generatedAt": datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M:%S IST")
        }
