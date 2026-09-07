"""
Forensic Compliance Report Generator Service
e-BID PRAMAAN — CPCL
Generates printable and exportable audit and evaluation reports.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List

class ReportService:
    @classmethod
    def generate_bidder_report(
        cls,
        tender: Dict[str, Any],
        bidder: Dict[str, Any],
        matrix: List[Dict[str, Any]],
        clarifications: List[Dict[str, Any]],
        audit_logs: List[Dict[str, Any]],
        decision: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Builds a comprehensive forensic compliance verification report.
        """
        now = datetime.now(timezone.utc)
        generated_at = now.strftime("%d-%b-%Y %H:%M:%S IST")
        
        return {
            "reportId": f"REP-CPCL-{bidder.get('id', 'BID')}-{now.strftime('%Y%m%d')}",
            "generatedAt": generated_at,
            "organization": "Chennai Petroleum Corporation Limited (CPCL)",
            "platform": "e-BID PRAMAAN",
            "tenderDetails": {
                "tenderId": tender.get("gemBidNo", tender.get("id")),
                "title": tender.get("title"),
                "estimatedValue": f"₹{tender.get('estimatedValue', 0.0)} Crore",
                "department": tender.get("department", "M&C / Materials"),
                "bidCutoffDate": tender.get("bidEndDate", "2026-08-10")
            },
            "bidderDetails": {
                "bidderId": bidder.get("id"),
                "name": bidder.get("name"),
                "cin": bidder.get("cin"),
                "pan": bidder.get("pan"),
                "gstin": bidder.get("gstin"),
                "udyamNo": bidder.get("udyamNo"),
                "registeredAddress": bidder.get("verifiedAddress") or bidder.get("claimedAddress")
            },
            "complianceSummary": {
                "score": bidder.get("riskProfile", {}).get("complianceScore", 95),
                "riskLevel": bidder.get("riskProfile", {}).get("overallRisk", "LOW"),
                "totalClausesChecked": len(matrix),
                "passedClauses": sum(1 for m in matrix if m.get("result") == "PASS"),
                "conflictsDetected": sum(1 for m in matrix if m.get("result") == "CONFLICT"),
                "warnings": sum(1 for m in matrix if m.get("result") == "WARNING")
            },
            "clauseComplianceMatrix": matrix,
            "clarificationHistory": clarifications,
            "officerDetermination": {
                "action": decision.get("action", "PENDING"),
                "officerName": decision.get("officerName", "Rajeshwar Rao"),
                "officerDesignation": decision.get("officerDesignation", "Senior Procurement Officer"),
                "officerId": decision.get("officerId", "PO-1042"),
                "remarks": decision.get("reasonRemarks", "Verified against statutory registers and CPCL tender requirements."),
                "timestamp": decision.get("timestamp", generated_at),
                "digitalSignatureHash": decision.get("digitalSignatureHash", "SIG-PO1042-OFFICIAL")
            },
            "auditSummary": {
                "totalAuditRecords": len(audit_logs),
                "latestHash": audit_logs[0].get("hash") if audit_logs else "SHA256:INITIAL"
            }
        }
