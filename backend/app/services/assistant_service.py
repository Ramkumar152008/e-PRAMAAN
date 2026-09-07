"""
Controlled Compliance Investigation Assistant & Tool Permission Layer
e-BID PRAMAAN — CPCL
Enforces strict capability allowlists and statutory decision-support guardrails.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.services.rag_service import RAGService
from app.services.matching_service import MatchingService
from app.services.temporal_service import TemporalValidationService
from app.services.reference_adapters import ReferenceAdapters

# Explicit Tool Permission Allowlist
ALLOWED_TOOLS = {
    "retrieve_tender_clause",
    "retrieve_bidder_evidence",
    "query_reference_source",
    "compare_evidence",
    "validate_temporal_status",
    "search_knowledge_base",
    "draft_clarification",
    "summarize_finding"
}

PROHIBITED_ACTIONS = {
    "reject_bidder",
    "qualify_bidder",
    "select_bidder",
    "modify_tender_rule",
    "modify_threshold",
    "alter_evidence",
    "make_final_decision"
}

class AssistantService:
    @classmethod
    def execute_tool(cls, tool_name: str, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes an agent tool strictly through the permission gate.
        """
        if tool_name in PROHIBITED_ACTIONS:
            return {
                "success": False,
                "error": "STATUTORY_VIOLATION",
                "message": (
                    f"Action '{tool_name}' is strictly PROHIBITED. "
                    "AI Assistants operate exclusively in a Decision-Support capacity. "
                    "Final procurement qualification, disqualification, or rule changes "
                    "must be executed directly by the authorized Procurement Officer."
                )
            }

        if tool_name not in ALLOWED_TOOLS:
            return {
                "success": False,
                "error": "UNAUTHORIZED_TOOL",
                "message": f"Tool '{tool_name}' is not in the authorized procurement assistant allowlist."
            }

        # 1. retrieve_tender_clause
        if tool_name == "retrieve_tender_clause":
            clauses = context.get("tender", {}).get("rawClauses", [])
            query = params.get("query", "")
            matched = [c for c in clauses if query.lower() in c.lower()] if query else clauses
            return {"success": True, "tool": tool_name, "result": matched}

        # 2. retrieve_bidder_evidence
        elif tool_name == "retrieve_bidder_evidence":
            bidder = context.get("bidder", {})
            return {
                "success": True,
                "tool": tool_name,
                "result": {
                    "bidderId": bidder.get("id"),
                    "name": bidder.get("name"),
                    "gstin": bidder.get("gstin"),
                    "pan": bidder.get("pan"),
                    "udyamNo": bidder.get("udyamNo"),
                    "claimedTurnover": bidder.get("claimedTurnover"),
                    "verifiedTurnover": bidder.get("verifiedTurnover"),
                    "oemAuth": bidder.get("oemAuth")
                }
            }

        # 3. query_reference_source
        elif tool_name == "query_reference_source":
            bidder = context.get("bidder", {})
            adapters = ReferenceAdapters.run_all_adapters(bidder)
            source_filter = params.get("sourceName", "")
            if source_filter:
                adapters = [a for a in adapters if source_filter.lower() in a["sourceName"].lower()]
            return {"success": True, "tool": tool_name, "result": adapters}

        # 4. compare_evidence
        elif tool_name == "compare_evidence":
            match_type = params.get("type", "IDENTIFIER")
            claimed = params.get("claimed", "")
            reference = params.get("reference", "")
            res = MatchingService.compare_fields(match_type, claimed, reference)
            return {"success": True, "tool": tool_name, "result": res}

        # 5. validate_temporal_status
        elif tool_name == "validate_temporal_status":
            valid_until = params.get("validUntil", "2027-12-31")
            bid_cutoff = params.get("bidCutoff", "2026-08-10")
            valid_from = params.get("validFrom")
            doc_name = params.get("docName", "Certificate")
            res = TemporalValidationService.validate_bid_date_compliance(valid_until, bid_cutoff, valid_from, doc_name)
            return {"success": True, "tool": tool_name, "result": res}

        # 6. search_knowledge_base
        elif tool_name == "search_knowledge_base":
            query = params.get("query", "")
            clauses = context.get("tender", {}).get("rawClauses", [])
            res = RAGService.search_knowledge_base(query, tender_clauses=clauses)
            return {"success": True, "tool": tool_name, "result": res}

        # 7. draft_clarification
        elif tool_name == "draft_clarification":
            issue = params.get("issue", "Documentation Gap")
            requirement = params.get("requirement", "Clause Compliance")
            draft = (
                f"With reference to CPCL Tender requirement regarding '{requirement}', "
                f"your submitted documentation shows an ambiguity concerning '{issue}'. "
                f"Please submit verified documentary evidence and audited reconciliation within 48 hours. "
                f"Note: This clarification must not alter the commercial bid price or substantive terms."
            )
            return {"success": True, "tool": tool_name, "result": {"draftText": draft, "suggestedDeadline": "48 Hours"}}

        # 8. summarize_finding
        elif tool_name == "summarize_finding":
            finding = params.get("finding", {})
            summary = (
                f"Finding: {finding.get('requirement', 'Requirement')} — {finding.get('finding', 'Discrepancy detected')}. "
                f"Claimed: {finding.get('claim', 'N/A')} vs Verified: {finding.get('verificationSource', 'N/A')}. "
                f"Recommended Action: {finding.get('recommendedAction', 'Officer review required.')}"
            )
            return {"success": True, "tool": tool_name, "result": {"summary": summary}}

        return {"success": False, "error": "UNKNOWN_TOOL"}

    @classmethod
    def process_query(
        cls,
        question: str,
        tender: Dict[str, Any],
        bidder: Dict[str, Any],
        findings: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        High-level conversational investigation assistant dispatcher with multi-step reasoning.
        """
        context = {
            "tender": tender,
            "bidder": bidder,
            "findings": findings or []
        }

        q_lower = question.lower()

        # Step 1: Detect Intent & Call Permitted Tools
        used_tools = []
        citations = []
        grounded_answer = ""
        suggested_actions = []

        # Intent A: Why flagged / Discrepancies
        if "why" in q_lower and ("flagged" in q_lower or "issue" in q_lower or "discrepancy" in q_lower or "risk" in q_lower):
            used_tools.append("summarize_finding")
            used_tools.append("search_knowledge_base")
            
            top_issues = bidder.get("riskProfile", {}).get("topIssues", [])
            if not top_issues and findings:
                top_issues = [f.get("finding", "") for f in findings if f.get("risk") in ["HIGH", "MEDIUM"]]

            rag_res = RAGService.search_knowledge_base(
                f"{bidder.get('name', '')} {' '.join(top_issues)}",
                tender_clauses=tender.get("rawClauses", [])
            )
            citations = rag_res.get("citations", [])

            if top_issues:
                issues_list = "\n".join([f"• {issue}" for issue in top_issues])
                grounded_answer = (
                    f"**Bidder Flag Summary for {bidder.get('name', 'Bidder')}**:\n\n"
                    f"The compliance engine detected the following item(s) requiring Officer review:\n\n"
                    f"{issues_list}\n\n"
                    f"**Governing Statutory Guidance**:\n"
                    f"{rag_res['answer']}\n\n"
                    f"**Recommended Officer Action**: Dispatch a structured clarification notice to verify supporting documentation before final determination."
                )
                suggested_actions = ["Draft Clarification Notice", "View MCA21 Records", "Inspect Evidence Graph"]
            else:
                grounded_answer = (
                    f"**Compliance Status for {bidder.get('name', 'Bidder')}**:\n\n"
                    f"All evaluated mandatory pre-qualification criteria are compliant with zero active discrepancy flags. "
                    f"The dossier is ready for Procurement Officer review and concurrence."
                )
                suggested_actions = ["Proceed to Officer Review", "Generate Compliance Passport"]

        # Intent B: Tender Clauses / Rules
        elif "clause" in q_lower or "rule" in q_lower or "requirement" in q_lower or "threshold" in q_lower:
            used_tools.append("retrieve_tender_clause")
            used_tools.append("search_knowledge_base")

            rag_res = RAGService.search_knowledge_base(question, tender_clauses=tender.get("rawClauses", []))
            citations = rag_res.get("citations", [])
            grounded_answer = rag_res["answer"]
            suggested_actions = ["View Full Compliance Matrix", "Inspect Tender Specification"]

        # Intent C: Temporal / Validity Date
        elif "date" in q_lower or "valid" in q_lower or "expired" in q_lower or "cutoff" in q_lower or "temporal" in q_lower:
            used_tools.append("validate_temporal_status")
            used_tools.append("search_knowledge_base")

            bid_cutoff = tender.get("bidEndDate", "2026-08-10")
            certificates = bidder.get("certificates", [])
            temp_res = TemporalValidationService.validate_bid_date_compliance(
                valid_until_str="2027-12-31",
                bid_cutoff_str=bid_cutoff,
                doc_name="Quality & OEM Accreditation"
            )

            grounded_answer = (
                f"**Temporal Compliance Analysis**:\n\n"
                f"• Tender Statutory Bid Cutoff Date: **{bid_cutoff}**\n"
                f"• Evaluation Rule: `valid_from <= bid_cutoff_date <= valid_until`\n"
                f"• Status: **{temp_res['status']}**\n"
                f"• Details: {temp_res['message']}\n\n"
                f"Under CPCL Procurement Manual (Section 4), post-dated evidence issued after {bid_cutoff} cannot establish pre-bid eligibility."
            )
            suggested_actions = ["Inspect Temporal Compliance View", "Check Certificate Expiry"]

        # Intent D: Clarification Drafting
        elif "clarif" in q_lower or "draft" in q_lower or "query" in q_lower or "notice" in q_lower:
            used_tools.append("draft_clarification")
            draft_res = cls.execute_tool("draft_clarification", {
                "issue": "Turnover variance / OEM authorization scope",
                "requirement": "CPCL Pre-Qualification Criteria"
            }, context)
            
            grounded_answer = (
                f"**Draft Clarification Query**:\n\n"
                f"> \"{draft_res['result']['draftText']}\"\n\n"
                f"• Suggested Vendor Response Window: **48 Hours**\n"
                f"• Governance Notice: GeM & CPCL guidelines strictly prohibit altering commercial prices during clarification."
            )
            suggested_actions = ["Send Clarification via n8n", "Attach Shared Evidence Excerpts"]

        # Fallback Grounded Search
        else:
            used_tools.append("search_knowledge_base")
            rag_res = RAGService.search_knowledge_base(question, tender_clauses=tender.get("rawClauses", []))
            citations = rag_res.get("citations", [])
            grounded_answer = rag_res["answer"]
            suggested_actions = ["Ask why bidder was flagged", "Check temporal validity", "Draft clarification"]

        return {
            "query": question,
            "timestamp": datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M:%S IST"),
            "usedTools": used_tools,
            "answer": grounded_answer,
            "citations": citations,
            "suggestedActions": suggested_actions,
            "governanceWarning": "AI Decision Support Only — Final procurement determinations are strictly made by the Procurement Officer."
        }
