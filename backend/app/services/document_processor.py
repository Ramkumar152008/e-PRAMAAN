"""
Document Processing & Extraction Engine
e-BID PRAMAAN — CPCL
Supports PDF parsing, SHA-256 checksumming, pattern NER extraction, and deterministic demo fallback.
"""

import re
import hashlib
from typing import Dict, Any, List, Optional
from pathlib import Path
import pypdf

# Regex Patterns for Indian Statutory & Procurement Identifiers
PATTERNS = {
    "GSTIN": r"\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b",
    "PAN": r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b",
    "UDYAM": r"\bUDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}\b",
    "CIN": r"\b[LUu][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}\b",
    "UDIN": r"\b[0-9]{2}[0-9]{6}[A-Z0-9]{8,10}\b",
    "TURNOVER_CR": r"(?:turnover|revenue|receipts|amount).*?(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:cr|crore|crores)",
    "LOCAL_CONTENT": r"(?:local\s+content|domestic\s+value\s+addition).*?([0-9]{1,3}(?:\.[0-9]+)?)\s*%",
    "DATE": r"\b([0-3]?[0-9][-/][0-1]?[0-9][-/][12][0-9]{3}|[12][0-9]{3}[-/][0-1]?[0-9][-/][0-3]?[0-9])\b"
}

class DocumentProcessor:
    @staticmethod
    def compute_sha256(file_bytes: bytes) -> str:
        """Computes SHA-256 hash of document bytes for tamper evidence."""
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def extract_text_from_pdf(file_path: Path) -> str:
        """Extracts text from PDF file using pypdf."""
        text = ""
        try:
            reader = pypdf.PdfReader(str(file_path))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e:
            text = f"[Text Extraction Error: {str(e)}]"
        return text

    @classmethod
    def extract_fields_from_text(cls, text: str, doc_name: str = "") -> List[Dict[str, Any]]:
        """Extracts structured fields using regex patterns."""
        fields = []

        # 1. GSTIN
        gst_match = re.search(PATTERNS["GSTIN"], text)
        if gst_match:
            fields.append({
                "fieldName": "GSTIN",
                "extractedValue": gst_match.group(0),
                "confidence": 98.5,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 2. PAN
        pan_match = re.search(PATTERNS["PAN"], text)
        if pan_match:
            fields.append({
                "fieldName": "PAN",
                "extractedValue": pan_match.group(0),
                "confidence": 99.0,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 3. Udyam
        udyam_match = re.search(PATTERNS["UDYAM"], text)
        if udyam_match:
            fields.append({
                "fieldName": "Udyam Number",
                "extractedValue": udyam_match.group(0),
                "confidence": 97.0,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 4. CIN
        cin_match = re.search(PATTERNS["CIN"], text)
        if cin_match:
            fields.append({
                "fieldName": "Corporate Identification Number (CIN)",
                "extractedValue": cin_match.group(0),
                "confidence": 96.0,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 5. UDIN
        udin_match = re.search(PATTERNS["UDIN"], text)
        if udin_match:
            fields.append({
                "fieldName": "CA UDIN Token",
                "extractedValue": udin_match.group(0),
                "confidence": 99.2,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 6. Local Content %
        local_content_match = re.search(PATTERNS["LOCAL_CONTENT"], text, re.IGNORECASE)
        if local_content_match:
            fields.append({
                "fieldName": "Local Content %",
                "extractedValue": f"{local_content_match.group(1)}%",
                "confidence": 94.0,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        # 7. Turnover
        turnover_match = re.search(PATTERNS["TURNOVER_CR"], text, re.IGNORECASE)
        if turnover_match:
            fields.append({
                "fieldName": "Average Annual Turnover",
                "extractedValue": f"₹{turnover_match.group(1)} Crore",
                "confidence": 95.0,
                "pageNumber": 1,
                "sourceDoc": doc_name
            })

        return fields

    @classmethod
    def get_demo_extracted_fields(cls, doc_type: str, bidder_name: str) -> List[Dict[str, Any]]:
        """Deterministic fallback extractor for controlled CPCL demo documents."""
        if doc_type == "GST_CERT":
            return [
                {"fieldName": "GSTIN", "extractedValue": "27AAACA1234F1Z8" if "Atlas" in bidder_name else "33AABCA1234F1Z5", "confidence": 99.0, "pageNumber": 1, "sourceDoc": "GST_Certificate.pdf"},
                {"fieldName": "Legal Entity Name", "extractedValue": bidder_name, "confidence": 98.0, "pageNumber": 1, "sourceDoc": "GST_Certificate.pdf"},
                {"fieldName": "Registration Date", "extractedValue": "12-04-2018", "confidence": 97.0, "pageNumber": 1, "sourceDoc": "GST_Certificate.pdf"},
                {"fieldName": "Taxpayer Status", "extractedValue": "Active Regular Taxpayer", "confidence": 99.5, "pageNumber": 1, "sourceDoc": "GST_Certificate.pdf"}
            ]
        elif doc_type == "PAN_CERT":
            return [
                {"fieldName": "PAN", "extractedValue": "AAACA1234F" if "Atlas" in bidder_name else "AABCA1234F", "confidence": 99.5, "pageNumber": 1, "sourceDoc": "PAN_Card.pdf"},
                {"fieldName": "Entity Name", "extractedValue": bidder_name, "confidence": 99.0, "pageNumber": 1, "sourceDoc": "PAN_Card.pdf"},
                {"fieldName": "Date of Incorporation", "extractedValue": "15-08-1960" if "Atlas" in bidder_name else "20-11-2015", "confidence": 96.0, "pageNumber": 1, "sourceDoc": "PAN_Card.pdf"}
            ]
        elif doc_type == "UDYAM":
            return [
                {"fieldName": "Udyam Number", "extractedValue": "UDYAM-MH-26-0012489" if "Atlas" in bidder_name else "UDYAM-TN-02-0019284", "confidence": 98.0, "pageNumber": 1, "sourceDoc": "Udyam_Registration.pdf"},
                {"fieldName": "Enterprise Classification", "extractedValue": "Medium Enterprise (Manufacturing)", "confidence": 97.0, "pageNumber": 1, "sourceDoc": "Udyam_Registration.pdf"},
                {"fieldName": "Major Activity", "extractedValue": "Manufacturing - Refinery Tubes & Process Machinery", "confidence": 95.0, "pageNumber": 1, "sourceDoc": "Udyam_Registration.pdf"}
            ]
        elif doc_type == "OEM_AUTH":
            return [
                {"fieldName": "OEM Authorization Status", "extractedValue": "Authorized Operating Subsidiary with Direct OEM Warranty", "confidence": 99.0, "pageNumber": 1, "sourceDoc": "OEM_Authorization_Certificate.pdf"},
                {"fieldName": "Issuing OEM Authority", "extractedValue": "Atlas Copco Airpower n.v. Belgium" if "Atlas" in bidder_name else "Approved CPCL OEM Mill", "confidence": 98.0, "pageNumber": 1, "sourceDoc": "OEM_Authorization_Certificate.pdf"},
                {"fieldName": "Authorization Token / Code", "extractedValue": "MAF-CPCL-2026-9921", "confidence": 99.5, "pageNumber": 1, "sourceDoc": "OEM_Authorization_Certificate.pdf"}
            ]
        elif doc_type in ["AUDITED_FINANCIALS", "CA_TURNOVER_CERT"]:
            return [
                {"fieldName": "Average Annual Turnover", "extractedValue": "₹84.50 Crore" if "Atlas" in bidder_name else "₹12.10 Crore", "confidence": 98.0, "pageNumber": 3, "sourceDoc": "Audited_Financial_Statements.pdf"},
                {"fieldName": "CA UDIN", "extractedValue": "2688124A9912401", "confidence": 99.0, "pageNumber": 3, "sourceDoc": "Audited_Financial_Statements.pdf"},
                {"fieldName": "Audit Year", "extractedValue": "FY 2024-25 & FY 2025-26", "confidence": 96.0, "pageNumber": 1, "sourceDoc": "Audited_Financial_Statements.pdf"}
            ]
        return [
            {"fieldName": "Document Verification", "extractedValue": "Verified Compliant", "confidence": 95.0, "pageNumber": 1, "sourceDoc": doc_name or "Document.pdf"}
        ]
