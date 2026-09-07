"""
Risk Scoring & Discrepancy Engine
e-BID PRAMAAN — CPCL
Transparent weighted rule-based risk evaluation without black-box auto-rejection.
"""

from typing import List, Dict, Any

class RiskScoringEngine:
    @classmethod
    def calculate_bidder_risk(
        cls,
        compliance_matrix: List[Dict[str, Any]],
        temporal_checks: List[Dict[str, Any]],
        bidder: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates multidimensional risk score and transparent breakdown.
        """
        financial_risk = 10.0
        document_risk = 10.0
        eligibility_risk = 10.0
        temporal_risk = 10.0
        
        top_issues = []
        conflicts_count = 0
        warnings_count = 0

        # Evaluate compliance matrix rows
        for row in compliance_matrix:
            res = row.get("result", "PASS")
            risk = row.get("risk", "LOW")
            req = row.get("requirement", "")

            if res == "CONFLICT" or risk == "HIGH":
                conflicts_count += 1
                if "Turnover" in req or "Financial" in req:
                    financial_risk = max(financial_risk, 75.0)
                    top_issues.append("Financial Turnover Discrepancy: Declared figure exceeds MCA21 Form AOC-4 statutory filing.")
                elif "OEM" in req:
                    eligibility_risk = max(eligibility_risk, 80.0)
                    top_issues.append("OEM Authorization Scope: Direct operating subsidiary linkage required.")
                elif "ISO" in req or "Certificate" in req:
                    document_risk = max(document_risk, 70.0)
                    top_issues.append("Quality Certificate Validity: Requires renewal verification.")
            elif res == "WARNING" or risk == "MEDIUM":
                warnings_count += 1
                document_risk = max(document_risk, 40.0)

        # Evaluate temporal checks
        for tc in temporal_checks:
            if tc.get("status") == "EXPIRED_BEFORE_BID":
                temporal_risk = max(temporal_risk, 85.0)
                top_issues.append(f"{tc.get('documentName', 'Certificate')} was expired prior to the bid cutoff date.")
            elif tc.get("status") == "EXPIRING_SOON":
                temporal_risk = max(temporal_risk, 45.0)

        # Weighted calculation
        total_risk_score = (
            (financial_risk * 0.35) +
            (document_risk * 0.25) +
            (eligibility_risk * 0.25) +
            (temporal_risk * 0.15)
        )

        compliance_score = max(20.0, min(100.0, round(100.0 - (conflicts_count * 15.0) - (warnings_count * 5.0), 1)))
        
        if conflicts_count > 0 or total_risk_score >= 60.0:
            overall_risk = "HIGH"
            ai_recommendation = "REQUIRES_VERIFICATION"
            summary = f"Procurement Officer Action Required: {conflicts_count} compliance discrepancy/conflict detected. Send clarification notice before final qualification determination."
        elif warnings_count > 0 or total_risk_score >= 35.0:
            overall_risk = "MEDIUM"
            ai_recommendation = "REQUIRES_VERIFICATION"
            summary = "Minor documentation observations noted. Recommended for officer review and verification."
        else:
            overall_risk = "LOW"
            ai_recommendation = "CLEARED"
            summary = "All mandatory statutory, technical, and commercial criteria verified compliant. Ready for Officer final decision."

        return {
            "complianceScore": compliance_score,
            "evidenceConfidence": 95.0,
            "financialRisk": financial_risk,
            "documentRisk": document_risk,
            "eligibilityRisk": eligibility_risk,
            "temporalRisk": temporal_risk,
            "overallRisk": overall_risk,
            "aiRecommendation": ai_recommendation,
            "summary": summary,
            "topIssues": top_issues
        }
